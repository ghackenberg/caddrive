# FH OÖ Product Audit Platform

The FH OÖ Product Audit Platform provides and open source and license cost free solution to collaborative product audits over the Web and in virtual reality (VR).

## Screenshots

![Screenshot](./screenshot.png)

## Scripts

Install dependencies.

```
npm install
```

Start development.

```
npm run devel
```

Start production.

```
npm run clean
npm run build
npm start
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
    class Broker {

    }
    class Gateway {
        port = 3000
    }
    
    <<Service>> Broker
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
* [Broker](./broker)
* [Backend](./backend)
* [Worker](./worker)
* [Frontend](./frontend)
* [Gateway](./gateway)