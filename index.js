const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN      = '8650401674:AAFcRbB_v-ms_3yjq4_dm0Y1F0I7Xk1lWz4';
const APP_URL        = 'https://batchmanagerpro.netlify.app/';
const SUPPORT_EMAIL  = 'batchmanagerpro@gmail.com';
const WHATSAPP_URL   = 'https://wa.me/8801911294609';

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

// ==================== /start ====================
async function sendWelcome(chatId) {
  const text =
    '👋 <b>Welcome to BatchManager Pro!</b>\n\n' +
    'The easiest and most modern digital solution to manage your private coaching batches, student details, attendance, and fee tracking.\n\n' +
    '📱 Tap the button below to launch the Mini App 👇\n\n' +
    'Need help getting started? Type /help or /support.';

  await sendMessage(chatId, text, {
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: '📱 Open BatchManager Pro', web_app: { url: APP_URL } }
      ]]
    })
  });
}

// ==================== /help ====================
async function sendHelp(chatId) {
  const text =
    '📖 <b>BatchManager Pro — Help &amp; Guide</b>\n\n' +
    '🗂️ <b>Batch Details:</b>\n' +
    'Organize your coaching into separate batches and manage students effortlessly.\n\n' +
    '📝 <b>Student Details:</b>\n' +
    'Name · Guardian phone · College · Address\n\n' +
    '💰 <b>Billing Models:</b>\n' +
    '• <b>Monthly</b> — Fixed fee per calendar month.\n' +
    '• <b>Teacher Cycle</b> — Pay per cycle of lectures you teach. Students pay regardless of attendance.\n' +
    '• <b>Student Cycle</b> — Pay per the classes each student actually attends.\n\n' +
    '⚡ <b>Attendance:</b>\n' +
    'Mark Present / Absent in one tap.';

  await sendMessage(chatId, text, {
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: '📱 Open BatchManager Pro', web_app: { url: APP_URL } }
      ]]
    })
  });
}

// ==================== /reset (unchanged) ====================
async function sendReset(chatId) {
  const text =
    '🔄 <b>Reset data</b>\n\n' +
    'This permanently deletes all your batches, students, attendance, and payments from this Telegram account.\n\n' +
    'Tap below to confirm.';

  await sendMessage(chatId, text, {
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: '⚠️ Reset everything', web_app: { url: APP_URL + '?reset=1' } }
      ]]
    })
  });
}

// ==================== /support ====================
async function sendSupport(chatId) {
  const text =
    '🛠️ <b>BatchManager Pro — Support &amp; Assistance</b>\n\n' +
    'Facing any issues or have questions? Our support team is ready to help! You can reach out to us directly through:\n\n' +
    '📧 Email: <b>' + SUPPORT_EMAIL + '</b>\n\n' +
    'We check our messages regularly and will get back to you as soon as possible!';

  await sendMessage(chatId, text);
}

// ==================== /purchase ====================
async function sendPurchase(chatId) {
  const text =
    '🚀 <b>BatchManager Pro — Upgrade to Full Version</b>\n\n' +
    'Scale your coaching operations and unlock the ultimate management power without any restrictions!\n\n' +
    '💎 <b>Full Version Perks:</b>\n' +
    '✅ Unlimited Batches &amp; Student Profiles\n' +
    '✅ Secure Google Drive Data Sync\n' +
    '✅ Advanced Fee Tracking &amp; Data Exports\n' +
    '✅ Priority Support &amp; Multi-Teacher Management\n\n' +
    'Ready to elevate your teaching workflow? Connect with our team directly via WhatsApp for a quick and seamless upgrade:';

  await sendMessage(chatId, text, {
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: '💬 Contact Us on WhatsApp', url: WHATSAPP_URL }
      ]]
    })
  });
}

// ==================== Telegram API ====================
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
