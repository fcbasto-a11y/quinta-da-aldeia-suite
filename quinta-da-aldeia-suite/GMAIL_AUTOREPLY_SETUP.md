# Gmail Auto-Reply Setup Guide
## Quinta da Aldeia — Pedido de Orçamento

---

## What this does

When someone emails your business Gmail, they receive an instant auto-reply in Brazilian Portuguese with a link to the online quote request form. When they submit the form, you receive a notification email with all their details, and they receive a confirmation.

---

## Step 1 — Set up the Gmail auto-reply (Vacation Responder)

Gmail's built-in auto-reply (called "Vacation Responder") sends an automatic reply to every new email received. Here's how to set it up:

1. Open **Gmail** on your computer
2. Click the **gear icon ⚙️** (top right) → **See all settings**
3. Scroll down to **Vacation responder** section
4. Click **Vacation responder: On**
5. Set the fields:
   - **First day:** today's date
   - **Last day:** leave blank (so it stays on permanently)
   - **Subject:** (copy from below)
   - **Message:** (copy from below)
6. Check **"Only send a response to people in my Contacts"** — optional, but recommended to avoid auto-replying to spam
7. Click **Save Changes**

---

## Auto-reply subject line

```
Recebemos o seu contacto — Quinta da Aldeia 🌿
```

---

## Auto-reply message body

Copy and paste this into the Gmail Vacation Responder message field:

---

Olá!

Obrigado pelo seu contacto com a Quinta da Aldeia. 🌿

Para que possamos preparar uma proposta personalizada e adequada ao seu evento, pedimos que preencha o nosso formulário de pedido de orçamento através do link abaixo:

👉 https://fcbasto-a11y.github.io/quinta-da-aldeia-suite/quote-request.html

O formulário leva apenas 2 minutos e garante que tenhamos todos os detalhes necessários para lhe apresentar a melhor proposta possível.

Após o preenchimento, a nossa equipa entrará em contacto em até 48 horas.

Conheça mais sobre a Quinta da Aldeia:
📷 Instagram: https://www.instagram.com/ceremonialquintadaaldeia
🌿 Site: https://www.quintadaaldeia.com.br

Com os melhores cumprimentos,
Equipa Quinta da Aldeia

---

**Important:** Replace `fcbasto-a11y.github.io/quinta-da-aldeia-suite` with your actual Netlify URL before activating.

---

## Step 2 — Update your Netlify URL in the message

Before activating the auto-reply, replace `fcbasto-a11y.github.io/quinta-da-aldeia-suite` with your real Netlify URL in two places:
1. The auto-reply message body above
2. The `BOOKING_URL` variable at the top of `appsscript.gs`

---

## Step 3 — Update the Apps Script

In your Apps Script editor, make sure `NOTIFICATION_EMAIL` at the top of the script points to the email address where you want to receive quote notifications:

```javascript
var NOTIFICATION_EMAIL = 'quintadaaldeia@gmail.com'; // Your email
```

---

## Step 4 — Add the QuoteRequests sheet

In your Google Sheet, the `QuoteRequests` tab is created automatically the first time someone submits the form. You don't need to create it manually.

It will have these columns:
```
id | submitted_at | tipo | data_pref | data_alt | convidados | servicos | hospedes | nome | telefone | email | obs | status
```

The `status` column starts as **Novo** for each submission. You can manually update it to **Em análise**, **Orçamento enviado**, or **Fechado** to track your follow-ups.

---

## How the full flow works

```
Client emails you
        ↓
Gmail auto-reply fires instantly
Client receives message with form link
        ↓
Client fills in quote-request.html form
        ↓
Apps Script saves response to QuoteRequests sheet
Apps Script sends YOU a notification email with all details
Apps Script sends CLIENT a confirmation email
        ↓
You review the details and prepare an accurate quote
```

---

## Tip — Gmail filter (optional)

If you want to keep your inbox tidy, you can create a Gmail filter that automatically labels incoming quote-related emails:

1. In Gmail, click **Settings → Filters and Blocked Addresses → Create a new filter**
2. In the **Subject** field type: `pedido de orçamento` OR `quote request`
3. Click **Create filter** → tick **Apply label** → create a new label called `Orçamentos`
4. This keeps all quote requests organised in one place

---

## Files in this update

| File | Purpose |
|---|---|
| `quote-request.html` | The public-facing quote form (link this in your auto-reply) |
| `appsscript.gs` | Updated — handles form submissions, saves to sheet, sends notifications |
| `GMAIL_AUTOREPLY_SETUP.md` | This file — setup instructions |
