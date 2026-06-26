import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');

    // Connect directly to 5432. The pg driver manages this local pool.
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // This safely handles Supabase's certificates
      },
      max: 10, // Adjust based on your expected concurrent traffic
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
