<template>
    <div class="relative lg:col-span-6 border border-border rounded-lg py-3 px-1">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-lg">
            <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span class="text-white mt-2">Loading winners data...</span>
            </div>
        </div>

        <div ref="productPrize" style="width: 100%; height: 570px"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
const { $echarts } = useNuxtApp();
const chart = ref(null);
const productPrize = ref(null);
const isLoading = ref(true);

const chartStore = useChartStore();

// Watch for changes in winners data
watch(() => chartStore.seriesWinnerData, (newData) => {
    if (newData) {
        isLoading.value = true;
        setChartData();
    }
}, { deep: true });

// Formatter function for currency
const formatNumber = (value) => {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    } else {
        return value.toString();
    }
};

// Initialize chart data
const option = ref({
    title: {
        text: 'WINNERS METRICS',
        subtext: 'Airtel vs MTN',
        left: 'center',
        textStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            color: '#054a29'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
    },
    legend: {
        data: ['Airtel', 'MTN'],
        type: 'scroll',
        orient: 'horizontal',
        bottom: '0%',
        textStyle: {
            fontWeight: 'bold',
            fontSize: 14
        },
        itemWidth: 30,
        itemHeight: 15,
        formatter: (name) => {
            const totalAirtel = calculateTotal(option.value.series[0]?.data || []);
            const totalMtn = calculateTotal(option.value.series[1]?.data || []);

            if (name === 'Airtel') {
                return `Airtel: ${formatNumber(totalAirtel)} `;
            } else if (name === 'MTN') {
                return `MTN: ${formatNumber(totalMtn)} `;
            }
            return name;
        }
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
            fontSize: 13,
            fontWeight: 'bold',
            formatter: (value) => formatNumber(value),
        }
    },
    yAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            fontWeight: 'bold',
            fontSize: 13
        }
    },
    series: []
});

// Calculate total value of an array
const calculateTotal = (data) => {
    return data.reduce((sum, value) => sum + value, 0);
};

// Handle window resize
const handleResize = () => {
    chart.value?.resize();
};

// Initialize chart when component mounts
onMounted(async () => {
    isLoading.value = true;
    chart.value = $echarts.init(productPrize.value);

    // Add resize listener
    window.addEventListener('resize', handleResize);

    try {
        await chartStore.fetchSeriesWinnerData();
        setChartData();
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
});

// Cleanup on unmount
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    chart.value?.dispose();
});

// Set series data for the chart
const setChartData = () => {
    if (!productPrize.value) return;

    try {
        const myPrizeChart = chart.value || $echarts.init(productPrize.value);
        const seriesWinnerData = chartStore.seriesWinnerData;

        if (!seriesWinnerData) {
            isLoading.value = false;
            return;
        }

        const regions = Object.keys(seriesWinnerData);
        const airtelData = [];
        const mtnData = [];

        regions.forEach(region => {
            airtelData.push(seriesWinnerData[region].airtel);
            mtnData.push(seriesWinnerData[region].mtn);
        });

        option.value.yAxis.data = regions.map(region =>
            region.charAt(0).toUpperCase() + region.slice(1)
        );

        option.value.series = [
            {
                name: 'Airtel',
                type: 'bar',
                data: airtelData,
                itemStyle: {
                    color: '#FF6347',
                },
                barWidth: '33%',
                label: {
                    show: true,
                    position: 'insideRight',
                    fontSize: 12,
                    color: '#ffffff',
                    fontWeight: 'bold',
                    formatter: (params) => formatNumber(params.value),
                }
            },
            {
                name: 'MTN',
                type: 'bar',
                data: mtnData,
                itemStyle: {
                    color: '#FFD700',
                },
                barWidth: '33%',
                label: {
                    show: true,
                    position: 'insideRight',
                    fontSize: 14,
                    fontWeight: 'bold',
                    formatter: (params) => formatNumber(params.value),
                }
            }
        ];

        myPrizeChart.setOption(option.value);
        chart.value = myPrizeChart;
    } catch (error) {
        console.error('Error setting chart data:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
#chart-container {
    width: 100%;
    height: 400px;
}
</style>