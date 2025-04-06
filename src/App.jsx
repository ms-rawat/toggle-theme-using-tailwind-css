import DarkModeToggle from "./DarkToggle";

export default function App() {
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Tailwind v4 Dark Mode</h1>
      <DarkModeToggle />
    </div>
  );
}
