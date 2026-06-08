# 📦 Ads Pack — Workshop "IO NON LAVORO" (15 Giugno)

**Obiettivo**: 20 paganti in 7 giorni (8-14 giugno)
**Budget suggerito**: 350-500€ totali (50-70€/giorno)
**Prezzo biglietto**: 47€
**Break-even**: bastano 8-11 vendite per rientrare del budget ads

---

## ⚡ AZIONI IMMEDIATE (prima di tutto)

### 1. Crea il Meta Pixel (2 minuti)
- Vai su [Events Manager Meta](https://business.facebook.com/events_manager2/)
- Click su "Connect Data Sources" → "Web" → "Meta Pixel"
- Dai un nome tipo "Workshop IO NON LAVORO"
- Inserisci l'URL: `https://iononlavoro.profree.co`
- Copia il **Pixel ID** (numeri, tipo `123456789012345`)
- Sostituisci `META_PIXEL_ID` nel file `index.html` con il tuo ID (cerca "SOSTITUISCI")
- Pusha e fai redeploy

### 2. Verifica che il Pixel funzioni
- Installa [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) su Chrome
- Apri `iononlavoro.profree.co` → deve mostrare PageView verde
- Compila il form → deve mostrare Lead verde

---

## 🎯 TARGETING (Meta Ads Manager)

### Pubblico 1: Interest-based (principale)
- **Location**: Italia
- **Età**: 25-55
- **Interessi**: Imprenditoria, Automazione, Intelligenza artificiale, Freelance, Produttività, Startup, Business coaching, Digital marketing, ChatGPT
- **Esclusioni**: Chi ha già comprato (carica custom audience)
- **Budget**: 40€/giorno
- **Posizionamenti**: Feed IG + Feed FB + Reels + Stories

### Pubblico 2: Lookalike (se hai una lista)
- Carica una lista email su Meta (clienti, lead, iscritti newsletter)
- Crea Lookalike 1-3% in Italia
- **Budget**: 20€/giorno
- **Nota**: funziona solo se la lista ha almeno 100 contatti

### Pubblico 3: Retargeting (dal giorno 3)
- Retargeting su chi ha visitato la landing ma non ha comprato (ultimi 7 giorni)
- Retargeting su chi ha iniziato il checkout Stripe
- **Budget**: 10€/giorno

---

## 📝 COPY ADS (scegli 3-4 varianti, testa in parallelo)

### Variante A — Provocazione (per imprenditori)
```
😤 "Io non lavoro."

Me lo diceva mio padre. Mi sentivo in colpa.
Poi ho costruito un team di agenti AI che manda avanti 3 aziende mentre sono altrove.

Il 15 giugno ti mostro tutto. In diretta. Niente slide.

47€ — posti limitati.
👉 [Link]
```

### Variante B — Problema/Soluzione (per freelance)
```
Quante ore passi su cose che non dovresti fare tu?

Email, preventivi, follow-up, prenotazioni...

Io ho delegato tutto a degli agenti AI.
E ora ho il tempo per la palestra, mia figlia di 2 mesi, e far crescere il business.

Ti mostro come → Workshop 15 Giugno, 47€
👉 [Link]
```

### Variante C — Curiosità (per tech-savvy)
```
Ho un team. Ma non sono persone.

Ho 7 agenti AI che si parlano tra loro su Telegram.
Fanno marketing, operazioni, contenuti.
Mentre io dormo o sono in palestra.

Guarda il sistema in funzione → Workshop "IO NON LAVORO"
15 Giugno · 47€ · Posti in sala: 30
👉 [Link]
```

### Variante D — Urgenza (da usare da mercoledì 10 giugno)
```
⚠️ Mancano 5 giorni.

Il workshop "IO NON LAVORO" è quasi pieno.
47€ per vedere come gestisco 3 aziende con un team di agenti AI.

Poi il prezzo sale.
👉 [Link]
```

### Variante E — Testimonianza (se trovi qualcuno)
```
"[Nome] ha partecipato al workshop e [risultato concreto in 1 frase]"

Workshop pratico. 90 minuti. Niente teoria.
15 Giugno · 47€
👉 [Link]
```

---

## 🖼️ CREATIVE

### Formati da testare:
1. **Video 15-30 secondi**: Chris che parla alla camera, 3 secondi hook, spiega il workshop, CTA finale. (Il formato che converte di più su IG/FB)
2. **Immagine statica**: foto di Chris + titolo workshop + prezzo
3. **Carosello (3-5 slide)**: sistema in funzione, team agenti, risultato concreto

### Linee guida creative:
- Hook nei primi 3 secondi (video) / sopra la piega (immagine)
- Mostra schermate reali del sistema, non mockup
- CTA chiara: "Prenota ora" o "47€ - Posti limitati"
- NO loghi enormi, NO grafica da "corso online 2018"

---

## 📧 EMAIL BLAST (se hai una lista)

### Email 1 — Annuncio (oggi, 8 giugno)
**Oggetto**: Ti faccio vedere il mio segreto (15 Giugno)

Ciao,

non faccio webinar. Non vendo corsi "da 10K in 7 giorni".

Il 15 giugno apro il mio sistema in diretta per 90 minuti.
Ti mostro gli agenti AI che mandano avanti 3 aziende mentre io sono altrove.

È la prima volta che faccio un workshop così.
47€ perché voglio riempire la sala di persone giuste.
I prossimi costeranno di più.

👉 [Link landing]

Ci vediamo lì,
Chris

---

### Email 2 — Urgenza (11-12 giugno)
**Oggetto**: Mancano 4 giorni (e i posti stanno finendo)

Solo un heads-up.

Il workshop di domenica è quasi pieno.
Abbiamo ancora qualche posto in sala, poi solo online.

Se ti interessa vedere il sistema in diretta:
👉 [Link landing]

47€. Poi il prezzo sale.

A domenica,
Chris

---

### Email 3 — Last call (14 giugno)
**Oggetto**: Domani. Ultimi posti.

Domani ore 18:00.
Ultimi biglietti disponibili.

👉 [Link landing]

---

## 💰 BUDGET E PROIEZIONI

| Scenario | Budget ads | Vendite stimate | ROI |
|----------|-----------|----------------|-----|
| Conservativo | 350€ | 10-12 | 1.3x |
| Realistico | 500€ | 15-20 | 1.4x |
| Ottimistico | 500€ | 25-30 | 2.3x |

Costo per acquisizione stimato: 20-35€ a biglietto (Meta Ads in Italia, nicchia business/tech).

---

## 📊 COSA MISURARE

- **CPM** (costo per 1000 impression): sotto i 10€ è buono
- **CTR** (click-through rate): sopra l'1% è buono, sopra il 2% è ottimo
- **CPC** (costo per click): sotto 0.50€ è buono
- **Conversione landing**: sopra il 3% (visitatori → form) è buono
- **Conversione pagamento**: sopra il 60% (form → pagato) è buono

Dopo 48 ore di ads, guarda i numeri e:
- Se CTR < 1% → cambia creative
- Se conversione landing < 3% → migliora la landing
- Se CPC troppo alto → allarga il targeting

---

## 🔄 ALTRE AZIONI GRATUITE (in parallelo)

1. **Storie IG ogni giorno**: countdown, dietro le quinte, sneak peek del sistema
2. **Post su LinkedIn**: 1 post oggi, 1 post giovedì
3. **Gruppi Telegram/Facebook**: post in gruppi di imprenditori/freelance italiani
4. **WhatsApp broadcast**: se hai contatti diretti, messaggio personale (converte più delle ads)
5. **Amici e colleghi**: chiedi a 5 persone di condividere sui loro canali
6. **Cross-post su X (Twitter)**: thread sul workshop con link

---

## ✅ CHECKLIST FINALE

- [ ] Pixel Meta creato e ID sostituito
- [ ] Landing redeployata con Pixel + countdown
- [ ] Pixel Helper verifica PageView e Lead
- [ ] Campagne Meta create (2-3 ad set, 3-4 varianti creative)
- [ ] Budget giornaliero impostato (50-70€)
- [ ] Email blast inviata (se hai lista)
- [ ] Post IG programmati ogni giorno
- [ ] Monitoraggio conversioni attivo

---

**File aggiornati**: `index.html` (countdown, pixel, banner urgenza, tracking Lead)
**Dominio**: https://iononlavoro.profree.co
**Stripe**: https://buy.stripe.com/9B69AT6dxfzd4ph7ao9R60j
