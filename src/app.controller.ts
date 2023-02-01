import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('ping')
  getHello() {
    return { status: 'ok' };
  }
}
