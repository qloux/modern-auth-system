import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Container, Card } from '@mui/material';
import './Components.css';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

interface NewTask {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium'
  });
  const { t } = useTranslation();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Временно используем моковые данные, пока нет бэкенда
      const mockTasks = [
        {
          id: 1,
          title: 'Пример задачи',
          description: 'Это пример задачи для демонстрации',
          dueDate: new Date().toISOString(),
          priority: 'medium' as const,
          status: 'pending' as const
        }
      ];
      setTasks(mockTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Создаем новую задачу локально
      const newTaskWithId = {
        ...newTask,
        id: tasks.length + 1,
        status: 'pending' as const
      };
      
      setTasks([...tasks, newTaskWithId]);
      setShowAddForm(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm(t('tasks.deleteConfirmation', 'Вы уверены, что хотите удалить эту задачу?'))) {
      try {
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="page-container task-list-container">
      <Container maxWidth="lg">
        <div className="task-header">
          <h2>{t('tasks.title')}</h2>
          <button 
            className="add-task-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? t('common.cancel') : t('tasks.addTask')}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddTask} className="task-form">
            <div className="form-group">
              <label>{t('tasks.taskName')}</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('tasks.description')}</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('tasks.dueDate')}</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('tasks.priority.title')}</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
              >
                <option value="low">{t('tasks.priority.low')}</option>
                <option value="medium">{t('tasks.priority.medium')}</option>
                <option value="high">{t('tasks.priority.high')}</option>
              </select>
            </div>
            <button type="submit" className="submit-button">
              {t('common.add')}
            </button>
          </form>
        )}

        {tasks.length === 0 ? (
          <p className="no-tasks">{t('tasks.noTasks', 'Нет задач')}</p>
        ) : (
          <div className="tasks-container">
            {tasks.map((task) => (
              <Card key={task.id} className={`task-card ${expandedTaskId === task.id ? 'expanded' : ''}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-badges">
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {t(`tasks.priority.${task.priority}`)}
                    </span>
                    <span className={`status-badge status-${task.status}`}>
                      {t(`tasks.status.${task.status}`)}
                    </span>
                  </div>
                </div>
                
                {expandedTaskId === task.id && (
                  <div className="task-details">
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <p className="due-date">
                        <strong>{t('tasks.dueDate')}:</strong> {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <div className="task-actions">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value as Task['status'])}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">{t('tasks.status.pending')}</option>
                          <option value="in_progress">{t('tasks.status.in_progress')}</option>
                          <option value="completed">{t('tasks.status.completed')}</option>
                        </select>
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default TaskList;
