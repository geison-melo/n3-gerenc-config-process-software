import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProdutoDto } from './dto/produto.dto';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos enviados na requisição.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.' })
  findAll(
    @Query('page') page: string = '0',
    @Query('size') size: string = '10',
  ) {
    return this.produtosService.findAll(+page, +size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  update(
    @Param('id') id: string,
    @Body() updateProdutoDto: Partial<CreateProdutoDto>,
  ) {
    return this.produtosService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir produto' })
  @ApiResponse({ status: 204, description: 'Produto excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }

  @Get(':id/pedidos')
  @ApiOperation({ summary: 'Retornar os pedidos que contém este produto' })
  @ApiResponse({ status: 200, description: 'Pedidos vinculados ao produto retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findPedidos(@Param('id') id: string) {
    return this.produtosService.findPedidos(+id);
  }
}
