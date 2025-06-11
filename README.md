Day/Night Mode with Semantic Colors in Vite + React using Tailwind CSS v4This guide outlines a robust and maintainable approach to implementing a day/night (light/dark) mode feature in your React application, leveraging the modern CSS-first configuration of Tailwind CSS v4 and React's Context API for state management.Table of ContentsIntroductionKey TechnologiesCore ConceptsImplementation Steps1. Project Setup2. CSS Configuration for Tailwind v43. React Theme Context4. React Theme Toggle Component5. Integrate into ApplicationHow to Use Semantic ColorsBenefits of this ApproachInstallation and RunningIntroductionModern web applications often include a day/night mode for improved user experience and accessibility. This implementation provides a seamless transition between light and dark themes, allows for easy customization using semantic color names (e.g., bg-background-primary instead of bg-white dark:bg-gray-900), and persists the user's preference using localStorage. It is specifically tailored for Tailwind CSS v4, which introduces a new CSS-first configuration paradigm.Key TechnologiesVite: A fast build tool for modern web projects.React: A JavaScript library for building user interfaces.Tailwind CSS v4: A utility-first CSS framework with a powerful new CSS-based configuration.Core ConceptsBefore diving into the code, it's essential to understand the underlying principles:Tailwind CSS v4's CSS-First Configuration: Unlike previous versions that heavily relied on tailwind.config.js, v4 moves most configuration directly into your main CSS file using directives like @custom-variant and @theme.@custom-variant dark (&:where(.dark, .dark *));: This directive tells Tailwind that any utility class prefixed with dark: (e.g., dark:text-white) should be applied when the .dark class is present on the <html> element or any of its ancestors.@theme: This powerful directive allows you to define custom design tokens (like colors, spacing, fonts) directly in your CSS. Tailwind will automatically generate utility classes for these tokens.CSS Variables (Custom Properties): We define our semantic colors as CSS variables (e.g., --color-background-primary). These variables are then given different values under the :root (light mode) and .dark (dark mode) CSS selectors. This allows for dynamic color changes based on the <html> element's class.React Context API: This allows us to manage the global theme state (light or dark) and provide a toggleTheme function to any component in the application without prop drilling.localStorage: User theme preferences are stored in localStorage to ensure the selected theme persists across browser sessions.window.matchMedia: The initial theme is set based on the user's system preference if no theme is found in localStorage.Implementation Steps1. Project SetupEnsure you have a Vite + React project with Tailwind CSS v4 installed. If you're starting fresh, you can use:npm create vite@latest my-day-night-app -- --template react-ts # or react for JavaScript
cd my-day-night-app
npm install
npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer
Configure your postcss.config.js:// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
And your vite.config.js:// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
2. CSS Configuration for Tailwind v4This is the core of your theme definition. In your main CSS file (e.g., src/index.css or src/app.css), define your semantic color variables and tell Tailwind to generate utility classes from them using the @theme directive./* src/index.css */
@import "tailwindcss";

/*
  @custom-variant: This directive tells Tailwind that any utility class prefixed with 'dark:'
  should be applied when the '.dark' class is present on the <html> element or any of its ancestors.
  This is crucial for the manual theme toggling.
*/
@custom-variant dark (&:where(.dark, .dark *));

/*
  :root pseudo-class targets the <html> element and defines CSS variables for the light theme.
  These are your default semantic colors.
*/
:root {
  --color-background-primary: #ffffff; /* White background for light mode */
  --color-text-primary: #1a202c;     /* Dark text for light mode (Gray 900) */
  --color-background-secondary: #f7fafc; /* Lighter background for secondary elements (Gray 50) */
  --color-text-secondary: #4a5568;     /* Slightly lighter text (Gray 700) */
  --color-border-default: #e2e8f0;     /* Default border color (Gray 200) */
  --color-primary-brand: #4299e1;      /* A vibrant primary brand color (Blue 500) */
}

/*
  .dark class: When the 'dark' class is added to the <html> element (by our React logic),
  these CSS variable overrides will take effect, defining your dark theme.
*/
.dark {
  --color-background-primary: #1a202c; /* Dark background for dark mode (Gray 900) */
  --color-text-primary: #ffffff;     /* White text for dark mode */
  --color-background-secondary: #2d3748; /* Darker background for secondary elements (Gray 800) */
  --color-text-secondary: #cbd5e0;     /* Lighter text (Gray 400) */
  --color-border-default: #4a5568;     /* Darker border (Gray 700) */
  --color-primary-brand: #63b3ed;      /* A lighter primary brand color (Blue 300) */
}

/*
  @theme directive: This is where you tell Tailwind v4 to generate utility classes
  (like bg-background-primary, text-text-primary) from your defined CSS variables.
  The naming convention `--color-*` is important for Tailwind to pick them up as colors.
*/
@theme {
  --color-background-primary: var(--color-background-primary);
  --color-text-primary: var(--color-text-primary);
  --color-background-secondary: var(--color-background-secondary);
  --color-text-secondary: var(--color-text-secondary);
  --color-border-default: var(--color-border-default);
  --color-primary-brand: var(--color-primary-brand);

  /* You can define other theme properties here as well.
     For example, to define a custom font:
     --font-heading: "Roboto", sans-serif;
     This would allow you to use `font-heading` as a utility class.
  */
}
3. React Theme ContextThis component will manage the theme state, persist it, and provide the theme and toggle function to other components.Create src/context/ThemeContext.jsx (or .tsx):// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a React Context for the theme
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme state:
  // 1. Check localStorage for a saved preference.
  // 2. If not found, check the user's system preference using window.matchMedia.
  // 3. Default to 'light' if none of the above are available (e.g., during SSR).
  const [theme, setTheme] = useState(() => {
    // Check if window is defined to avoid issues during server-side rendering
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme; // Use saved theme if available
      }
      // Otherwise, detect system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default for SSR
  });

  // useEffect to update the <html> element's class and localStorage
  // whenever the 'theme' state changes.
  useEffect(() => {
    const html = document.documentElement; // Get the root <html> element
    if (theme === 'dark') {
      html.classList.add('dark');      // Add 'dark' class for dark mode
      localStorage.setItem('theme', 'dark'); // Save preference
    } else {
      html.classList.remove('dark');   // Remove 'dark' class for light mode
      localStorage.setItem('theme', 'light'); // Save preference
    }
  }, [theme]); // Dependency array: runs when 'theme' changes

  // Function to toggle the theme between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Provide the current theme and the toggle function to children components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily consume the theme context in any component
export const useTheme = () => useContext(ThemeContext);
4. React Theme Toggle ComponentThis component will provide a button to switch between day and night mode.Create src/components/ThemeToggle.jsx (or .tsx):// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import our custom theme hook

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // Get current theme and toggle function from context

  return (
    <button
      onClick={toggleTheme} // Attach the toggle function to button click
      className="p-2 rounded-full
                 bg-background-secondary text-text-secondary
                 hover:bg-primary-brand hover:text-white
                 transition-colors duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-primary-brand focus:ring-opacity-50"
    >
      {/* Display different text/icon based on the current theme */}
      {theme === 'light' ? (
        <>
          <span role="img" aria-label="Dark Mode">🌙</span> Dark Mode
        </>
      ) : (
        <>
          <span role="img" aria-label="Light Mode">☀️</span> Light Mode
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
5. Integrate into ApplicationFinally, wrap your entire application with the ThemeProvider in your entry file, and place the ThemeToggle component wherever you want the switch to appear.In src/main.jsx (or src/main.tsx):// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Make sure your Tailwind CSS is imported here
import { ThemeProvider } from './context/ThemeContext'; // Import the ThemeProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your entire App component with the ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
In src/App.jsx (or src/App.tsx):// src/App.jsx
import React from 'react';
import ThemeToggle from './components/ThemeToggle'; // Import the ThemeToggle component

function App() {
  return (
    // Apply semantic background and text colors to the root div.
    // Tailwind will automatically switch these based on the `dark` class on <html>.
    <div className="min-h-screen bg-background-primary text-text-primary transition-colors duration-300">
      <header className="p-4 flex justify-between items-center
                         bg-background-secondary border-b border-border-default
                         shadow-sm">
        <h1 className="text-2xl font-bold text-primary-brand">My Themed App</h1>
        <ThemeToggle />
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-semibold mb-4 text-text-primary">
          Welcome to a Themed Experience!
        </h2>
        <p className="mb-6 text-lg text-text-secondary">
          This entire application dynamically adjusts its colors based on the selected theme.
          Notice how elements automatically adapt without needing explicit `dark:` prefixes everywhere.
        </p>

        {/* Example card demonstrating semantic colors */}
        <div className="p-8 rounded-xl shadow-lg
                        bg-background-secondary border border-border-default">
          <h3 className="text-xl font-bold mb-2 text-text-primary">Dynamic Card</h3>
          <p className="text-text-secondary leading-relaxed">
            This card's background, text, and border colors are all defined semantically.
            When you switch themes, these values update automatically, ensuring a consistent look and feel across your UI.
            This approach significantly simplifies theme management and improves code readability.
          </p>
          <button className="mt-6 px-6 py-3 rounded-lg
                             bg-primary-brand text-white font-semibold
                             hover:opacity-90 transition-opacity duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary-brand focus:ring-opacity-50">
            Learn More
          </button>
        </div>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-text-primary">More Content</h3>
          <ul className="list-disc list-inside text-text-secondary">
            <li>Item 1 with adapting text color.</li>
            <li>Item 2 that respects the current theme.</li>
            <li>Item 3 showing consistency across the app.</li>
          </ul>
        </section>
      </main>

      <footer className="p-4 text-center text-text-secondary border-t border-border-default mt-12">
        <p>&copy; {new Date().getFullYear()} My Themed App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
How to Use Semantic ColorsOnce configured, you can use your semantic color names directly as Tailwind utility classes, just like any other built-in color:bg-background-primary: Applies the primary background color for the current theme.text-text-primary: Applies the primary text color for the current theme.bg-background-secondary: Applies a secondary background color.text-text-secondary: Applies a secondary text color.border-border-default: Applies a default border color.bg-primary-brand, text-primary-brand: Applies your brand's primary color.You no longer need to write dark: prefixes for these semantic colors, as their underlying CSS variable values will automatically switch when the dark class is toggled on the <html> element.Benefits of this ApproachClean and Readable Code: Your component JSX remains clean, free from repetitive dark: prefixes, making it easier to read and understand.Centralized Theme Management: All theme colors are defined in one place (your src/index.css or src/app.css file), simplifying updates and ensuring consistency.Easy Customization: Changing a primary color for either theme is a single change in the CSS file.Scalability: As your application grows, managing a complex color palette becomes much more manageable.Automatic Adaptation: Colors automatically adjust without extra JavaScript logic in your components, making them truly "theme-aware."User Preference & Persistence: Respects user's system preferences and saves their choice for future visits.Installation and RunningClone this repository (or ensure your project structure matches the one described).Install dependencies:npm install
Start the development server:npm run dev
Open your browser to the address provided by Vite (usually http://localhost:5173).You should now see the application with a theme toggle button. Click it to observe the seamless transition between day and night modes!