// middleware/auth.js
const fs = require('fs');
const path = require('path');

function audit(message, meta = {}) {
  try {
    const p = path.join(__dirname, '..', 'security.log');
    const line = `[${new Date().toISOString()}] ${message} ${JSON.stringify(meta)}\n`;
    fs.appendFileSync(p, line);
  } catch (e) {
    // не ломаем выполнение, если лог не доступен
    console.warn('Audit log failed', e);
  }
}

function authRequired(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  console.warn(`[AUTH] Unauthorized access attempt to ${req.originalUrl} from ${req.ip}`);
  return res.status(401).json({ error: 'Authentication required' });
}

function isAdminRole(role) {
  if (!role) return false;
  return String(role).toUpperCase() === 'ADMIN';
}

function adminOnly(req, res, next) {
  const user = req.session?.user;

  if (user && isAdminRole(user.role)) {
    return next();
  }

  // логируем попытку, но не возвращаем лишних данных клиенту
  audit('ADMIN_GUARD_BLOCK', {
    ip: req.ip,
    url: req.originalUrl,
    user: user ? { id: user.id, role: user.role } : null,
    ua: req.headers['user-agent']
  });

  console.warn(`[ADMIN-GUARD] Blocked non-admin access to ${req.originalUrl} from ${req.ip}`);
  return res.status(403).json({ error: 'Admin privileges required' });
}

async function attachUser(req, _res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
}

module.exports = { authRequired, adminOnly, attachUser };
