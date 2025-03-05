import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, X, Sun, Moon } from 'lucide-react';

// Define the Todo type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  // State for todos, new todo input, filter, and dark mode
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add a new todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  // Toggle todo completion status
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Count active todos
  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto pt-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest uppercase dark:text-white">Todo</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="text-white" size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Add todo form */}
        <form onSubmit={addTodo} className="flex items-center mb-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-4 outline-none dark:bg-gray-800 dark:text-white"
          />
          <button 
            type="submit" 
            className="p-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Add todo"
          >
            <PlusCircle size={24} />
          </button>
        </form>

        {/* Todo list */}
        {todos.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <ul>
              {filteredTodos.map((todo, index) => (
                <li 
                  key={todo.id} 
                  className={`flex items-center p-4 border-b dark:border-gray-700 ${
                    index === filteredTodos.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className={`mr-3 ${todo.completed ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
                    aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <span 
                    className={`flex-grow ${
                      todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'dark:text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete todo"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Todo footer */}
            <div className="flex justify-between items-center p-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{activeTodoCount} item{activeTodoCount !== 1 ? 's' : ''} left</span>
              
              <div className="flex space-x-1">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('active')}
                  className={`px-2 py-1 rounded ${filter === 'active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setFilter('completed')}
                  className={`px-2 py-1 rounded ${filter === 'completed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Completed
                </button>
              </div>
              
              <button 
                onClick={clearCompleted}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear completed
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No todos yet. Add one above!</p>
          </div>
        )}

        {/* Instructions card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">Drag and drop to reorder list</p>
          <p className="text-xs text-center mt-4">Created with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;