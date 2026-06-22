import { useState, useEffect } from 'react'

// Contact is the CTA button — no need for duplicate "Hire Us"
// Removed "Hire Us" — Contact already does the same job
const LINKS = [
  { label:'Services', href:'#services' },
  { label:'Work',     href:'#work'     },
  { label:'Process',  href:'#process'  },
  { label:'Guidance', href:'#guidance' },
  { label:'Reviews',  href:'#feedback' },
  { label:'About',    href:'#company'  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 70)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu when scrolling starts
  useEffect(() => {
    const fn = () => { if(open) setOpen(false) }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [open])

  const go = (href) => {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior:'smooth' })
    }, 50)
  }

  return (
    <>
      <nav className={`nav${scrolled?' scrolled':''}`}>
        {/* Logo */}
        <a href="#" className="nav-logo"
           onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}>
          <span className="nav-logo-gem"/>
          TechStack
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          {LINKS.map(l=>(
            <li key={l.href}>
              <a href={l.href} onClick={e=>{e.preventDefault();go(l.href)}}>{l.label}</a>
            </li>
          ))}
          {/* Single CTA — Contact Us */}
          <li>
            <a href="#contact" className="nav-cta"
               onClick={e=>{e.preventDefault();go('#contact')}}>
              Contact Us
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button className="nav-hamburger" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">
          <span style={{transform:open?'rotate(45deg) translateY(6px)':'none'}}/>
          <span style={{opacity:open?0:1}}/>
          <span style={{transform:open?'rotate(-45deg) translateY(-6px)':'none'}}/>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${open?' open':''}`}>
        {LINKS.map(l=>(
          <a key={l.href} href={l.href}
             onClick={e=>{e.preventDefault();go(l.href)}}>
            {l.label}
          </a>
        ))}
        {/* Contact CTA at bottom of mobile menu */}
        <a href="#contact"
           onClick={e=>{e.preventDefault();go('#contact')}}
           className="mobile-cta">
          → Contact Us
        </a>
      </div>
    </>
  )
}