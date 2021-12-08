import React, { useState, useEffect } from 'react'
import Person from './components/Person.js'
import numberService from './services/persons'
import Notification from './components/Notification.js'
import './App.css'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)


    // ON STARTUP

  useEffect(() => {
    console.log(' Calling server... (Effect)')
    numberService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

    //EVENT HANDLERS

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (person) => {
    console.log('Clicked on',person.name,'// id:', person.id)

    if (window.confirm(`Delete ${person.name}?`)) {
      numberService.remove(person.id)
      .then(() => numberService.getAll())
      .then(response => {
        setPersons(response.data)
      })

      setErrorMessage(
        `'${person.name}' was removed from the phonebook`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } else {
      console.log(`Did not delete ${person.name}`)
    }
  }

    // LOGIC COMPONENTS

  const addPerson = (event) => {
    event.preventDefault()
    console.log('clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.find(person => person.name === newName)) {
      updatePerson(personObject)
    } else {

        numberService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
        .catch(error => { console.log(error.response.data) || setErrorMessage(error.response.data.error)})

        setErrorMessage(
          `'${newName}' was added to the phonebook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
    setNewName('')  
    setNewNumber('')
  }
  
  const updatePerson = (personObject) => {
    if(window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
      numberService
      .update(persons.find(person => person.name === personObject.name).id, personObject)
      .catch(error => {
        setErrorMessage(
          `The information of '${personObject.name}' was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)      
      })
      .then(() => numberService.getAll()
      .then(response => {
        setPersons(response.data)
      }))

      setErrorMessage(
        `The number of '${personObject.name}' was replaced`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      console.log('Replaced number of', personObject.name)
    } else {
      console.log('Did not replace number of', personObject.name)
    }
  }

  const filterElements = (arr, query) => {
    if (newFilter === '') {
      return []
    } else {
      return arr.filter(el => el.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    } 
  }

    // RENDERING COMPONENTS

  const filterForm = () => {
    return (        
      <form>
        <div>
          filter shown with
          <input 
            value={newFilter}
            onChange={handleFilterChange}
          />
          <ul>
            {filterElements(persons, newFilter).map(person => 
            <Person key={person.name} person={person} handler={handleDelete}/>
            )}
          </ul>
        </div>
      </form>
    )
  }

  const additionForm = () => {
    return (
      <form onSubmit={addPerson}>
        <div>
          name: 
          <input 
            value={newName} 
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: 
          <input 
            value={newNumber} 
            onChange={handleNumberChange}
          />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

  const numberList = () => {
    console.log(' Rendering', persons.length, 'persons...')

    return (
      <ul>
        {persons.map(person => 
          <Person key={person.name} person={person} handler={handleDelete} />
        )} 
      </ul>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      {filterForm()}

      <h2>add a new</h2>
      {additionForm()}

      <h2>Numbers</h2>
      {numberList()}
    </div>
  )

}

export default App