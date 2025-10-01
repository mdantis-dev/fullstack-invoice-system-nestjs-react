import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  const rows = [
    { id: 3, user_id: 1 },
    { id: 2, user_id: 1 },
  ];

  const $tx = jest.fn();

  const prismaMock = {
    $transaction: $tx as unknown as PrismaService['$transaction'],
    invoice: {
      count: jest.fn().mockResolvedValue(3),
      findMany: jest.fn().mockResolvedValue(rows),
      findFirst: jest.fn(),
    } as any,
  } as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    $tx.mockImplementation(async (arg: unknown) => {
      if (Array.isArray(arg)) {
        return Promise.all(arg as Promise<unknown>[]);
      }
      if (typeof arg === 'function') {
        const tx = { invoice: (prismaMock as any).invoice };
        return (arg as (t: any) => unknown)(tx);
      }
      return null;
    });

    const module = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(InvoicesService);
  });

  it('list returns data + meta', async () => {
    const res = await service.list(1, { page: 1, limit: 2 });
    expect(res.meta).toEqual({ page: 1, limit: 2, total: 3, pages: 2 });
    expect(res.data).toHaveLength(2);
  });

  it('byId returns invoice or throws 404', async () => {
    (prismaMock.invoice.findFirst as any).mockResolvedValueOnce({ id: 1, user_id: 1 });
    await expect(service.byId(1, 1)).resolves.toEqual({ id: 1, user_id: 1 });

    (prismaMock.invoice.findFirst as any).mockResolvedValueOnce(null);
    await expect(service.byId(1, 999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
