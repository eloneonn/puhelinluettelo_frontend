import React from 'react'

const Person = ({person, handler}) => {
  console.log('Rendering person:', person)
  return (
    <li>
      {person.name} {person.number} <button onClick={() => handler(person)}>delete</button>
    </li>
  )
}
export default Person