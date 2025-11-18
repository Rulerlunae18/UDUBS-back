const prisma = require('../utils/prisma');
const { publicUrl } = require('../services/storage');

async function listDocs(_req, res) {
    const docs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(docs);
}

async function getDoc(req, res) {
    const id = Number(req.params.id);
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
}

async function createDoc(req, res) {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    if (!req.file) return res.status(400).json({ error: 'file required' });

    const fileUrl = publicUrl(req.file.path);
    const created = await prisma.document.create({
        data: { title, description: description || null, fileUrl }
    });
    res.status(201).json(created);
}

async function deleteDoc(req, res) {
    const id = Number(req.params.id);
    await prisma.document.delete({ where: { id } });
    res.json({ message: 'Deleted' });
}

module.exports = { listDocs, getDoc, createDoc, deleteDoc };
