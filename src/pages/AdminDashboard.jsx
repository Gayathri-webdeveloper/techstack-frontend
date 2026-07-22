import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('ts_token')}` } })

const ICONS = ['🚀','🌐','📱','🤖','🛒','🎓','🎨','🔌','🔧','💡','⚡','🏆','🌟','🔥','💎']

export default function AdminDashboard() {
  const [tab, setTab]               = useState('messages')
  const [contacts, setContacts]         = useState([])
  const [projects, setProjects]         = useState([])
  const [achievements, setAchievements] = useState([])
  const [feedbacks, setFeedbacks]       = useState([])
  const [settings,  setSettings]        = useState([])
  const [setgSaving, setSaving]         = useState(false)
  const [settingVals, setSettingVals]   = useState({})
  const [editingProject, setEditingProject] = useState(null)
  const [editingAch,     setEditingAch]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('all')
  const [expanded, setExpanded]     = useState(null)
  const [showProjForm, setShowProjForm] = useState(false)
  const [showAchForm, setShowAchForm]   = useState(false)
  const [editProj, setEditProj]     = useState(null)
  const [editAch, setEditAch]       = useState(null)
  const [projForm, setProjForm]     = useState({ title:'', description:'', icon:'🚀', tags:'', liveUrl:'', order:0 })
  const [achForm, setAchForm]       = useState({ title:'', description:'', icon:'🏆', date:'', order:0 })
  const nav = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('ts_token')) { nav('/admin'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [c, p, a, fb, st] = await Promise.all([
        axios.get(`${API}/api/contact`, auth()),
        axios.get(`${API}/api/projects/all`, auth()),
        axios.get(`${API}/api/achievements/all`, auth()),
        axios.get(`${API}/api/feedback/all`, auth()),
        axios.get(`${API}/api/settings/all`, auth()),
      ])
      setContacts(c.data.contacts || [])
      setProjects(p.data.projects || [])
      setAchievements(a.data.achievements || [])
      setFeedbacks(fb.data.feedbacks || [])
      const sArr = st.data.settings || []
      setSettings(sArr)
      const vals = {}
      sArr.forEach(s => { vals[s.key] = s.value })
      setSettingVals(vals)
    } catch(e) { if(e.response?.status===401) nav('/admin') }
    finally { setLoading(false) }
  }

  // ── MESSAGES ──
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/api/contact/${id}/status`, { status }, auth())
      setContacts(cs => cs.map(c => c._id===id ? {...c,status} : c))
    } catch { alert('Failed') }
  }
  const delContact = async (id) => {
    if(!window.confirm('Delete this message?')) return
    try { await axios.delete(`${API}/api/contact/${id}`, auth()); setContacts(cs=>cs.filter(c=>c._id!==id)) }
    catch { alert('Failed') }
  }

  // ── PROJECTS ──
  const saveProject = async () => {
    if(!projForm.title||!projForm.description) return alert('Title and description required')
    const payload = { ...projForm, tags: projForm.tags.split(',').map(t=>t.trim()).filter(Boolean) }
    try {
      if(editProj) {
        const { data } = await axios.put(`${API}/api/projects/${editProj}`, payload, auth())
        setProjects(ps => ps.map(p => p._id===editProj ? data.project : p))
      } else {
        const { data } = await axios.post(`${API}/api/projects`, payload, auth())
        setProjects(ps => [data.project, ...ps])
      }
      setProjForm({ title:'',description:'',icon:'🚀',tags:'',liveUrl:'',order:0 })
      setShowProjForm(false); setEditProj(null)
    } catch { alert('Failed to save project') }
  }
  const delProject = async (id) => {
    if(!window.confirm('Delete this project?')) return
    try { await axios.delete(`${API}/api/projects/${id}`, auth()); setProjects(ps=>ps.filter(p=>p._id!==id)) }
    catch { alert('Failed') }
  }
  const editProject = (p) => {
    setEditProj(p._id)
    setProjForm({ title:p.title, description:p.description, icon:p.icon, tags:p.tags.join(', '), liveUrl:p.liveUrl||'', order:p.order||0 })
    setShowProjForm(true)
  }
  const toggleProjVisible = async (p) => {
    try {
      const { data } = await axios.put(`${API}/api/projects/${p._id}`, { ...p, visible:!p.visible }, auth())
      setProjects(ps => ps.map(x => x._id===p._id ? data.project : x))
    } catch { alert('Failed') }
  }

  // ── ACHIEVEMENTS ──
  const saveAchievement = async () => {
    if(!achForm.title||!achForm.description) return alert('Title and description required')
    try {
      if(editAch) {
        const { data } = await axios.put(`${API}/api/achievements/${editAch}`, achForm, auth())
        setAchievements(as => as.map(a => a._id===editAch ? data.achievement : a))
      } else {
        const { data } = await axios.post(`${API}/api/achievements`, achForm, auth())
        setAchievements(as => [data.achievement, ...as])
      }
      setAchForm({ title:'',description:'',icon:'🏆',date:'',order:0,image:'' })
      setShowAchForm(false); setEditAch(null)
    } catch { alert('Failed to save achievement') }
  }
  const delAchievement = async (id) => {
    if(!window.confirm('Delete this achievement?')) return
    try { await axios.delete(`${API}/api/achievements/${id}`, auth()); setAchievements(as=>as.filter(a=>a._id!==id)) }
    catch { alert('Failed') }
  }
  const editAchievement = (a) => {
    setEditAch(a._id)
    setAchForm({ title:a.title, description:a.description, icon:a.icon, date:a.date||'', order:a.order||0, image:a.image||'' })
    setShowAchForm(true)
  }
  const toggleAchVisible = async (a) => {
    try {
      const { data } = await axios.put(`${API}/api/achievements/${a._id}`, { ...a, visible:!a.visible }, auth())
      setAchievements(as => as.map(x => x._id===a._id ? data.achievement : x))
    } catch { alert('Failed') }
  }

  const logout = () => { localStorage.removeItem('ts_token'); nav('/admin') }

  const counts = {
    all: contacts.length,
    new: contacts.filter(c=>c.status==='new').length,
    read: contacts.filter(c=>c.status==='read').length,
    replied: contacts.filter(c=>c.status==='replied').length,
  }
  const shown = filter==='all' ? contacts : contacts.filter(c=>c.status===filter)

  return (
    <div className="admin-wrap">
      {/* NAV */}
      <div className="admin-nav">
        <h1>◆ TechStack Admin</h1>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <a href="/" style={{color:'var(--silver3)',fontSize:'.78rem',fontFamily:'var(--mono)'}}>← View Site</a>
          <button onClick={logout} className="a-btn">Logout</button>
        </div>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        {[
          {n:counts.new,         l:'NEW MESSAGES'},
          {n:contacts.length,    l:'TOTAL ENQUIRIES'},
          {n:projects.length,    l:'PROJECTS'},
          {n:achievements.length,   l:'ACHIEVEMENTS'},
          {n:feedbacks.filter(f=>!f.approved).length, l:'PENDING REVIEWS'},
        ].map(s=>(
          <div className="a-stat" key={s.l}>
            <div className="n">{s.n}</div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="admin-tabs">
        {[
          {key:'messages',    label:`Messages (${counts.new} new)`},
          {key:'projects',    label:`Projects (${projects.length})`},
          {key:'achievements',label:`Achievements (${achievements.length})`},
          {key:'feedback',    label:`Reviews (${feedbacks.filter(f=>!f.approved).length} pending)`},
          {key:'settings',    label:'⚙ Site Settings'},
        ].map(t=>(
          <button key={t.key} className={`admin-tab${tab===t.key?' active':''}`} onClick={()=>setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-body">

        {/* ── MESSAGES TAB ── */}
        {tab==='messages' && (
          <>
            <div className="a-filters">
              {['all','new','read','replied'].map(f=>(
                <button key={f} className={`a-filter${filter===f?' active':''}`} onClick={()=>setFilter(f)}>
                  {f.toUpperCase()} ({counts[f]??0})
                </button>
              ))}
            </div>
            {loading ? <p style={{color:'var(--silver3)',fontFamily:'var(--mono)',fontSize:'.8rem'}}>Loading...</p>
            : shown.length===0 ? (
              <div style={{textAlign:'center',padding:'5rem',color:'var(--silver3)',fontFamily:'var(--mono)',fontSize:'.82rem'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem',color:'rgba(124,58,237,.2)'}}>◆</div>
                No messages yet. Contact form submissions appear here.
              </div>
            ) : (
              <table>
                <thead><tr><th>DATE</th><th>NAME</th><th>EMAIL</th><th>SERVICE</th><th>BUDGET</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {shown.map(c=>(
                    <>
                      <tr key={c._id} onClick={()=>setExpanded(expanded===c._id?null:c._id)} style={{cursor:'pointer'}}>
                        <td style={{color:'var(--silver3)',fontSize:'.75rem',fontFamily:'var(--mono)'}}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{fontWeight:500}}>{c.firstName} {c.lastName}</td>
                        <td><a href={`mailto:${c.email}`} style={{color:'var(--purple2)',fontSize:'.82rem'}}>{c.email}</a></td>
                        <td style={{color:'var(--silver2)',fontSize:'.82rem'}}>{c.service}</td>
                        <td style={{color:'var(--silver3)',fontSize:'.75rem',fontFamily:'var(--mono)'}}>{c.budget}</td>
                        <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                        <td>
                          {c.status!=='read'    && <button className="a-btn" onClick={e=>{e.stopPropagation();updateStatus(c._id,'read')}}>Read</button>}
                          {c.status!=='replied' && <button className="a-btn" onClick={e=>{e.stopPropagation();updateStatus(c._id,'replied')}}>Replied</button>}
                          <button className="a-btn del" onClick={e=>{e.stopPropagation();delContact(c._id)}}>Delete</button>
                        </td>
                      </tr>
                      {expanded===c._id && (
                        <tr key={c._id+'-e'}>
                          <td colSpan="7">
                            <div className="msg-expand">
                              <div style={{fontFamily:'var(--mono)',fontSize:'.68rem',color:'var(--silver3)',marginBottom:'.6rem'}}>
                                📞 {c.phone||'No phone'} · 🕐 {new Date(c.createdAt).toLocaleString('en-IN')}
                              </div>
                              <p>{c.message}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab==='projects' && (
          <>
            <div className="admin-section-title">
              Projects
              <button className="af-btn" onClick={()=>{setShowProjForm(true);setEditProj(null);setProjForm({title:'',description:'',icon:'🚀',tags:'',liveUrl:'',order:0})}}>
                + Add Project
              </button>
            </div>

            {showProjForm && (
              <div className="add-form">
                <h3>{editProj ? '✏️ Edit Project' : '+ New Project'}</h3>
                <div className="add-form-grid">
                  <div className="af-field">
                    <label>Project Title *</label>
                    <input value={projForm.title} onChange={e=>setProjForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Hospital Management System"/>
                  </div>
                  <div className="af-field">
                    <label>Icon (emoji)</label>
                    <div style={{display:'flex',gap:'.3rem',flexWrap:'wrap',marginBottom:'.5rem'}}>
                      {ICONS.map(ic=>(
                        <button key={ic} onClick={()=>setProjForm(p=>({...p,icon:ic}))}
                          style={{background:projForm.icon===ic?'rgba(124,58,237,.3)':'rgba(124,58,237,.05)',border:`1px solid ${projForm.icon===ic?'var(--purple2)':'rgba(124,58,237,.15)'}`,borderRadius:'6px',padding:'.3rem .5rem',cursor:'pointer',fontSize:'1rem'}}>
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="af-field" style={{gridColumn:'1/-1'}}>
                    <label>Description *</label>
                    <textarea value={projForm.description} onChange={e=>setProjForm(p=>({...p,description:e.target.value}))} placeholder="What did you build and what problem does it solve?"/>
                  </div>
                  <div className="af-field">
                    <label>Tech Tags (comma separated)</label>
                    <input value={projForm.tags} onChange={e=>setProjForm(p=>({...p,tags:e.target.value}))} placeholder="React, Node.js, MongoDB"/>
                  </div>
                  <div className="af-field">
                    <label>Live URL (optional)</label>
                    <input value={projForm.liveUrl} onChange={e=>setProjForm(p=>({...p,liveUrl:e.target.value}))} placeholder="https://project.com"/>
                  </div>
                </div>
                <div style={{display:'flex',gap:'.7rem',marginTop:'1rem'}}>
                  <button className="af-btn" onClick={saveProject}>{editProj?'Save Changes':'Add Project'}</button>
                  <button className="af-btn cancel" onClick={()=>{setShowProjForm(false);setEditProj(null)}}>Cancel</button>
                </div>
              </div>
            )}

            {projects.length===0 ? (
              <div style={{textAlign:'center',padding:'4rem',color:'var(--silver3)',fontFamily:'var(--mono)',fontSize:'.82rem'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>◆</div>
                No projects yet. Click "+ Add Project" to add your first one.<br/>
                It will appear on the website immediately.
              </div>
            ) : (
              <div className="admin-cards">
                {projects.map(p=>(
                  <div className="admin-card" key={p._id} style={{opacity:p.visible?1:.5}}>
                    <div className="admin-card-icon">{p.icon}</div>
                    <h4>{p.title} {!p.visible && <span className="hidden-badge">hidden</span>}</h4>
                    <p>{p.description.substring(0,100)}{p.description.length>100?'...':''}</p>
                    <div className="admin-card-tags">
                      {p.tags.map(t=><span key={t} className="admin-card-tag">{t}</span>)}
                    </div>
                    <div className="admin-card-actions">
                      <button className="a-btn" onClick={()=>editProject(p)}>Edit</button>
                      <button className="a-btn" onClick={()=>toggleProjVisible(p)}>{p.visible?'Hide':'Show'}</button>
                      <button className="a-btn del" onClick={()=>delProject(p._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ACHIEVEMENTS TAB ── */}
        {tab==='achievements' && (
          <>
            <div className="admin-section-title">
              Achievements
              <button className="af-btn" onClick={()=>{setShowAchForm(true);setEditAch(null);setAchForm({title:'',description:'',icon:'🏆',date:'',order:0})}}>
                + Add Achievement
              </button>
            </div>

            {showAchForm && (
              <div className="add-form">
                <h3>{editAch ? '✏️ Edit Achievement' : '+ New Achievement'}</h3>
                <div className="add-form-grid">
                  <div className="af-field">
                    <label>Title *</label>
                    <input value={achForm.title} onChange={e=>setAchForm(a=>({...a,title:e.target.value}))} placeholder="e.g. Best Startup Award 2026"/>
                  </div>
                  <div className="af-field">
                    <label>Icon (emoji)</label>
                    <div style={{display:'flex',gap:'.3rem',flexWrap:'wrap'}}>
                      {ICONS.map(ic=>(
                        <button key={ic} onClick={()=>setAchForm(a=>({...a,icon:ic}))}
                          style={{background:achForm.icon===ic?'rgba(124,58,237,.3)':'rgba(124,58,237,.05)',border:`1px solid ${achForm.icon===ic?'var(--purple2)':'rgba(124,58,237,.15)'}`,borderRadius:'6px',padding:'.3rem .5rem',cursor:'pointer',fontSize:'1rem'}}>
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="af-field" style={{gridColumn:'1/-1'}}>
                    <label>Description *</label>
                    <textarea value={achForm.description} onChange={e=>setAchForm(a=>({...a,description:e.target.value}))} placeholder="Describe this achievement and its significance..."/>
                  </div>
                  <div className="af-field">
                    <label>Date / Year</label>
                    <input value={achForm.date} onChange={e=>setAchForm(a=>({...a,date:e.target.value}))} placeholder="e.g. March 2026"/>
                  </div>
                  <div className="af-field" style={{gridColumn:'1/-1'}}>
                    <label>Image URL (optional) — paste image link</label>
                    <input value={achForm.image||''} onChange={e=>setAchForm(a=>({...a,image:e.target.value}))} placeholder="https://images.unsplash.com/... or any direct image URL"/>
                    {achForm.image && (
                      <img src={achForm.image} alt="preview"
                        style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'6px',marginTop:'.5rem',border:'1px solid rgba(0,200,83,.2)'}}
                        onError={e=>{e.target.style.display='none'}}
                        onLoad={e=>{e.target.style.display='block'}}
                      />
                    )}
                    <p style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--silver3)',marginTop:'.3rem'}}>
                      Tip: Go to Unsplash/Pexels → right click image → Copy image address → paste here
                    </p>
                  </div>
                </div>
                <div style={{display:'flex',gap:'.7rem',marginTop:'1rem'}}>
                  <button className="af-btn" onClick={saveAchievement}>{editAch?'Save Changes':'Add Achievement'}</button>
                  <button className="af-btn cancel" onClick={()=>{setShowAchForm(false);setEditAch(null)}}>Cancel</button>
                </div>
              </div>
            )}

            {achievements.length===0 ? (
              <div style={{textAlign:'center',padding:'4rem',color:'var(--silver3)',fontFamily:'var(--mono)',fontSize:'.82rem'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🏆</div>
                No achievements yet. Add your first milestone!
              </div>
            ) : (
              <div className="admin-cards">
                {achievements.map(a=>(
                  <div className="admin-card" key={a._id} style={{opacity:a.visible?1:.5}}>
                    <div className="admin-card-icon">{a.icon}</div>
                    <h4>{a.title} {!a.visible && <span className="hidden-badge">hidden</span>}</h4>
                    <p>{a.description.substring(0,100)}{a.description.length>100?'...':''}</p>
                    {a.date && <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--purple3)',marginBottom:'.5rem'}}>{a.date}</div>}
                    <div className="admin-card-actions">
                      <button className="a-btn" onClick={()=>editAchievement(a)}>Edit</button>
                      <button className="a-btn" onClick={()=>toggleAchVisible(a)}>{a.visible?'Hide':'Show'}</button>
                      <button className="a-btn del" onClick={()=>delAchievement(a._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── FEEDBACK TAB ── */}
        {tab==='feedback' && (
          <>
            <div className="admin-section-title">
              Client Reviews
              <span style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--silver3)',fontWeight:400}}>
                Approve reviews to show them on the website
              </span>
            </div>
            {feedbacks.length === 0 ? (
              <div style={{textAlign:'center',padding:'4rem',color:'var(--silver3)',fontFamily:'var(--mono)',fontSize:'.82rem'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>⭐</div>
                No feedback submitted yet.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>DATE</th><th>NAME</th><th>ROLE</th>
                    <th>SERVICE</th><th>RATING</th><th>STATUS</th><th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map(fb => (
                    <>
                      <tr key={fb._id} onClick={()=>setExpanded(expanded===fb._id?null:fb._id)} style={{cursor:'pointer'}}>
                        <td style={{color:'var(--silver3)',fontSize:'.75rem',fontFamily:'var(--mono)'}}>
                          {new Date(fb.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{fontWeight:500,display:'flex',alignItems:'center',gap:'.5rem'}}>
                          {fb.photoUrl
                            ? <img src={fb.photoUrl} alt={fb.name} style={{width:'28px',height:'28px',borderRadius:'50%',objectFit:'cover',border:'1px solid rgba(0,200,83,.3)'}} onError={e=>e.target.style.display='none'}/>
                            : <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,var(--purple3),var(--purple2))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',fontWeight:700,color:'#000',flexShrink:0}}>{fb.name[0]}</div>
                          }
                          {fb.name}
                        </td>
                        <td style={{color:'var(--silver2)',fontSize:'.82rem'}}>{fb.role}</td>
                        <td style={{color:'var(--silver2)',fontSize:'.82rem'}}>{fb.service}</td>
                        <td style={{color:'#FFD700',letterSpacing:'2px'}}>{'★'.repeat(fb.rating)}</td>
                        <td>
                          <span style={{
                            padding:'.15rem .6rem',fontFamily:'var(--mono)',fontSize:'.65rem',
                            border:'1px solid',borderRadius:'4px',
                            color: fb.approved ? '#68D391' : 'var(--purple2)',
                            borderColor: fb.approved ? 'rgba(104,211,145,.3)' : 'rgba(0,200,83,.3)',
                            background: fb.approved ? 'rgba(104,211,145,.06)' : 'rgba(0,200,83,.08)',
                          }}>
                            {fb.approved ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        </td>
                        <td>
                          {!fb.approved
                            ? <button className="a-btn" onClick={async e=>{
                                e.stopPropagation()
                                try {
                                  await axios.patch(`${API}/api/feedback/${fb._id}`,{approved:true},auth())
                                  setFeedbacks(fs=>fs.map(x=>x._id===fb._id?{...x,approved:true}:x))
                                } catch { alert('Failed') }
                              }}>✓ Approve</button>
                            : <button className="a-btn" onClick={async e=>{
                                e.stopPropagation()
                                try {
                                  await axios.patch(`${API}/api/feedback/${fb._id}`,{approved:false},auth())
                                  setFeedbacks(fs=>fs.map(x=>x._id===fb._id?{...x,approved:false}:x))
                                } catch { alert('Failed') }
                              }}>Hide</button>
                          }
                          <button className="a-btn del" onClick={async e=>{
                            e.stopPropagation()
                            if(!window.confirm('Delete this review?')) return
                            try {
                              await axios.delete(`${API}/api/feedback/${fb._id}`,auth())
                              setFeedbacks(fs=>fs.filter(x=>x._id!==fb._id))
                            } catch { alert('Failed') }
                          }}>Delete</button>
                        </td>
                      </tr>
                      {expanded===fb._id && (
                        <tr key={fb._id+'-exp'}>
                          <td colSpan="7">
                            <div className="msg-expand">
                              <p style={{fontStyle:'italic'}}>"{fb.message}"</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab==='settings' && (
          <div style={{maxWidth:'780px'}}>
            <div className="admin-section-title">
              Site Settings
              <span style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--silver3)',fontWeight:400}}>
                Change text, images and contact info — updates live on website
              </span>
            </div>

            {/* Group settings by category */}
            {[
              { label:'🏠 Hero Section',   keys:['hero_title_line1','hero_title_line2','hero_subtitle','hero_badge','hero_image'] },
              { label:'📞 Contact Info',   keys:['contact_email','contact_phone','contact_location','contact_time'] },
              { label:'🏢 Company Info',   keys:['company_name','company_tagline','company_founded','company_location'] },
              { label:'📱 Social Links',   keys:['social_instagram','social_github','social_twitter'] },
              { label:'🖼 Service Images', keys:['srv_img_01','srv_img_02','srv_img_03','srv_img_04','srv_img_05','srv_img_06','srv_img_07','srv_img_08','srv_img_09','srv_img_10'] },
            ].map(group => (
              <div key={group.label} style={{marginBottom:'2rem'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--purple2)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'1rem',paddingBottom:'.5rem',borderBottom:'1px solid var(--border2)'}}>
                  {group.label}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {group.keys.map(key => {
                    const s = settings.find(x => x.key === key)
                    if (!s) return null
                    return (
                      <div key={key}>
                        <label style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--silver2)',letterSpacing:'.08em',display:'block',marginBottom:'.35rem'}}>
                          {s.label}
                        </label>
                        {s.type === 'textarea'
                          ? <textarea
                              value={settingVals[key] || ''}
                              onChange={e=>setSettingVals(v=>({...v,[key]:e.target.value}))}
                              style={{width:'100%',minHeight:'80px',resize:'vertical',background:'var(--bg)',border:'1px solid var(--border2)',borderRadius:'6px',padding:'.6rem .8rem',color:'var(--white)',fontFamily:'var(--sans)',fontSize:'.85rem',boxSizing:'border-box'}}
                            />
                          : <input
                              type={s.type==='email'?'email':s.type==='phone'?'tel':'text'}
                              value={settingVals[key] || ''}
                              onChange={e=>setSettingVals(v=>({...v,[key]:e.target.value}))}
                              style={{width:'100%',background:'var(--bg)',border:'1px solid var(--border2)',borderRadius:'6px',padding:'.6rem .8rem',color:'var(--white)',fontFamily:'var(--sans)',fontSize:'.85rem',boxSizing:'border-box'}}
                            />
                        }
                        {/* Image preview */}
                        {s.type === 'url' && settingVals[key] && (
                          <img src={settingVals[key]} alt="preview"
                            style={{width:'100%',maxHeight:'120px',objectFit:'cover',borderRadius:'6px',marginTop:'.4rem',border:'1px solid var(--border2)'}}
                            onError={e=>e.target.style.display='none'}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={async () => {
                setSaving(true)
                try {
                  await axios.post(`${API}/api/settings/bulk`, { settings: settingVals }, auth())
                  alert('✅ Settings saved! Changes are now live on the website.')
                } catch {
                  alert('❌ Failed to save. Try again.')
                } finally { setSaving(false) }
              }}
              style={{
                padding:'.75rem 2rem',background:'var(--purple)',color:'#000',
                border:'none',borderRadius:'8px',fontWeight:700,fontSize:'.9rem',
                cursor:'pointer',fontFamily:'var(--sans)',marginTop:'1rem',
                opacity: setgSaving ? 0.6 : 1,
              }}
            >
              {setgSaving ? 'Saving...' : '💾 Save All Changes'}
            </button>
            <p style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--silver3)',marginTop:'.5rem'}}>
              ✦ Changes take effect immediately after saving
            </p>
          </div>
        )}

      </div>
    </div>
  )
}