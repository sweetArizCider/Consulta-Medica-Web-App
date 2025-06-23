import Router, { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, DEFAULT_INTERNAL_ERROR, NO_USER_PAYLOAD, SERVER_ERROR } from '@app/api/constants/errors/errors.constant';
import {
  SUCCESS_ON_CREATE,
  SUCCESS_ON_FETCH,
  SUCCESS_ON_UPDATE
} from '@app/api/constants/onSuccess/onSuccess.constant'
import { createDiagnostic, getAllDiagnostics, getDiagnosticById, updateDiagnostic } from '@expressControllers/diagnostics/diagnostics.controller';
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
    const diagnosticId = parseInt(id, 10);
    try {
      const diagnostic = await getDiagnosticById(diagnosticId);
      if (diagnostic instanceof Error) {
        res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(diagnosticId), diagnostic.message));
        return;
      }
      res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('Diagnostic'), diagnostic ));
      return;
    } catch (error) {
      console.error(SERVER_ERROR(error));
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
      return;
    }
  }

  try {
    const diagnostics = await getAllDiagnostics();
    if (diagnostics instanceof Error) {
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, diagnostics.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('Diagnostics'), diagnostics ));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const diagnosticPayload = req.body;

  if (!diagnosticPayload) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const newDiagnostic = await createDiagnostic(diagnosticPayload);
    if (newDiagnostic instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, newDiagnostic.message, null));
      return;
    }
    res.status(201).json(SUCCESS_JSON_RESPONSE(201, SUCCESS_ON_CREATE('Diagnostic'), newDiagnostic));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const diagnosticId = parseInt(req.params['id'], 10);
  const diagnosticPayload = req.body;

  if (!diagnosticPayload || isNaN(diagnosticId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const updatedDiagnostic = await updateDiagnostic(diagnosticId, diagnosticPayload);
    if (updatedDiagnostic instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, updatedDiagnostic.message, null));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_UPDATE('Diagnostic'), updatedDiagnostic));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

export default router;
