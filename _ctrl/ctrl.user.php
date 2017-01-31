<?php
session_start();
require_once('../admin/_class/class.user.php');
require_once('../_composer/class.notify.php');
$objNotify = new Notify();
$obj = new User();
switch($_POST['exec']) {
    case "login":
        $data = $_POST['data'];
        $user = $obj->isRegistered($data['u'],$data['p']);
        if($user){
            $result['redirect'] = 'index.php';
            $result['status'] = 202;
            $_SESSION["onSessionAdmin"] = true;
            $_SESSION["uid"] = $user[0]['id'];
    }else{
        $result['status'] = 0;
    }
    echo json_encode($result);
    break;
case "recover":
    $data = $_POST['data'];
    $email = $obj->isValidEmail($data['e']);
    if($email){
        $code = $email[0]['id'].'.'.md5(date("Ymdhis"));
        $notify_data = ['code' => $code];
        $objNotify->send("recuperar-contrasena",$notify_data,$email[0]['correo']);
        $result['status'] = 202;
}else{
    $result['status'] = 404;
}
echo json_encode($result);
break;

}
?>