import React from 'react'
import { Sphere, Environment } from '@react-three/drei'

export default function Lighting() {
  return (
    <group name='Lighting'>
      <group>
        <ambientLight intensity={0.2} />

        <pointLight position={[0, 10, 0]} intensity={500}>
          {/* helper to visualize light position */}
          {/* <Sphere args={[1]}>
            <meshBasicMaterial color={'green'} />
          </Sphere> */}
        </pointLight>

        <directionalLight
          position={[11, 26, -22]}
          castShadow
          intensity={5}
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
