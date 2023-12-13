import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../contracts/abi/UserRegistry.abi.json';

interface IUserDetails {
  userAddress: string;
  name: string;
  phone: string;
  email: string;
  physicalAddress: string;
  did: string;
}

type UserDetailsTuple = [string, string, string, string, string, string];

const MetaMaskLogin: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);

  // Initialize Web3 with Infura WebSocket URL for Sepolia network
  const infuraWsUrl = "wss://sepolia.infura.io/ws/v3/8568dcbfcab044ffa3d0ab39952981b5";
  const web3 = new Web3(new Web3.providers.WebsocketProvider(infuraWsUrl));
  const contractAddress = '0x6f201d54a7772a7e85fbb8f4904ea3287236bb22';
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  useEffect(() => {
    if (account) {
      fetchUserDetails(account);
    }
  }, [account]); // This will run fetchUserDetails whenever the account state is updated

  const handleLogin = async () => {
    try {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as unknown as string[];
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          alert('Logged in!');
        } else {
          alert('No accounts found.');
        }
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to login with MetaMask.');
    }
  };

  const fetchUserDetails = async (accountAddress: string) => {
    try {
      const detailsTuple = await contract.methods.getMyUserDetails().call({ from: accountAddress }) as unknown as UserDetailsTuple;
      const details: IUserDetails = {
        userAddress: detailsTuple[0],
        name: detailsTuple[1],
        phone: detailsTuple[2],
        email: detailsTuple[3],
        physicalAddress: detailsTuple[4],
        did: detailsTuple[5], // You might want to convert this from bytes32 if needed
      };
      setUserDetails(details);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with MetaMask</button>
      {account && <p>Logged in as: {account}</p>}
      {userDetails && (
        <div>
          <p>Address: {userDetails.userAddress}</p>
          <p>Name: {userDetails.name}</p>
          <p>Phone: {userDetails.phone}</p>
          <p>Email: {userDetails.email}</p>
          <p>Physical Address: {userDetails.physicalAddress}</p>
          <p>DID: {userDetails.did}</p>
        </div>
      )}
    </div>
  );
};

export default MetaMaskLogin;
