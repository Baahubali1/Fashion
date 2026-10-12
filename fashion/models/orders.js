import mongoose from "mongoose";

//Here ref is used to create a reference to the User and Product Schema respectively
//Here ObjectID is used to refer to the object's id in order to retrieve from the concerned schema 
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        price: {
            type: Number,
            required: true
        }
    }],

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    }
}, {
    timestamps: true
});

export const Orders = mongoose.model("Orders", orderSchema);