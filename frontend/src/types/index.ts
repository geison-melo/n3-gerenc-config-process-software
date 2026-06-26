export interface Cliente {
  id: number;
  nome: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string | null;
  preco: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemPedido {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnit: number;
  produto?: Produto;
}

export interface Pedido {
  id: number;
  clienteId: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  itens?: ItemPedido[];
}

export interface FormItemPedido {
  produtoId: number | string;
  quantidade: number;
}