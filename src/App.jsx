import { useState } from 'react';
import NotificationList from './components/NotificationList';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import UserMenu from './components/UserMenu';
import ThemeToggle from './components/ThemeToggle';
import LoginForm from './components/LoginForm';
import Register from './components/RegisterFrom';
import ErrorBoundary from './components/ErrorBoundary';

function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <Register onToggleForm={toggleForm} />
      )}
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        {user ? (
          <>
            <header className="bg-white dark:bg-gray-800 shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Budget Tracker</h1>
                  <div className="flex items-center space-x-4">
                    <UserMenu />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <NotificationList />
            </main>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <AuthForms />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
