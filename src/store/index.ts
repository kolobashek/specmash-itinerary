import { makeAutoObservable } from "mobx";

class Store {
  userAuthorized = false
  userIsActive = false
  registrationMessage = ''

  constructor() {
    makeAutoObservable(this)
  }

  getUserAuthorized() {
    return this.userAuthorized
  }

  setUserAuthorized(authorized: boolean) {
    this.userAuthorized = authorized
  }

  getRegistrationMessage() {
    return this.registrationMessage
  }

  setRegistrationMessage(message: string) {
    this.registrationMessage = message
  }

  getUserIsActive() {
    return this.userIsActive
  }

  setUserActive(active: boolean) {
    this.userIsActive = active
  }
}

export default new Store();
