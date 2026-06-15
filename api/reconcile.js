import Stripe from "stripe";
import { Client } from "@notionhq/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// GET /api/reconcile — restituisce le checkout session degli ultimi 12 giorni
// con payment_status != "paid" la cui email NON è già nel DB Notion.
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    // 1. Prendi tutte le email già nel DB Notion
    const notionEmails = new Set();
    let cursor = undefined;
    do {
      const q = await notion.databases.query({
        database_id: DATABASE_ID,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      });
      for (const page of q.results) {
        const email = page.properties?.Email?.email;
        if (email) notionEmails.add(email.toLowerCase().trim());
      }
      cursor = q.next_cursor;
    } while (cursor);

    // 2. Query Stripe: checkout sessions ultimi 12 giorni
    const now = Math.floor(Date.now() / 1000);
    const twelveDaysAgo = now - 12 * 24 * 60 * 60;

    const sessions = [];
    let stripeCursor = undefined;
    do {
      const params = {
        limit: 100,
        created: { gte: twelveDaysAgo },
        ...(stripeCursor ? { starting_after: stripeCursor } : {}),
      };
      const result = await stripe.checkout.sessions.list(params);
      for (const s of result.data) {
        const email = (s.customer_details?.email || s.customer_email || "").toLowerCase().trim();
        const status = s.payment_status;
        if (status !== "paid" && email) {
          sessions.push({
            email,
            name: s.customer_details?.name || "",
            status,
            created: new Date(s.created * 1000).toISOString(),
            amount_total: s.amount_total,
          });
        }
      }
      stripeCursor = result.data.length > 0 ? result.data[result.data.length - 1].id : null;
      if (!result.has_more) stripeCursor = null;
    } while (stripeCursor);

    // 3. Filtra: togli chi è già su Notion
    const missing = sessions.filter((s) => !notionEmails.has(s.email));

    return res.status(200).json({
      ok: true,
      totalStripeUnpaid: sessions.length,
      missingFromNotion: missing.length,
      sessions: missing,
    });
  } catch (err) {
    console.error("reconcile error:", err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || "Errore" });
  }
}
