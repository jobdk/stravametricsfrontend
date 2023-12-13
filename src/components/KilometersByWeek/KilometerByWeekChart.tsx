import {CategoryScale, Chart as ChartJS, ChartData, ChartOptions, LineElement, PointElement} from "chart.js";
import {Line} from "react-chartjs-2";

interface Props {
    options: ChartOptions<'line'>;
    data: ChartData<'line'>;
}

const KilometerByWeekChart = ({data, options}: Props) => {

    ChartJS.register(CategoryScale, PointElement, LineElement);

    return (
        <div>
            <div>
                <Line width={100}
                      height={200}
                      data={data}
                      options={options}/>
            </div>
        </div>
    );
}
export default KilometerByWeekChart;