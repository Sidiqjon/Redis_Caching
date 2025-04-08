import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered.' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged in.' })
  @ApiBody({ schema: { properties: { email: { type: 'string' }, password: { type: 'string' }, ip: { type: 'string' } } } })
  async login(@Body() { email, password, ip }: { email: string; password: string; ip: string }) {
    return this.authService.login(email, password, ip);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User activation' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully activated.' })
  @ApiBody({ schema: { properties: { email: { type: 'string' }, otp: { type: 'string' } } } })
  async activateUser(@Body() { email, otp }: { email: string; otp: string }) {
    return this.authService.activateUser(email, otp);
  }
}

