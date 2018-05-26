
Joi = require('joi');
const userSchemaValidator = Joi.object().keys({
username: Joi.string().alphanum().min(5).max(30).required(),
email: Joi.string().email().required(),
firstName : Joi.string().alphanum().required(),
lastName : Joi.string().alphanum().required(),
password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
language:{
any:{
  allowOnly: 'The password you entered don\'t match.',
  }
 }
})
})

module.exports = userSchemaValidator;
