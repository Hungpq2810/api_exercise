import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { GenderEnum } from 'src/enums';
import {
  BeforeInsert,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'phone_number', nullable: false, unique: true })
  phoneNumber: string;

  @Column({
    name: 'gender',
    nullable: false,
    type: 'enum',
    enum: GenderEnum,
  })
  gender: string;

  @Column({ name: 'address', nullable: false })
  address: string;

  @Column({ name: 'birthday', nullable: false })
  birthday: Date;

  @Column({
    name: 'avatar_url',
    nullable: false,
    default: null,
  })
  avatarUrl: string;

  @Column({name: "password_reset_token", nullable: true})
  passwordResetToken: string;

  @Column({name: "password_reset_token_expire", nullable: true})
  passwordResetTokenExpire: Date;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  @BeforeInsert()
  public setCreateDate(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }

  @BeforeSoftRemove()
  public setDeleteDate(): void {
    this.deletedAt = new Date();
  }
}
