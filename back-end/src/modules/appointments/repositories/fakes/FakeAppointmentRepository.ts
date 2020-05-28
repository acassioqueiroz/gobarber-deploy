import { isEqual, getDate, getMonth, getYear } from 'date-fns';
import { uuid } from 'uuidv4';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findAllInDayFromProvider({
    provider_id,
    day,
    year,
    month,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const findAppointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month
      );
    });
    return findAppointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const findAppointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month
      );
    });
    return findAppointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment) =>
        appointment.provider_id === provider_id &&
        isEqual(appointment.date, date),
    );
    return findAppointment;
  }

  public async find(): Promise<Appointment[]> {
    return this.appointments;
  }

  public async create({
    date,
    provider_id,
    user_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });
    this.appointments.push(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
