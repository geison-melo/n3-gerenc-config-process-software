const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modulesDir = path.join(srcDir, 'modules');

function write(file, content) {
    const full = path.join(__dirname, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content.trim() + '\n');
}

// AppModule
write('src/app.module.ts', `
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';

@Module({
  imports: [PrismaModule, ClientesModule, ProdutosModule, PedidosModule],
})
export class AppModule {}
`);

// Clientes
write('src/modules/clientes/dto/cliente.dto.ts', `
import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClienteDto {
  @ApiProperty() @IsString() nome: string;
  @ApiProperty() @IsEmail() email: string;
}
`);
write('src/modules/clientes/clientes.service.ts', `
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) { return this.prisma.cliente.create({ data }); }

  async findAll(page: number, size: number) {
    const skip = page * size;
    const [content, totalElements] = await Promise.all([
      this.prisma.cliente.findMany({ skip, take: size }),
      this.prisma.cliente.count(),
    ]);
    return { content, page, size, totalElements, totalPages: Math.ceil(totalElements / size) };
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id }, include: { pedidos: true } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async update(id: number, data: Partial<CreateClienteDto>) {
    try { return await this.prisma.cliente.update({ where: { id }, data }); } 
    catch (e) { throw new NotFoundException('Cliente não encontrado'); }
  }

  async remove(id: number) {
    try { return await this.prisma.cliente.delete({ where: { id } }); } 
    catch (e) { throw new NotFoundException('Cliente não encontrado'); }
  }
}
`);
write('src/modules/clientes/clientes.controller.ts', `
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateClienteDto } from './dto/cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post() @ApiOperation({ summary: 'Criar cliente' }) @HttpCode(HttpStatus.CREATED)
  create(@Body() createClienteDto: CreateClienteDto) { return this.clientesService.create(createClienteDto); }

  @Get() @ApiOperation({ summary: 'Listar clientes com paginação' })
  findAll(@Query('page') page: string = '0', @Query('size') size: string = '10') { return this.clientesService.findAll(+page, +size); }

  @Get(':id') @ApiOperation({ summary: 'Buscar cliente por ID' })
  findOne(@Param('id') id: string) { return this.clientesService.findOne(+id); }

  @Patch(':id') @ApiOperation({ summary: 'Atualizar cliente' })
  update(@Param('id') id: string, @Body() updateClienteDto: Partial<CreateClienteDto>) { return this.clientesService.update(+id, updateClienteDto); }

  @Delete(':id') @ApiOperation({ summary: 'Excluir cliente' }) @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.clientesService.remove(+id); }
  
  @Get(':id/pedidos') @ApiOperation({ summary: 'Retornar os pedidos de um cliente' })
  async getPedidos(@Param('id') id: string) { 
    const cliente = await this.clientesService.findOne(+id);
    return cliente.pedidos;
  }
}
`);
write('src/modules/clientes/clientes.module.ts', `
import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
@Module({ controllers: [ClientesController], providers: [ClientesService] })
export class ClientesModule {}
`);

// Produtos
write('src/modules/produtos/dto/produto.dto.ts', `
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProdutoDto {
  @ApiProperty() @IsString() nome: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() descricao?: string;
  @ApiProperty() @IsNumber() preco: number;
}
`);
write('src/modules/produtos/produtos.service.ts', `
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProdutoDto } from './dto/produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDto) { return this.prisma.produto.create({ data }); }

  async findAll(page: number, size: number) {
    const skip = page * size;
    const [content, totalElements] = await Promise.all([
      this.prisma.produto.findMany({ skip, take: size }),
      this.prisma.produto.count(),
    ]);
    return { content, page, size, totalElements, totalPages: Math.ceil(totalElements / size) };
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async update(id: number, data: Partial<CreateProdutoDto>) {
    try { return await this.prisma.produto.update({ where: { id }, data }); } 
    catch (e) { throw new NotFoundException('Produto não encontrado'); }
  }

  async remove(id: number) {
    try { return await this.prisma.produto.delete({ where: { id } }); } 
    catch (e) { throw new NotFoundException('Produto não encontrado'); }
  }
}
`);
write('src/modules/produtos/produtos.controller.ts', `
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProdutoDto } from './dto/produto.dto';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post() @ApiOperation({ summary: 'Criar produto' }) @HttpCode(HttpStatus.CREATED)
  create(@Body() createProdutoDto: CreateProdutoDto) { return this.produtosService.create(createProdutoDto); }

  @Get() @ApiOperation({ summary: 'Listar produtos com paginação' })
  findAll(@Query('page') page: string = '0', @Query('size') size: string = '10') { return this.produtosService.findAll(+page, +size); }

  @Get(':id') @ApiOperation({ summary: 'Buscar produto por ID' })
  findOne(@Param('id') id: string) { return this.produtosService.findOne(+id); }

  @Patch(':id') @ApiOperation({ summary: 'Atualizar produto' })
  update(@Param('id') id: string, @Body() updateProdutoDto: Partial<CreateProdutoDto>) { return this.produtosService.update(+id, updateProdutoDto); }

  @Delete(':id') @ApiOperation({ summary: 'Excluir produto' }) @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.produtosService.remove(+id); }
}
`);
write('src/modules/produtos/produtos.module.ts', `
import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
@Module({ controllers: [ProdutosController], providers: [ProdutosService] })
export class ProdutosModule {}
`);

// Pedidos
write('src/modules/pedidos/dto/pedido.dto.ts', `
import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ItemPedidoDto {
  @ApiProperty() @IsNumber() produtoId: number;
  @ApiProperty() @IsNumber() quantidade: number;
}

export class CreatePedidoDto {
  @ApiProperty() @IsNumber() clienteId: number;
  @ApiProperty({ type: [ItemPedidoDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => ItemPedidoDto) itens: ItemPedidoDto[];
}
`);
write('src/modules/pedidos/pedidos.service.ts', `
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePedidoDto } from './dto/pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePedidoDto) {
    const { clienteId, itens } = data;
    
    // Validate products and calculate total
    let total = 0;
    const itensComPreco = [];
    
    for (const item of itens) {
      const produto = await this.prisma.produto.findUnique({ where: { id: item.produtoId } });
      if (!produto) throw new BadRequestException(\`Produto \${item.produtoId} não encontrado\`);
      
      const precoUnit = produto.preco;
      total += precoUnit * item.quantidade;
      itensComPreco.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnit
      });
    }

    return this.prisma.pedido.create({
      data: {
        clienteId,
        total,
        itens: {
          create: itensComPreco
        }
      },
      include: { itens: true }
    });
  }

  async findAll(page: number, size: number) {
    const skip = page * size;
    const [content, totalElements] = await Promise.all([
      this.prisma.pedido.findMany({ skip, take: size, include: { cliente: true, itens: true } }),
      this.prisma.pedido.count(),
    ]);
    return { content, page, size, totalElements, totalPages: Math.ceil(totalElements / size) };
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id }, include: { cliente: true, itens: { include: { produto: true } } } });
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }

  async remove(id: number) {
    try { return await this.prisma.pedido.delete({ where: { id } }); } 
    catch (e) { throw new NotFoundException('Pedido não encontrado'); }
  }
}
`);
write('src/modules/pedidos/pedidos.controller.ts', `
import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePedidoDto } from './dto/pedido.dto';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post() @ApiOperation({ summary: 'Criar pedido' }) @HttpCode(HttpStatus.CREATED)
  create(@Body() createPedidoDto: CreatePedidoDto) { return this.pedidosService.create(createPedidoDto); }

  @Get() @ApiOperation({ summary: 'Listar pedidos com paginação' })
  findAll(@Query('page') page: string = '0', @Query('size') size: string = '10') { return this.pedidosService.findAll(+page, +size); }

  @Get(':id') @ApiOperation({ summary: 'Buscar pedido por ID' })
  findOne(@Param('id') id: string) { return this.pedidosService.findOne(+id); }

  @Delete(':id') @ApiOperation({ summary: 'Excluir pedido' }) @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.pedidosService.remove(+id); }
}
`);
write('src/modules/pedidos/pedidos.module.ts', `
import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
@Module({ controllers: [PedidosController], providers: [PedidosService] })
export class PedidosModule {}
`);

console.log("Setup complete");
