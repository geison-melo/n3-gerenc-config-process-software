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
exports.ProdutosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProdutosService = class ProdutosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) { return this.prisma.produto.create({ data }); }
    async findAll(page, size) {
        const skip = page * size;
        const [content, totalElements] = await Promise.all([
            this.prisma.produto.findMany({ skip, take: size }),
            this.prisma.produto.count(),
        ]);
        return { content, page, size, totalElements, totalPages: Math.ceil(totalElements / size) };
    }
    async findOne(id) {
        const produto = await this.prisma.produto.findUnique({ where: { id } });
        if (!produto)
            throw new common_1.NotFoundException('Produto não encontrado');
        return produto;
    }
    async update(id, data) {
        try {
            return await this.prisma.produto.update({ where: { id }, data });
        }
        catch (e) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
    }
    async remove(id) {
        try {
            return await this.prisma.produto.delete({ where: { id } });
        }
        catch (e) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
    }
};
exports.ProdutosService = ProdutosService;
exports.ProdutosService = ProdutosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProdutosService);
//# sourceMappingURL=produtos.service.js.map