const prisma = require('../utils/prisma');


async function addView(req, res) {
    const postId = Number(req.params.id);
    const { fingerprint } = req.session || {};
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: 'Post not found' });


    await prisma.view.create({ data: { postId, sessionId: fingerprint || 'unknown' } });
    const viewsCount = await prisma.view.count({ where: { postId } });
    res.json({ ok: true, viewsCount });
}


module.exports = { addView };