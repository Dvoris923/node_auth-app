import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddeleware } from '../middelewares/authMiddeleware.js';
import { catchError } from '../utils/catchError.js';

export const userRouter = new express.Router();

userRouter.get(
  '/',
  authMiddeleware,
  catchError(userController.getAllActivated),
);
userRouter.patch('/me', authMiddeleware, catchError(userController.updateName));

userRouter.patch(
  '/me/password',
  authMiddeleware,
  catchError(userController.changePassword),
);

userRouter.post(
  '/me/email-request',
  authMiddeleware,
  catchError(userController.requestEmailChange),
);

userRouter.post(
  '/me/email-confirm',
  authMiddeleware,
  catchError(userController.confirmEmailChange),
);
