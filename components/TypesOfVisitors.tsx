'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register the required components for the doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = () => {
  const data = {
    labels: ['Others', 'Interview', 'Enquiry', 'Meetings'],
    datasets: [
      {
        label: 'Types of Visitors',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(54, 162, 235, 0.6)', // Blue
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(75, 192, 192, 0.6)', // Green
          // 'rgba(153, 102, 255, 0.6)', // Purple
          // 'rgba(255, 159, 64, 0.6)', // Orange
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          // 'rgba(153, 102, 255, 1)',
          // 'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
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
        text: 'Types of Visitors',
      },
    },
    cutout: '50%', // Makes the chart hollow by setting the percentage of the center cut out
  };

  return (
    <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
