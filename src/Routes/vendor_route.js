import express from 'express';
const router = express.Router();


import { createVendor,AllVendor,DeleteVendor,findbyemailandUpdate ,verifyCode} from '../controller/vendor_controller.js';
import {sendCode} from '../controller/send_email.js'

// Create new vendor
router.route('/Vendors').post(createVendor);

// get all vendor with filters 
router.route('/Vendors').get(AllVendor);

//  delete user using email
router.route('/Vendors/:email').delete(DeleteVendor);


//  update user using email
router.route('/Vendors/:email').put(findbyemailandUpdate);


//  Verify otp 

router.route('/Verify').put(verifyCode);



// send otp to email
router.route('/Sendotp').post(sendCode);


export default router;
