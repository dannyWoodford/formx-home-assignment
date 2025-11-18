import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { MeshStandardMaterialParameters } from 'three'
import { folder, useControls } from 'leva'
import { highlightedSelect } from '../leva/facePresetSelect'

const FACE_PRESET_OPTIONS = ['wood', 'glass', 'fur'] as const
type FaceMaterialPreset = (typeof FACE_PRESET_OPTIONS)[number]

const FACE_MATERIAL_PRESETS: Record<FaceMaterialPreset, Partial<MeshStandardMaterialParameters>> = {
	wood: {
		color: 'red',
		// metalness: 0.2,
		// roughness: 0.65,
	},
	glass: {
		color: 'blue',
		// metalness: 0.05,
		// roughness: 0.12,
		// transparent: true,
		// opacity: 0.55,
		// envMapIntensity: 1.2,
	},
	fur: {
		color: 'green',
		// metalness: 0.05,
		// roughness: 0.9,
		// emissiveIntensity: 0.05,
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

	const updateFacePreset = useCallback((faceIndex: number, nextPreset: FaceMaterialPreset) => {
		console.log('[Cube] updateFacePreset', { faceIndex, nextPreset })

		setFacePresets((prev) => {
			if (prev[faceIndex] === nextPreset) {
				console.log('[Cube] preset unchanged, skipping', { faceIndex, nextPreset })
				return prev
			}

			const updated = [...prev]
			updated[faceIndex] = nextPreset
			console.log('[Cube] preset applied', { faceIndex, presets: updated })
			return updated
		})
	}, [])

	useControls(
		() => {
			const controls = facePresets.reduce<Record<string, any>>((acc, preset, index) => {
				acc[`Face ${index + 1}`] = {
					render: () => material === 'PBR',
					disabled: material !== 'PBR',
					onChange: (nextPreset: FaceMaterialPreset) => updateFacePreset(index, nextPreset),
					...highlightedSelect({
						selected: preset,
						options: FACE_PRESET_OPTIONS,
						highlight: material === 'PBR' && selectedFace === index,
					}),
				}
				return acc
			}, {})

			return {
				'Face Materials': folder(controls, { collapsed: false }),
			}
		},
		[facePresets, material, selectedFace, updateFacePreset]
	)

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
		console.log('[Cube] recomputing materials', { facePresets, material, selectedFace })

		return facePresets.map((presetKey, index) => {
			const preset = FACE_MATERIAL_PRESETS[presetKey]
			const isSelected = material === 'PBR' && selectedFace === index
			const highlightProps = isSelected
				? { emissive: '#ffe26f', emissiveIntensity: 0.1 }
				: {}

			console.log('[Cube] face material', {
				index,
				presetKey,
				preset,
				isSelected,
				highlightProps,
			})

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
				<>{faceMaterials}</>
			)}
		</mesh>
	)
}
