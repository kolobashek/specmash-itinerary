import { makeAutoObservable } from 'mobx'
import authStore from './authStore'
import shiftsStore from './shiftsStore'

class Store {
	auth = authStore
	shifts = shiftsStore

	constructor() {
		makeAutoObservable(this)
	}
}

export default new Store()
