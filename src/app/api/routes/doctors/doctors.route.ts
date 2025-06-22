import Router, { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, DEFAULT_INTERNAL_ERROR, NO_USER_PAYLOAD, SERVER_ERROR } from '@app/api/constants/errors/errors.constant';
import {
  SUCCESS_ON_CREATE,
  SUCCESS_ON_DELETE,
  SUCCESS_ON_FETCH, SUCCESS_ON_RESTORE,
  SUCCESS_ON_UPDATE
} from '@app/api/constants/onSuccess/onSuccess.constant'
import { createDoctor, getAllDoctors, getDoctorById , deleteDoctor , restoreDoctor , updateDoctor } from '@expressControllers/doctors/doctors.controller';
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
    const doctorId = parseInt(id, 10);
    try {
      const doctor = await getDoctorById(doctorId);
      if (doctor instanceof Error) {
        res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(doctorId), doctor.message));
        return;
      }
      res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('Doctor'), doctor ));
      return;
    } catch (error) {
      console.error(SERVER_ERROR(error));
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
      return;
    }
  }

  try {
    const doctors = await getAllDoctors();
    if (doctors instanceof Error) {
      res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, doctors.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_FETCH('Doctors'), doctors ));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const doctorPayload = req.body;

  if (!doctorPayload) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const newDoctor = await createDoctor(doctorPayload);
    if (newDoctor instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, newDoctor.message, null));
      return;
    }
    res.status(201).json(SUCCESS_JSON_RESPONSE(201, SUCCESS_ON_CREATE('Doctor'), newDoctor));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const doctorId = parseInt(req.params['id'], 10);
  const doctorPayload = req.body;

  if (!doctorPayload || isNaN(doctorId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null));
    return;
  }

  try {
    const updatedDoctor = await updateDoctor(doctorId, doctorPayload);
    if (updatedDoctor instanceof Error) {
      res.status(403).json(ERROR_JSON_RESPONSE(403, updatedDoctor.message, null));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_UPDATE('Doctor'), updatedDoctor));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});


router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const doctorId = parseInt(req.params['id'], 10);

  if (isNaN(doctorId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, null));
    return;
  }

  try {
    const deletedDoctor = await deleteDoctor(doctorId);
    if (deletedDoctor instanceof Error) {
      res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(doctorId), deletedDoctor.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_DELETE('Doctor'), {deletedDoctor}));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  const doctorId = parseInt(req.params['id'], 10);

  if (isNaN(doctorId)) {
    res.status(400).json(ERROR_JSON_RESPONSE(400, BAD_REQUEST, null));
    return;
  }

  try {
    const restoredDoctor = await restoreDoctor(doctorId);
    if (restoredDoctor instanceof Error) {
      res.status(404).json(ERROR_JSON_RESPONSE(404, NOT_FOUND(doctorId), restoredDoctor.message));
      return;
    }
    res.status(200).json(SUCCESS_JSON_RESPONSE(200, SUCCESS_ON_RESTORE('Doctor'), restoredDoctor));
  } catch (error) {
    console.error(SERVER_ERROR(error));
    res.status(500).json(ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, error));
  }
});

export default router;
