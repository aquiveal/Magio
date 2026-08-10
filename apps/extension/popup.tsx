import { useState, useEffect } from "react"
import {
  getTrackingEnabled, setTrackingEnabled, initStorageListener,
  getApiConfig, setHost, setSession, clearSession, normalizeHost,
} from "./lib/storage"
import { login, register } from "./lib/auth"

function originPattern(host: string): string | null {
  try {
    const url = new URL(host)
    return `${url.protocol}//${url.hostname}/*`
  } catch {
    return null
  }
}

const PANEL = { padding: '14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' } as React.CSSProperties
const INPUT = { width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #e5e7eb', boxSizing: 'border-box', marginTop: 4 } as React.CSSProperties
const LABEL = { fontSize: 11, color: '#6b7280', fontWeight: 500 } as React.CSSProperties

function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ background: '#6366f1', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>M</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Magio</div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>Email View Tracker</div>
      </div>
    </div>
  )
}

function IndexPopup() {
  const [loaded, setLoaded] = useState(false)
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState("")

  // tracking toggle
  const [enabled, setEnabled] = useState(true)

  // onboarding form
  const [mode, setMode] = useState<"login" | "register">("login")
  const [host, setHostInput] = useState("")
  const [formUser, setFormUser] = useState("")
  const [formPass, setFormPass] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getTrackingEnabled().then(setEnabled)
    initStorageListener(setEnabled)
    getApiConfig().then((cfg) => {
      setHostInput(cfg.host)
      setUsername(cfg.username)
      setConnected(Boolean(cfg.token))
      setLoaded(true)
    })
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setTrackingEnabled(next)
  }

  const submit = async () => {
    setBusy(true)
    setError("")
    const cleanHost = normalizeHost(host)
    const pattern = originPattern(cleanHost)
    if (!pattern) {
      setError("Enter a valid server URL, e.g. https://track.example.com")
      setBusy(false)
      return
    }
    try {
      const granted = await chrome.permissions.request({ origins: [pattern] })
      if (!granted) {
        setError("Permission for this host was denied")
        setBusy(false)
        return
      }
      await setHost(cleanHost)
      const result = mode === "login"
        ? await login(cleanHost, formUser, formPass)
        : await register(cleanHost, formUser, formPass)
      if (!result.ok) {
        setError(result.error)
        setBusy(false)
        return
      }
      await setSession(result.token, result.username)
      setUsername(result.username)
      setConnected(true)
      setFormPass("")
    } catch (err) {
      setError(String(err))
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    await clearSession()
    setConnected(false)
    setUsername("")
    setFormPass("")
  }

  if (!loaded) {
    return <div style={{ width: 280, padding: 20, fontFamily: 'system-ui, sans-serif' }}><Header /></div>
  }

  return (
    <div style={{ width: 280, padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <Header />

      {connected ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Auto-track emails</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Embed pixel on send</div>
            </div>
            <button
              onClick={toggle}
              style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: enabled ? '#10b981' : '#d1d5db', position: 'relative', transition: 'background 0.2s' }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 3, left: enabled ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </button>
          </div>

          <div style={{ marginTop: 12, ...PANEL }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>
              Signed in as <span style={{ fontWeight: 600, color: '#111827' }}>{username}</span>
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, wordBreak: 'break-all' }}>{normalizeHost(host)}</div>
            <button
              onClick={signOut}
              style={{ marginTop: 10, width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#ef4444', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>

          <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
            Toggle also available in compose toolbar
          </div>
        </>
      ) : (
        <div style={PANEL}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: '#eef0f3', borderRadius: 6, padding: 3 }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError("") }}
                style={{
                  flex: 1, padding: '6px 0', fontSize: 12, fontWeight: 600, borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#111827' : '#6b7280',
                  boxShadow: mode === m ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <label style={LABEL}>
            Server URL
            <input style={INPUT} value={host} onChange={(e) => setHostInput(e.target.value)} placeholder="https://track.example.com" autoComplete="off" />
          </label>
          <div style={{ marginTop: 10 }}>
            <label style={LABEL}>
              Username
              <input style={INPUT} value={formUser} onChange={(e) => setFormUser(e.target.value)} autoComplete="off" />
            </label>
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={LABEL}>
              Password
              <input style={INPUT} type="password" value={formPass} onChange={(e) => setFormPass(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submit() }} autoComplete="off" />
            </label>
          </div>

          <button
            onClick={submit}
            disabled={busy}
            style={{ marginTop: 12, width: '100%', padding: '9px 0', fontSize: 12, fontWeight: 600, color: '#fff', background: '#6366f1', border: 'none', borderRadius: 6, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}
          >
            {busy ? "Please wait…" : mode === "login" ? "Log in & connect" : "Create account & connect"}
          </button>
          {error && <div style={{ marginTop: 8, fontSize: 11, color: '#ef4444' }}>{error}</div>}
          <div style={{ marginTop: 10, fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>
            Connect to your Magio server to start tracking.
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
