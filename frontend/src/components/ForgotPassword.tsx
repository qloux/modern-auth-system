import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/auth.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке письма для сброса пароля');
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-page" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Montserrat, sans-serif',
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      overflow: 'hidden'
    }}>
      <div className="auth-card auth-page-card">
        <div className="auth-header auth-page-header" style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '24px',
          letterSpacing: '0.3px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '28px',
            marginBottom: '10px',
            fontWeight: '600',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.3px'
          }}>{t('auth.forgotPassword')}</h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '400',
            letterSpacing: '0.3px',
            marginBottom: '20px'
          }}>{t('auth.forgotPasswordMessage')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {error && (
            <div className="error-message" style={{
              color: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              textAlign: 'center',
              fontSize: '0.9em'
            }}>
              {error}
            </div>
          )}

          {success ? (
            <div className="success-message" style={{
              color: '#2ecc71',
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              textAlign: 'center',
              fontSize: '0.9em'
            }}>
              {t('auth.resetEmailSent')}
            </div>
          ) : (
            <div className="form-group auth-page-form-group">
              <input
                type="email"
                id="email"
                className="form-input auth-page-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                required
                style={{
                  width: '100%',
                  padding: '15px 15px 15px 45px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  fontSize: '16px',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.3px'
                }}
              />
              <FontAwesomeIcon icon={faEnvelope} className="input-icon auth-page-input-icon" style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '18px'
              }} />
              <label htmlFor="email" className="form-label auth-page-form-label" style={{
                position: 'absolute',
                left: '45px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '0.3px'
              }}>
                {t('auth.email')}
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="auth-button"
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#23a6d5',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.3px',
              opacity: loading || success ? '0.7' : '1'
            }}
          >
            {loading ? t('auth.sending') : success ? t('auth.sent') : t('auth.resetPassword')}
          </button>

          <Link
            to="/login"
            className="back-to-login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '0.9em',
              transition: 'all 0.3s ease'
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {t('auth.backToLogin')}
          </Link>
        </form>

        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default ForgotPassword;
