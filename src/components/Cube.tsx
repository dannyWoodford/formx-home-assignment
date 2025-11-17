import React from 'react'
import { useControls } from 'leva'

export default function Cube() {
	const { material } = useControls(
		"Cube",
		{
			material: {
				value: "PBR",
				options: ["PBR", "basic"],
			},
		},
		{ collapsed: false }
	);

	return (
		<mesh position={[0,0,0]} castShadow>
			<boxGeometry args={[1.5, 1.5, 1.5]} />
			{material === "basic" && (
				<meshBasicMaterial color={'mediumpurple'} />
			)}
			{material === "PBR" && (
				<meshStandardMaterial color={'mediumpurple'} />
			)}
		</mesh>
	)
}
