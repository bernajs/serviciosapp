<?php
session_start();
require_once('../_composer/class.notify.php');
require_once('../admin/_class/class.negocio_service.php');
$objNotify = new Notify();
$obj = new Service();
switch($_POST['exec']) {
    case "login":
        $data = $_POST['data'];
        $user = $obj->isRegistered($data['u'],$data['p']);
        if($user && $user[0]['status'] == 1){
            $result['redirect'] = 'negocio_historial.html';
            $result['status'] = 202;
            $result['nid'] = $user[0]['id'];
    }else if($user && $user[0]['status'] == 0){
        $result['status'] = 200;
    }else{
        $result['status'] = 0;
    }
    echo json_encode($result);
    break;
case "historial":
    $data = $_POST['data'];
    $cotizaciones=$obj->getCotizaciones($data);
    $llamadas = $obj->getLlamadas($data);
    $historial = array('cotizaciones'=>$cotizaciones, 'llamadas'=>$llamadas);
    if ($historial) {
        $result['data'] = $historial;
        $result['status'] = 202;
} else {
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getChat":
    $data = $_POST['data'];
    $id_requerimiento = $data['id_requerimiento'];
    $id_negocio = $data['id_negocio'];
    $id_usuario = $data['id_usuario'];
    $chat = $obj->getChat($id_requerimiento, $id_negocio, $id_usuario);
    if($chat){
        $obj->readChatNegocio($id_requerimiento, $id_negocio, $id_usuario);
        $result['data'] = $chat;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "enviarChat":
    $data = $_POST['data'];
    $obj->set_id_usuario($data['id_usuario'])->
    set_id_negocio($data['id_negocio'])->
    set_id_requerimiento($data['id_requerimiento'])->
    set_mensaje($data['mensaje'])->
    set_tipo_usuario($data['tipo_usuario'])->
    set_status(0)->
    set_created_at(date("Y-m-d H:i:s"))->
    db('enviarChat');
    $result['status'] = 202;
    // $result['redirect'] = 'perfil.html';
    echo json_encode($result);
    break;
break;
case "select":
    $zonas = $obj->getZonas();
    $servicios = $obj->getServicios();
    $select = array('zonas'=>$zonas, 'servicios'=> $servicios);
    if ($servicios && $zonas) {
        $result['data'] = $select;
        $result['status'] = 202;
} else {
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "registro":
    $data = $_POST['data'];
    if($data['contrasena'] == $data['confirmar_contrasena']){
        $obj->set_correo($data['correo'])->
        set_nombre($data['nombre'])->
        set_movil($data['movil'])->
        set_telefono($data['telefono'])->
        set_informacion($data['informacion'])->
        set_zonas($data['zonas'])->
        set_servicios($data['servicios'])->
        set_id_ciudad($data['id_ciudad'])->
        set_contrasena($data['contrasena'])->
        set_confirmar_contrasena($data['confirmar_contrasena'])->
        set_created_at(date("Y-m-d H:i:s"))->
        set_status(0)->
        db('insert');
        $uid = $obj->getLastInserted();
        $result['status'] = 202;
        $result['nid'] = 0;
        $result['redirect'] = 'servicios.html';
        $obj->servzona($data['zonas'], $data['servicios'], $uid);
}else{
    $result['status'] = 409;
}
echo json_encode($result);
break;
}
?>