import { IsNotEmpty, Length } from "class-validator";

export class UserDto {
    userId?: number;

    @IsNotEmpty()
    @Length(7)
    username: string;

    @IsNotEmpty()
    @Length(8)
    password: string;
}