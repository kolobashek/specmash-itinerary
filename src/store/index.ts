import { makeAutoObservable } from 'mobx'
import authStore from './authStore'
import shiftsStore from './shiftsStore'
import machinesStore from './machinesStore'

class Store {
	auth = authStore
	shifts = shiftsStore
	machines = machinesStore

	constructor() {
		makeAutoObservable(this)
	}
}

export default new Store()
