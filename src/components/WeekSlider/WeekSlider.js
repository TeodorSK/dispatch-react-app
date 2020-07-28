import React, {useState} from 'react'
import './WeekSlider.css'

const WeekSlider = ({initWeek, changeWeek}) => {
  const[week, setWeek] = useState(initWeek)

  const nextWeek = () =>{
    if (week+1 <= 52){
      let newWeek = week+1;
      updateWeek(newWeek)
    }
  }

  const prevWeek = () =>{
    if (week-1 >= 0){
      let newWeek = week-1;
      updateWeek(newWeek)
    }
  }

  const updateWeek = (newWeek) => {
    setWeek(newWeek)
    changeWeek(newWeek)
  }

  return (
    <div className="weekContainer">
        <div className="arrow leftArrow" onClick={prevWeek}>◄</div>
        <h1>Week {week}</h1>
        <div className="arrow rightArrow" onClick={nextWeek}>►</div>
    </div>
  )
}

export default WeekSlider
