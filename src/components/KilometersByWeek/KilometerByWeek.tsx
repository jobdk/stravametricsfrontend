import {useEffect, useState} from "react";
import {getGoalMetricsByWeek, getMetricsByWeek, KilometerPerWeek} from "../../services/MetricRetrievalService.tsx";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title} from "chart.js";
import {Bar} from "react-chartjs-2";

const KilometerByWeek = () => {
    const [kilometerByWeek, setKilometerByWeek]: [KilometerPerWeek[], ((value: (((prevState: KilometerPerWeek[]) => KilometerPerWeek[]) | KilometerPerWeek[])) => void)] = useState(new Array<KilometerPerWeek>());
    const [goalKilometerByWeek, setGoalKilometerByWeek]: [KilometerPerWeek[], ((value: (((prevState: KilometerPerWeek[]) => KilometerPerWeek[]) | KilometerPerWeek[])) => void)] = useState(new Array<KilometerPerWeek>());

    useEffect(() => {
        getMetricsByWeek("Run").then((result: Array<KilometerPerWeek>) =>
            setKilometerByWeek(result));

        getGoalMetricsByWeek("Run").then((result: Array<KilometerPerWeek>) =>
            setGoalKilometerByWeek(result));
    }, []);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        // Tooltip,
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
                text: 'Kilometer by week',
            },
            tooltip: {
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    label: (context): string => `${context.parsed.y} km + ${context.label} km`,
                }
            },
        },
    };


    const goal = goalKilometerByWeek.filter((kilometerByWeek) => kilometerByWeek.year === 2023);

    const currentYear = kilometerByWeek.filter((kilometerByWeek) => kilometerByWeek.year === 2023)
    // const calenderWeek = currentYear[currentYear.length - 1].week - 6 * 4;
    // const actual = currentYear.filter((kilometerByWeek) => kilometerByWeek.week >= calenderWeek);

    console.log(currentYear)

    const data = {
        labels: currentYear.map((kilometerByWeek) => kilometerByWeek.week),
        datasets: [{
            label: 'Kilometer',
            data: currentYear.map((kilometerByWeek) => kilometerByWeek.totalAmount),
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        },
            {
                label: 'Goal Kilometer',
                data: goal.map((kilometerByWeek) => kilometerByWeek.totalAmount),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderWidth: 1
            }]
    };


    // function setYear(number: number) {
    // actual = kilometerByWeek.filter((kilometerByWeek) => kilometerByWeek.year === number.toString());
    // }

    return (
        <div>
            <button className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full">
                2021
            </button>

            <div>
                <Bar options={options} data={data}/>
            </div>

        </div>
    );
}
export default KilometerByWeek;