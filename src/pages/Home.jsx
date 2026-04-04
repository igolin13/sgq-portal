import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Zap, Bell, Calendar, ChevronRight,
  AlertCircle, FileText, ShieldAlert, Wrench,
  ClipboardList, Star, CalendarDays, Bot,
  TrendingUp, CheckCircle, Clock, ArrowUpRight
} from 'lucide-react'
import logoEmpresa from '../assets/logo-incoflandres.png'


// ── UTILITÁRIOS ───────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}

// ── DADOS DO DIA ──────────────────────────────────────────────────
const ALERTAS = [
  { tipo:'danger', msg:'NC-045 — Rastreabilidade sem registro', detalhe:'Logística · 4 dias em atraso',   rota:'/nc'         },
  { tipo:'warn',   msg:'Calibração Paquímetro P-1201 vencida',  detalhe:'Produção · Substituir urgente',  rota:'/calibracao'  },
  { tipo:'info',   msg:'Auditoria BPF — Produção amanhã',       detalhe:'Igor Bittencourt · 08:00 h',     rota:'/auditoria'   },
]

const AGENDA = [
  { hora:'09:00', titulo:'Análise microbiológica — MP',   resp:'Igor Bittencourt', cor:'#3b82f6', status:'andamento' },
  { hora:'14:00', titulo:'Auditoria BPF — Estoque',      resp:'Maria Silva',      cor:'#f59e0b', status:'planejado' },
  { hora:'16:30', titulo:'Reunião análise crítica',       resp:'Igor Bittencourt', cor:'#8b5cf6', status:'planejado' },
]

const METRICAS = [
  { label:'Não conformidades', detalhe:'18 em aberto · 5 em atraso',  cor:'#ef4444', rota:'/nc',          icon:AlertCircle  },
  { label:'Documentos',        detalhe:'142 ativos · +3 este mês',    cor:'#3b82f6', rota:'/documentos',  icon:FileText     },
  { label:'Gestão de risco',   detalhe:'8 críticos · 1 sem resp.',    cor:'#f59e0b', rota:'/risco',       icon:ShieldAlert  },
  { label:'Calibração',        detalhe:'7 ok · 3 vencendo em breve',  cor:'#10b981', rota:'/calibracao',  icon:Wrench       },
  { label:'Gestão 5S',         detalhe:'Média 8.1 · 4 setores',       cor:'#06b6d4', rota:'/5s',          icon:Star         },
  { label:'Planejamento anual',detalhe:'32% concluído · Mar/2026',    cor:'#8b5cf6', rota:'/planejamento',icon:CalendarDays },
]

const SUGESTOES_IA = [
  'Qual o status das NCs em aberto?',
  'Quais calibrações vencem este mês?',
  'Resumo do 5S por setor',
]

const MAPA_MODULOS = [
  { label:'SGQ',  cor:'#3b82f6', items:['Não conformidades','Gestão de risco','Fornecedores','Gestão 5S','Auditoria','Calibração'] },
  { label:'SGSA', cor:'#10b981', items:['Mon. ambiental','PPR','Laudo migração','Simulados','Recall'] },
  { label:'CQ',   cor:'#f59e0b', items:['Seleção','Inspeção'] },
]

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────
export default function Home({ usuario }) {
  const navigate  = useNavigate()
  const searchRef = useRef(null)
  const [mounted,  setMounted]  = useState(false)
  const [search,   setSearch]   = useState('')
  const [hora,     setHora]     = useState(new Date())

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 60)
    const t2 = setInterval(() => setHora(new Date()), 30000)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [])

  // Ctrl+K / Cmd+K foca a busca
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cs = (delay = 0) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(18px)',
    transition:`opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
  })

  const nomeFirst  = usuario?.nome?.split(' ')[0] || 'Usuário'
  const diaSemana  = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][hora.getDay()]
  const dataStr    = hora.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
  const horaStr    = hora.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
  const alertasDanger = ALERTAS.filter(a => a.tipo === 'danger').length

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:'100vh', background:'linear-gradient(150deg,#070d1c 0%,#0b1428 55%,#080f1e 100%)', margin:'-24px', padding:0, color:'#fff', overflowX:'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* Fundo decorativo */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-15%', right:'-8%',  width:700, height:700, background:'radial-gradient(circle,rgba(59,130,246,.055) 0%,transparent 65%)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', bottom:'-8%', left:'-4%', width:550, height:550, background:'radial-gradient(circle,rgba(139,92,246,.04) 0%,transparent 65%)',  borderRadius:'50%' }}/>
        <div style={{ position:'absolute', top:'45%',  left:'38%',  width:400, height:400, background:'radial-gradient(circle,rgba(16,185,129,.03) 0%,transparent 65%)',   borderRadius:'50%' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1, maxWidth:1320, margin:'0 auto', padding:'36px 32px 56px' }}>

        {/* ── TOPO: data + hora + logo ──────────────────── */}
        <div style={{ ...cs(0), display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:52 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981', flexShrink:0, marginTop:2 }}/>
            <span style={{ fontSize:11, color:'rgba(255,255,255,.3)', letterSpacing:2, fontFamily:'DM Mono', textTransform:'uppercase' }}>
              {diaSemana} · {dataStr}
            </span>
          </div>
          {/* Logo Grupo Incoflandres */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
            <span style={{ fontSize:22, fontWeight:300, color:'rgba(255,255,255,.18)', fontFamily:'DM Mono', letterSpacing:3 }}>{horaStr}</span>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', borderRadius:12, background:'rgba(255,255,255,.03)', border:'0.5px solid rgba(255,255,255,.07)' }}>
              {/* Ícone cilindros */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <ellipse cx="10" cy="7"  rx="7" ry="2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
                <path d="M3 7v7c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
                <path d="M3 14v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
                <ellipse cx="20" cy="10" rx="5" ry="1.8" stroke="rgba(59,130,246,0.8)" strokeWidth="1.2"/>
                <path d="M15 10v5c0 .99 2.24 1.8 5 1.8s5-.81 5-1.8v-5" stroke="rgba(59,130,246,0.8)" strokeWidth="1.2"/>
                <path d="M15 15v4c0 .99 2.24 1.8 5 1.8s5-.81 5-1.8v-4" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2"/>
              </svg>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.75)', letterSpacing:1, textTransform:'uppercase', lineHeight:1.1 }}>Grupo Incoflandres</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.3)', letterSpacing:.5, marginTop:2 }}>Portal SGQ · Volta Redonda</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HERO: saudação ────────────────────────────── */}
        <div style={{ ...cs(80), marginBottom:44 }}>
          {/* Badges empresa + unidade */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, flexWrap:'wrap' }}>
            <div style={{ padding:'5px 14px', borderRadius:20, background:'rgba(59,130,246,.1)', border:'0.5px solid rgba(59,130,246,.22)', fontSize:11, color:'#93c5fd', letterSpacing:1, fontFamily:'DM Mono' }}>
              GRUPO INCOFLANDRES
            </div>
            <div style={{ width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,.2)' }}/>
            <div style={{ padding:'5px 14px', borderRadius:20, background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.1)', fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:1, fontFamily:'DM Mono' }}>
              UNIDADE VOLTA REDONDA
            </div>
            {alertasDanger > 0 && (
              <div style={{ padding:'5px 12px', borderRadius:20, background:'rgba(239,68,68,.1)', border:'0.5px solid rgba(239,68,68,.25)', fontSize:11, color:'#fca5a5', letterSpacing:0.5, display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#ef4444', boxShadow:'0 0 6px #ef4444' }}/>
                {alertasDanger} alerta crítico
              </div>
            )}
          </div>

          {/* Saudação */}
          <h1 style={{ fontSize:46, fontWeight:700, letterSpacing:-1.2, margin:'0 0 10px', lineHeight:1.05, background:'linear-gradient(135deg,#fff 20%,rgba(255,255,255,.5) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {getGreeting()}, {nomeFirst}.
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.32)', margin:0, letterSpacing:.2 }}>
            Aqui está o que está acontecendo hoje no sistema de gestão.
          </p>
        </div>

        {/* ── BUSCA GLOBAL ──────────────────────────────── */}
        <div style={{ ...cs(160), marginBottom:48, maxWidth:660 }}>
          <div style={{ position:'relative' }}>
            <Search size={17} color="rgba(255,255,255,.28)" style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
            <input ref={searchRef} type="text" placeholder="Buscar módulos, documentos, NCs, riscos, calibrações..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', padding:'15px 56px 15px 48px', boxSizing:'border-box', background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.09)', borderRadius:14, color:'#fff', fontSize:14, fontFamily:'DM Sans', outline:'none', transition:'all .2s', boxShadow:'0 4px 24px rgba(0,0,0,.25)' }}
              onFocus={e => { e.target.style.borderColor='rgba(59,130,246,.45)'; e.target.style.boxShadow='0 4px 32px rgba(59,130,246,.1), 0 0 0 3px rgba(59,130,246,.07)' }}
              onBlur={e =>  { e.target.style.borderColor='rgba(255,255,255,.09)'; e.target.style.boxShadow='0 4px 24px rgba(0,0,0,.25)' }}
            />
            <kbd style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', padding:'4px 9px', borderRadius:6, background:'rgba(255,255,255,.05)', border:'0.5px solid rgba(255,255,255,.1)', fontSize:11, color:'rgba(255,255,255,.25)', fontFamily:'DM Mono', userSelect:'none' }}>
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* ── 3 CARDS PRINCIPAIS ───────────────────────── */}
        <div style={{ ...cs(220), display:'grid', gridTemplateColumns:'1fr 1fr 1.1fr', gap:16, marginBottom:28 }}>

          {/* Card: Agenda Hoje */}
          <div style={{ background:'rgba(255,255,255,.035)', border:'0.5px solid rgba(255,255,255,.07)', borderRadius:20, padding:'26px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#3b82f6,#60a5fa)' }}/>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:2, textTransform:'uppercase', fontFamily:'DM Mono' }}>Agenda Hoje</span>
              <Calendar size={14} color="rgba(59,130,246,.65)"/>
            </div>
            <div style={{ fontSize:38, fontWeight:700, color:'#fff', fontFamily:'DM Mono', lineHeight:1, marginBottom:4 }}>{AGENDA.length}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', marginBottom:22 }}>atividades programadas</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {AGENDA.map((a, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,.25)', fontFamily:'DM Mono', width:38, flexShrink:0 }}>{a.hora}</span>
                  <div style={{ width:2.5, height:2.5, borderRadius:'50%', background:a.cor, flexShrink:0 }}/>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,.6)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.titulo}</span>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:20, background: a.status==='andamento'?'rgba(59,130,246,.18)':'rgba(255,255,255,.06)', color: a.status==='andamento'?'#93c5fd':'rgba(255,255,255,.3)', flexShrink:0 }}>
                    {a.status === 'andamento' ? 'Em andamento' : 'Planejado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Pontos de Atenção */}
          <div style={{ background:'rgba(255,255,255,.035)', border:'0.5px solid rgba(255,255,255,.07)', borderRadius:20, padding:'26px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#ef4444,#f87171)' }}/>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:2, textTransform:'uppercase', fontFamily:'DM Mono' }}>Atenção</span>
              <Bell size={14} color="rgba(239,68,68,.65)"/>
            </div>
            <div style={{ fontSize:38, fontWeight:700, color:'#ef4444', fontFamily:'DM Mono', lineHeight:1, marginBottom:4 }}>{ALERTAS.length}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', marginBottom:22 }}>pontos de atenção</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {ALERTAS.map((a, i) => (
                <div key={i} onClick={() => navigate(a.rota)}
                  style={{ display:'flex', alignItems:'flex-start', gap:9, cursor:'pointer', padding:'8px 10px', borderRadius:10, transition:'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.04)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div style={{ width:6, height:6, borderRadius:'50%', marginTop:3, flexShrink:0, background: a.tipo==='danger'?'#ef4444': a.tipo==='warn'?'#f59e0b':'#3b82f6', boxShadow:`0 0 5px ${a.tipo==='danger'?'#ef4444':a.tipo==='warn'?'#f59e0b':'#3b82f6'}` }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.msg}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:1 }}>{a.detalhe}</div>
                  </div>
                  <ChevronRight size={12} color="rgba(255,255,255,.2)" style={{ flexShrink:0, marginTop:2 }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Copilot IA */}
          <div onClick={() => navigate('/copilot')}
            style={{ background:'linear-gradient(135deg,rgba(109,40,217,.12) 0%,rgba(59,130,246,.08) 100%)', border:'0.5px solid rgba(109,40,217,.22)', borderRadius:20, padding:'26px', position:'relative', overflow:'hidden', cursor:'pointer', transition:'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(139,92,246,.45)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(109,40,217,.22)'}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#7c3aed,#3b82f6)' }}/>
            <div style={{ position:'absolute', bottom:-30, right:-30, width:140, height:140, background:'radial-gradient(circle,rgba(109,40,217,.18) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <span style={{ fontSize:10, color:'rgba(139,92,246,.9)', letterSpacing:2, textTransform:'uppercase', fontFamily:'DM Mono' }}>Copilot SGQ</span>
              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(109,40,217,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Zap size={14} color="#a78bfa"/>
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:20, fontWeight:600, color:'#fff', lineHeight:1.3, marginBottom:6 }}>Pergunte sobre<br/>o sistema</div>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.3)', margin:0, lineHeight:1.5 }}>Análises, NCs, calibrações e muito mais com IA.</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {SUGESTOES_IA.map((q, i) => (
                <div key={i} style={{ padding:'8px 12px', borderRadius:9, background:'rgba(255,255,255,.05)', border:'0.5px solid rgba(255,255,255,.08)', fontSize:11, color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <span>{q}</span>
                  <ArrowUpRight size={11} color="rgba(255,255,255,.25)"/>
                </div>
              ))}
            </div>
            <div style={{ marginTop:18, display:'flex', alignItems:'center', gap:6 }}>
              <Bot size={13} color="rgba(139,92,246,.7)"/>
              <span style={{ fontSize:11, color:'rgba(139,92,246,.7)' }}>Abrir Copilot SGQ →</span>
            </div>
          </div>
        </div>

        {/* ── MÉTRICAS RÁPIDAS ─────────────────────────── */}
        <div style={{ ...cs(300), marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,.28)', letterSpacing:2.5, textTransform:'uppercase', fontFamily:'DM Mono' }}>Resumo operacional</span>
            <button onClick={() => navigate('/dashboard')}
              style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(59,130,246,.7)', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color='#93c5fd'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(59,130,246,.7)'}>
              Ver painel gerencial <ArrowUpRight size={12}/>
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
            {METRICAS.map((m, i) => {
              const Icon = m.icon
              return (
                <div key={i} onClick={() => navigate(m.rota)}
                  style={{ padding:'16px 14px', borderRadius:14, background:'rgba(255,255,255,.03)', border:`0.5px solid ${m.cor}18`, cursor:'pointer', transition:'all .2s', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', gap:8 }}
                  onMouseEnter={e => { e.currentTarget.style.background=`${m.cor}12`; e.currentTarget.style.borderColor=`${m.cor}40`; e.currentTarget.style.transform='translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.03)'; e.currentTarget.style.borderColor=`${m.cor}18`; e.currentTarget.style.transform='translateY(0)' }}>
                  <div style={{ position:'absolute', top:0, left:0, bottom:0, width:2.5, background:m.cor, opacity:.6, borderRadius:'0 2px 2px 0' }}/>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <Icon size={15} color={m.cor} style={{ opacity:.9 }}/>
                    <ChevronRight size={11} color="rgba(255,255,255,.2)"/>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.85)', lineHeight:1.3, marginBottom:3 }}>{m.label}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.32)', lineHeight:1.4 }}>{m.detalhe}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── MAPA DOS SISTEMAS ─────────────────────────── */}
        <div style={{ ...cs(380) }}>
          <div style={{ marginBottom:14 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,.28)', letterSpacing:2.5, textTransform:'uppercase', fontFamily:'DM Mono' }}>Sistemas de gestão</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {MAPA_MODULOS.map((sys, i) => (
              <div key={i} style={{ padding:'20px', borderRadius:16, background:'rgba(255,255,255,.03)', border:`0.5px solid ${sys.cor}20`, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3, background:sys.cor, opacity:.5 }}/>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, paddingLeft:8 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:sys.cor, letterSpacing:2, fontFamily:'DM Mono' }}>{sys.label}</span>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,.25)', background:'rgba(255,255,255,.05)', padding:'2px 8px', borderRadius:20 }}>{sys.items.length} módulos</span>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingLeft:8 }}>
                  {sys.items.map((item, j) => (
                    <span key={j} style={{ fontSize:11, color:'rgba(255,255,255,.45)', padding:'4px 10px', borderRadius:8, background:'rgba(255,255,255,.05)', border:'0.5px solid rgba(255,255,255,.07)', whiteSpace:'nowrap' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
