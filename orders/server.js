import express from 'express';
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import axios from 'axios';
import { Order } from './model/Order.js';

const app = express();
const port = 5002;

const url = 'mongodb+srv://papa:passer123@cluster0.1qaei.mongodb.net/orders?retryWrites=true&w=majority&appName=Cluster0';

let authToken = null;

// Parser le corps des requêtes au format JSON
app.use(bodyParser.json());

function connect(){
    try{
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to the database');
    }
    catch(err){
        console.log(err);
    }
}
connect();

//génération du token qui est en fait le rôle de l'utilisateur connecté
function generateToken() {
    const roles = ['developer', 'commercial', 'marketing', 'management'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    return randomRole;
}

// Ajout du token à la réponse HTTP lors de l'authentification
function addTokenToResponse(req, res, next) {
    authToken = generateToken();
    res.setHeader('Authorization', authToken);
    next();
}

// Vérifier si un token a été généré et l'utiliser pour autoriser l'accès à la route /products
function checkAuthToken(req, res, next) {
    if (!authToken) {
        return res.status(401).json({ message: 'Accès non autorisé. Jeton manquant.' });
    }

    const role = authToken;

    if (!role || !['developer', 'commercial', 'marketing', 'management'].includes(role)) {
        return res.status(403).json({ message: 'Accès non autorisé. Rôle invalide.' });
    }

    req.user = { role };
    next();
}

// Route pour contacter la route et obtenir un token avec un rôle aléatoire
app.get('/authenticate', addTokenToResponse, (req, res) => {
    res.json({ message: 'Token généré avec succès.' });
});

/* ===================================== Routes avec les autorisations d'accès ===================================*/

//Route pour récupérer les commandes.
app.get('/orders', checkAuthToken, async (req, res) => {
    const userRole = req.user.role;
    if (userRole === 'developer' || userRole === 'commercial' || userRole === 'marketing' || userRole === 'management') {
        try {
            const orders = await Order.find();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des commandes depuis la base de données.' });
        }
    } else {
        res.status(403).json({ message: 'Accès non autorisé. Rôle non autorisé.' });
    }
});

// Route pour récupérer les informations d'un produit spécifique
app.get('/orders/:id', checkAuthToken, async (req, res) => {
    const userRole = req.user.role;
    if (userRole === 'developer' || userRole === 'marketing' || userRole === 'commercial' || userRole === 'management') {
        try {
            const order = await Order.findOne({ id: req.params.id });
            if (!orders) {
                return res.status(404).json({ message: 'Commande non trouvé.' });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des informations de la commande.' });
        }
    } else {
        res.status(403).json({ message: 'Accès non autorisé. Rôle non autorisé.' });
    }
});

// Route pour mettre à jour les informations d'un produit spécifique
app.put('/order/:id', checkAuthToken, async (req, res) => {
    const userRole = req.user.role;
    if (userRole === 'developer' || userRole === 'marketing' || userRole === 'commercial' || userRole === 'management') {
        try {
            const updatedOrderData = req.body;
            const updatedOrder = await Order.findOneAndUpdate({ id: req.params.id }, updatedOrderData, { new: true });
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Commande non trouvé.' });
            }
            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour des informations de la commande.' });
        }
    } else {
        res.status(403).json({ message: 'Accès non autorisé. Rôle non autorisé.' });
    }
});

// Route pour créer un nouveau produit
app.post('/orders', checkAuthToken, async (req, res) => {
    const userRole = req.user.role;
    if (userRole === 'marketing') {
        try {
            const newOrderData = req.body;
            const newOrder = new Product(newOrderData);
            await newOrder.save();
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création de la nouvelle commande.' });
        }
    } else {
        res.status(403).json({ message: 'Accès non autorisé. Seuls les membres du service marketing sont autorisés à créer de nouvelles commandes.' });
    }
});

// Route pour supprimer un produit existant
app.delete('/orders/:id', checkAuthToken, async (req, res) => {
    const userRole = req.user.role;
    if (userRole === 'marketing') {
        try {
            const deletedOrder = await Order.findOneAndDelete({ id: req.params.id });
            if (!deletedOrder) {
                return res.status(404).json({ message: 'Commande non trouvée.' });
            }
            res.json({ message: 'Commande supprimée avec succès.' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de la commande.' });
        }
    } else {
        res.status(403).json({ message: 'Accès non autorisé. Seuls les membres du service marketing sont autorisés à supprimer des commandes.' });
    }
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));