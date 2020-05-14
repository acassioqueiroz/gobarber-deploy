import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year } = request.body;
    const { provider_id } = request.params;
    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const providers = await listProviderDayAvailability.execute({
      provider_id,
      month,
      day,
      year,
    });
    return response.json(providers);
  }
}
