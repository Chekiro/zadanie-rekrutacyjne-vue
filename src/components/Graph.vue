<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted, watchEffect } from "vue";
import { Chart } from "chart.js/auto";

const props = defineProps([
  "selectedGraph",
  "humidData",
  "tempData",
  "timeData",
]);
const chartInstance: Ref<Chart | null> = ref(null);

onMounted(() => {
  createChart();
});

watchEffect(() => {
  if (props.selectedGraph && document.getElementById("myChart")) {
    destroyChart();
    createChart();
  }
});

onUnmounted(() => {
  destroyChart();
});

function createChart() {
  const ctx = document.getElementById("myChart");

  if (ctx instanceof HTMLCanvasElement) {
    chartInstance.value = new Chart(ctx, {
      type: "bar",
      data: {
        labels: props.timeData,
        datasets: [
          {
            label: "Temperature",
            data: props.tempData,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Humidity",
            data: props.humidData,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

function destroyChart() {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
}
</script>

<template>
  <div class="graph">
    <div class="row">
      <h1>Weather Graph</h1>
      <h3>
        {{ props.selectedGraph.name }} ({{ props.selectedGraph.country }})
      </h3>
    </div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<style scoped>
.graph {
  background-color: antiquewhite;
}
</style>
