'use client';

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
import { format, subDays } from 'date-fns';

// Register the necessary components for ChartJS
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Fetch data for the last 7 days (for "Week" graph)
export const getLast7DaysData = async () => {
  const dbRef = ref(database, 'todayVisitors'); // Replace 'todayVisitors' with your actual database path
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);

  const formattedToday = format(today, 'yyyy-MM-dd');
  const formattedSevenDaysAgo = format(sevenDaysAgo, 'yyyy-MM-dd');

  try {
    const snapshot = await get(
      query(dbRef, orderByKey(), startAt(formattedSevenDaysAgo), endAt(formattedToday))
    );

    const data = snapshot.val();
    const labels: string[] = [];
    const counts: number[] = [];

    // Loop through the last 7 days (from today to 7 days ago)
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      labels.push(format(subDays(today, i), 'dd/MM')); // Formatted as dd/MM for chart labels
      counts.push(data?.[date] || 0); // Use 0 if no data is found for the date
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching last 7 days data:', error);
    throw error;
  }
};

// Fetch data for the last 15 days (for "Year" graph)
export const getLast15DaysData = async () => {
  const dbRef = ref(database, 'todayVisitors'); // Same reference as for the "Week" graph
  const today = new Date();
  const fifteenDaysAgo = subDays(today, 14); // Get data for the last 15 days

  const formattedToday = format(today, 'yyyy-MM-dd');
  const formattedFifteenDaysAgo = format(fifteenDaysAgo, 'yyyy-MM-dd');

  try {
    const snapshot = await get(
      query(dbRef, orderByKey(), startAt(formattedFifteenDaysAgo), endAt(formattedToday))
    );

    const data = snapshot.val();
    const labels: string[] = [];
    const counts: number[] = [];

    // Loop through the last 15 days
    for (let i = 14; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      labels.push(format(subDays(today, i), 'dd/MM')); // Formatted as dd/MM for chart labels
      counts.push(data?.[date] || 0); // Use 0 if no data is found for the date
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching last 15 days data:', error);
    throw error;
  }
};

// Fetch data for the current month (for "Month" graph)
export const getMonthlyData = async () => {
  const dbRef = ref(database, 'weeklyVisitors'); // Change to 'weeklyVisitors' for monthly data
  const today = new Date();
  const currentYear = format(today, 'yyyy');
  const currentMonth = format(today, 'MM');
  
  // Construct the path to the current month's data
  const monthPath = `weeklyVisitors/${currentYear}-${currentMonth}`;

  try {
    const snapshot = await get(ref(database, monthPath)); // Corrected the way to access the path

    const data = snapshot.val();
    const labels: string[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
    const counts: number[] = [];

    // Loop through the weeks and extract counts
    for (let week = 1; week <= 5; week++) {
      const weekKey = `week${week}`;
      counts.push(data?.[weekKey] || 0); // Use 0 if no data is found for the week
    }

    return { labels, data: counts };
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw error;
  }
};

// Define the TimeFrame type (you can customize these values based on your needs)
type TimeFrame = 'Week' | 'Month' | 'Year';

interface LineChartProps {
  timeFrame: TimeFrame;
}

const LineChart: React.FC<LineChartProps> = ({ timeFrame }) => {
  const [weekData, setWeekData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  const [monthData, setMonthData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  const [yearData, setYearData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  // Fetch last 7 days data for the "Week" graph
  useEffect(() => {
    if (timeFrame === 'Week') {
      const fetchData = async () => {
        try {
          const { labels, data } = await getLast7DaysData();
          setWeekData({ labels, data });
        } catch (error) {
          console.error('Error fetching last 7 days data:', error);
        }
      };
      fetchData();
    } else if (timeFrame === 'Month') {
      // Fetch monthly data for the "Month" graph
      const fetchData = async () => {
        try {
          const { labels, data } = await getMonthlyData();
          setMonthData({ labels, data });
        } catch (error) {
          console.error('Error fetching monthly data:', error);
        }
      };
      fetchData();
    } else if (timeFrame === 'Year') {
      // Fetch last 15 days data for the "Year" graph
      const fetchData = async () => {
        try {
          const { labels, data } = await getLast15DaysData();
          setYearData({ labels, data });
        } catch (error) {
          console.error('Error fetching last 15 days data:', error);
        }
      };
      fetchData();
    }
  }, [timeFrame]);

  // Function to generate chart data based on the timeFrame
  const generateChartData = (timeFrame: TimeFrame) => {
    switch (timeFrame) {
      case 'Week':
        return {
          labels: weekData.labels,
          datasets: [
            {
              label: 'Visitors',
              data: weekData.data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        };
      case 'Month':
        return {
          labels: monthData.labels,
          datasets: [
            {
              label: 'Visitors',
              data: monthData.data,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: 'rgba(54, 162, 235, 1)',
            },
          ],
        };
      case 'Year':
        return {
          labels: yearData.labels,
          datasets: [
            {
              label: 'Visitors',
              data: yearData.data,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: 'rgba(255, 99, 132, 1)',
            },
          ],
        };
      default:
        return {
          labels: [],
          datasets: [],
        };
    }
  };

  // Function to generate chart options
  const generateChartOptions = () => ({
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
          text: timeFrame === 'Week' ? 'Days' : timeFrame === 'Month' ? 'Weeks' : 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Visitors',
        },
      },
    },
  });

  const data = generateChartData(timeFrame);
  const options = generateChartOptions();

  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;