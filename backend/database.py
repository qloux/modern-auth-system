import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Optional

class Database:
    def __init__(self, db_path: str = "tasks.db"):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    priority TEXT NOT NULL,
                    status TEXT NOT NULL,
                    due_date TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            conn.commit()

    def create_task(self, task_data: Dict[str, Any]) -> int:
        current_time = datetime.now().isoformat()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                task_data['title'],
                task_data.get('description', ''),
                task_data['priority'],
                task_data.get('status', 'pending'),
                task_data.get('due_date', ''),
                current_time,
                current_time
            ))
            conn.commit()
            return cursor.lastrowid

    def get_all_tasks(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
            tasks = []
            for row in cursor.fetchall():
                tasks.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'priority': row[3],
                    'status': row[4],
                    'due_date': row[5],
                    'created_at': row[6],
                    'updated_at': row[7]
                })
            return tasks

    def get_task(self, task_id: int) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
            row = cursor.fetchone()
            if row:
                return {
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'priority': row[3],
                    'status': row[4],
                    'due_date': row[5],
                    'created_at': row[6],
                    'updated_at': row[7]
                }
            return None

    def update_task(self, task_id: int, task_data: Dict[str, Any]) -> bool:
        current_time = datetime.now().isoformat()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE tasks 
                SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, updated_at = ?
                WHERE id = ?
            """, (
                task_data['title'],
                task_data.get('description', ''),
                task_data['priority'],
                task_data.get('status', 'pending'),
                task_data.get('due_date', ''),
                current_time,
                task_id
            ))
            conn.commit()
            return cursor.rowcount > 0

    def delete_task(self, task_id: int) -> bool:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            conn.commit()
            return cursor.rowcount > 0
