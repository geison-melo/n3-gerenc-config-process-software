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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProdutoDto } from './dto/produto.dto';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar produto' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos com paginação' })
  findAll(
    @Query('page') page: string = '0',
    @Query('size') size: string = '10',
  ) {
    return this.produtosService.findAll(+page, +size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  update(
    @Param('id') id: string,
    @Body() updateProdutoDto: Partial<CreateProdutoDto>,
  ) {
    return this.produtosService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir produto' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }

  @Get(':id/pedidos')
  @ApiOperation({ summary: 'Retornar os pedidos que contém este produto' })
  findPedidos(@Param('id') id: string) {
    return this.produtosService.findPedidos(+id);
  }
}
