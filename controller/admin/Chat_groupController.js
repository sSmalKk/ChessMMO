/**
 * Chat_groupController.js
 * @description : exports action methods for Chat_group.
 */

const Chat_group = require('../../model/Chat_group');
const Chat_groupSchemaKey = require('../../utils/validation/Chat_groupValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Chat_group in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Chat_group. {status, message, data}
 */ 
const addChat_group = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Chat_groupSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Chat_group(dataToCreate);
    let createdChat_group = await dbService.create(Chat_group,dataToCreate);
    return res.success({ data : createdChat_group });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Chat_group in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Chat_groups. {status, message, data}
 */
const bulkInsertChat_group = async (req,res)=>{
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
    let createdChat_groups = await dbService.create(Chat_group,dataToCreate);
    createdChat_groups = { count: createdChat_groups ? createdChat_groups.length : 0 };
    return res.success({ data:{ count:createdChat_groups.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Chat_group from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Chat_group(s). {status, message, data}
 */
const findAllChat_group = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Chat_groupSchemaKey.findFilterKeys,
      Chat_group.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Chat_group, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundChat_groups = await dbService.paginate( Chat_group,query,options);
    if (!foundChat_groups || !foundChat_groups.data || !foundChat_groups.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundChat_groups });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Chat_group from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Chat_group. {status, message, data}
 */
const getChat_group = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundChat_group = await dbService.findOne(Chat_group,query, options);
    if (!foundChat_group){
      return res.recordNotFound();
    }
    return res.success({ data :foundChat_group });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Chat_group.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getChat_groupCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Chat_groupSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedChat_group = await dbService.count(Chat_group,where);
    return res.success({ data : { count: countedChat_group } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Chat_group with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_group.
 * @return {Object} : updated Chat_group. {status, message, data}
 */
const updateChat_group = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Chat_groupSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedChat_group = await dbService.updateOne(Chat_group,query,dataToUpdate);
    if (!updatedChat_group){
      return res.recordNotFound();
    }
    return res.success({ data :updatedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Chat_group with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Chat_groups.
 * @return {Object} : updated Chat_groups. {status, message, data}
 */
const bulkUpdateChat_group = async (req,res)=>{
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
    let updatedChat_group = await dbService.updateMany(Chat_group,filter,dataToUpdate);
    if (!updatedChat_group){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedChat_group } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Chat_group with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Chat_group.
 * @return {obj} : updated Chat_group. {status, message, data}
 */
const partialUpdateChat_group = async (req,res) => {
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
      Chat_groupSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedChat_group = await dbService.updateOne(Chat_group, query, dataToUpdate);
    if (!updatedChat_group) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Chat_group from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Chat_group.
 * @return {Object} : deactivated Chat_group. {status, message, data}
 */
const softDeleteChat_group = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedChat_group = await deleteDependentService.softDeleteChat_group(query, updateBody);
    if (!updatedChat_group){
      return res.recordNotFound();
    }
    return res.success({ data:updatedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Chat_group from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Chat_group. {status, message, data}
 */
const deleteChat_group = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedChat_group;
    if (req.body.isWarning) { 
      deletedChat_group = await deleteDependentService.countChat_group(query);
    } else {
      deletedChat_group = await deleteDependentService.deleteChat_group(query);
    }
    if (!deletedChat_group){
      return res.recordNotFound();
    }
    return res.success({ data :deletedChat_group });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Chat_group in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyChat_group = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedChat_group;
    if (req.body.isWarning) {
      deletedChat_group = await deleteDependentService.countChat_group(query);
    }
    else {
      deletedChat_group = await deleteDependentService.deleteChat_group(query);
    }
    if (!deletedChat_group){
      return res.recordNotFound();
    }
    return res.success({ data :deletedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Chat_group from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Chat_group.
 * @return {Object} : number of deactivated documents of Chat_group. {status, message, data}
 */
const softDeleteManyChat_group = async (req,res) => {
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
    let updatedChat_group = await deleteDependentService.softDeleteChat_group(query, updateBody);
    if (!updatedChat_group) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addChat_group,
  bulkInsertChat_group,
  findAllChat_group,
  getChat_group,
  getChat_groupCount,
  updateChat_group,
  bulkUpdateChat_group,
  partialUpdateChat_group,
  softDeleteChat_group,
  deleteChat_group,
  deleteManyChat_group,
  softDeleteManyChat_group    
};