/**
 * pieceRoutes.js
 * @description :: CRUD API routes for piece
 */

const express = require('express');
const router = express.Router();
const pieceController = require('../../../controller/device/v1/pieceController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/piece/create').post(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.addPiece);
router.route('/device/api/v1/piece/list').post(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.findAllPiece);
router.route('/device/api/v1/piece/count').post(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.getPieceCount);
router.route('/device/api/v1/piece/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.getPiece);
router.route('/device/api/v1/piece/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.updatePiece);    
router.route('/device/api/v1/piece/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.partialUpdatePiece);
router.route('/device/api/v1/piece/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.softDeletePiece);
router.route('/device/api/v1/piece/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.softDeleteManyPiece);
router.route('/device/api/v1/piece/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.bulkInsertPiece);
router.route('/device/api/v1/piece/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.bulkUpdatePiece);
router.route('/device/api/v1/piece/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.deletePiece);
router.route('/device/api/v1/piece/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,pieceController.deleteManyPiece);

module.exports = router;
