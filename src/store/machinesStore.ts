import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import authStore from './authStore'
import { graphqlRequest } from '../services/api/graphql'

class MachinesStore {
	auth = authStore
	machines: IMachine[] | [] = [
		// {
		// 	id: 1,
		// 	type: 'Погрузчик',
		// 	name: '22',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
		// {
		// 	id: 2,
		// 	type: 'Погрузчик',
		// 	name: 'XCMG LW300',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: 'Малыш',
		// },
		// {
		// 	id: 3,
		// 	type: 'Самосвал',
		// 	name: '956',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
		// {
		// 	id: 4,
		// 	type: 'Бульдозер',
		// 	name: 'т11',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
		// {
		// 	id: 5,
		// 	type: 'Погрузчик',
		// 	name: '16',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
	]
	machineInput: IMachineInputStore = {
		type: '',
		name: '',
		dimensions: '',
		weight: '',
		licensePlate: '',
		nickname: '',
	}
	types: MachineType[] | [] = []

	constructor() {
		makeAutoObservable(this)
		this.getMachineTypes()
	}
	getMachines = async () => {
		try {
			const machines = (await graphqlRequest(Queries.getMachines)) as MachinesResponse | Error
			if (machines instanceof Error) {
				return machines
			}
			this.machines = machines.equipments
			return machines.equipments
		} catch (error) {
			return new Error(error as string)
		}
	}
	getMachineTypes = async () => {
		try {
			const types = (await graphqlRequest(Queries.getMachineTypes)) as TypesResponse | Error
			// console.log(types)
			if (types instanceof Error) {
				return types
			}
			this.types = types.getEquipmentTypes
			return types.getEquipmentTypes
		} catch (error) {
			return new Error(error as string)
		}
	}
	setMachineInput = ({ type, name, dimensions, weight, licensePlate, nickname }: IMachineInput) => {
		console.log(
			type ? `type - ${type}` : '',
			name ? `name - ${name}` : '',
			dimensions ? `dimensions - ${dimensions}` : '',
			weight ? `weight - ${weight}` : '',
			licensePlate ? `licensePlate - ${licensePlate}` : '',
			nickname ? `nickname - ${nickname}` : ''
		)
		type && (this.machineInput.type = type)
		name && (this.machineInput.name = name)
		dimensions && (this.machineInput.dimensions = dimensions)
		weight && (this.machineInput.weight = weight)
		licensePlate && (this.machineInput.licensePlate = licensePlate)
		nickname && (this.machineInput.nickname = nickname)
	}
}

export default new MachinesStore()

interface IMachine {
	id: number
	type: string
	name: string
	dimensions?: string
	weight?: string
	licensePlate?: string
	nickname?: string
}
interface MachinesResponse {
	equipments: IMachine[]
}
interface TypesResponse {
	getEquipmentTypes: MachineType[]
}
interface MachineType {
	id: number
	name: string
}
interface IMachineInput {
	type?: string
	name?: string
	dimensions?: string
	weight?: string
	licensePlate?: string
	nickname?: string
}
interface IMachineInputStore {
	type: string
	name: string
	dimensions: string
	weight: string
	licensePlate: string
	nickname: string
}
