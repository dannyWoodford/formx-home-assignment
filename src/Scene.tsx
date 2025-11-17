import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import Cube from './components/Cube'
import Lighting from './components/Lighting'
import Floor from './components/Floor'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: true,
  })
	
	const { color } = useControls('Background', {
		color: "#171616",
	})


  return (
    <>
      {performance && <Perf position='top-left' />}
			<fog attach="fog" args={["#15151a", 1, 60]} />
			<color attach="background" args={[color]} />

      <OrbitControls maxDistance={35} makeDefault />

			<Lighting />

      <Cube />
			<Floor />
    </>
  )
}

export { Scene }
