import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/new/Header';
import Sidebar from './components/new/Sidebar';
import MainContent from './components/new/MainContent';
import Register from './components/auth/register/register';
import Login from './components/auth/login/login';
function App() {

  const wecoket_url = "ws://127.0.0.1:8000";
  const server_url = "http://127.0.0.1:8000";

  return (
    <BrowserRouter>
      <div className="">
        <Header /> 
        <Sidebar /> 
        <Routes>
          <Route path='/chat' element={<MainContent server_url={server_url} wecoket_url={wecoket_url}/>} />
          <Route path='/register' element={<Register server_url={server_url} wecoket_url={wecoket_url} />} />
          <Route path='/login' element={<Login server_url={server_url} wecoket_url={wecoket_url} />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;