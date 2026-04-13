import { Bell, HelpCircle, ChevronDown, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import '../styles/TopBar.css'

const LogoMark = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <rect width="30" height="30" rx="5" fill="rgba(26,58,92,0.07)"/>
    <ellipse cx="11" cy="12" rx="5" ry="2.5" fill="#1a3a5c" opacity="0.85"/>
    <rect x="6" y="12" width="10" height="8" rx="1" fill="#1a3a5c" opacity="0.6"/>
    <ellipse cx="11" cy="20" rx="5" ry="2.5" fill="#1a3a5c" opacity="0.85"/>
    <ellipse cx="21" cy="15" rx="4" ry="2" fill="#1a3a5c" opacity="0.5"/>
    <rect x="17" y="15" width="8" height="6" rx="1" fill="#1a3a5c" opacity="0.35"/>
    <ellipse cx="21" cy="21" rx="4" ry="2" fill="#1a3a5c" opacity="0.5"/>
  </svg>
)

export default function TopBar({ system = 'SGQ', moduleName = '', user = { name: 'Igor Bittencourt', role: 'Gestão da Qualidade', initials: 'IB' } }) {
  const { dark, toggle } = useTheme()

  return (
    <div className="sgq-topbar-wrapper">
      {/* Faixa de acento */}
      <div className="sgq-accent-bar" />

      {/* Barra principal */}
      <div className="sgq-bar">

        {/* ESQUERDA */}
        <div className="sgq-left">
          <LogoMark />
          <div className="sgq-brand-text">
            <span className="sgq-brand-name">GRUPO INCOFLANDRES</span>
            <span className="sgq-brand-sub">Portal SGQ</span>
          </div>
          <div className="sgq-sep-v" />
          <div className="sgq-breadcrumb">
            <span className="sgq-bc-system">{system}</span>
            <span className="sgq-bc-arrow">›</span>
            <span className="sgq-bc-module">{moduleName}</span>
          </div>
        </div>

        {/* CENTRO */}
        <div className="sgq-center">
          <div className="sgq-search-box">
            <svg className="sgq-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="sgq-search-placeholder">Buscar módulos, registros, documentos…</span>
            <span className="sgq-search-kbd">⌘K</span>
          </div>
        </div>

        {/* DIREITA */}
        <div className="sgq-right">
          {/* Toggle tema */}
          <button
            className={`theme-toggle${dark ? ' theme-toggle--dark' : ''}`}
            onClick={toggle}
            title={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            <Sun size={12} className="toggle-icon toggle-icon--sun" />
            <div className="toggle-knob" />
            <Moon size={12} className="toggle-icon toggle-icon--moon" />
          </button>

          <div className="sgq-sep-v" />

          {/* Notificações */}
          <button className="sgq-icon-btn" title="Notificações">
            <Bell size={16} />
            <span className="sgq-notif-dot" />
          </button>

          {/* Ajuda */}
          <button className="sgq-icon-btn" title="Ajuda">
            <HelpCircle size={16} />
          </button>

          <div className="sgq-sep-v" />

          {/* Usuário */}
          <button className="sgq-user-btn">
            <div className="sgq-avatar">{user.initials}</div>
            <div className="sgq-user-info">
              <span className="sgq-user-name">{user.name}</span>
              <span className="sgq-user-role">{user.role}</span>
            </div>
            <ChevronDown size={13} className="sgq-user-chevron" />
          </button>
        </div>

      </div>
    </div>
  )
}
