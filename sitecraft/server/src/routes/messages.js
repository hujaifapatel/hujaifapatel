import { Router } from 'express';
import mongoose from 'mongoose';
import Site from '../models/Site.js';
import Message from '../models/Message.js';
import { str, EMAIL_RX, siteForOwner } from './sites.js';

// Contact form messages of a website.
// Mounted at /api/sites/:id/messages (mergeParams gives access to :id)
const router = Router({ mergeParams: true });


const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Simple page shown after a form POST from a downloaded (static) website
function resultPage(res, status, title, text) {
  const back = res.req.get('referer');
  res.status(status).type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a}div{max-width:420px;padding:40px;text-align:center;background:#fff;border-radius:20px;box-shadow:0 10px 30px #0f172a14}a{display:inline-block;margin-top:20px;padding:10px 22px;border-radius:999px;background:#0f172a;color:#fff;text-decoration:none}</style></head>
<body><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p>${back ? `<a href="${escapeHtml(back)}">Go back</a>` : ''}</div></body></html>`);
}

// POST /api/sites/:id/messages -> a visitor sends a message from the Contact page (public)
// Accepts JSON (live website) or a normal HTML form post (downloaded website).
router.post('/', async (req, res, next) => {
  const isForm = req.is('application/x-www-form-urlencoded');
  const fail = (status, message) =>
    isForm ? resultPage(res, status, 'Message not sent', message) : res.status(status).json({ message });
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !(await Site.exists({ _id: req.params.id }))) {
      return fail(404, 'Website not found');
    }
    const b = req.body || {};
    if (b.company) return isForm ? resultPage(res, 200, 'Thank you!', 'Your message has been sent.') : res.status(201).json({ ok: true }); // honeypot (bots)

    const msg = {
      name: str(b.name, 80),
      phone: str(b.phone, 30),
      email: str(b.email, 120).toLowerCase(),
      message: str(b.message, 2000),
    };
    if (!msg.name) return fail(400, 'Please enter your name');
    if (!msg.message) return fail(400, 'Please write a message');
    if (!msg.phone && !msg.email) return fail(400, 'Please enter your phone number or email so we can reply');
    if (msg.email && !EMAIL_RX.test(msg.email)) return fail(400, 'Please enter a valid email');

    const saved = await Message.create({ site: req.params.id, ...msg });
    return isForm
      ? resultPage(res, 201, 'Thank you!', 'Your message has been sent. We will get back to you soon.')
      : res.status(201).json({
          ok: true,
          message: 'Your message has been sent',
          data: { _id: saved._id, site: saved.site, name: saved.name, createdAt: saved.createdAt },
        });
  } catch (err) {
    next(err);
  }
});

// GET /api/sites/:id/messages -> the owner reads messages (header: x-edit-key)
router.get('/', async (req, res, next) => {
  try {
    const site = await siteForOwner(req, res);
    if (!site) return;
    const messages = await Message.find({ site: site._id }).sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/sites/:id/messages/:messageId -> mark as read / unread
router.patch('/:messageId', async (req, res, next) => {
  try {
    const site = await siteForOwner(req, res);
    if (!site) return;
    if (!mongoose.isValidObjectId(req.params.messageId)) return res.status(404).json({ message: 'Message not found' });
    const msg = await Message.findOneAndUpdate(
      { _id: req.params.messageId, site: site._id },
      { read: Boolean(req.body?.read) },
      { new: true }
    ).lean();
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/sites/:id/messages/:messageId
router.delete('/:messageId', async (req, res, next) => {
  try {
    const site = await siteForOwner(req, res);
    if (!site) return;
    if (!mongoose.isValidObjectId(req.params.messageId)) return res.status(404).json({ message: 'Message not found' });
    await Message.deleteOne({ _id: req.params.messageId, site: site._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
