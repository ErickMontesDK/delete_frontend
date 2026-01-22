import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  // IMPORTANTE: Cambia esta URL cuando despliegues en Railway
  const API_URL = 'https://deletebackend-production.up.railway.app/api';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      const data = await response.json();
      setTasks(tasks.map(task => task.id === id ? data : task));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}/`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Railway Demo 🚂
            </h1>
            <div className="text-sm text-gray-500">
              Simple Task App
            </div>
          </div>

          <div className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Agregar nueva tarea..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
              <button
                onClick={addTask}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Plus size={20} />
                Agregar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No hay tareas todavía</p>
                <p className="text-sm mt-2">¡Agrega tu primera tarea!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="flex-shrink-0 text-purple-600 hover:text-purple-700"
                  >
                    {task.completed ? (
                      <CheckCircle size={24} className="fill-current" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  <span
                    className={`flex-1 text-lg ${task.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                      }`}
                  >
                    {task.title}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <p>📝 Total: {tasks.length} tareas</p>
              <p>✅ Completadas: {tasks.filter(t => t.completed).length}</p>
              <p>⏳ Pendientes: {tasks.filter(t => !t.completed).length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">🚀 Para desplegar en Railway:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Cambia API_URL a tu URL de Railway del backend</li>
            <li>Sube este código a GitHub</li>
            <li>Conecta el repo en Railway</li>
            <li>Railway detectará React automáticamente</li>
          </ol>
        </div>
      </div>
    </div>
  );
}