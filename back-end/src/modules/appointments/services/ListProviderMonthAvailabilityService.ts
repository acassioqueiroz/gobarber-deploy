import { injectable, inject } from 'tsyringe';
import { endOfDay, getDaysInMonth, getDate, isAfter, getHours } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1, 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );
    const currentDate = new Date(Date.now());
    const availability = eachDayArray.map((day) => {
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(appointment.date) === day;
      });
      const dateCheckAvailability = endOfDay(new Date(year, month - 1, day));
      let hasAvailability = isAfter(dateCheckAvailability, currentDate);
      if (getDate(dateCheckAvailability) === day) {
        const hoursNow = getHours(currentDate);
        const lastsHoursToday = 17 - hoursNow;
        const appointmentsAfterNow = appointmentsInDay.filter((appointment) => {
          return isAfter(appointment.date, currentDate);
        });
        if (lastsHoursToday === appointmentsAfterNow.length) {
          hasAvailability = false;
        }
      }

      return {
        day,
        available: appointmentsInDay.length < 10 && hasAvailability,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
