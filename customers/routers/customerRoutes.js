const express = require('express')
const router = express.Router();
const CustomerController = require ('../controllers/customerController.js')

router.post('/customer', CustomerController.createCustomer);
router.get('/customers', CustomerController.getAllCustomers);
router.get('/customer:id', CustomerController.findOne);
router.put('/customer/:id', CustomerController.updateCustomer);
router.delete('/customer/:id', CustomerController.deleteCustomer);

module.exports = router;