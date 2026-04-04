import { useState, useRef } from 'react'
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react'
import { salvarItem } from '../../../services/sharepointService'
import { SHAREPOINT_CONFIG } from '../../../config/sharepoint'

const INSPETORES = ['GLAUBER', 'LUIZ GUILHERME', 'THAIS', 'ROGER', 'RAONY', 'MAYCKI']

const MAQUINAS = [
  'ENV 01', 'ENV 03', 'ENV 05', 'ENV 06',
  'LITO 02', 'LITO 04', 'LITO 05', 'LITO 06',
]

const SITS = ['L10', 'L99', 'MATERIAL VIRGEM', 'ANÁLISE']

const TIPOS_ACEITOS = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,image/*,video/*,audio/*'
const MAX_BYTES     = 10 * 1024 * 1024 // 10 MB

const FORM_VAZIO = {
  data: new Date().toISOString().slice(0, 10),
  inspetor: '', op: '', fardo: '', maquina: '',
  quantidade: '', sit: '', motivo: '',
}

const OBRIGATORIOS = ['data', 'inspetor', 'op', 'fardo', 'maquina', 'quantidade', 'sit', 'motivo']

export default function FardoRetido({ onSalvo, onCancelar }) {
  const [form,      setForm]      = useState(FORM_VAZIO)
  const [evidencia, setEvidencia] = useState(null)    // File object
  const [erros,     setErros]     = useState({})
  const [status,    setStatus]    = useState(null)
  const fileRef = useRef()

  function campo(f, v) { setForm(p => ({ ...p, [f]: v })); setErros(p => ({ ...p, [f]: false })) }

  function onArquivo(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > MAX_BYTES) {
      alert('Arquivo muito grande. O tamanho máximo é 10 MB.')
      e.target.value = ''
      return
    }
    setEvidencia(file)
    setErros(p => ({ ...p, evidencia: false }))
  }

  function removerArquivo() {
    setEvidencia(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function validar() {
    const e = {}
    OBRIGATORIOS.forEach(c => { if (!form[c]) e[c] = true })
    if (!evidencia) e.evidencia = true
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function salvar() {
    if (!validar()) return
    setStatus('salvando')
    try {
      // Em produção: fazer upload do arquivo para SharePoint via Graph API
      // e salvar a URL retornada junto com os demais dados.
      await salvarItem(SHAREPOINT_CONFIG.listas.fardoRetido, {
        ...form,
        evidenciaNome: evidencia?.name,
        evidenciaTipo: evidencia?.type,
        evidenciaTamanho: evidencia?.size,
      })
      setStatus('sucesso')
      setTimeout(() => { setStatus(null); if (onSalvo) onSalvo(form) }, 2000)
    } catch {
      setStatus('erro')
      setTimeout(() => setStatus(null), 3500)
    }
  }

  const inputSt = (f) => ({
    width: '100%', padding: '13px 15px', borderRadius: 10, fontSize: 15,
    border: `2px solid ${erros[f] ? '#ef4444' : '#d1d5db'}`,
    background: erros[f] ? '#fff5f5' : '#fff',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  })
  const selSt = (f) => ({ ...inputSt(f), cursor: 'pointer' })
  const lbl = (t, req = true) => (
    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {t}{req && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </div>
  )
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
  const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }

  if (status === 'sucesso') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 40px', background: '#fff', borderRadius: 16 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={44} color="#16a34a"/>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>Fardo registrado!</div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>Fardo retido salvo com sucesso.</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1.5px solid #f3f4f6' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📦</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>Fardo Retido pela Qualidade</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>Campos com * são obrigatórios</div>
        </div>
      </div>

      {/* DADOS INICIAIS */}
      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', background: '#991b1b' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Dados iniciais</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={g2}>
            <div>{lbl('Data')}<input type="date" value={form.data} onChange={e => campo('data', e.target.value)} style={inputSt('data')}/></div>
            <div>
              {lbl('Inspetor')}
              <select value={form.inspetor} onChange={e => campo('inspetor', e.target.value)} style={selSt('inspetor')}>
                <option value="">Selecione...</option>
                {INSPETORES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div style={g3}>
            <div>{lbl('Ordem de Produção')}<input type="number" placeholder="OP..." min="0" value={form.op} onChange={e => campo('op', e.target.value)} style={inputSt('op')}/></div>
            <div>{lbl('Nº Fardo')}<input type="text" placeholder="Nº..." value={form.fardo} onChange={e => campo('fardo', e.target.value)} style={inputSt('fardo')}/></div>
            <div>
              {lbl('Máquina')}
              <select value={form.maquina} onChange={e => campo('maquina', e.target.value)} style={selSt('maquina')}>
                <option value="">Selecione...</option>
                {MAQUINAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={g2}>
            <div>{lbl('Quantidade')}<input type="number" placeholder="0" min="0" value={form.quantidade} onChange={e => campo('quantidade', e.target.value)} style={inputSt('quantidade')}/></div>
            <div>
              {lbl('SIT')}
              <select value={form.sit} onChange={e => campo('sit', e.target.value)} style={selSt('sit')}>
                <option value="">Selecione...</option>
                {SITS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MOTIVO */}
      <div style={{ background: '#f8fafc', border: `1.5px solid ${erros.motivo ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', background: '#374151' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Motivo</span>
        </div>
        <div style={{ padding: 20 }}>
          {lbl('Descreva o motivo da retenção')}
          <textarea value={form.motivo} onChange={e => campo('motivo', e.target.value)}
            placeholder="Descreva detalhadamente o motivo pelo qual o fardo foi retido..."
            style={{ width: '100%', padding: '13px 15px', borderRadius: 10, fontSize: 14, border: `2px solid ${erros.motivo ? '#ef4444' : '#d1d5db'}`, background: erros.motivo ? '#fff5f5' : '#fff', outline: 'none', minHeight: 110, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}/>
        </div>
      </div>

      {/* EVIDÊNCIA */}
      <div style={{ background: '#f8fafc', border: `1.5px solid ${erros.evidencia ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', background: '#374151' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Evidência *</span>
        </div>
        <div style={{ padding: 20 }}>
          {!evidencia ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${erros.evidencia ? '#ef4444' : '#d1d5db'}`,
                borderRadius: 12, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                background: erros.evidencia ? '#fff5f5' : '#fff', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6b7280'; e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = erros.evidencia ? '#ef4444' : '#d1d5db'; e.currentTarget.style.background = erros.evidencia ? '#fff5f5' : '#fff' }}>
              <Upload size={32} color={erros.evidencia ? '#ef4444' : '#9ca3af'} style={{ margin: '0 auto 12px' }}/>
              <div style={{ fontSize: 15, fontWeight: 600, color: erros.evidencia ? '#dc2626' : '#374151', marginBottom: 4 }}>
                Clique para anexar arquivo
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                Word, Excel, PPT, PDF, Imagem, Vídeo, Áudio · Máx. 10 MB · 1 arquivo
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 10, background: '#f0fdf4', border: '1.5px solid #86efac' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {evidencia.type.startsWith('image/') ? '🖼️'
                  : evidencia.type.startsWith('video/') ? '🎬'
                  : evidencia.type.startsWith('audio/') ? '🎵'
                  : evidencia.name.endsWith('.pdf') ? '📄'
                  : '📎'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evidencia.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{(evidencia.size / 1024).toFixed(1)} KB</div>
              </div>
              <button onClick={removerArquivo}
                style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid #fca5a5', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <X size={14}/>
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept={TIPOS_ACEITOS} onChange={onArquivo} style={{ display: 'none' }}/>
        </div>
      </div>

      {Object.keys(erros).length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 9, background: '#fff5f5', border: '1px solid #fca5a5' }}>
          <AlertCircle size={16} color="#ef4444"/>
          <span style={{ fontSize: 13, color: '#dc2626' }}>Preencha todos os campos obrigatórios (incluindo a evidência).</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancelar} style={{ flex: 1, padding: '14px 0', borderRadius: 10, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button onClick={salvar} disabled={status === 'salvando'}
          style={{ flex: 2, padding: '14px 0', borderRadius: 10, background: 'linear-gradient(135deg,#ef4444,#b91c1c)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: status === 'salvando' ? 0.7 : 1 }}>
          {status === 'salvando' ? 'Salvando...' : '⚠ Registrar Retenção'}
        </button>
      </div>
    </div>
  )
}
