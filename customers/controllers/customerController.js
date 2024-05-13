const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
    try {
        const newCustomerData = req.body;
        const newCustomer = new Customer(newCustomerData);
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du nouveau client.' });
    }
  };

exports.getAllCustomers = async(req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des clients depuis la base de données.' });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des clients depuis la base de données.' });
    }
};

exports.deleteCustomer = async(req, res) =>{
    try {
        const deletedCustomer = await Customer.findOneAndDelete({ id: req.params.id });
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Client non trouvé.' });
        }
        res.json({ message: 'Client supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du client.' });
    }
};