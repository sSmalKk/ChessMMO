/**
 * pieceRoutes.js
 * @description :: CRUD API routes for piece
 */

const express = require('express');
const router = express.Router();
const pieceController = require('../../controller/admin/pieceController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/piece/create').post(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.addPiece);
router.route('/admin/piece/list').post(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.findAllPiece);
router.route('/admin/piece/count').post(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.getPieceCount);
router.route('/admin/piece/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.getPiece);
router.route('/admin/piece/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.updatePiece);    
router.route('/admin/piece/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.partialUpdatePiece);
router.route('/admin/piece/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.softDeletePiece);
router.route('/admin/piece/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.softDeleteManyPiece);
router.route('/admin/piece/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.bulkInsertPiece);
router.route('/admin/piece/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.bulkUpdatePiece);
router.route('/admin/piece/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.deletePiece);
router.route('/admin/piece/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,pieceController.deleteManyPiece);

module.exports = router;
