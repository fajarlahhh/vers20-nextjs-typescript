/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : vers20

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 04/04/2022 17:39:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Contracts
-- ----------------------------
DROP TABLE IF EXISTS `Contracts`;
CREATE TABLE `Contracts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` int DEFAULT NULL,
  `profit` int DEFAULT NULL,
  `amountPerWithdrawal` double DEFAULT NULL,
  `sponsorshipBenefits` double DEFAULT NULL,
  `firstLevelBenefits` double DEFAULT NULL,
  `secondLevelBenefits` double DEFAULT NULL,
  `thirdLevelBenefits` double DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Contracts
-- ----------------------------
BEGIN;
INSERT INTO `Contracts` VALUES (1, 'Bronze', 100, 60, 5, 8, 3, 2, 1, '2022-04-01 22:05:32', '2022-04-01 22:05:32');
INSERT INTO `Contracts` VALUES (2, 'Silver', 500, 450, 37.5, 40, 15, 10, 5, '2022-04-01 22:06:38', '2022-04-01 22:06:38');
INSERT INTO `Contracts` VALUES (3, 'Gold', 1000, 1200, 100, 80, 30, 20, 10, '2022-04-01 22:07:12', '2022-04-01 22:07:44');
INSERT INTO `Contracts` VALUES (4, 'Platinum', 5000, 7500, 625, 400, 150, 100, 50, '2022-04-01 22:07:39', '2022-04-01 22:08:50');
INSERT INTO `Contracts` VALUES (5, 'Crown', 10000, 18000, 1500, 800, 300, 200, 100, '2022-04-01 22:11:39', '2022-04-01 22:11:39');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
