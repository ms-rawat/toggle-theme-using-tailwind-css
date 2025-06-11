import DarkModeToggle from "./DarkToggle";

export default function App() {
  return (
    <>
    <div>
         <div className="min-h-screen bg-background-primary text-text-primary transition-colors duration-300">
      <header className="p-4 flex justify-between items-center bg-background-secondary border-b border-border-default">
        <h1 className="text-2xl font-bold text-primary-brand">My Semantic App</h1>
          <DarkModeToggle />
      </header>

      <main className="p-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Welcome!</h2>
        <p className="mb-4 text-text-secondary">
          This content changes based on the day/night mode using semantic colors.
        </p>
        <div className="p-6 rounded-lg shadow-md bg-background-secondary border border-border-default">
          <p className="text-text-secondary">
            This is a card element. Its background, text, and border also adapt.
          </p>
        </div>
      </main>
    </div>
    </div>
    <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Tailwind v4 Dark Mode</h1>
      <DarkModeToggle />
    </div>
    </>
  );
}
