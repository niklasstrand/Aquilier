import React from 'react';
import MetaMaskLogin from '../components/MetaMaskLogin';
import RentalComponent from '../components/RentalComponent';

const LandingPage: React.FC = () => {
  return (
    <>
      <div>
        <h2>Welcome to the Rental Platform</h2>
        <p>Explore and list properties for rent on the blockchain.</p>
        <MetaMaskLogin />
      </div>
      <RentalComponent />
    </>
  );
  
};

export default LandingPage;
