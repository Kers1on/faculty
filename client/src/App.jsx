import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import Students from './pages/students'
import Teachers from './pages/teachers'
import Faculty from './pages/faculty'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/students' element={<Students />} />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/faculty' element={<Faculty />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
