import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/new/Header';
import Sidebar from './components/new/Sidebar';
import MainContent from './components/new/MainContent';
import Register from './components/auth/register/register';
import Login from './components/auth/login/login';
function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Header /> 
        <Sidebar /> 
        <Routes>
          <Route path='/chat' element={<MainContent />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;