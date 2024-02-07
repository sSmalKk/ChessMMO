/**
 * pieceController.js
 * @description : exports action methods for piece.
 */

const Piece = require('../../model/piece');
const pieceSchemaKey = require('../../utils/validation/pieceValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Piece in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Piece. {status, message, data}
 */ 
const addPiece = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      pieceSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Piece(dataToCreate);
    let createdPiece = await dbService.create(Piece,dataToCreate);
    return res.success({ data : createdPiece });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Piece in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Pieces. {status, message, data}
 */
const bulkInsertPiece = async (req,res)=>{
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
    let createdPieces = await dbService.create(Piece,dataToCreate);
    createdPieces = { count: createdPieces ? createdPieces.length : 0 };
    return res.success({ data:{ count:createdPieces.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Piece from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Piece(s). {status, message, data}
 */
const findAllPiece = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      pieceSchemaKey.findFilterKeys,
      Piece.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Piece, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundPieces = await dbService.paginate( Piece,query,options);
    if (!foundPieces || !foundPieces.data || !foundPieces.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundPieces });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Piece from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Piece. {status, message, data}
 */
const getPiece = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundPiece = await dbService.findOne(Piece,query, options);
    if (!foundPiece){
      return res.recordNotFound();
    }
    return res.success({ data :foundPiece });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Piece.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getPieceCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      pieceSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedPiece = await dbService.count(Piece,where);
    return res.success({ data : { count: countedPiece } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Piece with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Piece.
 * @return {Object} : updated Piece. {status, message, data}
 */
const updatePiece = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      pieceSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPiece = await dbService.updateOne(Piece,query,dataToUpdate);
    if (!updatedPiece){
      return res.recordNotFound();
    }
    return res.success({ data :updatedPiece });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Piece with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Pieces.
 * @return {Object} : updated Pieces. {status, message, data}
 */
const bulkUpdatePiece = async (req,res)=>{
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
    let updatedPiece = await dbService.updateMany(Piece,filter,dataToUpdate);
    if (!updatedPiece){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedPiece } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Piece with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Piece.
 * @return {obj} : updated Piece. {status, message, data}
 */
const partialUpdatePiece = async (req,res) => {
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
      pieceSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPiece = await dbService.updateOne(Piece, query, dataToUpdate);
    if (!updatedPiece) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedPiece });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Piece from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Piece.
 * @return {Object} : deactivated Piece. {status, message, data}
 */
const softDeletePiece = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedPiece = await dbService.updateOne(Piece, query, updateBody);
    if (!updatedPiece){
      return res.recordNotFound();
    }
    return res.success({ data:updatedPiece });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Piece from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Piece. {status, message, data}
 */
const deletePiece = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedPiece = await dbService.deleteOne(Piece, query);
    if (!deletedPiece){
      return res.recordNotFound();
    }
    return res.success({ data :deletedPiece });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Piece in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyPiece = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedPiece = await dbService.deleteMany(Piece,query);
    if (!deletedPiece){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedPiece } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Piece from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Piece.
 * @return {Object} : number of deactivated documents of Piece. {status, message, data}
 */
const softDeleteManyPiece = async (req,res) => {
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
    let updatedPiece = await dbService.updateMany(Piece,query, updateBody);
    if (!updatedPiece) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedPiece } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addPiece,
  bulkInsertPiece,
  findAllPiece,
  getPiece,
  getPieceCount,
  updatePiece,
  bulkUpdatePiece,
  partialUpdatePiece,
  softDeletePiece,
  deletePiece,
  deleteManyPiece,
  softDeleteManyPiece    
};