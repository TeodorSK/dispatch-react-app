import React, {useState} from 'react'
import './Cell.css'

const Cell = ({children, openModal, isTask, index, placeholders, id}) => {
//key={index} openModal={openModal} isTask={isTask} index={index} placeholders={placeholders}
  const [isHovering, setHovering] = useState(false)

  const hoverSymbol = isTask ? `✎` : `+`
  const modalTitle = isTask ? "Edit task" : "Add new task"
  const className = isTask ? "cellContainer" : "cellContainer emptyCell"

  return (
    <div
      key={index}
      className={className}
      onClick={() => {
        openModal(modalTitle, placeholders, isTask, id)
        setHovering(false)}}
      onMouseEnter={() => {
        setHovering(true)}}
      onMouseLeave={() => setHovering(false)}>
      {isHovering && (<div className="hoverIcon">{hoverSymbol}</div>)}
      {children}
    </div>
  )
}

export default Cell
