<script lang="ts" context="module">
	export interface Item {
		label: string
		value: string
	}
</script>

<script lang="ts">
	import { ListBox, ListBoxItem, SlideToggle } from '@skeletonlabs/skeleton'
	import { writable } from 'svelte/store'

	export let multipleOptions: boolean = false

	export let label: string

	export let list: Item[] = []

	export let value: string | string[]

	export let optionalLabel: string = ''

	const storeSingle = writable(value ?? (multipleOptions ? [] : ''))

	let checkedNone = false

	function eq(v1: any, v2: any) {
		if (multipleOptions) {
			return JSON.stringify(v1) === JSON.stringify(v2)
		}
		return v1 === v2
	}

	storeSingle.subscribe((selected) => {
		if (multipleOptions) value = [...selected]
		else value = selected

		if (checkedNone === false && selected && selected.length === 0) checkedNone = true
		if (checkedNone === true && selected && selected.length !== 0) checkedNone = false
		return
	})

	$: {
		if (!eq(value, $storeSingle)) storeSingle.set(value ?? '')
	}
</script>

<ListBox selected={storeSingle} {label}>
	{#each list as item}
		<ListBoxItem value={item.value}>{item.label}</ListBoxItem>
	{/each}
	{#if optionalLabel}
		<SlideToggle
			bind:checked={checkedNone}
			on:change={() => {
				if (checkedNone) value = multipleOptions ? [] : ''
				else value = multipleOptions ? [list[0].value] : list[0].value
			}}
		>
			{optionalLabel}
		</SlideToggle>
	{/if}
</ListBox>
