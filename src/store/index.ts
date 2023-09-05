import { makeAutoObservable } from 'mobx'
import authStore from './authStore'
import shiftsStore from './shiftsStore'
import machinesStore from './machinesStore'
import driversStore from './driversStore'
import contrAgentStore from './contrAgentStore'

class Store {
	auth = authStore
	shifts = shiftsStore
	machines = machinesStore
	drivers = driversStore
	contrAgents = contrAgentStore
	constructor() {
		makeAutoObservable(this)
	}
}

export default new Store()
