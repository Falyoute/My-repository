const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require ('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Veuillez saisir un email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Veuillez saisir un email valide']
  },
  password: {
    type: String,
    required: [true, 'Veuillez saisir un mot de passe.'],
    minlength: [6, 'Le mot de passe doit comprendre un minimum de 6 lettres.']
  }
});

//déclencher une fonction avant que le document ne soit enregistré dans la base de données
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  next();
});

//Fonction statique pour loguer l'utilisateur
userSchema.statics.login = async function (email, password){
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth){
      return user;
    }
    throw Error('mot de passe incorrect');
  }
  throw Error('email incorrect');
}


module.exports = mongoose.model('User', userSchema);