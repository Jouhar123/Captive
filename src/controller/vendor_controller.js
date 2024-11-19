import Vendor from "../Schema/Vendor.js";
import {sendCode} from "../controller/send_email.js"

// export const createVendor = async (req, res) => {
//     try {
//         const { name, email, status, checkinDate, checkoutDate } = req.body;

//         if (!name || !email || !checkinDate || !checkoutDate) {
//             return res.status(400).json({ message: "All fields are required." });
//         }

//         if (new Date(checkinDate) >= new Date(checkoutDate)) {
//             return res.status(400).json({
//                 message: "Checkout date must be after check-in date.",
//             });
//         }

//         const newVendor = new Vendor({
//             name,
//             email,
//             status: status ?? true, 
//             checkinDate,
//             checkoutDate,
//         });

//         const savedVendor = await newVendor.save();
     
//         const otpResponse = await sendCode({ body: { email: savedVendor.email } }, res);
    
//         // If OTP is successfully sent, then send the success response
//         if (otpResponse && otpResponse.status === 200) {
//           return res.status(201).json({
//             message: "Vendor created successfully, OTP sent.",
//             vendor: savedVendor,
//           });
//         }
    
//         // If OTP sending fails, handle failure
//         return res.status(500).json({
//           message: "Vendor created, but failed to send OTP.",
//         });
    
//       } catch (error) {
//         console.error("Error creating vendor:", error);
//         if (error.code === 11000) {
//           return res.status(400).json({
//             message: "Email already exists.",
//           });
//         }
//         return res.status(500).json({
//           message: "Internal server error.",
//           error: error.message,
//         });
//       }
//     };




export const createVendor = async (req, res) => {
    try {
        const { name, email, status, checkinDate, checkoutDate } = req.body;

        if (!name || !email || !checkinDate || !checkoutDate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (new Date(checkinDate) >= new Date(checkoutDate)) {
            return res.status(400).json({
                message: "Checkout date must be after check-in date.",
            });
        }

        const newVendor = new Vendor({
            name,
            email,
            status: status ?? true, 
            checkinDate,
            checkoutDate,
        });

        const savedVendor = await newVendor.save();
        return res.status(201).json({
            message: "Vendor created successfully.",
            vendor: savedVendor,
        });
    } catch (error) {
        console.error("Error creating vendor:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists.",
            });
        }
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
};




// GET API with filters
export const AllVendor = async (req, res) => {
    try {
        // Extract filters from query parameters
        const { name, email, status, checkinDate, checkoutDate } = req.query;

        // Build dynamic filter object
        const filters = {};

        if (name) filters.name = { $regex: name, $options: "i" }; // Case-insensitive regex
        if (email) filters.email = { $regex: email, $options: "i" }; // Case-insensitive regex
        if (status) filters.status = status; // Exact match for status
        if (checkinDate) filters.checkinDate = checkinDate; // Exact match for checkinDate
        if (checkoutDate) filters.checkoutDate = checkoutDate; // Exact match for checkoutDate

        // Fetch vendors from the database based on filters
        const vendors = await Vendor.find(filters);

        res.status(200).json({ message: "Vendors fetched successfully", vendors });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "Failed to fetch vendors", error: error.message });
    }
};


export const DeleteVendor=async (req,res)=>{
    try{
        const email=req.params.email;
        const vendor=await Vendor.findOneAndDelete({email});
        if(!vendor){
            return res.status(404).json({message:"Vendor not found"});
            }
            res.status(200).json({message:"Vendor deleted successfully"});
            }catch(error){
                console.error("Error deleting vendor:", error);
                res.status(500).json({message:"Failed to delete vendor",error:error.message});
                satisfies
    }
}


export const findbyemailandUpdate =async (req, res) => {
    try {
        const { email } = req.params; // Extract email from route parameters
        const updateData = req.body; // Data to update

        if (!email) {
            return res.status(400).json({ message: "Email parameter is required" });
        }

        // Find vendor by email and update their information
        const updatedVendor = await Vendor.findOneAndUpdate(
            { email }, // Find the vendor by email
            { $set: updateData }, // Update data
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json({ message: "Vendor updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ message: "Failed to update vendor", error: error.message });
    }
};




export const verifyCode = async (req, res) => {
    try {
      const { email, code } = req.body;
  

      const vendor = await Vendor.findOne({ email });
  
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      if (vendor.code !== code) {
        return res.status(400).json({ message: "Invalid code" });
      }
  
      // Clear the code once it is verified
      vendor.code = null;
  
      // Save the vendor after clearing the code
      await vendor.save();
  
      // Respond with success
      res.status(200).json({ message: "Code verified successfully", vendor: vendor });
    } catch (error) {
      console.error("Error verifying code:", error);
      res.status(500).json({ message: "Failed to verify code", error: error.message });
    }
  };
  

