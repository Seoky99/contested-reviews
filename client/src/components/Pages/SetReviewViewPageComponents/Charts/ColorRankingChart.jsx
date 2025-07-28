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

    //everything written here is a travesty. plz fix this ungodly code later 

    const sortedEntries = Object.entries(averages)
        .filter(([key]) => !(key.includes(",") || key.includes("L") || key.includes("C")))
        .sort((a, b) => sortingUtils.tempSort(a, b));
 
    const colorToHex = {
        W: '#FFFFFF', 
        U: '#1E90FF', 
        B: '#000000', 
        R: '#FF4D4D', 
        G: '#228B22' 
    };

    function backgroundColors(sortedEntries) { 
        const colors = sortedEntries.map(([key]) => {
            const colorCode = key.split(' - ')[0];
            return colorToHex[colorCode] || '#AAAAAA';
        });

        const values = [];

        for (let i = 0; i < colors.length; i++) {
            if (i !== 0 && i % 5 === 0) {
                values.push(null); 
            }
            values.push(colors[i]);
        }
        return values;
    }

    function introduceSpacing(data) {
        const values = [];

        for (let i = 0; i < data.length; i++) {
            if (i !== 0 && i % 5 === 0) {
                values.push(null); 
            }
            values.push(data[i][1]);
        }
        return values;
    }

    function spacedLabels(data) {
        const labels = [];

        for (let i = 0; i < data.length; i++) {
            if (i !== 0 && i % 5 === 0) {
                labels.push('');
            }
            labels.push(data[i][0]);
        }
        return labels;
    }

    const scoreToRank = [
        'F-', 'F', 'F+', 'D-', 'D', 'D+', 'C-', 'C', 'C+',
        'B-', 'B', 'B+', 'A-', 'A', 'A+'
    ];

    function getRankFromScore(score) {
        const index = Math.round((score / 10) * 14);
        return scoreToRank[Math.min(index, 14)];
    }

    const spacedData = introduceSpacing(sortedEntries);

    const data = {
        labels: spacedLabels(sortedEntries),
        datasets: [
        {
            label: 'Average Rating',
            data: spacedData,
            backgroundColor: backgroundColors(sortedEntries),
            borderColor: 'black',
            borderWidth: 2
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
                stepSize: 0.714,
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