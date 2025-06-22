import Router, { Request, Response } from 'express'
import {
  BAD_REQUEST,
  CLIENT_NOT_FOUND,
  DEFAULT_INTERNAL_ERROR,
  NO_USER_PAYLOAD,
  SERVER_ERROR
} from '@app/api/constants/errors/errors.constant';
import { createClient, getClientById, updateClient, getAllClients } from '@expressControllers/clients/clients.controller';

const router = Router()

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const clientPayload = req.body

  if (!clientPayload) {
    res.status(400).json({ error: NO_USER_PAYLOAD });
    return;
  }

  try {
    const newClient = await createClient(clientPayload);
    if (newClient instanceof Error) {
      res.status(403).json({ error: newClient.message });
      return;
    }

    res.status(201).json(newClient);
    return
  } catch (err) {
    console.error(SERVER_ERROR(err));
    res.status(500).json({ error: DEFAULT_INTERNAL_ERROR });
    return;
  }
})

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;

  const isValidId = (typeof id === 'string' && !isNaN(parseInt(id, 10)));

  if (id && !isValidId) {
    res.status(400).json({ error: BAD_REQUEST });
    return;
  }

  if (id && isValidId) {
    const clientId = parseInt(id, 10);
    try {
      const client = await getClientById(clientId);
      if (client instanceof Error) {
        res.status(404).json({ error: CLIENT_NOT_FOUND(clientId) });
        return;
      }
      res.status(200).json(client);
      return;
    } catch (err) {
      console.error(SERVER_ERROR(err));
      res.status(500).json({ error: DEFAULT_INTERNAL_ERROR });
      return;
    }
  }

  try {
    const clients = await getAllClients();
    if (clients instanceof Error) {
      res.status(500).json({ error: clients.message });
      return;
    }
    res.status(200).json(clients);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    res.status(500).json({ error: DEFAULT_INTERNAL_ERROR });
  }
})

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const idParam = req.params['id'];
  const isValidId = (!isNaN(parseInt(idParam, 10)));
  if (!isValidId) {
    res.status(400).json({ error: BAD_REQUEST });
    return;
  }
  const clientId = parseInt(idParam, 10);

  const clientPayload = req.body;

  if (!clientPayload) {
    res.status(400).json({ error: NO_USER_PAYLOAD });
    return;
  }

  try {
    const updatedClient = await updateClient(clientId, clientPayload);
    if (updatedClient instanceof Error) {
      res.status(404).json({ error: updatedClient.message });
      return;
    }
    res.status(200).json(updatedClient);
  } catch (err) {
    console.error(SERVER_ERROR(err));
    res.status(500).json({ error: DEFAULT_INTERNAL_ERROR });
  }
})

export default router;
