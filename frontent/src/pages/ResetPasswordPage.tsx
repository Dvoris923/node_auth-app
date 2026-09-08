import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const ResetPasswordPage = () => {
  const { resetToken } = useParams<{ resetToken: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Пароль має містити як мінімум 6 символів');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролі не збігаються');
      return;
    }

    if (!resetToken) {
      setError('Токен скидання відсутній');
      return;
    }

    setIsLoading(true);
    setError('');

    authService
      .confirmPasswordReset(resetToken, password)
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setError(err.response?.data?.message || 'Недійсне або застаріле посилання');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isSuccess) {
    return (
      <div className="container tab-content">
        <div className="box has-text-centered">
          <h1 className="title has-text-success">Пароль успішно змінено!</h1>
          <p className="notification is-success is-light mb-4">
            Тепер ви можете увійти до системи з новим паролем.
          </p>
          <Link to="/login" className="button is-success">
            Увійти в акаунт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container tab-content">
      <form onSubmit={handleSubmit} className="box">
        <h1 className="title">Новий пароль</h1>

        <div className="field">
          <label className="label">Новий пароль</label>
          <div className="control">
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*******"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Підтвердження пароля</label>
          <div className="control">
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="*******"
              required
            />
          </div>
        </div>

        {error && <p className="notification is-danger is-light">{error}</p>}

        <button
          type="submit"
          className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
        >
          Зберегти новий пароль
        </button>
      </form>
    </div>
  );
};