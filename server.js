const express = require('express');
const multer = require('multer');
const { Bot, InputFile } = require("grammy");
const path = require('path');

const app = express();
// שימוש בזיכרון מוגבל למניעת קריסת השרת ב-Render
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 1500 * 1024 * 1024 } // 1.5GB
});

const TELEGRAM_TOKEN = "8719998562:AAGJPhq-uf7jsiSzpECpCeig0Fp7CgUl6xE";
const MY_CHAT_ID = "7089165458";
const bot = new Bot(TELEGRAM_TOKEN);

app.use(express.json());
app.use(express.static('public'));

// דיווח על הרשמה/כניסה
app.post('/report-user', async (req, res) => {
    const { email, event } = req.body;
    try {
        await bot.api.sendMessage(MY_CHAT_ID, `💎 **Bumpit Luxury**\n👤 משתמש: ${email}\n✨ פעולה: ${event}`);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// העלאת קובץ
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const { email } = req.body;
    
    try {
        await bot.api.sendMessage(MY_CHAT_ID, `📤 **קובץ חדש התקבל**\n👤 מאת: ${email}\n📦 שם: ${req.file.originalname}`);
        await bot.api.sendDocument(MY_CHAT_ID, new InputFile(req.file.buffer, req.file.originalname));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Telegram API Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
