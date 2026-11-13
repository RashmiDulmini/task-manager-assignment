import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Return a status response so clients can check that the API is running.
  @Get()
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
