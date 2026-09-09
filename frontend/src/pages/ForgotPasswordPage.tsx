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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
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
          <h1 className="title has-text-success">The letter has been sent!</h1>
          <p className="notification is-success is-light mb-4">
            If an account with the email <strong>{email}</strong> exists, we have sent instructions for resetting the password.
          </p>
          <Link to="/login" className="button is-link">
            Return to the entrance
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="container tab-content">
      <form onSubmit={handleSubmit} className="box">
        <h1 className="title">Password reset</h1>

        <div className="field">
          <label className="label">Your email</label>
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
         Send an email
        </button>
      </form>
    </div>
  );
};