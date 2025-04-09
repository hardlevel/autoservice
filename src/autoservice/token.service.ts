// token.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
    private accessToken: string | null = null;

    constructor(
        private http: HttpService,
        private readonly config: ConfigService,
    ) { }

    async getToken(forceRefresh = false): Promise<string> {
        if (this.accessToken && !forceRefresh) return this.accessToken;
        const { url, client_id, client_secret, grant_type } = this.config.get('token');

        const response = await firstValueFrom(
            this.http.post(url, new URLSearchParams({
                client_id,
                client_secret,
                grant_type,
            }).toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
        );

        this.accessToken = response.data.access_token;
        return this.accessToken;
    }

    clearToken() {
        this.accessToken = null;
    }
}
