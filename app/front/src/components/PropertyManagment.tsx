import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import propertyManagerABI from '../contracts/abi/PropertyRegistry.abi.json';
import './RentalComponent.css' 

interface Property {
  propertyId: number;
  ownerAddress: string;
  name: string;
  location: string;
  dailyRate: number;
  isAvailable: boolean;
}

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const infuraHttpUrl = "https://sepolia.infura.io/v3/8568dcbfcab044ffa3d0ab39952981b5";
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraHttpUrl));
    const contractAddress = '0x1901F600fF6836c4179c13635Ec38D9a21f221B0';
    const contract = new web3.eth.Contract(propertyManagerABI, contractAddress);

    const fetchAllProperties = async () => {
        try {
          // Assuming your contract returns an array of properties directly
          const propertiesData = await contract.methods.getAllProperties().call() as unknown as Property[];
          console.log(propertiesData); 
      
          // If propertiesData is already in the correct format, just set it to state
          setProperties(propertiesData);
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      };
      

    fetchAllProperties();
  }, []);

  return (
    <div className="property-listings">
      <h3>Property Listings</h3>
      <div className="property-cards">
        {properties.map(property => (
          <div key={property.propertyId} className="property-card">
            <h4>{property.name}</h4>
            <p><strong>Location:</strong> {property.location}</p>
            <p>Daily Rate: {property.dailyRate.toString()}</p> {/* Convert BigInt to string */}
            <p><strong>Available:</strong> {property.isAvailable ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyManagement;
