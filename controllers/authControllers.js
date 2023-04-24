const User = require('../Models/User');
const jwt = require('jsonwebtoken');

//Gérer les erreurs
const handleError = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: ''};

    //Email inccorect 
    if (err.message ==='email incorrect') {
        errors.email = 'Email n\'est pas enregistré '
    }

     //Mot de passe inccorect 
     if (err.message ==='mot de passe incorrect') {
        errors.email = 'Mot de passe est inccorect '
    }

    //unicité
    if (err.code === 11000){
        errors.email = 'utilisateur déjà existant';
        return errors;
    }

    //validation
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//Création des JWT
const maxAge = 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'secret',{
        expiresIn: maxAge
    });
}

//Traiter la route /registe 
module.exports.register_get = (req, res) => {
    res.send('vous êtes sur la page d\'inscription');
}

module.exports.register_post = async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge * 1000});
        res.status(201).json({ user : user._id });
    }
    catch (err){
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}

//Traiter la route /login
module.exports.login_get = (req, res) => {
    
    res.send('vous êtes sur la page d\'authentification');
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge * 1000});
        res.status(200).send('Utilisateur logué avec token')
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}

//Traiter la route /users
module.exports.getUsers = async (req, res) => {
        
    try{
        // Récupérer tous les utilisateurs
        const users = await User.find({});
        const userEmails = users.map(user => user.email);
        console.log(users);
        res.status(200).json({userEmails});
    }
    catch (err){
        res.status(400).json({err});
    }       
}