<?php
/**
* Copyright 2011 Facebook, Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may
* not use this file except in compliance with the License. You may obtain
* a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations
* under the License.
*/

require '../src/facebook.php';

// Create our Application instance (replace this with your appId and secret).
$facebook = new Facebook(array(
'appId'  => '1854946121441774',
'secret' => '35e2e36f842eaf6dcfcb82812e64ebc8',
));
// $token = $facebook->getAccessToken();
// $facebook->setAccessToken($token);
// $facebook->setAccessToken($_SESSION['facebook_access_token']);
// Get User ID
$user = $facebook->getUser();

// We may or may not have this data based on whether the user is logged in.
//
// If we have a $user id here, it means we know the user is logged into
// Facebook, but we don't know if the access token is valid. An access
// token is invalid if the user logged out of Facebook.

if ($user) {
    try {
        // Proceed knowing you have a logged in user who's authenticated.
        $user_profile = $facebook->api('/me?fields=email,name');
    } catch (FacebookApiException $e) {
        error_log($e);
        $user = null;
    }
}

// Login or logout url will be needed depending on current user state.
if ($user) {
    $logoutUrl = $facebook->getLogoutUrl();
} else {
    $loginUrl = $facebook->getLoginUrl();
}

// This call will always work since we are fetching public data.
//$naitik = $facebook->api('/abhijit.gaikwad');

?>
  <!doctype html>
  <html xmlns:fb="http://www.facebook.com/2008/fbml">

  <head>
    <title>Registro</title>
    <meta charset="UTF-8">
    <!--Import Google Icon Font-->

    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="-1">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="../../css/materialize.min.css" media="screen,projection" />
    <link type="text/css" rel="stylesheet" href="../../css/custom.css" media="screen,projection" />
    <link type="text/css" rel="stylesheet" href="../../admin/assets/plugins/sweetalert/sweetalert.css" media="screen,projection" />
    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        /*display: none;*/
      }
      
      .login {
        display: none;
      }
      
      .hidden {
        display: none;
      }
    </style>
    <script src="../../admin/assets/plugins/jquery/jquery-2.2.0.min.js"></script>
    <script type="text/javascript" src="../../admin/assets/plugins/sweetalert/sweetalert.min.js">
    </script>
    <script type="text/javascript" src="../../js/materialize.min.js"></script>
    <script>
      <?php
$data = array('data'=>$user_profile, 'exec'=>'loginfb')
?>

      function registrar() {
        var flag = 0;
        var data = <?php echo json_encode($user_profile);?>;
        data.ciudad = $('#ciudad').val();
        data.telefono = $('#telefono').val();
        data.exec = 'loginfb';

        if (!data.telefono || data.telefono.length < 10) {
          $('#telefono').addClass('invalid');
          flag = 1;
        }
        if (data.ciudad == 0) {
          $('.select-wrapper input').addClass('invalid');
          flag = 1;
        }
        if (flag == 1) {
          swal({
            title: "Error!",
            text: "Por favor ingresa información válida.",
            type: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#2C8BEB"
          });
          return;
        }

        $.ajax({
          type: 'POST',
          url: '../../_ctrl/ctrl.service.php',
          data: data,
          success: function(r) {
            var data = JSON.parse(r);
            if (data.status == 202) {
              swal({
                title: "Registro",
                text: "Tu usuario ha sido registrado con éxito, te re-direccionaremos a tu cuenta.",
                type: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
              }, function(isConfirm) {
                if (isConfirm) {
                  location.href = '../../' + data.redirect;
                }
              });
              localStorage.setItem('uid', data.uid);
            } else if (data.status == 409) {
              console.log('ya existe el correo');
              swal({
                title: "Error!",
                text: "Ya existe un usuario registrado con la cuenta de correo asociada a tu facebook.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
              });
            } else if (data.status == 408) {
              swal({
                title: "Error!",
                text: "Ya existe un usuario registrado con el número de teléfono ingresado.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
              });
              $('#telefono').addClass('invalid');
            }
          }
        })
      }
    </script>

  </head>

  <body>
    <?php if ($user): ?>
      <?php $data = array('data'=>$user_profile, 'exec'=>'isRegisteredFb') ?>
        <script>
          console.log(<?php echo json_encode($data);?>);
          $.ajax({
            type: 'POST',
            url: '../../_ctrl/ctrl.service.php',
            data: <?php echo json_encode($data);?>,
            success: function(r) {
              var data = JSON.parse(r);
              console.log(r);
              if (data.status == 202) {
                location.href = '../../' + data.redirect;
                localStorage.setItem('uid', data.uid);
              } else if (data.status == 0) {
                var buffer = '';
                var ciudades = data.ciudades;
                ciudades.forEach(function(element) {
                  buffer += '<option value="' + element.id + '">' + element.ciudad + '</option>';
                });
                $('#ciudad').append(buffer);
                $('form').removeClass('hidden');
                $('select').material_select();
              }
            }
          })
        </script>
        <?php else: ?>
          <script>
            $(document).ready(function() {
              var url = $('.login').attr('href');
              location.href = url;
            });
          </script>
          <?php endif ?>
            <?php if ($user): ?>
              <div class="container">
                <form action="" id="frmRegistroFb" name="frmRegistroFb" class="hidden">
                  <div class="row">
                    <div class="col s12 center-align">
                      <img src="https://graph.facebook.com/<?php echo $user; ?>/picture?&type=large" class="responsive-img circle">
                    </div>
                    <div class="input-field col s12">
                      <select name="ciudad" id="ciudad">
                        <option value="0">Selecciona tu ciudad</option>
                      </select>
                      <label for="ciudad">Ciudad</label>
                    </div>
                    <div class="input-field col s12">
                      <input type="number" name="telefono" id="telefono">
                      <label for="telefono">Teléfono</label>
                    </div>
                    <div class="col s12">
                      <a class="btn full-btn blue" onClick="registrar()">Terminar registro</a>
                    </div>
                  </div>
                </form>
              </div>

              <?php else: ?>
                <a href="<?php echo $loginUrl; ?>" class="login">Login with Facebook</a>
                <?php endif ?>
  </body>

  </html>