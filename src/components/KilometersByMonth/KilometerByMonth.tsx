import {useEffect, useState} from "react";
import {getMetricsByMonth, KilometerPerMonth,} from "../../services/MetricRetrievalService.tsx";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Bar} from "react-chartjs-2";

const KilometerByMonth = () => {
    const [kilometerByMonth, setKilometerByMonth] = useState(new Array<KilometerPerMonth>());

    useEffect(() => {
        const metricsByMonth: Promise<Array<KilometerPerMonth>> = getMetricsByMonth("Run");
        metricsByMonth.then((result) => {
            setKilometerByMonth(result);
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

    // map kilometerByMonth.month to month name
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const kilometerPerMonthForYear =
        kilometerByMonth.filter((kilometerByMonth) => kilometerByMonth.year === 2023);

    const data = {
        labels: kilometerPerMonthForYear.map((kilometerByMonth) => monthNames[kilometerByMonth.month - 1]),
        datasets: [{
            label: 'Kilometer',
            data: kilometerByMonth.map((kilometerByMonth) => kilometerByMonth.totalAmount),
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
export default KilometerByMonth;