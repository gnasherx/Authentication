import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import constants from '../../config/constants';

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

AuthSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }

  return next();
});

AuthSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },

  authenticateUser(password) {
    return compareSync(password, this.password);
  },

  createToken() {
    return jwt.sign({ _id: this._id }, constants.jWT_SECRET );
  },

  toAuthJSON() {
    return {
      token: this.createToken(),
      ...this.toJSON(),
    };
  },

  // OVERRIDE THE toJSON METHOD FOR MAKE SURE THAT WE DON'T SEND PASSWORD.
  toJSON() {
    return {
      _id: this.id,
      username: this.username,
      email: this.email,
    };
  },
};

export default mongoose.model('Auth', AuthSchema);
