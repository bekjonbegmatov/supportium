import React, { useState } from 'react';

function TEest() {
    const [mas , setMas] = useState(['Behruz ','Komron ','Bahtiyor ', 'Va boshqalar '])
    const [yozuv, setYozur] = useState('')

    function consolga(event){
        console.log(event);
        setYozur(event.target.value)
    }

    return ( 
        <div>
            Salom bizani komandada {mas.map((val,i) => {
                return <b>{val}</b>
            })}
            <br />
            <b>Input yozuvi {yozuv} </b>
            <br />
            <input type="text" onChange={(val)=>{consolga(val)}}/>
        </div>
     );
}

export default TEest;