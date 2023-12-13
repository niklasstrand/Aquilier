// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookingManagement {
    
    struct Booking {
        uint256 propertyId;
        address userAddress;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    mapping(uint256 => Booking) public bookings; // mapping of bookingId to Booking
    uint256 public nextBookingId;

    event BookingCreated(uint256 indexed bookingId, uint256 indexed propertyId, address indexed userAddress);
    event BookingCancelled(uint256 indexed bookingId);
    event AccessGranted(uint256 indexed bookingId, address indexed userAddress, uint256 indexed propertyId);

    function createBooking(uint256 _propertyId, uint256 _startDate, uint256 _endDate) public returns(uint256) {
        require(_startDate < _endDate, "Invalid booking dates");

        bookings[nextBookingId] = Booking(_propertyId, msg.sender, _startDate, _endDate, true);
        emit BookingCreated(nextBookingId, _propertyId, msg.sender);
        
        nextBookingId++;
        return nextBookingId - 1;  // Return the created booking's ID
    }

    function cancelBooking(uint256 _bookingId) public {
        require(bookings[_bookingId].userAddress == msg.sender, "Only the user who made the booking can cancel it");
        require(bookings[_bookingId].isActive, "Booking is already cancelled");
        
        bookings[_bookingId].isActive = false;
        emit BookingCancelled(_bookingId);
    }

    function grantAccess(uint256 _bookingId) public {
        require(bookings[_bookingId].isActive, "Booking is not active");
        require(block.timestamp >= bookings[_bookingId].startDate && block.timestamp <= bookings[_bookingId].endDate, "Booking is not currently valid");
        emit AccessGranted(_bookingId, bookings[_bookingId].userAddress, bookings[_bookingId].propertyId);
    }

    function checkBookingStatus(uint256 _bookingId) public view returns(bool) {
        if(bookings[_bookingId].isActive && block.timestamp >= bookings[_bookingId].startDate && block.timestamp <= bookings[_bookingId].endDate) {
            return true;
        } else {
            return false;
        }
    }
}
