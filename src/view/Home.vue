<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import City from "../types/City";
import cityList from "../data/CityList";
import { weatherApiInstance } from "../api";
import WeatherDataRes from "../types/WeatherDataRes";
import Graph from "../components/Graph.vue";
import WeatherCard from "../components/WeatherCard.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const loggedInUserId = localStorage.getItem("userId");
const searchQuery = ref("");
const selectResults: Ref<City[]> = ref([]);
const weatherData: Ref<WeatherDataRes[]> = ref([]);
const selectedGraph = ref([]);
const isShowGraph = ref(false);
const showResult = ref(false);
const listCities = ref(cityList);
const errorMessage = ref("");
const favoriteCity: Ref<WeatherDataRes[]> = ref([]);
const actualUser = ref(loggedInUserId);
const tempData = ref([]);
const humidData = ref([]);
const timeData = ref([]);

const handleInput = () => {
  if (searchQuery.value.length > 0) {
    showResult.value = true;
    selectResults.value = listCities.value.filter((item: City) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    showResult.value = false;
    selectResults.value = [];
  }
};

const selectResult = (result: City) => {
  searchQuery.value = result.name;
  showResult.value = false;
};

const createWeatherDataObject = (res: any): WeatherDataRes => {
  const { humidity, temp } = res.data.main;

  const timezoneOffset = res.data.timezone;
  const utcDate = new Date();
  const localTime =
    utcDate.getTime() +
    (timezoneOffset + utcDate.getTimezoneOffset() * 60) * 1000;
  const roundedTime = Math.floor(localTime / 600000) * 600000;
  const localDate = new Date(roundedTime);

  const timezoneFormatted = localDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const description = res.data.weather[0].description;
  const formattedDescription = description
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    id: res.data.id,
    name: res.data.name,
    humidity,
    temp,
    description: formattedDescription,
    icon: res.data.weather[0].icon,
    dt: res.data.dt,
    timezone: timezoneFormatted,
    country: res.data.sys.country,
    showGraph: false,
  };
};

const fetchWeather = () => {
  fetchData("/weather")
    .then((res: any) => {
      if (res.status === 404) {
        errorMessage.value = "City not found,try again";
      } else {
        errorMessage.value = "";
        const weatherObj = createWeatherDataObject(res);
        weatherData.value.push(weatherObj);
        searchQuery.value = " ";
      }
    })
    .catch((error: any) => {
      errorMessage.value = "City not found,try again";
      console.error(error);
    });
};

const addToFavorite = (city: WeatherDataRes) => {
  const isAlreadyFavorite = favoriteCity.value.some(
    (item) => item.id === city.id
  );

  if (!isAlreadyFavorite) {
    favoriteCity.value.push(city);
    city.showGraph = true;
    const loggedInUserId = localStorage.getItem("userId");
    let userCities = JSON.parse(
      localStorage.getItem(`userCities-${loggedInUserId}`) || "[]"
    );
    let cityTemp = city.temp;
    let cityTime = city.timezone;
    let cityHumidity = city.humidity;

    userCities.push(city.name);
    localStorage.setItem(
      `userCities-${loggedInUserId}`,
      JSON.stringify(userCities)
    );

    localStorage.setItem(
      `cityTemp-${loggedInUserId}-${city.name}`,
      JSON.stringify([cityTemp])
    );
    localStorage.setItem(
      `cityHumid-${loggedInUserId}-${city.name}`,
      JSON.stringify([cityHumidity])
    );
    localStorage.setItem(
      `cityTime-${loggedInUserId}-${city.name}`,
      JSON.stringify([cityTime])
    );
  }
};

const handleLogOut = () => {
  router.push("/");
};

const showGraph = (city: WeatherDataRes) => {
  selectedGraph.value = city;

  tempData.value = JSON.parse(
    localStorage.getItem(`cityTemp-${loggedInUserId}-${city.name}`) || ""
  );
  humidData.value = JSON.parse(
    localStorage.getItem(`cityHumid-${loggedInUserId}-${city.name}`) || ""
  );
  timeData.value = JSON.parse(
    localStorage.getItem(`cityTime-${loggedInUserId}-${city.name}`) || ""
  );
  isShowGraph.value = true;
};

const removeCard = (id: number) => {
  weatherData.value = weatherData.value.filter((item) => item.id !== id);
  favoriteCity.value = favoriteCity.value.filter((item) => item.id !== id);
  const userId = localStorage.getItem("userId");

  const userCitiesKey = `userCities-${userId}`;
  const userCities = JSON.parse(localStorage.getItem(userCitiesKey) || "[]");

  let updatedUserCities = userCities.filter((city) => {
    for (let i = 0; i < favoriteCity.value.length; i++) {
      if (favoriteCity.value[i].name === city) {
        return true;
      }
    }
    return false;
  });

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);

    if (
      key.startsWith(`cityTemp-${userId}`) ||
      key.startsWith(`cityHumid-${userId}`) ||
      key.startsWith(`cityTime-${userId}`)
    ) {
      const cityName = key.split("-").pop();

      if (!updatedUserCities.includes(cityName)) {
        localStorage.removeItem(key);
      }
    }
  }

  localStorage.setItem(userCitiesKey, JSON.stringify(updatedUserCities));
};

const fetchData = (url: string) => {
  let parameters;
  if (searchQuery.value !== "") {
    parameters = {
      params: {
        q: searchQuery.value,
        units: "metric",
        cnt: 10,
      },
    };
  }

  return weatherApiInstance.get(url, parameters);
};

const fetchDataByName = (url: string, name: string) => {
  let parameters = {
    params: {
      q: name,
      units: "metric",
      cnt: 10,
    },
  };
  return weatherApiInstance.get(url, parameters);
};

const saveAllParametersToLocalStorage = (
  city: string,
  newData: WeatherDataRes
) => {
  if (city) {
    const cityHumid = `cityHumid-${actualUser.value}-${city}`;
    const humidFromLocalStorage = localStorage.getItem(cityHumid);
    const cityTemp = `cityTemp-${actualUser.value}-${city}`;
    const tempFromLocalStorage = localStorage.getItem(cityTemp);
    const cityTime = `cityTime-${actualUser.value}-${city}`;
    const timeFromLocalStorage = localStorage.getItem(cityTime);
    let newArray = [];
    if (humidFromLocalStorage) {
      newArray = JSON.parse(humidFromLocalStorage);
      newArray.push(newData.humidity);
      localStorage.setItem(cityHumid, JSON.stringify(newArray));
    }
    if (tempFromLocalStorage) {
      newArray = JSON.parse(tempFromLocalStorage);
      newArray.push(newData.temp);
      localStorage.setItem(cityTemp, JSON.stringify(newArray));
    }
    if (timeFromLocalStorage) {
      newArray = JSON.parse(timeFromLocalStorage);
      newArray.push(newData.timezone);
      localStorage.setItem(cityTime, JSON.stringify(newArray));
    }
  }
};

const checkNewResData = (newData: WeatherDataRes) => {
  console.log(newData);
  const existingCityIndex = favoriteCity.value.findIndex(
    (city) => city.name === newData.name
  );
  if (existingCityIndex !== -1) {
    const existingCity = favoriteCity.value[existingCityIndex];
    if (existingCity.dt === newData.dt) {
      console.log("Obiekty są takie same");
    } else {
      console.log("Obiekty są różne");
      favoriteCity.value.splice(existingCityIndex, 1, newData);
      saveAllParametersToLocalStorage(newData.name, newData);
    }
  } else {
    console.log("Nie znaleziono obiektu");
  }
};

onMounted(() => {
  const userId = localStorage.getItem("userId");
  const userCitiesKey = `userCities-${userId}`;
  const userCities = JSON.parse(localStorage.getItem(userCitiesKey) || "[]");

  userCities.forEach((city) => {
    // setInterval(() => {
    fetchDataByName("/weather", city)
      .then((res: any) => {
        const weatherObj = createWeatherDataObject(res);
        const modifyObj = { ...weatherObj, showGraph: true };

        // weatherData.value.forEach((obj) => {
        //   if (obj.id === modifyObj.id) {
        //     return;
        //   }
        // });

        // favoriteCity.value.forEach((obj) => {
        //   if (obj.id === modifyObj.id) {
        //   } else {
        //     favoriteCity.value.push(modifyObj);
        //   }
        // });
        favoriteCity.value.push(modifyObj);
        weatherData.value.push(modifyObj);
        checkNewResData(modifyObj);
      })
      .catch((error: any) => {
        console.error(error);
      });
    // }, 60000);
  });
});
</script>
<template>
  <div class="container text-center">
    <div class="row">
      <h1 class="title">
        Weather App
        <span>
          <button @click="handleLogOut" class="btn btn-primary login-button">
            Log out
          </button></span
        >
      </h1>
    </div>

    <div class="row">
      <div class="col">
        <div class="input-box">
          <input
            class="form-control"
            type="text"
            v-model="searchQuery"
            @input="handleInput"
            @keyup.enter="fetchWeather"
            placeholder="Search city..."
          />
          <ul v-if="showResult" class="autocomplete-results">
            <li
              v-for="result in selectResults"
              :key="result.id"
              @click="selectResult(result)"
            >
              {{ result.name }}
            </li>
          </ul>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="row">
          <div class="d-flex flex-wrap justify-content-around">
            <WeatherCard
              v-for="city in weatherData"
              :key="city.id"
              :showGraph="showGraph"
              :addToFavorite="addToFavorite"
              :removeCard="removeCard"
              :city="city"
            />
          </div>
        </div>
      </div>
      <div class="col">
        <Graph
          v-if="isShowGraph && weatherData.length > 0"
          :selectedGraph="selectedGraph"
          :timeData="timeData"
          :humidData="humidData"
          :tempData="tempData"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding-right: auto;
  padding-left: auto;
}
.error-message {
  color: red;
  font-weight: bold;
}

.title {
  margin-bottom: 30px;
}
.input-group-text {
  background-color: #6cb6cf;
  color: white;
  border-color: #631919;
}

.input-box {
  margin-bottom: 50px;
}

.login-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}

.form-control {
  border-color: #631919;
}

h1 {
  padding-top: 10px;
  padding-bottom: 10px;
}

.autocomplete-results {
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: #6cb6cf;
  border: 1px solid #631919;
  max-height: 100px;
  overflow-y: auto;
}

.autocomplete-results li {
  padding: 10px;
  cursor: pointer;
  z-index: 100000;
}

.autocomplete-results li:hover {
  background-color: #50a2c8;
}
</style>
