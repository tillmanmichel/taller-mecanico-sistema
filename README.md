# Sistema de Gestión para Taller Mecánico Automotriz

backend/  -> API REST (NestJS + TypeORM + PostgreSQL + JWT)
frontend/ -> Interfaz web (React + Vite + Bootstrap)

## Arrancar (3 terminales)
1. Base de datos:  docker start taller_postgres
2. Backend:        cd backend   &&  npm install  &&  npm run start:dev     -> http://localhost:3000
3. Frontend:       cd frontend  &&  npm install  &&  npm run dev           -> http://localhost:5173

Usuario inicial: admin@taller.com / admin123 (se define en backend/.env)

## Endpoints (todos piden "Authorization: Bearer <token>" excepto login)
POST   /auth/login                 GET    /auth/perfil
GET    /clientes?q=                POST   /clientes        PATCH /clientes/:id     DELETE /clientes/:id
GET    /vehiculos?q=&clienteId=    POST   /vehiculos       PATCH /vehiculos/:id    DELETE /vehiculos/:id
GET    /ordenes?estado=            POST   /ordenes         PATCH /ordenes/:id
PATCH  /ordenes/:id/estado         (cotizada -> en_proceso -> terminada -> entregada; cancelada desde cotizada/en_proceso)
GET    /reportes/ordenes?desde=AAAA-MM-DD&hasta=AAAA-MM-DD&estado=
