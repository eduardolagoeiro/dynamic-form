<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton'
	import { writable, type Writable } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import {
		expression,
		form,
		nameMapper,
		valueMapper,
		type Conditional,
		type JSONForm
	} from './form'
	import Select from './select.svelte'
	import SelectFallback from './select_fallback.svelte'
	import * as math from 'mathjs'

	const active: Writable<number> = writable(0)

	let values: Record<string, any> = {}

	function processCondition(conditional: Conditional, value: any) {
		if (conditional.conditionExpression === 'eq') {
			if (JSON.stringify(value) === JSON.stringify(conditional.value)) return true
		}
		if (conditional.conditionExpression === 'contain') {
			if (Array.isArray(value) && value.includes(conditional.value)) return true
		}
		return false
	}

	function processSkipWhen(when: Conditional[], ctx: Record<string, any>) {
		for (let i = 0; i < when.length; i++) {
			const conditional = when[i]
			const value = ctx[conditional.key]
			if (processCondition(conditional, value)) return false
		}
		return true
	}

	function processShowWhen(when: Conditional[], ctx: Record<string, any>) {
		for (let i = 0; i < when.length; i++) {
			const conditional = when[i]
			const value = ctx[conditional.key]
			if (!processCondition(conditional, value)) return false
		}
		return true
	}

	function show(inputForm: JSONForm, ctx: Record<string, any>) {
		if (inputForm.skipWhen) {
			return processSkipWhen(inputForm.skipWhen, ctx)
		}

		if (inputForm.showWhen) {
			return processShowWhen(inputForm.showWhen, ctx)
		}
		return true
	}

	function calc(expression: string, values: Record<string, number>) {
		try {
			return math.evaluate(expression, values)
		} catch (error) {
			return 0
		}
	}

	export function getContext(
		values: Record<string, any>,
		nameMapper: Record<string, string>,
		valueMapper: Record<string, Record<string, number>>
	) {
		const context: Record<string, number> = {}

		const keyVariables = Object.keys(nameMapper)

		for (let i = 0; i < keyVariables.length; i++) {
			const key = keyVariables[i]

			const value = values[key]

			if (typeof value === 'number') {
				context[nameMapper[key]] = value
			}
			if (typeof value === 'string') {
				context[nameMapper[key]] = valueMapper[key][value]
			}
			if (Array.isArray(value)) {
				for (let j = 0; j < value.length; j++) {
					const val = value[j]
					if (typeof val === 'string' && valueMapper[key][val]) {
						context[nameMapper[key]] = (context[nameMapper[key]] ?? 1) * valueMapper[key][val]
					}
				}
			}

			if (context[nameMapper[key]] === undefined) {
				context[nameMapper[key]] = 0
			}
		}

		return context
	}

	$: context = getContext(values, nameMapper, valueMapper)

	$: result = calc(expression, context)
</script>

<div class="flex gap-10 p-5">
	<div class="flex-1">
		<h2>Calculation:</h2>
		<pre>{expression} = {result}</pre>

		<h2 class="pt-5">Context:</h2>
		<pre>{JSON.stringify(context, null, 2)}</pre>

		<h2 class="pt-5">Values:</h2>
		<pre>{JSON.stringify(values, null, 2)}</pre>

		<h2 class="pt-5">Form JSON:</h2>
		<pre>{JSON.stringify(form, null, 2)}</pre>
	</div>
	<div class="flex-1 p-5">
		<Stepper
			{active}
			buttonTextBack="voltar"
			buttonClassesBack="btn btn-filled-surface"
			buttonTextNext="próximo"
			buttonClassesNext="btn btn-filled-surface"
			length={form.length}
			on:complete={() => {
				console.log('stepper')
			}}
		>
			{#each form as step, i}
				<Step
					index={i}
					locked={!!step.inputs.find((inputForm) => {
						const { key, optional, multipleOptions, type } = inputForm
						if (!show(inputForm, values)) return false

						if (optional) return false
						if (type === 'number') {
							if (inputForm.min !== undefined && values[key] < inputForm.min) {
								return true
							}
							if (inputForm.max !== undefined && values[key] > inputForm.max) {
								return true
							}
						}
						const value = values[key]
						if (multipleOptions && Array.isArray(value)) {
							return value.length === 0
						}
						return [undefined, ''].includes(values[key])
					})}
				>
					<svelte:fragment slot="header">{step.title}</svelte:fragment>
					{#each step.inputs as input}
						{#if show(input, values)}
							{#if input.type === 'number'}
								<label for={input.key}>
									<span>{input.label}</span>
									<input
										type="number"
										id={input.key}
										bind:value={values[input.key]}
										min={input.min}
										max={input.max}
									/>
									{#if input.min !== undefined && values[input.key] < input.min}
										<p transition:slide>
											Valor não pode ser menor que {input.min}
										</p>
									{:else if input.max !== undefined && values[input.key] > input.max}
										<p transition:slide>
											Valor não pode ser maior que {input.max}
										</p>
									{/if}
								</label>
							{:else if input.type === 'select'}
								<label for={input.key}>
									{#if input.options}
										{#if input.multipleOptions}
											<Select
												label={input.label}
												bind:value={values[input.key]}
												multipleOptions={input.multipleOptions}
												list={input.options}
												optionalLabel={input.optional?.label}
											/>
										{:else}
											<SelectFallback
												label={input.label}
												bind:value={values[input.key]}
												list={input.options}
												noneFallback={input.noneFallback}
												optionalLabel={input.optional?.label}
											/>
										{/if}
									{/if}
								</label>
							{:else}
								{input.type}
							{/if}
						{/if}
					{/each}
				</Step>
			{/each}
		</Stepper>
	</div>
</div>
