import React, { useState } from 'react'

const NewTaskInput = ({cellFunction, closeModal, placeholders, id, deleteTask, isTask}) => {
  const [taskType, setTaskType] = useState(placeholders.taskType);
  const [startTime, setStartTime] = useState(placeholders.start);
  const [endTime, setEndTime] = useState(placeholders.end);
  const [day, setDay] = useState(placeholders.day);
  const [week, setWeek] = useState(placeholders.week);
  const [description, setDescription] = useState(placeholders.description);
  const [location, setLocation] = useState(placeholders.location);


  const handleSubmit = (e) => {
    e.preventDefault()
    cellFunction(id, taskType, parseInt(startTime), parseInt(endTime)-1, parseInt(day), parseInt(week), location, description)
    closeModal()
  }

  const handleDelete = (e) => {
    closeModal()
    deleteTask()
  }

  return (
    <div className="newTaskInput">
      <form onSubmit={handleSubmit}>
        <label>
          <p>Pickup
          <input type="radio" name="taskType" label="Pickup" defaultChecked={taskType === 'Pickup'} value="Pickup" onClick={() => setTaskType('Pickup')} /></p>
          <p>Dropoff
          <input type="radio" name="taskType" label="Dropoff" defaultChecked={taskType === 'Dropoff'} value="Dropoff" onClick={() => setTaskType('Dropoff')} /></p>
          <p>Other
          <input type="radio" name="taskType" label="Other" defaultChecked={taskType === 'Other'} value="Other" onClick={() => setTaskType('Other')} /></p>
        <p>Start Time:</p>
          <input
            type = "number"
            value = {startTime}
            onChange = {e => setStartTime(e.target.value)}
          />
        <p>End Time:</p>
          <input
            type = "number"
            value = {endTime}
            onChange = {e => setEndTime(e.target.value)}
          />
        <p>Day:</p>
          <input
            type = "number"
            value = {day}
            onChange = {e => setDay(e.target.value)}
          />
        <p>Week:</p>
          <input
            type = "number"
            value = {week}
            onChange = {e => setWeek(e.target.value)}
          />
        <p>Location:</p>
          <input
            type = "text"
            value = {location}
            onChange = {e => setLocation(e.target.value)}
          />
        <p>Description:</p>
          <input
            type = "text"
            value = {description}
            onChange = {e => setDescription(e.target.value)}
          />
        <p><button type="button"onClick={closeModal}>Close</button><button type="submit" value="Confirm">Confirm</button></p>
        {(isTask && (<button type="button" onClick={handleDelete}>Delete Task</button>))}
          </label>
      </form>
    </div>
  )
}

export default NewTaskInput
