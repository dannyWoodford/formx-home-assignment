import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Scene } from './Scene'
import './styles/main.css'

function Main() {
  return (
    <div className='main'>
      <Leva
        collapsed={false}
      />
      <Canvas
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 8],
        }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
