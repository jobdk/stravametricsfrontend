import './App.css'
import KilometerByYear from "../KilometersByYear/KilometerByYear.tsx";
import KilometerByWeek from "../KilometersByWeek/KilometerByWeek.tsx";
import KilometerByMonth from "../KilometersByMonth/KilometerByMonth.tsx";

function App() {

    return (
        <div>
            <div><KilometerByWeek/></div>
            <div><KilometerByMonth/></div>
            <div><KilometerByYear/></div>
        </div>
    )
}

export default App
