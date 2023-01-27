<script lang="ts">
	import { Stepper, Step, RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
	import { writable, type Writable } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import { forms, globalValues, type Conditional, type JSONForm } from './form'
	import Select from './select.svelte'
	import SelectFallback from './select_fallback.svelte'
	import * as math from 'mathjs'

	const active: Writable<number> = writable(0)

	let valuesMap: Record<string, Record<string, any>> = forms.reduce<Record<string, any>>(
		(acc, curr) => {
			acc[curr.name] = {}
			return acc
		},
		{}
	)

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
		valueMapper: Record<string, Record<string, number>>,
		globals?: Record<string, string>
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

		if (globals) {
			Object.keys(globals).forEach((globalKey) => {
				const mappedKey = globals[globalKey]
				const value = values[mappedKey]
				if (typeof value === 'number') {
					context[globalKey] = value
					return
				}
				if (typeof value === 'string') {
					context[globalKey] = globalValues.valueMapper[globalKey][value]
				}
				console.warn(`not mapped type ${typeof value}`)
			})
		}

		Object.keys(globalValues.constants).forEach((key) => {
			const value = globalValues.constants[key]
			context[key] = value
		})

		return context
	}

	const formIndex: Writable<number> = writable(1)

	formIndex.subscribe(() => {
		active.set(0)
	})

	let selected = 1

	$: {
		formIndex.set(selected)
	}

	formIndex.subscribe((val) => (selected = val))

	$: form = forms[$formIndex]

	$: values = valuesMap[form.name]

	$: context = getContext(values, form.nameMapper, form.valueMapper, form.globals)

	$: result = calc(form.expression, context)
</script>

<div class="p-5 hidden sm:block">
	<RadioGroup selected={formIndex}>
		{#each forms as form, i}
			<RadioItem value={i}>{form.name}</RadioItem>
		{/each}
	</RadioGroup>
</div>

<div class="p-5 sm:hidden">
	<select bind:value={selected}>
		{#each forms as form, i}
			<option value={i}>{form.name}</option>
		{/each}
	</select>
</div>

<div class="flex gap-10 p-5">
	<div class="flex-1 hidden sm:block">
		<h2>Calculation:</h2>
		<pre>{form.expression} = {result}</pre>

		<h2 class="pt-5">Context:</h2>
		<pre>{JSON.stringify(context, null, 2)}</pre>

		<h2 class="pt-5">Values:</h2>
		<pre>{JSON.stringify(values, null, 2)}</pre>

		<h2 class="pt-5">Form JSON:</h2>
		<pre>{JSON.stringify(form, null, 2)}</pre>
	</div>
	<div class="flex-1 p-5">
		{#key form.steps.length}
			<Stepper
				{active}
				buttonTextBack="voltar"
				buttonClassesBack="btn btn-filled-surface"
				buttonTextNext="próximo"
				buttonClassesNext="btn btn-filled-surface"
				length={form.steps.length}
			>
				{#each form.steps as step, i}
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
		{/key}
	</div>
</div>
