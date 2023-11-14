import {useEffect, useState} from "react";
import {getMetricsByYear, KilometerPerYear} from "../../services/MetricRetrievalService.tsx";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from 'react-chartjs-2';


const KilometerByYear = () => {
    const [kilometerByYear, setKilometerByYear] = useState(new Array<KilometerPerYear>());

    useEffect(() => {
        const metricsByYear: Promise<Array<KilometerPerYear>> = getMetricsByYear("Run");
        metricsByYear.then((result) => {
            setKilometerByYear(result);
        });
    }, []);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: 'Kilometer by year',
            },
            tooltip: {
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    label: (context): string => `${context.parsed.y} km`
                }
            },
        },
    };

    const data = {
        labels: kilometerByYear.map((kilometerPerYear) => kilometerPerYear.year),
        datasets: [{
            label: 'Kilometer',
            data: kilometerByYear.map((kilometerPerYear) => kilometerPerYear.totalAmount),
            backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        }]
    };

    return (
        <div>
            <Bar options={options} data={data}/>
        </div>
    );
}
export default KilometerByYear;