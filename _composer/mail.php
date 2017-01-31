<?php
require 'vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use SparkPost\SparkPost;
use GuzzleHttp\Client;
use Ivory\HttpAdapter\Guzzle6HttpAdapter;

$httpAdapter = new Guzzle6HttpAdapter(new Client());
$sparky = new SparkPost($httpAdapter, ['key'=>'c3cec69f38f307ebda3e9b111624f0d1a43be631']);

try {
  // Build your email and send it!
  $results = $sparky->transmission->send([
    'template'=>'bienvenida',
	'substitutionData'=>['nombre'=>'LUIS CRUZ'],
    'recipients'=>[
      [
        'address'=>[
          'name'=>'Luis',
          'email'=>'luis@kafeina.com'
        ]
      ]
    ]
  ]);
  echo 'Woohoo! You just sent your first mailing!';
} catch (\Exception $err) {
  echo 'Whoops! Something went wrong';
  var_dump($err);
}
?>
