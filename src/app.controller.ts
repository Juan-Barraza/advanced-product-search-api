import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('health')
  checkHealth() {
    return {
      status: 'ok',
      message: 'Onmi Search API is up and running!',
      timestamp: new Date().toISOString(),
    }
  }
}
