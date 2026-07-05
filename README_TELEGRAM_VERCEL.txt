Настройка отправки заявок в Telegram на Vercel

1. Добавьте бота в Telegram-группу и разрешите ему отправлять сообщения.
2. В Vercel откройте Project → Settings → Environment Variables.
3. Добавьте переменные:
   TELEGRAM_BOT_TOKEN = ваш токен бота
   TELEGRAM_CHAT_ID = ID вашей группы
4. Нажмите Redeploy проекта.
5. Откройте cabinet.html и отправьте тестовую заявку.

Важно: токен бота нельзя хранить в HTML/JS-файлах. В этом проекте он используется только через Vercel Environment Variables.
Так как токен был отправлен в чат, рекомендую после теста перевыпустить его через BotFather и заменить переменную TELEGRAM_BOT_TOKEN в Vercel.
