import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, AlertCircle, ShieldAlert,
  Truck, Bot, ChevronRight, Bell, Search, Menu, X, ClipboardList, ClipboardCheck, Wrench, CalendarDays
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import Documentos from './pages/Documentos'
import NaoConformidades from './pages/NaoConformidades'
import GestaoRisco from './pages/GestaoRisco'
import Fornecedores from './pages/Fornecedores'
import Copilot from './pages/Copilot'
import Cinco5S from './pages/Cinco5S'
import AuditoriaProcesso from './pages/AuditoriaProcesso'
import Calibracao from './pages/Calibracao'
import PlanejamentoAnual from './pages/PlanejamentoAnual'

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard',           section: 'principal' },
  { to: '/planejamento', icon: CalendarDays, label: 'Planejamento anual', section: 'principal' },
  { to: '/documentos',  icon: FileText,         label: 'Documentos',          section: 'principal', count: 142 },
  { to: '/nc',          icon: AlertCircle,      label: 'Não conformidades',   section: 'gestao',   alert: true },
  { to: '/risco',       icon: ShieldAlert,      label: 'Gestão de risco',     section: 'gestao' },
  { to: '/fornecedores',icon: Truck,            label: 'Fornecedores',        section: 'gestao' },
  { to: '/copilot',     icon: Bot,              label: 'Copilot SGQ',         section: 'ia',       badge: 'IA' },
  { to: '/5s', icon: ClipboardList, label: 'Gestão 5S', section: 'gestao' },
  { to: '/auditoria', icon: ClipboardCheck, label: 'Auditoria de Processo', section: 'gestao' },
  { to: '/calibracao', icon: Wrench, label: 'Calibração', section: 'gestao' },
  

]

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-[#0F2952] flex flex-col z-30
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#185FA5] flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">SGQ Portal</p>
              <p className="text-white/40 text-[11px]">Gestão da Qualidade</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#185FA5] flex items-center justify-center text-white text-[11px] font-medium">
              IB
            </div>
            <div>
              <p className="text-white text-[12px] font-medium">Igor Bittencourt</p>
              <p className="text-white/40 text-[11px]">Gestão de Qualidade</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {['principal', 'gestao', 'ia'].map(section => (
            <div key={section}>
              <p className="px-4 pt-3 pb-1 text-[10px] font-medium text-white/30 uppercase tracking-widest">
                {section === 'principal' ? 'Principal' : section === 'gestao' ? 'Gestão' : 'Inteligência'}
              </p>
              {navItems.filter(n => n.section === section).map(({ to, icon: Icon, label, count, alert, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all duration-150 cursor-pointer
                    ${isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <Icon size={15} />
                  <span className="flex-1">{label}</span>
                  {alert && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                  {count && <span className="text-[10px] bg-white/15 text-white/70 px-1.5 py-0.5 rounded-full">{count}</span>}
                  {badge && <span className="text-[10px] bg-[#185FA5] text-white px-1.5 py-0.5 rounded-full">{badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-white/30 text-[11px]">Sincronizado com TOTVS</p>
          <p className="text-white/50 text-[11px]">Última sync: agora</p>
        </div>
      </aside>
    </>
  )
}

function Topbar({ onMenuClick }) {
  const location = useLocation()
  const current = navItems.find(n => n.to === location.pathname)

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 sticky top-0 z-10">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
        <Menu size={20} />
      </button>
      <div className="flex-1">
        <h1 className="text-[15px] font-medium text-gray-800">
          {current?.label || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
          <Search size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-[11px] font-medium">
          IB
        </div>
      </div>
    </header>
  )
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[#C8E3F5] p-5">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/documentos"   element={<Documentos />} />
            <Route path="/nc"           element={<NaoConformidades />} />
            <Route path="/risco"        element={<GestaoRisco />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/copilot"      element={<Copilot />} />
            <Route path="/5s"           element={<Cinco5S />} />
            <Route path="/auditoria" element={<AuditoriaProcesso />} />
            <Route path="/calibracao" element={<Calibracao />} />
            <Route path="/planejamento" element={<PlanejamentoAnual />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}