import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { InvoicesService } from "./invoices.service";
import type { Request } from "express";
import type { JwtUser } from "../auth/jwt.types";

type AuthRequest = Request & { user: JwtUser };

@UseGuards(JwtAuthGuard)
@Controller("invoices")
export class InvoicesController {
  constructor(private service: InvoicesService) {}

  @Get()
  list(
    @Req() req: AuthRequest,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.service.list(req.user.sub, { page: +page, limit: +limit });
  }

  @Get(":id")
  byId(@Req() req: AuthRequest, @Param("id", ParseIntPipe) id: number) {
    return this.service.byId(req.user.sub, id);
  }
}
