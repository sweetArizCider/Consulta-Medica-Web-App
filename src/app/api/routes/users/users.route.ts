import Router, { Request, Response } from 'express'
import { createUser, loginUser} from '@expressControllers/users/users.controller';
import {DEFAULT_INTERNAL_ERROR, NO_USER_PAYLOAD} from '@app/api/constants/errors/errors.constant';
import {authMiddleware} from '@expressMiddleware/auth/auth.middleware';

const router = Router()

router.post('/register', async (req : Request, res : Response) : Promise<void> => {
  const userPayload = req.body


  if( !userPayload ) {
    res.status(400).json({ error: NO_USER_PAYLOAD });
    return;
  }

  try {
    const newUser = await createUser(userPayload);
    if (newUser instanceof Error) {
      res.status(403).json({ error: newUser.message });
      return;
    }

    res.status(201).json(newUser);
    return
  }catch(err){
    console.error('Error creating user:', err);
    res.status(500).json({ error: DEFAULT_INTERNAL_ERROR });
    return;
  }
})

router.post('/login', async (req: Request, res : Response) : Promise<void> => {
  const userLoginPayload = req.body
  if( !userLoginPayload ) {
    res.status(400).json({ error: NO_USER_PAYLOAD });
    return;
  }

  try{
    const result = await loginUser(userLoginPayload);
    if (result instanceof Error) {
      res.status(401).json({error: result.message});
      return;
    }
    const { user, token } = result;
    res.status(200).json({ user, token });
    return;
  }catch(err){
    res.status(500).json({ error: DEFAULT_INTERNAL_ERROR });
    return;
  }
})

router.options('/health',authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is healthy' });
})

export default router;

