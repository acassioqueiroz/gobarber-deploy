import { getRepository, Repository, Between } from 'typeorm';
import { endOfMonth } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    year,
    month,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const start_date = new Date(year, month - 1, day, 8);
    const end_date = new Date(year, month - 1, day, 18);
    const findAppointments = await this.ormRepository.find({
      where: { provider_id, date: Between(start_date, end_date) },
      relations: ['user'],
    });
    return findAppointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const start_date = new Date(year, month - 1, 1);
    const end_date = endOfMonth(start_date);
    const findAppointments = await this.ormRepository.find({
      where: { provider_id, date: Between(start_date, end_date) },
    });
    return findAppointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });
    return findAppointment;
  }

  public async find(): Promise<Appointment[]> {
    return this.ormRepository.find();
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create(data);
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
