import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    authService
      .requestPasswordReset(email)
      .then(() => {
        setIsSubmitted(true);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Щось пішло не так. Спробуйте пізніше.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Якщо лист успішно "надіслано", показуємо інформаційне повідомлення
  if (isSubmitted) {
    return (
      <div className="container tab-content">
        <div className="box has-text-centered">
          <h1 className="title has-text-success">Лист надіслано!</h1>
          <p className="notification is-success is-light mb-4">
            Якщо акаунт з поштою <strong>{email}</strong> існує, ми надіслали інструкції для скидання пароля.
          </p>
          <Link to="/login" className="button is-link">
            Повернутися до входу
          </Link>
        </div>
      </div>
    );
  }

  // Основна форма введення Email
  return (
    <div className="container tab-content">
      <form onSubmit={handleSubmit} className="box">
        <h1 className="title">Скидання пароля</h1>

        <div className="field">
          <label className="label">Ваш Email</label>
          <div className="control">
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
            />
          </div>
        </div>

        {error && <p className="notification is-danger is-light">{error}</p>}

        <button
          type="submit"
          className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
        >
          Надіслати лист
        </button>
      </form>
    </div>
  );
};