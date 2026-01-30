import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Conectado ao banco de dados');
    } catch (error) {
      this.logger.warn('⚠️ Não foi possível conectar ao banco de dados. Alguns recursos podem não funcionar.');
      this.logger.warn('💡 Para testar apenas o email, ignore este aviso.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}