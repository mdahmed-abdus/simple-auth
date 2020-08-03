const Joi = require('@hapi/joi');
const { BCRYPT_MAX_BYTES } = require('../config/bcrypt');

const name = Joi.string().min(3).max(128).trim().required();
const email = Joi.string().email().min(8).max(254).trim().required();
const password = Joi.string()
  .min(8)
  .max(BCRYPT_MAX_BYTES, 'utf8')
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
  .message('Password must contain: 1 uppercase, 1 lowercase, 1 digit')
  .required();
const confirmPassword = Joi.valid(Joi.ref('password')).required();

const registerSchema = Joi.object({ name, email, password, confirmPassword });
const loginSchema = Joi.object({ email, password });

module.exports = { registerSchema, loginSchema };
