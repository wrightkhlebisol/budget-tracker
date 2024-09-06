import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600"
    >
      {isDarkMode ? '🌞' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
