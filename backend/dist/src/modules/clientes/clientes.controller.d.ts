import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): Promise<{
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(page?: string, size?: string): Promise<{
        content: {
            nome: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        }[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        pedidos: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            clienteId: number;
            total: number;
        }[];
    } & {
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: string, updateClienteDto: Partial<CreateClienteDto>): Promise<{
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: string): Promise<{
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    getPedidos(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clienteId: number;
        total: number;
    }[]>;
}
