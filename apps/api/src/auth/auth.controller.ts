import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput, loginSchema, registerSchema } from '@cse-quiz/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(
        @Body(new ZodValidationPipe(registerSchema)) data: RegisterInput
    ) {
        return this.authService.register(data);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body(new ZodValidationPipe(loginSchema)) data: LoginInput
    ) {
        return this.authService.login(data);
    }
}
