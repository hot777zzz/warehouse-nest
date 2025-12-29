#!/bin/bash
# Docker database initialization script for nest-admin
# This script properly initializes the MySQL database in Docker container

echo "Nest Admin Database Initialization Script (Docker Version)"

# Default values
CONTAINER_NAME="mysql-server"
DB_NAME="nestadmin"
DB_USER="root"
DB_PASS="123456"  # You should change this to your actual MySQL root password

echo "Using Docker container: $CONTAINER_NAME"
echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "Error: Container $CONTAINER_NAME is not running!"
    echo "Please start your MySQL container first."
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database $DB_NAME if it doesn't exist..."
docker exec $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"

# Execute the init script that was copied to the container
echo "Executing init script from container..."
docker exec $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASS $DB_NAME < /Users/hot7/Downloads/nest-admin/server/db/init.sql

echo "Database initialization completed!"