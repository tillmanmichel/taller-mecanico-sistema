import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly log = new Logger('AuthService');

  constructor(
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // Al arrancar: si no existe ningún usuario, crea el administrador con los datos del .env
  async onModuleInit() {
    if ((await this.usuarios.count()) > 0) return;
    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@taller.com');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'admin123');
    await this.usuarios.save(this.usuarios.create({
      nombre: 'Administrador',
      email,
      passwordHash: await bcrypt.hash(password, 10),
    }));
    this.log.log(`Usuario administrador creado: ${email}`);
  }

  async login(email: string, password: string) {
    const usuario = await this.usuarios.findOne({
      where: { email },
      select: { id: true, nombre: true, email: true, passwordHash: true },
    });
    // Mismo mensaje en ambos casos para no revelar qué correos existen
    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    const payload = { sub: usuario.id, email: usuario.email, nombre: usuario.nombre };
    return {
      token: await this.jwt.signAsync(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }
}
