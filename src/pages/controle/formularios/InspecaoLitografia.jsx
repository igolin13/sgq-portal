import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { salvarItem } from '../../../services/sharepointService'
import { SHAREPOINT_CONFIG } from '../../../config/sharepoint'

// ── Opções ─────────────────────────────────────────────────────────────────
const INSPETORES  = ['Thais', 'Glauber', 'Roger', 'Luiz Guilherme', 'Raony', 'Maycki']
const TURNOS      = ['07:00 às 15:00', '15:00 às 23:00', '23:00 às 07:00']
const MAQUINAS    = ['Lito 02', 'Lito 04', 'Lito 05', 'Lito 06', 'Digital']
const EXPEDIENTE  = ['Sim', 'Máquina parada', 'Máquina em manutenção', 'Liberando carga']
const GABARITO    = ['Sim', 'Não', 'Não aplicável']

const OPT_INSP_FULL   = ['Aprovado', 'Não conforme', 'Aprovado com ressalva', 'Máquina parada', 'Não aplicável', 'Não realizado']
const OPT_ADERENCIA   = ['Aprovado', 'Não conforme', 'Aprovado com ressalva']
const OPT_PADRAO_COR  = ['Aprovado', 'Não conforme', 'Aprovado com ressalva', 'Máquina parada', 'Não aplicável']
const OPT_SENSOR_SV   = ['Aprovado', 'Não conforme']
const OPT_SENSOR      = ['Aprovado', 'Não conforme', 'Aprovado com ressalva', 'Máquina parada', 'Não aplicável']

const FORM_VAZIO = {
  data: new Date().toISOString().slice(0, 10),
  inspetor: '', turno: '', maquina: '', expediente: '', obsGerais: '',
  // Produção
  opVerniz: '', fardo: '', produto: '', cliente: '', processo: '',
  // Inspeção
  aspectoVisual: '', aderencia: '', mek: '', padraoCor: '', registroReserva: '',
  // Medições
  temperatura: '', viscosidade: '', camadaDir: '', camadaEsq: '',
  // Controles
  decoStar: '', obsDecoStar: '',
  coatStar: '', obsCoatStar: '',
  sensorVirgem: '', obsSensorVirgem: '',
  doubleCheck: '', obsDoubleCheck: '',
  sensorUmida: '', obsSensorUmida: '',
  // Final
  gabarito: '', obsFinais: '',
}

// Manda enviar sem preencher tudo se máquina parada/manutenção
function modoSimplificado(expediente) {
  return expediente === 'Máquina parada' || expediente === 'Máquina em manutenção'
}

const OBRIG_BASE    = ['data', 'inspetor', 'turno', 'maquina', 'expediente']
const OBRIG_PROD    = ['opVerniz', 'fardo', 'produto', 'cliente', 'processo']
const OBRIG_INSP    = ['aspectoVisual', 'aderencia', 'mek', 'padraoCor', 'registroReserva']
const OBRIG_MED     = ['temperatura', 'viscosidade', 'camadaDir', 'camadaEsq']
const OBRIG_CTRL    = ['decoStar', 'coatStar', 'sensorVirgem', 'doubleCheck', 'sensorUmida']
const OBRIG_FINAL   = ['gabarito']

// ── RadioGroup ─────────────────────────────────────────────────────────────
function RadioGroup({ opcoes, valor, onChange, erro }) {
  const cor = (opt) => {
    if (opt === 'Aprovado')                return { c: '#16a34a', bg: '#f0fdf4', bd: '#86efac' }
    if (opt === 'Não conforme')            return { c: '#dc2626', bg: '#fff5f5', bd: '#fca5a5' }
    if (opt.includes('ressalva'))          return { c: '#d97706', bg: '#fffbeb', bd: '#fde68a' }
    if (opt === 'Sim')                     return { c: '#16a34a', bg: '#f0fdf4', bd: '#86efac' }
    if (opt === 'Não')                     return { c: '#dc2626', bg: '#fff5f5', bd: '#fca5a5' }
    return                                        { c: '#6b7280', bg: '#f9fafb', bd: '#e5e7eb' }
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: erro ? '6px' : 0, borderRadius: 8, border: erro ? '1.5px solid #fca5a5' : 'none', background: erro ? '#fff5f5' : 'transparent' }}>
      {opcoes.map(opt => {
        const sel = valor === opt
        const { c, bg, bd } = cor(opt)
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            style={{ padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: sel ? 700 : 400, border: `1.5px solid ${sel ? bd : '#e5e7eb'}`, background: sel ? bg : '#fff', color: sel ? c : '#6b7280', cursor: 'pointer', transition: 'all .15s', minHeight: 40 }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ── Seção ──────────────────────────────────────────────────────────────────
function Secao({ titulo, cor = '#374151', children }) {
  return (
    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 18px', background: cor, borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{titulo}</span>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

export default function InspecaoLitografia({ onSalvo, onCancelar }) {
  const [form,   setForm]   = useState(FORM_VAZIO)
  const [erros,  setErros]  = useState({})
  const [status, setStatus] = useState(null)

  const simplificado = modoSimplificado(form.expediente)

  function campo(f, v) { setForm(p => ({ ...p, [f]: v })); setErros(p => ({ ...p, [f]: false })) }

  function validar() {
    const obrig = [...OBRIG_BASE]
    if (!simplificado) {
      obrig.push(...OBRIG_PROD, ...OBRIG_INSP, ...OBRIG_MED, ...OBRIG_CTRL, ...OBRIG_FINAL)
    }
    const e = {}
    obrig.forEach(c => { if (!form[c]) e[c] = true })
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function salvar() {
    if (!validar()) return
    setStatus('salvando')
    try {
      await salvarItem(SHAREPOINT_CONFIG.listas.inspecaoLitografia, { ...form, simplificado })
      setStatus('sucesso')
      setTimeout(() => { setStatus(null); if (onSalvo) onSalvo({ ...form, simplificado }) }, 2000)
    } catch {
      setStatus('erro')
      setTimeout(() => setStatus(null), 3500)
    }
  }

  const inputSt = (f) => ({
    width: '100%', padding: '11px 13px', borderRadius: 9, fontSize: 14,
    border: `1.5px solid ${erros[f] ? '#ef4444' : '#d1d5db'}`,
    background: erros[f] ? '#fff5f5' : '#fff',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  })
  const selSt = (f) => ({ ...inputSt(f), cursor: 'pointer' })
  const lbl = (t, req = true) => (
    <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>
      {t}{req && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </div>
  )
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
  const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }

  if (status === 'sucesso') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 40px', background: '#fff', borderRadius: 16 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={44} color="#16a34a"/>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>Inspeção registrada!</div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>Inspeção Litografia salva com sucesso.</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1.5px solid #f3f4f6' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🔍</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>Inspeção Litografia</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>Campos com * são obrigatórios</div>
        </div>
      </div>

      {/* ── DADOS INICIAIS ── */}
      <Secao titulo="Dados iniciais" cor="#1e40af">
        <div style={g3}>
          <div>{lbl('Data')}<input type="date" value={form.data} onChange={e => campo('data', e.target.value)} style={inputSt('data')}/></div>
          <div>
            {lbl('Inspetor')}
            <select value={form.inspetor} onChange={e => campo('inspetor', e.target.value)} style={selSt('inspetor')}>
              <option value="">Selecione...</option>
              {INSPETORES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            {lbl('Turno')}
            <select value={form.turno} onChange={e => campo('turno', e.target.value)} style={selSt('turno')}>
              <option value="">Selecione...</option>
              {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={g2}>
          <div>
            {lbl('Máquina')}
            <select value={form.maquina} onChange={e => campo('maquina', e.target.value)} style={selSt('maquina')}>
              <option value="">Selecione...</option>
              {MAQUINAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            {lbl('Máquina em expediente?')}
            <select value={form.expediente} onChange={e => campo('expediente', e.target.value)} style={selSt('expediente')}>
              <option value="">Selecione...</option>
              {EXPEDIENTE.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div>
          {lbl('Observações gerais', false)}
          <textarea value={form.obsGerais} onChange={e => campo('obsGerais', e.target.value)}
            placeholder="Observações iniciais..."
            style={{ width: '100%', padding: '10px 13px', borderRadius: 9, fontSize: 14, border: '1.5px solid #d1d5db', background: '#fff', outline: 'none', minHeight: 70, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}/>
        </div>
      </Secao>

      {/* Banner de modo simplificado */}
      {simplificado && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 12, background: '#fef3c7', border: '1.5px solid #fde68a' }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#92400e' }}>Modo simplificado ativo</div>
            <div style={{ fontSize: 13, color: '#78350f' }}>Máquina {form.expediente.toLowerCase()} — o formulário pode ser enviado sem preencher as demais seções.</div>
          </div>
        </div>
      )}

      {/* ── SEÇÕES COMPLETAS (só quando expediente = Sim / Liberando carga) ── */}
      {!simplificado && form.expediente && (
        <>
          {/* PRODUÇÃO */}
          <Secao titulo="Produção" cor="#0f6e56">
            <div style={g3}>
              <div>{lbl('OP Verniz')}<input type="text" placeholder="OP..." value={form.opVerniz} onChange={e => campo('opVerniz', e.target.value)} style={inputSt('opVerniz')}/></div>
              <div>{lbl('Nº do fardo')}<input type="text" placeholder="Nº..." value={form.fardo} onChange={e => campo('fardo', e.target.value)} style={inputSt('fardo')}/></div>
              <div>{lbl('Produto')}<input type="text" placeholder="Produto..." value={form.produto} onChange={e => campo('produto', e.target.value)} style={inputSt('produto')}/></div>
            </div>
            <div style={g2}>
              <div>{lbl('Cliente')}<input type="text" placeholder="Cliente..." value={form.cliente} onChange={e => campo('cliente', e.target.value)} style={inputSt('cliente')}/></div>
              <div>{lbl('Processo')}<input type="text" placeholder="Processo..." value={form.processo} onChange={e => campo('processo', e.target.value)} style={inputSt('processo')}/></div>
            </div>
          </Secao>

          {/* INSPEÇÃO */}
          <Secao titulo="Inspeção" cor="#185fa5">
            {[
              { f: 'aspectoVisual',   lbl2: '12. Aspecto visual',   opts: OPT_INSP_FULL },
              { f: 'aderencia',       lbl2: '13. Aderência',         opts: OPT_ADERENCIA },
              { f: 'mek',             lbl2: '14. MEK',               opts: OPT_INSP_FULL },
              { f: 'padraoCor',       lbl2: '15. Padrão de cor',     opts: OPT_PADRAO_COR },
              { f: 'registroReserva', lbl2: '16. Registro / Reserva',opts: OPT_INSP_FULL },
            ].map(({ f, lbl2, opts }) => (
              <div key={f}>
                {lbl(lbl2)}
                <RadioGroup opcoes={opts} valor={form[f]} onChange={v => campo(f, v)} erro={erros[f]}/>
              </div>
            ))}
          </Secao>

          {/* MEDIÇÕES */}
          <Secao titulo="Medições" cor="#854f0b">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
              {[
                { f: 'temperatura', lbl2: 'Temperatura (°C)', type: 'number' },
                { f: 'viscosidade', lbl2: 'Viscosidade',       type: 'text' },
                { f: 'camadaDir',   lbl2: 'Camada direita',    type: 'text' },
                { f: 'camadaEsq',   lbl2: 'Camada esquerda',   type: 'text' },
              ].map(({ f, lbl2, type }) => (
                <div key={f}>
                  {lbl(lbl2)}
                  <input type={type} placeholder="..." value={form[f]} onChange={e => campo(f, e.target.value)} style={inputSt(f)}/>
                </div>
              ))}
            </div>
          </Secao>

          {/* CONTROLES / SENSORES */}
          <Secao titulo="Controles / Sensores" cor="#534ab7">
            {[
              { f: 'decoStar',      obsF: 'obsDecoStar',      lbl2: 'DecoStar (externo)',       opts: OPT_SENSOR },
              { f: 'coatStar',      obsF: 'obsCoatStar',      lbl2: 'CoatSTAR (interno)',        opts: OPT_SENSOR },
              { f: 'sensorVirgem',  obsF: 'obsSensorVirgem',  lbl2: 'Sensor de folha virgem',   opts: OPT_SENSOR_SV },
              { f: 'doubleCheck',   obsF: 'obsDoubleCheck',   lbl2: 'Sensor de Double Check',   opts: OPT_SENSOR },
              { f: 'sensorUmida',   obsF: 'obsSensorUmida',   lbl2: 'Sensor de folha úmida',    opts: OPT_SENSOR },
            ].map(({ f, obsF, lbl2, opts }) => (
              <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0' }}>
                {lbl(lbl2)}
                <RadioGroup opcoes={opts} valor={form[f]} onChange={v => campo(f, v)} erro={erros[f]}/>
                <input type="text" placeholder={`Observação (${lbl2.split(' ')[0]})...`} value={form[obsF]} onChange={e => campo(obsF, e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 13, border: '1px solid #e2e8f0', background: '#f9fafb', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginTop: 2 }}/>
              </div>
            ))}
          </Secao>

          {/* FINAL */}
          <Secao titulo="Final" cor="#374151">
            <div>
              {lbl('Gabarito presente')}
              <RadioGroup opcoes={GABARITO} valor={form.gabarito} onChange={v => campo('gabarito', v)} erro={erros['gabarito']}/>
            </div>
            <div>
              {lbl('Observações gerais', false)}
              <textarea value={form.obsFinais} onChange={e => campo('obsFinais', e.target.value)}
                placeholder="Observações finais..."
                style={{ width: '100%', padding: '10px 13px', borderRadius: 9, fontSize: 14, border: '1.5px solid #d1d5db', background: '#fff', outline: 'none', minHeight: 80, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}/>
            </div>
          </Secao>
        </>
      )}

      {/* Feedback erro */}
      {Object.keys(erros).length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 9, background: '#fff5f5', border: '1px solid #fca5a5' }}>
          <AlertCircle size={16} color="#ef4444"/>
          <span style={{ fontSize: 13, color: '#dc2626' }}>Preencha todos os campos obrigatórios destacados.</span>
        </div>
      )}

      {/* Botões */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancelar} style={{ flex: 1, padding: '13px 0', borderRadius: 10, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button onClick={salvar} disabled={status === 'salvando'}
          style={{ flex: 2, padding: '13px 0', borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: status === 'salvando' ? 0.7 : 1 }}>
          {status === 'salvando' ? 'Salvando...' : '✓ Salvar Inspeção'}
        </button>
      </div>
    </div>
  )
}
