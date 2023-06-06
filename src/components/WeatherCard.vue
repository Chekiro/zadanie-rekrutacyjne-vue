<script setup lang="ts">
const { city, removeCard, showGraph, addToFavorite } = defineProps([
  "city",
  "removeCard",
  "showGraph",
  "addToFavorite",
]);
</script>
<template>
  <div class="card" style="width: 18rem">
    <div class="card-body">
      <img
        :src="`http://openweathermap.org/img/wn/${city.icon}@2x.png`"
        class="card-img-top"
      />
      <h5 class="card-title">
        {{ city.name }}
        <span class="remove">
          <svg
            @click="removeCard(city.id)"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="red"
            class="bi bi-x-circle-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
            />
          </svg>
        </span>
      </h5>

      <p class="card-text"><b>Country:</b> {{ city.country }}</p>
      <p class="card-text"><b>Description:</b> {{ city.description }}</p>
      <div class="d-flex justify-content-around">
        <button
          @click="showGraph(city)"
          v-if="city.showGraph"
          class="btn btn-primary"
        >
          Show graph
        </button>

        <svg
          @click="addToFavorite(city)"
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          fill="green"
          class="bi bi-bookmark-heart-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.5zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  margin: 10px;
  -webkit-box-shadow: -8px 7px 13px -8px rgba(66, 68, 90, 1);
  -moz-box-shadow: -8px 7px 13px -8px rgba(66, 68, 90, 1);
  box-shadow: -8px 7px 13px -8px rgba(66, 68, 90, 1);
  background-color: #62bce3;
}
img {
  width: 150px;
  height: 150px;
}
svg {
  cursor: pointer;
}
.remove {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  color: red;
  cursor: pointer;
}
</style>
