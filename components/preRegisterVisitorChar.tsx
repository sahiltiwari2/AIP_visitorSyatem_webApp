"use client";

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ref, get, query, orderByKey, startAt, endAt } from 'firebase/database';
import { database } from '@/firebase'; // Replace with your Firebase setup
import { format, addDays } from 'date-fns';

// Register necessary components for ChartJS
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Helper function to fetch data for the next 7 days
const getNext7DaysData = async () => {
  const dbRef = ref(database, 'upComingVisitors');
  const today = new Date();
  const sevenDaysLater = addDays(today, 6);

  try {
    const snapshot = await get(
      query(dbRef, orderByKey(), startAt(format(today, 'yyyy-MM-dd')), endAt(format(sevenDaysLater, 'yyyy-MM-dd')))
    );

    const data = snapshot.val();
    const labels = [];
    const counts = [];

    for (let i = 0; i <= 6; i++) {
      const date = addDays(today, i);
      labels.push(format(date, 'dd/MM'));
      counts.push(data?.[format(date, 'yyyy-MM-dd')] || 0);
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching next 7 days data:', error);
    return { labels: [], data: [] };
  }
};

// Helper function to fetch data for the next 30 days
const getNext30DaysData = async () => {
  const dbRef = ref(database, 'upComingVisitors');
  const today = new Date();
  const thirtyDaysLater = addDays(today, 29);

  try {
    const snapshot = await get(
      query(dbRef, orderByKey(), startAt(format(today, 'yyyy-MM-dd')), endAt(format(thirtyDaysLater, 'yyyy-MM-dd')))
    );

    const data = snapshot.val();
    const labels = [];
    const counts = [];

    for (let i = 0; i <= 29; i++) {
      const date = addDays(today, i);
      labels.push(format(date, 'dd/MM'));
      counts.push(data?.[format(date, 'yyyy-MM-dd')] || 0);
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching next 30 days data:', error);
    return { labels: [], data: [] };
  }
};
const getNext15DaysData = async () => {
  const dbRef = ref(database, 'upComingVisitors');
  const today = new Date();
  const thirtyDaysLater = addDays(today, 29);

  try {
    const snapshot = await get(
      query(dbRef, orderByKey(), startAt(format(today, 'yyyy-MM-dd')), endAt(format(thirtyDaysLater, 'yyyy-MM-dd')))
    );

    const data = snapshot.val();
    const labels = [];
    const counts = [];

    for (let i = 0; i <= 14; i++) {
      const date = addDays(today, i);
      labels.push(format(date, 'dd/MM'));
      counts.push(data?.[format(date, 'yyyy-MM-dd')] || 0);
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching next 30 days data:', error);
    return { labels: [], data: [] };
  }
};

// Helper function to fetch monthly data
const getMonthlyData = async () => {
  const today = new Date();
  const currentYear = format(today, 'yyyy');
  const currentMonth = format(today, 'MM');
  const monthPath = `dailyVisitors/${currentYear}-${currentMonth}`;

  try {
    const snapshot = await get(ref(database, monthPath));
    const data = snapshot.val();

    const labels = [];
    const counts = [];

    for (let i = 1; i <= 30; i++) {
      const day = i.toString().padStart(2, '0');
      labels.push(`${day}/${currentMonth}`);
      counts.push(data?.[`day${i}`] || 0);
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    return { labels: [], data: [] };
  }
};

type TimeFrame = 'Week' | 'Month' | 'Year';

interface LineChartProps {
  timeFrame: TimeFrame;
}

const LineChart: React.FC<LineChartProps> = ({ timeFrame }) => {
  interface ChartData {
    labels: string[];
    data: number[];
  }

  const [chartData, setChartData] = useState<ChartData>({ labels: [], data: [] });

  useEffect(() => {
    const fetchData = async () => {
      let result;
      switch (timeFrame) {
        case 'Week':
          result = await getNext7DaysData();
          break;
        case 'Month':
          result = await getNext30DaysData();
          break;
        case 'Year':
          result = await getNext15DaysData(); // Assuming Year uses 30 days for demo purposes
          break;
        default:
          result = { labels: [], data: [] };
      }
      setChartData(result);
    };

    fetchData();
  }, [timeFrame]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Visitors',
        data: chartData.data,
        borderColor: timeFrame === 'Week' ? 'rgba(75, 192, 192, 1)' :
                     timeFrame === 'Month' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: timeFrame === 'Week' ? 'rgba(75, 192, 192, 0.2)' :
                         timeFrame === 'Month' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: timeFrame === 'Week' ? 'rgba(75, 192, 192, 1)' :
                              timeFrame === 'Month' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        pointBorderColor: timeFrame === 'Week' ? 'rgba(75, 192, 192, 1)' :
                             timeFrame === 'Month' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
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
        text: `Visitor Trends - ${timeFrame}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeFrame === 'Week' ? 'Days' : timeFrame === 'Month' ? 'Days of the Month' : 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Visitors',
        },
      },
    },
  };

  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
