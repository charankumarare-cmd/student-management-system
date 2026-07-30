import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AttendanceChart = ({ data }) => {
  const chartData = {
    labels: data?.map(d => d.month) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance %',
        data: data?.map(d => d.percentage) || [92, 94, 91, 96, 95],
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { min: 60, max: 100, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  return <Line data={chartData} options={options} />;
};

export const DepartmentChart = ({ data }) => {
  const chartData = {
    labels: data?.map(d => d.name) || ['CS', 'EE', 'ME', 'Civil'],
    datasets: [
      {
        data: data?.map(d => d.count) || [45, 30, 20, 15],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export const FeeChart = ({ collected = 0, pending = 0 }) => {
  const chartData = {
    labels: ['Collected ($)', 'Pending ($)'],
    datasets: [
      {
        data: [collected, pending],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  return <Bar data={chartData} options={options} />;
};
