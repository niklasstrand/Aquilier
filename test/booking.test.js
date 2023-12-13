const BookingManagement = artifacts.require("BookingManagement");

contract("BookingManagement", accounts => {
    const owner = accounts[0];
    const renter = accounts[1];
    
    let bookingContract;
    before(async () => {
        bookingContract = await BookingManagement.deployed();
/*      const existingContractAddress = '0xA3b71F79B146429aAC74F80950796e3D50430B38'; 
        bookingContract = await BookingManagement.at(existingContractAddress);  */
        //bookingContract = await BookingManagement.new({ from: owner });
    });

        it("should allow a user to create a booking", async () => {
            const startDate = Math.floor(Date.now() / 1000);  // current time in seconds
            const endDate = startDate + (7 * 24 * 60 * 60);  // 7 days from now
            
            const receipt = await bookingContract.createBooking(1, startDate, endDate, { from: renter });
            
            // Check event
            assert.equal(receipt.logs[0].event, "BookingCreated");
            const bookingId = receipt.logs[0].args.bookingId;
            const bookingDetails = await bookingContract.bookings(bookingId);

            console.log("start date : ", startDate)
        
            console.log("Receipt for booking: ", receipt)
            
            assert.equal(bookingDetails.propertyId, 1);
            assert.equal(bookingDetails.userAddress, renter);
            assert.equal(bookingDetails.startDate, startDate);
            assert.equal(bookingDetails.endDate, endDate);
            assert.equal(bookingDetails.isActive, true);
        });
        it("should allow the user to cancel their booking", async () => {
            const startDate = Math.floor(Date.now() / 1000);
            const endDate = startDate + (7 * 24 * 60 * 60);
            const receipt = await bookingContract.createBooking(1, startDate, endDate, { from: renter });
            const bookingId = receipt.logs[0].args.bookingId;

            
            await bookingContract.cancelBooking(bookingId, { from: renter });
            console.log("Booking id: ", bookingId)
        
            const bookingDetails = await bookingContract.bookings(bookingId);
            assert.equal(bookingDetails.isActive, false);
        });
        it("should grant access when the booking is currently valid", async () => {
            const startDate = Math.floor(Date.now() / 1000);
            const endDate = startDate + (7 * 24 * 60 * 60);
            const receipt = await bookingContract.createBooking(1, startDate, endDate, { from: renter });
            const bookingId = receipt.logs[0].args.bookingId;
        
            // Advance time to simulate the booking starting (can be done using a library like `time` from `@openzeppelin/test-helpers`)
            // await time.increase(1); // increase by one second to make sure we are in the booking period
        
            const Access_receipt = await bookingContract.grantAccess(bookingId, { from: renter });
            console.log("Access_receipt: ", Access_receipt)
            // Check event
            assert.equal(Access_receipt.logs[0].event, "AccessGranted");
        });
        it.skip("should return the correct booking status", async () => {
            const startDate = Math.floor(Date.now() / 1000);
            const endDate = startDate + (7 * 24 * 60 * 60);
            const bookingId = await bookingContract.createBooking(1, startDate, endDate, { from: renter });
        
            // Check the status before the booking starts
            let status = await bookingContract.checkBookingStatus(bookingId);
            assert.equal(status, false, "Booking shouldn't be active yet");
        
            // Advance time to simulate the booking starting
            // await time.increase(1);  // uncomment when you've integrated the time helpers
        
            // Check the status during the booking period
            status = await bookingContract.checkBookingStatus(bookingId);
            assert.equal(status, true, "Booking should be active now");
        });
        
        

});

