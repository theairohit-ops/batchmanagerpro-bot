const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN      = '8650401674:AAFcRbB_v-ms_3yjq4_dm0Y1F0I7Xk1lWz4';
const APP_URL        = 'https://batchmanagerpro.netlify.app/';
const SUPPORT_EMAIL  = 'batchmanagerpro@gmail.com';

app.get('/', (req, res) => res.send('BatchManager Pro bot is running.'));

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try { await handleUpdate(req.body); } catch (e) { console.error('Update error:', e.message); }
});

async function handleUpdate(update) {
  const message = update.message || update.edited_message;
  if (!message) return;
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  const command = text.split(' ')[0].split('@')[0].toLowerCase();
  console.log('Command:', command, 'from', chatId);
  switch (command) {
    case '/start':    await sendWelcome(chatId);  break;
    case '/help':     await sendHelp(chatId);     break;
    case '/reset':    await sendReset(chatId);    break;
    case '/support':  await sendSupport(chatId);  break;
    case '/purchase': await sendPurchase(chatId); break;
  }
}

async function sendWelcome(chatId) {
  const text = '👋 <b>Welcome to BatchManager Pro</b>\n\n' +
    'Manage your coaching center right here in Telegram.\n\n' +
    '✅ Mark attendance, track payments, see who owes\n' +
    '✅ Free to use — no signup, no setup\n\n' +
    'Tap below to open the app 👇';
  await sendMessage(chatId, text, {
    reply_markup: JSON.stringify({ inline_keyboard: [[
      { text: '📱 Open BatchManager Pro', web_app: { url: APP_URL } }
    ]]})
  });
}

async function sendHelp(chatId) {
  const text = '📖 <b>How BatchManager Pro works</b>\n\n' +
    '<b>1. Batches</b>\nA batch is a group of students you teach together.\n\n' +
    '<b>2. Billing models</b>\n' +
    '• <b>Monthly</b> — fixed fee per calendar month, due by a deadline day.\n' +
    '• <b>Teacher-Cycle</b> — mark "Class Held" each day; after a fixed number of classes, students owe the fee.\n' +
    '• <b>Student-Cycle</b> — each student billed by their own attendance.\n\n' +
    '<b>3. Attendance</b>\nOpen a batch → tap "Class Held" for a day → mark present students.\n\n' +
    '<b>4. Payments</b>\nDue Payments → tap a batch → enter the amount next to a student.\n\n' +
    'Still stuck? Use /support.';
  await sendMessage(chatId, text);
}

async function sendReset(chatId) {
  const text = '🔄 <b>Reset data</b>\n\n' +
    'This permanently deletes all your batches, students, attendance, and payments from this Telegram account.\n\n' +
    'Tap below to confirm.';
  await sendMessage(chatId, text, {
    reply_markup: JSON.stringify({ inline_keyboard: [[
      { text: '⚠️ Reset everything', web_app: { url: APP_URL + '?reset=1' } }
    ]]})
  });
}

async function sendSupport(chatId) {
  await sendMessage(chatId,
    '💬 <b>BatchManager Pro Support</b>\n\n' +
    'Need help? Email us:\n\n📧 ' + SUPPORT_EMAIL + '\n\nWe usually reply within a few hours.');
}

async function sendPurchase(chatId) {
  await sendMessage(chatId,
    '💳 <b>Upgrade to BatchManager Pro</b>\n\n' +
    'The free version is a taste of the full power. Upgrade to get:\n\n' +
    '• Unlimited batches and students\n• Google Drive sync\n' +
    '• Export to PDF / Excel\n• Multi-teacher support\n• Priority support\n\n' +
    '👉 <b>Coming soon.</b> Email ' + SUPPORT_EMAIL + ' for early access.');
}

async function sendMessage(chatId, text, extra = {}) {
  const body = { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra };
  const res = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) console.error('Telegram error:', await res.text());
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Bot listening on port ' + PORT));
