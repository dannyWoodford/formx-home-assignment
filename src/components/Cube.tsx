import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { MeshStandardMaterialParameters, Texture, Vector2Tuple } from 'three'
import { Html, useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace, DoubleSide, Vector2 } from 'three'
import { useControls } from 'leva'

const DEFAULT_PRESET: FaceMaterialPreset = 'brick'
const FACE_PRESET_OPTIONS = ['brick', 'shingle', 'metal', 'fabric'] as const
type FaceMaterialPreset = (typeof FACE_PRESET_OPTIONS)[number]

type MaterialTextures = Partial<Record<'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'displacementMap', string>>

type MaterialDefinition = {
	defaults: Partial<MeshStandardMaterialParameters>
	textures?: MaterialTextures
	textureRepeat?: number
	normalScale?: Vector2Tuple
}

const MATERIAL_DEFINITIONS: Record<FaceMaterialPreset, MaterialDefinition> = {
	brick: {
		defaults: {
			metalness: 0,
			roughness: 0.85,
			color: '#ffffff',
		},
		textures: {
			map: '/textures/brick/Poliigon_BrickWallReclaimed_8320_BaseColor.jpg',
			normalMap: '/textures/brick/Poliigon_BrickWallReclaimed_8320_Normal.png',
			roughnessMap: '/textures/brick/Poliigon_BrickWallReclaimed_8320_Roughness.jpg',
			metalnessMap: '/textures/brick/Poliigon_BrickWallReclaimed_8320_Metallic.jpg',
			aoMap: '/textures/brick/Poliigon_BrickWallReclaimed_8320_AmbientOcclusion.jpg',
		},
		textureRepeat: 0.2,
		normalScale: [1, 1],
	},
	shingle: {
		defaults: {
			metalness: 0,
			roughness: 0.9,
		},
		textures: {
			map: '/textures/shingle/Poliigon_WoodRoofShingle_7834_BaseColor.jpg',
			normalMap: '/textures/shingle/Poliigon_WoodRoofShingle_7834_Normal.png',
			roughnessMap: '/textures/shingle/Poliigon_WoodRoofShingle_7834_Roughness.jpg',
			metalnessMap: '/textures/shingle/Poliigon_WoodRoofShingle_7834_Metallic.jpg',
			aoMap: '/textures/shingle/Poliigon_WoodRoofShingle_7834_AmbientOcclusion.jpg',
		},
		textureRepeat: 0.3,
		normalScale: [0.8, 0.8],
	},
	metal: {
		defaults: {
			metalness: 1,
			roughness: 0.7,
			envMapIntensity: 1.1,
		},
		textures: {
			map: '/textures/metal/MetalCorrodedHeavy001_COL_1K_METALNESS.jpg',
			normalMap: '/textures/metal/MetalCorrodedHeavy001_NRM_1K_METALNESS.jpg',
			roughnessMap: '/textures/metal/MetalCorrodedHeavy001_ROUGHNESS_1K_METALNESS.jpg',
			metalnessMap: '/textures/metal/MetalCorrodedHeavy001_METALNESS_1K_METALNESS.jpg',
		},
		textureRepeat: 0.6,
		normalScale: [1.2, 1.2],
	},
	fabric: {
		defaults: {
			metalness: 0,
			roughness: 0.8,
		},
		textures: {
			map: '/textures/fabric/Poliigon_BoucleFabricBubbly_7827_BaseColor.jpg',
			normalMap: '/textures/fabric/Poliigon_BoucleFabricBubbly_7827_Normal.png',
			roughnessMap: '/textures/fabric/Poliigon_BoucleFabricBubbly_7827_Roughness.jpg',
			metalnessMap: '/textures/fabric/Poliigon_BoucleFabricBubbly_7827_Metallic.jpg',
			aoMap: '/textures/fabric/Poliigon_BoucleFabricBubbly_7827_AmbientOcclusion.jpg',
		},
		textureRepeat: 0.9,
		normalScale: [0.6, 0.6],
	},
}

export default function Cube() {
	const { material } = useControls(
		"Cube",
		{
			material: {
				value: "PBR",
				options: ["PBR", "Basic"],
			},
		},
		{ collapsed: false }
	)
	const [selectedFace, setSelectedFace] = useState<number | null>(null)
	const [facePresets, setFacePresets] = useState<FaceMaterialPreset[]>(() =>
		Array(6).fill(DEFAULT_PRESET)
	)

	const shingleTextures = useTexture(
		MATERIAL_DEFINITIONS.shingle.textures ?? {}
	) as Partial<Record<keyof MaterialTextures, Texture>>
	const brickTextures = useTexture(
		MATERIAL_DEFINITIONS.brick.textures ?? {}
	) as Partial<Record<keyof MaterialTextures, Texture>>
	const metalTextures = useTexture(
		MATERIAL_DEFINITIONS.metal.textures ?? {}
	) as Partial<Record<keyof MaterialTextures, Texture>>
	const fabricTextures = useTexture(
		MATERIAL_DEFINITIONS.fabric.textures ?? {}
	) as Partial<Record<keyof MaterialTextures, Texture>>

	const materialConfigs = useMemo<
		Record<FaceMaterialPreset, Partial<MeshStandardMaterialParameters>>
	>(() => {
		const configs: Record<FaceMaterialPreset, Partial<MeshStandardMaterialParameters>> = {
			shingle: MATERIAL_DEFINITIONS.shingle.defaults,
			brick: MATERIAL_DEFINITIONS.brick.defaults,
			metal: MATERIAL_DEFINITIONS.metal.defaults,
			fabric: MATERIAL_DEFINITIONS.fabric.defaults,
		}

		const applyTextures = (
			targetKey: FaceMaterialPreset,
			textures: Partial<Record<keyof MaterialTextures, Texture>>,
			definition: MaterialDefinition
		) => {
			if (!definition.textures) return
			const repeat = definition.textureRepeat ?? 1

			Object.values(textures).forEach((texture) => {
				if (!texture) return
				texture.wrapS = RepeatWrapping
				texture.wrapT = RepeatWrapping
				texture.repeat.set(repeat, repeat)
			})

			if (textures.map) {
				textures.map.colorSpace = SRGBColorSpace
			}

			configs[targetKey] = {
				...definition.defaults,
				...textures,
				...(definition.normalScale && {
					normalScale: new Vector2(...definition.normalScale),
				}),
			}
		}

		applyTextures('shingle', shingleTextures, MATERIAL_DEFINITIONS.shingle)
		applyTextures('brick', brickTextures, MATERIAL_DEFINITIONS.brick)
		applyTextures('metal', metalTextures, MATERIAL_DEFINITIONS.metal)
		applyTextures('fabric', fabricTextures, MATERIAL_DEFINITIONS.fabric)

		return configs
	}, [shingleTextures, brickTextures, metalTextures, fabricTextures])

	const handlePresetChange = useCallback((faceIndex: number, nextPreset: FaceMaterialPreset) => {
		setFacePresets((prev) => {
			if (prev[faceIndex] === nextPreset) {
				return prev
			}

			const updated = [...prev]
			updated[faceIndex] = nextPreset
			return updated
		})
		setSelectedFace(faceIndex)
	}, [])

	useEffect(() => {
		if (material !== 'PBR') {
			setSelectedFace(null)
		}
	}, [material])

	const handlePointerDown = useCallback(
		(event: ThreeEvent<PointerEvent>) => {
			if (material !== 'PBR') {
				return
			}

			event.stopPropagation()
			if (typeof event.faceIndex !== 'number') {
				return
			}

			const faceId = Math.floor(event.faceIndex / 2)
			setSelectedFace(faceId)
		},
		[material]
	)

	const faceMaterials = useMemo(() => {
		return facePresets.map((presetKey, index) => {
			const preset = materialConfigs[presetKey]
			const isSelected = material === 'PBR' && selectedFace === index
			const highlightProps = isSelected
				? { emissive: 'white', emissiveIntensity: 0.03 }
				: {}

			return (
				<meshStandardMaterial
					key={index}
					attach={`material-${index}`}
					{...preset}
					{...highlightProps}
					side={DoubleSide}
				/>
			)
		})
	}, [facePresets, material, materialConfigs, selectedFace])

	return (
		<mesh position={[0, 0, 0]} castShadow onPointerDown={handlePointerDown}>
			<boxGeometry args={[1.5, 1.5, 1.5]} />
			{material === "Basic" && (
				<meshBasicMaterial color={'mediumpurple'} />
			)}
			{material === "PBR" && (
				<>
					{faceMaterials}
					<Html wrapperClass='face-select-container-wrapper' className='face-select-container' fullscreen transform={false}>
						<div style={uiWrapperStyle}>
							<div style={panelStyle}>
								{facePresets.map((preset, index) => {
									const isActive = selectedFace === index

									return (
										<div
											key={index}
											style={{
												...rowStyle,
												borderColor: isActive ? '#ffb347' : '#3a3a3a',
												backgroundColor: isActive ? '#2b2b2b' : '#1a1a1a',
											}}
											onClick={() => setSelectedFace(index)}
										>
											<span style={labelStyle}>Face {index + 1}</span>
											<select
												value={preset}
												style={selectStyle}
												onChange={(event) =>
													handlePresetChange(
														index,
														event.target.value as FaceMaterialPreset
													)
												}
												onClick={(event) => {
													event.stopPropagation()
												}}
											>
												{FACE_PRESET_OPTIONS.map((option) => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
											</select>
										</div>
									)
								})}
							</div>
						</div>
					</Html>
				</>
			)}
		</mesh>
	)
}

const panelStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: 8,
	padding: '12px 14px',
	borderRadius: 10,
	backgroundColor: 'rgba(12,12,12,0.95)',
	boxShadow: '0 10px 25px rgba(0,0,0,0.45)',
	minWidth: 180,
	fontSize: 12,
}

const rowStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 8,
	padding: '6px 8px',
	borderRadius: 8,
	border: '1px solid #3a3a3a',
	cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
	color: '#f5f5f5',
	fontSize: 11,
}

const selectStyle: React.CSSProperties = {
	flex: 1,
	backgroundColor: '#0d0d0d',
	color: '#f5f5f5',
	border: '1px solid #2f2f2f',
	borderRadius: 6,
	padding: '4px 6px',
	fontSize: 12,
}

const uiWrapperStyle: React.CSSProperties = {
	position: 'absolute',
	top: "auto",
	bottom: 0,
	right: 0,
	display: 'flex',
	justifyContent: 'flex-end',
	pointerEvents: 'auto',
}
