/**
 * WorldController.js
 * @description : exports action methods for World.
 */

const World = require('../../../model/World');
const WorldSchemaKey = require('../../../utils/validation/WorldValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of World in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created World. {status, message, data}
 */ 
const addWorld = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      WorldSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new World(dataToCreate);
    let createdWorld = await dbService.create(World,dataToCreate);
    return res.success({ data : createdWorld });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of World in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Worlds. {status, message, data}
 */
const bulkInsertWorld = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdWorlds = await dbService.create(World,dataToCreate);
    createdWorlds = { count: createdWorlds ? createdWorlds.length : 0 };
    return res.success({ data:{ count:createdWorlds.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of World from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found World(s). {status, message, data}
 */
const findAllWorld = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      WorldSchemaKey.findFilterKeys,
      World.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(World, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundWorlds = await dbService.paginate( World,query,options);
    if (!foundWorlds || !foundWorlds.data || !foundWorlds.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundWorlds });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of World from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found World. {status, message, data}
 */
const getWorld = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundWorld = await dbService.findOne(World,query, options);
    if (!foundWorld){
      return res.recordNotFound();
    }
    return res.success({ data :foundWorld });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of World.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getWorldCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      WorldSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedWorld = await dbService.count(World,where);
    return res.success({ data : { count: countedWorld } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of World with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated World.
 * @return {Object} : updated World. {status, message, data}
 */
const updateWorld = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      WorldSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedWorld = await dbService.updateOne(World,query,dataToUpdate);
    if (!updatedWorld){
      return res.recordNotFound();
    }
    return res.success({ data :updatedWorld });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of World with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Worlds.
 * @return {Object} : updated Worlds. {status, message, data}
 */
const bulkUpdateWorld = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate['addedBy'];
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...req.body.data,
        updatedBy : req.user.id
      };
    }
    let updatedWorld = await dbService.updateMany(World,filter,dataToUpdate);
    if (!updatedWorld){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedWorld } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of World with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated World.
 * @return {obj} : updated World. {status, message, data}
 */
const partialUpdateWorld = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      WorldSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedWorld = await dbService.updateOne(World, query, dataToUpdate);
    if (!updatedWorld) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedWorld });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of World from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of World.
 * @return {Object} : deactivated World. {status, message, data}
 */
const softDeleteWorld = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedWorld = await dbService.updateOne(World, query, updateBody);
    if (!updatedWorld){
      return res.recordNotFound();
    }
    return res.success({ data:updatedWorld });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of World from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted World. {status, message, data}
 */
const deleteWorld = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedWorld = await dbService.deleteOne(World, query);
    if (!deletedWorld){
      return res.recordNotFound();
    }
    return res.success({ data :deletedWorld });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of World in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyWorld = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedWorld = await dbService.deleteMany(World,query);
    if (!deletedWorld){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedWorld } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of World from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of World.
 * @return {Object} : number of deactivated documents of World. {status, message, data}
 */
const softDeleteManyWorld = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedWorld = await dbService.updateMany(World,query, updateBody);
    if (!updatedWorld) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedWorld } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addWorld,
  bulkInsertWorld,
  findAllWorld,
  getWorld,
  getWorldCount,
  updateWorld,
  bulkUpdateWorld,
  partialUpdateWorld,
  softDeleteWorld,
  deleteWorld,
  deleteManyWorld,
  softDeleteManyWorld    
};