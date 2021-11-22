# ProductBoard

ProductBoard provides a free and open source solution to collaborative product audits over the Web and in virtual reality (VR).

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

### Module structure

The software exhibits the following module structure:

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

### Data structure

The software implements the following data structure:

```mermaid
classDiagram
    class User {
        id: string
    }
    class UserData {
        name: string
        email: string
    }
    class Product {
        id: string
    }
    class ProductData {
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
    }
    class AuditData {
        name: string
        start: string
        end: string
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
    Product <|-- ProductData
    Version *-- Model
    Version *-- Audit
    Model *-- Node
    Node *-- Node
    Audit *-- Event
    Audit <|-- AuditData
    Event <|-- EnterEvent
    Event <|-- LeaveEvent
    Event <|-- CommentEvent
    Event ..> User
    User <|-- UserData
    CommentEvent ..> Node
```

## Modules

The software comprises the following modules:

* [Common](common/README.md)
* [Broker](broker/README.md)
* [Backend](backend/README.md)
* [Worker](worker/README.md)
* [Frontend](frontend/README.md)
* [Gateway](gateway/README.md)

## Documenations

Here are some more resources to read through:

* [License](LICENSE.md)
* [Changelog](CHANGELOG.md)
* [Contributing](CONTRIBUTING.md)