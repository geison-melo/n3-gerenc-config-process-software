import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClienteDto {
  @ApiProperty() @IsString() nome: string;
  @ApiProperty() @IsEmail() email: string;
}
