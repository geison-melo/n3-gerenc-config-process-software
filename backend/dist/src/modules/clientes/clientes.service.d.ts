import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/cliente.dto';
export declare class ClientesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateClienteDto): Promise<{
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(page: number, size: number): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, data: Partial<CreateClienteDto>): Promise<{
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        nome: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
