/**
 * ChessMapRoutes.js
 * @description :: CRUD API routes for ChessMap
 */

const express = require('express');
const router = express.Router();
const ChessMapController = require('../../../controller/device/v1/ChessMapController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/chessmap/create').post(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.addChessMap);
router.route('/device/api/v1/chessmap/list').post(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.findAllChessMap);
router.route('/device/api/v1/chessmap/count').post(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.getChessMapCount);
router.route('/device/api/v1/chessmap/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.getChessMap);
router.route('/device/api/v1/chessmap/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.updateChessMap);    
router.route('/device/api/v1/chessmap/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.partialUpdateChessMap);
router.route('/device/api/v1/chessmap/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.softDeleteChessMap);
router.route('/device/api/v1/chessmap/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.softDeleteManyChessMap);
router.route('/device/api/v1/chessmap/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.bulkInsertChessMap);
router.route('/device/api/v1/chessmap/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.bulkUpdateChessMap);
router.route('/device/api/v1/chessmap/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.deleteChessMap);
router.route('/device/api/v1/chessmap/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,ChessMapController.deleteManyChessMap);

module.exports = router;
