import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meService } from '../services/meService';
import { Loader } from '../components/Loader';
import { useAuth } from '../components/AuthContext';

export const EmailConfirmationPage = () => {
  const { emailToken } = useParams<{ emailToken: string }>();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!emailToken) {
      setErrorMessage('Токен підтвердження відсутній.');
      setIsLoading(false);
      return;
    }

    meService
      .confirmEmailChange(emailToken)
      .then(async () => {
        setIsSuccess(true);
        setIsLoading(false);
        try {
          await logout();
        } catch {
        }
      })
      .catch((err) => {
        setErrorMessage(
          err.response?.data?.message || 'Помилка підтвердження пошти або токен застарів.'
        );
        setIsLoading(false);
      });
  }, [emailToken, logout]);
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, navigate]);

 const handleManualLogin = async () => {
  try {
    await logout();
  } finally {
    navigate('/login');
  }
};

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container tab-content">
      <div className="box has-text-centered">
        {isSuccess ? (
          <>
            <h1 className="title has-text-success">Пошту успішно змінено!</h1>
            <p className="notification is-success is-light">
              Вашу електронну пошту оновлено. Будь ласка, увійдіть з новим Email.
            </p>
            <p className="is-size-6 mb-4">
              Автоматичний перехід на сторінку входу через <strong>{countdown}</strong> сек...
            </p>
            <button onClick={() => void handleManualLogin()} className="button is-success">
  Увійти зараз
</button>
          </>
        ) : (
          <>
            <h1 className="title has-text-danger">Помилка підтвердження</h1>
            <p className="notification is-danger is-light">{errorMessage}</p>
            <button onClick={() => navigate('/profile')} className="button is-link">
              Повернутися до профілю
            </button>
          </>
        )}
      </div>
    </div>
  );
};