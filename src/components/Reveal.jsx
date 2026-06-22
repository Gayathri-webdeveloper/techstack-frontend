import useInView from '../hooks/useInView'

export default function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease`,
        pointerEvents: inView ? 'all' : 'none',   // ← THIS IS THE FIX
        ...style,
      }}
    >
      {children}
    </div>
  )
}