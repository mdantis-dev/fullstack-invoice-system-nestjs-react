import { Body, Controller, Post, HttpCode } from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service";

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @HttpCode(200)
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.validateAndLogin(dto.email, dto.password);
  }
}
