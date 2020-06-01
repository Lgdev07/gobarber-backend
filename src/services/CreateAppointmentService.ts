import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const apponintmentDate = startOfHour(date);

    const findApponintmentInSameDate = await appointmentsRepository.findByDate(
      apponintmentDate
    );

    if (findApponintmentInSameDate) {
      throw new AppError('Appointment in this date already exists');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: apponintmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
