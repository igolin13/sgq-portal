import { useState } from 'react'
import { Search, Plus, Eye, X, CheckCircle, AlertCircle, Clock, Wrench, ChevronDown, ChevronUp, Paperclip } from 'lucide-react'

const hoje = new Date('2026-03-22')

function diasParaVencer(dataStr) {
  if (!dataStr || dataStr === '—') return null
  const [d, m, a] = dataStr.split('/').map(Number)
  const data = new Date(a, m - 1, d)
  return Math.ceil((data - hoje) / (1000 * 60 * 60 * 24))
}

function statusCalc(i) {
  if (i.status === 'Reprovado') return 'reprovado'
  const dias = diasParaVencer(i.proximaCalib)
  if (dias === null) return 'sem_data'
  if (dias < 0)   return 'atrasado'
  if (dias <= 30) return 'vencendo'
  return 'ok'
}

function calcularConformidade(erroTotal, criterioAceit) {
  const e = parseFloat(erroTotal)
  const c = parseFloat(criterioAceit)
  if (isNaN(e) || isNaN(c) || c === 0) return ''
  return ((e / c) * 100).toFixed(1) + '%'
}

function calcularConclusao(erroTotal, criterioAceit) {
  const e = parseFloat(erroTotal)
  const c = parseFloat(criterioAceit)
  if (isNaN(e) || isNaN(c) || c === 0) return ''
  const conf = (e / c) * 100
  if (conf < 50) return 'Aumentar 10%'
  if (conf < 81) return 'Manter'
  return 'Diminuir 25%'
}

const statusCfg = {
  ok:        { bg:'bg-green-50',  text:'text-green-700',  dot:'bg-green-400',  label:'Em dia'       },
  vencendo:  { bg:'bg-amber-50',  text:'text-amber-700',  dot:'bg-amber-400',  label:'Vence em 30d' },
  atrasado:  { bg:'bg-red-50',    text:'text-red-600',    dot:'bg-red-400',    label:'Atrasado'     },
  reprovado: { bg:'bg-red-50',    text:'text-red-600',    dot:'bg-red-500',    label:'Reprovado'    },
  sem_data:  { bg:'bg-gray-100',  text:'text-gray-500',   dot:'bg-gray-300',   label:'Sem data'     },
}

const aprovCfg = {
  'Aprovado':  { bg:'bg-green-50', text:'text-green-700' },
  'Reprovado': { bg:'bg-red-50',   text:'text-red-600'   },
  'Pendente':  { bg:'bg-amber-50', text:'text-amber-700' },
}

const SETORES_CFG = [
  { setor:'Produção',   cor:'#185FA5', corBg:'#E6F1FB' },
  { setor:'Qualidade',  cor:'#0F6E56', corBg:'#E1F5EE' },
  { setor:'Manutenção', cor:'#712B13', corBg:'#FAECE7' },
  { setor:'Logística',  cor:'#854F0B', corBg:'#FAEEDA' },
]

const instrumentosIniciais = [
  { id:1,  setor:'Produção',   codigo:'P-1848 P', instrumento:'Paquímetro Digital',   escala:'0-300mm',   data:'23/06/2025', maiorIncerteza:0.00100, maiorDesvio:0.00100, erroTotal:0.0020, criterioAceit:0.08, unidade:'mm',  status:'Aprovado', conformidade:'2.5%',  conclusao:'Aumentar 10%', proximaCalib:'23/06/2026' },
  { id:2,  setor:'Produção',   codigo:'P-1201 M', instrumento:'Micrômetro Externo',   escala:'0-25mm',    data:'10/01/2025', maiorIncerteza:0.00050, maiorDesvio:0.00060, erroTotal:0.0010, criterioAceit:0.04, unidade:'mm',  status:'Aprovado', conformidade:'2.5%',  conclusao:'Aumentar 10%', proximaCalib:'10/01/2026' },
  { id:3,  setor:'Produção',   codigo:'P-2201 H', instrumento:'Higrômetro Digital',   escala:'0-100%',    data:'01/03/2026', maiorIncerteza:0.50000, maiorDesvio:0.40000, erroTotal:0.9000, criterioAceit:3.00, unidade:'%',   status:'Aprovado', conformidade:'30.0%', conclusao:'Aumentar 10%', proximaCalib:'01/04/2026' },
  { id:4,  setor:'Produção',   codigo:'P-0934 R', instrumento:'Régua Inox 500mm',     escala:'0-500mm',   data:'30/06/2025', maiorIncerteza:0.05000, maiorDesvio:0.04000, erroTotal:0.0900, criterioAceit:0.50, unidade:'mm',  status:'Aprovado', conformidade:'18.0%', conclusao:'Aumentar 10%', proximaCalib:'30/06/2026' },
  { id:5,  setor:'Qualidade',  codigo:'Q-0342 T', instrumento:'Termômetro Digital',   escala:'-50/300°C', data:'15/03/2026', maiorIncerteza:0.10000, maiorDesvio:0.08000, erroTotal:0.1800, criterioAceit:1.00, unidade:'°C',  status:'Aprovado', conformidade:'18.0%', conclusao:'Aumentar 10%', proximaCalib:'15/03/2027' },
  { id:6,  setor:'Qualidade',  codigo:'Q-0098 B', instrumento:'Balança Analítica',    escala:'0-220g',    data:'05/02/2026', maiorIncerteza:0.00020, maiorDesvio:0.00015, erroTotal:0.0004, criterioAceit:0.01, unidade:'g',   status:'Aprovado', conformidade:'4.0%',  conclusao:'Aumentar 10%', proximaCalib:'05/04/2026' },
  { id:7,  setor:'Qualidade',  codigo:'Q-0771 D', instrumento:'Durômetro Shore A',    escala:'0-100 SHA', data:'14/08/2025', maiorIncerteza:0.50000, maiorDesvio:0.30000, erroTotal:0.8000, criterioAceit:2.00, unidade:'SHA', status:'Aprovado', conformidade:'40.0%', conclusao:'Aumentar 10%', proximaCalib:'14/02/2026' },
  { id:8,  setor:'Manutenção', codigo:'M-0521 T', instrumento:'Torquímetro',          escala:'0-200Nm',   data:'20/11/2025', maiorIncerteza:0.50000, maiorDesvio:0.45000, erroTotal:0.9500, criterioAceit:4.00, unidade:'Nm',  status:'Aprovado', conformidade:'23.8%', conclusao:'Aumentar 10%', proximaCalib:'20/03/2026' },
  { id:9,  setor:'Manutenção', codigo:'M-0322 M', instrumento:'Manômetro Digital',    escala:'0-10bar',   data:'08/09/2025', maiorIncerteza:0.01000, maiorDesvio:0.00800, erroTotal:0.0180, criterioAceit:0.10, unidade:'bar', status:'Reprovado',conformidade:'18.0%', conclusao:'Substituir',   proximaCalib:'—'          },
  { id:10, setor:'Logística',  codigo:'L-0112 P', instrumento:'Paquímetro Analógico', escala:'0-150mm',   data:'12/12/2025', maiorIncerteza:0.02000, maiorDesvio:0.01500, erroTotal:0.0350, criterioAceit:0.20, unidade:'mm',  status:'Aprovado', conformidade:'17.5%', conclusao:'Aumentar 10%', proximaCalib:'12/04/2026' },
]

function contarStatus(lista) {
  return {
    ok:       lista.filter(i => statusCalc(i) === 'ok').length,
    vencendo: lista.filter(i => statusCalc(i) === 'vencendo').length,
    atrasado: lista.filter(i => ['atrasado','reprovado'].includes(statusCalc(i))).length,
  }
}

function FormularioCalib({ item, onSave, onClose }) {
  const [form, setForm] = useState({ ...item })

  function set(f, v) {
    setForm(p => {
      const novo = { ...p, [f]: v }
      const erro = parseFloat(f === 'erroTotal'     ? v : novo.erroTotal)
      const crit = parseFloat(f === 'criterioAceit' ? v : novo.criterioAceit)
      if (!isNaN(erro) && !isNaN(crit) && crit > 0) {
        const conf = (erro / crit) * 100
        novo.conformidade = conf.toFixed(1) + '%'
        novo.conclusao = conf < 50 ? 'Aumentar 10%' : conf < 81 ? 'Manter' : 'Diminuir 25%'
      }
      return novo
    })
  }

  const confVal = parseFloat(form.conformidade)
  const confColor =
    !isNaN(confVal) && confVal < 50 ? 'text-amber-600 bg-amber-50' :
    !isNaN(confVal) && confVal < 81 ? 'text-green-700 bg-green-50' :
    !isNaN(confVal)                 ? 'text-red-600 bg-red-50' :
    'text-gray-500 bg-gray-50'

  const concColor =
    form.conclusao === 'Manter'       ? 'text-green-700 bg-green-50' :
    form.conclusao === 'Diminuir 25%' ? 'text-red-600 bg-red-50' :
    form.conclusao === 'Substituir'   ? 'text-red-600 bg-red-50' :
    'text-amber-700 bg-amber-50'

  return (
    <div style={{ minHeight:500, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px 0', borderRadius:'var(--border-radius-lg)' }}>
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-2xl mx-4" style={{ maxHeight:'90vh', overflowY:'auto' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-medium text-gray-800">{form.codigo || 'Novo instrumento'} — {form.instrumento || 'Cadastro'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Setor: {form.setor} · Escala: {form.escala}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Identificação</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Código</label>
                <input value={form.codigo} onChange={e => set('codigo', e.target.value)}
                  placeholder="Ex: P-1848 P"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Setor</label>
                <select value={form.setor} onChange={e => set('setor', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                  {SETORES_CFG.map(s => <option key={s.setor}>{s.setor}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Instrumento</label>
                <input value={form.instrumento} onChange={e => set('instrumento', e.target.value)}
                  placeholder="Nome do instrumento"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Escala</label>
                <input value={form.escala} onChange={e => set('escala', e.target.value)}
                  placeholder="Ex: 0-300mm"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Unidade</label>
                <input value={form.unidade} onChange={e => set('unidade', e.target.value)}
                  placeholder="Ex: mm, °C, bar"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                  <option>Aprovado</option>
                  <option>Reprovado</option>
                  <option>Pendente</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Datas</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Data da calibração</label>
                <input type="date"
                  value={form.data && form.data !== '—' ? form.data.split('/').reverse().join('-') : ''}
                  onChange={e => { const [a,m,d] = e.target.value.split('-'); set('data',`${d}/${m}/${a}`) }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Próxima calibração</label>
                <input type="date"
                  value={form.proximaCalib && form.proximaCalib !== '—' ? form.proximaCalib.split('/').reverse().join('-') : ''}
                  onChange={e => { const [a,m,d] = e.target.value.split('-'); set('proximaCalib',`${d}/${m}/${a}`) }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Resultados metrológicos</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'Maior Incerteza', field:'maiorIncerteza' },
                { label:'Maior Desvio',    field:'maiorDesvio'    },
                { label:'Erro Total',      field:'erroTotal'      },
                { label:'Critério de Aceitação', field:'criterioAceit' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1.5">{label} ({form.unidade || '—'})</label>
                  <input type="number" step="0.00001" value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Resultados calculados
              <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">preenchidos automaticamente</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Conformidade <span className="text-gray-400">(Erro Total ÷ Critério × 100)</span>
                </label>
                <input value={form.conformidade} readOnly
                  className={`w-full text-sm border border-transparent rounded-lg px-3 py-2 font-medium cursor-not-allowed ${confColor}`} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Conclusão / Periodicidade <span className="text-gray-400">(automático)</span>
                </label>
                <input value={form.conclusao} readOnly
                  className={`w-full text-sm border border-transparent rounded-lg px-3 py-2 font-medium cursor-not-allowed ${concColor}`} />
              </div>
            </div>
            {form.conformidade && (
              <div className="mt-3 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                <span>Regra aplicada:</span>
                <span className="font-medium text-gray-700">
                  {parseFloat(form.conformidade) < 50
                    ? 'Conformidade < 50% → Aumentar 10%'
                    : parseFloat(form.conformidade) < 81
                    ? 'Conformidade entre 50% e 80% → Manter'
                    : 'Conformidade ≥ 81% → Diminuir 25%'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">Certificado / Evidência</label>
            <div className="flex gap-2">
              <input placeholder="Nome ou número do certificado de calibração..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
                <Paperclip size={13} />Anexar
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose}
              className="flex-1 text-sm border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={() => onSave(form)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#0c447c] transition-colors">
              <CheckCircle size={15} />Salvar calibração
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Calibracao() {
  const [instrumentos, setInstrumentos] = useState(instrumentosIniciais)
  const [abertos, setAbertos]           = useState({ Produção: true })
  const [search, setSearch]             = useState('')
  const [itemAtivo, setItemAtivo]       = useState(null)

  const stats = {
    total:    instrumentos.length,
    ok:       instrumentos.filter(i => statusCalc(i) === 'ok').length,
    vencendo: instrumentos.filter(i => statusCalc(i) === 'vencendo').length,
    criticos: instrumentos.filter(i => ['atrasado','reprovado'].includes(statusCalc(i))).length,
  }

  const alertas = instrumentos.filter(i => ['atrasado','reprovado','vencendo'].includes(statusCalc(i)))

  function salvar(form) {
    setInstrumentos(prev => prev.map(i => i.id === form.id ? form : i))
    setItemAtivo(null)
  }

  function toggle(setor) {
    setAbertos(prev => ({ ...prev, [setor]: !prev[setor] }))
  }

  if (itemAtivo) return <FormularioCalib item={itemAtivo} onSave={salvar} onClose={() => setItemAtivo(null)} />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><Wrench size={18} className="text-blue-600" /></div>
          <div><p className="text-xs text-gray-400">Total</p><p className="text-xl font-medium text-gray-800">{stats.total}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><CheckCircle size={18} className="text-green-600" /></div>
          <div><p className="text-xs text-gray-400">Em dia</p><p className="text-xl font-medium text-green-700">{stats.ok}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-amber-500" /></div>
          <div><p className="text-xs text-gray-400">Vencendo</p><p className="text-xl font-medium text-amber-600">{stats.vencendo}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><AlertCircle size={18} className="text-red-500" /></div>
          <div><p className="text-xs text-gray-400">Atrasados/Reprov.</p><p className="text-xl font-medium text-red-600">{stats.criticos}</p></div>
        </div>
      </div>

      {alertas.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 space-y-1.5">
          <p className="text-xs font-medium text-red-600 flex items-center gap-1.5 mb-2">
            <AlertCircle size={13} />
            {alertas.length} instrumento{alertas.length > 1 ? 's' : ''} requer{alertas.length === 1 ? '' : 'em'} atenção
          </p>
          {alertas.map(i => {
            const st   = statusCalc(i)
            const s    = statusCfg[st]
            const dias = diasParaVencer(i.proximaCalib)
            return (
              <div key={i.id} onClick={() => setItemAtivo(i)}
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                <span className="text-xs text-red-700 flex-1">{i.instrumento} <span className="text-red-400">· {i.setor}</span></span>
                <span className="text-xs text-red-500">
                  {st === 'reprovado' ? 'Reprovado — substituir' :
                   dias !== null && dias < 0 ? `${Math.abs(dias)}d atrasado` :
                   dias !== null ? `Vence em ${dias}d` : ''}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar instrumento ou código..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400" />
        </div>
        <button
          onClick={() => setItemAtivo({ id:Date.now(), setor:'Produção', codigo:'', instrumento:'', escala:'', data:'', maiorIncerteza:'', maiorDesvio:'', erroTotal:'', criterioAceit:'', unidade:'mm', status:'Aprovado', conformidade:'', conclusao:'', proximaCalib:'' })}
          className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors whitespace-nowrap">
          <Plus size={14} />Novo instrumento
        </button>
      </div>

      <div className="space-y-3">
        {SETORES_CFG.map(({ setor, cor, corBg }) => {
          const lista = instrumentos.filter(i => {
            const matchSetor  = i.setor === setor
            const matchSearch = !search ||
              i.instrumento.toLowerCase().includes(search.toLowerCase()) ||
              i.codigo.toLowerCase().includes(search.toLowerCase())
            return matchSetor && matchSearch
          })

          if (search && lista.length === 0) return null

          const isOpen = !!abertos[setor]
          const counts = contarStatus(lista)

          return (
            <div key={setor} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button onClick={() => toggle(setor)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                  style={{ background: corBg, color: cor }}>
                  {setor.substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-medium text-gray-800">{setor}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{lista.length} instrumento{lista.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {counts.ok > 0 && (
                      <span className="text-[11px] text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />{counts.ok} em dia
                      </span>
                    )}
                    {counts.vencendo > 0 && (
                      <span className="text-[11px] text-amber-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />{counts.vencendo} vencendo
                      </span>
                    )}
                    {counts.atrasado > 0 && (
                      <span className="text-[11px] text-red-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />{counts.atrasado} atrasado{counts.atrasado > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ color: cor }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {(isOpen || search) && lista.length > 0 && (
                <div className="border-t border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm" style={{ tableLayout:'fixed', minWidth:860 }}>
                    <thead>
                      <tr className="bg-gray-50/70">
                        <th className="text-left text-xs text-gray-400 font-medium px-5 py-2.5" style={{width:110}}>Código</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:185}}>Instrumento</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:90}}>Escala</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:80}}>Erro Total</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:80}}>Critério</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:90}}>Conform.</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:110}}>Próx. Calib.</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:90}}>Aprovação</th>
                        <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5" style={{width:90}}>Status</th>
                        <th style={{width:36}} />
                      </tr>
                    </thead>
                    <tbody>
                      {lista.map(i => {
                        const st   = statusCalc(i)
                        const s    = statusCfg[st]
                        const ap   = aprovCfg[i.status] || aprovCfg['Pendente']
                        const dias = diasParaVencer(i.proximaCalib)
                        const confVal = parseFloat(i.conformidade)
                        const confColor =
                          !isNaN(confVal) && confVal < 50 ? 'text-amber-600' :
                          !isNaN(confVal) && confVal < 81 ? 'text-green-700' :
                          !isNaN(confVal)                 ? 'text-red-600'   : 'text-gray-400'
                        return (
                          <tr key={i.id} onClick={() => setItemAtivo(i)}
                            className="border-t border-gray-50 hover:bg-gray-50/40 transition-colors cursor-pointer">
                            <td className="px-5 py-3 font-mono text-xs text-gray-500">{i.codigo}</td>
                            <td className="px-4 py-3 text-xs text-gray-800 truncate">{i.instrumento}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{i.escala}</td>
                            <td className="px-4 py-3 text-xs font-mono text-gray-600">{i.erroTotal}</td>
                            <td className="px-4 py-3 text-xs font-mono text-gray-600">{i.criterioAceit}</td>
                            <td className={`px-4 py-3 text-xs font-medium ${confColor}`}>{i.conformidade || '—'}</td>
                            <td className="px-4 py-3 text-xs">
                              <div className="text-gray-600">{i.proximaCalib || '—'}</div>
                              {dias !== null && dias >= 0 && dias <= 30 && <div className="text-amber-500 text-[10px]">{dias}d restantes</div>}
                              {dias !== null && dias < 0 && <div className="text-red-500 text-[10px]">{Math.abs(dias)}d atrasado</div>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ap.bg} ${ap.text}`}>{i.status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                            </td>
                            <td className="px-4 py-3"><Eye size={14} className="text-gray-300" /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}