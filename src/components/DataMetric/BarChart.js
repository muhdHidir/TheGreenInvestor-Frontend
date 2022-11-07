import React, { useEffect, useRef, useState } from "react";
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

export default function BarChart({ data, morale, year }) {
  const didMount = useRef(false);

  const [state, setState] = useState({
    labels: ["Year " + (year + 1)],
    data: data,
  });

  //function for the updating of charts when there is a submission of a response
  useEffect(() => {
    if (didMount.current) {
      setState({
        labels: [`Year ${year + 1}`],
        data: data,
      });
    } else {
      didMount.current = true;
    }
  }, [data, year]);

  return (
    <Bar
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
            min: 0,
            max: morale ? 100 : 500,
          },
        },
      }}
      data={{
        labels: state.labels,
        datasets: [
          {
            data: state.data,
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, "#245A44");
              gradient.addColorStop(1, "#75c8a6");
              return gradient;
            },
          },
        ],
      }}
    />
  );
}
