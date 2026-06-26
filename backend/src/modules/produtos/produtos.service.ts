import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProdutoDto } from './dto/produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDto) {
    return this.prisma.produto.create({ data });
  }

  async findAll(page: number, size: number) {
    const skip = page * size;
    const [content, totalElements] = await Promise.all([
      this.prisma.produto.findMany({ skip, take: size }),
      this.prisma.produto.count(),
    ]);
    return {
      content,
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
    };
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async update(id: number, data: Partial<CreateProdutoDto>) {
    try {
      return await this.prisma.produto.update({ where: { id }, data });
    } catch (e) {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.produto.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async findPedidos(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { itensPedido: { include: { pedido: true } } },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto.itensPedido.map((item) => item.pedido);
  }
}
