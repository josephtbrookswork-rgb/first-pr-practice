function ProgressDots({ total, activeIndex }) {
  return (
    <div className="dots" role="status" aria-label={`Step ${activeIndex + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, index) => (
        <span key={index} className={`pdot ${index === activeIndex ? 'active' : ''}`} aria-hidden="true" />
      ))}
    </div>
  )
}

export default ProgressDots
