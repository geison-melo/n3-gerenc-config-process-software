import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  cliente: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ClientesService', () => {
  let service: ClientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a client', async () => {
    const dto = { nome: 'Test', email: 'test@test.com' };
    mockPrismaService.cliente.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should list clients with pagination', async () => {
    mockPrismaService.cliente.findMany.mockResolvedValue([{ id: 1, nome: 'Test' }]);
    mockPrismaService.cliente.count.mockResolvedValue(1);
    
    const result = await service.findAll(0, 10);
    expect(result.content).toHaveLength(1);
    expect(result.totalElements).toBe(1);
  });
});
