import { PrismaService } from '../../prisma/prisma.service';
import { CreateProdutoDto } from './dto/produto.dto';
export declare class ProdutosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProdutoDto): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
    findAll(page: number, size: number): Promise<{
        content: {
            nome: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            descricao: string | null;
            preco: number;
        }[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
    update(id: number, data: Partial<CreateProdutoDto>): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
    remove(id: number): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
}
