// middleware/errors.js
const fs = require('fs');
const path = require('path');

function writeErrorLog(entry) {
  try {
    const p = path.join(__dirname, '..', 'error.log');
    fs.appendFileSync(p, entry);
  } catch (e) {
    console.warn('Failed to write to error.log', e);
  }
}

function notFound(_req, res) {
  res.status(404).json({ error: 'Not Found' });
}

function errorHandler(err, req, res, _next) {
  const isProd = process.env.NODE_ENV === 'production';
  const now = new Date().toISOString();
  const logEntry = `[${now}] ${req.method} ${req.originalUrl} -> ${err.stack || err.message}\n`;

  writeErrorLog(logEntry);
  console.error('[ERROR]', err);

  if (isProd) {
    // не сливаем детали в продакшн
    return res.status(err.status || 500).json({ error: 'Internal Server Error' });
  } else {
    // dev — подробный ответ (удобно для разработки)
    return res.status(err.status || 500).json({ error: err.message || 'Server Error', stack: err.stack });
  }
}

module.exports = { notFound, errorHandler };
