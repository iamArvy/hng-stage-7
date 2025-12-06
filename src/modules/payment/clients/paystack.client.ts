import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

@Injectable()
export class PaystackHttpClient {
  protected axiosClient: AxiosInstance;
  protected readonly logger = new Logger('PaystackClient');

  constructor(config: ConfigService) {
    const secretKey = config.get<string>('PAYSTACK_SECRET_KEY');
    const baseURL = 'https://api.paystack.co';

    if (!secretKey) {
      this.logger.error('PAYSTACK_SECRET_KEY not configured');
    }

    this.axiosClient = axios.create({
      baseURL,
      timeout: 8000,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Automatically transform errors
    this.axiosClient.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error),
    );
  }

  /**
   * Generic request handler for Paystack APIs
   */
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    if (!this.axiosClient.defaults.headers.Authorization) {
      throw new ServiceUnavailableException('Paystack not configured');
    }

    const res = await this.axiosClient.request<T>(config);
    return res.data;
  }

  /**
   * Convert Axios errors → proper NestJS errors
   */
  private handleError(error: AxiosError): never {
    const status = error.response?.status ?? 500;

    const upstream = error.response?.data;

    const payload =
      upstream && typeof upstream === 'object'
        ? upstream
        : { message: error.message };

    this.logger.error(`[Paystack] ${status} → ${JSON.stringify(payload)}`);

    throw new HttpException(payload, status);
  }
}
