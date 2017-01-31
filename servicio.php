<?php
include_once("_inc/inc.head.php");
$data = NULL;
require_once("admin/_class/class.servicio.php");
require_once("admin/_class/class.zona.php");
require_once("admin/_class/class.servicio.php");
$obj = new Servicio();
$negocios = $obj->getServicioDetalle($_GET['id'], null);
$lista_negocios;

if($_GET['zona']){
    $negocios = $obj->getServicioDetalle($_GET['id'], $_GET['zona']);
    foreach ($negocios as $negocio) {
        $lista_negocios .= '<a href="negocio.php?id='.$negocio['id'].'">
        <div class="col s12">
        <b>'.$negocio['nombre'].'</b>
        <br>
        </div>
        <div class="col s12" style="border-bottom: solid 1px;">
        <p>Servicio: '.$negocio['servicio'].'</p>
        </div>
        </a>
        </div>';
    }
}else{
    $negocios = $obj->getServicioDetalle($_GET['id'], null);
    foreach ($negocios as $negocio) {
        $lista_negocios .= '<label><input type="checkbox"><a href="negocio.php?id='.$negocio['id'].'">
        <div class="col s12">
        <b>'.$negocio['nombre'].'</b>
        <br>
        </div>
        <div class="col s12" style="border-bottom: solid 1px;">
        <p>Servicio: '.$negocio['servicio'].'</p>
        </div>
        </a>
        </div>';
    }
}

$objZona = new Zona();
$zonas = $objZona->getData();
$lista_zonas;

foreach ($zonas as $zona) {
    $lista_zonas .= '<a href="servicio.php?id="'.$_GET['id'].'&zona='.$zona['id'].'><option value="'.$zona['id'].'">'.$zona['zona'].'</option></a>';
}

$objServicio = new Servicio();
$servicios = $objServicio->getData();
$lista_servicios;

foreach ($servicios as $servicio) {
    $lista_servicios .= '<option value="'.$servicio['id'].'">'.$servicio['servicio'].'</option>';
}
?>
  <!DOCTYPE html>
  <html>

  <head>
    <title>Categoría</title>
    <meta charset="UTF-8">
    <!--Import Google Icon Font-->
    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection" />
    <link type="text/css" rel="stylesheet" href="css/custom.css" media="screen,projection" />

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  </head>

  <body>
    <div class="row buscar-blue">
      <div class="input-field col s10 offset-s1 buscar">
        <input id="buscar" type="text" class="validate">
        <label for="buscar">Buscar</label>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col s12 select">
          <div class="input-field col s6">
            <select>
              <?php echo $lista_zonas; ?>
            </select>
            <label>Zona</label>
          </div>
          <div class="input-field col s6 select">
            <select>
              <?php echo $lista_servicios ?>
            </select>
            <label>Servicio</label>
          </div>
          <p><b>Resultados de: Plomeria (<?php echo count($negocios) ?>)</b></p>
        </div>
      </div>
      <form action="">
        <?php echo $lista_negocios ?>
      </form>
    </div>

    <!--Import jQuery before materialize.js-->
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="js/materialize.min.js"></script>

    <script>
      $(document).ready(function() {
        $('select').material_select();
      });
    </script>
  </body>

  </html>