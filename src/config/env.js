require('dotenv').config();

let frontend = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
let backend  = process.env.BACKEND_URL      || 'http://localhost:3000';

// если нужно — убираем завершающий / и из фронта и из бэка
frontend = frontend.replace(/\/$/, "");
backend  = backend.replace(/\/$/, "");

// простая функция: backendUrl('/api/...') → "http://ip:3000/api/..."
const backendUrl = (path = "") => backend + path;

module.exports = {
    backend,
    frontend,
    backendUrl
};
