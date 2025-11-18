const express = require('express');
const router = express.Router();
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.TG_ADMIN_CHAT;

router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    console.log("📩 TG update:", update);

    // отсылаем тебе в личку каждое событие
    if (update.message) {
      const text = update.message.text || '(нет текста)';
      const from = update.message.from.username || update.message.from.id;

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: `📨 Сообщение от @${from}: ${text}`
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("TG webhook error:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
