import Stripe from "stripe";
import { Client } from "@notionhq/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe richiede il body GREZZO per verificare la firma: niente parsing automatico.
export const config = { api: { bodyParser: false } };

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(typeof c === "string" ? Buffer.from(c) : c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Segna la riga Notion come "Completato".
async function markPaid({ pageId, email }) {
  // Caso normale: abbiamo il pageId passato come client_reference_id.
  if (pageId) {
    await notion.pages.update({
      page_id: pageId,
      properties: { "Stato Pagamento": { select: { name: "Completato" } } },
    });
    return;
  }

  // Fallback: nessun pageId -> cerco l'iscrizione "In attesa" piu' recente con quella email.
  if (!email) return;
  const q = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        { property: "Email", email: { equals: email } },
        { property: "Stato Pagamento", select: { equals: "In attesa" } },
      ],
    },
    sorts: [{ property: "Data Registrazione", direction: "descending" }],
    page_size: 1,
  });
  if (q.results.length > 0) {
    await notion.pages.update({
      page_id: q.results[0].id,
      properties: { "Stato Pagamento": { select: { name: "Completato" } } },
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;
  try {
    const buf = await rawBody(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(buf, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Firma webhook non valida:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // segna pagato solo se il pagamento e' effettivamente andato a buon fine
      if (session.payment_status === "paid") {
        await markPaid({
          pageId: session.client_reference_id || null,
          email: session.customer_details?.email || session.customer_email || null,
        });
      }
    }
  } catch (err) {
    console.error("Errore aggiornamento Notion:", err?.body || err?.message || err);
    // 200 comunque: l'evento Stripe e' valido, non vogliamo retry infiniti
  }

  return res.status(200).json({ received: true });
}
