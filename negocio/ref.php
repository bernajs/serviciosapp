<?php
require_once("../admin/_class/class.negocio.php");
$obj = new Negocio();
$oid = $_REQUEST['oid'];
$uid = $_REQUEST['uid'];
$obj->set_id($uid)->set_oid($oid)->db('update_onesignal_id');
print_r($_REQUEST);
echo 1;
?>
