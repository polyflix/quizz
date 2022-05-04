import { IsOptional } from "class-validator";
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";

/**
 * Base entity for our DB entities.
 * EVERY ENTITY SHOULD EXTENDS AT LEAST THIS ENTITY
 */
export abstract class DefaultEntity {
  @IsOptional({ always: true })
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @IsOptional({ always: true })
  @CreateDateColumn()
  createdAt?: Date;

  @IsOptional({ always: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @IsOptional({ always: true })
  @VersionColumn({ default: 1 })
  __v?: number;
}
