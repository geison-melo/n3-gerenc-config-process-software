const fs = require('fs');
const path = require('path');

function write(file, content) {
    const full = path.join(__dirname, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content.trim() + '\n');
}

write('src/modules/clientes/clientes.service.spec.ts', `
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
`);

write('src/modules/produtos/produtos.service.spec.ts', `
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
`);

write('src/modules/pedidos/pedidos.service.spec.ts', `
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
    expect(result.total).toBe(100);
  });
});
`);

console.log("Tests setup complete");
