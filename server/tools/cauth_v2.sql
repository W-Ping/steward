/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50722
Source Host           : localhost:3306
Source Database       : cauth

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2018-08-15 01:43:32
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for csessioninfo
-- ----------------------------
DROP TABLE IF EXISTS `csessioninfo`;
CREATE TABLE `csessioninfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

-- ----------------------------
-- Table structure for cycle_info
-- ----------------------------
DROP TABLE IF EXISTS `cycle_info`;
CREATE TABLE `cycle_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordTime` time DEFAULT NULL,
  `recordDate` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '记录日期',
  `timeType` int(11) NOT NULL COMMENT '类型',
  `timeTypeName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '类型说明',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT '版本号',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `_unique` (`recordDate`,`timeType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='一天时间记录';

-- ----------------------------
-- Table structure for task_handle_info
-- ----------------------------
DROP TABLE IF EXISTS `task_handle_info`;
CREATE TABLE `task_handle_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taskId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taskName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taskCreateTime` timestamp NULL DEFAULT NULL,
  `assignerUid` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分配人uid',
  `assignerName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分配人名称',
  `handlerUid` int(11) DEFAULT NULL COMMENT '处理人uid',
  `handlerName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理人名称',
  `e_mail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理人邮件',
  `stat` int(11) NOT NULL DEFAULT '0' COMMENT '任务状态【0：待处理；1：处理中；2：完成；3：分配】',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT '版本号',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `r` (`taskId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for task_info
-- ----------------------------
DROP TABLE IF EXISTS `task_info`;
CREATE TABLE `task_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `uid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '任务创建人',
  `realName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建人名称',
  `handlerUid` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理人uid',
  `handlerName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理人名称',
  `assignTime` timestamp NULL DEFAULT NULL COMMENT '任务分配时间',
  `level` int(11) DEFAULT '1' COMMENT '任务级别',
  `taskName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务名称',
  `taskDescribe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务描述',
  `planHour` double NOT NULL DEFAULT '4' COMMENT '计划时间【小时】',
  `planEndTime` timestamp NULL DEFAULT NULL COMMENT '任务预计结束时间【开始执行时间+计划时间】',
  `endTime` timestamp NULL DEFAULT NULL COMMENT '任务完成时间',
  `startTime` timestamp NULL DEFAULT NULL COMMENT '开始处理时间',
  `stat` int(11) NOT NULL DEFAULT '0' COMMENT '任务状态【0：待处理；1：处理中；2：完成；3：已分配】',
  `version` int(11) NOT NULL DEFAULT '1',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='任务列表';

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户id',
  `nickName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户昵称',
  `realName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `province` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `e_mail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电子邮箱',
  `mobile_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号码',
  `gender` int(11) DEFAULT NULL COMMENT '性别',
  `birthday` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '生日',
  `open` int(11) DEFAULT '0' COMMENT '是否公开【0：是；1：否】',
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司名称',
  `company_region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司地址',
  `company_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司地址坐标【经度,纬度】',
  `company_mail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司邮箱',
  `postcode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司邮编',
  `family_region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `family_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '家庭住址',
  `family_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '家庭地址坐标【经度,纬度】',
  `stat` int(11) NOT NULL DEFAULT '0' COMMENT '状态【0：正常；1：停用】',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT '版本号',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';
