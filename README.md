#  Omni Search API

API RESTful de búsqueda avanzada de productos de alto rendimiento, construida con **NestJS**, **Elasticsearch**, **Redis** y **Arquitectura Hexagonal** (Puertos y Adaptadores).

---

## Arquitectura y Decisiones de Diseño

El proyecto sigue estrictamente los principios de **Arquitectura Hexagonal (Clean Architecture)** para garantizar desacoplamiento, mantenibilidad y facilidad de pruebas unitarias:

```text
src/
├── search/
│   ├── domain/               # Reglas de negocio puras (Entidades e Interfaces/Puertos)
│   │   ├── entities/         # Product
│   │   └── ports/            # SearchRepository, CacheRepository
│   │
│   ├── application/          # Casos de Uso y DTOs de entrada
│   │   ├── dtos/             # SearchQueryDto con validaciones y Swagger
│   │   └── use-cases/        # SearchProductsUseCase, AutocompleteUseCase
│   │
│   └── infrastructure/       # Adaptadores de tecnología externa
│       ├── adapters/         # ElasticsearchRepository, RedisRepository
│       └── http/             # SearchController
```

###  Características Clave
* **Búsqueda Fuzziness & Multi-match:** Tolera errores ortográficos y prioriza coincidencias en el título sobre la descripción.
* **Filtros Avanzados & Paginación:** Filtrado por categoría, subcategoría, ubicación, rango de precios (`minPrice`, `maxPrice`) y ordenamiento dinámico.
* **Autocompletado Ultra Rápido (Typeahead):** Sugerencias instantáneas de búsqueda basadas en prefijos.
* **Caché de 2 Niveles (Redis):** Reduce la carga en Elasticsearch mediante almacenamiento en caché con TTL de 60s para búsquedas y 30s para sugerencias.
* **Documentación Interactiva:** OpenAPI / Swagger preconfigurado.
* **Resiliencia & Healthchecks:** Docker Compose con dependencias ordenadas mediante `healthcheck` para asegurar la disponibilidad de servicios.

---

##  Stack Tecnológico

* **Framework:** NestJS (Node.js 20 / TypeScript)
* **Search Engine:** Elasticsearch 8.x
* **Cache:** Redis
* **Containerization:** Docker & Docker Compose
* **Documentation:** OpenAPI (Swagger)
* **Testing:** Jest

---

##  Inicio Rápido (Quick Start)

### Requisitos Previos
* Docker y Docker Compose instalados.
* Node.js v20+ (opcional, para desarrollo local).

### 1. Clonar e Iniciar el Proyecto
Ejecuta el entorno multi-contenedor en un solo comando:

```bash
docker-compose up -d --build
```

Esto levantará automáticamente:
* **API Service:** `http://localhost:3000`
* **Elasticsearch:** `http://localhost:9200`
* **Redis:** `http://localhost:6379`

### 2. Poblar la Base de Datos (Seeding)
Una vez que los contenedores estén listos, ejecuta el script de poblamiento de datos iniciales:

```bash
docker exec omni-search-api npm run seed
```

> *Alternativa local:* `npx ts-node src/scripts/seed.ts`

---

## Documentación Interactiva (Swagger)

Una vez iniciada la aplicación, accede a la documentación visual e interactiva para probar los endpoints:

 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

### Endpoints Principales

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/search` | Búsqueda general de productos con filtros, paginación y caché |
| `GET` | `/api/v1/search/suggestions` | Sugerencias de autocompletado por prefijo (`?q=zap`) |

---

## Pruebas Unitarias (Testing)

El proyecto cuenta con pruebas unitarias para los Casos de Uso y Controladores, aislando las dependencias mediante Mocks:

```bash
# Ejecutar suite de pruebas
npm run test

# Ver reporte de cobertura
npm run test:cov
```