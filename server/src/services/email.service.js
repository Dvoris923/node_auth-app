import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function sendEmail(email, subject, html) {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
}

function sendActivationEmail(email, token) {
  const href = `${process.env.CLIENT_HOST}/activate/${email}/${token}`;
  const html = `
    <h1>Activate account</h1>
    <a href="${href}">Click here to activate</a>
  `;

  return sendEmail(email, 'Activate account', html);
}

function sendEmailConfirmation(email, token) {
  const href = `${process.env.CLIENT_HOST}/confirm-email/${token}`;
  const html = `
    <h1>Підтвердження зміни Email</h1>
    <p>Ви запросили зміну електронної пошти. Натисніть посилання нижче для підтвердження:</p>
    <a href="${href}">Підтвердити нову пошту</a>
    <p><small>Якщо ви цього не замовляли, просто проігноруйте цей лист.</small></p>
  `;

  return sendEmail(email, 'Підтвердження зміни електронної пошти', html);
}

function sendEmailChangeNotification(email, newEmail) {
  const html = `
    <h1>Запит на зміну Email</h1>
    <p>На вашому акаунті було створено запит на зміну адреси на <strong>${newEmail}</strong>.</p>
    <p style="color: red;">Якщо ви цього НЕ робили, негайно змініть свій пароль та зверніться до підтримки.</p>
  `;

  return sendEmail(email, 'Сповіщення про безпеку: зміна Email', html);
}

function sendPasswordResetEmail(email, token) {
  const href = `${process.env.CLIENT_HOST}/reset-password/${token}`;

  const html = `
    <h1>Скидання пароля</h1>
    <p>Ви запросили скидання пароля для вашого акаунта. Натисніть посилання нижче, щоб встановити новий пароль:</p>
    <a href="${href}">Встановити новий пароль</a>
    <p><small>Якщо ви цього не замовляли, просто проігноруйте цей лист. Ваш пароль залишиться незмінним.</small></p>
  `;

  return sendEmail(email, 'Скидання пароля', html);
}

export const emailService = {
  sendActivationEmail,
  sendEmail,
  sendEmailConfirmation,
  sendEmailChangeNotification,
  sendPasswordResetEmail,
};
