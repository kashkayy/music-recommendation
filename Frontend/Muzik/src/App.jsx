import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import MapPage from './pages/Map'
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp/>}/>
        <Route path='/auth/login' element={<Login/>}/>
        <Route path='/locations' element={<MapPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
