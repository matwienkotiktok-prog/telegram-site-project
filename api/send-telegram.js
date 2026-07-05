export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const data = body.data || {};

    const escapeHtml = (value = '') => String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const usefulFields = Object.entries(data)
      .filter(([key, value]) => value !== undefined && value !== null && String(value).trim() !== '')
      .filter(([key]) => !key.startsWith('_wpcf7'));

    const labels = {
      age: 'Возраст',
      name: 'Имя',
      source: 'Страница',
      pageTitle: 'Заголовок страницы',
      userAgent: 'Устройство',
    };

    const lines = usefulFields.map(([key, value]) => {
      const label = labels[key] || key;
      return `<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}`;
    });

    const text = [
      '📩 <b>Новая заявка с сайта</b>',
      '',
      ...lines,
      '',
      `<b>Время:</b> ${escapeHtml(new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kyiv' }))}`,
    ].join('\n');

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const tgResult = await tgResponse.json();

    if (!tgResponse.ok || !tgResult.ok) {
      return res.status(502).json({ ok: false, error: 'Telegram API error', details: tgResult });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
