import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // ◄ Adjust path as needed

@Module({
  imports: [
    PrismaModule, // ◄ Add this to share PrismaService with ClientesService
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
