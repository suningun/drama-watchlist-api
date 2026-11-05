import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    login(username: string, password: string) {
        if (username !== 'admin' || password !== 'password123') {
        throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: username };
        return { access_token: this.jwtService.sign(payload) };
    }
}