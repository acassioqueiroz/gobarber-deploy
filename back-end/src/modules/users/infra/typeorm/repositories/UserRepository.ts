import { getRepository, Repository, Not } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProviersDTO';
import User from '../entities/User';

class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    const findUsers = await this.ormRepository.find({
      where: { id: Not(except_user_id) },
    });
    return findUsers;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUsers = await this.ormRepository.findOne({
      where: { id },
    });
    return findUsers;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUsers = await this.ormRepository.findOne({
      where: { email },
    });
    return findUsers;
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
