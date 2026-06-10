import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// POST /api/register  { name, email, mode: "live" | "online" }
// Crea una riga su Notion con "Stato Pagamento" = "In attesa".
// Restituisce { ok, pageId } — pageId viene passato a Stripe come client_reference_id.
export default async function handler(req, res) {
  // CORS (utile se il form gira su un dominio diverso dall'API)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name = "", email = "", mode = "online", ref = "Organico" } = req.body || {};

    if (!email) {
      return res.status(400).json({ ok: false, error: "Email mancante" });
    }

    const modalita = mode === "live" ? "In presenza" : "Online";
    const fonte = ref || "Organico";

    const page = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Nome: { title: [{ text: { content: name || email } }] },
        Email: { email },
        "Modalità": { select: { name: modalita } },
        "Stato Pagamento": { select: { name: "In attesa" } },
        "Data Registrazione": { date: { start: new Date().toISOString() } },
        "Fonte": { select: { name: fonte } },
      },
    });

    return res.status(200).json({ ok: true, pageId: page.id });
  } catch (err) {
    console.error("register error:", err?.body || err?.message || err);
    return res.status(500).json({ ok: false, error: "Errore salvataggio" });
  }
}
