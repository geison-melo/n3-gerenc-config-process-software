import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [
    PrismaModule, // ◄ Add this to share PrismaService with ClientesService
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService],
})
export class ProdutosModule {}
