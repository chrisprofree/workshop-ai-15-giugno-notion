# Setup deploy — Vercel + Notion + Stripe

Landing statica (`index.html` / `thanks.html`) + due serverless function in `api/`.
Nessun build step: Vercel serve l'HTML statico e compila da solo le function in `api/`.

## Flusso

1. Form → `POST /api/register` → crea riga su Notion con **Stato Pagamento = "In attesa"**, ritorna `pageId`
2. Redirect a Stripe Payment Link con `client_reference_id = pageId` (+ email precompilata)
3. Pagamento OK → Stripe chiama `POST /api/stripe-webhook` → la riga diventa **"Completato"**

Chi non paga resta "In attesa". Le chiavi stanno solo nelle Environment Variables di Vercel.

## 1. Push su GitHub

```bash
git add .
git commit -m "Vercel: form->Notion + Stripe webhook"
git push
```

## 2. Importa il progetto su Vercel

- vercel.com → Add New → Project → importa la repo `workshop-ai-15-giugno-notion`
- Framework Preset: **Other** (è statico, nessun build)
- Deploy

## 3. Environment Variables (Vercel → Settings → Environment Variables)

| Nome | Valore |
|---|---|
| `NOTION_TOKEN` | token integrazione Notion (`ntn_...`) |
| `NOTION_DATABASE_ID` | `37337aed983381479efdf5a01a29058f` |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (vedi punto 5) |

Dopo averle aggiunte → **Redeploy**.

## 4. Condividi il DB Notion con l'integrazione

Notion → DB "📲 Registrazioni Workshop" → `•••` → Connections → aggiungi la tua integrazione,
altrimenti l'API non può scrivere.

## 5. Crea il webhook su Stripe

- Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://IL-TUO-DOMINIO/api/stripe-webhook`
- Evento: **`checkout.session.completed`**
- Copia il **Signing secret** (`whsec_...`) in `STRIPE_WEBHOOK_SECRET` su Vercel → Redeploy

## 6. Dominio

Il dominio custom va spostato da GitHub Pages a Vercel:
Vercel → Settings → Domains → aggiungi il dominio e ripunta il DNS come indicato da Vercel.
(Il file `CNAME` in repo serviva a GitHub Pages: su Vercel è ininfluente.)

## Test

Usa le chiavi `sk_test_...` e una carta di test Stripe (`4242 4242 4242 4242`):
iscriviti → paga → verifica che la riga su Notion passi da "In attesa" a "Completato".
