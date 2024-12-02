from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Создаем базу данных если её нет
def init_db():
    db_path = os.path.join(os.path.dirname(__file__), 'tasks.db')
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'pending',
            due_date TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_db():
    db_path = os.path.join(os.path.dirname(__file__), 'tasks.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tasks ORDER BY created_at DESC')
    tasks = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
        
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO tasks (title, description, priority, status, due_date)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['title'],
        data.get('description', ''),
        data.get('priority', 'medium'),
        data.get('status', 'pending'),
        data.get('due_date', None)
    ))
    
    task_id = cursor.lastrowid
    
    # Получаем созданную задачу
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = dict(cursor.fetchone())
    
    conn.commit()
    conn.close()
    
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    conn = get_db()
    cursor = conn.cursor()
    
    # Проверяем существует ли задача
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Task not found'}), 404
    
    # Обновляем задачу
    cursor.execute('''
        UPDATE tasks
        SET title = ?,
            description = ?,
            priority = ?,
            status = ?,
            due_date = ?
        WHERE id = ?
    ''', (
        data.get('title'),
        data.get('description', ''),
        data.get('priority', 'medium'),
        data.get('status', 'pending'),
        data.get('due_date'),
        task_id
    ))
    
    # Получаем обновленную задачу
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = dict(cursor.fetchone())
    
    conn.commit()
    conn.close()
    
    return jsonify(task)

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db()
    cursor = conn.cursor()
    
    # Проверяем существует ли задача
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Task not found'}), 404
    
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
