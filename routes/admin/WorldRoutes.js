/**
 * WorldRoutes.js
 * @description :: CRUD API routes for World
 */

const express = require('express');
const router = express.Router();
const WorldController = require('../../controller/admin/WorldController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/world/create').post(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.addWorld);
router.route('/admin/world/list').post(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.findAllWorld);
router.route('/admin/world/count').post(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.getWorldCount);
router.route('/admin/world/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.getWorld);
router.route('/admin/world/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.updateWorld);    
router.route('/admin/world/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.partialUpdateWorld);
router.route('/admin/world/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.softDeleteWorld);
router.route('/admin/world/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.softDeleteManyWorld);
router.route('/admin/world/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.bulkInsertWorld);
router.route('/admin/world/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.bulkUpdateWorld);
router.route('/admin/world/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.deleteWorld);
router.route('/admin/world/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,WorldController.deleteManyWorld);

module.exports = router;
