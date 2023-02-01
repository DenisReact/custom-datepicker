import * as PropTypes from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import "./DatePicker.css";
import DayCell from "./components/DayCell";
import YearMonthSelect from "./components/YearMonthSelect";
import {ReactComponent as CalendarIcon} from "./icon-calendar.svg";

const daysMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
const monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const DatePicker = ({onChange, predefinedRanges, yearSelectFrom = 2010, yearSelectTo = 2050}) => {
    const inputRef = useRef();
    const [selectedStart, setSelectedStart] = useState()
    const [selectedEnd, setSelectedEnd] = useState()
    const [dateRange, setDateRange] = useState({range: [], weekends: []})
    const [showYearSelect, setShowYearSelect] = useState(false)

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    useEffect(() => {
        onChange(dateRange);
    }, [dateRange, onChange])

    const getNumberOfDays = (year, month) => {
        return 40 - new Date(year, month, 40).getDate();
    };

    const getDayDetails = (args) => {
        const date = args.index - args.firstDay;
        const day = args.index % 7;
        let prevMonth = args.month - 1;
        let prevYear = args.year;
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        const _date =
            (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
        const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
        const timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day,
            month,
            timestamp,
            dayString: daysMap[day]
        };
    };

    const getMonthDetails = (year, month) => {
        const firstDay = new Date(year, month).getDay();
        const numberOfDays = getNumberOfDays(year, month);
        const monthArray = [];
        const rows = 6;
        let index = 0;
        const cols = 7;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const currentDay = getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month
                });
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
    };

    const getWeekendsInRange = (start, end) => {
        const weekends = []
        const startDate = new Date(start);
        const endDate = new Date(end);

        while (startDate < endDate) {
            const day = startDate.getDay();
            if ((day === 6) || (day === 0)) {
                weekends.push(getDateStringFromTimestamp(startDate))
            }
            startDate.setDate(startDate.getDate() + 1);
        }
        return weekends
    }

    const [details, setDetails] = useState({
        showDatePicker: false,
        year,
        month,
        selectedStart: selectedStart,
        selectedEnd: selectedEnd,
        monthDetails: getMonthDetails(year, month)
    });

    useEffect(() => {
        setDateRange({
            range: [getDateStringFromTimestamp(details.selectedStart), getDateStringFromTimestamp(details.selectedEnd)],
            weekends: getWeekendsInRange(details.selectedStart, details.selectedEnd)
        })
    }, [details.selectedStart, details.selectedEnd])

    const showDatePicker = () => {
        setDetails({...details, showDatePicker: !details.showDatePicker});
    };

    const getMonthStr = (month) =>
        monthMap[Math.max(Math.min(11, month), 0)] || "Month";

    const getDateStringFromTimestamp = (timestamp) => {
        if (!timestamp) return ''
        const dateObject = new Date(timestamp);
        const month = dateObject.getMonth() + 1;
        const date = dateObject.getDate();
        return `${dateObject.getFullYear()}-${month < 10 ? `0${month}` : month}-${
            date < 10 ? `0${date}` : date
        }`;
    };

    const setDateToInput = (start, end) => {
        inputRef.current.value = getDateStringFromTimestamp(start) + ' ~ ' + getDateStringFromTimestamp(end);
    };

    const onDateClick = (day) => {
        if (!selectedStart || (selectedStart && selectedEnd)) {
            setDetails({
                ...details,
                selectedStart: day.timestamp,
                selectedEnd: undefined,
            });
            setSelectedStart(day.timestamp)
            setSelectedEnd(undefined)
            setDateToInput(day.timestamp, null);
        } else if (selectedStart && day.timestamp < selectedStart) {
            setDetails({
                ...details,
                selectedEnd: selectedStart,
                selectedStart: day.timestamp,
            });
            setSelectedEnd(selectedStart)
            setSelectedStart(day.timestamp)
            setDateToInput(day.timestamp, selectedStart);
        } else {
            setDetails({
                ...details,
                selectedEnd: day.timestamp,
            });
            setSelectedEnd(day.timestamp)
            setDateToInput(selectedStart, day.timestamp);
        }
    };

    const onRangeClick = (range) => {
        const start = new Date(range[0].setHours(0, 0, 0, 0))
        const startTimestamp = start.getTime()
        const end = new Date(range[1].setHours(0, 0, 0, 0))
        const endTimestamp = end.getTime()
        setDetails({
            ...details,
            year: start.getFullYear(),
            month: start.getMonth(),
            selectedStart: startTimestamp,
            selectedEnd: endTimestamp,
            monthDetails: getMonthDetails(start.getFullYear(), start.getMonth())
        });
        setSelectedStart(startTimestamp)
        setSelectedEnd(endTimestamp)
        setDateToInput(startTimestamp, endTimestamp);
        setShowYearSelect(false);
    };

    const setYear = (offset) => {
        const year = details.year + offset;
        const month = details.month;
        setDetails({
            ...details,
            year,
            monthDetails: getMonthDetails(year, month)
        });
    };

    const setMonth = (offset) => {
        let year = details.year;
        let month = details.month + offset;
        if (month === -1) {
            month = 11;
            year--;
        } else if (month === 12) {
            month = 0;
            year++;
        }
        setDetails({
            ...details,
            year,
            month,
            monthDetails: getMonthDetails(year, month)
        });
    };

    const onClickMonth = (year, month) => {
        month = month - 1
        setDetails({
            ...details,
            year,
            month,
            monthDetails: getMonthDetails(year, month)
        });
        setShowYearSelect(false)
    }

    const getYears = () => {
        const years = []
        for(let i = yearSelectFrom; i <= yearSelectTo; i++) {
            years.push(
                <YearMonthSelect
                    key={i}
                    year={i}
                    onClickMonth={onClickMonth}
                    selectedYear={details.year}
                    selectedMonth={details.month}
                />
            )
        }
        return years
    }

    return (
        <div className="DatePicker">
            <div className="mdp-input" onClick={() => showDatePicker()}>
                <input type="text" placeholder='Select date range' ref={inputRef}/>
                <CalendarIcon className="calendar-icon"/>
            </div>
            {details.showDatePicker && (
                <div className="mdp-container">
                    <div className="mdpc-head">
                        <div className="mdpch-button">
                            <div className="mdpchb-inner" onClick={() => setYear(-1)}>
                                <span className="mdpchbi-left-arrows"/>
                            </div>
                        </div>
                        <div className="mdpch-button">
                            <div className="mdpchb-inner" onClick={() => setMonth(-1)}>
                                <span className="mdpchbi-left-arrow"/>
                            </div>
                        </div>

                        <div className="mdpch-container" onClick={() => setShowYearSelect(!showYearSelect)}>
                            <div className="mdpchc-year">{details.year}</div>
                            <div className="mdpchc-month">{getMonthStr(details.month)}</div>
                        </div>

                        <div className="mdpch-button">
                            <div className="mdpchb-inner" onClick={() => setMonth(1)}>
                                <span className="mdpchbi-right-arrow"/>
                            </div>
                        </div>
                        <div className="mdpch-button">
                            <div className="mdpchb-inner" onClick={() => setYear(1)}>
                                <span className="mdpchbi-right-arrows"/>
                            </div>
                        </div>
                    </div>

                    {showYearSelect ? (
                        <div className="year-select">
                            {getYears()}
                        </div>
                    ) : (
                        <div className="mdpc-body">
                            <div className="c-container">
                                <div className="cc-head">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                                        (day, index) => (
                                            <div key={index} className="cch-name">
                                                {day}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="cc-body">
                                    {details.monthDetails?.map((day, index) => (
                                        <DayCell
                                            key={index}
                                            day={day}
                                            onDayClick={() => onDateClick(day)}
                                            start={details.selectedStart}
                                            end={details.selectedEnd}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {predefinedRanges.length > 0 && <div className="predefined-container">
                        {predefinedRanges.map((range, index) =>
                            <button
                                key={index}
                                className="predefined-btn"
                                onClick={() => onRangeClick(range.value)}>
                                {range.label}
                            </button>
                        )}
                    </div>}
                </div>
            )}
        </div>
    );
};

export default DatePicker;

DatePicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    predefinedRanges: PropTypes.array,
    yearSelectFrom: PropTypes.number,
    yearSelectTo: PropTypes.number,
};
