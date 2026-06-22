import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/pedido.dto';
export declare class PedidosController {
    private readonly pedidosService;
    constructor(pedidosService: PedidosService);
    create(createPedidoDto: CreatePedidoDto): Promise<{
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
    findAll(page?: string, size?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    remove(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clienteId: number;
        total: number;
    }>;
}
