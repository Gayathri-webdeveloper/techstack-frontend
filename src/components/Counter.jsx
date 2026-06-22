import { useEffect, useState } from 'react'
import useInView from '../hooks/useInView'

export default function Counter({ target, suffix = '' }) {
  const [ref, inView] = useInView()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const dur = 1600
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(e * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{val}{suffix}</span>
}