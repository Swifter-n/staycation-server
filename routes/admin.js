const router = require('express').Router();
const { deleteItem } = require('../controllers/adminController');
const adminController = require('../controllers/adminController');
const {uploadSingle, uploadMultiple} = require('../middlewares/multer');
const auth = require('../middlewares/auth');

router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth);
router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDashboard);
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.AddCategory);
router.put('/category', adminController.EditCategory);
router.delete('/category/:id', adminController.DeleteCategory);
router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingle, adminController.AddBank);
router.put('/bank', uploadSingle, adminController.EditBank);
router.delete('/bank/:id', adminController.DeleteBank);
router.get('/item', adminController.viewItem);
router.get('/item/show-image/:id', adminController.showImage);
router.post('/item', uploadMultiple, adminController.addItem);
router.put('/item/:id', uploadMultiple, adminController.editItem);
router.get('/item/:id', adminController.showEditItem);
router.delete('/item/:id/delete', adminController.deleteItem);
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', uploadSingle, adminController.AddFeature);
router.put('/item/update/feature', uploadSingle, adminController.EditFeature);
router.delete('/item/:itemId/feature/:id', adminController.DeleteFeature);
router.post('/item/add/activity', uploadSingle, adminController.AddActivity);
router.put('/item/update/activity', uploadSingle, adminController.EditActivity);
router.delete('/item/:itemId/activity/:id', adminController.DeleteActivity);
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);    ``

module.exports = router;