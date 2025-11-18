const fs = require("fs");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

// Имя папки из .env или uploads по умолчанию
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// Абсолютный путь
const absoluteUploadPath = path.join(__dirname, "..", "..", UPLOAD_DIR);

// Убедимся, что существует
if (!fs.existsSync(absoluteUploadPath)) {
    console.log("📁 Creating upload directory:", absoluteUploadPath);
    fs.mkdirSync(absoluteUploadPath, { recursive: true });
}

// === Multer Storage ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, absoluteUploadPath);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});

// Функция загрузки файлов
const upload = multer({ storage });

// Преобразуем путь в URL
function publicUrl(originalPath) {
    if (!originalPath) return null;
    const file = path.basename(originalPath);
    return `/${UPLOAD_DIR}/${file}`;
}

module.exports = {
    UPLOAD_DIR,
    absoluteUploadPath,
    upload,
    publicUrl
};
