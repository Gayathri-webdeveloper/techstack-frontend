import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || ''

const SERVICES = [
  'Web Development','Mobile App Development','AI & Automation',
  'E-Commerce Platform','Academic / Final Year Project',
  'UI/UX Design','Embedded System Project','Hardware Project','Other',
]
const BUDGETS = [
  'Under ₹10,000','₹10,000 – ₹25,000','₹25,000 – ₹75,000',
  '₹75,000 – ₹2,00,000','₹2,00,000+','Let\'s discuss',
]

export default function ContactForm() {
  const [f, setF] = useState({ firstName:'',lastName:'',email:'',phone:'',service:'',budget:'',message:'' })
  const [errs, setErrs] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k,v) => { setF(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:''})) }

  const validate = () => {
    const e={}
    if(!f.firstName.trim()) e.firstName='Required'
    if(!f.lastName.trim())  e.lastName='Required'
    if(!f.email.trim())     e.email='Required'
    else if(!/\S+@\S+\.\S+/.test(f.email)) e.email='Invalid email'
    if(!f.service)          e.service='Please select a service'
    if(!f.message.trim())   e.message='Required'
    else if(f.message.length<20) e.message='At least 20 characters'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if(Object.keys(errs).length){ setErrs(errs); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/contact`, f)
      if(data.success){ setSent(true); toast.success('Message sent! We\'ll reply within 24 hours.') }
    } catch(err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  if(sent) return (
    <div className="form-success">
      <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>✦</div>
      <h3>Message Received</h3>
      <p>Thank you for reaching out. We'll respond to <strong style={{color:'var(--gold)'}}>{f.email}</strong> within 24 hours.</p>
      <button className="btn btn-outline-gold" style={{marginTop:'1.5rem'}}
        onClick={()=>{setSent(false);setF({firstName:'',lastName:'',email:'',phone:'',service:'',budget:'',message:''})}}>
        Send Another
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-row2">
        <div className="form-field">
          <label>First Name *</label>
          <input value={f.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="Your first name"/>
          {errs.firstName && <div className="form-err">{errs.firstName}</div>}
        </div>
        <div className="form-field">
          <label>Last Name *</label>
          <input value={f.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Your last name"/>
          {errs.lastName && <div className="form-err">{errs.lastName}</div>}
        </div>
      </div>
      <div className="form-field">
        <label>Email *</label>
        <input type="email" value={f.email} onChange={e=>set('email',e.target.value)} placeholder="your@email.com"/>
        {errs.email && <div className="form-err">{errs.email}</div>}
      </div>
      <div className="form-field">
        <label>Phone (Optional)</label>
        <input value={f.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 XXXXX XXXXX"/>
      </div>
      <div className="form-field">
        <label>Service Required *</label>
        <select value={f.service} onChange={e=>set('service',e.target.value)}>
          <option value="">Select a service...</option>
          {SERVICES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        {errs.service && <div className="form-err">{errs.service}</div>}
      </div>
      <div className="form-field">
        <label>Budget Range</label>
        <select value={f.budget} onChange={e=>set('budget',e.target.value)}>
          <option value="">Select budget...</option>
          {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label>Project Details *</label>
        <textarea value={f.message} onChange={e=>set('message',e.target.value)}
          placeholder="Describe what you want to build, your timeline, and any specific requirements..."/>
        {errs.message && <div className="form-err">{errs.message}</div>}
      </div>
      <button className="form-submit" type="submit" disabled={loading}>
        <span>{loading ? 'Sending...' : 'Send Enquiry →'}</span>
      </button>
    </form>
  )
}