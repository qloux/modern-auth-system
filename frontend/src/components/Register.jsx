import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faVk } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/auth.css';

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Здесь будет логика регистрации
        setTimeout(() => {
            setLoading(false);
            navigate('/tasks');
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Регистрация</h2>
                    <p className="auth-subtitle">Создайте свой аккаунт</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            className="form-input auth-page-form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="name" className="form-label auth-page-form-label">
                            Имя
                        </label>
                        <FontAwesomeIcon icon={faUser} className="input-icon auth-page-input-icon" />
                    </div>

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

                    <div className="form-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-input auth-page-form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="confirmPassword" className="form-label auth-page-form-label">
                            Подтвердите пароль
                        </label>
                        <FontAwesomeIcon icon={faLock} className="input-icon auth-page-input-icon" />
                    </div>

                    <div className="terms">
                        <label>
                            <input type="checkbox" required />
                            <span>Я согласен с <Link to="/terms">условиями использования</Link></span>
                        </label>
                    </div>

                    <button 
                        className={`auth-button ${loading ? 'loading' : ''}`} 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner" />
                        ) : (
                            'Зарегистрироваться'
                        )}
                    </button>
                </form>

                <div className="auth-divider">или зарегистрируйтесь через</div>

                <div className="social-buttons">
                    <button className="social-button">
                        <FontAwesomeIcon icon={faGoogle} /> Google
                    </button>
                    <button className="social-button">
                        <FontAwesomeIcon icon={faGithub} /> GitHub
                    </button>
                    <button className="social-button">
                        <FontAwesomeIcon icon={faVk} /> VK
                    </button>
                </div>

                <div className="auth-footer">
                    <p>
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="auth-link">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
