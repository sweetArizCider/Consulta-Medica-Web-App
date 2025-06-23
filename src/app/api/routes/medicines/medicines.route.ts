import Router, { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, DEFAULT_INTERNAL_ERROR, NO_USER_PAYLOAD, SERVER_ERROR } from '@app/api/constants/errors/errors.constant';
import {
  SUCCESS_ON_CREATE,
  SUCCESS_ON_DELETE,
  SUCCESS_ON_FETCH, SUCCESS_ON_RESTORE,
  SUCCESS_ON_UPDATE
} from '@app/api/constants/onSuccess/onSuccess.constant'
import { createMedicine, getAllMedicines, getMedicineById , deleteMedicine , restoreMedicine , updateMedicine } from '@expressControllers/medicines/medicines.controller';
import {ERROR_JSON_RESPONSE, SUCCESS_JSON_RESPONSE} from '@app/api/constants/response/responses.constants'

const router = Router();

router.get('/', async ( req : Request, res : Response ) : Promise<void> => {
  const { id } = req.query;

  const isValidId = (typeof id === 'string' && !isNaN(parseInt(id, 10)));

  if (id && !isValidId) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, null));
    return;
  }

  if (id && isValidId) {
    const medicineId = parseInt(id, 10);
    try {
      const medicine = await getMedicineById(medicineId);
      if (medicine instanceof Error) {
        res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(medicineId), medicine.message));
        return;
      }
      res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('Medicine'), medicine ));
      return;
    } catch (error) {
      console.error(SERVER_ERROR(error));
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
      return;
    }
  }

  try {
    const medicines = await getAllMedicines();
    if (medicines instanceof Error) {
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, medicines.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('Medicines'), medicines ));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const medicinePayload = req.body;

  if (!medicinePayload) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const newMedicine = await createMedicine(medicinePayload);
    if (newMedicine instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, newMedicine.message, null));
      return;
    }
    res.status(201).json(SUCCESS_JSON_RESPONSE(201, SUCCESS_ON_CREATE('Medicine'), newMedicine));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const medicineId = parseInt(req.params['id'], 10);
  const medicinePayload = req.body;

  if (!medicinePayload || isNaN(medicineId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const updatedMedicine = await updateMedicine(medicineId, medicinePayload);
    if (updatedMedicine instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, updatedMedicine.message, null));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_UPDATE('Medicine'), updatedMedicine));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});


router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const medicineId = parseInt(req.params['id'], 10);

  if (isNaN(medicineId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, null));
    return;
  }

  try {
    const deletedMedicine = await deleteMedicine(medicineId);
    if (deletedMedicine instanceof Error) {
      res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(medicineId), deletedMedicine.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_DELETE('Medicine'), {deletedMedicine}));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  const medicineId = parseInt(req.params['id'], 10);

  if (isNaN(medicineId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, null));
    return;
  }

  try {
    const restoredMedicine = await restoreMedicine(medicineId);
    if (restoredMedicine instanceof Error) {
      res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(medicineId), restoredMedicine.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_RESTORE('Medicine'), restoredMedicine));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

export default router;
