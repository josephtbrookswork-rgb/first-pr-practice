import mascotUrl from '../../assets/mascot.png'

function Mascot({ size = 96 }) {
  return <img src={mascotUrl} width={size} height={size} className="mascot-fade" alt="" aria-hidden="true" />
}

export default Mascot
