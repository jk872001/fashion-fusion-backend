const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [5, "Product name cannot exceed 5 characters"],
        default: 0.0,
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: false,
            },
            url: {
                type: String,
                required: false,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please select category for this product"],
        enum: {
            values: [
                "Eid Collection",
                "New Collection",
                "Featured",
                "Footwear",
                "Accessories",
                "Clothing",
                "Beauty/Health",
                "Sports",
                "Outdoor",
                "Other",
            ],
            message: "Please select correct category for product",
        },
    },
    type: {
        type: String,
        required: [false, "Please select type for this product"],
    },
    seller: {
        type: String,
        required: [false, "Please enter product seller"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [5, "Product name cannot exceed 5 characters"],
        default: 10,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            rating: {
                type: Number,
                required: false,
            },
            comment: {
                type: String,
                required: false,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema)
