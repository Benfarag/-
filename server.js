const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const app = express();

app.use(express.static('./')); // تشغيل ملفات الموقع (html, css, js)
app.use(express.urlencoded({ extended: true }));

// إعدادات رفع الملفات (تخزين الصور في image والأصوات في sound)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'audio') cb(null, 'sound/');
        else cb(null, 'image/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// صفحة الرفع (الأدمن)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname,'admin.html'));
});
     

// معالجة الرفع وتحديث الـ HTML تلقائياً
app.post('/upload', upload.fields([{ name: 'image' }, { name: 'audio' }]), async (req, res) => {
    const { title, type } = req.body;

    // السطرين دول هم اللي ناقصين عندك في الصورة!
    const imagePath = 'image/' + req.files['image'][0].filename;
    const audioPath = 'sound/' + req.files['audio'][0].filename;

    const newCard = `
    <div class="playaudio">
        <div class="image-container">
            <img src="${imagePath}" alt="${title}">
            <div class="gradient-overlay">
                <p class="speaker-name">${title}</p>
            </div>
        </div>
        <audio loop controls src="${audioPath}"></audio>
    </div>`;

    // باقي كود الـ fs.readFile اللي إنت كاتبه صح في الصورة
    try {
        let html = await fs.readFile('index.html', 'utf8');
        const targetId = type === 'quran' ? 'id="quran"' : 'id="ebthal"';
        const marker = html.indexOf('class="cardsound"', html.indexOf(targetId)) + 18;
        
        const updatedHtml = html.slice(0, marker) + newCard + html.slice(marker);
        await fs.writeFile('index.html', updatedHtml);
        
        res.send('<h1>تم الرفع بنجاح!</h1><a href="/">العودة للموقع</a>');
    } catch (err) {
        res.status(500).send('خطأ في التحديث: ' + err.message);
    }
});
app.listen(3000, () => console.log('السيرفر شغال على: http://localhost:3000'));