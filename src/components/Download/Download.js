import React, {useState} from 'react'
import './Download.css'
import { CSVLink } from "react-csv";
import Select from 'react-select'

const Download = ({driverName, tasks}) => {
  const [dlReady, setDlReady] = useState(false);
  const [dlData, setDlData] = useState(null);
  const [filename, setFilename] = useState("schedule.csv")
  let tasksCopy = null;
  let maxDay = 7;
  let taskData =[
    ["Time-Frame", "Pickup", "Dropoff", "Other"],
  ]
  const reset = () => {
    tasksCopy = null;
    maxDay = 7;
    taskData = [
      ["Time-Frame", "Pickup", "Dropoff", "Other"],
    ]
  }

  const copyTasks = () => {
    tasksCopy = tasks;
    tasksCopy.forEach((task)=>{
      task.day += 7*task.week
    })
    maxDay = Math.max(...tasksCopy.map((task)=>{return task.day;}))+1
  }

  const intervals = [
    {label:"2", value:2},
    {label:"4", value:4},
    {label:"7", value:7},
    {label:"14", value:14}
  ]

  const generateTable = (dlInterval) => {
    console.log("maxday before generating "+maxDay)
    for (let interval = dlInterval; interval<=maxDay; interval += dlInterval){
      let intervalLabel = "Day "+(interval-dlInterval+1)+" - Day "+interval;
      taskData=[...taskData, [intervalLabel,0,0,0]]
    }
  }

  const fillTable = (dlInterval) => {
    tasksCopy.forEach((task) => {
      let row = 1;
      row = Math.ceil((task.day+1)/dlInterval)
      let col = 1;
      switch(task.taskType){
        case "Pickup":
          col = 1;
          break;
        case "Dropoff":
          col = 2;
          break;
        case "Other":
          col = 3;
          break;
      }
      taskData[row][col] += 1;
    })

    setDlReady(true)
    setDlData(taskData)
    setFilename(driverName + "_schedule_" + dlInterval +"day.csv")
  }

  return (
    <div className="dlContainer">
    <Select
      className="intervalSelect"
      placeholder="Select time-range to download"
      options={intervals}
      onChange={(option) => {
        if (taskData)
        copyTasks();        
        generateTable(option.value);
        fillTable(option.value);
      }}/>
      {(dlReady && (<CSVLink
        className="btn"
        data={dlData}
        filename={filename}
        onClick={
          reset()
        }
      >Download CSV</CSVLink>))}
    </div>
  )
}

export default Download
