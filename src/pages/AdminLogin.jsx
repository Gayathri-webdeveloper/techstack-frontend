import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/admin/login`, { email, password })
      if (data.success) { localStorage.setItem('ts_token', data.token); nav('/admin/dashboard') }
    } catch(err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TechStack</h1>
        <div className="sub">ADMIN ACCESS · AUTHORISED PERSONNEL ONLY</div>
        <form onSubmit={submit}>
          <div className="l-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@techstack.dev" autoFocus/>
          </div>
          <div className="l-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
          </div>
          {error && <div className="l-err">⚠ {error}</div>}
          <button className="l-btn" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter Dashboard →'}
          </button>
        </form>
        <p style={{marginTop:'1.5rem',fontSize:'.7rem',color:'#2A3A4A',textAlign:'center',fontFamily:'var(--mono)'}}>
          Default: admin@techstack.dev / Admin@123
        </p>
      </div>
    </div>
  )
}