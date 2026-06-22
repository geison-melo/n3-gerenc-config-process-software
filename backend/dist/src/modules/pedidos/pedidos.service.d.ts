import { PrismaService } from '../../prisma/prisma.service';
import { CreatePedidoDto } from './dto/pedido.dto';
export declare class PedidosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePedidoDto): Promise<{
        itens: {
            id: number;
            produtoId: number;
            quantidade: number;
            precoUnit: number;
            pedidoId: number;
        }[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clienteId: number;
        total: number;
    }>;
    findAll(page: number, size: number): Promise<{
        content: ({
            cliente: {
                nome: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
            itens: {
                id: number;
                produtoId: number;
                quantidade: number;
                precoUnit: number;
                pedidoId: number;
            }[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            clienteId: number;
            total: number;
        })[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        cliente: {
            nome: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        itens: ({
            produto: {
                nome: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                descricao: string | null;
                preco: number;
            };
        } & {
            id: number;
            produtoId: number;
            quantidade: number;
            precoUnit: number;
            pedidoId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clienteId: number;
        total: number;
    }>;
    remove(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clienteId: number;
        total: number;
    }>;
}
