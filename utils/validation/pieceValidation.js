/**
 * pieceValidation.js
 * @description :: validate each post and put request as per piece model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of piece */
exports.schemaKeys = joi.object({
  Location: joi.number().integer().required(),
  xinner: joi.number().integer().required(),
  yinner: joi.number().integer().required(),
  Table: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  Type: joi.string().allow(null).allow(''),
  Owner: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Hold: joi.string().allow(null).allow(''),
  x: joi.number().integer().allow(0),
  y: joi.number().integer().allow(0)
}).unknown(true);

/** validation keys and properties of piece for updation */
exports.updateSchemaKeys = joi.object({
  Location: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  xinner: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  yinner: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  Table: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  Type: joi.string().allow(null).allow(''),
  Owner: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  Hold: joi.string().allow(null).allow(''),
  x: joi.number().integer().allow(0),
  y: joi.number().integer().allow(0),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of piece for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      Location: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      xinner: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      yinner: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      Table: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      Type: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      Owner: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      Hold: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
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
