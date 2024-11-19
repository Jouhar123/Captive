import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensures name is always provided
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: /.+\@.+\..+/, 
    },
    status: {
        type: String,
        required: true,
    },

    checkinDate: {
        type: String,
        required: true,
    },
    checkoutDate: {
        type: String,
        required: true,
   
    },
    code:{
        type:String,
        
    }






    // checkinDate: {
    //     type: Date,
    //     required: true,
    // },
    // checkoutDate: {
    //     type: Date,
    //     required: true,
    //     validate: {
    //         validator: function (value) {
    //             // Ensure checkoutDate is after checkinDate
    //             return value > this.checkinDate;
    //         },
    //         message: "Checkout date must be after check-in date.",
    //     },
    // },
});


const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
