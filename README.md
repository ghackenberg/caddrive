# FHOOE Virtual Engineering Platform

The FHOOE Virtual Engineering Platform provides a free and open source solution to collaborative product audits over the Web and in virtual reality (VR).

## Screenshots

Here is a recent screenshot of the software in action:

![Screenshot](screenshot.png)

## Scripts

The software provides the following scripts:

### Install dependencies

Install third party dependencies as follows:

```
npm install
```

### Start development

Start the software in development mode as follows:

```
npm run devel
```

### Start production

Start the software in production mode as follows:

```
npm run clean
npm run build
npm start
```

## Diagrams

The software exhibits the following architecture:

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

Data structure...

```mermaid
classDiagram
    class User {
        id: string
        email: string
    }
    class Product {
        id: string
        name: string
    }
    class Version {
        id: string
        name: string
        date: number
    }
    class Model {
        data: binary
    }
    class Node {
        name: string
    }
    class Audit {
        id: string
        start: number
        end: number
    }
    class Event {
        time: number
    }
    class CommentEvent {
        text: string
    }
    class EnterEvent {

    }
    class LeaveEvent {

    }
    Product *-- Version
    Version *-- Model
    Version *-- Audit
    Model *-- Node
    Node *-- Node
    Audit *-- Event
    Event <|-- EnterEvent
    Event <|-- LeaveEvent
    Event <|-- CommentEvent
    Event ..> User
    CommentEvent ..> Node
```

## Modules

The software comprises the following modules:

* [Common](common)
* [Broker](broker)
* [Backend](backend)
* [Worker](worker)
* [Frontend](frontend)
* [Gateway](gateway)

## Documenations

Here are some more resources to read through:

* [License](LICENSE.md)
* [Changelog](CHANGELOG.md)
* [Contributing](CONTRIBUTING.md)