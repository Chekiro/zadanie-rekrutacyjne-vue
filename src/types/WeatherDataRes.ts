interface WeatherDataRes {
  id: number;
  name: string;
  humidity: number;
  temp: number;
  description: string;
  icon: string;
  dt: number | string;
  timezone: number | string;
  country: string;
  showGraph: boolean;
}

export default WeatherDataRes;
