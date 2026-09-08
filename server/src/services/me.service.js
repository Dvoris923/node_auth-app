import { ApiError } from '../exceptions/api.error.js';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
// eslint-disable-next-line no-shadow
import crypto from 'node:crypto';
import { emailService } from './email.service.js';

async function updateName(userId, name) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('Користувача не знайдено');
  }

  user.name = name;
  await user.save();

  return user;
}

async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('Користувача не знайдено');
  }

  const isValidPassword = await bcrypt.compare(oldPassword, user.password);

  if (!isValidPassword) {
    throw ApiError.badRequest('Неправильний поточний пароль');
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw ApiError.badRequest('Новий пароль має відрізнятися від старого');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: 'Пароль успішно змінено' };
}

async function requestEmailChange(userId, newEmail, password) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('Користувача не знайдено');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Wrong password');
  }

  if (user.email === newEmail) {
    throw ApiError.badRequest('New email must be different from current email');
  }

  const existingUser = await User.findOne({ where: { email: newEmail } });

  if (existingUser) {
    throw ApiError.badRequest('Email is already taken');
  }

  const emailToken = crypto.randomBytes(32).toString('hex');

  user.pendingEmail = newEmail;
  user.emailToken = emailToken;
  await user.save();

  await emailService.sendEmailConfirmation(newEmail, emailToken);
  await emailService.sendEmailChangeNotification(user.email, newEmail);
}

async function confirmEmailChange(emailToken) {
  const user = await User.findOne({ where: { emailToken } });

  if (!user || !user.pendingEmail) {
    throw ApiError.badRequest('Invalid or expired activation link');
  }

  user.email = user.pendingEmail;
  user.pendingEmail = null;
  user.emailToken = null;

  await user.save();

  return user;
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetToken = resetToken;

  await user.save();

  await emailService.sendPasswordResetEmail(email, resetToken);
}

async function resetPassword(token, password) {
  const user = await User.findOne({ where: { resetToken: token } });

  if (!user || !user.resetToken) {
    throw ApiError.badRequest('Invalid or expired reset link');
  }

  user.password = await bcrypt.hash(password, 10);

  user.resetToken = null;

  await user.save();
}

export const meService = {
  updateName,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
  requestPasswordReset,
  resetPassword,
};
