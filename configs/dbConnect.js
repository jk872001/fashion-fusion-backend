const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose
        .connect("mongodb+srv://jitesh123:jitesh123@cluster0.xemvdr7.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((con) => {
            console.log(
                `MongoDB Database connected with HOST`
            );
        });
};

module.exports = dbConnect;
