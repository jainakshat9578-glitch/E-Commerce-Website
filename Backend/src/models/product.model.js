import mongoose from "mongoose";
import priceSchema from "./price.schema.js";


const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        requried:true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price:{
        type: priceSchema,
        required: true
    },
    
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    images:[
        {
            url:{
                type:String,
                required:true,
            }
        }
    ],
    variants:[
        {
            images:[
                {
                    url:{
                        type: String,
                        required: true
                    }
                }
            ],
            stock:{
                type: Number,
                default: 0,
                min: 0
            },
            attributes:{ // kiske basis pe ye alag haii like colour size etc.
                type: Map,
                of: String
            },
            price:{
               type: priceSchema
            }
        }, 
    ]
},{timestamps:true})

const productModel = mongoose.model("product",productSchema)

export default productModel