import { useEffect, useState } from 'react'
import axios from 'axios'
import Reveal from '../components/Reveal'
import ContactForm from '../components/ContactForm'
import FeedbackForm from '../components/FeedbackForm'

const API = import.meta.env.VITE_API_URL || ''

const SERVICES = [
  { no:'01', icon:'🌐', title:'Web Development',        desc:'Custom full-stack web applications — dashboards, portals, SaaS products, business websites built with modern MERN stack for speed and scale.', tags:['React','Node.js','MongoDB','Express'] },
  { no:'02', icon:'📱', title:'Mobile App Development', desc:'Cross-platform mobile apps for iOS and Android from a single clean codebase. Smooth, native-feeling apps that users love.', tags:['React Native','Expo'] },
  { no:'03', icon:'🤖', title:'AI & Automation',        desc:'Integrate AI into your business — smart chatbots, document processing, workflow automation and intelligent data pipelines powered by LLMs.', tags:['OpenAI','LangChain','Python'] },
  { no:'04', icon:'🛒', title:'E-Commerce Platforms',   desc:'Custom online stores with payment gateway integration, inventory management, order tracking and seller dashboards tailored to your business.', tags:['Next.js','Stripe','Razorpay'] },
  { no:'05', icon:'🎓', title:'Academic Projects',      desc:'Final-year engineering projects from concept to completion — fully documented, presentation-ready and built to impress your evaluators.', tags:['All Stacks','Documentation','Guidance'] },
  { no:'06', icon:'🎨', title:'UI/UX Design',           desc:'Clean, modern interfaces that look premium and feel intuitive — wireframes, prototypes and pixel-perfect design systems.', tags:['Figma','Prototyping','Design Systems'] },
  { no:'07', icon:'🔌', title:'Embedded Systems',       desc:'Microcontroller-based project development — IoT systems, sensor integration, Arduino/Raspberry Pi projects and firmware programming.', tags:['Arduino','Raspberry Pi','IoT','C/C++'] },
  { no:'08', icon:'🔧', title:'Hardware Projects',      desc:'End-to-end hardware project development — circuit design, PCB layout and physical prototyping for academic and industrial use.', tags:['PCB Design','Prototyping','Circuit Design'] },
]

const PROCESS = [
  { num:'01', title:'Discovery Call',    desc:"We start with a detailed conversation about your idea, goals, users and constraints. No assumptions — we ask the right questions to understand exactly what you need.", tag:'Day 1–3' },
  { num:'02', title:'Scope & Proposal',  desc:"We deliver a clear written proposal — what we'll build, how long it takes and what it costs. No hidden charges, no surprise scope creep.", tag:'Day 4–5' },
  { num:'03', title:'Design & Build',    desc:"We design and develop in focused sprints. You receive progress updates every week and can give feedback on real, working builds — not static mockups.", tag:'Week 2+' },
  { num:'04', title:'Deliver & Support', desc:"We deploy your project, hand over full documentation and provide post-delivery support. Your success is our reputation.", tag:'Final Week' },
]

const STACK = [
  { cat:'Frontend',       pills:['React.js','Next.js','TypeScript','Tailwind CSS','React Native','Figma'] },
  { cat:'Backend',        pills:['Node.js','Express.js','Python','FastAPI','REST APIs','Socket.io'] },
  { cat:'Database & AI',  pills:['MongoDB','PostgreSQL','Redis','OpenAI API','LangChain','Firebase'] },
  { cat:'Hardware & IoT', pills:['Arduino','Raspberry Pi','ESP32','MQTT','C/C++','PCB Design'] },
  { cat:'DevOps & Cloud', pills:['AWS','Docker','GitHub Actions','Vercel','Render','Nginx'] },
]

const scroll = (id) => document.querySelector(id)?.scrollIntoView({ behavior:'smooth' })

/* ── open link safely bypassing any wrapper click blocking ── */
const openLink = (url) => {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`
  const a = document.createElement('a')
  a.href = fullUrl
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default function Home() {
  const [projects,      setProjects]      = useState([])
  const [achievements,  setAchievements]  = useState([])
  const [feedbacks,     setFeedbacks]     = useState([])
  const [loadingP,      setLoadingP]      = useState(true)
  const [loadingA,      setLoadingA]      = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/projects`)
      .then(r  => setProjects(r.data.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoadingP(false))

    axios.get(`${API}/api/achievements`)
      .then(r  => setAchievements(r.data.achievements || []))
      .catch(() => setAchievements([]))
      .finally(() => setLoadingA(false))

    axios.get(`${API}/api/feedback`)
      .then(r  => setFeedbacks(r.data.feedbacks || []))
      .catch(() => setFeedbacks([]))
  }, [])

  return (
    <main>

      {/* ══ HERO ══ */}
      <section id="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="badge-dot"/>
            Est. 2026 · Tirunelveli, Tamil Nadu
          </div>
          <h1 className="hero-h1">
            <span className="plain">Engineering</span>
            <span className="grad">Digital Excellence</span>
          </h1>
          <div className="hero-divider"/>
          <p className="hero-sub">
            TechStack is a full-service software studio delivering precision-built web apps, mobile apps, AI solutions, e-commerce platforms, embedded systems and hardware projects — engineered to the highest standard.
          </p>
          <div className="hero-actions">
            <button className="btn btn-purple" onClick={()=>scroll('#contact')}>Start a Project →</button>
            <button className="btn btn-outline" onClick={()=>scroll('#services')}>Our Services</button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-val">{projects.length > 0 ? `${projects.length}+` : '∞'}</div>
              <div className="stat-lbl">Projects</div>
            </div>
            <div>
              <div className="stat-val">8+</div>
              <div className="stat-lbl">Services</div>
            </div>
            <div>
              <div className="stat-val">24h</div>
              <div className="stat-lbl">Response Time</div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"/>
        </div>
      </section>

      <div className="purple-rule"/>

      {/* ══ SERVICES ══ */}
      <section className="sec" id="services">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">01</span>
            <span className="rail-label">Services</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">What We Build</div>
              <h2 className="sec-h2">Eight Ways We<br/><em>Solve Your Problems</em></h2>
              <p className="sec-p">From software to hardware — we cover the full spectrum of digital and engineering projects.</p>
            </Reveal>
            <div className="services-grid">
              {SERVICES.map((s,i) => (
                <Reveal key={s.no} delay={i * 0.06}>
                  <div className="srv-card">
                    <span className="srv-num">{s.no}</span>
                    <div className="srv-icon-wrap">{s.icon}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <div className="srv-tags">
                      {s.tags.map(t => <span key={t} className="chip">{t}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section className="sec" id="work">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">02</span>
            <span className="rail-label">Our Work</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">Portfolio</div>
              <h2 className="sec-h2">Projects That<br/><em>Speak Results</em></h2>
              <p className="sec-p">Real products built for real clients — updated live by our team.</p>
            </Reveal>

            {loadingP ? (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginTop:'3rem'}}>
                {[1,2,3,4].map(i=>(
                  <div key={i} style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:'12px',height:'220px',opacity:.4}}/>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="zero-state">
                <div className="zero-icon">◆</div>
                <div className="zero-title">Building Our Legacy</div>
                <p className="zero-sub">
                  TechStack launched in 2026 with a clear mission — to engineer software and hardware that makes a real difference. Our portfolio is growing. Be among our first clients.
                </p>
                <div className="zero-counters">
                  <div><div className="zc-num">0</div><div className="zc-lbl">Projects Done</div></div>
                  <div><div className="zc-num">0</div><div className="zc-lbl">Active Clients</div></div>
                  <div><div className="zc-num">∞</div><div className="zc-lbl">Potential</div></div>
                </div>
                <button className="btn btn-outline" onClick={()=>scroll('#contact')}>
                  Become Our First Client →
                </button>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((p, i) => (
                  <div key={p._id} className="proj-card">
                    <span className="proj-no">{String(i+1).padStart(3,'0')}</span>
                    <div className="proj-icon">{p.icon}</div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="proj-tags">
                      {p.tags.map(t => <span key={t} className="chip">{t}</span>)}
                    </div>
                    {p.liveUrl && p.liveUrl.trim() !== '' && (
                      <div className="proj-foot">
                        <button
                          className="proj-live"
                          onClick={() => openLink(p.liveUrl)}
                        >
                          View Live ↗
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ ACHIEVEMENTS ══ */}
      <section className="sec" id="achievements">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">03</span>
            <span className="rail-label">Achievements</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">Milestones</div>
              <h2 className="sec-h2">Our <em>Achievements</em><br/>& Milestones</h2>
              <p className="sec-p">Every milestone we reach, every award we earn — displayed here in real time.</p>
            </Reveal>
            {loadingA ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginTop:'3rem'}}>
                {[1,2,3].map(i=>(
                  <div key={i} style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:'10px',height:'160px',opacity:.4}}/>
                ))}
              </div>
            ) : achievements.length === 0 ? (
              <div className="zero-state" style={{marginTop:'3rem'}}>
                <div className="zero-icon">🏆</div>
                <div className="zero-title">Milestones Incoming</div>
                <p className="zero-sub">Achievements will be showcased here as TechStack grows — first project, first client, first award.</p>
              </div>
            ) : (
              <div className="ach-grid">
                {achievements.map((a,i) => (
                  <Reveal key={a._id} delay={i*0.07}>
                    <div className="ach-card">
                      <div className="ach-icon">{a.icon}</div>
                      <h3>{a.title}</h3>
                      <p>{a.description}</p>
                      {a.date && <span className="ach-date">{a.date}</span>}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="sec" id="process">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">04</span>
            <span className="rail-label">Process</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">How We Work</div>
              <h2 className="sec-h2">Clear Process,<br/><em>Zero Surprises</em></h2>
              <p className="sec-p">We believe great software comes from great communication. Here's exactly how every TechStack project runs.</p>
            </Reveal>
            <div className="process-list">
              {PROCESS.map((p,i) => (
                <Reveal key={p.num} delay={i*0.09}>
                  <div className="proc-row">
                    <div className="proc-num">{p.num}</div>
                    <div className="proc-content">
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                      <span className="proc-tag">{p.tag}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STACK ══ */}
      <section className="sec" id="stack">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">05</span>
            <span className="rail-label">Tech Stack</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">Technologies</div>
              <h2 className="sec-h2">Tools We<br/><em>Master & Deploy</em></h2>
              <p className="sec-p">From frontend to firmware — we work with the technologies that actually get results.</p>
            </Reveal>
            <div className="stack-cats">
              {STACK.map((s,i) => (
                <Reveal key={s.cat} delay={i*0.07}>
                  <div>
                    <div className="stack-cat-label">{s.cat}</div>
                    <div className="pills">
                      {s.pills.map(p => (
                        <div key={p} className="pill">
                          <span className="pill-gem"/>{p}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <section className="sec" id="about">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">06</span>
            <span className="rail-label">Why Us</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">Why TechStack</div>
              <h2 className="sec-h2">Why Clients Choose<br/><em>Us Over Others</em></h2>
              <p className="sec-p">We are not just developers — we are your technology partner. Here is what makes TechStack different.</p>
            </Reveal>
            <div className="why-grid">
              {[
                { icon:'⚡', title:'Fast Delivery',       desc:'We ship projects on time, every time. Our sprint-based process ensures you see real working progress every single week — not just status updates.' },
                { icon:'💰', title:'Transparent Pricing', desc:'No hidden costs, no surprise invoices. You get a clear written quote before we start — and we stick to it.' },
                { icon:'🔒', title:'Full Ownership',      desc:'You own 100% of the source code, database, and deployment. No lock-ins, no strings attached. Everything is yours.' },
                { icon:'📞', title:'Direct Communication',desc:'You talk directly to the developer building your product — not a project manager in the middle. Faster decisions, better results.' },
                { icon:'🧪', title:'Quality Tested',      desc:'Every feature goes through thorough testing before delivery. We catch bugs before your users do — always.' },
                { icon:'🔄', title:'Post-Launch Support', desc:'We do not disappear after delivery. 60 days of free post-launch support included in every project. We are your long-term partner.' },
              ].map((w, i) => (
                <Reveal key={w.title} delay={i * 0.07}>
                  <div className="why-card">
                    <div className="why-icon">{w.icon}</div>
                    <h3>{w.title}</h3>
                    <p>{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="stats-strip">
        <div className="container">
          {[
            { num:'8',    label:'Services We Offer' },
            { num:'100%', label:'Code Ownership — Yours' },
            { num:'24h',  label:'Reply Guarantee' },
            { num:'60',   label:'Days Free Support' },
            { num:'2026', label:'Year Founded' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="stats-item">
                <div className="stats-num">{s.num}</div>
                <div className="stats-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ GUIDANCE SECTION ══ */}
      <section className="sec" id="guidance">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">07</span>
            <span className="rail-label">Guidance</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">We Also Guide</div>
              <h2 className="sec-h2">Not Just Code —<br/><em>We Mentor Too</em></h2>
              <p className="sec-p">Whether you are a student, a startup founder, or a business owner — TechStack guides you at every step of your tech journey.</p>
            </Reveal>
            <div className="guidance-grid">

              <Reveal delay={0.08}>
                <div className="guidance-card guidance-big">
                  <div className="gc-tag">For Students</div>
                  <h3>Academic Project Guidance</h3>
                  <p>Struggling with your final-year project? We guide you from idea selection to full implementation. You will understand your own project — not just submit it. Our mentorship covers concept, design, coding, testing, and viva preparation.</p>
                  <ul className="gc-list">
                    <li>✦ Topic selection and feasibility check</li>
                    <li>✦ System design and architecture</li>
                    <li>✦ Full implementation support</li>
                    <li>✦ Documentation and presentation prep</li>
                    <li>✦ Viva voce coaching</li>
                  </ul>
                  <button className="btn btn-outline" style={{marginTop:'1.5rem'}} onClick={()=>scroll('#contact')}>
                    Get Guidance →
                  </button>
                </div>
              </Reveal>

              <div className="guidance-right">
                <Reveal delay={0.12}>
                  <div className="guidance-card">
                    <div className="gc-tag">For Startups</div>
                    <h3>Startup Tech Consulting</h3>
                    <p>Got a business idea but not sure how to build it? We help you validate your idea, choose the right tech stack, estimate costs, and create an MVP that investors and users love.</p>
                    <ul className="gc-list">
                      <li>✦ Idea validation and market fit</li>
                      <li>✦ Tech stack recommendation</li>
                      <li>✦ MVP roadmap planning</li>
                      <li>✦ Cost and timeline estimation</li>
                    </ul>
                  </div>
                </Reveal>
                <Reveal delay={0.16}>
                  <div className="guidance-card">
                    <div className="gc-tag">For Businesses</div>
                    <h3>Digital Transformation</h3>
                    <p>Running a business on manual processes? We analyse your workflow, identify automation opportunities, and build tools that save you hours every day — from inventory to invoicing.</p>
                    <ul className="gc-list">
                      <li>✦ Business process analysis</li>
                      <li>✦ Automation opportunity mapping</li>
                      <li>✦ Custom tool development</li>
                      <li>✦ Staff training and onboarding</li>
                    </ul>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT / COMPANY ══ */}
      <section className="sec" id="company">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">08</span>
            <span className="rail-label">Company</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">About TechStack</div>
              <h2 className="sec-h2">Built from Tirunelveli,<br/><em>For the World</em></h2>
            </Reveal>
            <div className="about-layout">
              <Reveal delay={0.1}>
                <div className="about-story">
                  <p>TechStack was founded in <strong>2026</strong> by an engineer from Tirunelveli, Tamil Nadu, with a clear mission — make world-class software and hardware development accessible to startups, students, and businesses across India and beyond.</p>
                  <p>We believe that great technology should not be exclusive to large companies with massive budgets. A small business in Tirunelveli deserves the same quality of software as a startup in Bangalore. A final-year student deserves the same mentorship as an employee at a top tech firm.</p>
                  <p>That is the gap TechStack fills — <em>precision engineering at every scale.</em></p>
                  <div className="about-values">
                    {['Honest Communication','On-Time Delivery','Clean Code Always','Client First Mindset','Long-Term Partnership'].map(v => (
                      <span key={v} className="value-badge">✦ {v}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="about-info-panel">
                  <div className="aip-header">TechStack Studio</div>
                  {[
                    { label:'Founded',       val:'2026' },
                    { label:'Headquarters',  val:'Tirunelveli, Tamil Nadu' },
                    { label:'Service Area',  val:'Pan India · Remote Worldwide' },
                    { label:'Speciality',    val:'Web · Mobile · AI · Hardware · Embedded' },
                    { label:'Email',         val:'gayathrim16042006@gmail.com' },
                    { label:'Response Time', val:'Within 24 Hours' },
                    { label:'Languages',     val:'Tamil · English' },
                  ].map(r => (
                    <div key={r.label} className="aip-row">
                      <span className="aip-label">{r.label}</span>
                      <span className="aip-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CLIENT FEEDBACK & RATINGS ══ */}
      <section className="sec" id="feedback">
        <div className="sec-grid">
          <div className="sec-rail">
            <span className="rail-num">09</span>
            <span className="rail-label">Feedback</span>
          </div>
          <div className="sec-body">
            <Reveal>
              <div className="sec-tag">Client Feedback</div>
              <h2 className="sec-h2">Real Words From<br/><em>Real Clients</em></h2>
              <p className="sec-p">Every review below was submitted directly by a client after completing a project with TechStack — no fake reviews, ever.</p>
            </Reveal>

            {/* ── Live Feedback from DB ── */}
            {feedbacks.length === 0 ? (
              <Reveal delay={0.1}>
                <div className="zero-state" style={{marginTop:'3rem'}}>
                  <div className="zero-icon">⭐</div>
                  <div className="zero-title">First Review Coming Soon</div>
                  <p className="zero-sub">
                    We are just getting started. As soon as our first client completes their project, their real feedback will appear right here. No fake reviews — ever.
                  </p>
                  <div className="zero-counters">
                    <div><div className="zc-num">0</div><div className="zc-lbl">Reviews So Far</div></div>
                    <div><div className="zc-num">5★</div><div className="zc-lbl">Target Rating</div></div>
                    <div><div className="zc-num">100%</div><div className="zc-lbl">Honesty Policy</div></div>
                  </div>
                </div>
              </Reveal>
            ) : (
              <>
                {/* ── Rating Summary ── */}
                <Reveal delay={0.1}>
                  <div className="rating-banner">
                    <div className="rating-big">
                      <div className="rating-score">
                        {(feedbacks.reduce((s,f)=>s+f.rating,0)/feedbacks.length).toFixed(1)}
                      </div>
                      <div className="rating-stars">
                        {'★'.repeat(Math.round(feedbacks.reduce((s,f)=>s+f.rating,0)/feedbacks.length))}
                        {'☆'.repeat(5-Math.round(feedbacks.reduce((s,f)=>s+f.rating,0)/feedbacks.length))}
                      </div>
                      <div className="rating-count">Based on {feedbacks.length} review{feedbacks.length>1?'s':''}</div>
                    </div>
                    <div className="rating-divider"/>
                    <div className="rating-bars">
                      {[5,4,3,2,1].map(star => {
                        const count = feedbacks.filter(f=>f.rating===star).length
                        const pct   = feedbacks.length ? (count/feedbacks.length)*100 : 0
                        return (
                          <div key={star} className="rbar-row">
                            <span className="rbar-label">{'★'.repeat(star)}</span>
                            <div className="rbar-track">
                              <div className="rbar-fill" style={{width:`${pct}%`}}/>
                            </div>
                            <span className="rbar-score">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="rating-divider"/>
                    <div className="rating-counts">
                      <div className="rc-item">
                        <span className="rc-num">{feedbacks.length}</span>
                        <span className="rc-lbl">Total Reviews</span>
                      </div>
                      <div className="rc-item">
                        <span className="rc-num">
                          {feedbacks.length ? Math.round(feedbacks.filter(f=>f.rating>=4).length/feedbacks.length*100) : 0}%
                        </span>
                        <span className="rc-lbl">Recommend Us</span>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* ── Feedback Cards ── */}
                <div className="feedback-grid">
                  {feedbacks.map((fb, i) => (
                    <Reveal key={fb._id} delay={i * 0.08}>
                      <div className="feedback-card">
                        <div className="fc-top">
                          <div className="fc-avatar">
                            {fb.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                          </div>
                          <div>
                            <div className="fc-name">{fb.name}</div>
                            <div className="fc-role">{fb.role}</div>
                          </div>
                          <div className="fc-stars">{'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}</div>
                        </div>
                        <p className="fc-text">"{fb.message}"</p>
                        <div className="fc-bottom">
                          <span className="fc-service">{fb.service}</span>
                          <span className="fc-date">{new Date(fb.createdAt).getFullYear()}</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </>
            )}

            {/* ── Feedback Form ── */}
            <Reveal delay={0.2}>
              <div className="feedback-form-wrap">
                <div className="ffh">
                  <div className="sec-tag" style={{marginBottom:'.5rem'}}>Share Your Experience</div>
                  <h3>Worked with TechStack?<br/><em style={{fontStyle:'italic',color:'var(--purple2)'}}>Tell the world.</em></h3>
                  <p>If you have completed a project with us, your honest feedback means everything. It helps others trust us — and helps us get better.</p>
                </div>
                <FeedbackForm onSuccess={() => {
                  axios.get(`${API}/api/feedback`)
                    .then(r => setFeedbacks(r.data.feedbacks || []))
                    .catch(()=>{})
                }}/>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

            {/* ══ CTA ══ */}
      <Reveal>
        <section className="cta-strip">
          <h2>Ready to Build<br/>Something <em>Extraordinary?</em></h2>
          <p>Whether it is a web app, mobile app, AI tool, e-commerce platform, academic project, embedded system or hardware build — TechStack delivers with precision.</p>
          <div className="cta-btns">
            <button className="btn btn-purple" onClick={()=>scroll('#contact')}>Start Your Project →</button>
            <button className="btn btn-silver" onClick={()=>scroll('#services')}>Explore Services</button>
          </div>
        </section>
      </Reveal>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{borderTop:'1px solid var(--border2)'}}>
        <div className="contact-grid">
          <div className="contact-left">
            <Reveal>
              <div className="sec-tag">Get In Touch</div>
              <h2>Let us Discuss<br/><em>Your Project.</em></h2>
              <p>Tell us what you want to build. We will come back to you within 24 hours with a clear scope, timeline and pricing. No obligation, no pressure.</p>
              {[
                { icon:'📧', text:'gayathrim16042006@gmail.com' },
                { icon:'📞', text:'+91 XXXXX XXXXX (update soon)' },
                { icon:'📍', text:'Tirunelveli, Tamil Nadu, India' },
                { icon:'🕐', text:'Mon to Sat · 9 AM to 7 PM IST' },
                { icon:'⚡', text:'Response within 24 hours, guaranteed' },
              ].map(c => (
                <div key={c.text} className="contact-item">
                  <div className="ci-icon">{c.icon}</div>
                  <span className="ci-text">{c.text}</span>
                </div>
              ))}
              <div style={{marginTop:'2rem',padding:'1.5rem',border:'1px solid var(--border)',borderRadius:'10px',background:'var(--purple-dim)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--purple2)',letterSpacing:'.1em',marginBottom:'.75rem'}}>FIND US ON</div>
                <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
                  {['Instagram','LinkedIn','GitHub'].map(s => (
                    <a key={s} href="#" className="btn btn-outline" style={{padding:'.4rem 1rem',fontSize:'.72rem'}}>{s}</a>
                  ))}
                </div>
                <p style={{marginTop:'.75rem',fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--silver3)'}}>Social links coming soon</p>
              </div>
            </Reveal>
          </div>
          <div className="contact-right">
            <Reveal delay={0.1}>
              <div style={{marginBottom:'2rem'}}>
                <div className="sec-tag">Send Enquiry</div>
                <p style={{color:'var(--silver2)',fontSize:'.9rem',fontWeight:300}}>Fill the form — we reply with a detailed proposal within 24 hours.</p>
              </div>
              <ContactForm/>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="foot-brand">
          <div className="nav-logo" style={{marginBottom:'.5rem'}}>
            <span className="nav-logo-gem"/>TechStack
          </div>
          <p>Engineering Digital Excellence. Full-stack software and hardware studio based in Tirunelveli, Tamil Nadu. Built to last.</p>
          <div className="foot-loc">📍 Tirunelveli, Tamil Nadu · Est. 2026</div>
          <div className="foot-socials">
            {['in','X','gh','ig'].map(s => (
              <a key={s} href="#" className="foot-social">{s}</a>
            ))}
          </div>
        </div>
        <div className="foot-col">
          <h4>Services</h4>
          <ul>
            {['Web Development','Mobile Apps','AI & Automation','E-Commerce','Academic Projects','UI/UX Design','Embedded Systems','Hardware Projects'].map(s => (
              <li key={s}><a href="#services" onClick={e=>{e.preventDefault();scroll('#services')}}>{s}</a></li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <ul>
            {[
              {label:'About Us',      href:'#company'},
              {label:'Portfolio',     href:'#work'},
              {label:'Achievements',  href:'#achievements'},
              {label:'Our Process',   href:'#process'},
              {label:'Guidance',      href:'#guidance'},
              {label:'Why TechStack', href:'#about'},
              {label:'Contact',       href:'#contact'},
            ].map(l => (
              <li key={l.label}><a href={l.href} onClick={e=>{e.preventDefault();scroll(l.href)}}>{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:gayathrim16042006@gmail.com">gayathrim16042006@gmail.com</a></li>
            <li><a href="#">+91 XXXXX XXXXX</a></li>
            <li><a href="#">Tirunelveli, TN</a></li>
            <li><a href="/admin">Admin Panel</a></li>
          </ul>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} TechStack. All rights reserved. Tirunelveli, Tamil Nadu.</p>
          <p>© TechStack Studio · Tirunelveli, Tamil Nadu · Est. 2026</p>
        </div>
      </footer>

    </main>
  )
}