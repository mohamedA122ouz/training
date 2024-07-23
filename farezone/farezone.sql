-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2024 at 10:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farezone`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `changePassByAdmin` (IN `pass` VARCHAR(20), IN `id1` INT)   UPDATE user u SET u.password = pass,u.isFirstTime = true WHERE u.id = id1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `changePassByUser` (IN `pass` TEXT, IN `id1` INT)   UPDATE user u SET u.password = pass ,u.isFirstTime=false WHERE u.id = id1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createCar` (IN `name1` VARCHAR(50), IN `date1` DATE, IN `model1` VARCHAR(50))   INSERT car(date,name,model) VALUES(date1,name1,model1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser` (IN `name1` VARCHAR(50), IN `password1` TEXT)   INSERT user(name,password,isFirstTime) VALUES(name1,password1,true)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `name` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`id`, `date`, `name`, `model`) VALUES
(3, '2024-07-03', 'nessan sunny', 'model2024'),
(4, '2024-07-27', 'speed1', 'model2025'),
(5, '2024-07-27', 'speed2', 'model2025'),
(6, '2024-07-27', 'speed4', 'model2025'),
(7, '2024-07-26', 'speed5', 'model2025');

-- --------------------------------------------------------

--
-- Table structure for table `suggestedcars`
--

CREATE TABLE `suggestedcars` (
  `uId` int(11) NOT NULL,
  `cId` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `uniqueHelper` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suggestedcars`
--

INSERT INTO `suggestedcars` (`uId`, `cId`, `id`, `uniqueHelper`) VALUES
(13, 4, 4, '134'),
(13, 3, 5, '133'),
(13, 7, 6, '137');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `isFirstTime` tinyint(1) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `isFirstTime`, `isAdmin`) VALUES
(9, 'admin', 'sha1$f5e342a3$1$9eaa889a322650d52e5cc51de643620c5530be08', 0, 1),
(13, 'user1', 'sha1$12a6cae0$1$e4e9b0d6bf9766ce47c4309b399b9c86a354bc77', 0, 0),
(17, 'user2', 'sha1$bc0d4904$1$54b836d1e74374db126e38dde0d0d356c625d7e1', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suggestedcars`
--
ALTER TABLE `suggestedcars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniqueHelper` (`uniqueHelper`),
  ADD KEY `uId` (`uId`),
  ADD KEY `cId` (`cId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car`
--
ALTER TABLE `car`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `suggestedcars`
--
ALTER TABLE `suggestedcars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `suggestedcars`
--
ALTER TABLE `suggestedcars`
  ADD CONSTRAINT `suggestedcars_ibfk_1` FOREIGN KEY (`cId`) REFERENCES `car` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `suggestedcars_ibfk_2` FOREIGN KEY (`uId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
