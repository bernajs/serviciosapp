<?php
/*
Notificaciones:
1) Registrar Usuario.
2) Registrar Orden de Servicio.
3) Cancelar Orden de Servicio.
4) Servicio en Proceso.
5) Cobro de Servicio.

*/
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once('vendor/autoload.php');

use SparkPost\SparkPost;
use GuzzleHttp\Client;
use Ivory\HttpAdapter\Guzzle6HttpAdapter;

class Notify{
  var $id;
 
  public function __construct(){ }
  
  function send($template,$data,$to){
	$httpAdapter = new Guzzle6HttpAdapter(new Client());
	$sparky = new SparkPost($httpAdapter, ['key'=>"c3cec69f38f307ebda3e9b111624f0d1a43be631"]);
    try {
      $results = 
		$sparky->transmission->send([
		  'template'=>$template,
		  'substitutionData'=>$data,
		  'recipients'=>[['address'=>$to]]
		]);
    }catch (\Exception $err) {
      echo 'Whoops! Something went wrong';
      var_dump($err);
    }
  }  
}
?>