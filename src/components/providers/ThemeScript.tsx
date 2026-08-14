export default function ThemeScript() {
  const codeToRunOnClient = `
    (function() {
      try {
        const theme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (theme === 'system' && systemPrefersDark) || !theme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // No localStorage available, fall back to the dark default
        document.documentElement.classList.add('dark');
      }
    })()
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRunOnClient,
      }}
    />
  );
}
