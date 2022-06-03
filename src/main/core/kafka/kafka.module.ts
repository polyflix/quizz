import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";
// import { KAFKA_CLIENT, microserviceConfig } from "src/main/config/kafka.config";
import { kafkaConfig, KAFKA_CLIENT } from "@polyflix/x-utils";

@Global()
@Module({
  providers: [
    {
      provide: KAFKA_CLIENT,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          kafkaConfig(configService.get("kafka"))
        );
      },
      inject: [ConfigService]
    }
  ],

  exports: [KAFKA_CLIENT]
})
export class KafkaModule {}
