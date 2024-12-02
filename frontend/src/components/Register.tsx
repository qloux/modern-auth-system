import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faVk } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faUser, faArrowRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/auth.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();

  const validateForm = () => {
    if (!name || name.length < 2) {
      throw new Error('Имя должно содержать минимум 2 символа');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Введите корректный email адрес');
    }
    if (!password || password.length < 6) {
      throw new Error('Пароль должен содержать минимум 6 символов');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      validateForm();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Регистрация через ${provider}`);
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
          }}>{t('auth.createAccount')}</h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.3px'
          }}>{t('auth.registerMessage')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '0.3px'
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
              animation: 'errorAppear 0.3s ease forwards',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.3px'
            }}>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '8px' }} />
              {error}
            </div>
          )}

          <div className="form-group auth-page-form-group">
            <input
              type="text"
              id="name"
              className="form-input auth-page-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <FontAwesomeIcon icon={faUser} className="input-icon auth-page-input-icon" style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px'
            }} />
            <label htmlFor="name" className="form-label auth-page-form-label" style={{
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
              {t('auth.yourName')}
            </label>
          </div>

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

          <div className="remember-forgot" style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.3px'
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
                {t('auth.agreeTo')} <Link to="/terms" style={{ 
                  color: '#23a6d5', 
                  textDecoration: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.3px'
                }}>{t('auth.termsOfService')}</Link>
              </span>
            </label>
          </div>

          <button 
            className={`auth-button ${loading ? 'loading' : ''}`}
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(45deg, #e73c7e, #23a6d5)',
              color: 'white',
              padding: '15px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.3px'
            }}
          >
            {loading ? (
              <div className="loading-spinner" style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                borderTopColor: 'white',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <>
                {t('auth.register')}
                <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
              </>
            )}
          </button>

          <Link 
            to="/login" 
            className="auth-link" 
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: '15px',
              transition: 'color 0.3s ease',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.3px'
            }}
          >
            {t('auth.alreadyHaveAccount')} {t('auth.login')}
          </Link>
        </form>

        <div className="auth-divider" style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: '20px 0',
          position: 'relative',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '14px',
          letterSpacing: '0.3px'
        }}>{t('auth.orRegisterWith')}</div>

        <div className="social-buttons" style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px'
        }}>
          {['Google', 'GitHub', 'VK'].map((provider) => (
            <button
              key={provider}
              className="social-auth-button"
              onClick={() => handleSocialRegister(provider)}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}
            >
              <FontAwesomeIcon icon={
                provider === 'Google' ? faGoogle :
                provider === 'GitHub' ? faGithub :
                faVk
              } />
              {provider}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
