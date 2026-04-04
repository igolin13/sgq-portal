import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, AlertCircle, ShieldAlert, Truck,
  Bot, ClipboardList, Wrench, CalendarDays, Star, LogOut, User,
  ChevronDown, ChevronRight, ChevronLeft, Microscope, BookOpen, FileSearch,
  BellRing, RefreshCw, ScanSearch, ListChecks, Home as HomeIcon
} from 'lucide-react'

import Login             from './pages/Login'
import Home              from './pages/Home'
import Dashboard         from './pages/Dashboard'
import Documentos        from './pages/Documentos'
import NaoConformidades  from './pages/NaoConformidades'
import GestaoRisco       from './pages/GestaoRisco'
import Fornecedores      from './pages/Fornecedores'
import Copilot           from './pages/Copilot'
import Cinco5S           from './pages/Cinco5S'
import AuditoriaProcesso from './pages/AuditoriaProcesso'
import Calibracao          from './pages/Calibracao'
import PlanejamentoAnual   from './pages/PlanejamentoAnual'
import Selecao             from './pages/Selecao'
import Inspecao            from './pages/Inspecao'

// ── SEÇÕES DO SIDEBAR ─────────────────────────────────────────────
const navItems = [
  { to:'/',                        icon:HomeIcon,        label:'Início',                    section:'principal' },
  { to:'/dashboard',               icon:LayoutDashboard, label:'Painel gerencial',          section:'principal' },
  { to:'/planejamento',            icon:CalendarDays,    label:'Planejamento anual',        section:'principal' },
  { to:'/documentos',              icon:FileText,        label:'Documentos',                section:'principal' },
  { to:'/nc',                      icon:AlertCircle,     label:'Não conformidades',         section:'sgq'       },
  { to:'/risco',                   icon:ShieldAlert,     label:'Gestão de risco',           section:'sgq'       },
  { to:'/fornecedores',            icon:Truck,           label:'Fornecedores',              section:'sgq'       },
  { to:'/5s',                      icon:Star,            label:'Gestão 5S',                 section:'sgq'       },
  { to:'/auditoria',               icon:ClipboardList,   label:'Auditoria de processo',     section:'sgq'       },
  { to:'/calibracao',              icon:Wrench,          label:'Calibração',                section:'sgq'       },
  { to:'/monitoramento-ambiental', icon:Microscope,      label:'Monitoramento ambiental',   section:'sgsa'      },
  { to:'/ppr',                     icon:BookOpen,        label:'PPR',                       section:'sgsa'      },
  { to:'/laudo-migracao',          icon:FileSearch,      label:'Laudo de migração',         section:'sgsa'      },
  { to:'/simulados-emergencia',    icon:BellRing,        label:'Simulados de emergência',   section:'sgsa'      },
  { to:'/exercicio-recall',        icon:RefreshCw,       label:'Exercício de recall',       section:'sgsa'      },
  { to:'/selecao',                 icon:ScanSearch,      label:'Seleção',                   section:'cq'        },
  { to:'/inspecao',               icon:ListChecks,      label:'Inspeção',                  section:'cq'        },
  { to:'/copilot',                 icon:Bot,             label:'Copilot IA',            section:'principal'  },
]

const sections = [
  { id:'principal', label:'Principal',   collapsible: false },
  { id:'sgq',  label:'SGQ',  sub:'Sistema de Gestão da Qualidade',       collapsible: true, cor:'#3b82f6', corBg:'rgba(59,130,246,0.12)'  },
  { id:'sgsa', label:'SGSA', sub:'Gestão de Segurança de Alimentos',     collapsible: true, cor:'#10b981', corBg:'rgba(16,185,129,0.12)'  },
  { id:'cq',   label:'CQ',   sub:'Controle de Qualidade',                collapsible: true, cor:'#f59e0b', corBg:'rgba(245,158,11,0.12)'  },
]

// ── PÁGINA PLACEHOLDER ───────────────────────────────────────────
function EmConstrucao({ titulo }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:12, color:'#64748b' }}>
      <div style={{ fontSize:40 }}>🚧</div>
      <div style={{ fontSize:20, fontWeight:600, color:'#1e293b' }}>{titulo}</div>
      <div style={{ fontSize:14 }}>Módulo em desenvolvimento</div>
    </div>
  )
}

// ── PORTAL COM SIDEBAR ────────────────────────────────────────────
const LogoIcon = () => (
  <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#185FA5,#0c447c)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 12px rgba(24,95,165,0.4)' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2">
      <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z"/>
      <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)" stroke="none"/>
    </svg>
  </div>
)

function Portal({ usuario, onLogout }) {
  const [collapsed,    setCollapsed]    = useState({ sgq: true, sgsa: true, cq: true })
  const [sidebarOpen,  setSidebarOpen]  = useState(true)

  function toggleSection(id) {
    setCollapsed(prev => {
      const opening = prev[id] // true = estava fechado, vai abrir
      if (opening) {
        // Abre esta seção e fecha as outras duas do bloco de qualidade
        const outras = ['sgq','sgsa','cq'].filter(s => s !== id)
        const next = { ...prev, [id]: false }
        outras.forEach(s => { next[s] = true })
        return next
      }
      return { ...prev, [id]: true }
    })
  }

  const btnStyle = (base = {}) => ({
    background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)',
    borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
    color:'rgba(255,255,255,0.4)', transition:'all .15s', ...base,
  })

  return (
    <div style={{ display:'flex', height:'100vh', background:'#C8E3F5', fontFamily:"'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 240 : 68, minWidth: sidebarOpen ? 240 : 68, background:'#0F2952', display:'flex', flexDirection:'column', flexShrink:0, height:'100vh', overflow:'hidden', transition:'width .25s cubic-bezier(.4,0,.2,1), min-width .25s cubic-bezier(.4,0,.2,1)' }}>

        {/* ── HEADER ────────────────────────── */}
        {sidebarOpen ? (
          <div style={{ padding:'18px 14px 14px', borderBottom:'0.5px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:10 }}>
            <LogoIcon/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.2, whiteSpace:'nowrap' }}>Portal SGQ</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:.5, whiteSpace:'nowrap' }}>Gestão da Qualidade</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ ...btnStyle({ width:26, height:26 }) }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.14)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.4)' }}>
              <ChevronLeft size={14}/>
            </button>
          </div>
        ) : (
          <div style={{ padding:'14px 0', borderBottom:'0.5px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <LogoIcon/>
            <button onClick={() => setSidebarOpen(true)} style={{ ...btnStyle({ width:34, height:34, borderRadius:9 }) }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.14)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.4)' }}>
              <ChevronRight size={15}/>
            </button>
          </div>
        )}

        {/* ── NAV EXPANDIDO ────────────────── */}
        {sidebarOpen && <nav style={{ flex:1, padding:'8px 0 12px', display:'flex', flexDirection:'column', gap:0, overflowY:'auto' }}>

          {/* ── PRINCIPAL ─────────────────────── */}
          <div style={{ padding:'4px 0 2px' }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.22)', letterSpacing:2.5, textTransform:'uppercase', padding:'8px 20px 4px' }}>
              Principal
            </div>
            {navItems.filter(n => n.section === 'principal').map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                style={({ isActive }) => ({
                  display:'flex', alignItems:'center', gap:10,
                  padding:'9px 20px', textDecoration:'none',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontSize:14, fontWeight: isActive ? 500 : 400,
                  transition:'all .15s',
                })}>
                <item.icon size={15} style={{ flexShrink:0 }}/>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── DIVISOR ───────────────────────── */}
          <div style={{ margin:'10px 16px 10px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to right, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))' }}/>
            <span style={{ fontSize:8, fontWeight:700, color:'rgba(255,255,255,0.18)', letterSpacing:2, textTransform:'uppercase', whiteSpace:'nowrap' }}>Sistemas</span>
            <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to right, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))' }}/>
          </div>

          {/* ── BLOCO DOS TRÊS SISTEMAS ───────── */}
          <div style={{ margin:'0 10px', background:'rgba(0,0,0,0.2)', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
            {sections.filter(s => s.cor).map((sec, i) => {
              const isCollapsed = collapsed[sec.id]
              const items = navItems.filter(n => n.section === sec.id)
              return (
                <div key={sec.id} style={{ borderTop: i > 0 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                  {/* Cabeçalho da seção */}
                  <div onClick={() => toggleSection(sec.id)}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', cursor:'pointer', userSelect:'none', transition:'background .15s',
                      background: !isCollapsed ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background=!isCollapsed ? 'rgba(255,255,255,0.03)' : 'transparent'}>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      {/* Badge colorido */}
                      <div style={{ width:28, height:28, borderRadius:8, background:sec.corBg, border:`1px solid ${sec.cor}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:8, fontWeight:800, color:sec.cor, letterSpacing:0.5 }}>{sec.label}</span>
                      </div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.8)', lineHeight:1.2 }}>{sec.sub}</div>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{items.length} módulo{items.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      {isCollapsed
                        ? <ChevronRight size={13} color="rgba(255,255,255,0.25)"/>
                        : <ChevronDown  size={13} color={sec.cor} style={{ opacity:0.7 }}/>}
                    </div>
                  </div>

                  {/* Itens expandidos */}
                  {!isCollapsed && (
                    <div style={{ background:'rgba(0,0,0,0.15)', borderTop:`1px solid ${sec.cor}18` }}>
                      {items.map(item => (
                        <NavLink key={item.to} to={item.to}
                          style={({ isActive }) => ({
                            display:'flex', alignItems:'center', gap:9,
                            padding:'8px 14px 8px 20px', textDecoration:'none',
                            background: isActive ? `${sec.cor}15` : 'transparent',
                            borderLeft: isActive ? `2px solid ${sec.cor}` : '2px solid transparent',
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontSize:13, fontWeight: isActive ? 500 : 400,
                            transition:'all .15s',
                          })}>
                          <item.icon size={13} style={{ flexShrink:0 }}/>
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>


        </nav>}

        {/* ── NAV COLAPSADO (ícones) ────────── */}
        {!sidebarOpen && (
          <nav style={{ flex:1, padding:'10px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:2, overflowY:'auto' }}>
            {/* Principal */}
            {navItems.filter(n => n.section === 'principal').map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} title={item.label}
                style={({ isActive }) => ({
                  width:42, height:42, borderRadius:11, textDecoration:'none',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.38)',
                  transition:'all .15s',
                })}>
                <item.icon size={17}/>
              </NavLink>
            ))}

            {/* Separador fino */}
            <div style={{ width:20, height:'0.5px', background:'rgba(255,255,255,0.08)', margin:'6px 0' }}/>

            {/* Sistemas (todos os itens, cor da seção quando ativo) */}
            {sections.filter(s => s.cor).flatMap(sec =>
              navItems.filter(n => n.section === sec.id).map(item => (
                <NavLink key={item.to} to={item.to} title={item.label}
                  style={({ isActive }) => ({
                    width:42, height:42, borderRadius:11, textDecoration:'none',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: isActive ? `${sec.cor}20` : 'transparent',
                    color: isActive ? sec.cor : 'rgba(255,255,255,0.38)',
                    transition:'all .15s',
                  })}>
                  <item.icon size={16}/>
                </NavLink>
              ))
            )}

          </nav>
        )}

        {/* ── USUÁRIO EXPANDIDO ────────────── */}
        {sidebarOpen && (
          <div style={{ padding:'14px 16px', borderTop:'0.5px solid rgba(255,255,255,0.08)' }}>
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
        )}

        {/* ── USUÁRIO COLAPSADO ────────────── */}
        {!sidebarOpen && (
          <div style={{ padding:'12px 0', borderTop:'0.5px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <User size={14} color="rgba(255,255,255,0.5)"/>
            </div>
            <button onClick={onLogout} title="Sair do portal"
              style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'0.5px solid rgba(239,68,68,0.2)', color:'rgba(239,68,68,0.7)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.22)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)' }}>
              <LogOut size={13}/>
            </button>
          </div>
        )}
      </aside>

      {/* CONTEÚDO */}
      <main style={{ flex:1, overflowY:'auto', padding:'24px' }}>
        <Routes>
          <Route path="/"             element={<Home usuario={usuario}/>} />
          <Route path="/dashboard"    element={<Dashboard/>}             />
          <Route path="/planejamento" element={<PlanejamentoAnual/>}     />
          <Route path="/documentos"   element={<Documentos/>}        />
          <Route path="/nc"           element={<NaoConformidades/>}  />
          <Route path="/risco"        element={<GestaoRisco/>}       />
          <Route path="/fornecedores" element={<Fornecedores/>}      />
          <Route path="/5s"           element={<Cinco5S/>}           />
          <Route path="/auditoria"    element={<AuditoriaProcesso/>} />
          <Route path="/calibracao"   element={<Calibracao/>}        />
          <Route path="/monitoramento-ambiental" element={<EmConstrucao titulo="Monitoramento ambiental"/>}  />
          <Route path="/ppr"                     element={<EmConstrucao titulo="PPR"/>}                      />
          <Route path="/laudo-migracao"           element={<EmConstrucao titulo="Laudo de migração"/>}        />
          <Route path="/simulados-emergencia"     element={<EmConstrucao titulo="Simulados de emergência"/>}  />
          <Route path="/exercicio-recall"         element={<EmConstrucao titulo="Exercício de recall"/>}      />
          <Route path="/controle"                 element={<ControleQualidade/>}                              />
          <Route path="/selecao"                  element={<EmConstrucao titulo="Seleção"/>}                   />
          <Route path="/inspecao"                 element={<EmConstrucao titulo="Inspeção"/>}                  />
          <Route path="/copilot"                  element={<Copilot/>}                                        />
          <Route path="*"                         element={<Navigate to="/" replace/>}/>
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