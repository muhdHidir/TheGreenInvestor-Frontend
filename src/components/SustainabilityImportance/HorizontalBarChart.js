import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  scales: {
    x: {
      grid: {
        display: false,
        color: "#FFFFFF",
      },
     
    },
    y: {
      grid: {
        display: false,
        color: "#FFFFFF",
      },
    },
  },
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Carbon Emission Caused by Different Fuel Types",
      color: "#FFFFFF",
    },
  },
};

const labels = ["BIT", "MSW", "LIG"];

export default function HorizontalBarChart({ data }) {
  return (
    <div className="h-full w-1/3">
      <Bar
        id="chart"
        options={options}
        data={{
          labels,

          datasets: [
            {
              data: data,
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, "#245A44");
                gradient.addColorStop(1, "#B497D6");
                return gradient;
              },
              barPercentage: 1,
            },
          ],
        }}
      />
    </div>
  );
}
