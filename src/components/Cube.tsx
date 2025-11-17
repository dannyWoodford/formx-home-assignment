import React from 'react'

export default function Cube() {
	return (
		<mesh position={[0,0,0]} castShadow>
			<boxGeometry args={[1.5, 1.5, 1.5]} />
			<meshStandardMaterial color={'mediumpurple'} />
		</mesh>
	)
}
