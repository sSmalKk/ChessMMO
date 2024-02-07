/**
 * ChessMapController.js
 * @description : exports action methods for ChessMap.
 */

const ChessMap = require('../../model/ChessMap');
const ChessMapSchemaKey = require('../../utils/validation/ChessMapValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of ChessMap in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created ChessMap. {status, message, data}
 */ 
const addChessMap = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      ChessMapSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new ChessMap(dataToCreate);

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(ChessMap,[ 'Location' ],dataToCreate,'INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdChessMap = await dbService.create(ChessMap,dataToCreate);
    return res.success({ data : createdChessMap });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of ChessMap in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created ChessMaps. {status, message, data}
 */
const bulkInsertChessMap = async (req,res)=>{
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

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(ChessMap,[ 'Location' ],dataToCreate,'BULK_INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdChessMaps = await dbService.create(ChessMap,dataToCreate);
    createdChessMaps = { count: createdChessMaps ? createdChessMaps.length : 0 };
    return res.success({ data:{ count:createdChessMaps.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of ChessMap from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found ChessMap(s). {status, message, data}
 */
const findAllChessMap = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ChessMapSchemaKey.findFilterKeys,
      ChessMap.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(ChessMap, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundChessMaps = await dbService.paginate( ChessMap,query,options);
    if (!foundChessMaps || !foundChessMaps.data || !foundChessMaps.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundChessMaps });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of ChessMap from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found ChessMap. {status, message, data}
 */
const getChessMap = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundChessMap = await dbService.findOne(ChessMap,query, options);
    if (!foundChessMap){
      return res.recordNotFound();
    }
    return res.success({ data :foundChessMap });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of ChessMap.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getChessMapCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ChessMapSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedChessMap = await dbService.count(ChessMap,where);
    return res.success({ data : { count: countedChessMap } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of ChessMap with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated ChessMap.
 * @return {Object} : updated ChessMap. {status, message, data}
 */
const updateChessMap = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ChessMapSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(ChessMap,[ 'Location' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedChessMap = await dbService.updateOne(ChessMap,query,dataToUpdate);
    if (!updatedChessMap){
      return res.recordNotFound();
    }
    return res.success({ data :updatedChessMap });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of ChessMap with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated ChessMaps.
 * @return {Object} : updated ChessMaps. {status, message, data}
 */
const bulkUpdateChessMap = async (req,res)=>{
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

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(ChessMap,[ 'Location' ],dataToUpdate,'BULK_UPDATE', filter);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedChessMap = await dbService.updateMany(ChessMap,filter,dataToUpdate);
    if (!updatedChessMap){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedChessMap } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of ChessMap with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ChessMap.
 * @return {obj} : updated ChessMap. {status, message, data}
 */
const partialUpdateChessMap = async (req,res) => {
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
      ChessMapSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(ChessMap,[ 'Location' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedChessMap = await dbService.updateOne(ChessMap, query, dataToUpdate);
    if (!updatedChessMap) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedChessMap });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of ChessMap from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of ChessMap.
 * @return {Object} : deactivated ChessMap. {status, message, data}
 */
const softDeleteChessMap = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedChessMap = await deleteDependentService.softDeleteChessMap(query, updateBody);
    if (!updatedChessMap){
      return res.recordNotFound();
    }
    return res.success({ data:updatedChessMap });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of ChessMap from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted ChessMap. {status, message, data}
 */
const deleteChessMap = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedChessMap;
    if (req.body.isWarning) { 
      deletedChessMap = await deleteDependentService.countChessMap(query);
    } else {
      deletedChessMap = await deleteDependentService.deleteChessMap(query);
    }
    if (!deletedChessMap){
      return res.recordNotFound();
    }
    return res.success({ data :deletedChessMap });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of ChessMap in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyChessMap = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedChessMap;
    if (req.body.isWarning) {
      deletedChessMap = await deleteDependentService.countChessMap(query);
    }
    else {
      deletedChessMap = await deleteDependentService.deleteChessMap(query);
    }
    if (!deletedChessMap){
      return res.recordNotFound();
    }
    return res.success({ data :deletedChessMap });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of ChessMap from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of ChessMap.
 * @return {Object} : number of deactivated documents of ChessMap. {status, message, data}
 */
const softDeleteManyChessMap = async (req,res) => {
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
    let updatedChessMap = await deleteDependentService.softDeleteChessMap(query, updateBody);
    if (!updatedChessMap) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedChessMap });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addChessMap,
  bulkInsertChessMap,
  findAllChessMap,
  getChessMap,
  getChessMapCount,
  updateChessMap,
  bulkUpdateChessMap,
  partialUpdateChessMap,
  softDeleteChessMap,
  deleteChessMap,
  deleteManyChessMap,
  softDeleteManyChessMap    
};