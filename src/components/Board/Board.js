import React, {useState} from 'react';
import './Board.css'
import Task from '../../components/Task/Task';
import Cell from '../../components/Cell/Cell';
import NewTaskInput from '../../components/NewTaskInput/NewTaskInput';
import Modal from 'react-modal'
import uuid from 'react-uuid'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root')

const Board = ({tasks, addTask, editTask, deleteTask, week}) => {

  //Update hooks for modal rendering based on cell clicked
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("default");
  const [modalPlaceholders, setPlaceholders] = useState({title:null, start:null, end:null, day:null, week:null, description:null, location:null})
  const [cellFunction, setCellFunction] = useState(() => addTask) //function which runs when user clicks Confirm in modal
  const [isTask, setIsTask] = useState(false)
  const [id, setId] = useState(null)


  const openModal = (modalTitle, placeholders, isTask, id) => {
    setPlaceholders(placeholders)
    setModalTitle(modalTitle)
    setIsTask(isTask)
    setId(id)
    if ( isTask ) {
      setCellFunction(() => editTask)
    }
    else {
      setCellFunction(() => addTask)
    }
    setIsOpen(true)
  }
  const closeModal = () => setIsOpen(false);


  let state = Array.from(Array(52), _ => Array.from(Array(7), _ => Array(24).fill(0)))

  // let week = 0

  const fillTasks = (tasks) => {
    tasks.forEach(task => {
      for (let hr = task.start; hr<=task.end; hr++){
        state[task.week][task.day][hr] = task;
      }
    })
  }

  const fillCells = () => {
    const cells = []
    for (let i = 0; i < 168; i++){
      cells.push(renderCell(i));
    }
    return cells
  }

  const renderCell = (index) => {
    const day = (index % 7);
    const hour = Math.floor(index/7);

    let task = state[week][day][hour]
    let taskCell = null

    //props for modal
    let isTask = false
    let placeholders = {taskType:"Pickup", start:hour, end:hour+1, day:day, week:week, description:"Description", location:"Toronto"}
    let id = null

    let hourLabel = <div className="hourLabel">{hour}:00</div>

    if (task){
      taskCell = <Task
        id={task.id}
        taskType={task.taskType}
        key={index}
        start={task.start}
        end={task.end}
        day={task.day}
        description={task.description}
        location={task.location}
        topCell={task.start === hour}/>
      isTask = true
      id = task.id
      hourLabel = null;
      placeholders={taskType:task.taskType, start:task.start, end:task.end+1, day:task.day, week:task.week, description:task.description, location:task.location}
    }

    return (
      <Cell key={index} openModal={openModal} isTask={isTask} index={index} placeholders={placeholders} id={id}>
        {hourLabel}
        {taskCell}
      </Cell>
    )
  }

  fillTasks(tasks)
  const cells = fillCells()

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  let weekDayLabels = []
  weekDays.forEach((weekDay) => {
    weekDayLabels.push(<div key={uuid()} className="weekDay">{weekDay}</div>)
  })


  return (
    <div className="innerContainer">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="addEditModal"
        >
        <h2>{modalTitle}</h2>
        <NewTaskInput cellFunction={cellFunction} closeModal={closeModal} placeholders={modalPlaceholders} id={id} deleteTask={() => deleteTask(id)} isTask={isTask}/>
      </Modal>
      {weekDayLabels}
      {cells}
    </div>
  )
}

export default Board
