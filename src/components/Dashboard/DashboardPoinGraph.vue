<script setup lang="ts">
import { computed } from "vue";
import { ChartData, ChartOptions } from "chart.js/auto";
import { useColorSchemeStore } from "../../stores/color-scheme";
import { useDarkModeStore } from "../../stores/dark-mode";
import Chart from "../../base-components/Chart";
import { getColor } from "../../utils/colors";
import {useInfoStore} from "../../stores/modules/info";

const props = defineProps<{
  width?: number;
  height?: number;
  lineColor?: string;
}>();

const colorScheme = computed(() => useColorSchemeStore().colorScheme);
const darkMode = computed(() => useDarkModeStore().darkMode);

const info = useInfoStore()

const month = [7,8,9,10,11,12,1,2,3,4,5,6]

const chartData = computed(() => {
  const infoGraphData = info.graphCountPenghargaan

  return month.map(e => {
    let selectedMonth = infoGraphData.find(f => f.month === e)
    return selectedMonth ? selectedMonth.total : NaN
  })
})

const data = computed<ChartData>(() => {
  return {
    labels: [
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Jumlah Penghargaan",
        data: chartData.value,
        borderWidth: 1,
        backgroundColor: colorScheme.value ? getColor("success") : "",
        pointBorderColor: "transparent",
        tension: 0.4,
        spanGaps: true,
      },
    ],
  };
});

const options = computed<ChartOptions>(() => {
  return {
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: getColor("slate.500", 0.8),
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
          color: getColor("slate.500", 0.8),
        },
        grid: {
          color: darkMode.value
              ? getColor("slate.500", 0.3)
              : getColor("slate.300"),
          borderDash: [2, 2],
          drawBorder: false,
        },
        min: 0,
        suggestedMax: 5,
      },
    },
  };
});
</script>

<template>
  <Chart
    type="line"
    :width="props.width"
    :height="props.height"
    :data="data"
    :options="options"
  />
</template>
