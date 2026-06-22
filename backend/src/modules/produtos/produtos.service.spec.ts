import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  produto: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProdutosService', () => {
  let service: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
  });

  it('should create a product', async () => {
    const dto = { nome: 'Produto', preco: 10 };
    mockPrismaService.produto.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });
});
