
import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, DiskHealthIndicator, MemoryHealthIndicator, PrismaHealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceHealthIndicator } from '../autoservice/autoservice.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService,
    @Inject(PrismaHealthIndicator) private readonly db: PrismaHealthIndicator,
    private readonly autoservice: AutoserviceHealthIndicator
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('api-requests', 'https://api.samip.vw.com.br/xapp-samip-assobrav/api/v1/autoservice'),
      () => this.http.pingCheck('api-token', 'https://api.samip.vw.com.br/xapp-samip-auth-general/v1/token'),
      () => this.disk.checkStorage('storage', { path: '/dados', thresholdPercent: 100 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.db.pingCheck('prisma', this.prisma),
      async () => this.autoservice.isHealthySqs('sqs'),
      async () => this.autoservice.isHealthyBull('bull')
    ]);
  }
}
