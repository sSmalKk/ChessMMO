/**
 * WorldRoutes.js
 * @description :: CRUD API routes for World
 */

const express = require('express');
const router = express.Router();
const WorldController = require('../../../controller/device/v1/WorldController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/world/create').post(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.addWorld);
router.route('/device/api/v1/world/list').post(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.findAllWorld);
router.route('/device/api/v1/world/count').post(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.getWorldCount);
router.route('/device/api/v1/world/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.getWorld);
router.route('/device/api/v1/world/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.updateWorld);    
router.route('/device/api/v1/world/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.partialUpdateWorld);
router.route('/device/api/v1/world/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.softDeleteWorld);
router.route('/device/api/v1/world/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.softDeleteManyWorld);
router.route('/device/api/v1/world/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.bulkInsertWorld);
router.route('/device/api/v1/world/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.bulkUpdateWorld);
router.route('/device/api/v1/world/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.deleteWorld);
router.route('/device/api/v1/world/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,WorldController.deleteManyWorld);

module.exports = router;
