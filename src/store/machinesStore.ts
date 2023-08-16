import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import authStore from './authStore'
import { graphqlRequest } from '../services/api/graphql'

class MachinesStore {
	auth = authStore
	machines = [
		{
			id: 1,
			type: 'Погрузчик',
			name: '22',
			dimensions: '',
			weight: '',
			licensePlate: '',
			nickname: '',
		},
		{
			id: 2,
			type: 'Погрузчик',
			name: 'XCMG LW300',
			dimensions: '',
			weight: '',
			licensePlate: '',
			nickname: 'Малыш',
		},
		{
			id: 3,
			type: 'Самосвал',
			name: '956',
			dimensions: '',
			weight: '',
			licensePlate: '',
			nickname: '',
		},
		{
			id: 4,
			type: 'Бульдозер',
			name: 'т11',
			dimensions: '',
			weight: '',
			licensePlate: '',
			nickname: '',
		},
		{
			id: 5,
			type: 'Погрузчик',
			name: '16',
			dimensions: '',
			weight: '',
			licensePlate: '',
			nickname: '',
		},
	]

	constructor() {
		makeAutoObservable(this)
	}
	async getMachines() {
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
}

export default new MachinesStore()

interface Machines {
	id: number
	type: string
	name: string
	dimensions?: string
	weight?: string
	licensePlate?: string
	nickname?: string
}
interface MachinesResponse {
	equipments: Machines[]
}
