// backend/src/routes/renpy-events.js
const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");

const SHARED_TOKEN = process.env.RENPY_EVENT_TOKEN?.trim();
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.post("/event", async (req, res) => {
  try {
    // 1) Проверяем токен
    const token = req.get("X-Event-Token");
    if (!token || token !== SHARED_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const data = req.body || {};
    const playerId = (data.id || "").trim();
    const username = (data.username || "Unknown").trim();

    if (!playerId || !UUID_REGEX.test(playerId)) {
      return res.status(400).json({ error: "invalid player id" });
    }

    // 2) Находим базового User (user@center.local)
    const baseUser = await prisma.user.findUnique({
      where: { email: "user@center.local" },
    });

    if (!baseUser) {
      console.error("❌ Base user user@center.local not found");
      return res.status(500).json({ error: "base user missing" });
    }

    // 3) Ищем или создаём RealUser
    const realUser = await prisma.realUser.upsert({
      where: { password: playerId }, // пароль хранит UUID
      update: {
        username,
      },
      create: {
        username,
        password: playerId,
        email: "user@center.local",
        role: "RESEARCHER",
        user: { connect: { id: baseUser.id } },
      },
    });

    // 4) Обновляем или создаём GameProfile
    const gameProfile = await prisma.gameProfile.upsert({
      where: { playerId },
      update: {
        username,
        platform: data.platform || "unknown",
        safe_mode: !!data.safe_mode,
        total_playtime: Number(data.total_playtime || 0),

        city: data.city || null,
        country: data.country || null,

        silvair_rickroll: Boolean(data.silvair_rickroll),
        scarlett_taunts: Boolean(data.scarlett_taunts),

        kassi_named: Boolean(data.kassi_named),
        kassi_said: Boolean(data.kassi_said),
        kassi_1: Boolean(data.kassi_1),
        kassi_2: Boolean(data.kassi_2),
        kassi_3: Boolean(data.kassi_3),
        kassi_4: Boolean(data.kassi_4),

        opened_game: Boolean(data.opened_game),
        first_playthrough_done: Boolean(data.first_playthrough_done),

        system_lang: data.system_lang || null,
        ip: data.ip || req.ip,

        realUserId: realUser.id,
        userId: baseUser.id,
      },
      create: {
        playerId,
        username,
        platform: data.platform || "unknown",
        safe_mode: !!data.safe_mode,
        total_playtime: Number(data.total_playtime || 0),

        city: data.city || null,
        country: data.country || null,

        silvair_rickroll: Boolean(data.silvair_rickroll),
        scarlett_taunts: Boolean(data.scarlett_taunts),

        kassi_named: Boolean(data.kassi_named),
        kassi_said: Boolean(data.kassi_said),
        kassi_1: Boolean(data.kassi_1),
        kassi_2: Boolean(data.kassi_2),
        kassi_3: Boolean(data.kassi_3),
        kassi_4: Boolean(data.kassi_4),

        opened_game: Boolean(data.opened_game),
        first_playthrough_done: Boolean(data.first_playthrough_done),

        system_lang: data.system_lang || null,
        ip: data.ip || req.ip,

        realUserId: realUser.id,
        userId: baseUser.id,
      },
    });

    // 5) WebSocket обновление для админ-панели
    try {
      const io = req.app.get("io");

      io.to("admins").emit("playerUpdate", {
        id: gameProfile.id,
        playerId,
        realUserId: realUser.id,
        username: gameProfile.username,
        total_playtime: gameProfile.total_playtime,
        city: gameProfile.city,
        country: gameProfile.country,
        system_lang: gameProfile.system_lang,
        is_online: true,
        last_seen: new Date().toISOString(),
      });
    } catch (e) {
      console.error("WS emit failed:", e);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ renpy/event error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

module.exports = router;
