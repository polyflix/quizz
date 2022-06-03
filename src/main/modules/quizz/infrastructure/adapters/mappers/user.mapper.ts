import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { UserEntity } from "../repositories/entities/user.entity";
import { User, UserProps } from "../../../domain/models/user.model";
import { UserDto } from "../../../application/dto/user.dto";

@Injectable()
export class UserEntityMapper extends AbstractMapper<UserEntity, User> {
  apiToEntity(apiModel: User): UserEntity {
    const userEntity: UserEntity = {
      userId: apiModel.id,
      avatar: apiModel.avatar,
      firstName: apiModel.firstName,
      lastName: apiModel.lastName
    };
    return Object.assign(new UserEntity(), userEntity);
  }

  entityToApi(entity: UserEntity): User {
    const userProps: UserProps = {
      id: entity.userId,
      avatar: entity.avatar,
      firstName: entity.firstName,
      lastName: entity.lastName
    };

    return User.create(Object.assign(new UserProps(), userProps));
  }
}

@Injectable()
export class UserApiMapper extends AbstractMapper<User, UserDto> {
  apiToEntity(apiModel: UserDto): User {
    const userProps: UserProps = {
      id: apiModel.id,
      avatar: apiModel.avatar,
      firstName: apiModel.firstName,
      lastName: apiModel.lastName
    };

    return User.create(Object.assign(new UserProps(), userProps));
  }

  entityToApi(entity: User): UserDto {
    const userDto: UserDto = {
      id: entity.id,
      avatar: entity.avatar,
      firstName: entity.firstName,
      lastName: entity.lastName
    };
    return Object.assign(new UserDto(), userDto);
  }
}
