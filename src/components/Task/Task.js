import React from 'react'
import './Task.css'

const Task = ({id, taskType, start, end, day, week, description, location, topCell}) => {

  let className="task"

  switch(taskType){
    case "Pickup": className="pickup"; break;
    case "Dropoff": className="dropoff"; break;
    case "Other": className="other"; break;
    default: className="task"
  }

  if (topCell){
    return (
      <div className={className}>
        <div className="title">{taskType}</div>
        <div className="time">{start} - {end+1}</div>        
      </div>
    )
  } else {
    return (
      <div className={className}>
      </div>
    )
  }

}

export default Task
