# RegexLab

Proyecto inicial para RegexLab con frontend en Next.js y backend en NestJS.

## Requisitos
- Docker y Docker Compose

## Uso
1. Copia `.env.example` a `.env` y ajusta las variables si es necesario.
2. Ejecuta `docker-compose up --build` para levantar los servicios.

## Infraestructura
- **Frontend** preparado para desplegar en Vercel (ver `vercel.json`).
- **Backend** puede desplegarse en Railway (agregar variables y comandos según la plataforma).

## Tests

Instala las dependencias de `backend` y `frontend` (por ejemplo ejecutando `npm install` en cada carpeta) y luego corre desde la raiz:

```bash
npm run test
```

El comando ejecuta los tests de ambos proyectos con Jest y genera reportes de coverage en `backend/coverage` y `frontend/coverage`.
