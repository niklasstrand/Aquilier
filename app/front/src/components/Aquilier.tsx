import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from '../contracts/Rental.abi.json';

const Aquilier: React.FC = () => {
  const [contract, setContract] = useState<any | null>(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
  
          // The rest of your code...
        } catch (error) {
          console.error("User rejected account access", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
  
    loadBlockchainData();
  }, []);
  

  return (
    <div>
      {"this is a button"}
    </div>
  );
};

export default Aquilier;