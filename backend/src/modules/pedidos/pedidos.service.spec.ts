import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  pedido: {
    create: jest.fn(),
  },
  produto: {
    findUnique: jest.fn(),
  }
};

describe('PedidosService', () => {
  let service: PedidosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  it('should calculate total properly and create pedido', async () => {
    const dto = { clienteId: 1, itens: [{ produtoId: 1, quantidade: 2 }] };
    mockPrismaService.produto.findUnique.mockResolvedValue({ id: 1, preco: 50 });
    mockPrismaService.pedido.create.mockResolvedValue({ id: 1, total: 100 });
    
    const result = await service.create(dto);
    expect(mockPrismaService.pedido.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        total: 100,
        clienteId: 1,
      })
    }));
    expect(result.total).toBe(100); // teste falha CI
  });
});
