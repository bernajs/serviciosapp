<?php
session_start();
require_once('../admin/_class/class.usuario.php');
$obj = new Usuario();
switch($_POST['exec']) {
    case "registro":
        $data = $_POST['data'];
        if($data['contrasena'] == $data['confirmar_contrasena']){
            $obj->set_correo($data['correo'])->
            set_nombre($data['nombre'])->
            set_movil($data['movil'])->
            set_id_ciudad($data['id_ciudad'])->
            set_contrasena($data['contrasena'])->
            set_confirmar_contrasena($data['confirmar_contrasena'])->
            set_created_at(date("Y-m-d H:i:s"))->
            set_status($data['status'])->
            db('insert');
            
            $user = $obj->isRegistered($data['correo'],$data['contrasena']);
            if($user){
                $result['redirect'] = 'servicios.html';
                $result['status'] = 202;
                $_SESSION["onSession"] = true;
                $_SESSION["uid"] = $user[0]['id'];
        }
        $result['status'] = 202;
        $result['redirect'] = 'servicios.html';
    }else{
        $result['status'] = 409;
    }
    echo json_encode($result);
    break;
case "cotizar":
    $data = $_POST['data'];
    $cotizacion = $obj->cotizar($data['id_usuario'],$data['id_servicio'], $data['cotizacion'],  $data['fecha_submit']);
    if($cotizacion){
        $result['redirect'] = 'cotizacion.html?id='.$data['id_servicio'].'&cot='.$cotizacion;
        $result['status'] = 202;
        echo json_encode($result);
}
break;
case "agregarDireccion":
    $data = $_POST['data'];
    $obj->set_calle($data['calle'])->
    set_ciudad($data['ciudad'])->
    set_estado($data['estado'])->
    set_municipio($data['municipio'])->
    set_cp($data['cp'])->
    set_pais($data['pais'])->
    set_status(1)->
    set_created_at(date("Y-m-d H:i:s"))->
    set_id($data['id_usuario'])->
    db('agregarDireccion');
    $result['status'] = 202;
    $result['redirect'] = 'perfil.php';
    echo json_encode($result);
    break;
break;
case "actualizarDireccion":
    $data = $_POST['data'];
    $obj->set_calle($data['calle'])->
    set_ciudad($data['ciudad'])->
    set_estado($data['estado'])->
    set_municipio($data['municipio'])->
    set_cp($data['cp'])->
    set_pais($data['pais'])->
    set_status(1)->
    set_modified_at(date("Y-m-d H:i:s"))->
    set_id($data['id_direccion'])->
    db('actualizarDireccion');
    $result['status'] = 202;
    $result['redirect'] = 'perfil.php';
    echo json_encode($result);
    break;
break;
case "cotizacion":
    $data = $_POST['data'];
    $obj->set_id_negocio($data['id_negocio['])->
    set_id_cotizacion($data['id_cotizacion'])->
    db('cotizacion');
    $result['status'] = 202;
    $result['redirect'] = "servicios.php";
    echo json_encode($result);
    break;
case "agregarFavoritos":
    $data = $_POST['data'];
    $obj->set_id_negocio($data['id_negocio'])->
    set_id($data['id_usuario'])->
    db('agregarFavoritos');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "borrarFavorito":
    $data = $_POST['data'];
    $obj->set_id_negocio($data['id_negocio'])->
    set_id($data['id_usuario'])->
    db('borrarFavorito');
    $result['status'] = 202;
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
    echo json_encode($result);
    break;
case "addShip":
    $data = $_POST['data'];
    $obj->set_company($data['company'])->
    set_company_address($data['company_address'])->
    set_company_address_2($data['company_address_2'])->
    set_state($data['state'])->
    set_zip_code($data['zip_code'])->
    set_city($data['city'])->
    set_id($data['id_customer'])->
    db('ship');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "updateShip":
    $data = $_POST['data'];
    $obj->set_company($data['company'])->
    set_company_address($data['company_address'])->
    set_company_address_2($data['company_address_2'])->
    set_state($data['state'])->
    set_zip_code($data['zip_code'])->
    set_city($data['city'])->
    set_id($data['id'])->
    db('updateShip');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "borrarDireccion":
    $data = $_POST['data'];
    $obj->set_id($data)->
    db('borrarDireccion');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "addBill":
    $data = $_POST['data'];
    $obj->set_company($data['company'])->
    set_company_address($data['company_address'])->
    set_company_address_2($data['company_address_2'])->
    set_state($data['state'])->
    set_zip_code($data['zip_code'])->
    set_city($data['city'])->
    set_bank($data['bank'])->
    set_bank_account($data['bank_account'])->
    set_id($data['id_customer'])->
    db('bill');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "updateBill":
    $data = $_POST['data'];
    $obj->set_company($data['company'])->
    set_company_address($data['company_address'])->
    set_company_address_2($data['company_address_2'])->
    set_state($data['state'])->
    set_zip_code($data['zip_code'])->
    set_city($data['city'])->
    set_bank($data['bank'])->
    set_bank_account($data['bank_account'])->
    set_id($data['id'])->
    db('updateBill');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "deleteBill":
    $data = $_POST['data'];
    $obj->set_id($data)->
    db('deleteBill');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "cancelOrder":
    $data = $_POST['data'];
    $obj->set_id($data)->
    db('cancelOrder');
    $result['status'] = 202;
    echo json_encode($result);
    break;
case "login":
    $data = $_POST['data'];
    $user = $obj->isRegistered($data['u'],$data['p']);
    if($user){
        $result['redirect'] = 'servicios.php';
        $result['status'] = 202;
        $_SESSION["onSession"] = true;
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
        // $code = $email[0]['id'].'.'.md5(date("Ymdhis"));
        // $notify_data = ['code' => $code];
        // $objNotify->send("recuperar-contrasena",$notify_data,$email[0]['correo']);
        $result['status'] = 202;
}else{
    $result['status'] = 404;
}
echo json_encode($result);
break;
// Services
case "getServicios":
    $data = $_POST['data'];
    $cotizacion = $obj->cotizar($data['id_usuario'],$data['id_servicio'], $data['cotizacion'],  $data['fecha_submit']);
    if($cotizacion){
        $result['redirect'] = 'cotizacion.php?id='.$data['id_servicio'].'&cot='.$cotizacion;
        $result['status'] = 202;
        echo json_encode($result);
}
break;
}
?>