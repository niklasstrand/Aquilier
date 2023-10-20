import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from '../contracts/Rental.abi.json';

const CreateAccount: React.FC = () => {
  const [contract, setContract] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum as any);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        
        const contractAddress = "YOUR_CONTRACT_ADDRESS";
        const rentalContract = new web3.eth.Contract(abi as any, contractAddress);
        setContract(rentalContract);
      } else {
        alert('Please install MetaMask!');
      }
    };
    init();
  }, []);

  const createAccount = async () => {
    // Your existing logic for interacting with the smart contract.
    // Make sure to handle possible exceptions and provide user feedback.
  };

  return (
    <div>
      <button onClick={createAccount}>Create Account</button>
    </div>
  );
};

export default CreateAccount;
