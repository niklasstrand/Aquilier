import React from 'react';
import abi from './contracts/Rental.abi.json'; // Assume that this file is located at src/contracts/Rental.abi.json
import Aquilier from './components/Aquilier'; // Assume that Aquilier.tsx is located at src/components/Aquilier.tsx
import './App.css'; // Optional, if you are using a CSS file for styling

function App() {
  // Example usage of the ABI (not used in the component render for now)
  console.log(abi);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My DApp</h1>
      </header>
      <main>
        <Aquilier />
      </main>
    </div>
  );
}

export default App;
