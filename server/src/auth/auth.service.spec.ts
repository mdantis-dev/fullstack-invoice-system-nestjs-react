import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let hashed: string;

  const prismaMock = {
    user: { findUnique: jest.fn() },
  } as unknown as PrismaService;

  const jwtMock = {
    signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
  } as unknown as JwtService;

  beforeAll(async () => {
    hashed = await bcrypt.hash('Passw0rd!', 10);
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('throws on unknown email', async () => {
    (prismaMock.user.findUnique as any).mockResolvedValue(null);
    await expect(service.validateAndLogin('x@example.com', 'pw')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws on bad password', async () => {
    (prismaMock.user.findUnique as any).mockResolvedValue({
      id: 1,
      email: 'demo@altametrics.test',
      name: 'Demo',
      password: hashed,
    });

    await expect(service.validateAndLogin('demo@altametrics.test', 'wrong')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns a token on valid credentials', async () => {
    (prismaMock.user.findUnique as any).mockResolvedValue({
      id: 1,
      email: 'demo@altametrics.test',
      name: 'Demo',
      password: hashed,
    });

    const res = await service.validateAndLogin('demo@altametrics.test', 'Passw0rd!');
    expect(res.accessToken).toBe('signed.jwt.token');
    expect(jwtMock.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ sub: 1, email: 'demo@altametrics.test' }),
    );
  });
});
