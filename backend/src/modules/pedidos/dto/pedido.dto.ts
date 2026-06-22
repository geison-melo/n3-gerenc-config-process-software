import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ItemPedidoDto {
  @ApiProperty() @IsNumber() produtoId: number;
  @ApiProperty() @IsNumber() quantidade: number;
}

export class CreatePedidoDto {
  @ApiProperty() @IsNumber() clienteId: number;
  @ApiProperty({ type: [ItemPedidoDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => ItemPedidoDto) itens: ItemPedidoDto[];
}
