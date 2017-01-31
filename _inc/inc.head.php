<?php
session_start();
if(!isset($_SESSION["onSession"]) || is_null($_SESSION["onSession"])){ header("Location: index.php"); }
$uid = $_SESSION['uid'];