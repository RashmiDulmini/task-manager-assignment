import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // LLM: Provide the API status response.
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
