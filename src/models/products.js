import mongoose from 'mongoose'


//TODO: Add a field for stock and availability
const ProductSchema = new mongoose.Schema(
  {
    name:{ 
        type: String, 
        required: true 
    },
    category:{ 
        type: String, 
        required: true, 
        enum: ["Men", "Women"]
    },
    imageUrl:{ 
        type: String, 
        required: true 
    },
    outfitUrl: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    originalPrice: { 
        type: Number 
    },
    rating: { 
        type: Number, 
        default: 4.5 
    },
    reviews: { 
        type: Number, 
        default: 0 
    },
    description: { 
        type: String 
    },
    isLatest: { 
        type: Boolean, 
        default: true 
    },
    badge: { 
        type: String 
    },
  },
  { timestamps: true}
);

export const Products = mongoose.model("Products", ProductSchema);