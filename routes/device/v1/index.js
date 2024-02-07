/**
 * index.js
 * @description :: index route file of device platform.
 */

const express =  require('express');
const router =  express.Router();
router.use('/device/auth',require('./auth'));
router.use(require('./WorldRoutes'));
router.use(require('./Chat_groupRoutes'));
router.use(require('./Chat_messageRoutes'));
router.use(require('./pieceRoutes'));
router.use(require('./ChessMapRoutes'));
router.use(require('./userRoutes'));
router.use(require('./uploadRoutes'));

module.exports = router;
