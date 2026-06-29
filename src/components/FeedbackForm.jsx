import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || ''

const SERVICES = [
  'Web Development','Mobile App Development','AI & Automation',
  'E-Commerce Platform','Academic / Final Year Project',
  'UI/UX Design','Embedded System Project','Hardware Project',
  'Journal & Research Paper','Patent Filing','Other',
]

export default function FeedbackForm({ onSuccess }) {
  const [f, setF]         = useState({ name:'', role:'', service:'', rating:0, message:'', photoUrl:'' })
  const [errs, setErrs]   = useState({})
  const [loading, setLoading] = useState(false)
  const [hover, setHover] = useState(0)
  const [previewOk, setPreviewOk] = useState(false)

  const set = (k, v) => { setF(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:''})) }

  const validate = () => {
    const e = {}
    if (!f.name.trim())    e.name    = 'Required'
    if (!f.role.trim())    e.role    = 'Required'
    if (!f.service)        e.service = 'Select a service'
    if (!f.rating)         e.rating  = 'Please select a rating'
    if (!f.message.trim()) e.message = 'Required'
    else if (f.message.length < 20) e.message = 'At least 20 characters'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrs(errs); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/feedback`, f)
      if (data.success) {
        toast.success('Thank you! Your feedback will appear after review.')
        onSuccess && onSuccess()
        setF({ name:'', role:'', service:'', rating:0, message:'', photoUrl:'' })
        setPreviewOk(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} noValidate className="feedback-form">

      {/* Star Rating */}
      <div className="form-field">
        <label>Your Rating *</label>
        <div className="star-picker">
          {[1,2,3,4,5].map(n => (
            <button key={n} type="button"
              className={`star-btn ${n<=(hover||f.rating)?'active':''}`}
              onMouseEnter={()=>setHover(n)}
              onMouseLeave={()=>setHover(0)}
              onClick={()=>set('rating',n)}>★</button>
          ))}
          {f.rating > 0 && (
            <span className="star-label">
              {['','Poor','Fair','Good','Very Good','Excellent'][f.rating]}
            </span>
          )}
        </div>
        {errs.rating && <div className="form-err">{errs.rating}</div>}
      </div>

      <div className="form-row2">
        <div className="form-field">
          <label>Your Name *</label>
          <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Rahul S."/>
          {errs.name && <div className="form-err">{errs.name}</div>}
        </div>
        <div className="form-field">
          <label>Your Role / Title *</label>
          <input value={f.role} onChange={e=>set('role',e.target.value)} placeholder="e.g. Startup Founder, Student"/>
          {errs.role && <div className="form-err">{errs.role}</div>}
        </div>
      </div>

      <div className="form-field">
        <label>Service You Used *</label>
        <select value={f.service} onChange={e=>set('service',e.target.value)}>
          <option value="">Select the service...</option>
          {SERVICES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        {errs.service && <div className="form-err">{errs.service}</div>}
      </div>

      {/* Photo URL — optional */}
      <div className="form-field">
        <label>Your Photo (optional)</label>
        <div className="photo-input-wrap">
          <input
            value={f.photoUrl}
            onChange={e=>{ set('photoUrl', e.target.value); setPreviewOk(false) }}
            placeholder="Paste a link to your photo (from Google Drive, LinkedIn, etc.)"
          />
          {f.photoUrl && (
            <img
              src={f.photoUrl}
              alt="preview"
              className="photo-preview"
              onLoad={()=>setPreviewOk(true)}
              onError={()=>setPreviewOk(false)}
              style={{display: previewOk ? 'block' : 'none'}}
            />
          )}
          {f.photoUrl && !previewOk && (
            <p style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--silver3)',marginTop:'.3rem'}}>
              ⚠ Photo not loading — make sure the link is a direct image URL
            </p>
          )}
        </div>
        <p style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--silver3)',marginTop:'.3rem'}}>
          Tip: Right-click your photo on LinkedIn/Google → "Copy image address" → paste here
        </p>
      </div>

      <div className="form-field">
        <label>Your Feedback *</label>
        <textarea
          value={f.message}
          onChange={e=>set('message',e.target.value)}
          placeholder="Share your experience working with TechStack — what did we do well?"
        />
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'.3rem'}}>
          {errs.message ? <div className="form-err">{errs.message}</div> : <div/>}
          <span style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--silver3)'}}>{f.message.length}/500</span>
        </div>
      </div>

      <button className="form-submit" type="submit" disabled={loading}>
        <span>{loading ? 'Submitting...' : 'Submit Feedback →'}</span>
      </button>
      <p style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--silver3)',marginTop:'.75rem',textAlign:'center'}}>
        ✦ Your feedback will appear on the website after admin review
      </p>
    </form>
  )
}