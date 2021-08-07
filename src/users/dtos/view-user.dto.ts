import { Expose } from "class-transformer"

export class ViewUserDto {

    @Expose()
    id: number

    @Expose()
    email: string
    
}