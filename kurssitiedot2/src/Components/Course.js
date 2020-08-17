import React from 'react'

const Header = (props) => {
    return(
      <h1>{props.course.name}</h1>
    )
  }
  
  const Content = (props) => {    
    return(
      <div>
        {props.course.parts.map(part =>                    
            <Part key={part.id} name = {part.name} exercises = {part.exercises} />    
          )}  
      </div>  
   )
  }
  
  
  const Part = ( props )=> {    
    return (
      <p key = {props.id}> {props.name} {props.exercises}</p>
    )
  }
  
  const Total = (props) => {
    return(    
        <b>Total of {props.course.parts.reduce((sum,part) => sum + part.exercises,0)} exercises</b> 
    )
  }
  
  const Course = (props) => {  
    
    return(    
      <div key = {props.courses.id}>
          <Header course={props.courses}></Header>     
          <Content course={props.courses}></Content>        
          <Total course ={props.courses}></Total>             
      </div>
      
    )
  }

  export default Course