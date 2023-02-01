import React from 'react';
import "./YearMonthSelect.css";

const YearMonthSelect = ({year, onClickMonth, selectedYear, selectedMonth}) => {
    const currentDate = new Date();

    const getMonths = (start, end) => {
        const months = []
        for (let i = start; i <= end; i++) {
            months.push(
                <button
                    key={i}
                    onClick={() => onClickMonth(year, i)}
                    className={
                        "month-btn " +
                        (isCurrentMonth(i-1) ? " current-month" : "") +
                        (isSelectedMonth(i-1) ? " selected-month" : "")
                    }
                >
                    {i}
                </button>
            )
        }
        return months
    }

    const isCurrentYear = (year) => {
        return year === currentDate.getFullYear()
    }

    const isCurrentMonth = (month) => {
        if (isCurrentYear(year)) {
            return month === currentDate.getMonth()
        }
        return false
    }

    const isSelectedMonth = (month) => {
        if (year === selectedYear) {
            return month === selectedMonth
        }
        return false
    }

    return (
        <div className="YearMonthSelect">
            <div className={isCurrentYear(year) ? "current-year" : ""}>{year}</div>
            <div className="">
                <div className="month-select">
                    {getMonths(1, 6)}
                </div>
                <div className="month-select">
                    {getMonths(7, 12)}
                </div>
            </div>
        </div>
    );
};

export default YearMonthSelect;