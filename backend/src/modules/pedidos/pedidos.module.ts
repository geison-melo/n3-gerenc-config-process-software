import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [
    PrismaModule, // ◄ Add this to share PrismaService with ClientesService
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
