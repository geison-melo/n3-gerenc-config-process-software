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
