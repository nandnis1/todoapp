import React, { useState, useEffect } from 'react'
import Spinner from './Spinner.js'

import http from '../api/http-common.js'

const Body = () => {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [date , setDate] = useState("");
  const [taskname , setTaskname] = useState("");
  const [editTaskId , setEditTaskId] = useState(null);

  const handleSubmit = () =>{
    setLoading(true)
    if(editTaskId !== null){
      const updateData = {"task" : taskname , "date" : date}
      http.patch(`/edittask/${editTaskId}` , updateData)
      .then(res=>setTasks(tasks.map(task => task._id === editTaskId ? {...task , ...updateData} : {...task})) )
      .then(setEditTaskId(null))
      .then(res=>console.log(res))
    }
    else {
      const postData = { "task": taskname, "date": date }
      http.post("/newtask", postData)
        .then(res => setTasks([...tasks, res.data]))
        .then(res=>console.log(res))
    }
    setTaskname("");
    setDate("");
  }

  const handleDelete = (id) =>{
    setLoading(true);
    http.delete(`/deletetask/${id}`)
  }

  const handleEdit = (id) => {
    const task = tasks.find(task => task._id === id);
    if (task) {
      setTaskname(task.task);
      setDate(task.date);
      setEditTaskId(id);
    }
  }



  var calls = 1
  useEffect(() => {
    http.get("/tasks")
      .then(task => setTasks(task.data.tasks))
      .then(setLoading(false))
  }, [loading])

  
  return (
    <div className='content'>

      <div className='box'>
        <div className='input'>
          <div>
            <label>TASK : <input type="text" id = "taskinput" value={taskname}
            onChange={(event)=>{setTaskname(event.target.value)}}></input></label>
          </div>
          <div>
            <label>DATE : <input type="date" id = "dateinput" value={date}
            onChange={(event)=>{setDate(event.target.value)}}></input></label>
          </div>
        </div>
        <div id = "button">
          <button className='button' onClick={handleSubmit} >UPDATE LIST</button>
        </div>
        <div>
          {loading && <Spinner />}
          
            TASK LIST :
            <div className='list'>
          {!loading && tasks.map((element) => (
            <div className='listitem' key={element._id + 1}>
              <div className='deletebutton' onClick={()=>handleDelete(element._id)}> DELETE</div>
              <div>{element.task}</div>
              <div>{element.date}</div>
              <div className='deletebutton' onClick={() => handleEdit(element._id)}>Edit</div> 
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Body




// const gettask = () => {
//   fetch('http://localhost:5000/tasks' , { "Content-Type:" : "application/json"})
//   .then(response=>response.json())
//   .then(response=>console.log(response))
// }

// gettask();