<template>
  <main class="main">
    <button class="sort_button" @click="sortedFlag = 1">
      Сортировка по году
    </button>
    <button class="sort_button" @click="sortedFlag = 2">
      Сортировка по стоимости
    </button>
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in carsStore.getCars(sortedFlag)"
        :key="index"
      >
        <div class="item_icons">
          <span class="delete_icon" @click="carsStore.delete(item.id)"></span>
          <span class="edit_icon" @click="open(item.id)"></span>
        </div>
        <span class="item__info">{{ `id: ${item.id}` }}</span>
        <span class="item__info">{{ `name: ${item.name}` }}</span>
        <span class="item__info">{{ `model: ${item.model}` }}</span>
        <span class="item__info">{{ `year: ${item.year}` }}</span>
        <span class="item__info">{{ `color: ${item.color}` }}</span>
        <span class="item__info">{{ `price: ${item.price}` }}</span>
        <span class="item__info">{{ `latitude: ${item.latitude}` }}</span>
        <span class="item__info">{{ `longitude: ${item.longitude}` }}</span>
      </li>
    </ul>
  </main>
  <div class="edit_container" v-if="flag">
    <div class="edit_main">
      <div class="item_icons">
        <span class="delete_icon" @click="open(-1)"></span>
      </div>
      <ul class="edit_list">
        <li class="edit_property">
          <label class="input">
            <span>Марка:</span>
            <input
              type="text"
              name="name"
              placeholder="Toyota"
              :value="carCurrent.name"
              @input="carCurrent.name = $event.target.value"
            />
          </label>
        </li>
        <li class="edit_property">
          <label class="input">
            <span>Модель:</span>
            <input
              type="text"
              name="model"
              placeholder="Camry"
              :value="carCurrent.model"
              @input="carCurrent.model = $event.target.value"
            />
          </label>
        </li>
        <li class="edit_property">
          <label class="input">
            <span>Стоимость:</span>
            <input
              type="number"
              name="price"
              placeholder="21000"
              :value="carCurrent.price"
              @input="carCurrent.price = $event.target.value"
            />
          </label>
        </li>
      </ul>
      <button class="edit_button" @click="save()">Сохранить</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { useCarsStore } from "./store/carsStore";

const carsStore = useCarsStore();

const flag = ref(false);
const sortedFlag = ref(0);
const carCurrent = reactive({
  id: 1,
  name: "Toyata",
  model: "Camry",
  price: 21000,
});
async function fetchInitial() {
  const Response = await axios.get("https://test.tspb.su/test-task/vehicles");
  //info = Response.data;
  carsStore.setCars(Response.data);
}
onMounted(async () => {
  await fetchInitial();
});

const open = (id) => {
  if (flag.value === true) {
    carCurrent.price = 0;
    carCurrent.name = "";
    carCurrent.model = "";
  } else {
    let car = carsStore.cars.find((carr) => carr.id === id);
    carCurrent.id = id;
    carCurrent.price = car.price;
    carCurrent.name = car.name;
    carCurrent.model = car.model;
  }
  flag.value = !flag.value;
};

const save = () => {
  let car = carsStore.cars.find((carr) => carr.id === carCurrent.id);
  car.price = carCurrent.price;
  car.name = carCurrent.name;
  car.model = carCurrent.model;
  open(1);
};
</script>

<style scoped>
.main {
  width: 100%;
  position: relative;
}

.list {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
  background-color: inherit;
  color: black;
  padding: 10px;
}

.item {
  position: relative;
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: white;
  color: black;
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  padding: 20px;
  text-align: left;
  border-radius: 10px;
  border: 1px solid black;
  box-shadow: 5px 5px 10px black;
  transition: 0.5s ease;
}
.item_icons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item:hover {
  transform: translateX(-15px);
  cursor: pointer;
  background-color: rgb(63, 46, 46);
  color: white;
}

.item:hover .delete_icon {
  background-color: white;
}

.item:hover .delete_icon::before {
  background-color: white;
}

.delete_icon {
  display: block;
  position: relative;
  width: 20px;
  height: 3px;
  background-color: black;
  transform: rotate(45deg);
  transition: 0.5s ease;
}

.delete_icon:hover {
  cursor: pointer;
}

.delete_icon::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 3px;
  background-color: black;
  transform: rotate(90deg);
  transition: 0.5s ease;
}

.edit_icon {
  width: 24px;
  height: 24px;
  background-image: url(/src/assets/edit.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 0.5s ease;
}

.item:hover .edit_icon {
  background-image: url(/src/assets/edit_white.svg);
}

.edit_container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.edit_main {
  position: absolute;
  top: 15%;
  left: 35%;
  width: 600px;
  height: 450px;
  background-color: white;
  color: black;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 50px;
}
.edit_list {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.edit_property {
  width: 100%;
  height: 30px;
}
.input {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  font-size: 26px;
  line-height: 30px;
  font-weight: 400;
}

.input input {
  font-size: 22px;
  line-height: 26px;
  font-weight: 300;
  border-radius: 5px;
}

.sort_button {
  background-color: white;
  color: black;
  margin: 10px;
  border: 1px solid black;
  transition: 0.5s ease;
}

.sort_button:hover {
  background-color: black;
  color: white;
}
</style>
