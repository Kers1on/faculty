import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Students from './pages/students'
import Teachers from './pages/teachers'
import Faculty from './pages/faculty/FacultativesPage'
import Layout from './pages/layout/layout';
import Auth from "./pages/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/students' element={<Students />} />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/faculty' element={<Faculty />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
