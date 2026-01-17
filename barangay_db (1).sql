-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 12, 2026 at 06:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barangay_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit`
--

CREATE TABLE `audit` (
  `id` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `actor_name` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit`
--

INSERT INTO `audit` (`id`, `actor_id`, `actor_name`, `message`, `role`, `created_at`) VALUES
(2, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Updated resident information in Incident Page', 'SuperAdmin', '2026-01-28 07:15:41'),
(4, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted resident information in Incident Page', 'SuperAdmin', '2025-12-27 07:23:37'),
(5, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-27 09:20:09'),
(6, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new resident record in Resident Page', 'SuperAdmin', '2025-12-27 09:22:19'),
(7, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2025-12-27 09:25:08'),
(8, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new member in the household hELLO in Household Pages', 'SuperAdmin', '2025-12-27 09:33:11'),
(9, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added new household record in Household Page', 'SuperAdmin', '2025-12-27 09:34:14'),
(10, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted resident information in Incident Page', 'SuperAdmin', '2025-12-27 09:37:52'),
(11, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Updated resident information in Incident Page', 'SuperAdmin', '2025-12-27 09:39:16'),
(12, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Export the data into excel file in Services Page', 'SuperAdmin', '2025-12-27 09:44:39'),
(13, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new beneficiary Mecasio, Arden Bandoja Jr in service AKAP Certification in Services Page', 'SuperAdmin', '2025-12-27 09:53:11'),
(14, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted beneficary asdasd, asda asdas as in service AKAP Certification', 'SuperAdmin', '2025-12-27 09:56:47'),
(15, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted beneficary Mecasio, Arden Bandoja Jr in service AKAP Certification in Service Page', 'SuperAdmin', '2025-12-27 09:57:21'),
(16, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted a service asd in Services Page', 'SuperAdmin', '2025-12-27 09:58:51'),
(17, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Updated a service record in Services Page', 'SuperAdmin', '2025-12-27 09:59:54'),
(18, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new service record in Services Page', 'SuperAdmin', '2025-12-27 10:00:54'),
(19, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted a service asdasd in Services Page', 'SuperAdmin', '2025-12-27 10:01:51'),
(20, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new beneficiary Montano, Mark Anthony Placido in service AKAP Certifications in Services Page', 'SuperAdmin', '2025-12-27 10:02:01'),
(21, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Exported a certificates in pdf file of in Certificate Page', 'SuperAdmin', '2025-12-27 10:10:09'),
(22, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Exported a certificates in pdf file of in Certificate Page', 'SuperAdmin', '2025-12-27 10:11:22'),
(23, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new record sdad in Official Page', 'SuperAdmin', '2025-12-27 10:20:59'),
(24, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Grant User sdad an access to dashboard,residents,households,incidents,services,certificates,requestpanel,adminsecuritysettings,residentidcard in Official Page', 'SuperAdmin', '2025-12-27 10:21:42'),
(25, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Updated the record of sdadqwqw in Official Page', 'SuperAdmin', '2025-12-27 10:22:24'),
(26, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted the record of  in Official Page', 'SuperAdmin', '2025-12-27 10:22:43'),
(27, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new record asdad in Official Page', 'SuperAdmin', '2025-12-27 10:24:06'),
(28, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted the record of asdad in Official Page', 'SuperAdmin', '2025-12-27 10:24:18'),
(29, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Deleted an event 7 in Event Page', 'SuperAdmin', '2025-12-27 10:28:53'),
(30, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Added a new event Birthday in Event Page', 'SuperAdmin', '2025-12-27 10:30:26'),
(31, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Updated an event Birthday21 in Event Page', 'SuperAdmin', '2025-12-27 10:31:04'),
(32, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) Change the settings', 'SuperAdmin', '2025-12-27 10:34:58'),
(33, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) removed asda asdasd from household hELLO', 'SuperAdmin', '2025-12-28 04:00:25'),
(34, 15, 'dhani (mecasio.a.bsinfotech@gmail.com)', 'User dhani (mecasio.a.bsinfotech@gmail.com) removed asd Dr from household hELLO', 'SuperAdmin', '2025-12-28 04:00:28'),
(35, 3, 'Richard U. Benitez (markmontano999@gmail.com)', 'User Richard U. Benitez (markmontano999@gmail.com) Grant User Fregilda P. Matabang an access to dashboard,residents,households,incidents,services,certificates,officials,calendarpage,settings,requestpanel,audits,adminsecuritysettings,residentidcard in Offi', 'User', '2025-12-28 07:49:14'),
(36, 3, 'Richard U. Benitez (markmontano999@gmail.com)', 'User Richard U. Benitez (markmontano999@gmail.com) Grant User Fregilda P. Matabang an access to dashboard,residents,households,incidents,services,certificates,officials,calendarpage,settings,requestpanel,audits,adminsecuritysettings,residentidcard in Offi', 'User', '2025-12-28 07:56:21'),
(37, 3, 'Richard U. Benitez (markmontano999@gmail.com)', 'User Richard U. Benitez (markmontano999@gmail.com) Grant User Fregilda P. Matabang an access to dashboard,residents,households,incidents,services,certificates,officials,calendarpage,settings,requestpanel,audits,adminsecuritysettings,residentidcard in Offi', 'User', '2025-12-28 07:59:10'),
(38, 3, 'Richard U. Benitez (markmontano999@gmail.com)', 'User Richard U. Benitez (markmontano999@gmail.com) Grant User Fregilda P. Matabang an access to dashboard,residents,households,incidents,services,certificates,officials,calendarpage,settings,requestpanel,auditpage,adminsecuritysettings,residentidcard in O', 'User', '2025-12-28 08:02:12'),
(39, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated access of Fregilda P. Matabang in Officials Page', 'SuperAdmin', '2025-12-29 03:34:03'),
(40, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated access of Fregilda P. Matabang in Officials Page', 'SuperAdmin', '2025-12-29 03:34:16'),
(41, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated access of Fregilda P. Matabang in Officials Page', 'SuperAdmin', '2025-12-29 03:34:17'),
(42, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Grant User Romulo O. Enrica an access to dashboard,residents,households,incidents,services,certificates,adminsecuritysettings,residentidcard in Official Page', 'SuperAdmin', '2025-12-29 03:51:14'),
(43, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Grant User Engr. Manolito R. Callanta an access to dashboard,residents,households,incidents,services,certificates,officials,requestpanel,adminsecuritysettings,residentidcard in Official Page', 'SuperAdmin', '2025-12-29 03:59:06'),
(44, 4, 'Romulo O. Enrica (romulaenrica@gmail.com)', 'User Romulo O. Enrica (romulaenrica@gmail.com) Print the barangay id of a resident in Residents Page', 'User', '2025-12-29 04:03:18'),
(45, 4, 'Romulo O. Enrica (romulaenrica@gmail.com)', 'User Romulo O. Enrica (romulaenrica@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'User', '2025-12-29 04:12:57'),
(46, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:04:26'),
(47, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:04:33'),
(48, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:04:47'),
(49, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:10:31'),
(50, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:10:55'),
(51, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:12:52'),
(52, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:13:01'),
(53, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:14:47'),
(54, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:14:55'),
(55, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:15:02'),
(56, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:18:59'),
(57, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:19:10'),
(58, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:22:13'),
(59, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2025-12-30 04:22:23'),
(60, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-03 07:12:44'),
(61, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-03 07:12:55'),
(62, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-03 07:13:08'),
(63, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added a new event Senior Citizen Christmas party in Event Page', 'SuperAdmin', '2026-01-03 09:12:14'),
(64, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added a new resident record in Resident Page', 'SuperAdmin', '2026-01-03 10:01:31'),
(65, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-03 13:48:08'),
(66, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 16:06:40'),
(67, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:02:01'),
(68, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-03 19:09:01'),
(69, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-03 19:10:20'),
(70, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:14:51'),
(71, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:15:20'),
(72, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:15:42'),
(73, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-03 19:19:06'),
(74, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:19:58'),
(75, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:30:57'),
(76, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:31:11'),
(77, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:33:39'),
(78, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:34:49'),
(79, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:35:07'),
(80, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:39:25'),
(81, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:39:38'),
(82, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:39:52'),
(83, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:41:10'),
(84, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:41:26'),
(85, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:43:46'),
(86, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:44:52'),
(87, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:45:13'),
(88, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:45:45'),
(89, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:49:31'),
(90, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-03 19:49:55'),
(91, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 02:15:45'),
(92, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 06:10:59'),
(93, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:12:48'),
(94, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:12:59'),
(95, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:13:28'),
(96, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:15:13'),
(97, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:16:25'),
(98, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:17:16'),
(99, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:18:02'),
(100, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:18:31'),
(101, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:19:46'),
(102, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:20:14'),
(103, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:20:31'),
(104, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:26:31'),
(105, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:27:38'),
(106, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:32:49'),
(107, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:34:14'),
(108, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:36:24'),
(109, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:48:30'),
(110, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:50:30'),
(111, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:51:34'),
(112, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:51:53'),
(113, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:52:27'),
(114, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:53:23'),
(115, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:53:48'),
(116, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:54:47'),
(117, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:55:46'),
(118, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:56:18'),
(119, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 06:56:44'),
(120, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 06:57:30'),
(121, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 06:58:02'),
(122, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 06:58:38'),
(123, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 07:02:16'),
(124, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 07:02:51'),
(125, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 07:03:09'),
(126, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 07:03:39'),
(127, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 07:04:06'),
(128, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:08:23'),
(129, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:16:59'),
(130, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:17:40'),
(131, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:19:15'),
(132, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 07:24:14'),
(133, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:24:49'),
(134, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:26:19'),
(135, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added a new member in the household hELLO121231 in Household Pages', 'SuperAdmin', '2026-01-05 07:42:12'),
(136, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 07:43:21'),
(137, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 09:10:24'),
(138, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 09:59:32'),
(139, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 09:59:50'),
(140, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 10:04:49'),
(141, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 16:17:41'),
(142, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Print the barangay id of a resident in Residents Page', 'SuperAdmin', '2026-01-05 16:17:48'),
(143, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 16:19:37'),
(144, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 17:47:06'),
(145, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 17:52:48'),
(146, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-05 18:03:56'),
(147, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 02:38:55'),
(148, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document', 'SuperAdmin', '2026-01-06 03:30:00'),
(149, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 03:31:35'),
(150, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 10:40:06'),
(151, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 12:32:29'),
(152, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 13:22:17'),
(153, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:02:20'),
(154, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:32:54'),
(155, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:35:31'),
(156, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:40:21'),
(157, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:48:27'),
(158, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:49:36'),
(159, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:50:17'),
(160, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:51:19'),
(161, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Exported a pdf file of a certificate/document in Certificate Page', 'SuperAdmin', '2026-01-06 14:51:41'),
(162, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Added a new resident record in Resident Page', 'SuperAdmin', '2026-01-08 12:02:35'),
(163, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-08 12:08:43'),
(164, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-08 12:08:53'),
(165, 2, 'Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com)', 'User Fregilda P. Matabang (mecasio.a.bsinfotech@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-08 12:22:09'),
(166, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 00:46:34'),
(167, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:46:42'),
(168, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:46:50'),
(169, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:47:06'),
(170, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:47:17'),
(171, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:47:57'),
(172, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 00:49:12'),
(173, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:49:59'),
(174, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Fregilda P. Matabang in Official Page', 'SuperAdmin', '2026-01-11 00:51:08'),
(175, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:02:27'),
(176, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:02:32'),
(177, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:02:55'),
(178, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Deleted the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:03:14'),
(179, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added a new record Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:04:41'),
(180, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:04:56'),
(181, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:05:42'),
(182, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated the record of Engr. Manolito R. Callanta in Official Page', 'SuperAdmin', '2026-01-11 01:06:07'),
(183, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident information in Incident Page', 'SuperAdmin', '2026-01-12 03:35:29'),
(184, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident information in Incident Page', 'SuperAdmin', '2026-01-12 03:35:35'),
(185, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated resident record in Residents Page', 'SuperAdmin', '2026-01-12 03:49:36'),
(186, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added new household record in Household Page', 'SuperAdmin', '2026-01-12 03:49:41'),
(187, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) deleted household 11', 'SuperAdmin', '2026-01-12 03:49:44'),
(188, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated access of Richard U. Benitez in Officials Page', 'SuperAdmin', '2026-01-12 03:57:46'),
(189, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Updated access of Richard U. Benitez in Officials Page', 'SuperAdmin', '2026-01-12 03:57:51'),
(190, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Deleted an event 8 in Event Page', 'SuperAdmin', '2026-01-12 04:00:38'),
(191, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added a new event birthday ko in Event Page', 'SuperAdmin', '2026-01-12 04:01:57'),
(192, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Deleted an event 9 in Event Page', 'SuperAdmin', '2026-01-12 04:03:22'),
(193, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Added a new event gasg in Event Page', 'SuperAdmin', '2026-01-12 04:04:20'),
(194, 2, 'Fregilda P. Matabang (markmontano522@gmail.com)', 'User Fregilda P. Matabang (markmontano522@gmail.com) Deleted an event gasg in Event Page', 'SuperAdmin', '2026-01-12 04:04:24');

-- --------------------------------------------------------

--
-- Table structure for table `barangay_profile`
--

CREATE TABLE `barangay_profile` (
  `id` int(11) NOT NULL,
  `barangay_name` varchar(150) NOT NULL,
  `municipality` varchar(150) NOT NULL,
  `province` varchar(150) NOT NULL,
  `place_issued` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificate_templates`
--

CREATE TABLE `certificate_templates` (
  `template_id` int(11) NOT NULL,
  `template_code` varchar(50) NOT NULL,
  `template_name` varchar(100) NOT NULL,
  `body_html` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificate_templates`
--

INSERT INTO `certificate_templates` (`template_id`, `template_code`, `template_name`, `body_html`, `created_at`, `updated_at`) VALUES
(3, 'INDIGENCY', 'Certificate of Indigency', '<p>To Whom It May Concern:</p><p class=\"ql-align-justify\">This is to certify that <strong><u>{{FULL_NAME}}</u></strong>, of legal agesss, is a bona fide resident of this Barangay with an actual residential address located at <strong><u>{{ADDRESS}}</u></strong>, is known to be an indigent member of this Barangay.</p><p class=\"ql-align-justify\">The aforementioned person requested this certificate in order to fulfill his/her need for <strong><u>{{PURPOSE}}</u></strong>.</p><p class=\"ql-align-justify\">Issued this <strong><u>{{ISSUE_DATE}}</u></strong> at Barangay {{BARANGAY}}, {{MUNICIPALITY}}, {{PROVINCE}}.</p>', '2025-12-25 18:56:09', '2026-01-05 07:50:54');

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `header_color` varchar(20) NOT NULL,
  `footer_text` text NOT NULL,
  `footer_color` varchar(20) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `bg_image` varchar(255) NOT NULL,
  `main_button_color` varchar(20) NOT NULL,
  `sidebar_button_color` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `company_name`, `address`, `ip_address`, `header_color`, `footer_text`, `footer_color`, `logo_url`, `bg_image`, `main_button_color`, `sidebar_button_color`) VALUES
(1, 'BARANGAY 369', 'BARANGAY 369, ZONE 37, DISTRICT III,  MANILA', '192.168.1.5', '#4c95cd', 'Barangay Information System — All Rights Reserved', '#4c95cd', '/uploads/company_asset/1766978600251-Barangay369.jpg', '/uploads/company_asset/1765726775433-kulet1.jpg', '#000000', '#2e75d1');

-- --------------------------------------------------------

--
-- Table structure for table `document_requested`
--

CREATE TABLE `document_requested` (
  `id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `document_types` varchar(255) NOT NULL,
  `issued_at` varchar(255) NOT NULL,
  `valid_until` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document_requested`
--

INSERT INTO `document_requested` (`id`, `resident_id`, `document_types`, `issued_at`, `valid_until`) VALUES
(7, 8, 'Barangay Certificate of Residency', '2026-01-06', '1783296000'),
(9, 8, 'Barangay Certificate of Indigency', '2026-01-06', '1783296000'),
(10, 8, 'Certificate of Indigency For Minor', '2026-01-06', '1783296000'),
(11, 8, 'Certificate of Indigency For Legal Age', '2026-01-06', '1783296000'),
(12, 8, 'Barangay Certification', '2026-01-06', '1783296000'),
(13, 8, 'Barangay Certificate', '2026-01-06', '1783296000'),
(14, 8, 'Business Permit', '2026-01-06', '1783296000');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` varchar(255) NOT NULL,
  `end_date` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_time` varchar(10) DEFAULT NULL,
  `end_time` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `start_date`, `end_date`, `created_at`, `start_time`, `end_time`) VALUES
(7, 'Lakbay Aral', '3days ', '2025-12-15', '2025-12-15', '2025-12-14 11:35:50', '10:00', '12:00');

-- --------------------------------------------------------

--
-- Table structure for table `event_images`
--

CREATE TABLE `event_images` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_images`
--

INSERT INTO `event_images` (`id`, `event_id`, `image_path`, `uploaded_at`) VALUES
(7, 7, '/uploads/events/1765712150856-ARDEN 1x1.jpg', '2025-12-14 11:35:50'),
(8, 7, '/uploads/events/1765712150857-BIRTHCERT.jpg', '2025-12-14 11:35:50'),
(9, 7, '/uploads/events/1765712150862-CERT GOOD MORAL.png', '2025-12-14 11:35:50'),
(10, 7, '/uploads/events/1765712150879-CIRUELA 1x1.jpg', '2025-12-14 11:35:50'),
(11, 7, '/uploads/events/1765712150880-DE LA CRUZ 1x1.jpg', '2025-12-14 11:35:50'),
(12, 7, '/uploads/events/1765712150882-Form138.webp', '2025-12-14 11:35:50'),
(13, 7, '/uploads/events/1765712150886-GRADUATING CERT.jpg', '2025-12-14 11:35:50'),
(14, 7, '/uploads/events/1765712150888-VACCINE CARD.jpg', '2025-12-14 11:35:50');

-- --------------------------------------------------------

--
-- Table structure for table `households`
--

CREATE TABLE `households` (
  `id` int(11) NOT NULL,
  `household_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `purok` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `households`
--

INSERT INTO `households` (`id`, `household_name`, `address`, `purok`, `created_at`) VALUES
(6, 'ELIAS C. DEL ROSARIO III', '1756 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(7, 'LOLITA B. MORENO', '1756 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(8, 'MARIA ANDREA CLARK V. MORENO', '1756 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(9, 'MARICRIS B. MORENO', '1756 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(10, 'MARISSA G. ANDRES', '1756 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(11, 'DANTE S. REVELLEZA', '1758 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(12, 'MARY JONE M. GALICIA', '1758 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(13, 'DELIA R. GATCHALIAN', '1760 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(14, 'EVELYN E. PETROLA', '1760 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(15, 'RYAN IRVIN A. VILLAMIEL', '1762 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(16, 'BILL DENIS V. AMPON', '1764 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(17, 'ROSEMARIE M. CAINGAT', '1764 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(18, 'HONEY MAE N. CALDERON', '1766 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(19, 'KAYCEE N. CALDERON', '1766 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(20, 'REMEDIOS C. NUNEZ', '1766 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(21, 'ROMMEL AMPON', '1766 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(22, 'CHERYL A. RECATO', '1768 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(23, 'ERNESTO D. RECATO', '1768 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(24, 'ARTURO S. PERALTA', '1768 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(25, 'JEAN G. DEALINO', '1770 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(26, 'JOSE J. GABALES', '1770 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(27, 'CEDRIC I. NORIAL', '1771 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(28, 'ROSARIO S. FERNANDO', '1772 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(29, 'NORMA S. FERNANDO', '1772 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(30, 'RUTH F. REYES', '1772 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(31, 'SUNNYBOY R. TIZON', '1773 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(32, 'ESTRELLITA G. SAQUING', '1774 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(33, 'ROBERTO G. SAQUING', '1774 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(34, 'RHODA S. FERMO', '1776 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(35, 'RUDIYARDO R. SABAO', '1776 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(36, 'LIWAYWAY D. SAGARINO', '1777 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(37, 'CHRISTEL LEDRES', '1801 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(38, 'ROLLY J. SANTOS', '1801 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(39, 'HOLLIE MARIE C. LEDRES', '1805 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(40, 'CHARITO M. SAN DIEGO', '1777 TIAGO STREET', 'TIAGO STREET', '2026-01-12 04:59:33'),
(41, 'MANUELITO L. SALUD', '1778 OLD ANTIPOLO STREET', 'OLD ANTIPOLO STREET', '2026-01-12 05:00:51'),
(42, 'FREDIRICO P. RUEDA', '1779 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(43, 'NORMANDY B. SUYAT', '1782 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(44, 'CHERRY B. TAMBOBONG', '1783 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(45, 'JENNIFER S. GOMEZ', '1785 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(46, 'ALEXANDER P. ARELLADO', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(47, 'ARON C. RONDOLO', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(48, 'CHARLIE P. CATALAN', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(49, 'DANILO G. FLORES', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(50, 'JOEL F. QUILANG', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(51, 'LANIE C. APOS', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(52, 'MARYROSE Q. DELOS SANTOS', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(53, 'MICHELLE B. CASTIN', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(54, 'NARCISO L. SEGUNDO', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(55, 'NESTOR E. MENDEZ', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(56, 'RAMIL R. COMELAT', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(57, 'ROMMEL D. GORDOLA', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(58, 'SAMMY BOY Q. DELOS SANTOS', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(59, 'SAMUEL DELOS SANTOS', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(60, 'SAMANTHA B. FERRER', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(61, 'ARMARK REY S. OBISPO', '1785 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(62, 'ALLAN C. GARCIA', '1787 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(63, 'VILMA G. CASTILLO', '1787 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(64, 'AMADO P. PEREZ JR.', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(65, 'EMMA RUTH B. SANTOS', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(66, 'ISABEL P. RANCHES', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(67, 'IVY F. SALUD', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(68, 'JUANITO V. DIMALANTA', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(69, 'LUCITA M. GUTIERREZ', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(70, 'LUZVIMINDA S. BOQUIRIN', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(71, 'EMMA RUTH R. RANCHES', '1789 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(72, 'ARNEL A. BONEZA', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(73, 'CALVIN C. GUTIERREZ', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(74, 'FREDERIC L. PAMILAR', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(75, 'LIEZEL G. PEREZ', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(76, 'RAIMARC D. FERNANDEZ', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(77, 'RAMON JASON R. DE VERA', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(78, 'RAMON JAYRON R. DEVERA', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(79, 'RICHARD A. GONZALES', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(80, 'RONALD ANTHONY L. PAMILAR', '1789 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(81, 'ANNA FE S. SERRANO', '1792 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(82, 'JACKEYLYN P. NAVAL', '1792 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(83, 'ARMANDO G. NAVAL', '1792 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(84, 'JHAMES DE LEON', '1795 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(85, 'JORDAN S. DABU', '1795 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(86, 'ARGEY P. ALFON', '1795 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(87, 'DODIE G. PASCUAL', '1795 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(88, 'FAUSTO A. PASCUAL', '1795 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(89, 'FRANCISCO B. BENITEZ', '1797 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(90, 'MICHAEL T. BENITEZ JR.', '1797 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(91, 'MICHAEL U. BENITEZ', '1797 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(92, 'RICHARD U. BENITEZ', '1797 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(93, 'ANGEL A. BENITEZ', '1797 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(94, 'CRISELDA C. DE GUZMAN', '1797 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(95, 'DAWN PAULO DEXTER A. BENITEZ', '1797 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(96, 'JOMARE M. ARCES', '1797 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(97, 'REBECCA V. ABIT', '1797 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(98, 'MARDELYN P. DELFIN', '1799 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(99, 'PETER JOHN S. SALUD', '1799 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(100, 'RUSTICO M. SACRAMENTO', '1799 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(101, 'MARY GRACE S. PANTOJA', '1799 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(102, 'ARIES JAY T. TAGUINOD', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(103, 'IMEE E. AUSTRIA', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(104, 'JESUS M. DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(105, 'KIM LOUISE M. DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(106, 'LUISA M. DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(107, 'MAXIM V. EBUENGA', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(108, 'MICHELLE A. OYOG', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(109, 'NORBIE F. SALUD', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(110, 'NORIZA S. SALUD', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(111, 'PRINCE JOHN DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(112, 'RADITO M. DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(113, 'ROYCE COLEEN M. DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(114, 'TERESITA M. DESCUATAN', '1801 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(115, 'ALVIN B. SALVADOR', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(116, 'HERBERT N. VASQUEZ', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(117, 'JESSICA C. MORIT', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(118, 'JOHN ROY C. MORIT', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(119, 'MANUEL C. MORIT JR.', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(120, 'MANUELITO C. MORIT', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(121, 'MARC LUIS R. RAVARA', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(122, 'PAUL JOHN G. DIMACALI', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(123, 'LITALYN E. SUCAYAN', '1803 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(124, 'LOIDA S. BOQUIRIN', '1805 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(125, 'ANGELITO P. VELASCO', '1807 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(126, 'RAMIL D. OBISPO', '1811 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(127, 'JENNIFER A. BENITEZ', '1814 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(128, 'VAL ANTHONY C. CORALES', '1815 A. ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(129, 'GLENN B. DE GUZMAN', '1815 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(130, 'SONNY BOY C. SANCHEZ', '1815B ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(131, 'BENITA C. SANCHEZ', '1815-D ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(132, 'EMERENCIANA R. DE VERA', '1816 A. ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(133, 'MICHELLE D. FERNANDEZ', '1816 A. ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(134, 'RICARDO N. BARAWID', '1816 A. ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(135, 'ALAN C. PIDO', '1816 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(136, 'ARLENE P. ALANO', '1816 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(137, 'GRACECHELLE D. DELA CRUZ', '1816 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(138, 'MARICHELLE R. DE VERA', '1816 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(139, 'RAMON R. DE VERA JR.', '1816 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(140, 'ROWENA P. ALANO', '1816 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(141, 'ANGELO A. GONZALES', '1816 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(142, 'MARIA CECILIA W. HIBBLER', '1816 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(143, 'RAMOND JAYRON R. DE VERA', '1816 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(144, 'JHENNYCHELLE R. DE VERA', '1816 OLD ANTIPOLO STREET', 'OLD ANTIPOLO STREET', '2026-01-12 05:00:51'),
(145, 'CHRISTOPHER C. EVANGELISTA', '1817 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(146, 'MICHAEL M. LEOCADIO', '1817 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(147, 'VICTORINO F. URSUA', '1817 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(148, 'MARGARITO E. ELE', '1817-B ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(149, 'GERARDO R. BAUTISTA', '1818 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(150, 'GERMAN G. ARCEO', '1818 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(151, 'ABELARDO C. URSUA', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(152, 'EMELDA P. LEGASPI', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(153, 'JULIO R. FERRER', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(154, 'MARIO C. CLEMENTE', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(155, 'REYCHELGIN G. MATABANG', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(156, 'REYNALDO R. SAUL', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(157, 'RONALDO U. URSUA', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(158, 'ERNESTO S. PERALTA', '1820 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(159, 'JUANITO J. KING', '1820 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(160, 'PAQUITO J. KING', '1820 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(161, 'ANICIA VELASCO', '1824 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(162, 'RENZO C. RONDOLO', '1985 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(163, 'REIZEL M. GOMEZ', 'NEW ANTIPOLO STREET, BRGY. 369', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(164, 'KRIZCHELLE R. DE VERA', '1816 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(165, 'JOHN SIMMON F. SALUD', '1778 OLD ANTIPOLO STREET', 'OLD ANTIPOLO STREET', '2026-01-12 05:00:51'),
(166, 'MARIVIC P. ROMERO', '1778 INT. 38 ANTIPOLO STREET', 'INT. 38 ANTIPOLO STREET', '2026-01-12 05:00:51'),
(167, 'JERRY J. PANGAN', '1778 INT. 38 ANTIPOLO STREET', 'INT. 38 ANTIPOLO STREET', '2026-01-12 05:00:51'),
(168, 'JOJO J. PANGAN', '1778 INT. 38 ANTIPOLO STREET', 'INT. 38 ANTIPOLO STREET', '2026-01-12 05:00:51'),
(169, 'ARMAINE P. HACOTINA', '1778 INT. 38 ANTIPOLO STREET', 'INT. 38 ANTIPOLO STREET', '2026-01-12 05:00:51'),
(170, 'GILBERT G. MATABANG', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(171, 'SHERWIN G. MATABANG', '1819 NEW ANTIPOLO STREET', 'NEW ANTIPOLO STREET', '2026-01-12 05:00:51'),
(172, 'BERNARDO M. RODRIGUEZ', '1797 ANTIPOLO STREET', 'ANTIPOLO STREET', '2026-01-12 05:00:51'),
(173, 'EDUARDSON M. SY', '1801 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(174, 'MELANIA U. BAUTISTA', '1801 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(175, 'RODEL M. BAUTISTA', '1801 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(176, 'LARRY S. CAMANAY', '2324 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(177, 'JOMER D. VILLETE', '2400 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(178, 'LORETO S. GARCIA', '2400 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(179, 'LUISITO G. TANJUTCO', '2400 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(180, 'MELODY C. DUBRIA', '2400 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(181, 'MERLY Q. DE LEON', '2400 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(182, 'SHERWIN D. VALDEZ', '2400 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(183, 'ANGELA T. CONDOLON', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(184, 'ANGELO P. LIWANAGAN', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(185, 'ARAÑA S. DE SOSA', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(186, 'ARNEL G. GAPER', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(187, 'BART M. ENRICA', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(188, 'CRISTIAN R. ALFEREZ', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(189, 'GERARDO D. SIMON', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(190, 'JERREL UY', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(191, 'JOEY D. CALENDACION', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(192, 'JOHN VINCENT O. ENRICA', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(193, 'JOMAR SANTILLAN', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(194, 'JUDITHA S. SAGOSOY', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(195, 'JUDY A. ASIERTO', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(196, 'KENNETH ZAKI E. BUIZON', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(197, 'MARLYN S. LLANES', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(198, 'NOEL D. CALES', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(199, 'RAINIERJOHN C. TIMADO', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(200, 'ZALDY B. FAGILAGUTAN', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(201, 'DOMELITO A. BASINILLO', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(202, 'MANUEL MARTIN', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(203, 'MARK DAVEN D. BASINILLO', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(204, 'MARK LOUIE D LIBUNAO', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(205, 'RICHARD LOUIE E. UMALI', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(206, 'ROBERT T. ENRICA', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(207, 'VINCE DARREN D. BASINILLO', '2406 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(208, 'ARIAN P. ALDEROZA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(209, 'CHRISTIAN RAMIREZ', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(210, 'EDDIE C. REMOLINA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(211, 'JEREMY V. CABAÑA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(212, 'JOHN ERIC A. CALMA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(213, 'JONATHAN D. CALMA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(214, 'NELIA V. ENRICA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(215, 'RICKY A. OROLFO', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(216, 'RODALYN V. ENRICA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(217, 'ROMULO O. ENRICA', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(218, 'VILLA B. RAMIREZ', '2408 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(219, 'DIANA ROSE A. MERCADO', '2410 B LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(220, 'AIDA C. SALVACION', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(221, 'ALEX M. GARGALLO', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(222, 'ARLENE G. RASCO', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(223, 'ARMANDO E. DIAMANTE', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(224, 'ARMANDO H. PAPA', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(225, 'AVELINA L. ELE', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(226, 'BERNARDO L. GULOY', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(227, 'EDUARDO B. DELA CRUZ', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(228, 'ELEAZAR T. AMARO JR.', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(229, 'EMIL S. FAJARDO', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(230, 'ERNESTO A. REONAL', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(231, 'LEONEL JOVEN', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(232, 'MARK ANTHONY G. GARGALLO', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(233, 'MARLON G. DIAMANTE', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(234, 'MARLYN C. SAQIZA', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(235, 'MARVIN DIAMANTE', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(236, 'MICHAEL DIAMANTE', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(237, 'RALF MATTEW DELA CRUZ', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(238, 'RAYMOND CRUZ', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(239, 'RICHARD B. DELA CRUZ', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(240, 'ROBERTO R. ENRICA', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(241, 'PERLITA LIARINA', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(242, 'VENERANDO E. YUSON', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(243, 'SEARCHEN B. PAROCHEL', '2410 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(244, 'ALLAN D. CATIVO', '2410-B LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(245, 'RECHELLA R. FUENTES', '2410-B LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(246, 'RICKY R. FUENTES', '2410-B LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(247, 'RIZZA R. FUENTEZ', '2410-B LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(248, 'AURELLO E. BALANGUE', '2410-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(249, 'CHARLIE O. ENRICA', '2410-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(250, 'DOMINGO V. GARGALLO', '2410-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(251, 'PATRICK RYAN M. GARGALLO', '2410-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(252, 'ARNOLD R. BETORIO', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(253, 'ELLEN BALDRIAS', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(254, 'EVA S. ORTIZ', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(255, 'INA CHARLENE SAN JOSE', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(256, 'JAYSON B. RAMACULA', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(257, 'JOHN VICTOR P. OLIVEROS', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(258, 'JOHN VINCENT P. OLIVEROS', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(259, 'MA. LOURDES P. OLIVEROS', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(260, 'MARIA G. CARANOG', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(261, 'MELECIO L. LODOBISE', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(262, 'MICHAEL ANGELO M. ALIJAGA', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(263, 'MONICA D. BAYANI', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(264, 'PATRICK EMILE PASCUAL', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(265, 'RODOLFO T. PASCUAL', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(266, 'RODRIGO O. ENRICA', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(267, 'JHEYBON LORICAN', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(268, 'LEONARDO A. VILLAGANAS JR.', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(269, 'RODARICK O. ENRICA', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(270, 'ROSALIE O. ENRICA', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(271, 'ROSALINA O. ENRICA', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(272, 'ROSEMARIE O. ENRICA', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(273, 'SHANE M. ENRICA', '2412-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:02:51'),
(274, 'CLARITA R. AMBROCIO', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(275, 'JAYSON G. CRUZ', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(276, 'JOEL A. VILLONES', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(277, 'JULIUS VINCENT A. BELASA', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(278, 'MANUEL L. IRLANDEZ', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(279, 'MARILYN B. DEGORIO', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(280, 'NOEL T. MONROYO', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(281, 'RAMIL E. TABAS', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(282, 'ROBERT C. CRUZ', '2414 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(283, 'NOEL O. PAGUIO', '2414-B LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(284, 'MERCEDES A. ESPIEL', '2417 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(285, 'DIASON T. ARINOY', '2428 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(286, 'JERRY R. NAG-ASO', '2428 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(287, 'JUBERT M. GARGAR', '2428 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(288, 'KIMBERT V. GALARIO', '2428 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(289, 'RICHARD A. VILLA ALBA', '2428 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(290, 'CHARLES MARVIN C. BAUSTISTA', '2430 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(291, 'PEDRO R. RABINO', '2434 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(292, 'LEYDEREL S. ARZOBAL', '2436 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(293, 'EDMARK C. DELA TORRE', '2444 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(294, 'RAYMUNDO S. GALLARDO', '2444 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(295, 'REYNALDO D. JALOCON', '2444 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(296, 'DANNY MAR S. CANONIO', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(297, 'DAYA C. CLAMONTE', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(298, 'MARY JANE C. MONTIBON', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(299, 'MINDA B. ARRIESGADO', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(300, 'RONALDO B. ARRIESGADO', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(301, 'RUBY J. CLAMONTE', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(302, 'NARCISO L. SEGUNDO', '2449 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(303, 'EPIFANIO B. ALO', '2454 3-C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(304, 'ALVIN M. NONSOL', '2454 3-D LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(305, 'ARIEL M. CAYANAN', '2454 4-A LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(306, 'MARIA CRISTINA P. AMPARO', '2454 4F 4C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(307, 'DOLORES O. EDAN', '2454 4TH FLOOR LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(308, 'BUENAVENTURA M. FABREAG', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(309, 'DANTE B. RUBIN', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(310, 'FEMMY P. DE CHAVEZ', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(311, 'GERARD ANGELO E. DAVID', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(312, 'GLORIA M. FABREAG', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(313, 'HERMINIA C. SUPAN', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(314, 'JUNMAR D. GENILZA', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(315, 'JUSTINE D. DELA CRUZ', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(316, 'LANDRITO G. GUNAY', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(317, 'MARY ROSE V. MACALINTAL', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(318, 'MOHAMAR M. BATARA', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(319, 'WILFREDO M. DIMAANO', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(320, 'ZALDY S. CAMPUS', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(321, 'MICHAEL JUDE Z. ARAMAN', '2454-2C LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(322, 'ADORA D. VALDEZ', '2454-3E LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(323, 'MARCELINO O. NAVALTA', '2457 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(324, 'LALAINE L. SIMPLICIO', '2458 (401) LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(325, 'LETICIA B. ASONZA', '2458 (402) LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(326, 'DARWIN B. BOQUISON', '2458 (404) LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(327, 'LAURO Z. LIM', '2458 (405) LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(328, 'ANNALIZA M. GRANDE', '2458 (406) LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(329, 'ALEXANDRA MAO E. JUAQUIN', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(330, 'CARLOS A. YANGA', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(331, 'HELEN E. ALBURO', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(332, 'JAMES L. TAN', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(333, 'JHENG Y. ESPIRITU', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(334, 'ROGER G. CANOPY JR.', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(335, 'VERMON A. YANGA', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:23'),
(336, 'FELICITO R. FAUSTINO', '2470 D. LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(337, 'RICHARD C. FAUSTINO', '2470 D. LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(338, 'CARLITO A. CARLOS', '2470 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(339, 'CHARINA P. SANDOVAL', '2470 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(340, 'FRIDAY G. MANOOK', '2470 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(341, 'JULIAN E. SUMADSAD', '2470 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(342, 'JUMIL D. OCAMPO', '2470 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(343, 'TERESITA H. CHUA', '2470 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(344, 'ARTURO M. TORALBA', '2472 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(345, 'EDGAR C. ROSALES', '2472 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(346, 'FERNANDO C. MATABANG', '2472 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(347, 'JACKSON S. TALON', '2472 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(348, 'LUZ A. SANTOS', '2472 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(349, 'MARIA SHARDA S. SIA', '2472 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(350, 'BABY MYRNA D. BERNARDINO', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(351, 'DANILO A. DELA CRUZ', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(352, 'JONIE Q. BULATAO', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(353, 'WINDSOR MATABANG', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(354, 'JULIUS G. GALANGERA', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(355, 'LEONARDO H. BAUTISTA', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(356, 'MARCELO C. BARON', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(357, 'MARILOU M. SEGUNDO', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(358, 'MARJORIE M. SEGUNDO', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(359, 'MARY ROSE C. BERNARDINO', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(360, 'MYRNA D. BERNARDINO', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(361, 'RAMON G. MARTIN', '2476 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(362, 'TITA D. ZAPANTA', '2454 3F LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(363, 'HOMER O. CONSULTA', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(364, 'ROSE M. SALAZAR', '2446 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(365, 'RAYMOND M. AREGLADO', '2454 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(366, 'CARMELITA C. ABERGAS', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(367, 'DOLORITA M. BARINOGA', '2404 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(368, 'ARMEY P. PALINO', '2428 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(369, 'JEEUH CHRISTOPHER B. OCHEA', '2412 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(370, 'JOHN REY BALIWAS', '2458 LEONOR RIVERA STREET', 'LEONOR RIVERA STREET', '2026-01-12 05:04:42'),
(371, 'ALBERTO P. LACERNA', '2354 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(372, 'GEROME T. GONZALEZ', '2386 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(373, 'NELIA BURGOS', '2386-B ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(374, 'JOVITO P. MANUEL', '2391 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(375, 'MAY ANNE E. NALUZ', '2391 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(376, 'REYNALDO M. GONZAGA', '2391 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(377, 'RODEL R. MALALAY', '2391 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(378, 'VAN LOUIE R. SOLIONGCO', '2391 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(379, 'VICTOR V. SOLIONGCO', '2391 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(380, 'ALCHIE M. BAUTISTA', '2393 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(381, 'FREGILDA P. MATABANG', '2393 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(382, 'ANDRES A. PERALTA', '2395 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(383, 'ROSELLE ANNE TIU', '2395 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(384, 'ROSEMARIE J. TIU', '2395 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(385, 'ROXANNE J. TIU', '2395 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(386, 'EDWARD J. TIU', '2397 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(387, 'JENNIFER J. TIU', '2397 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(388, 'REYNALDO J. TIU', '2397 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(389, 'MARCELA MARILYN  U. TAMAYO', '2401 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(390, 'ROSALIE B. REPOBERBIO', '2404 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(391, 'MANUEL M. JUANITAS', '2406-A ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(392, 'EULALIA G. DOTE', '2407-B ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(393, 'POTENCIANA G. BALONTONG', '2407-B ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(394, 'DANNY O. GAN', '2407-C ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(395, 'DONNA MAE C. LACDO-O', '2408 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(396, 'HELEN D. DELA VEGA', '2408 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(397, 'LEO V. GALLETO', '2408 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(398, 'LUCENA V. DEQUITO', '2408 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(399, 'FELIXWALDO R. RODICOL', '2409 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(400, 'FERDINAND B. DELA CRUZ', '2409 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(401, 'MYRNA R. LIBERATO', '2410 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(402, 'EFREN C. MATABANG', '2410 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(403, 'EMMERZON R. MATABANG', '2410 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(404, 'MARISSA R. MATABANG', '2410 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(405, 'ROMEL D. BALANLAY', '2410 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(406, 'ROBERTO S. AQUE', '2410 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(407, 'MIGUEL F. URSUA', '2412 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(408, 'JERIC D. ESCOLANO', '2413 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(409, 'MARRIET JULES B. ATIENZA', '2413 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(410, 'RODOLFO D. BATTAD JR.', '2413 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(411, 'ROSAURO LEROY D. BATTAD', '2413 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(412, 'LOLITA M. MERCADO', '2415 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(413, 'DAVID JULIUS B. HOMBRE', '2417 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(414, 'EDMUND D. CASTAÑEDA', '2420 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(415, 'JOANNA MARIE P. GUTIERREZ', '2422 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(416, 'EDGAR ALLAN P. SANTOS', '2424 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(417, 'EFREN DANILO P. SANTOS', '2424 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(418, 'GERLIE D. GUTIERREZ', '2424 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(419, 'SUSAN P. LANZUELA', '2424 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(420, 'GERRY S. GUTIERREZ', '2426 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(421, 'MARC LOUIE GUTIERREZ', '2426 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(422, 'MICHAEL P. GUTIERREZ', '2426 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(423, 'RENATO B. CAINGAT', '2426 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(424, 'RAQUEL S. DE QUIÑA', '2431 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(425, 'TERESITA S. DE QUIÑA', '2431 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(426, 'MARIO E. DESEO', '2432 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(427, 'SAMUEL Y. SANTOS', '2432 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(428, 'WESLEY B. ANG', '2432 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(429, 'DIOSDADO C. DIAZ', '2432 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(430, 'ROMY O. DACER', '2432 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(431, 'ROBERTO D. CABRERA', '2435 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(432, 'JOSEPH G. DAYTIA', '2436 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(433, 'EDEN S. CHING', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(434, 'EDWARD G. CHING', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(435, 'ERIKA C. CHING', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(436, 'JESSA V. CASTAÑO', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(437, 'JESSICA ELAINE J. CHING', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(438, 'JOHNY S. CHING', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(439, 'NANCETA B. EMPERADO', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(440, 'RALPH O. NG', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(441, 'YONIVEN D. ROMANO', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(442, 'PASENCIA P. AGORILLA', '2438 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(443, 'BADYMER G. UY', '2439 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(444, 'RODELYN A. CARILLO', '2439 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:06:41'),
(445, 'BENEDICTO J. ALMAREZ', '2445 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(446, 'JUNIOR K. VALERIO', '2445 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(447, 'ALBERTO Z. YAMBAO', '2446 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(448, 'ARMINDA R. GESMUNDO', '2446 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(449, 'MA. SOCORRO R. GESMUNDO', '2446 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(450, 'IRENE Q. PLOPINO', '2446 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(451, 'DENNIS M. REYES', '2446 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(452, 'FREDDIE G. LANZUELA', '2447 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(453, 'GARDENIA J. DURAN', '2447 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(454, 'MARCELINA M. ROSETE', '2447 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(455, 'MAVERICK A. ALOLOR', '2447 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(456, 'PEDRO S. GUTIERREZ', '2447 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(457, 'RICHARD P. LANZUELA', '2447 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(458, 'ELENA C. UY', '2448 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(459, 'SHERWIN P. RESQUID', '2449 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(460, 'ALDRIN M. AGUILAR', '2450 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(461, 'RAQUEL M. AGUILAR', '2450 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(462, 'BENIGNO C. PAGCU', '2452 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(463, 'JULIANA J. SANTOS', '2452 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(464, 'MARICEL S. ELLAO', '2452 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(465, 'ROBERTO P. CAOILE', '2452 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(466, 'EMERINCIANA C. DE GUZMAN', '2454 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(467, 'GERALD ANGELO L. CAUDILLA', '2458 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(468, 'MARCELLA L. DOCUYANAN', '2418 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(469, 'KENT CHRISTOPHER C. LIM', '2465 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(470, 'TEODORO I. CANCIO', '2465 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(471, 'FEDERICO L. CHAN HUAN', '2466 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(472, 'SALLY F. DIAZ', '2466 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(473, 'MARINA T. CAMING', '2469 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(474, 'ELVIRA J. COTO', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(475, 'IRENE L. DUQUE', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(476, 'ROMEO M. REDOÑA', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(477, 'DELANO M. VITAN', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(478, 'RENATO R. AYSON', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(479, 'EVANGELINE A. ZABALA', '2484 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(480, 'VON RUNDY F. ANTOLIN', '2513 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(481, 'WILFREDO D. FLORES', '2517 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:05'),
(482, 'RAQUEL M. AGUILAR', '2450 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:50'),
(483, 'MARCELLA L. DOCUYANAN', '2418 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:50'),
(484, 'DELANO M. VITAN', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:50'),
(485, 'DENNIS M. REYES', '2446 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:50'),
(486, 'RENATO R. AYSON', '2470 ISAGANI STREET', 'ISAGANI STREET', '2026-01-12 05:07:50'),
(487, 'ALMONDO F. URSUA', '1801 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(488, 'DOMINGO GUNDAYAO', '1810 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(489, 'JOSE B. NICERIO', '1810 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(490, 'LARRY G. PENTOY', '1810 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(491, 'ROWENA ROSALINAS', '1810 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(492, 'CRISTITA C. NAVARRA', '1812 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(493, 'EMELITA D. ESTRELLA', '1812 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(494, 'GLORIA T. CABRERA', '1812 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(495, 'WENCYS DAVE D. ESTRELLA', '1812 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(496, 'RICARDO T. CABRERA', '1814 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(497, 'CRISTOPER P. RESQUID', '1828 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(498, 'JEANNIE C. BAUTISTA', '1828 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(499, 'MANOLITO R. CALLANTA', '1828 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(500, 'MAUREEN JOY D. CARDENAS', '1828 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(501, 'EVELYN C. BAUTISTA', '1828 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(502, 'MIGUELA G. DIMAYUGA', '1830 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(503, 'EDGAR D. BALINGIT', '1832 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(504, 'EMILIO D. BALINGIT', '1832 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(505, 'CRIS G. SAMSON', '1834 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(506, 'JADE A. LOMA', '1834 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(507, 'AIDA C. GRAJO', '1836 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(508, 'AMPARO G. GREGORIO', '1836 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(509, 'DOMINGO P. MENESES', '1836 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(510, 'REBECCA B. DIAZ', '1836 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(511, 'RIZALINA R. SOLIMAN', '1836 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(512, 'RONALDO P. CENDANA', '1836 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(513, 'DARRYL SORIANO', '1840 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(514, 'PHILIP G. PINTOY', '1840 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(515, 'ANTONIO N. HERNANDEZ', '1840-1-B CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(516, 'MYLAN G. DELA CRUZ', '1840-1-B CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(517, 'VERZEL BAGUIO', '1842 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(518, 'ANA D. SAPINIT', '1844 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57');
INSERT INTO `households` (`id`, `household_name`, `address`, `purok`, `created_at`) VALUES
(519, 'ELVIRA J. COTO', '1846 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(520, 'DIEGO C. EVANGELISTA', '1802 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(521, 'DONAR L. VILLANUEVA', '1802 CAVITE STREET', 'CAVITE STREET', '2026-01-12 05:07:57'),
(522, 'ROLANDO D. SIMON', '2024 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(523, 'LEANDRO J. DELEN', '2395 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(524, 'LEONIDA J. DELEN', '2395 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(525, 'CHARLES KENNETH D. SUAREZ', '2397 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(526, 'MON DAVID D. SUAREZ', '2397 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(527, 'RODNEL G. CEBEDA', '2397 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(528, 'ROSEMARIE D. SUAREZ', '2397 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(529, 'LUTHER C. URSUA', '2397 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(530, 'ANTONINA V. CORPUZ', '2400 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(531, 'VICKY C. BALASTA', '2400 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(532, 'ARLYN M. TABIANAN', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(533, 'CECILE V. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(534, 'DANNYBER M. DIMALALUAN', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(535, 'EDNA C. DUANAN', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(536, 'ELIZABETH V. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(537, 'ESTER C. TORRES', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(538, 'FIDEL P. SUARES', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(539, 'GERARDO V. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(540, 'GINALYN G. MARCELLANA', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(541, 'JUDY ANN A. ROTAIRO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(542, 'JUSTIN NIKOLE M. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(543, 'LENY G. MARCELLANA', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(544, 'LOVELYN V. VILLAMOR', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(545, 'MA. TERESA S. APALLA', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(546, 'MARILOU M. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(547, 'PAUL EDGAR V. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(548, 'RAMON M. MARCELLANA', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(549, 'ROMEL G. MARCELLANA', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(550, 'ROWEL G. MARCELLANA', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(551, 'TRISHA KATELENE M. CONGCO', '2401 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(552, 'ESTELITO C. BUNGUBUNG SR.', '2404 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(553, 'JOSE C. DELA FUENTE', '2408 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(554, 'MAURA C. MARQUEZ', '2409 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(555, 'RUPERTA C. ROSAS', '2409 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(556, 'GERARD B. BRIONES', '2411 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(557, 'RONALD B. BAYANI', '2411 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(558, 'EDDIE T. ACOBA', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(559, 'LOUIE B. SANTOS', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(560, 'NOLI S. MORAÑA', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(561, 'PAUL REYNALD P. BONIFACIO', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(562, 'REMIA A. DELOS SANTOS', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(563, 'RENE S. TARROJA', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(564, 'SYRELL V. DIAZ', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(565, 'TOLENTINO G. GALVEZ', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(566, 'JAYSON B. FLORES', '2412 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(567, 'LOWILLA S. FERNANDEZ', '2412 UNIT AI ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(568, 'ROUEL CHRISTIAN T. PICZON', '2412-1B ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(569, 'CHARMING L. ESTRELLA', '2412-3C ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(570, 'RALPH LAWRENCE N. CALIBO', '2412-4A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(571, 'HELEN U. CUETO', '2412-A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(572, 'JOSEPH EDWARD G. RODILLO', '2412-A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(573, 'MARY ANN M. SANTOS', '2412-A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(574, 'ROBERT JAYSON D. JAVELLANA', '2412-A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(575, 'CHRISTIAN P. BARLAN', '2412-A UNIT 4C  ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(576, 'CEEGEE C. GUTIERREZ', '2412-A1 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(577, 'FERNANDO R. CASTRO', '2413 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(578, 'HELEN L. BAGADIONG', '2413 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(579, 'ALLAN B. DAULAT', '2415 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(580, 'MARY GRACE E. GADONG', '2415 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(581, 'PERFECTO D. SEVILLA JR.', '2415 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(582, 'ROSEANNE O. CALMA', '2415 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(583, 'ALVIN C. URBANO', '2420 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(584, 'GODFREY D. TORRANO', '2420 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(585, 'MARY ANN T. BALDERAMA', '2420 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(586, 'RAFFY P. DELA PEÑA', '2420 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(587, 'BENJAMIN V. DANGA', '2420 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(588, 'JACINTO C. SEE', '2421 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(589, 'KENNETH G. MONTANO', '2423 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(590, 'ALELEI P. CARPIO', '2424 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(591, 'LOLITA D. ESPINOSA', '2424 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(592, 'MELVIN L. PRINCIPE', '2424 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(593, 'MILAGROS L. PRINCIPE', '2424 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(594, 'TANYA MARIE O. ESPINOSA', '2424-A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(595, 'ROSALINA B. TAN', '2425 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(596, 'WILLIAM S. PERALTA', '2426 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(597, 'STEPHEN C. MATABANG', '2426 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(598, 'JONATHAN B. DACASIN', '2427 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(599, 'RUBY B. PAYAWAL', '2428 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(600, 'VIOLETA E. DALAY', '2428 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(601, 'RICARDO P. APOLONIA', '2429 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(602, 'ELIZABETH P. APOLONIA', '2429 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(603, 'ESTRELLA L. BALANZA', '2430 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(604, 'LYDIA O. MIANO', '2431 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(605, 'DIOLITO E. MORALES', '2432 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(606, 'RIZABELLE C. CARLOS', '2432 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(607, 'FELY M. CIPRIANO', '2433 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(608, 'MAYRAFE L. REYES', '2434 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(609, 'EDGARDO E. DIAMANTE', '2436 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(610, 'ERLINDA D. GRANDE', '2436 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(611, 'MA. IRMA LOURDES I. ASIERTO', '2436 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(612, 'TERESA D. JACINTO', '2436 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(613, 'TERESA E. DIAMANTE', '2436 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(614, 'FLORABELLE P. MOLINA', '2437 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(615, 'TERESITA C. PARIÑAS', '2437 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(616, 'GLORIA S. HERNAEZ', '2440 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(617, 'IMELDA G. YAP', '2442 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(618, 'JULIE BELLE G. YAP', '2442 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(619, 'LEONARDO D. YAP JR.', '2442 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(620, 'RAYMUND C. CAMALLAN', '2443 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(621, 'MARIA KATRINA S. CONSUEGRA', '2444 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(622, 'RUFINA Y. SARMENTA', '2444 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(623, 'CARMELA M. CORPUZ', '2445-A ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(624, 'CHARITO MANUEL', '2445-B ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(625, 'JUSTIN ROBERT VERGARA', '2445-B ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(626, 'ANA C. LUPE', '2449 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(627, 'RAMIL N. VERGAÑO', '2451 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(628, 'AFRICA G. GARCIA', '2452 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(629, 'CESAR P. CUYA', '2452 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(630, 'MA. ROWENA O. CUYA', '2452 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(631, 'ROSITO P. CUYA', '2452 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(632, 'ALLAN M. SEVILLA', '2453 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(633, 'EDWARD M. SEVILLA', '2453 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(634, 'FREDERICK M. SEVILLA', '2453 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(635, 'CHARLES VINCENT CALUMBA', '2455 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(636, 'CHRIZIA M. OBELLO', '2455 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(637, 'MARILYN S. CALUMBA', '2455 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(638, 'ALEJANDRO D. ALEJON', '2461 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(639, 'PEPITO D. ALEJON', '2461 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(640, 'DARWIN B. CHAVEZ', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(641, 'HERMINIA P. NAVAL', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(642, 'JASMINE N. ARROYO', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(643, 'JENIFIER P. NAVAL', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(644, 'JOCELYN N. ARROYO', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(645, 'JOHN GABRIEL T. ABAD', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(646, 'JULES G. SORIANO', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(647, 'KIRSTEN N. GOLEZ', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(648, 'RICKY M. ABAD', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(649, 'ROBERTO D. VERA', '2466 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(650, 'BERNARDO F. NADONGA', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(651, 'COSME C. BANTULA JR.', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(652, 'DINDO F. NADONGA', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(653, 'JOANNA M. FIGUEROA', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(654, 'JOHN CARLO Y. FIGUEROA', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(655, 'KRISTIAN P. FERROLINO', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(656, 'TEODORA Y. FIGUEROA', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(657, 'YOLANDA G. GRIÑO', '2468 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(658, 'ANTONIO B. CAYETANO', '2469 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(659, 'DANILO B. CAYETANO', '2469 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(660, 'WINIE MAY A. BRAZA', '2469 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(661, 'NERISSA E. SANTOS', '2469-B ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(662, 'MARIA LUISA B. BUENCONSEJO', '2469-C ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(663, 'CRISTETA M. ALBANIO', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(664, 'EDMAR R. HUFANO', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(665, 'ELENA T. MACAPAYAG', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(666, 'JOCELYN R. BADILLA', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(667, 'JOLLY ANN T. ROMERO', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(668, 'JOY D. NAGUA', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(669, 'MARY GRACE A. SAN JUAN', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(670, 'MERCILETA A. RUNAS', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(671, 'NELSON A. CABESUELA JR.', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(672, 'RAYMOND M. ALBANIO', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(673, 'REY MARK B. BARRAZA', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(674, 'RONALD ALLAN M. ALBANIO', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(675, 'GERONIMO B. GARING', '2472 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(676, 'NOMERLITO M. CIPRIANO', '2933 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(677, 'MYBEL D. CARMONA', '2411 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(678, 'GERRY B. PERALTA', '2415 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(679, 'GLENN MARK Z. NAVARRO', '2412 1C ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(680, 'BENIGNO R. CENTENO', '2437 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(681, 'TERESITA D. ONG', '2452 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(682, 'JELY O. FLORES', '2470 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(683, 'JOEY DELA FUENTE', '2408 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25'),
(684, 'WENNY JAUCIAN', '2420 ANDRADE STREET', 'ANDRADE STREET', '2026-01-12 05:14:25');

-- --------------------------------------------------------

--
-- Table structure for table `household_members`
--

CREATE TABLE `household_members` (
  `id` int(11) NOT NULL,
  `household_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `relation_to_head` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `incident_date` datetime NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `complainant_id` int(11) DEFAULT NULL,
  `respondent_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incidents`
--

INSERT INTO `incidents` (`id`, `incident_date`, `incident_type`, `location`, `description`, `complainant_id`, `respondent_id`, `status`, `created_at`) VALUES
(1, '2025-11-13 02:30:00', 'Complaint', 'Malabon', 'Suntukan', 2, 1, 'Under Investigation', '2025-11-13 03:31:33'),
(2, '2005-02-10 02:00:00', 'Domestic Violence', 'Bato12', 'Nothing', 7, 1, 'Open', '2025-12-21 08:22:43'),
(3, '2025-12-21 04:15:00', 'Complaint', 'Barangay 369', 'hel', 3, 8, 'Open', '2025-12-21 12:16:14'),
(4, '2000-10-01 10:00:00', 'Vandalism', 'Barangay 369', '341231', 7, 8, 'on process', '2026-01-12 04:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `officials`
--

CREATE TABLE `officials` (
  `id` int(11) NOT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `full_name` varchar(150) NOT NULL,
  `position` varchar(100) NOT NULL,
  `order_no` int(11) DEFAULT 0,
  `is_captain` tinyint(1) DEFAULT 0,
  `is_secretary` tinyint(1) DEFAULT 0,
  `signature_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officials`
--

INSERT INTO `officials` (`id`, `profile_img`, `full_name`, `position`, `order_no`, `is_captain`, `is_secretary`, `signature_path`) VALUES
(2, '/uploads/profile_pictures/1768092476987-sisec.png', 'Fregilda P. Matabang', 'Barangay Secretary', 10, 0, 1, '/uploads/signatures/1768092668623-download (1).png'),
(3, '/uploads/profile_pictures/1765342951031-Rrichard.jpg', 'Richard U. Benitez', 'Barangay Kagawad', 2, 0, 0, NULL),
(4, '/uploads/profile_pictures/1765342968700-Romolou.jpg', 'Romulo O. Enrica', 'Barangay Kagawad', 3, 0, 0, NULL),
(5, '/uploads/profile_pictures/1765342989468-kim.jpg', 'Kim Louise M. Descuatan', 'Barangay Kagawad', 4, 0, 0, NULL),
(6, '/uploads/profile_pictures/1765343022794-runas.jpg', 'Mercileta A. Runas', 'Barangay Kagawad', 5, 0, 0, NULL),
(7, '/uploads/profile_pictures/1765342895273-RamonM.png', 'Ramon M. Marcellana', 'Barangay Kagawad', 6, 0, 0, NULL),
(8, '/uploads/profile_pictures/1765343003076-AngelitoV.png', 'Angelito P. Velasco', 'Barangay Kagawad', 8, 0, 0, NULL),
(9, '/uploads/profile_pictures/1765343352523-JoelM.png', 'Joel M. Figueroa', 'Barangay Kagawad', 7, 0, 0, NULL),
(10, NULL, 'Norbie F. Salud', 'Sangguniang Kabataan Chairperson', 12, 0, 0, NULL),
(11, '/uploads/profile_pictures/1765342917549-Marilou.png', 'Marilou M. Congco', 'Barangay Treasurer', 11, 0, 0, NULL),
(12, '/uploads/profile_pictures/1765435605912-JessicaM.jpg', 'Jessica C. Morit', 'Barangay Kagawad', 9, 0, 0, NULL),
(13, '/uploads/profile_pictures/1768093567831-592933438_722674887547978_226829068571050109_n (1).png', 'Engr. Manolito R. Callanta', 'Punong Barangay', 1, 0, 0, '/uploads/signatures/1768093481809-download (2).png');

-- --------------------------------------------------------

--
-- Table structure for table `page_access`
--

CREATE TABLE `page_access` (
  `id` int(11) NOT NULL,
  `page_key` varchar(100) NOT NULL,
  `page_label` varchar(255) NOT NULL,
  `official_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_access`
--

INSERT INTO `page_access` (`id`, `page_key`, `page_label`, `official_id`) VALUES
(7, 'residentidcard', 'Resident ID Card', 15),
(8, 'dashboard', 'dashboard', 15),
(9, 'residents', 'Residents', 15),
(10, 'households', 'Households', 15),
(11, 'incidents', 'Incidents', 15),
(12, 'services', 'Services', 15),
(13, 'certificates', 'Certificates', 15),
(14, 'officials', 'Officials', 15),
(15, 'calendarpage', 'Calendar', 15),
(16, 'settings', 'Settings', 15),
(17, 'adminsecuritysettings', 'adminsecuritysettings', 15),
(27, 'dashboard', 'Dashboard', 12),
(28, 'residents', 'Residents', 12),
(29, 'households', 'Households', 12),
(30, 'incidents', 'Incidents', 12),
(31, 'services', 'Services', 12),
(32, 'certificates', 'Certificates', 12),
(33, 'adminsecuritysettings', 'Settings', 12),
(34, 'residentidcard', 'Resident ID Card', 12),
(35, 'dashboard', 'Dashboard', 8),
(36, 'residents', 'Residents', 8),
(37, 'households', 'Households', 8),
(38, 'incidents', 'Incidents', 8),
(39, 'services', 'Services', 8),
(40, 'certificates', 'Certificates', 8),
(41, 'officials', 'Officials', 8),
(42, 'adminsecuritysettings', 'Settings', 8),
(43, 'residentidcard', 'Resident ID Card', 8),
(236, 'dashboard', 'Dashboard', 2),
(237, 'residents', 'Residents', 2),
(238, 'households', 'Households', 2),
(239, 'incidents', 'Incidents', 2),
(240, 'services', 'Services', 2),
(241, 'certificates', 'Certificates', 2),
(242, 'officials', 'Officials', 2),
(243, 'calendarpage', 'Calendar', 2),
(244, 'settings', 'Barangay Profile', 2),
(245, 'requestpanel', 'requestpanel', 2),
(246, 'adminsecuritysettings', 'Settings', 2),
(247, 'dashboard', 'Dashboard', 2),
(248, 'residents', 'Residents', 2),
(249, 'households', 'Households', 2),
(250, 'incidents', 'Incidents', 2),
(251, 'services', 'Services', 2),
(252, 'certificates', 'Certificates', 2),
(253, 'officials', 'Officials', 2),
(254, 'calendarpage', 'Calendar', 2),
(255, 'settings', 'Barangay Profile', 2),
(256, 'requestpanel', 'requestpanel', 2),
(257, 'audits', 'audits', 2),
(258, 'adminsecuritysettings', 'Settings', 2),
(259, 'dashboard', 'Dashboard', 2),
(260, 'residents', 'Residents', 2),
(261, 'households', 'Households', 2),
(262, 'incidents', 'Incidents', 2),
(263, 'services', 'Services', 2),
(264, 'certificates', 'Certificates', 2),
(265, 'officials', 'Officials', 2),
(266, 'calendarpage', 'Calendar', 2),
(267, 'settings', 'Barangay Profile', 2),
(268, 'requestpanel', 'requestpanel', 2),
(269, 'audits', 'audits', 2),
(270, 'adminsecuritysettings', 'Settings', 2),
(271, 'dashboard', 'Dashboard', 2),
(272, 'residents', 'Residents', 2),
(273, 'households', 'Households', 2),
(274, 'incidents', 'Incidents', 2),
(275, 'services', 'Services', 2),
(276, 'certificates', 'Certificates', 2),
(277, 'officials', 'Officials', 2),
(278, 'calendarpage', 'Calendar', 2),
(279, 'settings', 'Barangay Profile', 2),
(280, 'requestpanel', 'requestpanel', 2),
(281, 'audits', 'audits', 2),
(282, 'adminsecuritysettings', 'Settings', 2),
(283, 'dashboard', 'Dashboard', 2),
(284, 'residents', 'Residents', 2),
(285, 'households', 'Households', 2),
(286, 'incidents', 'Incidents', 2),
(287, 'services', 'Services', 2),
(288, 'certificates', 'Certificates', 2),
(289, 'officials', 'Officials', 2),
(290, 'calendarpage', 'Calendar', 2),
(291, 'settings', 'Barangay Profile', 2),
(292, 'requestpanel', 'requestpanel', 2),
(293, 'adminsecuritysettings', 'Settings', 2),
(294, 'residentidcard', 'Resident ID Card', 2),
(295, 'auditpage', 'History Logs', 2),
(296, 'dashboard', 'Dashboard', 4),
(297, 'residents', 'Residents', 4),
(298, 'households', 'Households', 4),
(299, 'incidents', 'Incidents', 4),
(300, 'services', 'Services', 4),
(301, 'certificates', 'Certificates', 4),
(302, 'adminsecuritysettings', 'Settings', 4),
(303, 'residentidcard', 'Resident ID Card', 4),
(304, 'dashboard', 'Dashboard', 1),
(305, 'residents', 'Residents', 1),
(306, 'households', 'Households', 1),
(307, 'incidents', 'Incidents', 1),
(308, 'services', 'Services', 1),
(309, 'certificates', 'Certificates', 1),
(310, 'officials', 'Officials', 1),
(311, 'requestpanel', 'requestpanel', 1),
(312, 'adminsecuritysettings', 'Settings', 1),
(313, 'residentidcard', 'Resident ID Card', 1),
(322, 'residents', 'Residents', 3),
(323, 'households', 'Households', 3),
(324, 'incidents', 'Incidents', 3),
(325, 'services', 'Services', 3),
(326, 'certificates', 'Certificates', 3),
(327, 'officials', 'Officials', 3),
(328, 'adminsecuritysettings', 'Settings', 3),
(329, 'residentidcard', 'Resident ID Card', 3),
(330, 'calendarpage', 'Calendar', 3);

-- --------------------------------------------------------

--
-- Table structure for table `print_requests`
--

CREATE TABLE `print_requests` (
  `id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `request_type` varchar(100) NOT NULL,
  `requested_by` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `printed_at` datetime DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `print_requests`
--

INSERT INTO `print_requests` (`id`, `resident_id`, `request_type`, `requested_by`, `status`, `created_at`, `approved_at`, `expires_at`, `printed_at`, `reason`) VALUES
(20, 2, 'barangay_id', 11, 'approved', '2025-12-26 18:10:08', '2025-12-27 02:10:16', '2026-01-03 02:10:16', NULL, NULL),
(21, 3, 'barangay_id', 11, 'approved', '2025-12-26 18:11:45', '2025-12-27 02:11:49', '2026-01-03 02:11:49', NULL, NULL),
(22, 8, 'barangay_id', 17, 'approved', '2025-12-29 03:51:29', '2025-12-29 12:00:39', '2026-01-05 12:00:39', NULL, NULL),
(23, 8, 'barangay_indigency', 17, 'approved', '2025-12-29 04:11:31', '2025-12-29 12:12:39', '2026-01-05 12:12:39', NULL, NULL),
(24, 3, 'indigency_minor', 17, 'approved', '2025-12-29 04:11:36', '2025-12-29 12:12:35', '2026-01-05 12:12:35', NULL, NULL),
(25, 1, 'barangay_id', 17, 'approved', '2025-12-29 04:24:26', '2025-12-29 12:25:00', '2026-01-05 12:25:00', NULL, NULL),
(27, 2, 'barangay_id', 11, 'approved', '2026-01-05 07:46:04', '2026-01-05 15:46:30', '2026-01-12 15:46:30', NULL, NULL),
(28, 19, 'barangay_id', 11, 'approved', '2026-01-12 03:47:16', '2026-01-12 11:47:24', '2026-01-15 11:47:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `request_id_table`
--

CREATE TABLE `request_id_table` (
  `requestID_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `precint_no` varchar(255) NOT NULL,
  `id_number` varchar(255) NOT NULL,
  `date_issue` varchar(255) NOT NULL,
  `valid_until` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_id_table`
--

INSERT INTO `request_id_table` (`requestID_id`, `resident_id`, `precint_no`, `id_number`, `date_issue`, `valid_until`) VALUES
(1, 2, '', 'ID-2-1765550537583', '2025-12-12', 'end of term'),
(2, 1, '', 'ID-1-1765550833164', '2025-12-12', 'END OF TERM');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int(11) NOT NULL,
  `resident_code` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `sex` enum('Male','Female','Other') DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `is_senior` int(1) NOT NULL DEFAULT 0,
  `birthdate` varchar(255) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `work` varchar(255) DEFAULT NULL,
  `monthly_income` int(11) DEFAULT NULL,
  `contact_no` varchar(50) DEFAULT NULL,
  `purok` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_voters` int(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `precint_no` varchar(60) DEFAULT NULL,
  `fullname_emergency` varchar(255) DEFAULT NULL,
  `contact_no_emergency` varchar(255) DEFAULT NULL,
  `is_pwd` int(11) DEFAULT 0,
  `is_solo_parent` int(11) DEFAULT 1,
  `living` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `resident_code`, `profile_picture`, `last_name`, `first_name`, `middle_name`, `suffix`, `sex`, `age`, `is_senior`, `birthdate`, `civil_status`, `work`, `monthly_income`, `contact_no`, `purok`, `address`, `is_voters`, `created_at`, `precint_no`, `fullname_emergency`, `contact_no_emergency`, `is_pwd`, `is_solo_parent`, `living`, `status`) VALUES
(1, '2026-00002', NULL, 'San Jose', 'Dhani', 'Ignacio', 'null', 'Male', 43, 0, '1982-01-06', 'Single', '', 0, '09112345678', '', 'Blk 14 Lot 19', 0, '2025-11-13 03:28:13', '', '', '', 1, 1, '', 1),
(2, '2026-00003', '/uploads/profile_pictures/1765711263002-formalpic.jpg', 'Montano', 'Mark Anthony', 'Placido', '', 'Male', 22, 0, '2003-06-26', 'Single', '', 0, '09948183681', 'Dona Yayang', '19 G Dona yayang Street Libis', 1, '2025-11-13 03:28:54', '4033A', 'Mario A. Montano', '09666287280', 0, 1, '', 0),
(3, '2026-00004', '/uploads/profile_pictures/1766305161811-f2dbcf37-7231-4c55-8d65-0c5ffe4ee60f.jfif', 'Mecasio', 'Arden', 'Bandoja', 'Jr', 'Male', 65, 0, '1960-04-10', 'Single', 'Computer Shops', 2, '9079787', 'Bato', 'Lot1 Blk7 Salmon Alley, Mannunggal St. Brgy. Tatalon', 1, '2025-12-14 03:43:16', '4658A', 'Hello World', '20250001231', 0, 1, '', 1),
(7, '2026-00005', 'null', 'Dela Cruz', 'Cedrick Llyod', 'P.', '', 'Male', 22, 0, '2003-01-10', 'Single', 'Computer Shops', 1, '9079787', 'ASD', 'Lot1 Blk7 Salmon Alley, Mannunggal St. Brgy. Tatalon', 1, '2025-12-21 08:20:49', '1213B', 'Arden Mecasio', '0962791313', 0, 1, '6 years', 1),
(8, '2026-00006', '/uploads/profile_pictures/1766313632716-f2dbcf37-7231-4c55-8d65-0c5ffe4ee60f.jfif', 'Ciruela', 'Genny', 'D.', 'as', 'Female', 5, 1, '2020-12-26', 'Single', 'Parlor', 2, '8296183', 'DASDADAS', 'sadasdasd', 1, '2025-12-21 10:40:14', 'asdasd', 'asdas', '21312482681', 0, 1, '6 years', 0),
(19, '2026-00001', NULL, 'Montano', 'Eunice', 'Placido', '', 'Female', 29, 0, '1996-06-17', 'Single', 'BPO ', 3, '09948183681', 'Dona Yayang', '19 G Dona yayang Street Libis', 1, '2026-01-03 10:01:31', '4033A', 'Mark Anthony Montano', '09666287280', 0, 1, '10 years', 1),
(20, '2026-00007', NULL, 'Mecasio12', 'Arden12', 'Bandoja12', '', 'Male', 22, 0, '2003-05-10', 'Single', 'Computer Shops', 0, '9079787', 'yiuy', 'Manunggal St.', 0, '2026-01-08 12:02:35', '7645A', 'Arden Bandoja Mecasio', '78567456453', 0, 1, '1 years', 1);

-- --------------------------------------------------------

--
-- Table structure for table `resident_sequences`
--

CREATE TABLE `resident_sequences` (
  `year` int(11) NOT NULL,
  `last_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resident_sequences`
--

INSERT INTO `resident_sequences` (`year`, `last_number`) VALUES
(2026, 7);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_name`, `description`, `service_date`, `location`, `created_at`) VALUES
(6, 'AKAP Certification', NULL, '2025-12-21', 'Barangay 369', '2025-12-21 11:07:39'),
(7, 'asd', NULL, '2025-12-21', 'Barangay 369', '2025-12-21 12:15:52'),
(8, 'Social Pension', 'Social Pension For Senior Citizen', '2026-01-08', 'Barangay 369', '2026-01-08 13:18:27');

-- --------------------------------------------------------

--
-- Table structure for table `service_beneficiaries`
--

CREATE TABLE `service_beneficiaries` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthdate` varchar(60) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `is_senior` int(1) NOT NULL DEFAULT 0,
  `civil_status` varchar(60) DEFAULT NULL,
  `work` varchar(60) DEFAULT NULL,
  `monthly_income` int(11) DEFAULT NULL,
  `is_voters` int(1) DEFAULT 0,
  `contact_no` varchar(60) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_beneficiaries`
--

INSERT INTO `service_beneficiaries` (`id`, `service_id`, `resident_id`, `fullname`, `address`, `birthdate`, `age`, `is_senior`, `civil_status`, `work`, `monthly_income`, `is_voters`, `contact_no`, `notes`, `created_at`) VALUES
(20, 6, 8, 'asdasd, asda asdas as', 'sadasdasd', '2000-01-10', 25, 1, 'Single', 'Parlor', 2, 0, '8296183', NULL, '2025-12-21 11:07:46'),
(21, 6, 7, 'Dela Cruz, Cedrick Llyod P.', 'Lot1 Blk7 Salmon Alley, Mannunggal St. Brgy. Tatalon', '2003-01-10', 22, 0, 'Single', 'Computer Shops', 1, 1, '9079787', '', '2026-01-08 12:48:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `official_id` int(11) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `role` enum('SuperAdmin','Admin','User') DEFAULT 'User',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `require_otp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `official_id`, `profile_image`, `username`, `password_hash`, `full_name`, `role`, `created_at`, `require_otp`) VALUES
(9, 12, NULL, '4rdenmecasi0@gmail.com', '$2b$10$qb8ULyvxbdk31tiQb7ohYuw2XvRSeglc1amH8NbST/W2r/aofRwqa', 'Jessica C. Morit', 'User', '2025-12-21 12:18:44', 1),
(10, 8, NULL, 'angelitovelasco@gmail.com', '$2b$10$ZaWU8uEz3EXv9zjuzj20ael0.LJ120k0JWfMiIe40OG79N5i3mqma', 'Angelito P. Velasco', 'Admin', '2025-12-21 12:21:05', 0),
(11, 3, NULL, 'markmontano999@gmail.com', '$2b$10$zFGTApAt3yQ8QPYMbH6jPOYvzTaKHqUCewM80gyEojRlVbUcpLCsa', 'Richard U. Benitez', 'User', '2025-12-24 16:27:23', 0),
(16, 2, '/uploads/profile_pictures/1766910247743-sisec.jpg', 'markmontano522@gmail.com', '$2b$10$MYqL6T2twCaEGjh2t.MGuuThyK6.EFN/PpBhUVSF/cykkk7ZAUFJe', 'Fregilda P. Matabang', 'SuperAdmin', '2025-12-28 08:02:12', 0),
(17, 4, NULL, 'romulaenrica@gmail.com', '$2b$10$rrhPE7sCr47PB4dekgilZOi25/BryKQp8vjoJKXGLdZej6FJuyMzi', 'Romulo O. Enrica', 'User', '2025-12-29 03:51:14', 0),
(18, 1, NULL, 'manolitocallanta@gmail.com', '$2b$10$CSMR4OcwVRhOsvLxpEV5leL56NhdJ2WsdXGOSsCeHR6l2SwxZ62ES', 'Engr. Manolito R. Callanta', 'Admin', '2025-12-29 03:59:05', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit`
--
ALTER TABLE `audit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `barangay_profile`
--
ALTER TABLE `barangay_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  ADD PRIMARY KEY (`template_id`),
  ADD UNIQUE KEY `template_code` (`template_code`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_requested`
--
ALTER TABLE `document_requested`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_images`
--
ALTER TABLE `event_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `households`
--
ALTER TABLE `households`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `household_members`
--
ALTER TABLE `household_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `household_id` (`household_id`),
  ADD KEY `resident_id` (`resident_id`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complainant_id` (`complainant_id`),
  ADD KEY `respondent_id` (`respondent_id`);

--
-- Indexes for table `officials`
--
ALTER TABLE `officials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_access`
--
ALTER TABLE `page_access`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `print_requests`
--
ALTER TABLE `print_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `request_id_table`
--
ALTER TABLE `request_id_table`
  ADD PRIMARY KEY (`requestID_id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `resident_code` (`resident_code`);

--
-- Indexes for table `resident_sequences`
--
ALTER TABLE `resident_sequences`
  ADD PRIMARY KEY (`year`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `resident_id` (`resident_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit`
--
ALTER TABLE `audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `barangay_profile`
--
ALTER TABLE `barangay_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  MODIFY `template_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `document_requested`
--
ALTER TABLE `document_requested`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `event_images`
--
ALTER TABLE `event_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `households`
--
ALTER TABLE `households`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=685;

--
-- AUTO_INCREMENT for table `household_members`
--
ALTER TABLE `household_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `officials`
--
ALTER TABLE `officials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `page_access`
--
ALTER TABLE `page_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=331;

--
-- AUTO_INCREMENT for table `print_requests`
--
ALTER TABLE `print_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `request_id_table`
--
ALTER TABLE `request_id_table`
  MODIFY `requestID_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_images`
--
ALTER TABLE `event_images`
  ADD CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `household_members`
--
ALTER TABLE `household_members`
  ADD CONSTRAINT `household_members_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `household_members_ibfk_2` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`complainant_id`) REFERENCES `residents` (`id`),
  ADD CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`respondent_id`) REFERENCES `residents` (`id`);

--
-- Constraints for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  ADD CONSTRAINT `service_beneficiaries_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_beneficiaries_ibfk_2` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
