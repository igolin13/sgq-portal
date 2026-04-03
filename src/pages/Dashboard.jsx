import { useState, useEffect } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { ChevronDown, Calendar, Filter } from 'lucide-react'

// ── UTILITÁRIOS ───────────────────────────────────────────────────
function sensoRadar(r) {
  return r.map(x => ({ s: x.s, v: x.v }))
}

// ── DADOS POR MÊS ─────────────────────────────────────────────────
const MESES   = ['Jan/26','Fev/26','Mar/26','Abr/26','Mai/26','Jun/26']
const SEMANAS = ['Semana 1','Semana 2','Semana 3','Semana 4']

const dadosPorMes = {
  'Jan/26': {
    kpis:[
      { label:'NCs em aberto',    value:22, sub:'7 em atraso',       trend:-1, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Documentos ativos',value:139,sub:'+1 este mês',       trend:+1, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📄' },
      { label:'Riscos críticos',  value:10, sub:'3 sem responsável', trend:+2, cor:'#f59e0b', corBg:'rgba(245,158,11,.12)', icon:'🛡' },
      { label:'Calibrações ok',   value:6,  sub:'4 vencendo',        trend:-2, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🔧' },
    ],
    progresso:[28,55,60,75],
    radar:[{s:'Seiri',v:7},{s:'Seiton',v:7},{s:'Seiso',v:7},{s:'Seiketsu',v:7},{s:'Shitsuke',v:8}],
    alertas:[
      { tipo:'danger', msg:'NC-038 — Temperatura fora do spec',    sub:'Produção · Atrasado 2 dias',  acao:'Abrir NC'       },
      { tipo:'warn',   msg:'Calibração Paquímetro P-1201 vencida', sub:'Produção · Revisar urgente',  acao:'Ver calibração' },
      { tipo:'info',   msg:'Planejamento Jan iniciado',             sub:'3 treinamentos planejados',   acao:'Ver plano'      },
    ],
    proximas:[
      { cat:'Treinamento',  cor:'#3b82f6', bg:'rgba(59,130,246,.15)', titulo:'Treinamento BPF',        data:'10/01', resp:'Igor Bittencourt' },
      { cat:'Análise Mat.', cor:'#10b981', bg:'rgba(16,185,129,.15)', titulo:'Análise microbiológica', data:'15/01', resp:'Maria Silva'      },
    ],
    setor5s:[{s:'Litografia',nota:7.4,cor:'#3b82f6'},{s:'Qualidade',nota:8.5,cor:'#10b981'},{s:'Manutenção',nota:7.5,cor:'#f59e0b'},{s:'Área',nota:7.1,cor:'#8b5cf6'}],
    modulos:[
      {mod:'Documentos',val:'139',sub:'ativos',      cor:'#3b82f6',pct:93},
      {mod:'NCs',       val:'22', sub:'em aberto',   cor:'#ef4444',pct:38},
      {mod:'Riscos',    val:'34', sub:'mapeados',    cor:'#f59e0b',pct:70},
      {mod:'5S',        val:'7.6',sub:'média geral', cor:'#10b981',pct:76},
      {mod:'Calibração',val:'10', sub:'instrumentos',cor:'#8b5cf6',pct:60},
      {mod:'Planejamento',val:'15%',sub:'concluído', cor:'#06b6d4',pct:15},
    ],
  },
  'Fev/26': {
    kpis:[
      { label:'NCs em aberto',    value:20, sub:'6 em atraso',       trend:-2, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Documentos ativos',value:140,sub:'+1 este mês',       trend:+1, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📄' },
      { label:'Riscos críticos',  value:9,  sub:'2 sem responsável', trend:-1, cor:'#f59e0b', corBg:'rgba(245,158,11,.12)', icon:'🛡' },
      { label:'Calibrações ok',   value:7,  sub:'3 vencendo',        trend:+1, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🔧' },
    ],
    progresso:[30,58,65,78],
    radar:[{s:'Seiri',v:7.5},{s:'Seiton',v:8},{s:'Seiso',v:7.5},{s:'Seiketsu',v:7},{s:'Shitsuke',v:8}],
    alertas:[
      { tipo:'danger', msg:'NC-040 — Divergência inventário',  sub:'Logística · Atrasado 1 dia',  acao:'Abrir NC'      },
      { tipo:'warn',   msg:'Risco R-15 — Prazo vence amanhã', sub:'Logística · Ação pendente',   acao:'Ver risco'     },
      { tipo:'info',   msg:'Auditoria interna SGQ concluída',  sub:'3 achados registrados',        acao:'Ver resultado' },
    ],
    proximas:[
      { cat:'Auditoria',    cor:'#f59e0b', bg:'rgba(245,158,11,.15)', titulo:'Auditoria Interna SGQ',  data:'14/02', resp:'Igor Bittencourt' },
      { cat:'Análise Mat.', cor:'#10b981', bg:'rgba(16,185,129,.15)', titulo:'Análise físico-química', data:'20/02', resp:'Maria Silva'      },
    ],
    setor5s:[{s:'Litografia',nota:7.1,cor:'#3b82f6'},{s:'Qualidade',nota:8.8,cor:'#10b981'},{s:'Manutenção',nota:7.8,cor:'#f59e0b'},{s:'Área',nota:7.3,cor:'#8b5cf6'}],
    modulos:[
      {mod:'Documentos',val:'140',sub:'ativos',      cor:'#3b82f6',pct:94},
      {mod:'NCs',       val:'20', sub:'em aberto',   cor:'#ef4444',pct:40},
      {mod:'Riscos',    val:'34', sub:'mapeados',    cor:'#f59e0b',pct:72},
      {mod:'5S',        val:'7.8',sub:'média geral', cor:'#10b981',pct:78},
      {mod:'Calibração',val:'10', sub:'instrumentos',cor:'#8b5cf6',pct:65},
      {mod:'Planejamento',val:'24%',sub:'concluído', cor:'#06b6d4',pct:24},
    ],
  },
  'Mar/26': {
    kpis:[
      { label:'NCs em aberto',    value:18, sub:'5 em atraso',       trend:-2, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Documentos ativos',value:142,sub:'+3 este mês',       trend:+3, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📄' },
      { label:'Riscos críticos',  value:8,  sub:'2 sem responsável', trend:-1, cor:'#f59e0b', corBg:'rgba(245,158,11,.12)', icon:'🛡' },
      { label:'Calibrações ok',   value:7,  sub:'3 vencendo',        trend:0,  cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🔧' },
    ],
    progresso:[32,64,70,81],
    radar:[{s:'Seiri',v:8},{s:'Seiton',v:8},{s:'Seiso',v:8},{s:'Seiketsu',v:8},{s:'Shitsuke',v:9}],
    alertas:[
      { tipo:'danger', msg:'NC-045 — Lote sem rastreabilidade', sub:'Logística · Atrasado 4 dias',   acao:'Abrir NC'       },
      { tipo:'danger', msg:'Manômetro M-0322 reprovado',        sub:'Manutenção · Substituir',       acao:'Ver calibração' },
      { tipo:'warn',   msg:'POP-012 vence em 7 dias',           sub:'Calibração · Revisão pendente', acao:'Ver documento'  },
      { tipo:'warn',   msg:'Risco R-08 sem responsável',        sub:'Gestão de Risco · Crítico',     acao:'Atribuir'       },
      { tipo:'info',   msg:'5S Litografia — Env 1 em dia',      sub:'Nota: 8.2 · Realizada hoje',    acao:'Ver resultado'  },
    ],
    proximas:[
      { cat:'Treinamento',  cor:'#3b82f6', bg:'rgba(59,130,246,.15)', titulo:'Treinamento BPF — Produção', data:'24/03', resp:'Igor Bittencourt' },
      { cat:'Auditoria BPF',cor:'#f59e0b', bg:'rgba(245,158,11,.15)', titulo:'BPF — Área de produção',     data:'26/03', resp:'Igor Bittencourt' },
      { cat:'Ext. / Cert.', cor:'#8b5cf6', bg:'rgba(139,92,246,.15)', titulo:'MAPA / Vigilância',          data:'28/03', resp:'Igor Bittencourt' },
      { cat:'Análise Mat.', cor:'#10b981', bg:'rgba(16,185,129,.15)', titulo:'Análise microbiológica MP',  data:'01/04', resp:'Maria Silva'      },
    ],
    setor5s:[{s:'Litografia',nota:7.8,cor:'#3b82f6'},{s:'Qualidade',nota:9.1,cor:'#10b981'},{s:'Manutenção',nota:8.0,cor:'#f59e0b'},{s:'Área',nota:7.6,cor:'#8b5cf6'}],
    modulos:[
      {mod:'Documentos',val:'142',sub:'ativos',      cor:'#3b82f6',pct:95},
      {mod:'NCs',       val:'18', sub:'em aberto',   cor:'#ef4444',pct:42},
      {mod:'Riscos',    val:'34', sub:'mapeados',    cor:'#f59e0b',pct:76},
      {mod:'5S',        val:'8.1',sub:'média geral', cor:'#10b981',pct:81},
      {mod:'Calibração',val:'10', sub:'instrumentos',cor:'#8b5cf6',pct:70},
      {mod:'Planejamento',val:'32%',sub:'concluído', cor:'#06b6d4',pct:32},
    ],
  },
  'Abr/26': {
    kpis:[
      { label:'NCs em aberto',    value:15, sub:'3 em atraso',       trend:-3, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Documentos ativos',value:143,sub:'+1 este mês',       trend:+1, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📄' },
      { label:'Riscos críticos',  value:7,  sub:'1 sem responsável', trend:-1, cor:'#f59e0b', corBg:'rgba(245,158,11,.12)', icon:'🛡' },
      { label:'Calibrações ok',   value:8,  sub:'2 vencendo',        trend:+1, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🔧' },
    ],
    progresso:[40,70,75,83],
    radar:[{s:'Seiri',v:8.5},{s:'Seiton',v:8},{s:'Seiso',v:8.5},{s:'Seiketsu',v:8},{s:'Shitsuke',v:9}],
    alertas:[
      { tipo:'warn', msg:'POP-012 revisão vencida', sub:'Qualidade · Pendente', acao:'Ver documento' },
      { tipo:'info', msg:'ISO 9001 — Preparação iniciada', sub:'Auditoria em Agosto', acao:'Ver plano' },
    ],
    proximas:[
      { cat:'Análise Mat.', cor:'#10b981', bg:'rgba(16,185,129,.15)', titulo:'Análise microbiológica', data:'05/04', resp:'Igor Bittencourt' },
      { cat:'Calibração',   cor:'#8b5cf6', bg:'rgba(139,92,246,.15)', titulo:'Calibração semestral',   data:'10/04', resp:'Carlos Mendes'    },
    ],
    setor5s:[{s:'Litografia',nota:8.0,cor:'#3b82f6'},{s:'Qualidade',nota:9.2,cor:'#10b981'},{s:'Manutenção',nota:8.2,cor:'#f59e0b'},{s:'Área',nota:7.8,cor:'#8b5cf6'}],
    modulos:[
      {mod:'Documentos',val:'143',sub:'ativos',      cor:'#3b82f6',pct:96},
      {mod:'NCs',       val:'15', sub:'em aberto',   cor:'#ef4444',pct:35},
      {mod:'Riscos',    val:'33', sub:'mapeados',    cor:'#f59e0b',pct:78},
      {mod:'5S',        val:'8.3',sub:'média geral', cor:'#10b981',pct:83},
      {mod:'Calibração',val:'10', sub:'instrumentos',cor:'#8b5cf6',pct:75},
      {mod:'Planejamento',val:'40%',sub:'concluído', cor:'#06b6d4',pct:40},
    ],
  },
}

const dadosPorSemana = {
  'Semana 1': {
    ncLabel:'Semana 1 · 03–07/Mar',
    kpis:[
      { label:'NCs abertas',     value:20, sub:'3 em atraso',      trend: 0, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Auditorias',      value:3,  sub:'2 concluídas',     trend:+2, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📋' },
      { label:'Calibrações',     value:2,  sub:'realizadas',       trend:+2, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🔧' },
      { label:'Treinamentos',    value:1,  sub:'BPF realizado',    trend:+1, cor:'#8b5cf6', corBg:'rgba(139,92,246,.12)', icon:'📚' },
    ],
    alertas:[
      { tipo:'info',   msg:'Auditoria BPF Produção concluída', sub:'Sem NCs abertas',        acao:'Ver'      },
      { tipo:'warn',   msg:'NC-041 aberta — Temperatura',      sub:'Produção · Prazo: 17/03',acao:'Abrir NC' },
    ],
    proximas:[
      { cat:'Análise Mat.', cor:'#10b981', bg:'rgba(16,185,129,.15)', titulo:'Análise microbiológica', data:'10/03', resp:'Igor Bittencourt' },
    ],
  },
  'Semana 2': {
    ncLabel:'Semana 2 · 10–14/Mar',
    kpis:[
      { label:'NCs abertas',     value:19, sub:'4 em atraso',      trend:-1, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Auditorias',      value:3,  sub:'2 concluídas',     trend: 0, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📋' },
      { label:'Calibrações',     value:1,  sub:'realizada',        trend: 0, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🔧' },
      { label:'Documentos',      value:2,  sub:'revisados',        trend:+2, cor:'#8b5cf6', corBg:'rgba(139,92,246,.12)', icon:'📄' },
    ],
    alertas:[
      { tipo:'danger', msg:'NC-043 — Produto fora spec pH',    sub:'Produção · Atrasado',     acao:'Abrir NC' },
      { tipo:'warn',   msg:'Auditoria RH não realizada',       sub:'Semana 2 · Reagendar',    acao:'Planejar' },
    ],
    proximas:[
      { cat:'BPF', cor:'#f59e0b', bg:'rgba(245,158,11,.15)', titulo:'BPF Estoque', data:'17/03', resp:'Maria Silva' },
    ],
  },
  'Semana 3': {
    ncLabel:'Semana 3 · 17–21/Mar',
    kpis:[
      { label:'NCs abertas',     value:18, sub:'5 em atraso',      trend:-1, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Auditorias',      value:3,  sub:'3 concluídas',     trend:+1, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📋' },
      { label:'5S realizados',   value:2,  sub:'Lito + Qualidade', trend:+2, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'✅' },
      { label:'Riscos revisados',value:3,  sub:'1 mitigado',       trend:+1, cor:'#8b5cf6', corBg:'rgba(139,92,246,.12)', icon:'🛡' },
    ],
    alertas:[
      { tipo:'danger', msg:'NC-045 — Rastreabilidade', sub:'Logística · 4 dias atraso', acao:'Abrir NC' },
      { tipo:'info',   msg:'5S Qualidade: nota 9.1',   sub:'Melhor semana do ano',      acao:'Ver'      },
    ],
    proximas:[
      { cat:'Treinamento', cor:'#3b82f6', bg:'rgba(59,130,246,.15)', titulo:'Treinamento BPF', data:'24/03', resp:'Igor Bittencourt' },
    ],
  },
  'Semana 4': {
    ncLabel:'Semana 4 · 24–28/Mar',
    kpis:[
      { label:'NCs abertas',     value:18, sub:'5 em atraso',     trend: 0, cor:'#ef4444', corBg:'rgba(239,68,68,.12)',  icon:'⚠' },
      { label:'Planejadas',      value:4,  sub:'auditorias',      trend: 0, cor:'#3b82f6', corBg:'rgba(59,130,246,.12)', icon:'📋' },
      { label:'Certificações',   value:1,  sub:'MAPA prevista',   trend: 0, cor:'#10b981', corBg:'rgba(16,185,129,.12)', icon:'🏅' },
      { label:'Treinamentos',    value:1,  sub:'BPF planejado',   trend: 0, cor:'#8b5cf6', corBg:'rgba(139,92,246,.12)', icon:'📚' },
    ],
    alertas:[
      { tipo:'warn', msg:'MAPA / Vigilância — 28/03',    sub:'Documentação em revisão', acao:'Preparar' },
      { tipo:'warn', msg:'Manômetro M-0322 pendente',    sub:'Substituição urgente',    acao:'Ver'      },
    ],
    proximas:[
      { cat:'Treinamento',  cor:'#3b82f6', bg:'rgba(59,130,246,.15)', titulo:'Treinamento BPF',   data:'24/03', resp:'Igor Bittencourt' },
      { cat:'Auditoria BPF',cor:'#f59e0b', bg:'rgba(245,158,11,.15)', titulo:'BPF — Produção',    data:'25/03', resp:'Igor Bittencourt' },
      { cat:'Ext. / Cert.', cor:'#8b5cf6', bg:'rgba(139,92,246,.15)', titulo:'MAPA / Vigilância', data:'28/03', resp:'Igor Bittencourt' },
    ],
  },
}

const ncTrendGlobal = [
  {mes:'Out',v:24},{mes:'Nov',v:21},{mes:'Dez',v:19},
  {mes:'Jan',v:22},{mes:'Fev',v:20},{mes:'Mar',v:18},
]

// ── COMPONENTES ───────────────────────────────────────────────────
function Counter({ value }) {
  const [d, setD] = useState(0)
  useEffect(() => {
    let s = 0
    const step = value / 75
    const t = setInterval(() => {
      s += step
      if (s >= value) { setD(value); clearInterval(t) }
      else setD(Math.floor(s))
    }, 16)
    return () => clearInterval(t)
  }, [value])
  return <span>{d}</span>
}

function AnimBar({ pct, cor, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(pct), delay + 400)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div style={{ height:6, background:'rgba(255,255,255,.08)', borderRadius:99, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${w}%`, background:cor, borderRadius:99, transition:`width 1s ease ${delay}ms` }}/>
    </div>
  )
}

function Dropdown({ label, options, value, onChange, icon }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:10, background:value?'rgba(59,130,246,.2)':'rgba(255,255,255,.06)', border:`0.5px solid ${value?'rgba(59,130,246,.4)':'rgba(255,255,255,.12)'}`, color:value?'#93c5fd':'rgba(255,255,255,.6)', fontSize:12, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s' }}>
        {icon}
        <span>{value || label}</span>
        <ChevronDown size={13} style={{ transform:open?'rotate(180deg)':'none', transition:'transform .2s' }}/>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, background:'#0f1829', border:'0.5px solid rgba(255,255,255,.12)', borderRadius:10, overflow:'hidden', zIndex:100, minWidth:160, boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
          <button onClick={() => { onChange(null); setOpen(false) }}
            style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:12, color:'rgba(255,255,255,.4)', background:'transparent', border:'none', cursor:'pointer', borderBottom:'0.5px solid rgba(255,255,255,.06)' }}>
            Todos
          </button>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:12, color:value===opt?'#93c5fd':'rgba(255,255,255,.7)', background:value===opt?'rgba(59,130,246,.1)':'transparent', border:'none', cursor:'pointer', borderBottom:'0.5px solid rgba(255,255,255,.04)' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────────
export default function Dashboard() {
  const [mounted, setMounted]     = useState(false)
  const [mesSel, setMesSel]       = useState('Mar/26')
  const [semanaSel, setSemanaSel] = useState(null)

  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  const isSemana = !!semanaSel
  const dados    = isSemana
    ? dadosPorSemana[semanaSel]
    : (dadosPorMes[mesSel] || dadosPorMes['Mar/26'])

  const kpis    = dados.kpis
  const alertas = dados.alertas
  const proximas= dados.proximas

  const progresso = isSemana ? null : [
    { label:'Planejamento Anual', pct:dados.progresso[0], cor:'#3b82f6' },
    { label:'NCs Resolvidas',     pct:dados.progresso[1], cor:'#10b981' },
    { label:'Calibrações em dia', pct:dados.progresso[2], cor:'#f59e0b' },
    { label:'5S — Média Geral',   pct:dados.progresso[3], cor:'#8b5cf6' },
  ]

  const setor5s  = isSemana ? null : dados.setor5s
  const modulos  = isSemana ? null : dados.modulos
  const radar5s  = isSemana ? null : sensoRadar(dados.radar)

  const periodoLabel = isSemana
    ? `${semanaSel} · ${dadosPorSemana[semanaSel].ncLabel.split('·')[1]?.trim()}`
    : mesSel

  const temFiltro = mesSel !== 'Mar/26' || semanaSel !== null

  const cs = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms`,
  })

  function limparFiltros() { setMesSel('Mar/26'); setSemanaSel(null) }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:'100vh', background:'linear-gradient(135deg,#0a0f1e 0%,#0d1628 50%,#0a1020 100%)', padding:0, margin:'-20px', color:'#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* Fundo */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:600, height:600, background:'radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 70%)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:400, height:400, background:'radial-gradient(circle,rgba(139,92,246,.05) 0%,transparent 70%)', borderRadius:'50%' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1, padding:'28px 24px', maxWidth:1400 }}>

        {/* HEADER */}
        <div style={{ ...cs(0), display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12, position:'relative', zIndex:50 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981' }}/>
              <span style={{ fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:2, textTransform:'uppercase', fontFamily:'DM Mono' }}>Sistema Ativo · Sincronizado</span>
            </div>
            <h1 style={{ fontSize:28, fontWeight:700, margin:0, letterSpacing:-0.5, background:'linear-gradient(135deg,#fff 0%,rgba(255,255,255,.7) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Portal SGQ
            </h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.35)', margin:'4px 0 0' }}>
              Gestão da Qualidade · {isSemana ? `${semanaSel} de Março/2026` : mesSel}
            </p>
          </div>

          {/* FILTROS */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.1)', fontSize:11, color:'rgba(255,255,255,.4)' }}>
                <Filter size={12}/>
                <span style={{ fontFamily:'DM Mono', letterSpacing:1 }}>FILTRAR POR</span>
              </div>
              <Dropdown
                label="Mês" options={MESES}
                value={mesSel !== 'Mar/26' && !semanaSel ? mesSel : semanaSel ? null : null}
                onChange={v => { if (v) { setMesSel(v); setSemanaSel(null) } else setMesSel('Mar/26') }}
                icon={<Calendar size={13}/>}
              />
              <Dropdown
                label="Semana" options={SEMANAS}
                value={semanaSel}
                onChange={v => { setSemanaSel(v); if (v) setMesSel('Mar/26') }}
                icon={<span style={{ fontSize:12 }}>📅</span>}
              />
              {temFiltro && (
                <button onClick={limparFiltros}
                  style={{ padding:'8px 12px', borderRadius:10, background:'rgba(239,68,68,.1)', border:'0.5px solid rgba(239,68,68,.2)', color:'#ef4444', fontSize:11, cursor:'pointer', fontWeight:500 }}>
                  Limpar
                </button>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:20, background:isSemana?'rgba(139,92,246,.15)':'rgba(59,130,246,.12)', border:`0.5px solid ${isSemana?'rgba(139,92,246,.3)':'rgba(59,130,246,.25)'}`, fontSize:11, color:isSemana?'#c4b5fd':'#93c5fd', fontFamily:'DM Mono' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:isSemana?'#8b5cf6':'#3b82f6', boxShadow:`0 0 6px ${isSemana?'#8b5cf6':'#3b82f6'}` }}/>
              {isSemana ? semanaSel : mesSel} · ATIVO
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {kpis.map((k, i) => (
            <div key={k.label} style={{ ...cs(100 + i*70), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px', position:'relative', overflow:'hidden', cursor:'pointer', transition:'background .2s,border-color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,.08)' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:k.cor, opacity:.8 }}/>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:k.corBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{k.icon}</div>
                <span style={{ fontSize:10, padding:'3px 7px', borderRadius:20, background:k.trend>0?'rgba(16,185,129,.15)':k.trend<0?'rgba(239,68,68,.15)':'rgba(255,255,255,.08)', color:k.trend>0?'#10b981':k.trend<0?'#ef4444':'rgba(255,255,255,.4)', fontFamily:'DM Mono' }}>
                  {k.trend > 0 ? `+${k.trend}` : k.trend < 0 ? k.trend : '—'}
                </span>
              </div>
              <div style={{ fontSize:36, fontWeight:700, lineHeight:1, color:k.cor, marginBottom:4, fontFamily:'DM Mono' }}>
                <Counter value={k.value}/>
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', fontWeight:500, marginBottom:2 }}>{k.label}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* LINHA 2: Gráfico + Alertas */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:14, marginBottom:20 }}>
          <div style={{ ...cs(300), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:2 }}>NCs em aberto</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>
                  {isSemana ? dadosPorSemana[semanaSel].ncLabel : 'Últimos 6 meses · tendência de queda'}
                </div>
              </div>
              <div style={{ fontSize:28, fontWeight:700, color:'#10b981' }}>↓11%</div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={ncTrendGlobal}>
                <defs>
                  <linearGradient id="ncG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fontSize:10, fill:'rgba(255,255,255,.3)' }} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[10,30]}/>
                <Tooltip contentStyle={{ background:'#1a2035', border:'0.5px solid rgba(255,255,255,.1)', borderRadius:8, fontSize:11 }} labelStyle={{ color:'rgba(255,255,255,.6)' }} itemStyle={{ color:'#3b82f6' }}/>
                <Area type="monotone" dataKey="v" name="NCs" stroke="#3b82f6" strokeWidth={2} fill="url(#ncG)" dot={{ fill:'#3b82f6', r:3 }} activeDot={{ r:5, fill:'#fff' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cs(350), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)' }}>Alertas · {periodoLabel}</div>
              <div style={{ fontSize:10, padding:'3px 8px', borderRadius:20, background:'rgba(239,68,68,.15)', color:'#ef4444', fontFamily:'DM Mono' }}>
                {alertas.filter(a => a.tipo === 'danger').length} urgentes
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {alertas.map((a, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, background:a.tipo==='danger'?'rgba(239,68,68,.07)':a.tipo==='warn'?'rgba(245,158,11,.07)':'rgba(59,130,246,.07)', border:`0.5px solid ${a.tipo==='danger'?'rgba(239,68,68,.2)':a.tipo==='warn'?'rgba(245,158,11,.2)':'rgba(59,130,246,.2)'}` }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:a.tipo==='danger'?'#ef4444':a.tipo==='warn'?'#f59e0b':'#3b82f6', flexShrink:0, boxShadow:`0 0 6px ${a.tipo==='danger'?'#ef4444':a.tipo==='warn'?'#f59e0b':'#3b82f6'}` }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.85)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.msg}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.3)' }}>{a.sub}</div>
                  </div>
                  <span style={{ fontSize:10, color:a.tipo==='danger'?'#ef4444':a.tipo==='warn'?'#f59e0b':'#3b82f6', whiteSpace:'nowrap', cursor:'pointer' }}>{a.acao} →</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LINHA 3 — visão mensal */}
        {!isSemana && radar5s && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.1fr', gap:14, marginBottom:20 }}>
            <div style={{ ...cs(400), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:4 }}>Gestão 5S — {mesSel}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:12 }}>Radar comparativo por setor</div>
              <ResponsiveContainer width="100%" height={170}>
                <RadarChart data={radar5s}>
                  <PolarGrid stroke="rgba(255,255,255,.08)"/>
                  <PolarAngleAxis dataKey="s" tick={{ fontSize:10, fill:'rgba(255,255,255,.4)' }}/>
                  <Radar name="Nota" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} dot={false}/>
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:6, flexWrap:'wrap' }}>
                {setor5s.map(s => (
                  <span key={s.s} style={{ fontSize:10, color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:s.cor, display:'inline-block' }}/>
                    {s.s}: <span style={{ color:s.cor, fontWeight:600, fontFamily:'DM Mono' }}>{s.nota}</span>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ ...cs(440), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:4 }}>Indicadores</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:20 }}>Progresso acumulado {mesSel}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                {progresso.map((p, i) => (
                  <div key={p.label}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,.7)', fontWeight:500 }}>{p.label}</span>
                      <span style={{ fontSize:12, fontWeight:600, fontFamily:'DM Mono', color:p.cor }}>{p.pct}%</span>
                    </div>
                    <AnimBar pct={p.pct} cor={p.cor} delay={i * 100}/>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...cs(480), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)' }}>Planejamento anual</div>
                <span style={{ fontSize:10, padding:'3px 8px', borderRadius:20, background:'rgba(59,130,246,.15)', color:'#3b82f6', fontFamily:'DM Mono' }}>{dados.progresso[0]}% concluído</span>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:16 }}>Próximas atividades previstas</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {proximas.map((t, i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,.03)', border:'0.5px solid rgba(255,255,255,.06)' }}>
                    <div style={{ width:3, borderRadius:2, alignSelf:'stretch', background:t.cor, flexShrink:0 }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                        <span style={{ fontSize:9, padding:'2px 6px', borderRadius:10, background:t.bg, color:t.cor, fontWeight:600, letterSpacing:.5, textTransform:'uppercase' }}>{t.cat}</span>
                      </div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.titulo}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:2 }}>{t.resp}</div>
                    </div>
                    <div style={{ fontSize:11, fontFamily:'DM Mono', color:t.cor, flexShrink:0, fontWeight:600 }}>{t.data}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISÃO SEMANA */}
        {isSemana && (
          <div style={{ ...cs(380), display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
            <div style={{ background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:14 }}>Atividades da {semanaSel}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {proximas.map((t, i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,.03)', border:'0.5px solid rgba(255,255,255,.06)' }}>
                    <div style={{ width:3, borderRadius:2, alignSelf:'stretch', background:t.cor, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:9, padding:'2px 6px', borderRadius:10, background:t.bg, color:t.cor, fontWeight:600, display:'inline-block', marginBottom:3, textTransform:'uppercase', letterSpacing:.5 }}>{t.cat}</span>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:500 }}>{t.titulo}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.3)' }}>{t.resp}</div>
                    </div>
                    <div style={{ fontSize:12, fontFamily:'DM Mono', color:t.cor, fontWeight:600 }}>{t.data}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:4 }}>Semanas de Março/26</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:16 }}>Navegue entre as semanas</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {SEMANAS.map((s, i) => {
                  const isAtual = s === 'Semana 3'
                  const isSel   = s === semanaSel
                  return (
                    <button key={s} onClick={() => setSemanaSel(s)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:isSel?'rgba(59,130,246,.15)':'rgba(255,255,255,.03)', border:`0.5px solid ${isSel?'rgba(59,130,246,.3)':isAtual?'rgba(255,255,255,.12)':'rgba(255,255,255,.06)'}`, cursor:'pointer', transition:'all .15s' }}>
                      <span style={{ fontSize:12, fontWeight:isSel?600:400, color:isSel?'#93c5fd':'rgba(255,255,255,.6)' }}>{s}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        {isAtual && <span style={{ fontSize:9, padding:'2px 6px', borderRadius:8, background:'rgba(16,185,129,.15)', color:'#10b981', fontFamily:'DM Mono' }}>ATUAL</span>}
                        <span style={{ fontSize:10, color:'rgba(255,255,255,.3)', fontFamily:'DM Mono' }}>
                          {['03–07/Mar','10–14/Mar','17–21/Mar','24–28/Mar'][i]}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* MÓDULOS — visão mensal */}
        {!isSemana && modulos && (
          <div style={{ ...cs(520), background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:16, padding:'20px', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:2 }}>Status geral dos módulos · {mesSel}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>Visão consolidada · sincronizado com TOTVS</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}/>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>Todos os sistemas online</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
              {modulos.map(m => (
                <div key={m.mod} style={{ textAlign:'center', padding:'14px 10px', borderRadius:12, background:'rgba(255,255,255,.03)', border:'0.5px solid rgba(255,255,255,.06)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${m.pct}%`, background:`${m.cor}10`, maxHeight:'100%' }}/>
                  <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ fontSize:22, fontWeight:700, color:m.cor, fontFamily:'DM Mono', marginBottom:2 }}>{m.val}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.7)', marginBottom:1 }}>{m.mod}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.3)' }}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ ...cs(560), display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 4px' }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,.2)', fontFamily:'DM Mono' }}>SGQ PORTAL v1.0 · TOTVS SYNC · AZURE STATIC APPS</span>
          <span style={{ fontSize:10, color:'rgba(255,255,255,.2)', fontFamily:'DM Mono' }}>IGOR BITTENCOURT · GESTÃO DA QUALIDADE</span>
        </div>
      </div>
    </div>
  )
}