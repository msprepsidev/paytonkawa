const mongoose = require('mongoose') 

const customerSchema = new mongoose.Schema({

    name: {
        type: String,  
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone:{
        type: Number,
    },
    address: {
        postalCode: {
        type: Number,
        },
        city: {
            type: String,
        },
        street: {
            type: String,
        },
    },
    company: {
        type: Boolean,
        required: true
    },
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;