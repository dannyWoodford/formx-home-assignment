import React from 'react'
import { Sphere, Environment } from '@react-three/drei'
import { useControls } from 'leva'

export default function Lighting() {
  const { keyLightIntensity, fillLightIntensity } = useControls('Lights', {
    keyLightIntensity: { value: 6.5, min: 0, max: 15, step: 0.5 },
    fillLightIntensity: { value: 3, min: 0, max: 15, step: 0.5 },
  })

  return (
    <group name='Lighting'>
      <group>
        <ambientLight intensity={0.2} />

        <directionalLight
          position={[-9, 8, 4]}
          castShadow
          intensity={keyLightIntensity}
          shadow-mapSize={2048}
          shadow-bias={-0.001}
        >
          {/* helper to visualize light position */}
          {/* <Sphere args={[1]}>
            <meshBasicMaterial color={'red'} />
          </Sphere> */}
          <orthographicCamera
            attach='shadow-camera'
            args={[-10, 10, 10, -10, 0.1, 100]}
          />
        </directionalLight>

        <directionalLight
          position={[9, -1, -9]}
          castShadow
          intensity={fillLightIntensity}
          shadow-mapSize={2048}
          shadow-bias={-0.001}
        >
          {/* helper to visualize light position */}
          {/* <Sphere args={[1]}>
						<meshBasicMaterial color={'green'} />
					</Sphere> */}
          <orthographicCamera
            attach='shadow-camera'
            args={[-10, 10, 10, -10, 0.1, 100]}
          />
        </directionalLight>
      </group>

      <Environment
        preset='night'
        background={false}
        backgroundBlurriness={0}
        backgroundIntensity={1}
        environmentRotation={[0, -Math.PI / 2, 0]} // optional rotation (default: 0, only works with three 0.163 and up)
      />
    </group>
  )
}
