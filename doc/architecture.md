
# System Map

## Contract Data
    │
    ├── Properties
    ├── Bookings
    └── Users
    
## Functions
    │
    ├── A. Property Management
    │       ├── addProperty
    │       ├── modifyProperty
    │       └── toggleAvailability
    │
    ├── B. Booking
    │       ├── bookProperty
    │       └── cancelBooking
    │
    ├── C. Payment
    │       ├── payForBooking
    │       └── withdrawPayments
    │
    └── D. Reviews and Ratings
            ├── leaveReview
            └── rateRenter
            
## Events
    │
    ├── PropertyAdded
    ├── PropertyBooked
    ├── BookingCancelled
    └── PaymentMade
    
## Modifiers
    │
    ├── onlyOwner
    └── onlyRenter
    
## Security and Usability Considerations
    │
    ├── Safe Payment
    ├── Data Privacy
    ├── Usability
    ├── Upgradability
    └── Regulatory Compliance

