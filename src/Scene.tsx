import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { Cube } from './components/Cube'
import { Sphere } from './components/Sphere'
import Lighting from './components/Lighting'
import Floor from './components/Floor'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: true,
  })

  const { animate } = useControls('Cube', {
    animate: true,
  })
	
	const { color } = useControls('Background', {
		color: "#171616",
	})

  const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)

  useFrame((_, delta) => {
    if (animate) {
      cubeRef.current!.rotation.y += delta / 3
    }
  })


  return (
    <>
      {performance && <Perf position='top-left' />}
			<fog attach="fog" args={["#15151a", 1, 60]} />
			<color attach="background" args={[color]} />

      <OrbitControls maxDistance={35} makeDefault />

			<Lighting />

      <Cube ref={cubeRef} />
      <Sphere />
			<Floor />
    </>
  )
}

export { Scene }
