import React from 'react';
import './App.css'; // Ensure this contains all the styles you need
import MetaMaskLogin from './components/MetaMaskLogin';
import UserComponent from './components/UserRegestry';
import PropertyManagement from './components/PropertyManagment';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Aquilier</h1>
      </header>
      <main>
        <h2>Welcome to the Rental Platform</h2>
        <p>Explore and list properties for rent on the blockchain.</p>
        <MetaMaskLogin />
        <UserComponent />
        <PropertyManagement />
      </main>
    </div>
  );
}

export default App;
