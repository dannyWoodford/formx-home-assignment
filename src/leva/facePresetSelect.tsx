import React, { useCallback } from 'react'
import { createPlugin, useInputContext, useTh } from 'leva/plugin'
import type { LevaInputProps } from 'leva/plugin'

type HighlightedSelectSettings = {
	keys: string[]
	values: any[]
	highlight: boolean
}

type HighlightedSelectInput<T> = {
	selected?: T
	options?: readonly T[] | Record<string, T>
	highlight?: boolean
}

type FacePresetInputProps = LevaInputProps<any, HighlightedSelectSettings, number>

const DropdownContainerStyle: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'auto minmax(120px, 1fr)',
	alignItems: 'center',
	columnGap: '8px',
	padding: '6px',
	borderRadius: 6,
}

const LabelStyle: React.CSSProperties = {
	fontSize: 12,
	fontWeight: 500,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
}

const SelectWrapperStyle: React.CSSProperties = {
	position: 'relative',
	width: '100%',
	height: 28,
}

const SelectStyle: React.CSSProperties = {
	width: '100%',
	height: '100%',
	backgroundColor: 'transparent',
	color: 'inherit',
	border: 'none',
	outline: 'none',
	padding: '0 28px 0 10px',
	appearance: 'none',
	fontSize: 12,
	borderRadius: 4,
}

const ChevronStyle: React.CSSProperties = {
	position: 'absolute',
	pointerEvents: 'none',
	right: 10,
	top: '50%',
	transform: 'translateY(-50%)',
	fontSize: 10,
}

const HighlightedSelectComponent = () => {
	const { label, id, value, displayValue, onUpdate, disabled, settings } =
		useInputContext<FacePresetInputProps>()
	const accent1 = useTh('colors', 'accent1')
	const highlight2 = useTh('colors', 'highlight2')
	const highlight3 = useTh('colors', 'highlight3')
	const elevation2 = useTh('colors', 'elevation2')
	const elevation3 = useTh('colors', 'elevation3')
	const { keys, values, highlight } = settings

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			const index = Number(event.currentTarget.value)
			const nextValue = values[index]
			if (typeof nextValue !== 'undefined') {
				onUpdate(nextValue)
			}
		},
		[onUpdate, values]
	)

	const selectValue =
		typeof displayValue === 'number' && !Number.isNaN(displayValue) ? displayValue : 0

	return (
		<div
			style={{
				...DropdownContainerStyle,
				color: highlight2,
				backgroundColor: highlight ? elevation2 : 'transparent',
				boxShadow: highlight ? `0 0 0 1px ${accent1}` : `0 0 0 1px transparent`,
			}}
		>
			<label htmlFor={id} style={LabelStyle}>
				{label}
			</label>
			<div
				style={{
					...SelectWrapperStyle,
					backgroundColor: elevation3,
					borderRadius: 4,
					boxShadow: highlight ? `0 0 0 1px ${accent1}` : 'none',
				}}
			>
				<select
					id={id}
					disabled={disabled}
					value={selectValue}
					onChange={handleChange}
					style={{
						...SelectStyle,
						color: highlight3 || '#fff',
						backgroundColor: 'transparent',
					}}
				>
					{keys.map((key, index) => (
						<option key={key} value={index} style={{ color: '#000' }}>
							{key}
						</option>
					))}
				</select>
				<span style={{ ...ChevronStyle, color: highlight2 || '#bbb' }}>⌄</span>
			</div>
		</div>
	)
}

const normalizeHighlightedSelect = <T,>(input?: HighlightedSelectInput<T>) => {
	const safeInput = input ?? {}
	const { highlight = false } = safeInput
	const rawOptions = safeInput.options ?? []
	let { selected } = safeInput
	let keys: string[] = []
	let values: T[] = []

	if (Array.isArray(rawOptions)) {
		values = rawOptions.slice()
		keys = rawOptions.map((option) => String(option))
	} else if (rawOptions && typeof rawOptions === 'object') {
		keys = Object.keys(rawOptions)
		values = Object.values(rawOptions)
	} else {
		keys = []
		values = []
	}

	if (selected === undefined) {
		selected = values[0]
	} else if (!values.includes(selected)) {
		keys.unshift(String(selected))
		values.unshift(selected)
	}

	return {
		value: selected,
		settings: {
			keys,
			values,
			highlight,
		},
	}
}

const sanitizeHighlightedSelect = (value: any, { values }: HighlightedSelectSettings) => {
	if (!values?.length) {
		return value
	}

	if (!values.includes(value)) {
		throw Error(`Highlighted select option "${value}" is not part of the provided options.`)
	}

	return value
}

const formatHighlightedSelect = (value: any, { values }: HighlightedSelectSettings) => {
	if (!values?.length) {
		return 0
	}
	const index = values.indexOf(value)
	return index >= 0 ? index : 0
}

export const highlightedSelect = createPlugin<HighlightedSelectInput<any>, any, HighlightedSelectSettings>({
	component: HighlightedSelectComponent,
	normalize: normalizeHighlightedSelect,
	sanitize: sanitizeHighlightedSelect,
	format: formatHighlightedSelect,
})

