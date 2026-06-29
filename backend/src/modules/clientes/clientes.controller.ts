import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateClienteDto } from './dto/cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post() @ApiOperation({ summary: 'Criar cliente' }) 
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos enviados na requisição.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClienteDto: CreateClienteDto) { return this.clientesService.create(createClienteDto); }

  @Get() @ApiOperation({ summary: 'Listar clientes com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso.' })
  findAll(@Query('page') page: string = '0', @Query('size') size: string = '10') { return this.clientesService.findAll(+page, +size); }

  @Get(':id') @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  findOne(@Param('id') id: string) { return this.clientesService.findOne(+id); }

  @Patch(':id') @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  update(@Param('id') id: string, @Body() updateClienteDto: Partial<CreateClienteDto>) { return this.clientesService.update(+id, updateClienteDto); }

  @Delete(':id') @ApiOperation({ summary: 'Excluir cliente' }) 
  @ApiResponse({ status: 204, description: 'Cliente excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.clientesService.remove(+id); }
  
  @Get(':id/pedidos') @ApiOperation({ summary: 'Retornar os pedidos de um cliente' })
  @ApiResponse({ status: 200, description: 'Pedidos do cliente retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async getPedidos(@Param('id') id: string) { 
    const cliente = await this.clientesService.findOne(+id);
    return cliente.pedidos;
  }
}
