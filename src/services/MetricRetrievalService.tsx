import axios from "axios";

export interface KilometerPerYear {
    year: number;
    totalAmount: number;
}

export interface KilometerPerMonth {
    month: number;
    year: number;
    totalAmount: number;
}

export interface KilometerPerWeek {
    week: number;
    month: number;
    year: number;
    totalAmount: number;
}

export async function getMetricsByYear(type: string): Promise<Array<KilometerPerYear>> {
    const url: string = `http://localhost:8080/api/v1/activities/aggregation/kilometer/year/${type}`;
    try {
        return await axios.get(url)
            .then((response) => response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Change this to a more meaningful error code
    }
}

export async function getMetricsByMonth(type: string): Promise<Array<KilometerPerMonth>> {
    const url: string = `http://localhost:8080/api/v1/activities/aggregation/kilometer/month/${type}`;
    try {
        return await axios.get(url)
            .then((response) => response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Change this to a more meaningful error code
    }
}

export async function getMetricsByWeek(type: string): Promise<Array<KilometerPerWeek>> {
    const url: string = `http://localhost:8080/api/v1/activities/aggregation/kilometer/week/${type}`;
    try {
        return await axios.get(url)
            .then((response) => response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Change this to a more meaningful error code
    }
}

export async function getGoalMetricsByWeek(type: string): Promise<Array<KilometerPerWeek>> {
    const url: string = `http://localhost:8080/api/v1/activities/aggregation/kilometer/week/goals/${type}`;
    try {
        return await axios.get(url)
            .then((response) => response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Change this to a more meaningful error code
    }
}