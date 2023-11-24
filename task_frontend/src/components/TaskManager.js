// src/components/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({ name: '', details: '' });

  useEffect(() => {
    axios.get('http://localhost:8000/task/tasks/')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  const handleCreateTask = () => {
    axios.post('http://localhost:8000/task/tasks/', newTask)
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error('Error creating task:', error));
    setNewTask({ name: '' });
  };

  const handleUpdateTask = () => {
    const updatedTaskData = { ...editTaskData };
    axios.put(`http://localhost:8000/task/tasks/${editTaskId}/`, updatedTaskData)
      .then(() => {
        setTasks(
          tasks.map((task) => {
            if (task.id === editTaskId) {
              return updatedTaskData;
            }
            return task;
          })
        );
        setEditTaskId(null);
        setEditTaskData({ name: '', details: '' });
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:8000/task/tasks/${taskId}/`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  const handleToggleEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskData({ name: task.name, details: task.details });
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTaskData({ name: '', details: '' });
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  placeholder="Task Name"
                  value={editTaskData.name}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, name: e.target.value })
                  }
                />
                <textarea
                  placeholder="Task Details"
                  value={editTaskData.details}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, details: e.target.value })
                  }
                />
                <button onClick={handleUpdateTask}>Update Task</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                {task.name}
                <button onClick={() => handleToggleEdit(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New Task Name"
        value={newTask.name || ''}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
      />
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
};

export default TaskManager;
