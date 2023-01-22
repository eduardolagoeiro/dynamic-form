<script lang="ts">
	import type { NoneFallback } from './form'

	import Select, { type Item } from './select.svelte'

	export let label: string

	export let noneFallback: NoneFallback | undefined

	export let list: Item[] = []

	export let value: string

	export let optionalLabel: string = ''
</script>

<Select {list} {label} {optionalLabel} bind:value />

{#if noneFallback}
	{#if noneFallback.type === 'number'}
		<span>{noneFallback.label}</span>
		<input type="number" bind:value min={0} />
	{:else}
		{noneFallback.type}
	{/if}
{/if}
