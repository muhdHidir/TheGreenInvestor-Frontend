import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function LineChart({ data, year }) {
  const didMount = useRef(false);

  
  const [labels, setLabels] = useState([]);
  const [state, setState] = useState({
    labels: labels,
    data: data,
  });

  // labels render when the user returns to the game after leaving the site
  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      setLabels((prevState) => [...prevState, "Year " + i]);
    }
  }, []);

  //update chart upon submission of answer
  useEffect(() => {
    if (didMount.current) {
      
      setLabels((prevState) => [...prevState, `Year ${year + 1}`]);

      setState({
        labels: labels,
        data: data,
      });
    } else {
      didMount.current = true;
    }
  }, [year]);

  if (labels.length === 0) {
    return <div> still loading </div>;
  }

  return (
    <div className="h-full">
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
              text: "Cash Line Chart",
            },
          },
          legend: {
            display: false,
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
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              fill: true,
              fillColor: "gradient",
              label: "Cash",
              lineTension: 0.5,
              data: state.data,
              borderColor: "#245A44",
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
    </div>
  );
}
