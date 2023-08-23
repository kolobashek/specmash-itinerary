import { makeAutoObservable } from 'mobx'
import authStore from './authStore'
import shiftsStore from './shiftsStore'
import machinesStore from './machinesStore'
import driversStore from './driversStore'

class Store {
	auth = authStore
	shifts = shiftsStore
	machines = machinesStore
	drivers = driversStore

	constructor() {
		makeAutoObservable(this)
	}
}

export default new Store()
