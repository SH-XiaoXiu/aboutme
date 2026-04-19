import { useTheme } from '../contexts/ThemeContext';

/** 太阳/月牙 SVG 线稿切换按钮，放在 SideRail 底部。 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="pointer-events-auto group relative flex items-center justify-center"
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid color-mix(in srgb, var(--ink-400) 40%, transparent)',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.3s, background 0.3s',
        overflow: 'hidden',
      }}
    >
      {/* Ripple on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'color-mix(in srgb, var(--ink-50) 6%, transparent)' }}
      />

      {/* Icon: Sun (dark mode) or Moon (light mode) */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          stroke: 'var(--ink-400)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), stroke 0.3s',
          transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {isDark ? (
          /* Sun */
          <>
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
          </>
        ) : (
          /* Moon crescent */
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}
