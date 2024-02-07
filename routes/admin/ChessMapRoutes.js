/**
 * ChessMapRoutes.js
 * @description :: CRUD API routes for ChessMap
 */

const express = require('express');
const router = express.Router();
const ChessMapController = require('../../controller/admin/ChessMapController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/chessmap/create').post(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.addChessMap);
router.route('/admin/chessmap/list').post(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.findAllChessMap);
router.route('/admin/chessmap/count').post(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.getChessMapCount);
router.route('/admin/chessmap/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.getChessMap);
router.route('/admin/chessmap/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.updateChessMap);    
router.route('/admin/chessmap/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.partialUpdateChessMap);
router.route('/admin/chessmap/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.softDeleteChessMap);
router.route('/admin/chessmap/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.softDeleteManyChessMap);
router.route('/admin/chessmap/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.bulkInsertChessMap);
router.route('/admin/chessmap/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.bulkUpdateChessMap);
router.route('/admin/chessmap/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.deleteChessMap);
router.route('/admin/chessmap/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,ChessMapController.deleteManyChessMap);

module.exports = router;
