// src/common/interceptors/axios.interceptor.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosTokenInterceptor implements OnModuleInit {
    private tokenHttp: AxiosInstance;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
    ) {
        this.tokenHttp = axios.create(); // ✅ nova instância do axios, sem interceptores
    }

    onModuleInit() {
        const axios = this.httpService.axiosRef;

        axios.interceptors.request.use(
            async (config) => {
                const token = await this.getAccessToken();
                config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            },
            (error) => Promise.reject(error),
        );
    }

    private async getAccessToken(): Promise<string> {
        const { client_id, client_secret, url } = this.config.get('token');

        const body = new URLSearchParams({
            client_id,
            client_secret,
            grant_type: 'client_credentials',
        });

        try {
            const response = await this.tokenHttp.post(url, body.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            return response.data.access_token;
        } catch (error) {
            console.error('❌ Erro ao obter access_token:', error.message);
            throw error;
        }
    }
}
