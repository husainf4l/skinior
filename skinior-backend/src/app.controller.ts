import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-port')
  getTestPort(): string {
    return `Backend running on port 4008 - ${new Date().toISOString()}`;
  }
}
