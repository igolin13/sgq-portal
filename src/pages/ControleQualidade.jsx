import { useState } from 'react'
import { ScanSearch, ListChecks, ClipboardCheck } from 'lucide-react'
import Selecao  from './controle/Selecao'
import Inspecao from './controle/Inspecao'

const COR    = '#f59e0b'
const COR_DK = '#92400e'
const COR_BG = '#fffbeb'

export default function ControleQualidade() {
  const [aba, setAba] = useState('selecao')

  const abas = [
    { id:'selecao',  icon: ScanSearch,   label:'Seleção'  },
    { id:'inspecao', icon: ListChecks,   label:'Inspeção' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:"'DM Sans', sans-serif" }}>

      {/* ── Cabeçalho ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg, ${COR}, #d97706)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${COR}50` }}>
            <ClipboardCheck size={26} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:'#1f2937', lineHeight:1.2 }}>Controle de Qualidade</div>
            <div style={{ fontSize:13, color:'#9ca3af', marginTop:2 }}>Seleção · Inspeção · Liberação</div>
          </div>
        </div>

        {/* Badge CQ */}
        <div style={{ padding:'6px 16px', borderRadius:20, background:COR_BG, border:`1.5px solid #fde68a`, fontSize:12, fontWeight:700, color:COR_DK, letterSpacing:0.5 }}>
          CQ — Controle de Qualidade
        </div>
      </div>

      {/* ── Abas principais ── */}
      <div style={{ display:'flex', gap:0, background:'#fff', borderRadius:14, padding:6, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', width:'fit-content' }}>
        {abas.map(({ id, icon: Icon, label }) => {
          const ativo = aba === id
          return (
            <button key={id} onClick={() => setAba(id)}
              style={{
                display:'flex', alignItems:'center', gap:10, padding:'11px 28px',
                borderRadius:10, border:'none', cursor:'pointer', transition:'all .2s',
                background: ativo ? COR : 'transparent',
                color: ativo ? '#fff' : '#6b7280',
                fontWeight: ativo ? 700 : 500,
                fontSize: 15,
                boxShadow: ativo ? `0 3px 10px ${COR}40` : 'none',
              }}>
              <Icon size={18}/>
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Conteúdo da aba ── */}
      <div style={{ animation:'fadeIn .2s ease' }}>
        {aba === 'selecao'  && <Selecao/>}
        {aba === 'inspecao' && <Inspecao/>}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
