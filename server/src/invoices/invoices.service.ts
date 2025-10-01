import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async list(userId: number, opts: { page: number; limit: number }) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 10));
    const skip = (page - 1) * limit;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.invoice.count({ where: { user_id: userId } }),
      this.prisma.invoice.findMany({
        where: { user_id: userId },
        orderBy: { id: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async byId(userId: number, id: number) {
    const inv = await this.prisma.invoice.findFirst({
      where: { id, user_id: userId },
    });
    if (!inv) throw new NotFoundException("Invoice not found");
    return inv;
  }
}
