import React, { useEffect, useState } from 'react';
import axios from 'axios';

import StatementItem from './statemant_item';


function Statement(props) {
    const [cat, setCat] = useState();
    const [requests, setRequests] = useState();
    const [loaded, setLoaded] = useState(false);

    const [is_req, setIs_req] = useState(true)

    const [new_category, setNewCategory] = useState()
    const [new_text, setNewText] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Запрос категорий
                const catResponse = await axios.get(`${props.server_url}/category/`);
                setCat(catResponse.data);

                // Запрос запросов пользователя
                const requestResponse = await axios.get(`${props.server_url}/user/request`, {
                    headers: {
                        "Authorization": localStorage.getItem('authToken')
                    }
                });
                setRequests(requestResponse.data);

                // Устанавливаем флаг завершения загрузки
                setLoaded(true);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchData();
    }, []);

    function post_new_state() {
        axios.post(
            `${props.server_url}/user/request`, 
            {
                data: {
                    'category':  Number(new_category),
                    'text': new_text
                }
            },
            {
                headers: {
                    "Authorization": localStorage.getItem('authToken')
                }
            }
        )
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                window.location.reload();
            }
        })
        .catch(error => {
            console.error("Error while posting new state:", error);
        });
    }
    

    return ( 
        <div className='h-screen flex flex-col'>
            <div className="flex-1 p-4 overflow-y-auto mt-12 ml-64">  
                {loaded && is_req  ? (
                    <div className='text-center'>
                        <h1 className='text-4xl font-extrabold text-gray-900'>Обращение</h1><br />
                        {requests?.map((val,i) => {
                            return <StatementItem className="" key={i} sanoq={i+1} dana={val} /> 
                        })}
                        <br /><br />
                        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' onClick={()=>{setIs_req(false)}}> + Новое обращение</button>
                    </div>
                ) : (
                    <div>
                        {is_req ? (
                            <b>
                                Загружаются данные из сервера
                            </b>
                        ):(
                            <div className='text-center'>
                                <h1 className='text-4xl font-extrabold text-gray-900'>Создать обращение</h1><br />
                                <div className="from">
                                    <select onChange={(e)=>{setNewCategory(e.target.value)}} className='w-6/12 p-2 rounded-lg border bg-indigo-200'>
                                        {cat?.map((val,i) => {
                                            return <option value={val.id} > {val.description}</option>
                                        })}
                                    </select>
                                </div>
                                <br />
                                <textarea onChange={(e) => {setNewText(e.target.value)}} className='border w-6/12 bg-indigo-200 p-2 rounded-lg' id="" cols="34" rows="10" placeholder='text' ></textarea>
                                <br />
                                <br />
                                <button onClick={() => {post_new_state()}} className='bg-indigo-600 w-6/12 text-white w-80 p-2 rounded-lg ease-in hover:bg-indigo-500 font-extrabold text-gray-900 '> Отправить</button>
                            </div>
                        )}
                    </div>
                )} 
            </div>
        </div>
     );
}

export default Statement;
