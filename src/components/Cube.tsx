import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { MeshStandardMaterialParameters } from 'three'
import { Html } from '@react-three/drei'
import { useControls } from 'leva'

const FACE_PRESET_OPTIONS = ['wood', 'glass', 'grass'] as const
type FaceMaterialPreset = (typeof FACE_PRESET_OPTIONS)[number]

const FACE_MATERIAL_PRESETS: Record<FaceMaterialPreset, Partial<MeshStandardMaterialParameters>> = {
	wood: {
		color: 'red',
		metalness: 0.2,
		roughness: 0.65,
	},
	glass: {
		color: 'blue',
		metalness: 0.05,
		roughness: 0.12,
		transparent: true,
		opacity: 0.55,
		envMapIntensity: 1.2,
	},
	grass: {
		color: 'green',
		metalness: 0.05,
		roughness: 0.9,
		emissiveIntensity: 0.05,
	},
}

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
	)
	const [selectedFace, setSelectedFace] = useState<number | null>(null)
	const [facePresets, setFacePresets] = useState<FaceMaterialPreset[]>(() =>
		Array(6).fill('wood')
	)

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
			const preset = FACE_MATERIAL_PRESETS[presetKey]
			const isSelected = material === 'PBR' && selectedFace === index
			const highlightProps = isSelected
				? { emissive: '#ffe26f', emissiveIntensity: 0.1 }
				: {}

			return (
				<meshStandardMaterial
					key={index}
					attach={`material-${index}`}
					{...preset}
					{...highlightProps}
				/>
			)
		})
	}, [facePresets, material, selectedFace])

	return (
		<mesh position={[0, 0, 0]} castShadow onPointerDown={handlePointerDown}>
			<boxGeometry args={[1.5, 1.5, 1.5]} />
			{material === "basic" && (
				<meshBasicMaterial color={'mediumpurple'} />
			)}
			{material === "PBR" && (
				<>
					{faceMaterials}
					<Html className='face-select-container'fullscreen transform={false} pointerEvents='auto'>
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
