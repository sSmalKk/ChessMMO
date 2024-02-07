/**
 * ChessMapValidation.js
 * @description :: validate each post and put request as per ChessMap model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of ChessMap */
exports.schemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean().required(),
  Location: joi.number().integer().required(),
  x: joi.number().integer().max(9).allow(0),
  y: joi.number().integer().max(9).allow(0)
}).unknown(true);

/** validation keys and properties of ChessMap for updation */
exports.updateSchemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  Location: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  x: joi.number().integer().max(9).allow(0),
  y: joi.number().integer().max(9).allow(0),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of ChessMap for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      Location: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      x: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      y: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
