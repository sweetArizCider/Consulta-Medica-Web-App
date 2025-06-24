import Router, { Request, Response } from 'express';
import { BAD_REQUEST, DEFAULT_INTERNAL_ERROR, NO_USER_PAYLOAD, SERVER_ERROR } from '@app/api/constants/errors/errors.constant';
import {
  SUCCESS_ON_CREATE,
  SUCCESS_ON_FETCH,
  SUCCESS_ON_UPDATE
} from '@app/api/constants/onSuccess/onSuccess.constant';
import {
  createMedicineRequired,
  getAllMedicinesRequired,
  getMedicineRequiredById,
  getMedicinesRequiredByClientId,
  getMedicinesRequiredByDiagnosticId,
  updateMedicineRequired
} from '@expressControllers/medicinesRequired/medicinesRequired.controller';
import { ERROR_JSON_RESPONSE, SUCCESS_JSON_RESPONSE } from '@app/api/constants/response/responses.constants';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void | any> => {
  const { id, diagnostic_id, client_id } = req.query;

  const handleRequest = async (
    id: number,
    fetchFunction: (id: number) => Promise<any>,
    successMessage: string
  ) => {
    try {
      const result = await fetchFunction(id);
      if (result instanceof Error) {
        res.status(404).json(ERROR_JSON_RESPONSE(404, result.message, null));
        return;
      }
      res.status(200).json(SUCCESS_JSON_RESPONSE(200, successMessage, result));
    } catch (error) {
      console.error(SERVER_ERROR(error));
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
    }
  };

  const isValidId = (val: any): boolean => typeof val === 'string' && !isNaN(parseInt(val, 10));

  if (id) {

    if (!isValidId(id)) return res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, 'Invalid ID format'));
    await handleRequest(parseInt(id as string, 10), getMedicineRequiredById, SUCCESS_ON_FETCH('Medicine Required'));

  } else if (diagnostic_id) {

    if (!isValidId(diagnostic_id)) return res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, 'Invalid Diagnostic ID format'));
    await handleRequest(parseInt(diagnostic_id as string, 10), getMedicinesRequiredByDiagnosticId, SUCCESS_ON_FETCH('Diagnostic with required medicines'));

  } else if (client_id) {

    if (!isValidId(client_id)) return res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, 'Invalid Client ID format'));
    await handleRequest(parseInt(client_id as string, 10), getMedicinesRequiredByClientId, SUCCESS_ON_FETCH('Client with all required medicines'));

  } else {

    try {
      const records = await getAllMedicinesRequired();
      if (records instanceof Error) {
        res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, records.message));
        return;

      }
      res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('All Medicines Required'), records));
    } catch (error) {
      console.error(SERVER_ERROR(error));
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
    }
  }

});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const payload = req.body;
  if (!payload) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const newRecord = await createMedicineRequired(payload);
    if (newRecord instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, newRecord.message, null));
      return;
    }
    res.status(201).json(SUCCESS_JSON_RESPONSE(201, SUCCESS_ON_CREATE('Medicine Required'), newRecord));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const recordId = parseInt(req.params['id'], 10);
  const payload = req.body;

  if (!payload || isNaN(recordId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const updatedRecord = await updateMedicineRequired(recordId, payload);
    if (updatedRecord instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, updatedRecord.message, null));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_UPDATE('Medicine Required'), updatedRecord));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

export default router;
