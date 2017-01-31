<?php
session_start();
if(!isset($_SESSION["onSessionAdmin"]) || is_null($_SESSION["onSessionAdmin"])){ header("Location: login.php"); }
$uid = $_SESSION['uid'];