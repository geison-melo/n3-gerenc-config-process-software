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
    const itensComPreco: any[] = [];
    
    for (const item of itens) {
      const produto = await this.prisma.produto.findUnique({ where: { id: item.produtoId } });
      if (!produto) throw new BadRequestException(`Produto ${item.produtoId} não encontrado`);
      
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
