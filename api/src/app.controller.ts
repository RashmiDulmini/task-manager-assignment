import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // LLM: Return a status response so clients can check that the API is running.
  @Get()
  getStatus(): { status: string } {
    return this.appService.getStatus();
  }
}
