import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let repo: Repository<User>;

  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => ({ id: '1', ...dto })),
    save: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ id: '1', ...user })),
    findOne: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should register a user', async () => {
    const input = {
      email: 'test@test.com',
      password: 'password123',
      nom: 'Test',
      role: Role.OPERATEUR,
    };
    const result = await service.register(input);

    expect(result.token).toBe('mock_token');
    expect(result.user.email).toBe(input.email);
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(repo.save).toHaveBeenCalled();
  });

  it('should login a user', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: '1',
      email: 'test@test.com',
      password: hashedPassword,
      role: Role.OPERATEUR,
    } as User;

    (repo.findOne as jest.Mock).mockResolvedValue(user);

    const result = await service.login({ email: 'test@test.com', password });

    expect(result.token).toBe('mock_token');
    expect(result.user.email).toBe(user.email);
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: 'wrong',
    });
    await expect(
      service.login({ email: 'test@test.com', password: 'any' }),
    ).rejects.toThrow();
  });
});
