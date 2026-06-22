import { useEffect, useRef } from 'react'

const LINES = [
  { type: 'cmd', text: 'npm create techstack-app@latest .' },
  { type: 'out', text: '✔ Project scaffold ready', cls: 'ok' },
  { type: 'cmd', text: 'npm run dev' },
  { type: 'out', text: '  ▲ Next.js 14  →  localhost:3000', cls: 'hi' },
  { type: 'cmd', text: 'git commit -m "feat: launch v1.0 🚀"' },
  { type: 'out', text: '[main] 1 file changed, 0 regrets', cls: 'ok' },
  { type: 'cmd', text: './deploy.sh --env=production' },
  { type: 'out', text: '🟢 Live at https://client.techstack.dev', cls: 'ok' },
  { type: 'cmd', text: '# Your idea is now live.' },
]

export default function Terminal() {
  const bodyRef = useRef(null)

  useEffect(() => {
    let li = 0, ci = 0
    let timer

    const type = () => {
      const body = bodyRef.current
      if (!body) return
      if (li >= LINES.length) {
        li = 0; ci = 0
        setTimeout(() => { body.innerHTML = ''; type() }, 1400)
        return
      }
      const line = LINES[li]
      if (ci === 0) {
        const el = document.createElement('div')
        el.className = 't-line'
        if (line.type === 'cmd') {
          el.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd" id="tl${li}"></span><span class="t-cursor"></span>`
        } else {
          el.innerHTML = `<span class="t-out${line.cls ? ' ' + line.cls : ''}" id="tl${li}"></span>`
        }
        body.appendChild(el)
        body.querySelectorAll('.t-cursor').forEach((c, i, a) => { if (i < a.length - 1) c.remove() })
      }
      const target = document.getElementById('tl' + li)
      if (target && ci < line.text.length) {
        target.textContent += line.text[ci]
        ci++
        timer = setTimeout(type, line.type === 'cmd' ? 38 : 14)
      } else {
        li++; ci = 0
        timer = setTimeout(type, line.type === 'cmd' ? 320 : 90)
      }
    }

    const init = setTimeout(type, 800)
    return () => { clearTimeout(init); clearTimeout(timer) }
  }, [])

  return (
    <div className="terminal-wrap">
      <div className="terminal-live">
        <span className="live-dot" /> live session
      </div>
      <div className="terminal">
        <div className="t-bar">
          <div className="t-dot t-red" />
          <div className="t-dot t-yellow" />
          <div className="t-dot t-green" />
          <span className="t-title">techstack ~ studio</span>
        </div>
        <div className="t-body" ref={bodyRef} />
      </div>
    </div>
  )
}