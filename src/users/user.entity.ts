import { Report } from "../reports/report.entity"
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, BeforeRemove, OneToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    admin: boolean

    @Column({default: true})
    email: string;

    @Column()
    password: string

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

    @AfterInsert()
    logInsert() {
        console.log(`Inserted user with id: ${this.id}`)
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Updated user with id: ${this.id}`)
    }

    @AfterRemove()
    logRemove() {
        console.log(`Removed user with id: ${this.id}`)
    }

    @BeforeRemove()
    logRemove2() {
        console.log(`Removing user with id: ${this.id}`)
    }
}