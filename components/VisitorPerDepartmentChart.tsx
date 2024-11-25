'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,  // Register PointElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components for the chart, including PointElement
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
  const data = {
    labels: ['Production', 'Management', 'HR', 'Account', 'Shiping'],
    datasets: [
      {
        label: 'Visitors',
        data: [30, 20, 30, 40, 30],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        fill: true, 
        tension: 0, // Smooths the line
        pointRadius: 5, // Set the radius of the points
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
        pointBorderColor: 'rgba(75, 192, 192, 1)', // Point border color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Visitors Per Department',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Departments',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Visitors',
        },
      },
    },
  };

  return (
    <div style={{ width: '1000px', height: '500px' }}> {/* Set width and height */}
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
