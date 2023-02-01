import './App.css';
import DatePicker from "./components/DatePicker/DatePicker";
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import {useState} from "react";

const predefinedRanges = [
    {
        label: 'Today',
        value: [new Date(), new Date()]
    },
    {
        label: 'Yesterday',
        value: [addDays(new Date(), -1), addDays(new Date(), -1)]
    },
    {
        label: 'This week',
        value: [startOfWeek(new Date()), endOfWeek(new Date())]
    },
    {
        label: 'Last 7 days',
        value: [subDays(new Date(), 6), new Date()]
    },
    {
        label: 'Last 30 days',
        value: [subDays(new Date(), 29), new Date()]
    },
    {
        label: 'This month',
        value: [startOfMonth(new Date()), new Date()]
    },
    {
        label: 'Last month',
        value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))]
    },
    {
        label: 'This year',
        value: [new Date(new Date().getFullYear(), 0, 1), new Date()]
    },
    {
        label: 'Last year',
        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)]
    },
    {
        label: 'All time',
        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()]
    },
];

function App() {
    const [range, setRange] = useState({range: [], weekends: []})

    const onChange = (range) => {
        setRange(range);
    };

    return (
        <div className="App">
            <p>range: [ {range.range[0]}{range.range[1] && `, ${range.range[1]}`} ]</p>
            <p className="range-info">weekends in range: [ {range.weekends.join(', ')} ]</p>
            <DatePicker onChange={onChange} predefinedRanges={predefinedRanges}/>
        </div>
    );
}

export default App;
