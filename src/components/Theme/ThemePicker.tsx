import { useThemeStore, THEMES, type ThemeId } from '../../stores/themeStore'

const THEME_ORDER: ThemeId[] = ['cyber', 'matrix', 'synthwave', 'ghost']

export function ThemePicker() {
  const { themeId, setTheme } = useThemeStore()

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
      {THEME_ORDER.map(id => {
        const t = THEMES[id]
        const isActive = themeId === id
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            title={t.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `2px solid ${isActive ? t.primary : '#1e2d50'}`,
              background: isActive ? `${t.primary}22` : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              boxShadow: isActive ? `0 0 10px ${t.primary}55` : 'none',
            }}
          >
            {t.emoji}
          </button>
        )
      })}
    </div>
  )
}
