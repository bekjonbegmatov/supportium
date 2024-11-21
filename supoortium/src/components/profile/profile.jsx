import React, { useState, useEffect } from "react";
import axios from "axios";
function Profile(props) {
    const [dana, setDana] = useState()
    const [is_fetched, setFetched] = useState(false)
    const [E, setE] = useState('')

    useEffect(()=>{
        if (localStorage.getItem('authToken')){
            axios.get(`${props.server_url}/who/am/i`, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            })
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    const data = response.data
                    setDana(data)
                    setFetched(true)
                    setE(data.email[0].toUpperCase())
                } else {
                    alert('Something went wrong during registration.');
                }
            })
        }
    },[])

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto mt-12 ml-64">
        <br /><br /><br />
        <div className="profile text-center ">
            {is_fetched ? (
                <div>
                    <b className="text-8xl bg-violet-800 text-white px-7 rounded-full ">{E}</b><br /><br />
                    <span className="text-black-800 ">{dana.email}</span>    <br /><br />
                    <span className="text-3xl">{dana.name} {dana.last_name}</span>
                </div>
            ):(
                <div className="animate-spin text-9xl"></div>
            )
            }
        </div>
      </div>
    </div>
  );
}

export default Profile;
