import {useEffect, useState} from "react";
import {getGoalMetricsByWeek, getMetricsByWeek, KilometerPerWeek} from "../../services/MetricRetrievalService.tsx";
import {IconButton, Slider, Stack} from "@mui/material";
import KilometerByWeekChart from "./KilometerByWeekChart.tsx";
import RefreshIcon from '@mui/icons-material/Refresh';
import {SliderKind} from "../../model/SliderKind.tsx";
import {Mark} from "../../model/Mark.tsx";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";

// TODO:
// - if not ran in a week or sth like this, it should be zero until the current date/week/year


const weekMarks: Mark[] = [
    {
        value: 1,
        label: '1 Week',
    },
    {
        value: 12,
        label: '12 Weeks',
    }];
const monthMarks: Mark[] = [
    {
        value: 1,
        label: '1 Month',
    },
    {
        value: 12,
        label: '12 Months',
    }];

const KilometerByWeek = () => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const primary = "primary";
    const success = "success";

    // All
    const [allDone, setAllDone]: [KilometerPerWeek[], ((value: (((prevState: KilometerPerWeek[])
        => KilometerPerWeek[]) | KilometerPerWeek[])) => void)] = useState(new Array<KilometerPerWeek>());
    const [allGoal, setAllGoal]: [KilometerPerWeek[], ((value: (((prevState: KilometerPerWeek[])
        => KilometerPerWeek[]) | KilometerPerWeek[])) => void)] = useState(new Array<KilometerPerWeek>());

    // Dynamic data
    const [doneKm, setDoneKm] = useState(new Array<KilometerPerWeek>());
    const [goalKm, setGoalKm] = useState(new Array<KilometerPerWeek>());
    const [year, setYear] = useState(new Date().getFullYear());

    // Slider
    const [weekSlider, setWeekSliderValue] = useState(1);
    const [monthSlider, setMonthSlider] = useState(1);
    const [yearSlider, setYearSliderValue] = useState(year);
    const [monthSliderColor, setMonthSliderColor] = useState(primary);
    const [weekSliderColor, setWeekSliderColor] = useState(primary);
    const [yearSliderColor, setYearSliderColor] = useState(success);

    useEffect(() => {
        getMetricsByWeek("Run")
            .then((result: Array<KilometerPerWeek>) => {
                setAllDone(result);
                setDoneKm(getKilometerForYear(result, year));
            });
        getGoalMetricsByWeek("Run")
            .then((result: Array<KilometerPerWeek>) => {
                setAllGoal(result);
                setGoalKm(getKilometerForYear(result, year));
            });

    }, [year]);

    const getKilometerForYear = (all: KilometerPerWeek[], year: number) => all
        .filter((kilometerByWeek) => kilometerByWeek.year === year)
        .sort((a, b) => a.week - b.week);

    const getLatestWeek = (currentYear: KilometerPerWeek[]) => currentYear[currentYear.length - 1].week;

    const getKilometerForMonths = (all: KilometerPerWeek[], month: number) => {
        const weeks: number = month * 4;
        const currentYear: KilometerPerWeek[] = getKilometerForYear(all, year);
        const latestRecordedWeek: number = getLatestWeek(currentYear);
        const firstWeekToDisplay: number = latestRecordedWeek - weeks > 0 ? latestRecordedWeek - weeks : 1;
        return currentYear
            .filter((kilometerByWeek: KilometerPerWeek) =>
                kilometerByWeek.week >= firstWeekToDisplay && kilometerByWeek.week <= latestRecordedWeek);
    };

    const getKilometerForWeeks = (all: KilometerPerWeek[], week: number) => {
        const currentYear: KilometerPerWeek[] = getKilometerForYear(all, year);
        const latestRecordedWeek: number = getLatestWeek(currentYear);
        const firstWeekToDisplay: number = latestRecordedWeek - week > 0 ? latestRecordedWeek - week : 1;
        return currentYear
            .filter((kilometerByWeek: KilometerPerWeek) =>
                kilometerByWeek.week >= firstWeekToDisplay && kilometerByWeek.week <= latestRecordedWeek);
    }

    const options = {
        // responsive: true,
        maintainAspectRatio: false,
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
                    label: (context): string => `${context.parsed.y} km`,
                }
            },
        },
    };
    const labels: number[] = goalKm.length > doneKm.length ?
        goalKm.map((kilometerByWeek) => kilometerByWeek.week) :
        doneKm.map((kilometerByWeek) => kilometerByWeek.week);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Done Kilometer',
            data: doneKm,
            parsing: {
                xAxisKey: 'week',
                yAxisKey: 'totalAmount',
            },
            backgroundColor: [
                '#3874CB',
            ],
            borderWidth: 1,
        },
            {
                label: 'Goal Kilometer',
                data: goalKm,
                parsing: {
                    xAxisKey: 'week',
                    yAxisKey: 'totalAmount',
                },
                backgroundColor: [
                    '#4B5027',
                ],
                borderWidth: 1,
            }]
    };

    const setSpecificYear = (_event: Event, year: number | number[]) => {
        resetSlider(SliderKind.YEAR_SLIDER);
        setYear(year as number);
        setYearSliderValue(year as number);
        setDoneKm(getKilometerForYear(allDone, year as number));
        setGoalKm(getKilometerForYear(allGoal, year as number));
    };
    // TODO: fix slider month and week -> label length I think

    const setSpecificMonth = (_event: Event, month: number | number[]) => {
        resetSlider(SliderKind.MONTH_SLIDER);
        setMonthSlider(month as number);
        setDoneKm(getKilometerForMonths(allDone, month as number));
        setGoalKm(getKilometerForMonths(allGoal, month as number));
    };

    const setSpecificWeeks = (_event: Event, week: number | number[]) => {
        resetSlider(SliderKind.WEEK_SLIDER);
        setWeekSliderValue(week as number);
        setDoneKm(getKilometerForWeeks(allDone, week as number));
        setGoalKm(getKilometerForWeeks(allGoal, week as number));
    };

    const resetSlider = (slider: SliderKind) => {
        switch (slider) {
            case SliderKind.YEAR_SLIDER:
                setMonthSlider(1);
                setWeekSliderValue(1);
                setMonthSliderColor(primary);
                setWeekSliderColor(primary);
                setYearSliderColor(success);
                break;
            case SliderKind.MONTH_SLIDER:
                setWeekSliderValue(1);
                setYearSliderValue(year)
                setYearSliderColor(primary);
                setWeekSliderColor(primary);
                setMonthSliderColor(success);
                break;
            case SliderKind.WEEK_SLIDER:
                setMonthSlider(1);
                setYearSliderValue(year);
                setMonthSliderColor(primary);
                setYearSliderColor(primary);
                setWeekSliderColor(success);
                break;
            case SliderKind.ALL: {
                const currentYear = new Date().getFullYear();
                setYear(currentYear);
                setMonthSlider(1);
                setWeekSliderValue(1);
                setYearSliderValue(currentYear);
                break;
            }
        }
    };

    const yearMarks: { label: string; value: number }[] = allDone
        .filter((entry, index, self) =>
            index === self.findIndex((t) => t.year === entry.year))
        .sort((a, b) => a.year - b.year)
        .map((entry) => ({
            value: entry.year,
            label: entry.year.toString(),
        }));

    return (
        <div>
            <Stack alignItems="flex-start" paddingLeft={5} paddingRight={5}>
                <IconButton aria-label="delete" onClick={() => resetSlider(SliderKind.ALL)}>
                    <RefreshIcon/>
                </IconButton>
            </Stack>
            <Stack paddingLeft={5} paddingRight={5}>
                <Slider
                    sx={{verticalAlign: 'center'}}
                    aria-label="Always visible"
                    step={null}
                    // min={minYear}
                    min={yearMarks.length > 0 ? yearMarks[0].value : 2000}
                    // max={maxYear}
                    max={yearMarks.length > 0 ? yearMarks[yearMarks.length - 1].value : 2000}
                    marks={yearMarks}
                    valueLabelDisplay="auto"
                    onChange={setSpecificYear}
                    value={yearSlider}
                    color={yearSliderColor}
                />
                <Slider
                    aria-label="Always visible"
                    step={1}
                    min={1}
                    max={12}
                    marks={weekMarks}
                    valueLabelDisplay="auto"
                    onChange={setSpecificWeeks}
                    value={weekSlider}
                    color={weekSliderColor}
                />
                <Slider
                    aria-label="Always visible"
                    step={1}
                    min={1}
                    max={12}
                    marks={monthMarks}
                    valueLabelDisplay="auto"
                    onChange={setSpecificMonth}
                    value={monthSlider}
                    color={monthSliderColor}
                />
                <KilometerByWeekChart options={options} data={data}/>
            </Stack>
        </div>
    );
}
export default KilometerByWeek;