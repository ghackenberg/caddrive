# CADdrive

**CADdrive** (see https://caddrive.org and https://caddrive.com) provides an open source solution for collaborative product design. We support version management for CAD models, as well as issue management and milestone management. In issues, you can refer to parts and assemblies of CAD models through markdown references. The references help to make the discussion more self-explanatory and easy to understand.

## Screenshots

### 📷 Versions view

The versions view shows the history of the CAD models that have been developed for the product.

![Versions](screenshots/versions.png)

### 📷 Issues view

The issues view provides an overview of open and closed issues for the product design team.

![Issue](screenshots/issues.png)

### 📷 Comments view

The comments view enables discussion between stakeholders and engineers around issues.

![Issue](screenshots/comments.png)

## Tools

**CADdrive** requires the following tools:

- node@^16
- npm@^9

## Scripts

The software provides the following scripts:

### 📄 Install dependencies

Install third party dependencies as follows:

```
npm install
```

### 📄 Start development

Start the software in development mode as follows:

```
npm run dev
```

### 📄 Start production

Start the software in production mode as follows:

```
npm run clean
npm run build

# Mail configuration

export SMTP_HOST=<host name or IP address>
export SMTP_PORT=<port number>
export SMTP_SECURE=<true|false>
export SMTP_AUTH_USER=<user name>
export SMTP_AUTH_PASS=<password>

# Database configuration

export TYPEORM_TYPE=<sqlite|postgres>
# ... for sqlite
export TYPEORM_DATABASE=<path to sqlite database file>
# ... for postgres
export TYPEORM_HOST=<host name or IP address>
export TYPEORM_PORT=<port number>
export TYPEORM_DATABASE=<database name>
export TYPEORM_USERNAME=<user name>
export TYPEORM_PASSWORD=<passwpord>

npm start
```

## Diagrams

### 📊 Package structure

The software exhibits the following package structure:

![Modules](diagrams/packages-v2.png)

### 📊 Entity structure

The software implements the following entity structure:

![Entities](diagrams/entities-v3.png)

## Documenations

Here are some more resources to read through:

* [License](LICENSE.md)
* [Changelog](CHANGELOG.md)
* [Contributing](CONTRIBUTING.md)
