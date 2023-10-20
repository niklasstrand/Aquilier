import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from '../contracts/Rental.abi.json';

const Aquilier: React.FC = () => {
  const [contract, setContract] = useState<any | null>(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Only proceed further once user has allowed account access
          if (window.ethereum) {
            // Create a web3 instance
            const web3 = new Web3(window.ethereum);
            
            // Use the loaded contract ABI and the address where it's deployed
            const contractAddress = "0x5841b45EAEdBb51b818284154FeD79baAd927dc4";
            const rentalContract = new web3.eth.Contract(abi as any, contractAddress);
            
            setContract(rentalContract);
          }
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
      <h2>Rental Contract Interaction</h2>
      {/* Interact with the contract here */}
    </div>
  );
};

export default Aquilier;