import Stripe from "stripe";
import { Client } from "@notionhq/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// GET /api/reconcile — checkout sessions ultimi 12 giorni, filtra quelle non pagate e non su Notion.
// Parametro opzionale: ?all=1 mostra anche le pagate (per debug).
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const showAll = req.query?.all === "1";

    // 1. Email già nel DB Notion
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

    // 2. Stripe: checkout sessions ultimi 12 giorni
    const now = Math.floor(Date.now() / 1000);
    const twelveDaysAgo = now - 12 * 24 * 60 * 60;

    const allSessions = [];
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
        allSessions.push({
          email: email || null,
          name: s.customer_details?.name || "",
          status: s.payment_status,
          created: new Date(s.created * 1000).toISOString(),
          amount_total: s.amount_total,
          payment_link: s.payment_link,
          url: s.url,
          id: s.id,
        });
      }
      stripeCursor = result.data.length > 0 ? result.data[result.data.length - 1].id : null;
      if (!result.has_more) stripeCursor = null;
    } while (stripeCursor);

    const notPaid = allSessions.filter((s) => s.status !== "paid" && s.email);
    const missing = notPaid.filter((s) => !notionEmails.has(s.email));

    return res.status(200).json({
      ok: true,
      totalCheckoutSessions: allSessions.length,
      totalUnpaid: notPaid.length,
      missingFromNotion: missing.length,
      notionEmailCount: notionEmails.size,
      sessions: showAll ? allSessions : missing,
    });
  } catch (err) {
    console.error("reconcile error:", err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || "Errore" });
  }
}
