import React, { useState, useEffect } from 'react';

function StatementItem(props) {
    return ( 
        <div className='p-4 my-2 cursor-pointer px-8 border text-sm text-gray-800 rounded-lg bg-gray-50 flex justify-between hover:shadow-md hover:ease-in'> 
                <span className='border-left font-bold'>{props.sanoq} </span>
            <strong>
                {props.dana.text}
            </strong>
            <strong>
                {props.dana.category}
            </strong>
            <button>{props.dana.status}</button>
            <code>{props.dana.created.slice(0,10)} {props.dana.created.slice(11,16)}</code>
        </div>
     );
}

export default StatementItem;