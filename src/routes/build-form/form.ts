export interface NoneFallback {
	label: string
	type: 'checkbox' | 'number'
}

export interface Conditional {
	key: string
	conditionExpression: 'eq' | 'contain'
	value: string | number
}

export interface JSONForm {
	key: string
	type: 'checkbox' | 'number' | 'select'
	label: string
	description?: string
	min?: number
	max?: number
	options?: {
		value: string
		label: string
	}[]
	multipleOptions?: boolean
	optional?: {
		label: string
	}
	noneFallback?: NoneFallback
	skipWhen?: Conditional[]
	showWhen?: Conditional[]
}

export interface JSONFormStep {
	title: string
	description?: string
	inputs: JSONForm[]
}

export type JSONFormSteps = JSONFormStep[]

export const form: JSONFormSteps = [
	{
		title: 'Moradia',
		inputs: [
			{
				key: 'peopleNumber',
				type: 'number',
				label: 'Há quantas pessoas (incluindo você) morando em sua residência?',
				min: 1,
				max: 10
			}
		]
	},
	{
		title: 'Gás',
		inputs: [
			{
				key: 'gasType',
				type: 'select',
				label: 'Na sua residência, utiliza-se botijão (GLP) ou Gás encanado?',
				options: [
					{
						value: 'glp',
						label: 'Botijão (GLP)'
					},
					{
						value: 'encanado',
						label: 'Gás encanado'
					},
					{
						value: 'semgas',
						label: 'Nenhum'
					}
				]
			},
			{
				skipWhen: [
					{
						key: 'gasType',
						conditionExpression: 'eq',
						value: 'semgas'
					}
				],
				key: 'gasValue',
				type: 'select',
				label: 'Em média, quanto você gasta com gás por mês?',
				options: [
					{ value: 'nada', label: 'Nada (R$0,00)' },
					{ value: 'muito_pouco', label: 'Muito pouco (R$ 21,00)' },
					{ value: 'pouco', label: 'Pouco (R$ 35,00)' },
					{ value: 'moderadamente', label: 'Moderadamente (R$ 63,00)' },
					{ value: 'bastante', label: 'Bastante (R$ 137,00)' }
				],
				noneFallback: {
					label: 'Sabe o valor exato?',
					type: 'number'
				}
			}
		]
	},
	{
		title: 'Transporte individual',
		inputs: [
			{
				key: 'transportType',
				type: 'select',
				label: 'Quais meios de transporte você costuma utilizar no seu dia a dia?',
				multipleOptions: true,
				options: [
					{
						value: 'car',
						label: 'Carro'
					},
					{
						value: 'bike',
						label: 'Bicicleta'
					},
					{
						value: 'motorcycle',
						label: 'Motocicleta'
					},
					{
						value: 'walk',
						label: 'Ando a pé'
					}
				]
			},
			{
				key: 'fuelGasolineValue',
				type: 'number',
				label: 'Em média, quanto você gasta com gasolina por mês?',
				min: 0,
				showWhen: [
					{
						key: 'transportType',
						conditionExpression: 'contain',
						value: 'car'
					}
				]
			},
			{
				key: 'fuelEthanolValue',
				type: 'number',
				label: 'Em média, quanto você gasta com etanol por mês?',
				min: 0,
				showWhen: [
					{
						key: 'transportType',
						conditionExpression: 'contain',
						value: 'car'
					}
				]
			},
			{
				key: 'fuelDieselValue',
				type: 'number',
				label: 'Em média, quanto você gasta com diesel por mês?',
				min: 0,
				showWhen: [
					{
						key: 'transportType',
						conditionExpression: 'contain',
						value: 'car'
					}
				]
			},
			{
				key: 'fuelCNGValue',
				type: 'number',
				label: 'Em média, quanto você gasta com GNV por mês?',
				min: 0,
				showWhen: [
					{
						key: 'transportType',
						conditionExpression: 'contain',
						value: 'car'
					}
				]
			}
		]
	},
	{
		title: 'Transporte público',
		inputs: [
			{
				key: 'publicTransportType',
				type: 'select',
				label: 'Quais meios de transporte público você utiliza?',
				multipleOptions: true,
				optional: {
					label: 'Não utilizo transporte público ou nenhuma das opções acima'
				},
				options: [
					{
						label: 'Metrô/Trem',
						value: 'subway'
					},
					{
						label: 'Ônibus',
						value: 'bus'
					}
				]
			}
		]
	},
	{
		title: 'Transporte Aéreo',
		inputs: [
			{
				key: 'shortFlightTransportValue',
				type: 'number',
				label: 'Quantos vôos de até três horas você realizou no ano de 2022?',
				min: 0
			},
			{
				key: 'longFlightTransportValue',
				type: 'number',
				label: 'Quantos vôos com mais de três horas você realizou no ano de 2022?',
				min: 0
			}
		]
	},
	{
		title: 'Hábitos alimentares',
		inputs: [
			{
				key: 'dailyCaloriesValue',
				type: 'select',
				label: 'Em média, quanto você come por dia?',
				options: [
					{
						label: 'Eu como pouco (~1051 kcal)',
						value: 'pouco'
					},
					{
						label: 'Moderadamente (~1577 kcal)',
						value: 'moderadamente'
					},
					{
						label: 'Bastante (~2365 kcal)',
						value: 'bastante'
					},
					{
						label: 'Muito!!! (~3154 kcal)',
						value: 'muito'
					}
				],
				noneFallback: {
					label: 'Sabe quantas calorias (kcal)?',
					type: 'number'
				}
			}
		]
	},
	{
		title: 'Hábitos alimentares',
		inputs: [
			{
				key: 'foodHabitsType',
				type: 'select',
				label: 'Como você classificaria sua dieta?',
				options: [
					{
						label: 'Alto consumo de carnes',
						value: 'highly-meat'
					},
					{
						label: 'Consumo de carnes mediano',
						value: 'some-meat'
					},
					{
						label: 'Flexitariana (carne no máx 3x por semana)',
						value: 'few-meat'
					},
					{
						label: 'Pesco-vegetariana',
						value: 'fish-veg'
					},
					{
						label: 'Ovo-lacto-vegetariana',
						value: 'egg-veg'
					},
					{
						label: 'Vegetariana estrita/vegana',
						value: 'veg'
					}
				]
			}
		]
	},
	{
		title: 'Hábitos de consumo',
		description: 'Quantas peças de roupa você comprou em 2022, em cada uma das categorias abaixo?',
		inputs: [
			{
				key: 'clothConsumption1',
				type: 'number',
				label: 'Ternos, jaquetas, vestidos, casacos e camisas',
				min: 0
			},
			{
				key: 'clothConsumption2',
				type: 'number',
				label:
					'Meias, luvas, roupas de banho, roupas íntimas, pijamas, lenços, gravatas e cachecóis',
				min: 0
			},
			{
				key: 'clothConsumption3',
				type: 'number',
				label: 'Camisetas, calças, shorts, saias e roupas de treino',
				min: 0
			}
		]
	},
	{
		title: 'Hábitos de consumo',
		description:
			'Quantos gadgets/eletrônicos você comprou em 2022, em cada uma das categorias abaixo?',
		inputs: [
			{
				key: 'eletronicConsumption1',
				type: 'number',
				label: 'Tablets, homedots e echodots',
				min: 0
			},
			{
				key: 'eletronicConsumption2',
				type: 'number',
				label: 'Notebooks',
				min: 0
			},
			{
				key: 'eletronicConsumption3',
				type: 'number',
				label: 'Computadores desktop, monitores e TV´s',
				min: 0
			}
		]
	}
]

export const nameMapper: Record<string, string> = {
	peopleNumber: 'P',
	gasValue: 'GV',
	gasType: 'GF',
	fuelGasolineValue: 'F_G',
	fuelEthanolValue: 'F_E',
	fuelDieselValue: 'F_D',
	fuelCNGValue: 'F_CNG',
	transportType: 'FF'
}

export const valueMapper: Record<string, Record<string, number>> = {
	gasType: {
		glp: 1.2,
		encanado: 1.5,
		semgas: 0
	},
	gasValue: {
		nada: 0,
		muito_pouco: 21,
		pouco: 35,
		moderadamente: 63,
		bastante: 137
	},
	transportType: {
		car: 1.8,
		bike: 1.7
	}
}

export const expression = '(P * 5) + (GV * GF) + ((F_G + F_E + F_D + F_CNG) * FF)'
// key: 'transportType',
// key: 'fuelGasolineValue',
// key: 'fuelEthanolValue',
// key: 'fuelDieselValue',
// key: 'fuelCNGValue',
// key: 'publicTransportType',
// key: 'shortFlightTransportValue',
// key: 'longFlightTransportValue',
// key: 'dailyCaloriesValue',
// key: 'foodHabitsType',
// key: 'clothConsumption1',
// key: 'clothConsumption2',
// key: 'clothConsumption3',
// key: 'eletronicConsumption1',
// key: 'eletronicConsumption2',
// key: 'eletronicConsumption3',
