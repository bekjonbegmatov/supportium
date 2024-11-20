import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nawbar from './components/nawbar/nawbar';
import Register from './components/auth/register/register';

function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Nawbar />
        <Routes>
          <Route path='/register' element={<Register />} />
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;