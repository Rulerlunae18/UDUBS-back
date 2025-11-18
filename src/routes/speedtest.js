const express = require('express');
const { Readable } = require('stream');

const router = express.Router();

function streamBytes(bytes) {
  return new Readable({
    read() {
      if (bytes <= 0) return this.push(null);
      const chunk = Buffer.alloc(Math.min(bytes, 64 * 1024)).fill(0x5A);
      bytes -= chunk.length;
      this.push(chunk);
    }
  });
}

router.get('/download', (req, res) => {
  const mb = Math.max(1, Number(req.query.sizeMb) || 5);
  const bytes = mb * 1024 * 1024;

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');

  streamBytes(bytes).pipe(res);
});

router.post('/upload', express.raw({ type: '*/*', limit: '200mb' }), (req, res) => {
  res.json({ receivedBytes: req.body.length || 0 });
});

module.exports = router;
