// 'use client';

// import { Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   Title,
// } from 'chart.js';


// // Register the required components for the doughnut chart
// type TimeFrame = 'Week' | 'Month' | 'Year';
// ChartJS.register(ArcElement, Tooltip, Legend, Title);

// interface DoughnutChartProps {
//   timeFrame: TimeFrame;
// }

// const DoughnutChart = ({ timeFrame }: DoughnutChartProps) => {
//   const data = {
//     labels: ['Order', 'Interview', 'Enquiry', 'Meeting'],
//     datasets: [
//       {
//         label: 'Types of Visitors',
//         data: [12, 19, 3, 5], // Default data

//         backgroundColor: [
//           'rgba(255, 99, 132, 0.6)', // Red
//           'rgba(54, 162, 235, 0.6)', // Blue
//           'rgba(255, 206, 86, 0.6)', // Yellow
//           'rgba(75, 192, 192, 0.6)', // Green
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Adjust chart options dynamically based on timeFrame
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       title: {
//         display: true,
//         text: `Types of Visitors - ${timeFrame}`,
//       },
//     },
//     cutout: '50%',
//   };

//   // Render the chart dynamically based on the timeFrame
//   switch (timeFrame) {
//     case 'Week':
//       return (
//         <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
//           <Doughnut data={data} options={options} />
//         </div>
//       );
//     case 'Month':
//       return (
//         <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
//           <Doughnut data={data} options={options} />
//         </div>
//       );
//     case 'Year':
//       return (
//         <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
//           {/* <Doughnut data={data} options={options} /> */}
//         </div>
//       );
//     default:
//       return <p>Invalid timeframe selected.</p>;
//   }
// };

// export default DoughnutChart;


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

  const fetchData = async (timeFrame: TimeFrame): Promise<number[]> => {
    const today = new Date();
    const dates: string[] = [];
  
    // Generate date range based on timeframe
    const days = timeFrame === 'Week' ? 6 : timeFrame === 'Month' ? 29 : 14; // Month = 30 days, Year = 15 days
  
    for (let i = 0; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format: yyyy-mm-dd
    }
  
    console.log('Generated Dates:', dates); // Log the generated dates to ensure correctness
  
    // Fetch data from Firebase
    const snapshot = await get(ref(database, 'totalTypeOfVisit'));
    if (!snapshot.exists()) return [0, 0, 0, 0]; // Return default values if no data
  
    const data = snapshot.val();
    const totals = { Order: 0, Interview: 0, Enquiry: 0, Meeting: 0 };
  
    // Sum data for each type across the selected dates
    dates.forEach((date) => {
      if (data[date]) {
        totals.Order += data[date].Order || 0;
        totals.Interview += data[date].Interview || 0;
        totals.Enquiry += data[date].Enquiry || 0;
        totals.Meeting += data[date].Meeting || 0;
      }
    });
  
    return [totals.Order, totals.Interview, totals.Enquiry, totals.Meeting];
  };
  

  const DoughnutChart = ({ timeFrame }: DoughnutChartProps) => {
    const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const loadChartData = async () => {
        setLoading(true);
        const data = await fetchData(timeFrame);
        setChartData(data);
        setLoading(false);
      };

      loadChartData();
    }, [timeFrame]);

    const data = {
      labels: ['Order', 'Interview', 'Enquiry', 'Meeting'],
      datasets: [
        {
          label: 'Types of Visitors',
          data: chartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)', // Red
            'rgba(54, 162, 235, 0.6)', // Blue
            'rgba(255, 206, 86, 0.6)', // Yellow
            'rgba(75, 192, 192, 0.6)', // Green
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
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



  