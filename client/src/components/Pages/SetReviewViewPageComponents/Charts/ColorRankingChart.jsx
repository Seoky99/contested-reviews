import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import sortingUtils from '../../../../utils/sortingUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TempColorRankingChart({ averages }) {

    const sortedEntries = Object.entries(averages)
        .filter(([key]) => !(key.includes(",") || key.includes("L")))
        .sort((a, b) => sortingUtils.tempSort(a, b));
 
    const colorToHex = {
        W: '#FFFFFF', 
        U: '#1E90FF', 
        B: '#000000', 
        R: '#FF4D4D', 
        G: '#228B22' 
    };

    const backgroundColors = sortedEntries.map(([key]) => {
    const colorCode = key.split(' - ')[0];
        return colorToHex[colorCode] || '#AAAAAA';
    });


    console.log(sortedEntries);


    const scoreToRank = [
        'F-', 'F', 'F+', 'D-', 'D', 'D+', 'C-', 'C', 'C+',
        'B-', 'B', 'B+', 'A-', 'A', 'A+'
    ];

    function getRankFromScore(score) {
        const index = Math.round((score / 10) * 15);
        return scoreToRank[Math.min(index, 15)];
    }


    const data = {
        labels: sortedEntries.map(([key]) => key),
        datasets: [
        {
            label: 'Average Rating',
            data: sortedEntries.map(([_, value]) => value),
            backgroundColor: backgroundColors,
            borderColor: 'black',
            borderWidth: 5
        }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Average Rating by Color' }
        },
        scales: {
        y: {
            min: 0,
            max: 10,
            ticks: {
            stepSize: 0.7143,
            callback: (value) => {
                const rank = getRankFromScore(value);
                return rank;
            }
            }
        }
        }
    };

  return <Bar data={data} options={options} />;
}

export default TempColorRankingChart;