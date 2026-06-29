import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePedidoDto } from './dto/pedido.dto';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post() @ApiOperation({ summary: 'Criar pedido' }) 
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos enviados na requisição.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPedidoDto: CreatePedidoDto) { return this.pedidosService.create(createPedidoDto); }

  @Get() @ApiOperation({ summary: 'Listar pedidos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso.' })
  findAll(@Query('page') page: string = '0', @Query('size') size: string = '10') { return this.pedidosService.findAll(+page, +size); }

  @Get(':id') @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  findOne(@Param('id') id: string) { return this.pedidosService.findOne(+id); }

  @Delete(':id') @ApiOperation({ summary: 'Excluir pedido' }) 
  @ApiResponse({ status: 204, description: 'Pedido excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.pedidosService.remove(+id); }

  @Get(':id/produtos') @ApiOperation({ summary: 'Retornar os produtos de um pedido' })
  @ApiResponse({ status: 200, description: 'Produtos do pedido retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  findProdutos(@Param('id') id: string) { return this.pedidosService.findProdutos(+id); }
}
