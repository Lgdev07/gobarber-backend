import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const userService = new CreateUserService();

  const user = await userService.execute({ name, email, password });

  delete user.password;

  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateAvatarService = new UpdateUserAvatarService();

    const user = await updateAvatarService.execute({
      user_id: req.user.id,
      filename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  }
);

export default usersRouter;
