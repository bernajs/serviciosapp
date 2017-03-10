<?php
session_start();
require_once('../_composer/class.notify.php');
require_once('../admin/_class/class.negocio_service.php');
require_once('../admin/_class/class.push.php');
$push = new Push();
$objNotify = new Notify();
$obj = new Service();
switch($_POST['exec']) {
    case "login":
        $data = $_POST['data'];
        $user = $obj->isRegistered($data['u'],$data['p']);
    if($user){$suscripcion = $obj->getSuscripcion($user[0]['id']);}
    if($user && $user[0]['status'] == 1 && $suscripcion){
        $result['redirect'] = 'process.html?id='.$user[0]['id'];
        $result['status'] = 202;
        $result['nid'] = $user[0]['id'];
        $result['data'] = $suscripcion;
    }else if($user && $user[0]['status'] == 0){
        $result['status'] = 200;
    }else if($user && !$suscripcion){
        $result['status'] = 201;
    }else{
        $result['status'] = 0;
    }
    echo json_encode($result);
    break;
case "updateProfile":
    $data = $_POST['data'];
    $obj->set_nombre($data['nombre'])->
    set_correo($data['correo'])->
    set_movil($data['movil'])->
    set_telefono($data['telefono'])->
    set_contrasena($data['contrasena'])->
    set_modified_at(date("Y-m-d H:i:s"))->
    set_id($data['id'])->
    db('update');
    $result['status'] = 202;
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
case "suscripcion":
    $data = $_POST['data'];
    $suscripcion = $obj->getSuscripcion($data);
    if ($suscripcion) {
        $result['data'] = $suscripcion;
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
    $obj->readChatNegocio($id_requerimiento, $id_negocio, $id_usuario);
    if($chat){
        $result['data'] = $chat;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "enviarChat":
    $data = $_POST['data'];
    $uoid = $obj->getUOID($data['id_usuario']);
    $obj->set_id_usuario($data['id_usuario'])->
    set_id_negocio($data['id_negocio'])->
    set_id_requerimiento($data['id_requerimiento'])->
    set_mensaje($data['mensaje'])->
    set_tipo_usuario($data['tipo_usuario'])->
    set_status(0)->
    set_created_at(date("Y-m-d H:i:s"))->
    db('enviarChat');
    $result['status'] = 202;
    if($uoid){
        echo $uoid[0]['oid'];
        echo $url;
        $url = 'http://serviciosapp.mobkii.net/chatmio.html?negocio='.$data['id_negocio'].'&requerimiento='.$data['id_requerimiento'].'&s='.$data['servicio'];
        $push->sendMessage($uoid[0]['oid'],'Tienes un nuevo mensaje.', $url, NULL);
}
// $result['redirect'] = 'perfil.html';
echo json_encode($result);
break;
case "cotizacionDetalle":
    $data = $_POST['data'];
    $cotizacion = $obj->getCotizacionDetalle($data);
    if ($cotizacion) {
        $result['status'] = 202;
        $result['data'] = $cotizacion;
} else {
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getUsuario":
    $data = $_POST['data'];
    $usuario = $obj->getUsuario($data['usuario'], $data['requerimiento'], $data['negocio']);
    $direcciones = array();
    $info;
    if ($usuario) {
        $info = explode(' ',$usuario[0]['info']);
        $info = json_decode($info[0], true);
        $usuarioinfo = $obj->getDatosUsuario($usuario[0]['id_usuario']);
        if(!$info['correo']){
            // echo "entra a correo";
            // $usuarioinfo[0] = array_diff($usuarioinfo[0], array('correo'));
            unset($usuarioinfo[0]['correo']);
    }
    if(!$info['telefono']){
        // $usuarioinfo[0] = array_diff($usuarioinfo[0], array('telefono'));
        // echo "entra a telefono";
        unset($usuarioinfo[0]['movil']);
    }
    
    
    // print_r($usuarioinfo);
    
    if($info['direccion']){
        $dir = explode(',', $info['direccion']);
        foreach ($dir as $id) {
            $direccion = $obj->getUsuarioDireccion($id);
            array_push($direcciones, $direccion[0]);
        }
    }else{$direcciones = null;}
    $info = array('usuario' =>$usuarioinfo, "direccion"=>$direcciones, 'ubicacion'=>$info['ubicacion']);
    $result['status'] = 202;
    $result['data'] = $info;
} else {
    $usuario = $obj->getDatosUsuario($data['usuario']);
    $result['data'] = $usuario;
    $result['status'] = 0;
}
echo json_encode($result);
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
case "getNegocio":
    $data = $_POST['data'];
    $negocio = $obj->getNegocio($data);
    if ($negocio) {
        $result['data'] = $negocio;
        $result['status'] = 202;
} else {
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "estadisticas":
    $data = $_POST['data'];
    $estadisticas = $obj->getEstadisticas($data);
    $calificacion = $obj->getCalificacion($data);
    $info = array('estadisticas'=>$estadisticas, 'calificacion'=>$calificacion);
    if ($info) {
        $result['data'] = $info;
        $result['status'] = 202;
} else {
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "testimonio":
    $data = $_POST['data'];
    $testimonios = $obj->getTestimonio($data);
    if ($testimonios) {
        $result['status'] = 202;
        $result['data'] =$testimonios;
}else {
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
case "recover":
    $data = $_POST['data'];
    $email = $obj->isValidEmail($data['e']);
    if($email){
        // $code = $email[0]['id'].'.'.md5(date("Ymdhis"));
        // $notify_data = ['code' => $code];
        // $objNotify->send("recuperar-contrasena",$notify_data,$email[0]['correo']);
        $result['status'] = 202;
}else{
    $result['status'] = 404;
}
echo json_encode($result);
break;
}
?>