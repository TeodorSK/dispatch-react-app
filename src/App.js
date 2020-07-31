import React, {useState} from 'react';
import Board from './components/Board/Board'
import WeekSlider from './components/WeekSlider/WeekSlider'
import Download from './components/Download/Download'
import uuid from 'react-uuid'
import './App.css';
import logowhite from './components/Images/logowhite.svg'
import Modal from 'react-modal'
import Select from 'react-select'

const App = (props) => {

  const [tasks, setTasks] = useState([])
  const [currentDriver, setCurrentDriver] = useState("John")
  const [dialogueIsOpen, setDialogueIsOpen] = useState(false)
  const [conflictingTask, setConflictingTask] = useState(null)
  const [newTask, setNewTask] = useState(null)
  const [week, setWeek] = useState(0)
  const [drivers, setDrivers] = useState([
    {label:"John",value:[
      {"id":uuid(),"taskType":"Pickup","start":3,"end":5,"day":1,"week":0,"description":"Pick up X","location":"Toronto"},
      {"id":uuid(),"taskType":"Dropoff","start":6,"end":8,"day":1,"week":0,"description":"Drop off Y","location":"Toronto"},
      {"id":uuid(),"taskType":"Pickup","start":4,"end":5,"day":2,"week":0,"description":"Pick up Y","location":"Toronto"},
      {"id":uuid(),"taskType":"Dropoff","start":8,"end":11,"day":2,"week":0,"description":"Drop off Y","location":"Toronto"},
      {"id":uuid(),"taskType":"Other","start":6,"end":7,"day":2,"week":0,"description":"Coffee Break","location":"Toronto"},
      {"id":uuid(),"taskType":"Pickup","start":2,"end":3,"day":3,"week":0,"description":"Pick up Z","location":"Toronto"},
      {"id":uuid(),"taskType":"Dropoff","start":6,"end":7,"day":3,"week":0,"description":"Drop off Z","location":"Toronto"},
    ]},
    {label:"Alice",value:[
      {"id":uuid(),"taskType":"Dropoff","start":3,"end":5,"day":1,"week":0,"description":"Pick up X","location":"Toronto"},
      {"id":uuid(),"taskType":"Dropoff","start":6,"end":8,"day":2,"week":0,"description":"Drop off Y","location":"Toronto"},
      {"id":uuid(),"taskType":"Pickup","start":4,"end":5,"day":3,"week":0,"description":"Pick up Y","location":"Toronto"},
      {"id":uuid(),"taskType":"Dropoff","start":8,"end":11,"day":3,"week":0,"description":"Drop off Y","location":"Toronto"},
      {"id":uuid(),"taskType":"Other","start":6,"end":7,"day":4,"week":0,"description":"Coffee Break","location":"Toronto"},
      {"id":uuid(),"taskType":"Pickup","start":2,"end":3,"day":5,"week":0,"description":"Pick up Z","location":"Toronto"},
      {"id":uuid(),"taskType":"Other","start":6,"end":7,"day":6,"week":0,"description":"Drop off Z","location":"Toronto"},
    ]},
    {label:"Bob",value:[
      {"id":uuid(),"taskType":"Other","start":3,"end":6,"day":1,"week":0,"description":"Get flowers","location":"Toronto"},
    ]},
  ])

  const openDialogue = (newTaskProp, conflictingTaskProp) => {
    setNewTask(newTaskProp);
    setConflictingTask(conflictingTaskProp);
    setDialogueIsOpen(true);
  }

  const closeDialogue = () => {
    setDialogueIsOpen(false);
  }

  const taskConflicts = (startTime, endTime, day, week, newTasks) => {
    let todaysTasks = newTasks.filter(task => task.day === day && task.week === week)
    let conflictingTask = null;
    todaysTasks.forEach(task=>{
        if ((startTime >= task.start && startTime <= task.end) || //Head of new task overlaps existing task
        (endTime >= task.start && endTime <= task.end) || //Tail of new task overlaps existing task
        (startTime <= task.start && endTime >= task.end)) {
          conflictingTask = task
        } //New task fully overlaps existing task
    })
    return conflictingTask
  }

  const validTask = (startTime, endTime, day, week) => {
    return (!(endTime < startTime) ||
    (startTime < 0 || endTime > 23))
  }

  const setTaskState = (newTaskProp) => {
    let newTasks = [...tasks, newTaskProp]
    setTasks(newTasks)
    updateDriverTasks(newTasks)
  }

  const addTask = (id, taskType, startTime, endTime, day, week, location, description) =>{
    if (validTask(startTime, endTime, day, week)) {
      let conflictingTaskProp = taskConflicts(startTime, endTime, day, week, tasks)
      let newTaskProp = {"id":uuid(),"taskType":taskType,"start":startTime,"end":endTime,"day":day,"week":week, "location":location, "description":description}
      if (taskConflicts(startTime, endTime, day, week, tasks)){
        openDialogue(newTaskProp, conflictingTaskProp);
      } else{
        setTaskState(newTaskProp);

      }
    } else {
      alert("Invalid time")
    }
  }

  const editTask = (id, taskType, startTime, endTime, day, week, location, description) =>{
    let newTasks = [...tasks].filter((task)=>task.id !== id)
    if (validTask(startTime, endTime, day, week)) {
      let conflictingTaskProp = taskConflicts(startTime, endTime, day, week, tasks)
      let newTaskProp = {"id":uuid(),"taskType":taskType,"start":startTime,"end":endTime,"day":day,"week":week, "location":location, "description":description}
      if (taskConflicts(startTime, endTime, day, week, newTasks)){
        openDialogue(newTaskProp, conflictingTaskProp);
      } else{
        setTaskState(newTaskProp);
      }
    } else {
      alert("Invalid time")
    }
  }

  const replaceTask = (newTaskProp, conflictingTaskProp) => {
    let newTasks = [...tasks].filter((task)=>task.id !== conflictingTaskProp.id)
    setTasks([...newTasks, newTaskProp])
    updateDriverTasks([...newTasks, newTaskProp])
  }

  const overwriteTask = (newTaskProp, conflictingTaskProp) =>{
    replaceTask(newTaskProp, conflictingTaskProp)
    closeDialogue()
  }

  const deleteTask = (id) =>{
    let newTasks = [...tasks].filter((task)=>task.id !== id)
    setTasks(newTasks)
  }

  const getDriverTasks = (driver) => {
    setTasks(driver.value)
  }

  const updateDriverTasks = (newTasks) => {
    let newDrivers = drivers;
    newDrivers.forEach((driver) => {
      if (driver.label === currentDriver){
        driver.value=newTasks; //problem is tasks aren't updated by the time this runs
      }
    })
    setDrivers(newDrivers)
  }

  const changeWeek = (newWeek) => {
    setWeek(newWeek)
  }

  const dialogueStyle = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  return (
    <div className="outerContainer">
      <Modal
        isOpen={dialogueIsOpen}
        onRequestClose={closeDialogue}
        style={dialogueStyle}
        contentLabel="conflictDialogue">
        <h3>Task conflicts! Do you want to overwrite conflicting task?</h3>
        {(conflictingTask && (
          <div className="conflicts">
            <div className={"overWriteCell " + conflictingTask.taskType.toLowerCase()}> Old:<h4>{conflictingTask.taskType}</h4><p>{conflictingTask.start}-{conflictingTask.end}</p> </div>
            <div className={"overWriteCell " + newTask.taskType.toLowerCase()}> New:<h4>{newTask.taskType}</h4><p>{newTask.start}-{newTask.end}</p> </div>
          </div>
        ))}
        <button type = "button" onClick={() => overwriteTask(newTask, conflictingTask)}>Overwrite</button>
        <button type = "button" onClick={closeDialogue}>Cancel</button>
      </Modal>
      <div className="logoRow"><img alt="logo" className="logo" src={logowhite}></img></div>
      <div className="topRow">
        <div className="weekSlider"><WeekSlider initWeek={week} changeWeek={changeWeek} /></div>
        <div className="driverMenu">
          <Select placeholder="Select driver to show tasks" options={drivers} onChange={(driver)=>{
              setCurrentDriver(driver.label)
              getDriverTasks(driver)
            }}/>
        </div>
        <div className="driverContainer">
          <div className="downloadMenu">
            <Download driverName={currentDriver} tasks={tasks}/>
          </div>
        </div>
      </div>
        <Board tasks={tasks} addTask={addTask} editTask={editTask} deleteTask={deleteTask} week={week}/>
    </div>
  );
}

export default App;
