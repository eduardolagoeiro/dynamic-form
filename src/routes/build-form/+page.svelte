<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton'
	import { writable, type Writable } from 'svelte/store'

	const active: Writable<number> = writable(0)
</script>

<div class="bg-pink-400">Page</div>
<Stepper
	{active}
	length={2}
	on:complete={() => {
		console.log('stepper')
	}}
>
	<Step index={0}>
		<svelte:fragment slot="header">(header)</svelte:fragment>
		(content)
	</Step>
	<Step index={1} locked={true}>(content)</Step>
</Stepper>
