# CADdrive executables

You can run **CADdrive** in two modes:

- Development mode
- Production mode

## Development mode

Start the software in development mode as follows:

```bash
cd <CADdrive>/packages/node

npm run dev
```

## Production mode

Start the software in production mode as follows:

```bash
cd <CADdrive>/packages/node

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