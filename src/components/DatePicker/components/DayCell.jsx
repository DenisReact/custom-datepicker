import React from 'react';
import "./DayCell.css";

const DayCell = ({day, start, end, onDayClick}) => {
    const oneDay = 60 * 60 * 24 * 1000;
    const todayTimestamp =
        Date.now() -
        (Date.now() % oneDay) +
        new Date().getTimezoneOffset() * 1000 * 60;

    const isCurrentDay = (day) => {
        return day.timestamp === todayTimestamp;
    };

    const isSelectedDay = (day) => {
        return day.timestamp === start || day.timestamp === end;
    };

    const isDayInRange = (day) => {
        return day.timestamp > start && day.timestamp < end;
    };

    const isNonBusinessDay = (day) => {
        return day.day === 0 || day.day === 6
    }

    return (
        <div
            className={
                "c-day-container " +
                (day.month !== 0 ? " disabled" : "") +
                (isCurrentDay(day) ? " today" : "") +
                (isSelectedDay(day) ? isNonBusinessDay(day) ? " weekend-in-range" : " selected" : "") +
                (isDayInRange(day) ?
                    isNonBusinessDay(day) ? " weekend-in-range" : " in-range" : ""
                )
            }
        >
            <div className="cdc-day">
                <span onClick={() => onDayClick(day)}>{day.date}</span>
            </div>
        </div>
    );
};

export default DayCell;