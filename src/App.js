import React, {useState} from 'react';
import Board from './components/Board/Board'
import WeekSlider from './components/WeekSlider/WeekSlider'
import uuid from 'react-uuid'
import './App.css';
import logo from './components/Images/logo.svg'
import logowhite from './components/Images/logowhite.svg'


const App = (props) => {

  const[week, setWeek] = useState(0)

  const[tasks, setTasks] = useState([
    {"id":1,"taskType":"Pickup","start":6,"end":7,"day":2,"week":0,"description":"Pick up X","location":"Toronto"},
    {"id":2,"taskType":"Pickup","start":3,"end":4,"day":2,"week":0,"description":"Pick up Y","location":"Toronto"},
    {"id":3,"taskType":"Dropoff","start":13,"end":16,"day":3,"week":0,"description":"Drop off X","location":"Toronto"},
    {"id":4,"taskType":"Other","start":17,"end":18,"day":5,"week":0,"description":"Get coffee","location":"Toronto"},
    {"id":5,"taskType":"Pickup","start":9,"end":14,"day":2,"week":0,"description":"Pick up Z","location":"Toronto"},
  ])

  const validateNewTask = (startTime, endTime, day, week, tasks) => {
    let todaysTasks = tasks.filter(task => task.day === day && task.week === week)
    // console.log("todays tasks are " + JSON.stringify(todaysTasks))

    let okFlag = true;
    todaysTasks.forEach(task=>{
        if ((startTime >= task.start && startTime <= task.end) || //Head of new task overlaps existing task
        (endTime >= task.start && endTime <= task.end) || //Tail of new task overlaps existing task
        (startTime <= task.start && endTime >= task.end) || //New task fully overlaps existing task
        (endTime < startTime) ||
        (startTime < 0 || endTime > 23)) okFlag = false
    })
    return okFlag
  }


  const addTask = (id, taskType, startTime, endTime, day, week, location, description) =>{
    if (validateNewTask(startTime, endTime, day, week, tasks)) {
      setTasks([...tasks, {"id":uuid(),"taskType":taskType,"start":startTime,"end":endTime,"day":day,"week":week, "location":location, "description":description}])
    } else {
      alert("Invalid time")
      //TODO: conflict resolve
    }
  }

  const editTask = (id, taskType, startTime, endTime, day, week, location, description) =>{
    let newTasks = [...tasks].filter((task)=>task.id !== id)
    if (validateNewTask(startTime, endTime, day, week, newTasks)) {
      setTasks([...newTasks, {"id":uuid(),"taskType":taskType,"start":startTime,"end":endTime,"day":day,"week":week, "location":location, "description":description}])
    } else {
      alert("Invalid time")
      //TODO: conflict resolve
    }
  }

  const deleteTask = (id) =>{
    let newTasks = [...tasks].filter((task)=>task.id !== id)
    setTasks(newTasks)
  }

  const changeWeek = (newWeek) => {
    console.log("setting week to " + newWeek)
    setWeek(newWeek)
  }

  return (
    <div className="outerContainer">
      <div className="logoRow"><img className="logo" src={logowhite}></img></div>
      <div className="topRow">
        <div className="weekSlider"><WeekSlider initWeek={week} changeWeek={changeWeek} /></div>
        <div className="menus">Placeholder</div>
      </div>
        <Board tasks={tasks} addTask={addTask} editTask={editTask} deleteTask={deleteTask} week={week}/>
    </div>
  );
}

export default App;
