import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import './Components.css';
import '../styles/ai-suggestions.css';

const AISuggestions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="ai-suggestions-container page-container">
      <Typography variant="h1" className="ai-page-title" gutterBottom>
        {t('ИИ Рекомендации')}
        <AutoAwesomeIcon className="title-icon" />
      </Typography>
      
      <Grid container spacing={4} className="ai-grid">
        <Grid item xs={12} md={3}>
          <Card className="ai-card priority-card left-card">
            <CardContent>
              <div className="card-header">
                <AutoAwesomeIcon className="card-icon priority-icon" />
                <Typography variant="h5" className="card-title">
                  {t('Приоритетные задачи')}
                </Typography>
              </div>
              <Typography className="card-description">
                {t('Сфокусируйтесь на важных задачах')}
              </Typography>
              <div className="task-list">
                <div className="priority-task-item">
                  <Typography className="task-name">Презентация проекта</Typography>
                  <div className="priority-indicator high"></div>
                </div>
                <div className="priority-task-item">
                  <Typography className="task-name">Встреча с клиентом</Typography>
                  <div className="priority-indicator medium"></div>
                </div>
              </div>
              <Button className="card-action-button">
                {t('Показать все')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="ai-card time-card center-card">
            <CardContent>
              <div className="card-header">
                <TimerIcon className="card-icon time-icon" />
                <Typography variant="h4" className="card-title">
                  {t('Управление временем')}
                </Typography>
              </div>
              <Typography variant="h6" className="card-subtitle">
                {t('Оптимизация расписания')}
              </Typography>
              <div className="time-blocks">
                <div className="time-block morning">
                  <Typography className="block-title">Утро</Typography>
                  <div className="block-tasks">
                    <div className="block-task">
                      <Typography>Командная встреча</Typography>
                      <Typography className="task-time">9:00</Typography>
                    </div>
                    <div className="block-task">
                      <Typography>Проверка кода</Typography>
                      <Typography className="task-time">10:30</Typography>
                    </div>
                  </div>
                </div>
                <div className="time-block afternoon">
                  <Typography className="block-title">День</Typography>
                  <div className="block-tasks">
                    <div className="block-task">
                      <Typography>Планирование проекта</Typography>
                      <Typography className="task-time">14:00</Typography>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="card-action-button large">
                {t('Оптимизировать расписание')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="ai-card productivity-card right-card">
            <CardContent>
              <div className="card-header">
                <TrendingUpIcon className="card-icon productivity-icon" />
                <Typography variant="h5" className="card-title">
                  {t('Продуктивность')}
                </Typography>
              </div>
              <Typography className="card-description">
                {t('Анализ вашей продуктивности')}
              </Typography>
              <div className="productivity-stats">
                <div className="stat-item">
                  <Typography className="stat-value">85%</Typography>
                  <Typography className="stat-label">Выполнено задач</Typography>
                </div>
                <div className="stat-item">
                  <Typography className="stat-value">12</Typography>
                  <Typography className="stat-label">Задач сегодня</Typography>
                </div>
              </div>
              <Button className="card-action-button">
                {t('Статистика')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AISuggestions;
