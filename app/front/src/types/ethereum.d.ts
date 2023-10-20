// ethereum.d.ts
interface Window {
    ethereum?: {
      request?: (...args: any[]) => void;
      // You might add other expected Ethereum methods and properties here
    };
  }
  