import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProdutoDto {
  @ApiProperty() @IsString() nome: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descricao?: string;
  @ApiProperty() @IsNumber() preco: number;
}
