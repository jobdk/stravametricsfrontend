import './App.css'
import KilometerByWeek from "../KilometersByWeek/KilometerByWeek.tsx";
import KilometerBubbles from "../KilometerBubbles/KilometerBubbles.tsx";

function App() {

    return (
        <div>
            <div><KilometerByWeek/></div>
            {/*<div><KilometerByMonth/></div>*/}
            {/*<div><KilometerByYear/></div>*/}
            <div><KilometerBubbles/></div>
        </div>
    )
}

export default App
