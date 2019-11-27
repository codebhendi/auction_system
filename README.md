# Simple Cab Syste
Simple cab ordering and history reviewing system.

## Starting the node server
1. After cloning this repository go to 'server' directory.
2. Create following environment variable.
```
DB_PASSWORD
DB_USER
DB_NAME
DB_HOST
TOKEN_SECRET
```
3. After that install all packages using npm install. All packages are creatd for node version 12.
4. After that install knex globally using npm install -g knex.
5. Then to create migrations run knex migrate:latest.
6 Then to run the server run npm run start.

### Starting the web server.
1. Go to web directory.
2. DO npm install to install all dependencies.
3. Install react-scripts globally using npm install -g react-scripts.
4. Run the development server using npm run start.
