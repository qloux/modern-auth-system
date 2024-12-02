import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faVk } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/auth.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Здесь будет логика авторизации
        setTimeout(() => {
            setLoading(false);
            navigate('/tasks');
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Добро пожаловать!</h2>
                    <p className="auth-subtitle">Войдите в свой аккаунт</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            className="form-input auth-page-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="email" className="form-label auth-page-form-label">
                            Электронная почта
                        </label>
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon auth-page-input-icon" />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            className="form-input auth-page-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="password" className="form-label auth-page-form-label">
                            Пароль
                        </label>
                        <FontAwesomeIcon icon={faLock} className="input-icon auth-page-input-icon" />
                    </div>

                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Запомнить меня</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-password">
                            Забыли пароль?
                        </Link>
                    </div>

                    <button 
                        className={`auth-button ${loading ? 'loading' : ''}`} 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner" />
                        ) : (
                            <>
                                Войти
                                <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
                            </>
                        )}
                    </button>

                    <Link to="/register" className="auth-button" style={{
                        marginTop: '15px',
                        background: 'linear-gradient(45deg, #23a6d5, #23d5ab)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        Создать аккаунт
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </form>

                <div className="auth-divider">или войдите через</div>

                <div className="social-buttons">
                    <button className="social-button">
                        <FontAwesomeIcon icon={faGoogle} /> Google
                    </button>
                    <button className="social-button">
                        <FontAwesomeIcon icon={faGithub} /> GitHub
                    </button>
                    <button className="social-button">
                        <FontAwesomeIcon icon={faVk} /> ВКонтакте
                    </button>
                </div>
            </div>
        </div>
    );
};
