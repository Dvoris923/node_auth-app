import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { useAuth } from '../components/AuthContext';
import { meService } from '../services/meService';

// Валідатори
function validateName(value: string) {
  if (!value.trim()) return "Ім'я обов'язкове";
  if (value.trim().length < 3) return 'Мінімум 3 символи';
}

function validateEmail(value: string) {
  if (!value) return "Email обов'язковий";
  if (!/\S+@\S+\.\S+/.test(value)) return 'Некоректний Email';
}

function validatePassword(value: string) {
  if (!value) return "Пароль обов'язковий";
  if (value.length < 6) return 'Пароль має бути від 6 символів';
}

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();

  // Повідомлення для кожного блоку
  const [nameStatus, setNameStatus] = useState<{ success?: string; error?: string }>({});
  const [passwordStatus, setPasswordStatus] = useState<{ success?: string; error?: string }>({});
  const [emailStatus, setEmailStatus] = useState<{ success?: string; error?: string }>({});

  if (!currentUser) {
    return <p className="section">Завантаження профілю...</p>;
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="title mb-5">Особистий кабінет</h1>

        <div className="box mb-5">
          <div className="columns is-vcentered">
            {/* Поточні дані */}
            <div className="column is-6">
              <div className="mb-4">
                <p className="heading">Поточне ім'я</p>
                <p className="title is-4 mb-0">{currentUser.name}</p>
              </div>

              <div>
                <p className="heading">Електронна пошта</p>
                <p className="subtitle is-6">{currentUser.email}</p>
              </div>
            </div>

            <div className="column is-1 is-hidden-mobile">
              <div style={{ borderLeft: '1px solid #dbdbdb', height: '100%' }}></div>
            </div>

            {/* 1. Зміна імені */}
            <div className="column is-5">
              <h2 className="subtitle is-5 mb-3">Змінити ім'я</h2>

              {nameStatus.success && (
                <div className="notification is-success is-light p-2 mb-3">{nameStatus.success}</div>
              )}
              {nameStatus.error && (
                <div className="notification is-danger is-light p-2 mb-3">{nameStatus.error}</div>
              )}

              <Formik
                initialValues={{ name: '' }}
                enableReinitialize
                onSubmit={({ name }, formikHelpers) => {
                  setNameStatus({});

                  meService
                    .updateName(name.trim())
                    .then((updatedUser) => {
                      if (setCurrentUser) {
                        setCurrentUser(updatedUser);
                      }

                      formikHelpers.resetForm({ values: { name: updatedUser.name } });

                      setNameStatus({
                        success: "Ім'я успішно оновлено!",
                      });
                    })
                    .catch((err) => {
                      setNameStatus({
                        error: err.response?.data?.message || "Помилка оновлення імені",
                      });
                    })
                    .finally(() => {
                      formikHelpers.setSubmitting(false);
                    });
                }}
              >
                {({ touched, errors, isSubmitting, values }) => (
                  <Form>
                    <div className="field">
                      <label className="label is-small">Нове ім'я</label>
                      <div className="control has-icons-left">
                        <Field
                          validate={validateName}
                          name="name"
                          type="text"
                          className={cn('input', { 'is-danger': touched.name && errors.name })}
                        />
                        <span className="icon is-small is-left">
                          <i className="fa-solid fa-user"></i>
                        </span>
                      </div>
                      {touched.name && errors.name && <p className="help is-danger">{errors.name}</p>}
                    </div>

                    <button
                      type="submit"
                      className={cn('button is-link is-fullwidth mt-3', { 'is-loading': isSubmitting })}
                      disabled={isSubmitting || !!errors.name || values.name.trim() === currentUser.name}
                    >
                      Зберегти ім'я
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* 2. Зміна пароля */}
        <div className="box mb-5">
          <h2 className="title is-5 mb-4">Зміна пароля</h2>

          {passwordStatus.success && (
            <div className="notification is-success is-light p-2 mb-3">{passwordStatus.success}</div>
          )}
          {passwordStatus.error && (
            <div className="notification is-danger is-light p-2 mb-3">{passwordStatus.error}</div>
          )}

          <Formik
            initialValues={{ oldPassword: '', newPassword: '', passwordConfirmation: '' }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (
                values.newPassword &&
                values.passwordConfirmation &&
                values.newPassword !== values.passwordConfirmation
              ) {
                errors.passwordConfirmation = 'Паролі не збігаються';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setPasswordStatus({});
              meService
                .changePassword(values.oldPassword, values.newPassword)
                .then(() => {
                  setPasswordStatus({ success: 'Пароль успішно змінено!' });
                  resetForm();
                })
                .catch((err) => setPasswordStatus({ error: err.response?.data?.message || 'Не вдалося змінити пароль' }))
                .finally(() => setSubmitting(false));
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form>
                <div className="columns">
                  <div className="column is-4">
                    <div className="field">
                      <label className="label is-small">Поточний пароль</label>
                      <div className="control">
                        <Field
                          validate={validatePassword}
                          name="oldPassword"
                          type="password"
                          className={cn('input', { 'is-danger': touched.oldPassword && errors.oldPassword })}
                        />
                      </div>
                      {touched.oldPassword && errors.oldPassword && (
                        <p className="help is-danger">{errors.oldPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="column is-4">
                    <div className="field">
                      <label className="label is-small">Новий пароль</label>
                      <div className="control">
                        <Field
                          validate={validatePassword}
                          name="newPassword"
                          type="password"
                          className={cn('input', { 'is-danger': touched.newPassword && errors.newPassword })}
                        />
                      </div>
                      {touched.newPassword && errors.newPassword && (
                        <p className="help is-danger">{errors.newPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="column is-4">
                    <div className="field">
                      <label className="label is-small">Підтвердження нового пароля</label>
                      <div className="control">
                        <Field
                          name="passwordConfirmation"
                          type="password"
                          className={cn('input', {
                            'is-danger': touched.passwordConfirmation && errors.passwordConfirmation,
                          })}
                        />
                      </div>
                      {touched.passwordConfirmation && errors.passwordConfirmation && (
                        <p className="help is-danger">{errors.passwordConfirmation}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={cn('button is-warning', { 'is-loading': isSubmitting })}
                  disabled={isSubmitting}
                >
                  Оновити пароль
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* 3. Зміна електронної адреси */}
        <div className="box">
          <h2 className="title is-5 mb-2">Зміна електронної пошти</h2>
          <p className="is-size-7 has-text-grey mb-4">
            Після відправки форми на нову адресу буде надіслано лист із посиланням для підтвердження, а на стару — сповіщення про факт зміни.
          </p>

          {emailStatus.success && (
            <div className="notification is-success is-light p-2 mb-3">{emailStatus.success}</div>
          )}
          {emailStatus.error && (
            <div className="notification is-danger is-light p-2 mb-3">{emailStatus.error}</div>
          )}

          <Formik
            initialValues={{ newEmail: '', password: '' }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setEmailStatus({});
              meService
                .requestEmailChange(values.newEmail, values.password)
                .then(() => {
                  setEmailStatus({
                    success: 'На нову пошту надіслано лист із підтвердженням. Перевірте скриньку!',
                  });
                  resetForm();
                })
                .catch((err) => setEmailStatus({ error: err.response?.data?.message || 'Не вдалося ініціювати зміну пошти' }))
                .finally(() => setSubmitting(false));
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form>
                <div className="columns">
                  <div className="column is-6">
                    <div className="field">
                      <label className="label is-small">Новий Email</label>
                      <div className="control">
                        <Field
                          validate={validateEmail}
                          name="newEmail"
                          type="email"
                          placeholder="new@example.com"
                          className={cn('input', { 'is-danger': touched.newEmail && errors.newEmail })}
                        />
                      </div>
                      {touched.newEmail && errors.newEmail && <p className="help is-danger">{errors.newEmail}</p>}
                    </div>
                  </div>

                  <div className="column is-6">
                    <div className="field">
                      <label className="label is-small">Поточний пароль (для підтвердження)</label>
                      <div className="control">
                        <Field
                          validate={validatePassword}
                          name="password"
                          type="password"
                          className={cn('input', { 'is-danger': touched.password && errors.password })}
                        />
                      </div>
                      {touched.password && errors.password && <p className="help is-danger">{errors.password}</p>}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={cn('button is-danger', { 'is-loading': isSubmitting })}
                  disabled={isSubmitting}
                >
                  Запросити зміну Email
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};