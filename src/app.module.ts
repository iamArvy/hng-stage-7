import { validationSchema } from './config/validation.schema';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';
import { WinstonModule } from 'nest-winston';
import { appConfig, winstonConfig } from './config';
import { UserModule } from './modules/user/user.module';
import { DBModule } from './db/db.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
    }),
    WinstonModule.forRoot(winstonConfig),
    DBModule,
    PaymentModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
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
