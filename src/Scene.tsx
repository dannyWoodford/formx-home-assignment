import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'

import Cube from './components/Cube'
import Lighting from './components/Lighting'
import Floor from './components/Floor'

import KeyboardRotationControls from './components/controls/KeyboardRotationControls'

function Scene() {
  const { enable } = useControls('Stats', {
    enable: true,
  })

  const { color } = useControls('Background', {
		color: '#1a1a1a',
  })

  return (
    <>
      {enable && <Perf position='bottom-left' />}
      <fog attach='fog' args={['#1a1a1a', 1, 60]} />
      <color attach='background' args={[color]} />

      <OrbitControls maxDistance={35} makeDefault />

      <Lighting />

      <KeyboardRotationControls
        rotationSpeed={3}
        enabledAxes={{
          x: true,
          y: true,
        }}
      >
        <Cube />
      </KeyboardRotationControls>

      <Floor />
    </>
  )
}

export { Scene }
