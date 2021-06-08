# FH OÖ Audit Platform

TODO

## Scripts

Start production.

```
npm run start
```

Start development.

```
npm run start-dev
```

## Diagrams

```mermaid
classDiagram
    class Common
    class Backend {
        port = 3001
    }
    class Worker {
        port = 3002
    }
    class Frontend {
        port = 3003
    }
    class Gateway {
        port = 3000
    }
    
    <<Service>> Backend
    <<Service>> Worker
    <<Service>> Frontend
    <<Service>> Gateway

    Gateway -- Backend: /api
    Gateway -- Worker: /worker.js
    Gateway -- Frontend: /
    Backend -- Common
    Worker -- Common
    Frontend -- Common
```

## Modules

* [Common](./common)
* [Backend](./backend)
* [Frontend](./frontend)
* [Worker](./worker)
* [Gateway](./gateway)