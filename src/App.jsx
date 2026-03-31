import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, AlertCircle, ShieldAlert, Truck,
  Bot, ClipboardList, Wrench, CalendarDays, Star, LogOut, User
} from 'lucide-react'

import Login             from './pages/Login'
import Dashboard         from './pages/Dashboard'
import Documentos        from './pages/Documentos'
import NaoConformidades  from './pages/NaoConformidades'
import GestaoRisco       from './pages/GestaoRisco'
import Fornecedores      from './pages/Fornecedores'
import Copilot           from './pages/Copilot'
import Cinco5S           from './pages/Cinco5S'
import AuditoriaProcesso from './pages/AuditoriaProcesso'
import Calibracao        from './pages/Calibracao'
import PlanejamentoAnual from './pages/PlanejamentoAnual'

// ── SEÇÕES DO SIDEBAR ─────────────────────────────────────────────
const navItems = [
  { to:'/',             icon:LayoutDashboard, label:'Dashboard',          section:'principal' },
  { to:'/planejamento', icon:CalendarDays,    label:'Planejamento anual', section:'principal' },
  { to:'/documentos',   icon:FileText,        label:'Documentos',         section:'principal' },
  { to:'/nc',           icon:AlertCircle,     label:'Não conformidades',  section:'gestao'    },
  { to:'/risco',        icon:ShieldAlert,     label:'Gestão de risco',    section:'gestao'    },
  { to:'/fornecedores', icon:Truck,           label:'Fornecedores',       section:'gestao'    },
  { to:'/5s',           icon:Star,            label:'Gestão 5S',          section:'gestao'    },
  { to:'/auditoria',    icon:ClipboardList,   label:'Auditoria de processo',section:'gestao'  },
  { to:'/calibracao',   icon:Wrench,          label:'Calibração',         section:'gestao'    },
  { to:'/copilot',      icon:Bot,             label:'Copilot SGQ',        section:'ia'        },
]

const sections = [
  { id:'principal', label:'Principal'    },
  { id:'gestao',    label:'Gestão'       },
  { id:'ia',        label:'Inteligência' },
]

// ── PORTAL COM SIDEBAR ────────────────────────────────────────────
function Portal({ usuario, onLogout }) {
  return (
    <div style={{ display:'flex', height:'100vh', background:'#C8E3F5', fontFamily:"'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* SIDEBAR */}
      <aside style={{ width:220, background:'#0F2952', display:'flex', flexDirection:'column', flexShrink:0, height:'100vh', overflowY:'auto' }}>

        {/* Logo */}
        <div style={{ padding:'24px 20px 20px', borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#185FA5,#0c447c)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2">
                <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z"/>
                <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)" stroke="none"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.2 }}>Portal SGQ</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:.5 }}>Gestão da Qualidade</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 0' }}>
          {sections.map(sec => (
            <div key={sec.id}>
              <div style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', padding:'12px 20px 6px' }}>
                {sec.label}
              </div>
              {navItems.filter(n => n.section === sec.id).map(item => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'}
                  style={({ isActive }) => ({
                    display:'flex', alignItems:'center', gap:10,
                    padding:'9px 20px', textDecoration:'none',
                    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    borderRight: isActive ? '2px solid #185FA5' : '2px solid transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                    fontSize:13, fontWeight: isActive ? 500 : 400,
                    transition:'all .15s',
                  })}>
                  <item.icon size={15} style={{ flexShrink:0 }}/>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Usuário logado */}
        <div style={{ padding:'16px 20px', borderTop:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <User size={14} color="rgba(255,255,255,0.6)"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {usuario?.nome || 'Usuário'}
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>
                {usuario?.cargo || 'Gestão da Qualidade'}
              </div>
            </div>
          </div>
          <button onClick={onLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'8px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'0.5px solid rgba(239,68,68,0.2)', color:'rgba(239,68,68,0.8)', fontSize:12, cursor:'pointer', transition:'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)' }}>
            <LogOut size={13}/>
            Sair do portal
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main style={{ flex:1, overflowY:'auto', padding:'24px' }}>
        <Routes>
          <Route path="/"             element={<Dashboard/>}        />
          <Route path="/planejamento" element={<PlanejamentoAnual/>} />
          <Route path="/documentos"   element={<Documentos/>}        />
          <Route path="/nc"           element={<NaoConformidades/>}  />
          <Route path="/risco"        element={<GestaoRisco/>}       />
          <Route path="/fornecedores" element={<Fornecedores/>}      />
          <Route path="/5s"           element={<Cinco5S/>}           />
          <Route path="/auditoria"    element={<AuditoriaProcesso/>} />
          <Route path="/calibracao"   element={<Calibracao/>}        />
          <Route path="/copilot"      element={<Copilot/>}           />
          <Route path="*"             element={<Navigate to="/" replace/>}/>
        </Routes>
      </main>
    </div>
  )
}

// ── APP RAIZ ──────────────────────────────────────────────────────
function AppRoutes() {
  const [logado, setLogado]     = useState(false)
  const [usuario, setUsuario]   = useState(null)

  function handleLoginSucesso(dadosUsuario) {
    setUsuario(dadosUsuario)
    setLogado(true)
  }

  function handleLogout() {
    setLogado(false)
    setUsuario(null)
  }

  if (!logado) {
    return <Login onLogin={handleLoginSucesso}/>
  }

  return <Portal usuario={usuario} onLogout={handleLogout}/>
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}