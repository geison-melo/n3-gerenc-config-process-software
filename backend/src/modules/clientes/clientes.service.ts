import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.cliente.create({ data });
  }

  async findAll(page: number, size: number) {
    const skip = page * size;
    const [content, totalElements] = await Promise.all([
      this.prisma.cliente.findMany({ skip, take: size }),
      this.prisma.cliente.count(),
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
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { pedidos: true },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async update(id: number, data: Partial<CreateClienteDto>) {
    try {
      return await this.prisma.cliente.update({ where: { id }, data });
    } catch (e) {
      throw new NotFoundException('Cliente não encontrado ' + e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.cliente.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException('Cliente não encontrado ' + e);
    }
  }
}
