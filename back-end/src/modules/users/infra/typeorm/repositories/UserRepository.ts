import { getRepository, Repository } from 'typeorm';
import User from '../entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUserRepository {

  private ormRepository: Repository<User>;

  constructor () {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { id },
    });
    return findAppointment;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { email },
    });
    return findAppointment;
  }

  public async save(data: User): Promise<User> {
    return this.ormRepository.save(data);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(data);
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default UsersRepository;
