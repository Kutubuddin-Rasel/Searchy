import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Signup from './components/Sign-up/Signup.tsx'
import Dashboard from './components/Dashboard/Dashboard.tsx'
import Home from './components/Home/Home.tsx'
import Signin from './components/Sign-in/Signin.tsx'

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' >
    <Route path='/sign-in' element={<Signin />}></Route>
    <Route path='/sign-up' element ={<Signup />}></Route>
    <Route path='/dashboard' element ={<Dashboard />}></Route>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={route}/>
  </StrictMode>,
)
