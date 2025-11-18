import { ReactNode, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

type EnabledAxes = {
  x?: boolean
  y?: boolean
}

type KeyboardRotationControlsProps = {
  children: ReactNode
  rotationSpeed?: number
  enabledAxes?: EnabledAxes
}

const defaultAxes: Required<EnabledAxes> = {
  x: true,
  y: true,
}

function KeyboardRotationControls({
  children,
  rotationSpeed = Math.PI / 2, // radians per second
  enabledAxes = defaultAxes,
}: KeyboardRotationControlsProps) {
  const groupRef = useRef<Group>(null)
  const pressedKeysRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return
      if (event.key.startsWith('Arrow')) {
        pressedKeysRef.current[event.key] = true
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key.startsWith('Arrow')) {
        pressedKeysRef.current[event.key] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const rotationDelta = rotationSpeed * delta
    const { x = true, y = true } = enabledAxes

    if (x) {
      if (pressedKeysRef.current['ArrowUp']) {
        group.rotation.x -= rotationDelta
      }
      if (pressedKeysRef.current['ArrowDown']) {
        group.rotation.x += rotationDelta
      }
    }

    if (y) {
      if (pressedKeysRef.current['ArrowLeft']) {
        group.rotation.y += rotationDelta
      }
      if (pressedKeysRef.current['ArrowRight']) {
        group.rotation.y -= rotationDelta
      }
    }
  })

  return <group ref={groupRef}>{children}</group>
}

export default KeyboardRotationControls
