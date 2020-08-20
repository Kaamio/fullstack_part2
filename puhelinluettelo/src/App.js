import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Person = ({person, handleClick}) => {   
  return (<div>    
  <p> {person.name} {person.number}   
  <button onClick={() => handleClick(person={person})}>delete</button>
  </p>  
  </div>
  )} 



const Persons = ({persons, showAll, state, handleClick}) => {
  return( showAll ? persons.map(person =>
    <Person key = {person.name} person = {person} handleClick={handleClick} />)
    : showFiltered({persons , state}).map(person =>  <Person key = {person.name} person = {person} />)
    )}  

const showFiltered = ({persons, state}) => { 
  return(
    persons.filter(person => person.name.toLowerCase().includes(state.toLowerCase()))
  )
}

const Filter = ({searchState, handleSearch}) => {  
  return(
    <div>
    <p>Filter shown with 
      <input value = {searchState} 
      onChange= {handleSearch}
      /> 
      </p>         
  </div>
  
  )}

const PersonForm = ({addPerson, newName, newNumber, handleChange, handleNumChange}) => {
  return(
    <form onSubmit ={addPerson}>        
        <div>
          name: <input value = {newName}
                onChange = {handleChange}
                />
        </div>
        <div>        
          number: <input value = {newNumber}
                  onChange = {handleNumChange}
                />      
        </div>
        <div>
          <button  type="submit">add</button>
        </div>
      </form>
  )
}



const App = () => {
  const [ persons, setPersons] = useState([{}]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchState, setNewSearch ] = useState('')  
  const [ showAll, setShowAll ] = useState(true)
  const [ notificationMessage, setNotificationMessage ]  =useState(null)  
  const [ errorMessage, setErrorMessage ] = useState(null)


const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
    name: newName,
    number: newNumber
    }

    if (persons.some(person => person.name === personObject.name)) {
      if (window.confirm(`${personObject.name} is already added to phonbebook, replace the number?`)) {
        personService.update(persons.find(person=> person.name === personObject.name).id, personObject)
        .then(response => {
          setPersons(persons)
          personService
          .getAll()
          .then(initialPersons => {
            setPersons(initialPersons)
            setNotificationMessage(`${personObject.name} was added to phonebook`)
            setTimeout(() => {
              setNotificationMessage(null)            
            }, 5000)
          }) 
        }).catch(error=> 
          setErrorMessage(`Person named ${personObject.name} was already removed from server`)
          )
          setTimeout(() => {
            setErrorMessage(null)            
          }, 5000)

        setNewName('') 
        setNewNumber('')
      }      
      setNewName('') 
      setNewNumber('')
    } 
      else {
        personService.create(personObject).then(response => {
          setPersons(persons.concat(response.data))
          setNotificationMessage(`${personObject.name} was added to phonebook`)
            setTimeout(() => {
              setNotificationMessage(null)            
            }, 5000)
        }).catch(error => {          
          setErrorMessage(`error : ${error.response.data.error}`)
        })
        setNewName('')
        setNewNumber('') 
      }     
     
  }

const Notification = ({message}) => {
  if(message == null) {
    return null
  }
  return (<div className='notification'> {message} </div>)
} 

const Error = ({message}) => {
  if(message == null) {
    return null
  }
  return (<div className='error'> {message} </div>)
}

const handleClick = ({person}) => {
  if (window.confirm(`Really remove ${person.name}?`)) { 
    personService.remove(person.id).then(response => {     
      setPersons(persons)
      personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      }) 
  })
  }     
      
  }

const handleChange = (event) => {    
    setNewName(event.target.value)    
}

const handleNumChange = (event) => {
  setNewNumber(event.target.value)
}

const handleSearch = (event) => {
  setNewSearch(event.target.value)
  if(searchState !== '') {
    setShowAll(false)
    } else {
      setShowAll(true)
    }  
  }

useEffect(() => {
  personService
  .getAll()
  .then(initialPersons => {
    setPersons(initialPersons)
  })    
},[])
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message = {errorMessage} />
      <Filter searchState={searchState} handleSearch = {handleSearch}> </Filter>     
      <div>
      <PersonForm addPerson = {addPerson} newName={newName} newNumber={newNumber} handleChange = {handleChange} handleNumChange={handleNumChange}> </PersonForm>
      </div>     
      <h2>Numbers</h2>
      <div>
      <Persons persons={persons} showAll = {showAll} state = {searchState} handleClick={handleClick}> </Persons>  
      </div>
        
    </div>
  )

}

export default App

