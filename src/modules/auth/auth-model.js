import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const AuthSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate: {
      validator(email) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
      },
      message: '{VALUE} is not a valid email!',
    }, 
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator(password) {
        return password.length >= 6;
      },
      message: 'Not a valid password!',
    }, 
  },
  username: String,
});

AuthSchema.plugin(uniqueValidator, {
  message: '{VALUE} is already taken!',
});

export default mongoose.model('Auth', AuthSchema);
