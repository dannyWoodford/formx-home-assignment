import { Plane, MeshReflectorMaterial } from "@react-three/drei";

export default function Floor() {
	return (
		<>
			<Plane
				name="Floor"
				args={[100, 100]}
				position={[0, -1.5, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
				receiveShadow
			>
				<MeshReflectorMaterial
					blur={[400, 100]}
					resolution={1024}
					mixBlur={1}
					mixStrength={15}
					depthScale={1}
					minDepthThreshold={0.9}
					color="#202020"
					metalness={0.4}
					roughness={0.1}
					mirror={0.3}
				/>
			</Plane>
		</>
	);
}
