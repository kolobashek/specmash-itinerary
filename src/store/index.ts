import { makeAutoObservable } from "mobx";

class Store {
  userAuthorized = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserAuthorized(authorized: boolean) {
    this.userAuthorized = authorized;
  }

  getUserAuthorized() {
    return this.userAuthorized;
  }
}

export default new Store();
