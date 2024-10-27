# Book App Backend

This is the backend for the Book App, providing RESTful APIs for managing books and authors. Built with Node.js, Express, MySQL, and Sequelize.

## Features

- RESTful API for creating, reading, updating, and deleting books and authors
- Integration with MySQL for data storage
- Sequelize ORM for easier database interactions
- API documentation available via Swagger

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Fast, unopinionated web framework for Node.js.
- **MySQL**: Relational database management system.
- **Sequelize**: Promise-based Node.js ORM for MySQL.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/senaid123/book-app-backend.git

2.  Navigate to the project directory:
    ```bash
    cd book-app

3. Install deps
   ```bash
   npm install

4. Create a MySQL database and update the configuration in config/config.json with your database credentials.

5. Run migrations (if using Sequelize migrations):
   ```bash
   npx sequelize-cli db:migrate

6. Start the server:
   ```bash
    npm start

### API DOCUMENTATION
For detailed API documentation, please visit:  https://book-app-production.up.railway.app/api-docs/#/

