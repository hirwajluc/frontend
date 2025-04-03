<template>
  <div>
    <div>chart</div>
     
  </div>
</template>

<script setup>
 
const select = ref("March 2023");
const items = ref(["March 2023", "April 2023", "May 2023"]);
const chartOptions = computed(() => {
  return {
    labels: ["Completed", "In progress", "Pending"],
    chart: {
      type: "donut",
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
    },
    colors: ["#0e9f6e", "#2d6a4f", "#054a29"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        borderRadius: 10,
        donut: {
          size: "60%%",
          labels: {
            show: true,
            total: {
              show: true,
              name: "Totat",
              showAlways: true,
            },
          },
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: { theme: "light", fillSeriesColor: false },
  };
});
const Chart = [38, 40, 25];
</script>
