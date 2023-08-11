import React, { useEffect, useState } from 'react'

export default function ResearchBar(props) {
  const [search,setSearch] = useState('')

  useEffect(()=>{
    console.log(search)
  },[search])

  function handleInputSearchUser(e){
    setSearch(e.target.value)
    //TODO Aggiungere check per email lowercase
  }
  function handleSearchClick(){
    if (search === '') return
    console.log(search)

    const iam= props.iam
    const who= search

    console.log(iam,who)

    fetch(`https://demo-chat-dreamlab-b5a060fffd21.herokuapp.com/create-chat?user1=${iam}&user2=${search}`,{
      method:"POST",
      headers:{
        "Content-type":"application-json"
      }
    })
    .then(response => response.json())
    .then( data => {
      if (data.error){
        alert(data.error)
        return
      }
      location.reload()
    })
  }

  return (
      <div className='barra-ricerca'> 
        <svg onClick={handleSearchClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="logos-search">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
        </svg>
        <input placeholder='Cerca utente..' className='input-ricerca' type="text" autoComplete='off' onChange={handleInputSearchUser} />
      </div>
    
  )
}

