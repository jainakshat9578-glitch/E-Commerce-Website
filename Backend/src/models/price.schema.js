import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
     amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:["USD","INR","GBP","JPY","EUR"],
            default:"INR"
        }
},{
    _id: false,
    _v: false   // jo bhi price cretae hoga usme na id hogi na version hoga!!
})

export default priceSchema