
DROP TABLE IF EXISTS `wh_category`;
CREATE TABLE `wh_category` (
  `category_id` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '分类名称',
  `code` varchar(50) NOT NULL COMMENT '分类编码',
  `parent_id` int DEFAULT 0 COMMENT '父分类ID',
  `order_num` int DEFAULT 0 COMMENT '显示顺序',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='物资分类表';

-- ----------------------------
-- 供应商表
-- ----------------------------
DROP TABLE IF EXISTS `wh_supplier`;
CREATE TABLE `wh_supplier` (
  `supplier_id` int NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `code` varchar(50) NOT NULL COMMENT '供应商编码',
  `name` varchar(100) NOT NULL COMMENT '供应商名称',
  `contact` varchar(50) DEFAULT '' COMMENT '联系人',
  `phone` varchar(20) DEFAULT '' COMMENT '联系电话',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱',
  `address` varchar(255) DEFAULT '' COMMENT '地址',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `idx_supplier_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- ----------------------------
-- 物资表
-- ----------------------------
DROP TABLE IF EXISTS `wh_material`;
CREATE TABLE `wh_material` (
  `material_id` int NOT NULL AUTO_INCREMENT COMMENT '物资ID',
  `code` varchar(50) NOT NULL COMMENT '物资编码',
  `name` varchar(100) NOT NULL COMMENT '物资名称',
  `category_id` int NOT NULL COMMENT '分类ID',
  `category_name` varchar(100) DEFAULT '' COMMENT '分类名称',
  `specification` varchar(200) DEFAULT '' COMMENT '规格型号',
  `unit` varchar(20) NOT NULL COMMENT '单位',
  `stock` int DEFAULT 0 COMMENT '当前库存',
  `safe_stock` int DEFAULT 0 COMMENT '安全库存',
  `supplier_id` int DEFAULT NULL COMMENT '供应商ID',
  `supplier_name` varchar(100) DEFAULT '' COMMENT '供应商名称',
  `price` decimal(10,2) DEFAULT 0.00 COMMENT '单价',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0存在 1删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`material_id`),
  UNIQUE KEY `idx_material_code` (`code`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_supplier_id` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='物资表';

-- ----------------------------
-- 出入库记录表
-- ----------------------------
DROP TABLE IF EXISTS `wh_stock_record`;
CREATE TABLE `wh_stock_record` (
  `record_id` int NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `record_no` varchar(50) NOT NULL COMMENT '记录编号',
  `material_id` int NOT NULL COMMENT '物资ID',
  `material_code` varchar(50) NOT NULL COMMENT '物资编码',
  `material_name` varchar(100) NOT NULL COMMENT '物资名称',
  `type` varchar(10) NOT NULL COMMENT '操作类型：in入库 out出库',
  `quantity` int NOT NULL COMMENT '数量',
  `before_stock` int NOT NULL COMMENT '操作前库存',
  `after_stock` int NOT NULL COMMENT '操作后库存',
  `supplier_id` int DEFAULT NULL COMMENT '供应商ID',
  `supplier_name` varchar(100) DEFAULT '' COMMENT '供应商名称',
  `receiver` varchar(50) DEFAULT '' COMMENT '领用人',
  `department` varchar(100) DEFAULT '' COMMENT '领用部门',
  `operator` varchar(50) NOT NULL COMMENT '操作人',
  `operate_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `remark` varchar(500) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`record_id`),
  KEY `idx_material_id` (`material_id`),
  KEY `idx_type` (`type`),
  KEY `idx_operate_time` (`operate_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='出入库记录表';

-- ----------------------------
-- 初始化分类数据
-- ----------------------------
INSERT INTO `wh_category` (`name`, `code`, `parent_id`, `order_num`, `create_by`) VALUES
('办公家具', 'FL001', 0, 1, 'admin'),
('办公用品', 'FL002', 0, 2, 'admin'),
('电子设备', 'FL003', 0, 3, 'admin'),
('劳保用品', 'FL004', 0, 4, 'admin');

-- 子分类
INSERT INTO `wh_category` (`name`, `code`, `parent_id`, `order_num`, `create_by`) VALUES
('桌类', 'FL001-01', 1, 1, 'admin'),
('椅类', 'FL001-02', 1, 2, 'admin'),
('纸张类', 'FL002-01', 2, 1, 'admin'),
('文具类', 'FL002-02', 2, 2, 'admin');

-- ----------------------------
-- 初始化供应商数据
-- ----------------------------
INSERT INTO `wh_supplier` (`code`, `name`, `contact`, `phone`, `email`, `address`, `create_by`) VALUES
('GYS001', '家具供应商A', '张三', '13800138001', 'zhangsan@example.com', '北京市朝阳区xxx街道', 'admin'),
('GYS002', '文具供应商B', '李四', '13800138002', 'lisi@example.com', '上海市浦东新区xxx路', 'admin'),
('GYS003', '电子设备供应商C', '王五', '13800138003', 'wangwu@example.com', '深圳市南山区xxx大厦', 'admin'),
('GYS004', '劳保用品供应商D', '赵六', '13800138004', 'zhaoliu@example.com', '广州市天河区xxx园区', 'admin');

-- ----------------------------
-- 初始化物资数据
-- ----------------------------
INSERT INTO `wh_material` (`code`, `name`, `category_id`, `category_name`, `specification`, `unit`, `stock`, `safe_stock`, `supplier_id`, `supplier_name`, `price`, `create_by`) VALUES
('WZ001', '办公桌', 1, '办公家具', '1.4m*0.7m', '张', 50, 10, 1, '家具供应商A', 800.00, 'admin'),
('WZ002', '办公椅', 1, '办公家具', '标准型', '把', 80, 20, 1, '家具供应商A', 350.00, 'admin'),
('WZ003', 'A4打印纸', 2, '办公用品', '70g', '包', 5, 50, 2, '文具供应商B', 25.00, 'admin'),
('WZ004', '签字笔', 2, '办公用品', '0.5mm黑色', '支', 200, 100, 2, '文具供应商B', 2.50, 'admin'),
('WZ005', '笔记本电脑', 3, '电子设备', '14寸', '台', 15, 5, 3, '电子设备供应商C', 5500.00, 'admin'),
('WZ006', '文件夹', 2, '办公用品', 'A4', '个', 15, 50, 2, '文具供应商B', 5.00, 'admin'),
('WZ007', '订书机', 2, '办公用品', '标准型', '个', 3, 20, 2, '文具供应商B', 15.00, 'admin'),
('WZ008', '胶带', 2, '办公用品', '透明', '卷', 8, 30, 2, '文具供应商B', 3.00, 'admin');

-- ----------------------------
-- 初始化出入库记录数据
-- ----------------------------
INSERT INTO `wh_stock_record` (`record_no`, `material_id`, `material_code`, `material_name`, `type`, `quantity`, `before_stock`, `after_stock`, `supplier_id`, `supplier_name`, `operator`, `remark`) VALUES
('RK202401001', 1, 'WZ001', '办公桌', 'in', 20, 30, 50, 1, '家具供应商A', 'admin', '采购入库'),
('CK202401001', 2, 'WZ002', '办公椅', 'out', 10, 90, 80, NULL, '', 'admin', '行政部领用'),
('RK202401002', 3, 'WZ003', 'A4打印纸', 'in', 100, 5, 105, 2, '文具供应商B', 'admin', '紧急补货'),
('CK202401002', 3, 'WZ003', 'A4打印纸', 'out', 100, 105, 5, NULL, '', 'admin', '财务部领用'),
('RK202401003', 5, 'WZ005', '笔记本电脑', 'in', 5, 10, 15, 3, '电子设备供应商C', 'admin', '新设备采购');

-- ----------------------------
-- 添加仓库管理菜单
-- ----------------------------
-- 注意：以下SQL需要根据您系统中sys_menu表的实际结构调整
-- 如果您的菜单表结构不同，请相应修改

-- 仓库管理主菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('仓库管理', 0, 5, 'warehouse', NULL, NULL, 1, 0, 'M', '0', '0', '', 'example', 'admin', '仓库管理目录');

SET @warehouse_menu_id = LAST_INSERT_ID();

-- 数据看板
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('数据看板', @warehouse_menu_id, 1, 'dashboard', 'warehouse/dashboard/index', NULL, 1, 0, 'C', '0', '0', 'warehouse:dashboard:list', 'chart', 'admin', '数据看板菜单');

-- 物资管理
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('物资管理', @warehouse_menu_id, 2, 'material', 'warehouse/material/index', NULL, 1, 0, 'C', '0', '0', 'warehouse:material:list', 'list', 'admin', '物资管理菜单');

SET @material_menu_id = LAST_INSERT_ID();

-- 物资管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('物资查询', @material_menu_id, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:material:query', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('物资新增', @material_menu_id, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:material:add', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('物资修改', @material_menu_id, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:material:edit', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('物资删除', @material_menu_id, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:material:remove', '#', 'admin', '');

-- 分类管理
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('分类管理', @warehouse_menu_id, 3, 'category', 'warehouse/category/index', NULL, 1, 0, 'C', '0', '0', 'warehouse:category:list', 'tree', 'admin', '分类管理菜单');

SET @category_menu_id = LAST_INSERT_ID();

-- 分类管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('分类查询', @category_menu_id, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:category:query', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('分类新增', @category_menu_id, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:category:add', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('分类修改', @category_menu_id, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:category:edit', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('分类删除', @category_menu_id, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:category:remove', '#', 'admin', '');

-- 供应商管理
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('供应商管理', @warehouse_menu_id, 4, 'supplier', 'warehouse/supplier/index', NULL, 1, 0, 'C', '0', '0', 'warehouse:supplier:list', 'peoples', 'admin', '供应商管理菜单');

SET @supplier_menu_id = LAST_INSERT_ID();

-- 供应商管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('供应商查询', @supplier_menu_id, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:supplier:query', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('供应商新增', @supplier_menu_id, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:supplier:add', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('供应商修改', @supplier_menu_id, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:supplier:edit', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('供应商删除', @supplier_menu_id, 4, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:supplier:remove', '#', 'admin', '');

-- 出入库管理
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('出入库管理', @warehouse_menu_id, 5, 'stock', 'warehouse/stock/index', NULL, 1, 0, 'C', '0', '0', 'warehouse:stock:list', 'form', 'admin', '出入库管理菜单');

SET @stock_menu_id = LAST_INSERT_ID();

-- 出入库管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('出入库查询', @stock_menu_id, 1, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:stock:query', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('入库操作', @stock_menu_id, 2, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:stock:in', '#', 'admin', '');
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `remark`)
VALUES ('出库操作', @stock_menu_id, 3, '', NULL, NULL, 1, 0, 'F', '0', '0', 'warehouse:stock:out', '#', 'admin', '');
