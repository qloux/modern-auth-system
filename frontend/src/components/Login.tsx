import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub, faVk } from '@fortawesome/free-brands-svg-icons';
import { login, loginWithSocial } from '../services/auth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'test@example.com' && password === 'password123') {
        await login(email, password);
        navigate('/dashboard');
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      await loginWithSocial(provider);
      navigate('/dashboard');
    } catch (err) {
      setError(`Ошибка входа через ${provider}`);
    }
  };

  return (
    <div className="auth-container auth-page" style={{ 
      position: 'absolute',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Montserrat, sans-serif',
      overflow: 'hidden'
    }}>
      <div className="auth-card auth-page-card" style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <LanguageSwitcher />
        
        <div className="auth-header" style={{
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
          }}>{t('auth.welcome')}</h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '400',
            letterSpacing: '0.3px'
          }}>{t('auth.loginMessage')}</p>
        </div>

        <form className="auth-form auth-page-form" onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {error && (
            <div className="error-message" style={{
              backgroundColor: 'rgba(231, 60, 126, 0.1)',
              border: '1px solid rgba(231, 60, 126, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#e73c7e',
              fontSize: '14px',
              animation: 'errorAppear 0.3s ease forwards'
            }}>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '8px' }} />
              {error}
            </div>
          )}
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

          <div className="form-group auth-page-form-group">
            <input
              type="password"
              id="password"
              className="form-input auth-page-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <FontAwesomeIcon icon={faLock} className="input-icon auth-page-input-icon" style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px'
            }} />
            <label htmlFor="password" className="form-label auth-page-form-label" style={{
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
              {t('auth.password')}
            </label>
          </div>

          <div className="remember-forgot auth-page-remember-forgot" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: '10px'
          }}>
            <label className="remember-me" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <div style={{
                position: 'relative',
                width: '20px',
                height: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <input 
                  type="checkbox"
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'white',
                  borderRadius: '2px',
                  transform: 'scale(0)',
                  transition: 'transform 0.2s ease'
                }} />
              </div>
              <span style={{ 
                transition: 'color 0.3s ease',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                letterSpacing: '0.3px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                {t('auth.rememberMe')}
              </span>
            </label>
            <Link to="/forgot-password" className="auth-link" style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none'
            }}>
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '20px',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? t('auth.loggingIn') : t('auth.login')}
            {!loading && <FontAwesomeIcon icon={faArrowRight} />}
          </button>

          <div className="social-login" style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {['Google', 'GitHub', 'VK'].map((provider) => (
              <button
                key={provider}
                onClick={() => handleSocialLogin(provider)}
                className="auth-button"
                style={{
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon 
                  icon={provider === 'Google' ? faGoogle : provider === 'GitHub' ? faGithub : faVk}
                  size="lg"
                />
              </button>
            ))}
          </div>

          <div className="auth-footer" style={{
            marginTop: '30px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <p>
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="auth-link" style={{
                color: '#4A90E2',
                textDecoration: 'none'
              }}>
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
