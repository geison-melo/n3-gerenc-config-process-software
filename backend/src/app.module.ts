import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClientesModule,
    ProdutosModule,
    PedidosModule,
  ],
})
export class AppModule {}
