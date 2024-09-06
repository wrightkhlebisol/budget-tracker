import NotificationList from './components/NotificationList'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import UserMenu from './components/UserMenu'
import ThemeToggle from './components/ThemeToggle';


function LoginForm() {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd handle actual authentication here
    login({ name: 'John Doe' });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
      <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
    </form>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      {user ? (
        <>
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold">Budget Tracker</h1>
            <div className="flex items-center space-x-4">
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
          <NotificationList />
        </>
      ) : (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <LoginForm />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
