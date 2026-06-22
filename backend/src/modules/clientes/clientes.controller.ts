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
