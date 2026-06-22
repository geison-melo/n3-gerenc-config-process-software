import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/produto.dto';
export declare class ProdutosController {
    private readonly produtosService;
    constructor(produtosService: ProdutosService);
    create(createProdutoDto: CreateProdutoDto): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
    findAll(page?: string, size?: string): Promise<{
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
    findOne(id: string): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
    update(id: string, updateProdutoDto: Partial<CreateProdutoDto>): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
    remove(id: string): Promise<{
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        descricao: string | null;
        preco: number;
    }>;
}
