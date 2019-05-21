import React from "react";
import ReactWeeklyDayPicker from "react-weekly-day-picker";
import { updateUser } from "../action";

export default class WeeklyDayPicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(day) {
        console.log("handleChange", day);
        this.props.daysSelected(day);
    }

    render() {
        return (
            <ReactWeeklyDayPicker
                multipleDaySelect={"true"}
                mobilView={window.innerWidth < 920}
                selectDay={day => {
                    console.log(day);
                    this.props.daysSelected(day);
                }}
            />
        );
    }
}
