<?php
session_start();
require_once('../_composer/class.notify.php');
require_once('../admin/_class/class.service.php');
require_once('../admin/_class/class.push.php');
$objNotify = new Notify();
$obj = new Service();
$push = new Push();
switch($_POST['exec']) {
    case "getServicios":
        $servicios = $obj->getServicios();
        if($servicios){
            $result['data'] = $servicios;
            $result['status'] = 202;
    }else{
        $result['status'] = 0;
    }
    echo json_encode($result);
    break;
case "getUsuario":
    $data = $_POST['data'];
    $usuario = $obj->getUsuario($data);
    $ciudades = $obj->getCiudades();
    $direcciones = $obj->getDirecciones($data);
    $datos = array('usuario'=>$usuario, 'ciudades'=>$ciudades, 'direcciones'=>$direcciones);
    // print_r($datos);
    if($datos){
        $result['data'] = $datos;
        $result['status'] = 202;
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
    set_id_ciudad($data['id_ciudad'])->
    set_contrasena($data['contrasena'])->
    set_confirmar_contrasena($data['confirmar_contrasena'])->
    set_modified_at(date("Y-m-d H:i:s"))->
    set_id($data['id'])->
    db('update');
    $result['status'] = 202;
    // $push->sendMessage('48d92136-d140-4490-9aa9-6f701a8b9f73','Tu perfil ha sido actualizado', NULL);
    echo json_encode($result);
    break;
case "getCompartir":
    $data = $_POST['data'];
    $compartir = $obj->getCompartir($data);
    if ($compartir) {
        $result['status'] = 202;
        $result['data'] = $compartir;
} else {
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "compartir":
    $data = $_POST['data'];
    $direcciones = array();
    foreach ($data['direcciones'] as $direccion) {
        array_push($direcciones, $direccion);
}
$obj->set_correo($data['correo'])->
set_movil($data['movil'])->
set_id_usuario($data['id_usuario'])->
set_ubicacion($data['ubicacion'])->
set_id_negocio($data['id_negocio'])->
set_id_cotizacion($data['id_cotizacion'])->
set_direccion(json_encode($direcciones))->
db('compartir');
$result['status'] = 202;
echo json_encode($result);
break;
case "evaluar":
    $data = $_POST['data'];
    // $calificacion = $data['chk['];
    // $calificacion = explode('|', $calificacion);
    $cal_final = $calificacion[0];
    $obj->set_testimonio($data['testimonio'])->
    set_calificacion($data['calificacion'])->
    set_id_negocio($data['id_negocio'])->
    set_id_usuario($data['id_usuario'])->
    set_id_requerimiento($data['id_requerimiento'])->
    set_created_at(date("Y-m-d H:i:s"))->
    db('evaluar');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "agregarDireccion":
    $data = $_POST['data'];
    $obj->set_calle($data['calle'])->
    set_ciudad($data['id_ciudad'])->
    set_estado($data['estado'])->
    set_municipio($data['municipio'])->
    set_cp($data['cp'])->
    set_colonia($data['colonia'])->
    set_status(1)->
    set_created_at(date("Y-m-d H:i:s"))->
    set_id($data['id_usuario'])->
    db('agregarDireccion');
    $result['status'] = 202;
    $result['redirect'] = 'perfil.html';
    echo json_encode($result);
    break;
break;
case "getNegocios":
    $data = $_POST['data'];
    $negocios = $obj->getNegocioFiltro($data['id_servicio'], $data['id_zona'], $data['id_usuario']);
    // $negocios = $obj->getNegocios($data['id_servicio'], $data['id_zona']);
    if($negocios){
        $result['data'] = $negocios;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getDireccion":
    $data = $_POST['data'];
    $direccion = $obj->getDireccion($data);
    if($direccion){
        $result['data'] = $direccion;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "actualizarDireccion":
    $data = $_POST['data'];
    $obj->set_calle($data['calle'])->
    set_ciudad($data['id_ciudad'])->
    set_estado($data['estado'])->
    set_municipio($data['municipio'])->
    set_cp($data['cp'])->
    set_colonia($data['colonia'])->
    set_status(1)->
    set_modified_at(date("Y-m-d H:i:s"))->
    set_id($data['id_direccion'])->
    db('actualizarDireccion');
    $result['status'] = 202;
    $result['redirect'] = 'perfil.html';
    echo json_encode($result);
    break;
break;
case "enviarChat":
    // $data = $_POST['data'];
    // $obj->set_id_usuario($data['id_usuario'])->
    // set_id_negocio($data['id_negocio'])->
    // set_id_requerimiento($data['id_requerimiento'])->
    // set_mensaje($data['mensaje'])->
    // set_tipo_usuario($data['tipo_usuario'])->
    // set_status(0)->
    // set_created_at(date("Y-m-d H:i:s"))->
    // db('enviarChat');
    // $result['status'] = 202;
    // $result['redirect'] = 'perfil.html';
    
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
    //Si es usuario 0 = cliente entonces saca el oid del cliente sino saca el oid del negocio
    if($data['tipo_usuario'] == 1){
        $uoid = $obj->getUOID($data['id_usuario']);
        if($uoid){
            $url = 'http://serviciosapp.mobkii.net/chatmio.html?negocio='.$data['id_negocio'].'&requerimiento='.$data['id_requerimiento'].'&s='.$data['servicio'];
            $push->sendMessage($uoid[0]['oid'],'Tienes un nuevo mensaje.', $url, NULL);
    }
}else if($data['tipo_usuario'] == 0){
    $noid = $obj->getNOID($data['id_negocio']);
    if($noid){
        $url = 'http://serviciosapp.mobkii.net/negocio/negocio_chat.html?usuario='.$data['id_usuario'].'&requerimiento='.$data['id_requerimiento'];
        $push->sendMessage($noid[0]['oid'],'Tienes un nuevo mensaje.', $url, 1);
    }
}
echo json_encode($result);
break;
break;
case "getChat":
    $data = $_POST['data'];
    $id_requerimiento = $data['id_requerimiento'];
    $id_negocio = $data['id_negocio'];
    $chat = $obj->getChat($id_requerimiento, $id_negocio);
    if($chat){
        $obj->readChatUsuario($id_requerimiento, $id_negocio);
        $result['data'] = $chat;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "borrarDireccion":
    $data = $_POST['data'];
    $obj->set_id($data)->
    db('borrarDireccion');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "getCiudades":
    $data = $_POST['data'];
    $ciudades = $obj->getCiudades();
    if($ciudades){
        $result['data'] = $ciudades;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getFavoritos":
    $data = $_POST['data'];
    $favoritos = $obj->getFavoritos($data);
    if($favoritos){
        $result['data'] = $favoritos;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getCotizaciones":
    $data = $_POST['data'];
    $cotizaciones = $obj->getCotizaciones($data);
    if($cotizaciones){
        $result['data'] = $cotizaciones;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getHistorial":
    $data = $_POST['data'];
    $cotizaciones = $obj->getCotizaciones($data);
    $llamadas = $obj->getLlamadas($data);
    $historial = array('llamadas' => $llamadas, 'cotizaciones' => $cotizaciones);
    if($cotizaciones || $llamadas){
        $result['data'] = $historial;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getCotizacionDetalle":
    $data = $_POST['data'];
    // echo $data;
    $cotizaciones = $obj->getCotizacionDetalle($data);
    if($cotizaciones){
        $result['data'] = $cotizaciones;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getVotoCiudades":
    $data = $_POST['data'];
    print_r($data);
    $ciudades = $obj->getVotoCiudades();
    if($ciudades){
        $result['data'] = $ciudades;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "negocioDetalles":
    $data = $_POST['data'];
    $id_negocio = $data['id_negocio'];
    $id_usuario = $data['id_usuario'];
    $testimonios = $obj->negocioTestimonios($id_negocio);
    $zonas = $obj->negocioZonas($id_negocio);
    $servicios = $obj->negocioServicios($id_negocio);
    $favorito = $obj->negocioFavorito($id_usuario, $id_negocio);
    $negocio = $obj->getNegocio($id_negocio);
    $datos = array("testimonios"=>$testimonios, "zonas"=> $zonas, "servicios"=>$servicios,"favorito"=>$favorito, "negocio"=>$negocio);
    if($negocio){
        $obj->visita($data['id_negocio']);
        $result['data'] = $datos;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "llamada":
    $data = $_POST['data'];
    $id_negocio = $data['id_negocio'];
    $id_usuario = $data['id_usuario'];
    $obj->llamadaUsuario($id_usuario, $id_negocio, date("Y-m-d H:i:s"));
    $obj->llamada($id_negocio);
    break;
case "filtro":
    $data = $_POST['data'];
    $zonas = $obj->getZonas($data);
    $servicios = $obj->getServicios();
    $filtros = array('servicios'=>$servicios, 'zonas'=>$zonas);
    if($filtros){
        $result['data'] = $filtros;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "getNegocioZona":
    $data = $_POST['data'];
    $zonas = $obj->getNegocioFiltro($data['id_servicio'], $data['id_zona']);
    if($zonas){
        $result['data'] = $zonas;
        $result['status'] = 202;
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
// Primero se entra a este case en el cual se inserta la cotizacion en la tabla y regresa un id de la cotizacion
// Mejorar
case "cotizar":
    $data = $_POST['data'];
    $cotizacion = $obj->cotizar($data['id_usuario'],$data['id_servicio'], $data['cotizacion'],
    $data['fecha_submit'], date("Y-m-d H:i:s"), $data['imagenes']);
    if($cotizacion){
        $result['redirect'] = 'cotizacion.html?id='.$data['id_servicio'];
        $result['id_cotizacion'] = $cotizacion;
        $result['status'] = 202;
        echo json_encode($result);
}
break;
// Ya que entro en cotizacion entra por aqui e inserta en la tabla negocio_requerimiento
// Mejorar, se puede hacer este case y el de cotzar en un solo case
case "cotizacion":
    $data = $_POST['data'];
    $negocios = (explode('|', $data['id_negocio[']));
    for ($i=0; $i < (count($negocios)); $i++) {
        if ($negocios[$i] != '') {
            $obj->set_id_negocio($negocios[$i])->
            set_id_cotizacion($data['id_cotizacion'])->
            set_id_usuario($data['id_usuario'])->
            set_modified_at(date("Y-m-d H:i:s"))->
            db('cotizacion');
            $obj->cotizacion_estadistica($negocios[$i]);
            
            $obj->set_id_usuario($data['id_usuario'])->
            set_id_negocio($negocios[$i])->
            set_id_requerimiento($data['id_cotizacion'])->
            set_mensaje($data['cotizacion'])->
            set_tipo_usuario(0)->
            set_status(0)->
            set_created_at(date("Y-m-d H:i:s"))->
            db('enviarChat');
            
            
            $noid = $obj->getNOID($negocios[$i]);
            if($noid){
                $push->sendMessage($noid[0]['oid'],'Tienes una cotización nueva.', NULL, true);
        }
        // $uoid = $obj->getUOID($data['id_usuario']);
        // if($uoid){
        //     $push->sendMessage($uoid[0]['oid'],'Haz enviado una cotización.', NULL, NULL);
        // }
    }
}
$result['status'] = 202;
$result['redirect'] = "servicios.html";
echo json_encode($result);
break;
case "recover":
    $data = $_POST['data'];
    $email = $obj->check_email($data['e']);
    if($email){
        $notify_data = ['contrasena' => $email[0]['contrasena'], "usuario"=>$email[0]['nombre']];
        $objNotify->send("homefix-recuperar-contrasena",$notify_data,$email[0]['correo']);
        $result['status'] = 202;
}else{
    $result['status'] = 404;
}
echo json_encode($result);
break;
case "login":
    $data = $_POST['data'];
    $user = $obj->isRegistered($data['u'],$data['p']);
    if($user){
        $result['redirect'] = 'process.html?id='.$user[0]['id'];
        $result['status'] = 202;
        $result['uid'] = $user[0]['id'];
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
case "loginAdmin":
    $data = $_POST['data'];
    $user = $obj->isAdmin($data['u'],$data['p']);
    if($user){
        $result['redirect'] = 'index.php?call=dashboard';
        $result['status'] = 202;
        $_SESSION["onSessionAdmin"] = true;
        $_SESSION["uid"] = $user[0]['id'];
}else{
    $result['status'] = 0;
}
echo json_encode($result);
break;
//Vota por una ciudad, es por metodo
case "votoCiudad":
    $data = $_POST['data'];
    $flag = $obj->correoVotoCiudad($data['voto_ciudad'], $data['correo']);
    if($flag){
        $result['status'] = 0;
}else{
    $obj->newVotoCiudad($data['voto_ciudad'], $data['correo'], date("Y-m-d H:i:s"));
    $result['status'] = 202;
}
echo json_encode($result);
break;
case "registro":
    $flag = 0;
    $data = $_POST['data'];
    if($obj->check_email($data['correo'])){
        $result['status'] = 409;
}else if($obj->check_tel($data['movil'])){
    $result['status'] = 408;
}else{
    $obj->set_correo($data['correo'])->
    set_nombre($data['nombre'])->
    set_movil($data['movil'])->
    set_id_ciudad($data['id_ciudad'])->
    set_contrasena($data['contrasena'])->
    set_confirmar_contrasena($data['confirmar_contrasena'])->
    set_created_at(date("Y-m-d H:i:s"))->
    set_status($data['status'])->
    db('insert');
    $uid = $obj->getLastInserted();
    $result['status'] = 202;
    $result['uid'] = $uid;
    $result['redirect'] = 'process.html';
    $notify_data = ["usuario"=>$data['nombre']];
    $objNotify->send("homefix-nuevo-registro",$notify_data,$data['correo']);
    $result['status'] = 202;
}
echo json_encode($result);
break;
case "loginfb":
    if($obj->check_email($_POST['email'])){
        $result['status'] = 409;
}else if($obj->check_tel($_POST['telefono'])){
    $result['status'] = 408;
}else{
    $usuario = $obj->isFbRegistered($_POST['id']);
    if (!$usuario) {
        $obj->set_fid($_POST['id'])->
        set_nombre($_POST['name'])->
        set_id_ciudad($_POST['ciudad'])->
        set_movil($_POST['telefono'])->
        set_correo($_POST['email'])->
        set_status(1)->
        set_created_at(date('Y-m-d H:i:s'))->
        db('insert');
        $li = $obj->getLastInserted();
        $result['redirect']='process.html?id='.$li;
        $result['uid']=$li;
    } else {
        $result['uid']=$usuario[0]['id'];
        $result['redirect']='process.html?id='.$usuario[0]['id'];
    }
    $result['status']=202;
}
echo json_encode($result);
break;
case "isRegisteredFb":
    $data = $_POST['data'];
    $usuario = $obj->isFbRegistered($data['id']);
    if (!$usuario) {
        $ciudades = $obj->getCiudades();
        $result['status'] = 0;
        $result['ciudades'] = $ciudades;
} else {
    $result['uid']=$usuario[0]['id'];
    $result['redirect']='process.html?id='.$usuario[0]['id'];
    $result['status']=202;
}
echo json_encode($result);
break;
}
?>