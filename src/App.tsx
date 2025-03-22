import { useState } from 'react'
import { Login } from './components/Login'
import { TodoList } from './components/TodoList'
import { ThemeToggle } from './components/ThemeToggle'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Simple validation
    if (username && password) {
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <TodoList />
      )}
    </div>
  )
}

export default App
