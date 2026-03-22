import { useState } from 'react'
import { Plus, Search, X, CheckCircle, Clock, AlertCircle, Paperclip, ChevronRight, AlertTriangle } from 'lucide-react'

const MAQUINAS     = ['', 'Env 1', 'Env 3', 'Env 5', 'Env 6', 'Lito 2', 'Lito 4', 'Lito 5', 'Lito 6']
const EFICACIA_OPTS = ['', 'Eficaz', 'Parcialmente eficaz', 'Não eficaz — reabrir NC']

// ─── VALIDAÇÃO ────────────────────────────────────────────────────
function validarNC(form) {
  const erros = []
  // Aba 1
  if (!form.nCliente?.trim())       erros.push({ aba:'nc',          campo:'Nº Cliente'           })
  if (!form.cliente?.trim())        erros.push({ aba:'nc',          campo:'Cliente'              })
  if (!form.tipo?.trim())           erros.push({ aba:'nc',          campo:'Tipo'                 })
  if (!form.situacao?.trim())       erros.push({ aba:'nc',          campo:'Situação'             })
  if (!form.dataAbertura?.trim())   erros.push({ aba:'nc',          campo:'Data de abertura'     })
  // Aba 2
  if (!form.operacional?.qtdReclamada?.trim()) erros.push({ aba:'operacional', campo:'Quantidade reclamada' })
  if (!form.operacional?.dataProd?.trim())     erros.push({ aba:'operacional', campo:'Data de produção'     })
  if (!form.operacional?.maquina?.trim())      erros.push({ aba:'operacional', campo:'Máquina'              })
  if (!form.operacional?.operador?.trim())     erros.push({ aba:'operacional', campo:'Operador'             })
  // Aba 3
  if (!form.eficacia?.causaRaiz?.trim())       erros.push({ aba:'eficacia', campo:'Análise de causa'      })
  if (!form.eficacia?.acaoContencao?.trim())   erros.push({ aba:'eficacia', campo:'Ação de contenção'     })
  if (!form.eficacia?.acaoCorrecao?.trim())    erros.push({ aba:'eficacia', campo:'Ação de correção'      })
  if (!form.eficacia?.acaoPreventiva?.trim())  erros.push({ aba:'eficacia', campo:'Ação preventiva'       })
  if (!form.eficacia?.prazoAcao?.trim())       erros.push({ aba:'eficacia', campo:'Prazo da ação'         })
  if (!form.eficacia?.dataRealizada?.trim())   erros.push({ aba:'eficacia', campo:'Data realizada'        })
  if (!form.eficacia?.evidencia?.trim())       erros.push({ aba:'eficacia', campo:'Evidência'             })
  if (!form.eficacia?.avaliacao?.trim())       erros.push({ aba:'eficacia', campo:'Avaliação de eficácia' })
  return erros
}

function pendentesAba(erros, abaId) {
  return erros.filter(e => e.aba === abaId).length
}

// ─── UTILITÁRIOS ──────────────────────────────────────────────────
function addDiasUteis(dataBase, dias) {
  let d = new Date(dataBase), count = 0
  while (count < dias) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) count++
  }
  return d
}

function parseDataBR(str) {
  if (!str || str === 'N/A' || str === '—') return null
  const p = str.split('/')
  if (p.length !== 3) return null
  return new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]))
}

function formatDataBR(date) { return date ? date.toLocaleDateString('pt-BR') : '—' }

function calcularPrazo(dataAbertura, dataAmostra) {
  const base = dataAmostra && dataAmostra !== 'N/A' && dataAmostra !== ''
    ? parseDataBR(dataAmostra) : parseDataBR(dataAbertura)
  return base ? addDiasUteis(base, 7) : null
}

function diasAtraso(prazo) {
  if (!prazo) return null
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  return Math.ceil((hoje - prazo) / (1000*60*60*24))
}

// ─── CORES ────────────────────────────────────────────────────────
const tipoCor = {
  'Externa':    { bg:'bg-blue-50',   text:'text-blue-600'   },
  'Interna':    { bg:'bg-amber-50',  text:'text-amber-700'  },
  'Fornecedor': { bg:'bg-purple-50', text:'text-purple-700' },
}
const sitCor = {
  'Aberta':              { bg:'bg-blue-50',  text:'text-blue-600',  dot:'bg-blue-400'  },
  'Em análise':          { bg:'bg-amber-50', text:'text-amber-700', dot:'bg-amber-400' },
  'Em andamento':        { bg:'bg-amber-50', text:'text-amber-700', dot:'bg-amber-400' },
  'Aguardando amostra':  { bg:'bg-gray-100', text:'text-gray-500',  dot:'bg-gray-400'  },
  'Encerrada':           { bg:'bg-green-50', text:'text-green-700', dot:'bg-green-400' },
}

// ─── DADOS FICTÍCIOS ──────────────────────────────────────────────
const ncIniciais = [
  { id:1, rnc:'154/2025', nCliente:'44', cliente:'Pampeano', tipo:'Externa', defeito:'Falha na aplicação do verniz', classificacao:'Não Conformidade Existente', situacao:'Em análise', dataAbertura:'30/12/2025', dataAmostra:'N/A', responsavel:'Litografia', area:'Litografia', origem:'Sistema', retornoResposta:'', operacional:{ qtdReclamada:'', dataProd:'', maquina:'', operador:'', operadorEstufa:'', observacao:'' }, eficacia:{ causaRaiz:'', acaoContencao:'', acaoCorrecao:'', acaoPreventiva:'', prazoAcao:'', dataRealizada:'', evidencia:'', avaliacao:'', resultado:'' } },
  { id:2, rnc:'155/2025', nCliente:'12', cliente:'Ambev', tipo:'Externa', defeito:'Rótulo com impressão borrada', classificacao:'Não Conformidade Nova', situacao:'Aberta', dataAbertura:'05/01/2026', dataAmostra:'08/01/2026', responsavel:'Impressão', area:'Impressão', origem:'Sistema', retornoResposta:'', operacional:{ qtdReclamada:'500', dataProd:'02/01/2026', maquina:'Lito 4', operador:'João Silva', operadorEstufa:'Carlos M.', observacao:'Lote afetado: L-2024' }, eficacia:{ causaRaiz:'Desgaste do cilindro', acaoContencao:'Segregação do lote', acaoCorrecao:'Substituição do cilindro', acaoPreventiva:'Revisão do plano de manutenção', prazoAcao:'2026-01-20', dataRealizada:'18/01/2026', evidencia:'Relatório técnico', avaliacao:'Eficaz', resultado:'Nova amostra aprovada pelo cliente' } },
  { id:3, rnc:'157/2026', nCliente:'33', cliente:'Natura', tipo:'Externa', defeito:'Embalagem com rebarba na solda', classificacao:'Não Conformidade Existente', situacao:'Aguardando amostra', dataAbertura:'01/03/2026', dataAmostra:'', responsavel:'Solda', area:'Embalagem', origem:'Sistema', retornoResposta:'', operacional:{ qtdReclamada:'', dataProd:'', maquina:'', operador:'', operadorEstufa:'', observacao:'' }, eficacia:{ causaRaiz:'', acaoContencao:'', acaoCorrecao:'', acaoPreventiva:'', prazoAcao:'', dataRealizada:'', evidencia:'', avaliacao:'', resultado:'' } },
  { id:4, rnc:'158/2026', nCliente:'F-012', cliente:'Químicos do Sul', tipo:'Fornecedor', defeito:'Matéria-prima fora da especificação de viscosidade', classificacao:'Não Conformidade Nova', situacao:'Aberta', dataAbertura:'15/03/2026', dataAmostra:'17/03/2026', responsavel:'Igor Bittencourt', area:'Qualidade', origem:'Portal', retornoResposta:'', operacional:{ qtdReclamada:'', dataProd:'', maquina:'', operador:'', operadorEstufa:'', observacao:'' }, eficacia:{ causaRaiz:'', acaoContencao:'', acaoCorrecao:'', acaoPreventiva:'', prazoAcao:'', dataRealizada:'', evidencia:'', avaliacao:'', resultado:'' } },
]
const ncEncerradasIniciais = [
  { id:10, rnc:'150/2025', nCliente:'22', cliente:'BRF', tipo:'Externa', defeito:'Cor fora do padrão aprovado', classificacao:'Não Conformidade Existente', situacao:'Encerrada', dataAbertura:'10/11/2025', dataAmostra:'12/11/2025', responsavel:'Igor Bittencourt', area:'Litografia', origem:'Sistema', retornoResposta:'23/11/2025', operacional:{ qtdReclamada:'1200', dataProd:'05/11/2025', maquina:'Lito 2', operador:'Pedro A.', operadorEstufa:'', observacao:'Lote L-1198' }, eficacia:{ causaRaiz:'Troca de fornecedor de tinta sem validação prévia', acaoContencao:'Segregação e retrabalho do lote', acaoCorrecao:'Validação do novo fornecedor', acaoPreventiva:'Processo de qualificação obrigatório', prazoAcao:'2025-11-25', dataRealizada:'23/11/2025', evidencia:'Relatório de validação v1.2', avaliacao:'Eficaz', resultado:'Cor aprovada em nova amostra' } },
]

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────
function CampoSistema({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || '—'}</p>
    </div>
  )
}

function CampoObrigatorio({ label, erro, children }) {
  return (
    <div>
      <label className={`block text-xs mb-1.5 font-medium ${erro ? 'text-red-500' : 'text-gray-500'}`}>
        {label} {erro && <span className="text-red-400 font-normal">(obrigatório)</span>}
      </label>
      {children}
      {erro && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertTriangle size={11} />Campo obrigatório</p>}
    </div>
  )
}

// ─── FORMULÁRIO ───────────────────────────────────────────────────
function FormularioNC({ nc, onSave, onClose }) {
  const [aba, setAba]       = useState('nc')
  const [form, setForm]     = useState({ ...nc, operacional:{...nc.operacional}, eficacia:{...nc.eficacia} })
  const [tentouEncerrar, setTentouEncerrar] = useState(false)
  const [errosSalvar, setErrosSalvar]       = useState([])

  function set(f, v)  { setForm(p => ({ ...p, [f]: v })) }
  function setOp(f,v) { setForm(p => ({ ...p, operacional: { ...p.operacional, [f]: v } })) }
  function setEf(f,v) { setForm(p => ({ ...p, eficacia:    { ...p.eficacia,    [f]: v } })) }

  const prazo    = calcularPrazo(form.dataAbertura, form.dataAmostra)
  const dias     = diasAtraso(prazo)
  const prazoStr = prazo ? formatDataBR(prazo) : '—'
  const tipoC    = tipoCor[form.tipo]    || tipoCor['Interna']
  const sitC     = sitCor[form.situacao] || sitCor['Aberta']

  const errosTodos   = validarNC(form)
  const mostrarErros = tentouEncerrar ? errosTodos : errosSalvar

  function handleEncerrar() {
    setTentouEncerrar(true)
    const erros = validarNC(form)
    if (erros.length > 0) {
      setErrosSalvar(erros)
      const primeiraAba = erros[0].aba
      setAba(primeiraAba)
      return
    }
    onSave({ ...form, situacao:'Encerrada' })
  }

  function handleSalvar() {
    onSave({ ...form })
  }

  function temErroNaAba(abaId) {
    return mostrarErros.some(e => e.aba === abaId)
  }

  function campoErro(campo) {
    return mostrarErros.some(e => e.campo === campo)
  }

  const inputClass = (campo) =>
    `w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${
      campoErro(campo)
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-gray-200 focus:border-blue-400'
    }`

  const selectClass = (campo) =>
    `w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${
      campoErro(campo)
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-gray-200 focus:border-blue-400'
    }`

  const textareaClass = (campo) =>
    `w-full text-sm border rounded-lg px-3 py-2.5 outline-none resize-none transition-colors leading-relaxed ${
      campoErro(campo)
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-gray-200 focus:border-blue-400'
    }`

  const abas = [
    { id:'nc',          label:'1. Não conformidade'      },
    { id:'operacional', label:'2. Operacional'            },
    { id:'eficacia',    label:'3. Avaliação de eficácia'  },
  ]

  const totalPendentes = errosTodos.length

  return (
    <div style={{ minHeight:540, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px 0', borderRadius:'var(--border-radius-lg)' }}>
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-2xl mx-4" style={{ maxHeight:'92vh', overflowY:'auto' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="font-mono text-xs text-gray-500">{form.rnc}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoC.bg} ${tipoC.text}`}>{form.tipo}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sitC.bg} ${sitC.text}`}>{form.situacao}</span>
              {totalPendentes > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 flex items-center gap-1">
                  <AlertTriangle size={10} />{totalPendentes} campo{totalPendentes > 1 ? 's' : ''} pendente{totalPendentes > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h2 className="text-sm font-medium text-gray-800 truncate max-w-md">{form.defeito || 'Nova NC'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 flex-shrink-0"><X size={16} /></button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {abas.map(a => {
            const pendentes = pendentesAba(mostrarErros, a.id)
            return (
              <button key={a.id} onClick={() => setAba(a.id)}
                className={`text-xs px-4 py-2 rounded-t-lg border-b-2 transition-colors font-medium whitespace-nowrap flex items-center gap-1.5 ${
                  aba === a.id
                    ? pendentes > 0
                      ? 'border-red-400 text-red-600 bg-red-50'
                      : 'border-blue-500 text-blue-600 bg-blue-50'
                    : pendentes > 0
                    ? 'border-red-200 text-red-400 hover:bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                {a.label}
                {pendentes > 0 && (
                  <span className="text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {pendentes}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="border-t border-gray-100 px-6 py-5">

          {aba === 'nc' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Dados do sistema</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <CampoSistema label="Nº RNC"              value={form.rnc}           />
                  <CampoSistema label="Área"                value={form.area}          />
                  <CampoSistema label="Data de abertura"    value={form.dataAbertura}  />
                  <CampoSistema label="Prazo (7 dias úteis)"value={prazoStr}           />
                  <div className="col-span-2"><CampoSistema label="Defeito"            value={form.defeito}       /></div>
                  <div className="col-span-2"><CampoSistema label="Classificação"      value={form.classificacao} /></div>
                </div>
                {dias !== null && (
                  <div className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-md inline-block ${dias > 0 ? 'bg-red-100 text-red-700' : dias === 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {dias > 0 ? `${dias}d em atraso` : dias === 0 ? 'Vence hoje' : `${Math.abs(dias)}d restantes`}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CampoObrigatorio label="Nº Cliente" erro={campoErro('Nº Cliente')}>
                  <input value={form.nCliente} onChange={e => set('nCliente', e.target.value)} placeholder="Nº do pedido do cliente" className={inputClass('Nº Cliente')} />
                </CampoObrigatorio>
                <CampoObrigatorio label="Cliente" erro={campoErro('Cliente')}>
                  <input value={form.cliente} onChange={e => set('cliente', e.target.value)} className={inputClass('Cliente')} />
                </CampoObrigatorio>
                <CampoObrigatorio label="Tipo" erro={campoErro('Tipo')}>
                  <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className={selectClass('Tipo')}>
                    <option>Externa</option><option>Interna</option><option>Fornecedor</option>
                  </select>
                </CampoObrigatorio>
                <CampoObrigatorio label="Situação" erro={campoErro('Situação')}>
                  <select value={form.situacao} onChange={e => set('situacao', e.target.value)} className={selectClass('Situação')}>
                    <option>Aberta</option><option>Em análise</option><option>Em andamento</option>
                    <option>Aguardando amostra</option><option>Encerrada</option>
                  </select>
                </CampoObrigatorio>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Data chegada amostra</label>
                  <input value={form.dataAmostra} onChange={e => set('dataAmostra', e.target.value)} placeholder="DD/MM/AAAA ou N/A" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Retorno da resposta</label>
                  <input value={form.retornoResposta || ''} onChange={e => set('retornoResposta', e.target.value)} placeholder="DD/MM/AAAA" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setAba('operacional')}
                  className="flex items-center gap-1.5 text-sm bg-[#185FA5] text-white px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors">
                  Próximo: Operacional <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {aba === 'operacional' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Dados do sistema</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <CampoSistema label="Nº RNC"              value={form.rnc}           />
                  <CampoSistema label="Responsável"         value={form.responsavel}   />
                  <CampoSistema label="Data de abertura"    value={form.dataAbertura}  />
                  <CampoSistema label="Prazo (7 dias úteis)"value={prazoStr}           />
                  <div className="col-span-2"><CampoSistema label="Defeito"            value={form.defeito}       /></div>
                  <div className="col-span-2"><CampoSistema label="Classificação"      value={form.classificacao} /></div>
                </div>
              </div>

              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dados operacionais</p>
              <div className="grid grid-cols-2 gap-3">
                <CampoObrigatorio label="Quantidade reclamada" erro={campoErro('Quantidade reclamada')}>
                  <input value={form.operacional.qtdReclamada} onChange={e => setOp('qtdReclamada', e.target.value)} placeholder="Ex: 500 unidades" className={inputClass('Quantidade reclamada')} />
                </CampoObrigatorio>
                <CampoObrigatorio label="Data de produção" erro={campoErro('Data de produção')}>
                  <input value={form.operacional.dataProd} onChange={e => setOp('dataProd', e.target.value)} placeholder="DD/MM/AAAA" className={inputClass('Data de produção')} />
                </CampoObrigatorio>
                <CampoObrigatorio label="Máquina" erro={campoErro('Máquina')}>
                  <select value={form.operacional.maquina} onChange={e => setOp('maquina', e.target.value)} className={selectClass('Máquina')}>
                    {MAQUINAS.map(m => <option key={m} value={m}>{m || 'Selecione...'}</option>)}
                  </select>
                </CampoObrigatorio>
                <CampoObrigatorio label="Operador" erro={campoErro('Operador')}>
                  <input value={form.operacional.operador} onChange={e => setOp('operador', e.target.value)} placeholder="Nome do operador" className={inputClass('Operador')} />
                </CampoObrigatorio>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">Operador de estufa <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <input value={form.operacional.operadorEstufa} onChange={e => setOp('operadorEstufa', e.target.value)} placeholder="Nome do operador de estufa" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">Observação <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <textarea value={form.operacional.observacao} onChange={e => setOp('observacao', e.target.value)} rows={2} placeholder="Observações adicionais..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setAba('nc')} className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">← Voltar</button>
                <button onClick={() => setAba('eficacia')}
                  className="flex items-center gap-1.5 text-sm bg-[#185FA5] text-white px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors">
                  Próximo: Eficácia <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {aba === 'eficacia' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Dados do sistema</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <CampoSistema label="Nº RNC"              value={form.rnc}           />
                  <CampoSistema label="Responsável"         value={form.responsavel}   />
                  <CampoSistema label="Data de abertura"    value={form.dataAbertura}  />
                  <CampoSistema label="Prazo (7 dias úteis)"value={prazoStr}           />
                  <div className="col-span-2"><CampoSistema label="Defeito"            value={form.defeito}       /></div>
                  <div className="col-span-2"><CampoSistema label="Classificação"      value={form.classificacao} /></div>
                </div>
              </div>

              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Análise e ações</p>

              <CampoObrigatorio label="Análise de causa (5 Porquês)" erro={campoErro('Análise de causa')}>
                <textarea value={form.eficacia.causaRaiz} onChange={e => setEf('causaRaiz', e.target.value)}
                  placeholder="1. Por quê ocorreu?&#10;2. Por quê esse motivo existiu?&#10;3. Por quê não foi detectado?&#10;4. Por quê o controle falhou?&#10;5. Causa raiz:"
                  rows={5} className={textareaClass('Análise de causa')} />
              </CampoObrigatorio>

              <CampoObrigatorio label="Ação de contenção" erro={campoErro('Ação de contenção')}>
                <textarea value={form.eficacia.acaoContencao} onChange={e => setEf('acaoContencao', e.target.value)} rows={2} placeholder="Ação imediata para conter o problema..." className={textareaClass('Ação de contenção')} />
              </CampoObrigatorio>

              <CampoObrigatorio label="Ação de correção" erro={campoErro('Ação de correção')}>
                <textarea value={form.eficacia.acaoCorrecao} onChange={e => setEf('acaoCorrecao', e.target.value)} rows={2} placeholder="Ação para eliminar a não conformidade..." className={textareaClass('Ação de correção')} />
              </CampoObrigatorio>

              <CampoObrigatorio label="Ação preventiva" erro={campoErro('Ação preventiva')}>
                <textarea value={form.eficacia.acaoPreventiva} onChange={e => setEf('acaoPreventiva', e.target.value)} rows={2} placeholder="Ação para evitar recorrência..." className={textareaClass('Ação preventiva')} />
              </CampoObrigatorio>

              <div className="grid grid-cols-2 gap-3">
                <CampoObrigatorio label="Prazo da ação" erro={campoErro('Prazo da ação')}>
                  <input type="date" value={form.eficacia.prazoAcao} onChange={e => setEf('prazoAcao', e.target.value)} className={inputClass('Prazo da ação')} />
                </CampoObrigatorio>
                <CampoObrigatorio label="Data realizada" erro={campoErro('Data realizada')}>
                  <input value={form.eficacia.dataRealizada} onChange={e => setEf('dataRealizada', e.target.value)} placeholder="DD/MM/AAAA" className={inputClass('Data realizada')} />
                </CampoObrigatorio>
              </div>

              <CampoObrigatorio label="Evidência" erro={campoErro('Evidência')}>
                <div className="flex gap-2">
                  <input value={form.eficacia.evidencia} onChange={e => setEf('evidencia', e.target.value)} placeholder="Descreva ou cite o arquivo de evidência..." className={`flex-1 text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${campoErro('Evidência') ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'}`} />
                  <button className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 flex-shrink-0"><Paperclip size={13} />Anexar</button>
                </div>
                {campoErro('Evidência') && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertTriangle size={11} />Campo obrigatório</p>}
              </CampoObrigatorio>

              <CampoObrigatorio label="Avaliação de eficácia" erro={campoErro('Avaliação de eficácia')}>
                <select value={form.eficacia.avaliacao} onChange={e => setEf('avaliacao', e.target.value)} className={selectClass('Avaliação de eficácia')}>
                  {EFICACIA_OPTS.map(o => <option key={o} value={o}>{o || 'Selecione...'}</option>)}
                </select>
              </CampoObrigatorio>

              {form.eficacia.avaliacao && (
                <div className={`rounded-lg p-3 text-sm font-medium text-center ${form.eficacia.avaliacao === 'Eficaz' ? 'bg-green-50 text-green-700' : form.eficacia.avaliacao === 'Parcialmente eficaz' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                  {form.eficacia.avaliacao === 'Eficaz' ? '✓ Ação eficaz — NC pode ser encerrada' : form.eficacia.avaliacao === 'Parcialmente eficaz' ? '⚠ Ação parcialmente eficaz — revisar plano' : '✕ Ação não eficaz — reabrir NC com nova análise de causa'}
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Resultado da avaliação <span className="text-gray-400 font-normal">(opcional)</span></label>
                <textarea value={form.eficacia.resultado} onChange={e => setEf('resultado', e.target.value)} rows={2} placeholder="Descreva o resultado da verificação..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none" />
              </div>

              {tentouEncerrar && errosTodos.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-700 flex items-center gap-2 mb-2">
                    <AlertTriangle size={15} />Não é possível encerrar — campos obrigatórios pendentes:
                  </p>
                  <div className="space-y-1">
                    {errosTodos.map((e,i) => (
                      <button key={i} onClick={() => setAba(e.aba)}
                        className="flex items-center gap-2 text-xs text-red-600 hover:text-red-800 transition-colors w-full text-left">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {e.campo} <span className="text-red-400">→ aba {e.aba === 'nc' ? '1' : e.aba === 'operacional' ? '2' : '3'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button onClick={() => setAba('operacional')} className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">← Voltar</button>
                <div className="flex gap-2">
                  <button onClick={handleSalvar} className="text-sm border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50">Salvar rascunho</button>
                  <button onClick={handleEncerrar}
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg transition-colors ${errosTodos.length > 0 && tentouEncerrar ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    <CheckCircle size={15} />
                    {errosTodos.length > 0 && tentouEncerrar ? `${errosTodos.length} campo${errosTodos.length>1?'s':''} pendente${errosTodos.length>1?'s':''}` : 'Encerrar NC'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TELA PRINCIPAL ───────────────────────────────────────────────
export default function NaoConformidades() {
  const [abertas, setAbertas]       = useState(ncIniciais)
  const [encerradas, setEncerradas] = useState(ncEncerradasIniciais)
  const [aba, setAba]               = useState('abertas')
  const [search, setSearch]         = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [ncAtiva, setNcAtiva]       = useState(null)
  const [novaNC, setNovaNC]         = useState(false)

  const novoForm = {
    id:Date.now(), rnc:'', nCliente:'', cliente:'', tipo:'Externa',
    defeito:'', classificacao:'Não Conformidade Nova', situacao:'Aberta',
    dataAbertura:new Date().toLocaleDateString('pt-BR'),
    dataAmostra:'', responsavel:'', retornoResposta:'', area:'', origem:'Portal',
    operacional:{ qtdReclamada:'', dataProd:'', maquina:'', operador:'', operadorEstufa:'', observacao:'' },
    eficacia:{ causaRaiz:'', acaoContencao:'', acaoCorrecao:'', acaoPreventiva:'', prazoAcao:'', dataRealizada:'', evidencia:'', avaliacao:'', resultado:'' },
  }

  function salvarNC(form) {
    if (form.situacao === 'Encerrada') {
      setAbertas(prev => prev.filter(n => n.id !== form.id))
      setEncerradas(prev => [form, ...prev])
    } else {
      const existe = abertas.find(n => n.id === form.id)
      if (existe) setAbertas(prev => prev.map(n => n.id === form.id ? form : n))
      else setAbertas(prev => [form, ...prev])
    }
    setNcAtiva(null)
    setNovaNC(false)
  }

  const atrasadas = abertas.filter(n => { const p = calcularPrazo(n.dataAbertura, n.dataAmostra); return p && diasAtraso(p) > 0 }).length
  const comPendentes = abertas.filter(n => validarNC(n).length > 0).length

  const filtrar = lista => lista.filter(n => {
    const ms = n.rnc.toLowerCase().includes(search.toLowerCase()) ||
               n.cliente.toLowerCase().includes(search.toLowerCase()) ||
               n.defeito.toLowerCase().includes(search.toLowerCase())
    const mt = filtroTipo === 'todos' || n.tipo === filtroTipo
    return ms && mt
  })

  if (ncAtiva) return <FormularioNC nc={ncAtiva}  onSave={salvarNC} onClose={() => setNcAtiva(null)} />
  if (novaNC)  return <FormularioNC nc={novoForm} onSave={salvarNC} onClose={() => setNovaNC(false)} />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><AlertCircle size={18} className="text-blue-600" /></div>
          <div><p className="text-xs text-gray-400">Em aberto</p><p className="text-xl font-medium text-gray-800">{abertas.length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-red-500" /></div>
          <div><p className="text-xs text-gray-400">Atrasadas</p><p className="text-xl font-medium text-red-600">{atrasadas}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><CheckCircle size={18} className="text-green-600" /></div>
          <div><p className="text-xs text-gray-400">Encerradas</p><p className="text-xl font-medium text-green-700">{encerradas.length}</p></div>
        </div>
      </div>

      {(atrasadas > 0 || comPendentes > 0) && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-amber-700">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>
            {atrasadas > 0 && <><strong>{atrasadas} NC{atrasadas>1?'s':''} em atraso</strong></>}
            {atrasadas > 0 && comPendentes > 0 && ' · '}
            {comPendentes > 0 && <><strong>{comPendentes} NC{comPendentes>1?'s':''} com campos pendentes</strong></>}
            . Clique para completar.
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-white border border-gray-100 rounded-lg p-1 gap-1">
          <button onClick={() => setAba('abertas')} className={`text-sm px-4 py-1.5 rounded-md transition-colors ${aba==='abertas'?'bg-[#185FA5] text-white font-medium':'text-gray-500 hover:text-gray-700'}`}>Em aberto ({abertas.length})</button>
          <button onClick={() => setAba('encerradas')} className={`text-sm px-4 py-1.5 rounded-md transition-colors ${aba==='encerradas'?'bg-green-600 text-white font-medium':'text-gray-500 hover:text-gray-700'}`}>Encerradas ({encerradas.length})</button>
        </div>
        <div className="flex-1 relative" style={{minWidth:180}}>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por RNC, cliente ou defeito..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400" />
        </div>
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none">
          <option value="todos">Todos os tipos</option>
          <option>Externa</option><option>Interna</option><option>Fornecedor</option>
        </select>
        <button onClick={() => setNovaNC(true)} className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors whitespace-nowrap">
          <Plus size={14} />Nova NC
        </button>
      </div>

      {aba === 'abertas' && (
        <div className="space-y-2">
          {filtrar(abertas).map(nc => {
            const prazo    = calcularPrazo(nc.dataAbertura, nc.dataAmostra)
            const dias     = diasAtraso(prazo)
            const sitC     = sitCor[nc.situacao] || sitCor['Aberta']
            const tipoC    = tipoCor[nc.tipo]    || tipoCor['Interna']
            const pendentes = validarNC(nc).length
            const temCausa  = !!nc.eficacia?.causaRaiz
            const temEfic   = !!nc.eficacia?.avaliacao
            return (
              <div key={nc.id} onClick={() => setNcAtiva(nc)}
                className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sitC.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-gray-500">{nc.rnc}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${tipoC.bg} ${tipoC.text}`}>{nc.tipo}</span>
                    <span className="text-xs text-gray-600">{nc.cliente}</span>
                    {nc.nCliente && nc.nCliente !== '—' && <span className="text-xs text-gray-400">Nº {nc.nCliente}</span>}
                  </div>
                  <p className="text-sm text-gray-800 truncate mb-1">{nc.defeito}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    <span>Abertura: {nc.dataAbertura}</span>
                    {prazo && (
                      <span className={dias > 0 ? 'text-red-500 font-medium' : dias === 0 ? 'text-amber-500 font-medium' : ''}>
                        Prazo: {formatDataBR(prazo)}{dias > 0 ? ` · ${dias}d atrasado` : dias === 0 ? ' · Vence hoje' : ` · ${Math.abs(dias)}d restantes`}
                      </span>
                    )}
                    {nc.responsavel && <span>Resp: {nc.responsavel}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  {pendentes > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-50 text-amber-700 flex items-center gap-1">
                      <AlertTriangle size={9} />{pendentes} pendente{pendentes>1?'s':''}
                    </span>
                  )}
                  <div className="flex gap-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${temCausa?'bg-green-50 text-green-700':'bg-gray-100 text-gray-400'}`}>Causa</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${temEfic?'bg-green-50 text-green-700':'bg-gray-100 text-gray-400'}`}>Eficácia</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sitC.bg} ${sitC.text}`}>{nc.situacao}</span>
                </div>
              </div>
            )
          })}
          {filtrar(abertas).length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">Nenhuma NC em aberto encontrada.</div>
          )}
        </div>
      )}

      {aba === 'encerradas' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{tableLayout:'fixed',minWidth:700}}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3" style={{width:100}}>RNC</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3" style={{width:110}}>Cliente</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Defeito</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3" style={{width:80}}>Tipo</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3" style={{width:90}}>Abertura</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3" style={{width:110}}>Eficácia</th>
                </tr>
              </thead>
              <tbody>
                {filtrar(encerradas).map(nc => {
                  const ef    = nc.eficacia?.avaliacao
                  const tipoC = tipoCor[nc.tipo] || tipoCor['Interna']
                  return (
                    <tr key={nc.id} onClick={() => setNcAtiva(nc)} className="border-b border-gray-50 hover:bg-gray-50/40 last:border-0 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{nc.rnc}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{nc.cliente}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 truncate">{nc.defeito}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-1.5 py-0.5 rounded font-medium ${tipoC.bg} ${tipoC.text}`}>{nc.tipo}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{nc.dataAbertura}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ef==='Eficaz'?'bg-green-50 text-green-700':ef==='Parcialmente eficaz'?'bg-amber-50 text-amber-700':ef?'bg-red-50 text-red-600':'bg-gray-100 text-gray-400'}`}>{ef||'—'}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtrar(encerradas).length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Nenhuma NC encerrada encontrada.</div>
          )}
        </div>
      )}
    </div>
  )
}