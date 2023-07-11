import { makeAutoObservable } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

export default new Store();
