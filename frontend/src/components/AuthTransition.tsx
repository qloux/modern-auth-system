import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="auth-transition-container">
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames="auth-page"
          timeout={500}
          unmountOnExit
        >
          {children}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default AuthTransition;
