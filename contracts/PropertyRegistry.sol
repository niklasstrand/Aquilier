// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRegistry {
    struct Property {
        address ownerAddress;
        uint256 propertyId;
        string name;
        string location;
        uint256 dailyRate;
        bool isAvailable;
    }

    // An array to hold all properties
    Property[] private properties;

    // Event to emit whenever a new property is created
    event PropertyCreated(
        uint256 indexed propertyId,
        address indexed ownerAddress,
        string name,
        string location,
        uint256 dailyRate,
        bool isAvailable
    );

    // Function to create a new property
    function createProperty(string memory _name, string memory _location, uint256 _dailyRate) public {
        // Create a new property
        Property memory newProperty = Property({
            ownerAddress: msg.sender,
            propertyId: properties.length, // Use the current length of the array as the new ID
            name: _name,
            location: _location,
            dailyRate: _dailyRate,
            isAvailable: true
        });

        // Add the property to the array
        properties.push(newProperty);

        // Emit the event
        emit PropertyCreated(
            newProperty.propertyId,
            msg.sender,
            _name,
            _location,
            _dailyRate,
            true
        );
    }

    // Function to get property details by ID
    function getPropertyById(uint256 _propertyId) public view returns (Property memory) {
        require(_propertyId < properties.length, "Property does not exist.");
        return properties[_propertyId];
    }

    // Function to get all properties - Note this can be gas intensive
    function getAllProperties() public view returns (Property[] memory) {
        return properties;
    }
}
