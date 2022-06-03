import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import {
  InjectKafkaClient,
  PolyflixKafkaValue,
  TriggerType
} from "@polyflix/x-utils";
import { UserDto } from "../../application/dto/user.dto";
import { UserService } from "../services/user.service";

//todo change message format send by the legacy to fit PolyflixKafkaValue
interface PolyflixCustomKafkaValue extends PolyflixKafkaValue {
  fields: any;
}

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @EventPattern("polyflix.user")
  async process(@Payload("value") message: PolyflixCustomKafkaValue) {
    // const payload = message.fields;
    // console.log("event")
    this.logger.log(
      `Receive message from topic: polyflix.user - trigger: ${message.trigger}`
    );

    const userDto: UserDto = {
      id: message.payload?.id,
      avatar: message.payload?.avatar,
      firstName: message.payload?.firstName,
      lastName: message.payload?.lastName
    };

    // const user: UserDto = Object.assign(new UserDto(), payload);
    switch (message.trigger) {
      case TriggerType.UPDATE:
        await this.userService.update(userDto);
        break;
      case TriggerType.CREATE:
        await this.userService.create(userDto);
        break;
    }
  }
}
