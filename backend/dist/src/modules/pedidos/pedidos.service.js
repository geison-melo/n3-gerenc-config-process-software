"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PedidosService = class PedidosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { clienteId, itens } = data;
        let total = 0;
        const itensComPreco = [];
        for (const item of itens) {
            const produto = await this.prisma.produto.findUnique({ where: { id: item.produtoId } });
            if (!produto)
                throw new common_1.BadRequestException(`Produto ${item.produtoId} não encontrado`);
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
    async findAll(page, size) {
        const skip = page * size;
        const [content, totalElements] = await Promise.all([
            this.prisma.pedido.findMany({ skip, take: size, include: { cliente: true, itens: true } }),
            this.prisma.pedido.count(),
        ]);
        return { content, page, size, totalElements, totalPages: Math.ceil(totalElements / size) };
    }
    async findOne(id) {
        const pedido = await this.prisma.pedido.findUnique({ where: { id }, include: { cliente: true, itens: { include: { produto: true } } } });
        if (!pedido)
            throw new common_1.NotFoundException('Pedido não encontrado');
        return pedido;
    }
    async remove(id) {
        try {
            return await this.prisma.pedido.delete({ where: { id } });
        }
        catch (e) {
            throw new common_1.NotFoundException('Pedido não encontrado');
        }
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map