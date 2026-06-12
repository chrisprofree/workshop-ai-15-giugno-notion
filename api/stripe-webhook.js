import Stripe from "stripe";
import { Client } from "@notionhq/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Resend + Zoom: mail di ringraziamento automatica col link al pagamento.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "Christian La Porta <info@profree.co>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "info@profree.co";
const ZOOM_JOIN_URL = process.env.ZOOM_JOIN_URL || "";
const ZOOM_PASSCODE = process.env.ZOOM_PASSCODE || "";

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

// Trova la riga Notion per pageId (client_reference_id) o, in fallback, per email.
async function findPage({ pageId, email }) {
  if (pageId) {
    try { return await notion.pages.retrieve({ page_id: pageId }); } catch { /* riga non trovata, provo per email */ }
  }
  if (!email) return null;
  const q = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "Email", email: { equals: email } },
    sorts: [{ property: "Data Registrazione", direction: "descending" }],
    page_size: 1,
  });
  return q.results[0] || null;
}

function firstName(name) {
  if (!name) return "";
  const f = String(name).trim().split(/\s+/)[0];
  if (!f || /[@\d]/.test(f)) return "";
  return f.charAt(0).toUpperCase() + f.slice(1).toLowerCase();
}

function buildThankYou(nome, modalita) {
  const mod = /presenz/i.test(modalita || "")
    ? "Ci vediamo in sala: WeDesk, Via Monte Bianco 44, Limbiate (MB). Qui sotto trovi comunque il link Zoom, se preferisci seguire in streaming o per rivederlo."
    : "Qui sotto trovi il link per collegarti su Zoom.";
  const greet = nome ? `Ciao ${nome},` : "Ciao,";
  const text = `${greet}

grazie: il tuo posto per IO NON LAVORO è confermato.

Appuntamento lunedì 15 giugno, ore 18:00. ${mod}

Link Zoom: ${ZOOM_JOIN_URL}
Passcode: ${ZOOM_PASSCODE}

Ci sarà anche la registrazione, disponibile per 30 giorni a partire da martedì mattina: se non riesci a seguire dal vivo, la recuperi con calma.

Ti mando un promemoria poco prima di iniziare. Per qualsiasi cosa, rispondi pure a questa mail.

A lunedì,
Chris`;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#111">' +
    text.trim().split(/\n\s*\n/).map((p) => "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>").join("\n") +
    "</div>";
  return { text, html };
}

async function sendThankYou({ email, nome, modalita }) {
  // Guardia: senza chiavi/link non invio (deploy sicuro anche prima di impostare le env).
  if (!RESEND_API_KEY || !email || !ZOOM_JOIN_URL) return;
  const { text, html } = buildThankYou(nome, modalita);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM, to: [email], reply_to: REPLY_TO,
      subject: "il tuo posto è confermato — IO NON LAVORO", text, html,
    }),
  });
  if (!r.ok) console.error("Resend invio fallito:", r.status, (await r.text()).slice(0, 200));
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
      if (session.payment_status === "paid") {
        const pageId = session.client_reference_id || null;
        const email = session.customer_details?.email || session.customer_email || null;
        const page = await findPage({ pageId, email });
        const already = page?.properties?.["Stato Pagamento"]?.select?.name === "Completato";

        if (page && !already) {
          // 1) segna Completato
          await notion.pages.update({
            page_id: page.id,
            properties: { "Stato Pagamento": { select: { name: "Completato" } } },
          });
          // 2) ringraziamento + link (idempotente: solo al primo passaggio a Completato)
          const nome = firstName(page.properties?.Nome?.title?.[0]?.plain_text || "");
          const modalita = page.properties?.["Modalità"]?.select?.name || "";
          const to = page.properties?.Email?.email || email;
          await sendThankYou({ email: to, nome, modalita });
        } else if (!page && email) {
          // pagamento valido ma nessuna riga trovata: mando comunque il link
          await sendThankYou({ email, nome: "", modalita: "" });
        }
      }
    }
  } catch (err) {
    console.error("Errore aggiornamento Notion/invio:", err?.body || err?.message || err);
    // 200 comunque: l'evento Stripe e' valido, non vogliamo retry infiniti
  }

  return res.status(200).json({ received: true });
}
