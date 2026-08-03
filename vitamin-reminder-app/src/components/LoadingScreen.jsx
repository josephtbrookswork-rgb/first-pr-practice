import Mascot from './ui/Mascot'

const RAY_COUNT = 10

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-rays" aria-hidden="true">
        {Array.from({ length: RAY_COUNT }).map((_, index) => (
          <span key={index} className="loading-ray" style={{ transform: `rotate(${(360 / RAY_COUNT) * index}deg) translateY(-100px)` }} />
        ))}
      </div>
      <Mascot size={104} />
      <p className="sr-only" role="status">Loading Solaris</p>
    </div>
  )
}

export default LoadingScreen
