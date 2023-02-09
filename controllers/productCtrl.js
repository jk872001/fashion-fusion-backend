const Product = require("../models/productModel");

const ErrorHandle = require("../utils/errorHandle");
const bigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary");
const APIFeatures = require("../utils/apiFeatures");

// Create new product   =>   /api/v1/admin/product/new
const newProduct = bigPromise(async (req, res, next) => {
    console.log(req.body)
    // let images = [];
    // if (typeof req.body.images === "string") {
    //     images.push(req.body.images);
    // } else {
    //     images = req.body.images;
    // }

    // let imagesLinks = [];

    // for (let i = 0; i < images.length; i++) {
    //     const result = await cloudinary.v2.uploader.upload(images[i], {
    //         folder: "shopx/products",
    //     });

    //     imagesLinks.push({
    //         public_id: result.public_id,
    //         url: result.secure_url,
    //     });
    // }

    // req.body.images = imagesLinks;
    // req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

// get all products => /api/v1/products?keyword=apple
exports.getProducts = bigPromise(async (req, res, next) => {
    const resPerPage = 12;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage);

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    // apiFeatures.pagination(resPerPage)
    // products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products,
    });
});

// get single product => api/v1/product/:id
exports.getSingleProducts = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandle("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Admin

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = bigPromise(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = bigPromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandle("Product not found", 404));
    }

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(
                product.images[i].public_id
            );
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "shopx/products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// delete product => /api/v1/admin/product/:id
exports.deleteProduct = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandle("Product not found", 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
            product.images[i].public_id
        );
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product is deleted.",
    });
});

// Create new review   =>   /api/v1/review
exports.createProductReview = bigPromise(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = bigPromise(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});

module.exports={newProduct}