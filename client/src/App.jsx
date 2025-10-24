import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import CreateCar from './pages/CreateCar.jsx'
import CarDetails from './pages/CarDetails.jsx'
import EditCar from './pages/EditCar.jsx'

// NOTE: We have removed the 'ViewCars' import as it is now redundant and replaced by CustomCars.
import CustomCars from './pages/CustomCars.jsx' 
import './App.css'

const App = () => {
return (
<div className="App">
  <Navigation />

  <main className="container"> 
    <Routes>
      {/* 1. HOME PAGE: Car Creation Form */}
      <Route path="/" element={<CreateCar />} />
      
      {/* 2. LIST PAGE: The new Custom Cars list with Sorting */}
      <Route path="/customcars" element={<CustomCars />} /> 
      
      {/* 3. DETAIL PAGE: View the specific custom car details */}
      <Route path="/customcars/:customItemId" element={<CarDetails />} />
      
      {/* 4. EDIT PAGE: Edit the specific custom car */}
      <Route path="/customcars/:customItemId/edit" element={<EditCar />} />
    </Routes>
  </main>
  
</div>
);
}

export default App

