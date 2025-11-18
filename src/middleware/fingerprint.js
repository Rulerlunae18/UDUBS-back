// middleware/fingerprint.js
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 🔹 Хэширование строки для проверки изменений UA/IP
 */
function hashString(s) {
  return crypto.createHash('sha256').update(String(s || '')).digest('hex');
}

/**
 * 🔹 Безопасное логирование событий в security.log
 */
function logSecurityEvent(type, meta = {}) {
  try {
    const logPath = path.join(__dirname, '..', 'security.log');
    const entry = `[${new Date().toISOString()}] [${type}] ${JSON.stringify(meta)}\n`;
    fs.appendFileSync(logPath, entry);
  } catch (err) {
    console.warn('Security log write failed:', err);
  }
}

/**
 * 🧬 Middleware: защита сессии по отпечатку
 */
function ensureSessionFingerprint(req, res, next) {
  if (!req.session) return next();

  // 1️⃣ создаём уникальный отпечаток сессии
  if (!req.session.fingerprint) {
    req.session.fingerprint = {
      id: uuidv4(),
      createdAt: Date.now(),
    };
  }

  try {
    const ua = req.headers['user-agent'] || '';
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      'unknown';

    const nowHash = hashString(`${ua}|${ip}`);

    // 2️⃣ если ещё нет контрольного хэша — создаём
    if (!req.session._uaHash) {
      req.session._uaHash = nowHash;
      return next();
    }

    // 3️⃣ если UA/IP изменились — сбрасываем сессию и логируем
    if (req.session._uaHash !== nowHash) {
      logSecurityEvent('SESSION_TAMPER_DETECTED', {
        ip,
        ua,
        originalFingerprint: req.session.fingerprint.id,
        time: new Date().toISOString(),
      });

      console.warn('🚨 Session fingerprint mismatch detected, terminating session.');

      // сбрасываем сессию (разлогин)
      req.session = null;

      return res.status(440).json({
        error: 'Session invalidated due to environment change',
        code: 'FINGERPRINT_MISMATCH',
      });
    }
  } catch (err) {
    console.warn('Fingerprint check error:', err);
  }

  next();
}

module.exports = { ensureSessionFingerprint };
