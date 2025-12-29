#!/bin/bash

# MySQL容器配置
CONTAINER_NAME="mysql-server"
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="nestadmin"
DB_USER="root"
DB_PASSWORD="123456"

# SQL文件路径 - 使用修复后的版本
SQL_FILE="./db/warehouse_init_fixed.sql"

echo "开始导入数据库..."

# 检查Docker是否运行
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "MySQL容器 $CONTAINER_NAME 未运行，启动一个新的MySQL容器..."
    docker run -d \
        --name $CONTAINER_NAME \
        -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD \
        -e MYSQL_DATABASE=$DB_NAME \
        -p $DB_PORT:3306 \
        mysql:8.0 \
        --character-set-server=utf8mb4 \
        --collation-server=utf8mb4_unicode_ci
fi

# 等待MySQL服务启动
echo "等待MySQL服务启动..."
sleep 10

# 检查SQL文件是否存在
if [ ! -f "$SQL_FILE" ]; then
    echo "错误: 找不到SQL文件 $SQL_FILE"
    exit 1
fi

# 将SQL文件复制到容器中并执行
echo "正在将 $SQL_FILE 导入到数据库 $DB_NAME ..."
docker cp "$SQL_FILE" "$CONTAINER_NAME:/tmp/warehouse_init_fixed.sql"

# 执行SQL导入
docker exec -i $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "数据库导入成功！"
else
    echo "数据库导入失败！"
    exit 1
fi

echo "导入完成。"