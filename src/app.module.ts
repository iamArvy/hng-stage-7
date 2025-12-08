import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';
import { WinstonModule } from 'nest-winston';
import { DBModule } from './db/db.module';
import { config, validationSchema, WinstonConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema,
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const winstonConfig =
          config.getOrThrow<WinstonConfig>('logger.winston');
        return winstonConfig;
      },
    }),
    DBModule,
    PaymentModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}

/*
Security Considerations (Simple)
  Don’t expose your secret keys.
  Make sure only Google redirects back to your callback.
  Verify Paystack webhooks so strangers can’t fake payment updates.
Error Handling & Idempotency
  Use the reference as idempotency key for Paystack transactions. If duplicate initiation is detected, return the existing transaction to the initiator of the transaction only.
  Return clear error codes and messages.
*/
