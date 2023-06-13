const router = require('express').Router();
const {
  validateUserId,
  validateUserInfo,
  validateUserAvatar,
} = require('../middlewares/validators');
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
