import { useState, useEffect, useRef } from 'react'

// ── CREDENCIAIS FICTÍCIAS (substituir pela API TOTVS depois) ──────
const USUARIOS_VALIDOS = [
  { usuario:'igor.bittencourt', senha:'sgq2026', nome:'Igor Bittencourt', cargo:'Gestor de Qualidade'   },
  { usuario:'maria.silva',      senha:'sgq2026', nome:'Maria Silva',      cargo:'Analista de Qualidade' },
  { usuario:'admin',            senha:'admin',   nome:'Administrador',    cargo:'TI / Administração'    },
]

// ── GRID ANIMADO ──────────────────────────────────────────────────
function GridBackground() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, t = 0

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const spacing = 48
      const cols = Math.ceil(canvas.width  / spacing) + 1
      const rows = Math.ceil(canvas.height / spacing) + 1

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const px = x * spacing, py = y * spacing
          const cx = canvas.width / 2, cy = canvas.height / 2
          const dist = Math.sqrt((px-cx)**2 + (py-cy)**2)
          const wave = Math.sin(dist / 80 - t * 1.5) * 0.5 + 0.5
          ctx.beginPath()
          ctx.arc(px, py, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(56,138,221,${wave * 0.18 + 0.03})`
          ctx.fill()
        }
      }
      for (let y = 0; y < rows; y++) {
        const py = y * spacing
        const wave = Math.sin(py / 120 - t * 0.5) * 0.5 + 0.5
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(canvas.width, py)
        ctx.strokeStyle = `rgba(24,95,165,${wave * 0.06 + 0.02})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }
      for (let x = 0; x < cols; x++) {
        const px = x * spacing
        const wave = Math.sin(px / 120 - t * 0.3) * 0.5 + 0.5
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, canvas.height)
        ctx.strokeStyle = `rgba(24,95,165,${wave * 0.06 + 0.02})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }
      t += 0.012
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}/>
}

// ── PARTÍCULAS ────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length:18 }, (_,i) => ({
    id:i, left:`${5+(i*37)%90}%`, top:`${10+(i*53)%80}%`,
    size:2+(i%3), delay:i*0.4, dur:4+(i%4),
  }))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{ position:'absolute', left:p.left, top:p.top, width:p.size, height:p.size, borderRadius:'50%', background:`rgba(56,138,221,${0.3+(p.id%3)*0.15})`, boxShadow:`0 0 ${p.size*3}px rgba(56,138,221,0.6)`, animation:`float-${p.id%3} ${p.dur}s ease-in-out ${p.delay}s infinite` }}/>
      ))}
      <style>{`
        @keyframes float-0{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.2)}}
        @keyframes float-1{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(0.8)}}
        @keyframes float-2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-24px) scale(1.1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input::placeholder{color:rgba(255,255,255,0.2)}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 30px #0a1628 inset!important;-webkit-text-fill-color:#fff!important}
      `}</style>
    </div>
  )
}

// ── LOGIN ─────────────────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [usuario,   setUsuario]   = useState('')
  const [senha,     setSenha]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [erro,      setErro]      = useState('')
  const [mounted,   setMounted]   = useState(false)
  const [focusU,    setFocusU]    = useState(false)
  const [focusS,    setFocusS]    = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [sucesso,   setSucesso]   = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  function handleLogin(e) {
    e.preventDefault()
    if (!usuario.trim() || !senha.trim()) { setErro('Preencha usuário e senha.'); return }
    setErro('')
    setLoading(true)

    setTimeout(() => {
      // ── Validação fictícia — trocar por API TOTVS após aprovação do TI ──
      const encontrado = USUARIOS_VALIDOS.find(
        u => u.usuario === usuario.trim().toLowerCase() && u.senha === senha
      )
      if (encontrado) {
        setSucesso(true)
        setTimeout(() => onLogin(encontrado), 800)
      } else {
        setLoading(false)
        setErro('Usuário ou senha inválidos. Verifique suas credenciais do TOTVS.')
      }
    }, 1800)
  }

  const cs = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
  })

  const inputStyle = (focus) => ({
    width:'100%', padding:'13px 14px 13px 42px', boxSizing:'border-box',
    background: focus ? 'rgba(24,95,165,0.1)' : 'rgba(255,255,255,0.04)',
    border: `0.5px solid ${focus ? 'rgba(56,138,221,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius:12, color:'#fff', fontSize:14, fontFamily:'DM Sans', outline:'none',
    transition:'all .2s',
    boxShadow: focus ? '0 0 0 3px rgba(24,95,165,0.15), 0 0 16px rgba(24,95,165,0.1)' : 'none',
  })

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#060d1a 0%,#0a1628 40%,#081220 100%)', fontFamily:"'DM Sans',sans-serif", overflow:'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      <GridBackground/>
      <Particles/>

      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, background:'radial-gradient(circle,rgba(24,95,165,0.08) 0%,transparent 65%)', borderRadius:'50%', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:420, margin:'0 20px' }}>

        {/* Linha decorativa */}
        <div style={{ ...cs(0), display:'flex', alignItems:'center', justifyContent:'center', marginBottom:32 }}>
          <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to right,transparent,rgba(56,138,221,0.4))' }}/>
          <div style={{ margin:'0 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#185FA5', boxShadow:'0 0 10px #185FA5' }}/>
            <span style={{ fontSize:10, letterSpacing:3, color:'rgba(56,138,221,0.7)', fontFamily:'DM Mono', textTransform:'uppercase' }}>SGQ Portal</span>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#185FA5', boxShadow:'0 0 10px #185FA5' }}/>
          </div>
          <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to left,transparent,rgba(56,138,221,0.4))' }}/>
        </div>

        {/* Card */}
        <div style={{ ...cs(100), background:'rgba(10,20,40,0.85)', border:'0.5px solid rgba(56,138,221,0.2)', borderRadius:20, padding:'40px 36px 36px', backdropFilter:'blur(20px)', boxShadow:'0 0 0 0.5px rgba(56,138,221,0.1) inset, 0 24px 80px rgba(0,0,0,0.5)', position:'relative', overflow:'hidden' }}>

          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(to right,transparent,rgba(56,138,221,0.3),transparent)' }}/>
          <div style={{ position:'absolute', top:0, left:'-30%', width:'60%', height:'40%', background:'radial-gradient(ellipse,rgba(24,95,165,0.05) 0%,transparent 70%)', pointerEvents:'none' }}/>

          {/* Título */}
          <div style={{ ...cs(150), textAlign:'center', marginBottom:36 }}>
            <div style={{ width:64, height:64, borderRadius:18, margin:'0 auto 16px', background:'linear-gradient(135deg,#0F2952 0%,#185FA5 100%)', border:'0.5px solid rgba(56,138,221,0.3)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(24,95,165,0.3), 0 0 0 1px rgba(56,138,221,0.1)', position:'relative' }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M15 3L27 9V21L15 27L3 21V9L15 3Z" stroke="rgba(56,138,221,0.8)" strokeWidth="1.5" fill="rgba(24,95,165,0.3)"/>
                <path d="M15 8L22 11.5V18.5L15 22L8 18.5V11.5L15 8Z" stroke="rgba(56,138,221,0.6)" strokeWidth="1" fill="rgba(24,95,165,0.2)"/>
                <circle cx="15" cy="15" r="3" fill="rgba(56,138,221,0.9)"/>
              </svg>
            </div>
            <h1 style={{ fontSize:20, fontWeight:700, margin:'0 0 4px', background:'linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.75) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:-0.3 }}>
              Sistema de Gestão da Qualidade
            </h1>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', margin:0, letterSpacing:.5 }}>
              Acesso com credenciais corporativas
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Usuário */}
            <div style={cs(200)}>
              <label style={{ display:'block', fontSize:11, fontWeight:500, color:'rgba(56,138,221,0.8)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8, fontFamily:'DM Mono' }}>Usuário TOTVS</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:focusU?'rgba(56,138,221,0.8)':'rgba(255,255,255,0.2)', transition:'color .2s', pointerEvents:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} onFocus={() => setFocusU(true)} onBlur={() => setFocusU(false)} placeholder="seu.usuario" autoComplete="username" style={inputStyle(focusU)}/>
                {focusU && <div style={{ position:'absolute', bottom:-1, left:'10%', right:'10%', height:1, background:'linear-gradient(to right,transparent,rgba(56,138,221,0.6),transparent)', borderRadius:1 }}/>}
              </div>
            </div>

            {/* Senha */}
            <div style={cs(250)}>
              <label style={{ display:'block', fontSize:11, fontWeight:500, color:'rgba(56,138,221,0.8)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8, fontFamily:'DM Mono' }}>Senha TOTVS</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:focusS?'rgba(56,138,221,0.8)':'rgba(255,255,255,0.2)', transition:'color .2s', pointerEvents:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input type={showSenha?'text':'password'} value={senha} onChange={e => setSenha(e.target.value)} onFocus={() => setFocusS(true)} onBlur={() => setFocusS(false)} placeholder="••••••••" autoComplete="current-password"
                  style={{ ...inputStyle(focusS), paddingRight:44, letterSpacing:showSenha?'normal':3 }}/>
                <button type="button" onClick={() => setShowSenha(!showSenha)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.25)', padding:4, display:'flex', alignItems:'center' }}>
                  {showSenha
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
                {focusS && <div style={{ position:'absolute', bottom:-1, left:'10%', right:'10%', height:1, background:'linear-gradient(to right,transparent,rgba(56,138,221,0.6),transparent)', borderRadius:1 }}/>}
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'0.5px solid rgba(239,68,68,0.25)', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', boxShadow:'0 0 8px #ef4444', flexShrink:0 }}/>
                <span style={{ fontSize:12, color:'rgba(239,68,68,0.9)' }}>{erro}</span>
              </div>
            )}

            {/* Sucesso */}
            {sucesso && (
              <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(16,185,129,0.08)', border:'0.5px solid rgba(16,185,129,0.25)', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981', flexShrink:0 }}/>
                <span style={{ fontSize:12, color:'rgba(16,185,129,0.9)' }}>Autenticado! Carregando o portal...</span>
              </div>
            )}

            {/* Botão */}
            <div style={{ ...cs(300), marginTop:4 }}>
              <button type="submit" disabled={loading || sucesso}
                style={{ width:'100%', padding:'14px', borderRadius:12, background:loading||sucesso?'rgba(24,95,165,0.4)':'linear-gradient(135deg,#185FA5 0%,#0c447c 100%)', border:'0.5px solid rgba(56,138,221,0.4)', color:'#fff', fontSize:14, fontWeight:600, cursor:loading||sucesso?'wait':'pointer', letterSpacing:.5, transition:'all .2s', boxShadow:loading||sucesso?'none':'0 0 24px rgba(24,95,165,0.3), 0 4px 16px rgba(0,0,0,0.3)' }}
                onMouseEnter={e => { if(!loading&&!sucesso){ e.currentTarget.style.boxShadow='0 0 40px rgba(24,95,165,0.5)'; e.currentTarget.style.transform='translateY(-1px)' }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(24,95,165,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                    <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }}/>
                    Autenticando no TOTVS...
                  </span>
                ) : (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    Acessar o Portal
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div style={{ ...cs(350), display:'flex', alignItems:'center', gap:12, margin:'24px 0 20px' }}>
            <div style={{ flex:1, height:'0.5px', background:'rgba(255,255,255,0.08)' }}/>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:'DM Mono' }}>ou</span>
            <div style={{ flex:1, height:'0.5px', background:'rgba(255,255,255,0.08)' }}/>
          </div>

          {/* Microsoft 365 */}
          <div style={cs(380)}>
            <button type="button"
              style={{ width:'100%', padding:'13px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 23 23">
                <rect x="1"  y="1"  width="10" height="10" fill="#f25022"/>
                <rect x="12" y="1"  width="10" height="10" fill="#7fba00"/>
                <rect x="1"  y="12" width="10" height="10" fill="#00a4ef"/>
                <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
              </svg>
              Entrar com conta Microsoft 365
            </button>
          </div>

          {/* Dica de acesso */}
          <div style={{ ...cs(400), marginTop:20, padding:'10px 14px', borderRadius:10, background:'rgba(24,95,165,0.06)', border:'0.5px solid rgba(56,138,221,0.12)' }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', margin:0, textAlign:'center', lineHeight:1.6 }}>
              Use as mesmas credenciais do TOTVS.<br/>
              Em caso de dúvidas, contate o TI.
            </p>
          </div>

          <div style={{ ...cs(420), textAlign:'center', marginTop:20 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.12)', fontFamily:'DM Mono', letterSpacing:.5, margin:0 }}>
              Acesso restrito a colaboradores autorizados
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ ...cs(450), display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:24, padding:'0 4px' }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.15)', fontFamily:'DM Mono' }}>SGQ PORTAL v1.0</span>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}/>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.15)', fontFamily:'DM Mono' }}>SISTEMAS ONLINE</span>
          </div>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.15)', fontFamily:'DM Mono' }}>AZURE · TOTVS</span>
        </div>
      </div>
    </div>
  )
}