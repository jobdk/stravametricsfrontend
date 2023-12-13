import './KilometerBubbles.css';
import CircleIcon from '@mui/icons-material/Circle';
import {Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {getMetricsByWeek, KilometerPerWeek} from "../../services/MetricRetrievalService.tsx";
import {useEffect, useState} from "react";

const KilometerBubbles = () => {
    const [allDone, setAllDone]: [KilometerPerWeek[], ((value: (((prevState: KilometerPerWeek[])
        => KilometerPerWeek[]) | KilometerPerWeek[])) => void)] = useState(new Array<KilometerPerWeek>());
    const [doneKm, setDoneKm] = useState(new Array<KilometerPerWeek>());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    // const [months, setMonths] = useState(new Array<number>());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentMonthKm, setCurrentMonthKm] = useState(new Array<KilometerPerWeek>());

    useEffect(() => {
        getMetricsByWeek("Run")
            .then((result: Array<KilometerPerWeek>) => {
                setAllDone(result);
                setDoneKm(getKilometerForYear(result, currentYear));
            });
        setMonth(currentMonth, currentYear);
        setMonthToggle(currentMonth);
    }, [currentYear]);

    const getKilometerForYear = (all: KilometerPerWeek[], year: number) => all
        .filter((kilometerByWeek) => kilometerByWeek.year === year)
        .sort((a, b) => a.week - b.week);

    const getAvailableMonths = () => doneKm.filter((entry, index, self) =>
        index === self.findIndex((t) => t.month === entry.month))
        .sort((a, b) => a.month - b.month)
        .map((entry) => entry.month);

    const getAvailableYears = () => allDone.filter((entry, index, self) =>
        index === self.findIndex((t) => t.year === entry.year))
        .sort((a, b) => a.year - b.year)
        .map((entry) => entry.year);

    const setMonth = (month: number, year: number) => {
        setCurrentMonthKm(allDone
            .filter((entry) => entry.year === year && entry.month === month)
            .sort((a, b) => a.week - b.week));
    }

    function setYearToggle(value: number) {
        setCurrentYear(value);
        setMonth(currentMonth, value);
    }

    function setMonthToggle(value: number) {
        setCurrentMonth(value);
        setMonth(value, currentYear);
    }

    return (
        <div>
            <h1>Kilometer Grid</h1>
            <Grid container>
                <Grid item xs="auto">
                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                    <Select
                        labelId="months-select-label"
                        id="months-select"
                        label="Month"
                        value={currentMonth}
                        onChange={(event) => setMonthToggle(event.target.value as number)}
                    >
                        {getAvailableMonths().map((month: number) => {
                            return <MenuItem value={month}>{month}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs="auto">
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                        labelId="-select-label"
                        id="demo-simple-select"
                        value={currentYear}
                        label="Year"
                        onChange={(event) => setYearToggle(event.target.value as number)}
                    >
                        {getAvailableYears().map((year) => {
                            return <MenuItem value={year}>{year}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {currentMonthKm.map((kilometerPerWeek: KilometerPerWeek) => {
                        return <Grid item xs="2.4" alignItems="center">
                            <h3>{kilometerPerWeek.week}</h3>
                            <h3>{~~kilometerPerWeek.totalAmount} Km</h3>
                            <CircleIcon className='circle' style={{fontSize: ~~kilometerPerWeek.totalAmount / 11 + "rem"}}/>
                        </Grid>
                    }
                )}
            </Grid>
        </div>
    )
}

export default KilometerBubbles;