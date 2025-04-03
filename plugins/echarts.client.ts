import { defineNuxtPlugin } from "#app";
import * as echarts from "echarts";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("echarts", echarts);
});
