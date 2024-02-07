/**
 * WorldValidation.js
 * @description :: validate each post and put request as per World model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of World */
exports.schemaKeys = joi.object({
  Name: joi.string().allow(null).allow(''),
  Language: joi.string().allow(null).allow(''),
  Location: joi.string().allow(null).allow(''),
  Chunks: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of World for updation */
exports.updateSchemaKeys = joi.object({
  Name: joi.string().allow(null).allow(''),
  Language: joi.string().allow(null).allow(''),
  Location: joi.string().allow(null).allow(''),
  Chunks: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of World for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      Name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      Language: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      Location: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      Chunks: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
