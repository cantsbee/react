import { useState } from 'react'

import './App.css'


export default function UserForm() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, job })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('hubo un error al enviar el formulario', error);
    }
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleJobChange(event) {
    setJob(event.target.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      
      <label>
        Job:
        <input type="text" value={job} onChange={handleJobChange} />
      </label>
     
      <button type="submit">Submit</button>
    </form>
    
  );
}
