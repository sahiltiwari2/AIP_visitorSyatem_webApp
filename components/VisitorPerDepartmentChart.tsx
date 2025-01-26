'use client';

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { database } from '@/firebase'; // Import your Firebase configuration
import { ref, get } from 'firebase/database';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type TimeFrame = 'Week' | 'Month' | 'Year';

interface DoughnutChartProps {
  timeFrame: TimeFrame;
}

// Predefined vibrant colors
const vibrantColors = [
  'rgba(255, 99, 132, 0.6)', // Red
  'rgba(54, 162, 235, 0.6)', // Blue
  'rgba(255, 206, 86, 0.6)', // Yellow
  'rgba(75, 192, 192, 0.6)', // Green
  'rgba(153, 102, 255, 0.6)', // Purple
  'rgba(255, 159, 64, 0.6)', // Orange
  'rgba(255, 94, 0, 0.6)',   // Vibrant Orange
  'rgba(50, 205, 50, 0.6)',  // Lime Green
  'rgba(75, 0, 130, 0.6)',   // Indigo
  'rgba(244, 66, 66, 0.6)',  // Bright Red
  'rgba(0, 128, 255, 0.6)',  // Bright Sky Blue
  'rgba(255, 69, 0, 0.6)',   // Bright Red-Orange
  'rgba(0, 255, 128, 0.6)',  // Mint Green
  'rgba(255, 20, 147, 0.6)', // Deep Pink
  'rgba(255, 140, 0, 0.6)',  // Dark Orange
  'rgba(46, 139, 87, 0.6)',  // Sea Green
  'rgba(138, 43, 226, 0.6)', // Blue Violet
  'rgba(0, 206, 209, 0.6)',  // Turquoise
  'rgba(218, 112, 214, 0.6)', // Orchid
  'rgba(64, 224, 208, 0.6)',  // Turquoise Green
  'rgba(240, 128, 128, 0.6)', // Light Coral
  'rgba(255, 215, 0, 0.6)',   // Gold
  'rgba(72, 61, 139, 0.6)',   // Dark Slate Blue
  'rgba(0, 250, 154, 0.6)',   // Medium Spring Green
  'rgba(186, 85, 211, 0.6)',  // Medium Orchid
  'rgba(173, 255, 47, 0.6)',  // Green Yellow
  'rgba(250, 128, 114, 0.6)', // Salmon
  'rgba(147, 112, 219, 0.6)', // Medium Purple
  'rgba(255, 0, 255, 0.6)',   // Magenta
  'rgba(0, 191, 255, 0.6)',   // Deep Sky Blue
];

// Generate colors dynamically based on the number of departments
const generateColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(vibrantColors[i % vibrantColors.length]); // Cycle through vibrant colors
  }
  return colors;
};

const fetchData = async (timeFrame: TimeFrame, departments: string[]): Promise<number[]> => {
  const today = new Date();
  const dates: string[] = [];

  // Generate date range based on timeframe
  const days = timeFrame === 'Week' ? 6 : timeFrame === 'Month' ? 29 : 14; // Month = 30 days, Year = 15 days

  for (let i = 0; i <= days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format: yyyy-mm-dd
  }

  // Fetch data from Firebase
  const snapshot = await get(ref(database, 'totalDepartmentOfVisit'));
  if (!snapshot.exists()) return new Array(departments.length).fill(0);

  const data = snapshot.val();
  const totals: { [key: string]: number } = {};

  // Initialize totals for each department dynamically
  departments.forEach((department) => {
    totals[department] = 0;
  });

  // Sum data for each type across the selected dates
  dates.forEach((date) => {
    if (data[date]) {
      departments.forEach((department) => {
        totals[department] += data[date][department] || 0;
      });
    }
  });

  // Return totals as an array in the order of the departments
  return departments.map((department) => totals[department]);
};

const DoughnutChart = ({ timeFrame }: DoughnutChartProps) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<string[]>([]); // State to store department names
  const [colors, setColors] = useState<string[]>([]); // State to store vibrant colors

  useEffect(() => {
    // Fetch the departments from the JSON file
    fetch('/department.json')
      .then((response) => response.json())
      .then((data) => {
        const departmentNames = data.departments || [];
        setDepartments(departmentNames);
        setColors(generateColors(departmentNames.length)); // Generate vibrant colors dynamically
      })
      .catch((error) => console.error('Error fetching departments:', error));
  }, []);

  useEffect(() => {
    const loadChartData = async () => {
      if (departments.length === 0) return; // Wait until departments are loaded
      setLoading(true);
      const data = await fetchData(timeFrame, departments);
      setChartData(data);
      setLoading(false);
    };

    loadChartData();
  }, [timeFrame, departments]);

  const data = {
    labels: departments,
    datasets: [
      {
        label: 'Types of Visitors',
        data: chartData,
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace('0.6', '1')), // Replace opacity with full color for borders
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
        text: `Types of Visitors - ${timeFrame}`,
      },
    },
    cutout: '50%',
  };

  return (
    <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
};

export default DoughnutChart;
