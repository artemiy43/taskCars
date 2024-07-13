import { defineStore } from "pinia";

export const useCarsStore = defineStore("cars", {
  state: () => ({
    cars: [],
  }),
  getters: {
    getFilteredCarsByYear: (state) => {
      return state.cars.sort((a, b) => (a.year > b.year ? 1 : -1));
    },
    getFilteredCarsByPrice: (state) => {
      return state.cars.sort((a, b) => (a.price > b.price ? 1 : -1));
    },
  },
  actions: {
    delete(id) {
      console.log(id);
      const carExist = this.cars.findIndex((item) => item.id === id);
      if (carExist !== -1) this.cars = this.cars.filter((car) => car.id !== id);
      else console.log("fgjfsjsf");
    },
    getCars(flag) {
      if (flag === 0) return this.cars;
      else if (flag === 1) return this.getFilteredCarsByYear;
      else return this.getFilteredCarsByPrice;
    },
    setCars(cars) {
      this.cars = cars;
    },
  },
});
