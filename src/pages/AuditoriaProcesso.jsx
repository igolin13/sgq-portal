import { useState } from 'react'
import { Plus, Search, Eye, X, CheckCircle, Clock, AlertCircle, Calendar, ChevronLeft, ChevronRight, Paperclip, ClipboardCheck } from 'lucide-react'

const SETORES = ['Produção', 'Qualidade', 'Logística', 'Manutenção', 'RH', 'Administrativo']
const TURNOS  = ['Manhã', 'Tarde', 'Noite']
const TIPOS   = ['Auditoria de Processo', 'Auditoria de Produto', 'Auditoria de Sistema', 'Auditoria de Fornecedor']

const semanas = [
  { label: 'Semana 1', inicio: '03/03/26', fim: '07/03/26' },
  { label: 'Semana 2', inicio: '10/03/26', fim: '14/03/26' },
  { label: 'Semana 3', inicio: '17/03/26', fim: '21/03/26' },
  { label: 'Semana 4', inicio: '24/03/26', fim: '28/03/26' },
]

const planejamento = [
  { id:'P01', semana:0, setor:'Produção',      tipo:'Auditoria de Processo',    auditor:'Igor Bittencourt', turno:'Manhã',  data:'03/03/26', status:'concluida' },
  { id:'P02', semana:0, setor:'Qualidade',     tipo:'Auditoria de Sistema',     auditor:'Maria Silva',      turno:'Tarde',  data:'05/03/26', status:'concluida' },
  { id:'P03', semana:0, setor:'Logística',     tipo:'Auditoria de Processo',    auditor:'Igor Bittencourt', turno:'Manhã',  data:'07/03/26', status:'concluida' },
  { id:'P04', semana:1, setor:'Manutenção',    tipo:'Auditoria de Produto',     auditor:'Carlos Mendes',    turno:'Manhã',  data:'10/03/26', status:'concluida' },
  { id:'P05', semana:1, setor:'Produção',      tipo:'Auditoria de Processo',    auditor:'Igor Bittencourt', turno:'Noite',  data:'12/03/26', status:'concluida' },
  { id:'P06', semana:1, setor:'RH',            tipo:'Auditoria de Sistema',     auditor:'Ana Ferreira',     turno:'Tarde',  data:'14/03/26', status:'nao_realizada' },
  { id:'P07', semana:2, setor:'Produção',      tipo:'Auditoria de Processo',    auditor:'Igor Bittencourt', turno:'Manhã',  data:'17/03/26', status:'concluida' },
  { id:'P08', semana:2, setor:'Logística',     tipo:'Auditoria de Fornecedor',  auditor:'Maria Silva',      turno:'Tarde',  data:'19/03/26', status:'concluida' },
  { id:'P09', semana:2, setor:'Qualidade',     tipo:'Auditoria de Produto',     auditor:'Igor Bittencourt', turno:'Manhã',  data:'21/03/26', status:'concluida' },
  { id:'P10', semana:3, setor:'Produção',      tipo:'Auditoria de Processo',    auditor:'Igor Bittencourt', turno:'Manhã',  data:'24/03/26', status:'aberta' },
  { id:'P11', semana:3, setor:'Manutenção',    tipo:'Auditoria de Processo',    auditor:'Carlos Mendes',    turno:'Tarde',  data:'25/03/26', status:'aberta' },
  { id:'P12', semana:3, setor:'Administrativo',tipo:'Auditoria de Sistema',     auditor:'Ana Ferreira',     turno:'Manhã',  data:'26/03/26', status:'aberta' },
  { id:'P13', semana:3, setor:'Qualidade',     tipo:'Auditoria de Produto',     auditor:'Maria Silva',      turno:'Tarde',  data:'28/03/26', status:'aberta' },
]

const auditoriasConcluidas = [
  {
    id:'A01', codigo:'AUD-001', setor:'Produção',  tipo:'Auditoria de Processo', data:'03/03/26',
    auditor:'Igor Bittencourt', turno:'Manhã', conformidades: 12, naoConformidades: 3, observacoes: 1,
    descricao:'Auditoria do processo de pasteurização linha 2.',
    achados:'3 NCs abertas relacionadas ao controle de temperatura. Operadores sem EPI adequado.',
    acoes:'Treinamento de EPI realizado. NCs registradas no sistema.',
    resultado:'Parcialmente conforme', evidencia:'Relatório AUD-001.pdf',
  },
  {
    id:'A02', codigo:'AUD-002', setor:'Qualidade', tipo:'Auditoria de Sistema', data:'05/03/26',
    auditor:'Maria Silva', turno:'Tarde', conformidades: 18, naoConformidades: 1, observacoes: 2,
    descricao:'Auditoria do sistema de gestão da qualidade — requisitos ISO.',
    achados:'1 NC relacionada ao controle de registros (POP-001 desatualizado).',
    acoes:'POP-001 revisado e aprovado em 10/03.',
    resultado:'Conforme', evidencia:'Relatório AUD-002.pdf',
  },
  {
    id:'A03', codigo:'AUD-003', setor:'Logística', tipo:'Auditoria de Processo', data:'07/03/26',
    auditor:'Igor Bittencourt', turno:'Manhã', conformidades: 9, naoConformidades: 4, observacoes: 0,
    descricao:'Auditoria do processo de expedição e rastreabilidade.',
    achados:'4 NCs — falhas no registro de rastreabilidade de lotes expedidos.',
    acoes:'Implantação de novo checklist de expedição. Treinamento previsto para 15/03.',
    resultado:'Não conforme', evidencia:'Relatório AUD-003.pdf',
  },
]

const statusCfg = {
  aberta:        { bg:'bg-blue-50',   text:'text-blue-600',   dot:'bg-blue-400',   label:'Em aberto'     },
  concluida:     { bg:'bg-green-50',  text:'text-green-700',  dot:'bg-green-400',  label:'Concluída'     },
  nao_realizada: { bg:'bg-red-50',    text:'text-red-600',    dot:'bg-red-400',    label:'Não realizada' },
}

const resultadoCfg = {
  'Conforme':            { bg:'bg-green-50', text:'text-green-700' },
  'Parcialmente conforme':{ bg:'bg-amber-50', text:'text-amber-700' },
  'Não conforme':        { bg:'bg-red-50',   text:'text-red-600'   },
}

const corSetor = {
  'Produção':      '#185FA5',
  'Qualidade':     '#0F6E56',
  'Logística':     '#854F0B',
  'Manutenção':    '#712B13',
  'RH':            '#534AB7',
  'Administrativo':'#5F5E5A',
}

const bgSetor = {
  'Produção':      '#E6F1FB',
  'Qualidade':     '#E1F5EE',
  'Logística':     '#FAEEDA',
  'Manutenção':    '#FAECE7',
  'RH':            '#EEEDFE',
  'Administrativo':'#F1EFE8',
}

function FormularioAuditoria({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    conformidades: '', naoConformidades: '', observacoes: '',
    descricao: '', achados: '', acoes: '', resultado: '', evidencia: '',
    ...item,
  })
  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  return (
    <div style={{ minHeight:500, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px 0', borderRadius:'var(--border-radius-lg)' }}>
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-2xl mx-4" style={{ maxHeight:'90vh', overflowY:'auto' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-medium text-gray-800">{item.codigo || 'Nova Auditoria'} — {item.setor}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{item.tipo} · {item.data} · Turno: {item.turno}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Dados do planejamento</p>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-gray-400">Setor:</span> <span className="font-medium text-gray-700">{item.setor}</span></div>
              <div><span className="text-gray-400">Auditor:</span> <span className="font-medium text-gray-700">{item.auditor}</span></div>
              <div><span className="text-gray-400">Data:</span> <span className="font-medium text-gray-700">{item.data}</span></div>
              <div><span className="text-gray-400">Turno:</span> <span className="font-medium text-gray-700">{item.turno}</span></div>
              <div className="col-span-2"><span className="text-gray-400">Tipo:</span> <span className="font-medium text-gray-700">{item.tipo}</span></div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Descrição do escopo</p>
            <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva o escopo e objetivos desta auditoria..." rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none" />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Resultado quantitativo</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Conformidades', field:'conformidades', color:'text-green-600', bg:'bg-green-50' },
                { label:'Não conformidades', field:'naoConformidades', color:'text-red-600', bg:'bg-red-50' },
                { label:'Observações', field:'observacoes', color:'text-amber-600', bg:'bg-amber-50' },
              ].map(({ label, field, color, bg }) => (
                <div key={field} className={`${bg} rounded-lg p-3 text-center`}>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <input type="number" min="0" value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    className={`w-full text-center text-xl font-medium bg-transparent border-none outline-none ${color}`} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Achados da auditoria</p>
            <textarea value={form.achados} onChange={e => set('achados', e.target.value)}
              placeholder="Descreva os achados, pontos fortes e oportunidades de melhoria..." rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none" />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ações requeridas</p>
            <textarea value={form.acoes} onChange={e => set('acoes', e.target.value)}
              placeholder="Liste as ações corretivas e preventivas necessárias..." rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Resultado geral</p>
              <select value={form.resultado} onChange={e => set('resultado', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                <option value="">Selecione...</option>
                <option>Conforme</option>
                <option>Parcialmente conforme</option>
                <option>Não conforme</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Evidência / Relatório</p>
              <div className="flex gap-2">
                <input value={form.evidencia} onChange={e => set('evidencia', e.target.value)}
                  placeholder="Nome do arquivo..." className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                <button className="flex items-center gap-1 text-xs border border-gray-200 px-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
                  <Paperclip size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button onClick={() => onSave({ ...form, status:'aberta' })}
              className="flex-1 text-sm border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Salvar rascunho
            </button>
            <button onClick={() => onSave({ ...form, status:'concluida' })}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle size={15} />Concluir auditoria
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NovaAuditoriaForm({ onSave, onClose }) {
  const [form, setForm] = useState({ setor:'Produção', tipo:TIPOS[0], auditor:'', turno:'Manhã', data:'', semana:3 })
  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  return (
    <div style={{ minHeight:400, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px 0', borderRadius:'var(--border-radius-lg)' }}>
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Planejar nova auditoria</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Setor</label>
              <select value={form.setor} onChange={e => set('setor', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {SETORES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Turno</label>
              <select value={form.turno} onChange={e => set('turno', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {TURNOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Tipo de auditoria</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Auditor responsável</label>
              <input value={form.auditor} onChange={e => set('auditor', e.target.value)}
                placeholder="Nome do auditor"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Data prevista</label>
              <input type="date" value={form.data} onChange={e => set('data', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Semana</label>
              <select value={form.semana} onChange={e => set('semana', Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {semanas.map((s, i) => <option key={i} value={i}>{s.label} ({s.inicio} — {s.fim})</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 text-sm border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600">Cancelar</button>
            <button onClick={() => onSave({ ...form, id:`P${Date.now()}`, status:'aberta', codigo:`AUD-${String(Date.now()).slice(-3)}` })}
              className="flex-1 flex items-center justify-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#0c447c] transition-colors">
              <Plus size={14} />Adicionar ao cronograma
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuditoriaProcesso() {
  const [aba, setAba] = useState('planejamento')
  const [semanaAtiva, setSemanaAtiva] = useState(3)
  const [plano, setPlano] = useState(planejamento)
  const [concluidas, setConcluidas] = useState(auditoriasConcluidas)
  const [itemAtivo, setItemAtivo] = useState(null)
  const [novaAuditoria, setNovaAuditoria] = useState(false)
  const [search, setSearch] = useState('')
  const [filtroSetor, setFiltroSetor] = useState('todos')

  const abertas = plano.filter(p => p.status === 'aberta')
  const totalConcluidas = plano.filter(p => p.status === 'concluida').length
  const naoRealizadas = plano.filter(p => p.status === 'nao_realizada').length

  function salvarAuditoria(form) {
    if (form.status === 'concluida') {
      setPlano(prev => prev.map(p => p.id === itemAtivo.id ? { ...p, status:'concluida' } : p))
      setConcluidas(prev => [{
        id: `A${Date.now()}`, codigo: itemAtivo.codigo || `AUD-${String(Date.now()).slice(-3)}`,
        setor: itemAtivo.setor, tipo: itemAtivo.tipo, data: itemAtivo.data,
        auditor: itemAtivo.auditor, turno: itemAtivo.turno,
        ...form,
      }, ...prev])
    }
    setItemAtivo(null)
  }

  function adicionarAuditoria(form) {
    setPlano(prev => [...prev, form])
    setNovaAuditoria(false)
  }

  const semanaPlano = plano.filter(p => p.semana === semanaAtiva)
  const filtrarConcluidas = concluidas.filter(c => {
    const matchSearch = c.codigo.toLowerCase().includes(search.toLowerCase()) ||
                        c.setor.toLowerCase().includes(search.toLowerCase())
    const matchSetor  = filtroSetor === 'todos' || c.setor === filtroSetor
    return matchSearch && matchSetor
  })

  if (itemAtivo && !novaAuditoria) return <FormularioAuditoria item={itemAtivo} onSave={salvarAuditoria} onClose={() => setItemAtivo(null)} />
  if (novaAuditoria) return <NovaAuditoriaForm onSave={adicionarAuditoria} onClose={() => setNovaAuditoria(false)} />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck size={18} className="text-blue-600" />
          </div>
          <div><p className="text-xs text-gray-400">Em aberto</p><p className="text-xl font-medium text-blue-600">{abertas.length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <div><p className="text-xs text-gray-400">Concluídas</p><p className="text-xl font-medium text-green-700">{totalConcluidas}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <div><p className="text-xs text-gray-400">Não realizadas</p><p className="text-xl font-medium text-red-600">{naoRealizadas}</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex bg-white border border-gray-100 rounded-lg p-1 gap-1">
          {[
            { id:'planejamento', label:'Cronograma' },
            { id:'abertas',      label:`Em aberto (${abertas.length})` },
            { id:'concluidas',   label:`Concluídas (${concluidas.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setAba(t.id)}
              className={`text-sm px-4 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                aba === t.id ? 'bg-[#185FA5] text-white font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}>{t.label}</button>
          ))}
        </div>
        <button onClick={() => setNovaAuditoria(true)}
          className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors whitespace-nowrap">
          <Plus size={14} />Planejar auditoria
        </button>
      </div>

      {aba === 'planejamento' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
            <button onClick={() => setSemanaAtiva(s => Math.max(0, s-1))} className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
              <ChevronLeft size={16} />
            </button>
            <div className="flex-1 flex gap-2">
              {semanas.map((s, i) => (
                <button key={i} onClick={() => setSemanaAtiva(i)}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-medium transition-colors ${
                    semanaAtiva === i ? 'bg-[#185FA5] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                  <div>{s.label}</div>
                  <div className={`text-[10px] mt-0.5 ${semanaAtiva === i ? 'text-blue-200' : 'text-gray-400'}`}>{s.inicio} — {s.fim}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setSemanaAtiva(s => Math.min(3, s+1))} className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {semanaPlano.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
                Nenhuma auditoria planejada para esta semana.
              </div>
            )}
            {semanaPlano.map(p => {
              const s = statusCfg[p.status]
              return (
                <div key={p.id} onClick={() => p.status === 'aberta' && setItemAtivo(p)}
                  className={`bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 ${p.status === 'aberta' ? 'cursor-pointer hover:border-blue-200 hover:shadow-sm' : ''} transition-all`}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: bgSetor[p.setor], color: corSetor[p.setor] }}>
                    {p.setor.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-800">{p.setor}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{p.tipo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={11} />{p.data}</span>
                      <span>Turno: {p.turno}</span>
                      <span>Auditor: {p.auditor}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${s.bg} ${s.text}`}>{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {aba === 'abertas' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-amber-700">
            <Clock size={16} className="flex-shrink-0" />
            <span><strong>{abertas.length} auditorias</strong> aguardando execução e preenchimento.</span>
          </div>
          {abertas.map(a => {
            const s = statusCfg[a.status]
            return (
              <div key={a.id} onClick={() => setItemAtivo(a)}
                className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-blue-400" />
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: bgSetor[a.setor], color: corSetor[a.setor] }}>
                  {a.setor.substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-800">{a.setor}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{a.tipo}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} />{a.data}</span>
                    <span>Turno: {a.turno}</span>
                    <span>Auditor: {a.auditor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{semanas[a.semana]?.label}</span>
                  <Eye size={15} className="text-gray-300" />
                </div>
              </div>
            )
          })}
          {abertas.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
              Nenhuma auditoria em aberto.
            </div>
          )}
        </div>
      )}

      {aba === 'concluidas' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por código ou setor..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400" />
            </div>
            <select value={filtroSetor} onChange={e => setFiltroSetor(e.target.value)}
              className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none">
              <option value="todos">Todos os setores</option>
              {SETORES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {filtrarConcluidas.map(c => {
              const r = resultadoCfg[c.resultado] || { bg:'bg-gray-100', text:'text-gray-500' }
              return (
                <div key={c.id} onClick={() => setItemAtivo({ ...c, status:'concluida' })}
                  className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-green-200 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: bgSetor[c.setor], color: corSetor[c.setor] }}>
                    {c.setor.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-500">{c.codigo}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-sm font-medium text-gray-800">{c.setor}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{c.tipo}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar size={11} />{c.data}</span>
                      <span className="flex items-center gap-1 text-green-600"><CheckCircle size={11} />{c.conformidades} conformes</span>
                      <span className="flex items-center gap-1 text-red-500"><AlertCircle size={11} />{c.naoConformidades} NCs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.bg} ${r.text}`}>{c.resultado}</span>
                    <Eye size={15} className="text-gray-300" />
                  </div>
                </div>
              )
            })}
            {filtrarConcluidas.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
                Nenhuma auditoria concluída encontrada.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}