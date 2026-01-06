import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SkillChart = ({ skillScoreHistory }) => {
  if (!skillScoreHistory || skillScoreHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No skill score history yet. Start analyzing errors to see your progress!
      </div>
    );
  }

  const data = {
    labels: skillScoreHistory.map((entry) =>
      new Date(entry.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Skill Score',
        data: skillScoreHistory.map((entry) => entry.score),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Your Debugging Skill Progress',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="glass rounded-2xl shadow-2xl p-8 hover-lift border border-cyber-red/40 animate-fadeIn">
      <Line data={data} options={options} />
    </div>
  );
};

export default SkillChart;

