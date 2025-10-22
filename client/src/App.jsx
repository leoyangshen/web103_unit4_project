import React from 'react';
import { Routes, Route } from 'react-router-dom' // NO Router import needed here
import Navigation from './components/Navigation.jsx';
import CreateCar from './pages/CreateCar.jsx';
import ViewCars from './pages/ViewCars.jsx';
import CarDetails from './pages/CarDetails.jsx';
import EditCar from './pages/EditCar.jsx';
import './App.css';
const App = () => {return (// **** CRITICAL FIX: The single parent element for the return statement ****
<div className="App">  {/* Navigation and main must be siblings inside the outer div */}
  <Navigation />

  <main className="container"> 
    {/* Routes maps the paths */}
    <Routes>
      
      <Route path="/" element={<CreateCar />} />
      <Route path="/customcars" element={<ViewCars />} />
      <Route path="/customcars/:customItemId" element={<CarDetails />} />
      <Route path="/customcars/:customItemId/edit" element={<EditCar />} />
      
    </Routes>
  </main>
  
</div>
)};
export default App
