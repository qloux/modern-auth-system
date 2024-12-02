import React, { useState, useEffect } from 'react';
import { api } from '../api';
import '../styles/tasks.css';

export const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: ''
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const tasks = await api.getTasks();
            setTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await api.updateTask(editingTask.id, formData);
            } else {
                await api.createTask(formData);
            }
            await loadTasks();
            closeModal();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            try {
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (taskElement) {
                    taskElement.classList.add('deleting');
                    // Ждем окончания анимации перед удалением
                    setTimeout(async () => {
                        await api.deleteTask(taskId);
                        setTasks(tasks.filter(task => task.id !== taskId));
                    }, 500);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Не удалось удалить задачу');
            }
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            due_date: task.due_date ? task.due_date.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                const updatedTask = await api.updateTask(editingTask.id, formData);
                setTasks(tasks.map(task => 
                    task.id === editingTask.id ? updatedTask : task
                ));
                setIsModalOpen(false);
                setEditingTask(null);
            } else {
                const newTask = await api.createTask(formData);
                setTasks([newTask, ...tasks]);
                setIsModalOpen(false);
            }
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                due_date: ''
            });
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Не удалось сохранить задачу');
        }
    };

    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                due_date: task.due_date ? task.due_date.split('T')[0] : ''
            });
        } else {
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                due_date: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="task-list-container">
            <div className="task-header">
                <h2>Мои задачи</h2>
                <button className="add-task-button" onClick={() => openModal()}>
                    <i className="fas fa-plus"></i>
                    Добавить задачу
                </button>
            </div>

            <div className="tasks-container">
                {tasks.map(task => (
                    <div className="task-card" key={task.id} data-task-id={task.id}>
                        <div className="task-actions-overlay">
                            <button 
                                className="task-action-button edit"
                                onClick={() => handleEdit(task)}
                                title="Редактировать"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button 
                                className="task-action-button delete"
                                onClick={() => handleDelete(task.id)}
                                title="Удалить"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>

                        <div className="task-header">
                            <h3>{task.title}</h3>
                        </div>

                        <div className="task-badges">
                            <span className={`priority-badge priority-${task.priority}`}>
                                <i className="fas fa-flag"></i>
                                {task.priority}
                            </span>
                            <span className={`status-badge status-${task.status}`}>
                                <i className="fas fa-clock"></i>
                                {task.status}
                            </span>
                        </div>

                        {task.description && (
                            <div className="task-details">
                                <p className="task-description">{task.description}</p>
                            </div>
                        )}

                        {task.due_date && (
                            <div className="task-meta">
                                <span className="due-date">
                                    <i className="fas fa-calendar"></i>
                                    {new Date(task.due_date).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="no-tasks">
                        <i className="fas fa-tasks fa-2x"></i>
                        <p>У вас пока нет задач</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <>
                    <div className="modal-overlay active" onClick={closeModal}></div>
                    <div className="edit-modal active">
                        <div className="edit-modal-header">
                            <h3 className="edit-modal-title">
                                {editingTask ? 'Редактировать задачу' : 'Новая задача'}
                            </h3>
                            <button className="close-modal-button" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form className="edit-form" onSubmit={handleUpdate}>
                            <div className="edit-form-group">
                                <label htmlFor="title">Название</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="description">Описание</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="priority">Приоритет</label>
                                <select
                                    id="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                >
                                    <option value="low">Низкий</option>
                                    <option value="medium">Средний</option>
                                    <option value="high">Высокий</option>
                                </select>
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="status">Статус</label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="pending">Ожидает</option>
                                    <option value="in_progress">В процессе</option>
                                    <option value="completed">Завершено</option>
                                </select>
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="due_date">Срок выполнения</label>
                                <input
                                    type="date"
                                    id="due_date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                />
                            </div>

                            <div className="edit-form-actions">
                                <button type="button" className="edit-form-button cancel" onClick={closeModal}>
                                    Отмена
                                </button>
                                <button type="submit" className="edit-form-button save">
                                    {editingTask ? 'Сохранить' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};
