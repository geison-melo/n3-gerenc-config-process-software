declare class ItemPedidoDto {
    produtoId: number;
    quantidade: number;
}
export declare class CreatePedidoDto {
    clienteId: number;
    itens: ItemPedidoDto[];
}
export {};
