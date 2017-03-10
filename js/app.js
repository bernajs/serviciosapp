/* USER */
var Customer;
var fecha_anterior;
var dias = new Array(7);
dias[0] = "Domingo";
dias[1] = "Lunes";
dias[2] = "Martes";
dias[3] = "Miércoles";
dias[4] = "Jueves";
dias[5] = "Viernes";
dias[6] = "Sábado";
var meses = new Array(12);
meses[0] = "Ene";
meses[1] = "Feb";
meses[2] = "Mar";
meses[3] = "Abr";
meses[4] = "Mayo";
meses[5] = "Jun";
meses[6] = "Jul";
meses[7] = "Ago";
meses[8] = "Sep";
meses[9] = "Oct";
meses[11] = "Nov";
meses[12] = "Dic";




Customer = {
    init: function () {
        var _self = this;
        this.order = null;
        this.me = null;
        _self.addEventListeners();
    },
    /* EVENT LISTENERS */
    addEventListeners: function () {
        var _self = this;
        $(document).on("click", "a.onAgregarDireccion", function (e) { _self.agregarDireccion(e); });
        $(document).on("click", "a.onLlamada", function (e) { _self.llamada(e); });
        $(document).on("click", "a.onEvaluar", function (e) { _self.evaluar(e); });
        $(document).on("click", "a.onClickVotoCiudad", function () { _self.votoCiudad(); })
        $(document).on("click", "a.onClickEnviar", function (e) { _self.enviarChat(e); });
        $(document).on("click", "a.onActualizarDireccion", function (e) { _self.actualizarDireccion(e); });
        $(document).on("click", "a.onBorrarDireccion", function (e) { _self.borrarDireccion(e); });
        $(document).on("click", "a.onAgregarFavorito", function (e) { _self.agregarFavorito(e); });
        $(document).on("click", "a.onBorrarFavorito", function (e) { _self.borrarFavorito(e); });
        $(document).on("click", "a.onUpdateProfile", function (e) { _self.updateProfile(e); });
        $(document).on("click", "a.onClickCotizacion", function (e) { _self.cotizacion(e); });
        $(document).on("click", "a.onClickCotizar", function (e) { _self.cotizar(e); });
        $(document).on("click", "div.onClickGetCompartir", function (e) { _self.getCompartir(e); });
        $(document).on("click", "a.onClickCompartir", function (e) { _self.compartir(e) });
    },
    /* PROFILE */
    updateProfile: function () {
        var flag = 0;
        var info = DAO.toObject($("#frmPerfil").serializeArray());
        info.id = getUid();
        if (!info.nombre || info.nombre.length < 3) {
            $('#nombre').addClass('invalid');
            flag = 1;
        }


        if (!info.correo || info.correo.length < 3) {
            $('#correo').addClass('invalid');
            flag = 1;
        }


        if (!info.movil || info.movil.length < 10) {
            $('#movil').addClass('invalid');
            flag = 1;
        }


        if (info.contrasena && info.contrasena.length < 3) {
            $('#contrasena').addClass('invalid');
            flag = 1;
        }


        if (info.confirmar_contrasena && info.confirmar_contrasena.length < 3 || info.confirmar_contrasena != info.contrasena) {
            $('#confirmar_contrasena').addClass('invalid');
        }
        if (info.contrasena != info.confirmar_contrasena) {
            swal({
                title: "Error!",
                text: "Las contraseñas no coinciden.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
            flag = 2;
        }
        if (flag == 0) {
            DAO.execute("_ctrl/ctrl.service.php",
                {
                    exec: "updateProfile",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        swal({
                            title: "",
                            text: "Datos guardados correctamente.",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                        // location.reload();
                    } else if (r.status == 404) {
                        swal({
                            title: "",
                            text: "Algo salió mal, por favor vuelve a intentarlo.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                });
        } else if (flag == 1) {
            swal({
                title: "Error!",
                text: "Por favor ingresa datos correctos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }


    },
    getCompartir: function (e) {
        var uid = getUid();
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getCompartir",
                data: uid
            }, function (r) {
                if (r.status = 202) {
                    var direccion = '';
                    var direcciont;
                    var buffer = '';
                    console.log(r.data);
                    if (r.data[0]) {
                        var data = r.data[0];
                        $('#nombre').html(data.nombre);
                        $('.correo').empty().html('Correo (' + data.correo + ')');
                        $('.movil').empty().html('Teléfono (' + data.movil + ')');
                    }
                    if (r.data[0].direccion) {
                        r.data.forEach(function (element) {
                            direcciont = JSON.parse(element.direccion);
                            direccion += direcciont.calle + ', ' + direcciont.ciudad;
                            buffer += '<div class="col s12 input-field">\
                        <input type="checkbox" id="'+ element.id + '" value="' + element.id + '">\
                        <label for="'+ element.id + '" class="dir">' + direccion + '</label>\
                    </div>';
                            direccion = '';
                        });
                    }
                    $('.direcciones').empty().append(buffer);
                    $('.modal').modal();
                    $('#direccion').material_select();
                    $('#modal1').modal('open');
                } else {
                    console.log("algo salio mal");
                }
            });
    },
    compartir: function (e) {
        var data = DAO.toObject($('#frmCompartir').serializeArray());
        var direcciones = [];
        var buffer = '';
        data.id_negocio = getUrlVars()['negocio'];
        data.id_cotizacion = getUrlVars()['requerimiento'];
        data.id_usuario = getUid();
        $('.direcciones :checked').each(function () {
            direcciones.push($(this).val());
            buffer += $(this).next('label').text() + '<br>';
        });
        data.direcciones = direcciones;
        if (data.correo) { buffer += $('.correo').html() + "<br>"; }
        if (data.movil) { buffer += '<a href="tel:+' + $('.movil').html() + '"">' + $('.movil').html() + '</a>'; }
        $('#message').val(buffer);
        $('.onClickEnviar').click();
        $('#modal1').modal('close');
        // if (data.pos) {
        if (1 > 2) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var ubicacion = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    data.ubicacion = ubicacion;
                    Service.execute("_ctrl/ctrl.service.php",
                        {
                            exec: "compartir",
                            data: data
                        }, function (r) {


                        });
                });
            }
        } else {
            Service.execute("_ctrl/ctrl.service.php",
                {
                    exec: "compartir",
                    data: data
                }, function (r) {


                });
        }
    },
    cotizacion: function () {
        var flag = 0;
        if (!localStorage.getItem('cotizacion')) { console.log('tu cotizacion esta siendo procesada'); return; }
        data = DAO.toObject($("#frmCotizacion").serializeArray());
        var info = JSON.parse(localStorage.getItem('cotizacion'));
        info.imagenes = JSON.parse(localStorage.getItem('img'));
        if (jQuery.isEmptyObject(data)) {
            // alert("Debes seleccionar al menos un negocio para poder cotizar");
            swal({
                title: "Error!",
                text: "Debes seleccionar al menos un negocio para poder cotizar.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
            return;
        }
        DAO.execute("_ctrl/ctrl.service.php",
            {
                exec: "cotizar",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    data = '';
                    data = DAO.toObject($("#frmCotizacion").serializeArray());
                    data.id_cotizacion = r.id_cotizacion;
                    data.id_usuario = getUid();
                    data.cotizacion = info.cotizacion;
                    console.log(data);
                    console.log(info);
                    DAO.execute("_ctrl/ctrl.service.php",
                        {
                            exec: "cotizacion",
                            data: data
                        },
                        function (r) {
                            if (r.status == 202) {
                                swal({
                                    title: "Cotización creada",
                                    text: "Su cotización se ha enviado a los proveedores, ellos se pondrán en contacto con usted.",
                                    type: "success",
                                    confirmButtonText: "Aceptar",
                                    confirmButtonColor: "#2C8BEB"
                                }, function (isConfirm) { if (isConfirm) { /*location.href = r.redirect;*/ } });
                                localStorage.removeItem('cotizacion');
                                localStorage.removeItem('img');
                            } else if (r.status == 404) {
                                swal({
                                    title: "",
                                    text: "Algo salió mal, por favor vuelve a intentarlo.",
                                    type: "error",
                                    confirmButtonText: "Aceptar",
                                    confirmButtonColor: "#2C8BEB"
                                });
                            }
                        });
                } else if (r.status == 404) {
                    swal({
                        title: "",
                        text: "Algo salió mal, por favor vuelve a intentarlo.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                    location.href = "servicios.html";
                }
            });
    },
    cotizar: function () {
        var flag = 0;
        var info = DAO.toObject($("#frmCotizacion").serializeArray());
        var id_servicio = getUrlVars()["id"];
        info.id_servicio = id_servicio;
        info.id_usuario = getUid();

        if (info.dia) {
            if ($('#hoy').is(':checked')) {
                info.fecha_submit = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
            } else if ($('#manana').is(':checked')) {
                var m = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                info.fecha_submit = m.toJSON().slice(0, 10).replace(/-/g, '/');
            } else if (info.fecha == '') { flag = 2; }
        } else {
            flag = 2;
        }
        if (!info.cotizacion || info.cotizacion < 3) {
            flag = 1;
            $('#cotizacion').addClass('invalid');
        }
        if (flag == 0) {
            localStorage.setItem('cotizacion', JSON.stringify(info));
            swal({
                title: "",
                text: "Ahora seleccione los proveedores con los que desea cotizar.",
                type: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            }, function (isConfirm) { if (isConfirm) { location.href = "cotizacion.html?id=" + id_servicio; } });
        } else if (flag == 2) {
            swal({
                title: "Error!",
                text: "Por favor ingrese una fecha.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        } else {
            swal({
                title: "Error!",
                text: "Por favor ingrese datos válidos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }
    },
    getChat: function () {
        var dia;
        var hora;
        var flag = 0;
        var info = new Object();
        info.id_usuario = getUid();
        info.id_negocio = getUrlVars()["negocio"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        var servicio = getUrlVars()["s"];
        servicio = servicio.replace('%C3%AD', '&iacute;')
        var header = '<a href="negocio.html?id=' + info.id_negocio + '">\
            <div class="col s12 mensaje-div valign">\
                <span class="txt-blanco valign"><b>Ver información del proveedor</b>\
                <i class="material-icons secondary-content txt-blanco">keyboard_arrow_right</i><br>\
          Servicio: '+ servicio + '</span></div>\
        </a>';
        $('.header').html(header);

        DAO.execute("_ctrl/ctrl.service.php",
            {
                exec: "getChat",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    data = r.data;
                    var buffer = '';
                    if (data.length > 0) {
                        // dia = data[0].created_at.substring(0, 10);
                        var hoy = new Date();
                        var dif = hoy.getDate();
                        var mes = hoy.getMonth();
                        var fecha;
                        var minuto;
                        console.log(data);
                        data.forEach(function (element) {
                            element.created_at = element.created_at.replace(/-/g, '/');
                            dia = new Date(element.created_at);
                            dif -= dia.getDate();
                            mes -= dia.getMonth();
                            if (dif == 0 && mes == 0) { fecha = 'Hoy'; }
                            else if (dif == 1 && mes == 0) { fecha = 'Ayer'; }
                            else if (dif == 2 && mes == 0) { fecha = 'Antier'; }
                            else { fecha = (dia.getDate()) + '/' + (meses[dia.getMonth()]) + '/' + dia.getFullYear(); }
                            if (dia.getMinutes() < 10) { minuto = '0' + dia.getMinutes(); } else { minuto = dia.getMinutes(); }
                            hora = dia.getHours() + ':' + minuto;
                            if (fecha_anterior == dia.getDate() + '/' + dia.getMonth()) { fecha = ''; }
                            buffer += '<div class="col s6 offset-s3 center-align">\
                                            <span class="center-align txt-gris-claro">'+ fecha + ' </span>\
                                        </div>';
                            if (element.tipo_usuario == 0) {
                                if (element.mensaje.includes('<img')) {
                                    buffer += element.mensaje + '<div class="col s10 offset-s2 right-align txt-gris-claro hora">' + hora + ' </div>';
                                } else {
                                    buffer += '<div class="col s10 offset-s2 color-azul div-msj">\
                                    <div class="caja-msj color-azul">\
                                        <b class="txt-blanco">'+ element.mensaje + '</b>\
                                    </div>\
                                    </div>\
                                    <div class="col s4 offset-s8 right-align txt-gris-claro">'+ hora + ' </div>\
                                    ';
                                }
                            } else {
                                buffer += '<div class="col s10 div-msj">\
                                    <div class="caja-msj color-gris-claro">\
                                        <b>'+ element.mensaje + '</b>\
                                    </div>\
                                    <span class="txt-gris-claro center-align">'+ hora + ' </span>\
                            </div>';
                            }
                            dif = hoy.getDate();
                            mes = hoy.getMonth();
                            fecha_anterior = dia.getDate() + '/' + dia.getMonth();
                        });
                        $('.chat').empty().html(buffer);
                        $('img').empty().addClass('color-azul');
                        $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000);
                        $('.materialboxed').materialbox();
                    }
                } else if (r.status == 0) {
                    $('.chat').text('No tiene ningún mensaje, envia uno');
                }
            });


    },
    enviarChat: function () {
        var flag = 0;
        var info = new Object();
        console.log(fecha_anterior);
        info.id_usuario = getUid();
        info.id_negocio = getUrlVars()["negocio"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        info.mensaje = $('#message').val();
        info.tipo_usuario = 0;

        // console.log($('.chat').text());
        // Usuario = 0
        // Negocio = 1

        if (!info.mensaje) {
            flag = 1;
        }
        if (flag == 0) {
            DAO.execute("_ctrl/ctrl.service.php",
                {
                    exec: "enviarChat",
                    data: info
                },
                function (r) {
                    var fecha = new Date();
                    var fecha_imprimir = '';
                    var minuto = fecha.getMinutes();
                    if (minuto < 10) { minuto = '0' + fecha.getMinutes(); }
                    var hora = fecha.getHours() + ':' + minuto;
                    if (fecha_anterior == fecha.getDate() + '/' + fecha.getMonth()) { fecha_imprimir = '' } else { fecha_imprimir = 'Hoy'; }
                    var buffer = '';
                    if (r.status == 202) {
                        buffer += '\
                        <div class="col s6 offset-s3 center-align">\
                            <span class="txt-gris-claro">'+ fecha_imprimir + '</span>\
                        </div>';

                        if (info.mensaje.includes('<img')) {
                            buffer += info.mensaje + '<div class="col s10 offset-s2 right-align txt-gris-claro hora">' + hora + ' </div>\
                                    ';
                        } else {
                            buffer += '<div class="col s10 offset-s2 color-azul div-msj nuevo">\
                                    <div class="caja-msj color-azul">\
                                        <b class="txt-blanco">'+ info.mensaje + '</b>\
                                    </div>\
                                    </div>\
                                    <div class="col s4 offset-s8 right-align txt-gris-claro">'+ hora + ' </div>\
                                    ';
                        }
                        fecha_imprimir = '';
                        fecha_anterior = fecha.getDate() + '/' + fecha.getMonth();
                        $('#message').val('');
                        if ($('.chat').html() != 'No tiene ningún mensaje, envia uno') {
                            $('.nuevo').removeClass('nuevo');
                            $('.chat').append(buffer);
                            $('.nuevo').hide().fadeIn(1000);
                        } else {
                            $('.chat').empty().append(buffer);
                            $('.nuevo').hide().fadeIn(1000);
                        }
                        $('html,body').animate({ scrollTop: document.body.scrollHeight }, "slow");
                        $('.materialboxed').materialbox();
                    } else if (r.status == 404) {
                        swal({
                            title: "",
                            text: "Algo salió mal, por favor vuelve a intentarlo.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                });
        } else {
        }


    },
    // Shipping
    agregarDireccion: function () {
        var flag = 0;
        var info = DAO.toObject($("#frmDireccion").serializeArray());
        info.id_usuario = getUid();


        if (!info.calle || info.calle.length < 3) {
            $('#calle').addClass('invalid');
            flag = 1;
        }


        if (!info.estado || info.estado.length < 3) {
            $('#estado').addClass('invalid');
            flag = 1;
        }


        if (!info.municipio || info.municipio.length < 3) {
            $('#municipio').addClass('invalid');
            flag = 1;
        }


        if (!info.cp || info.cp.length < 3) {
            $('#cp').addClass('invalid');
            flag = 1;
        }


        if (!info.colonia || info.colonia.length < 3) {
            $('#colonia').addClass('invalid');
            flag = 1;
        }


        if (!info.id_ciudad) {
            $('#id_ciudad').addClass('invalid');
        }

        console.log(info);

        if (flag == 0) {
            DAO.execute("_ctrl/ctrl.service.php",
                {
                    exec: "agregarDireccion",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        swal({
                            title: "",
                            text: "Dirección guardada correctamente.",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        }, function (isConfirm) { if (isConfirm) { location.href = r.redirect; } });
                    } else if (r.status == 404) {
                        swal({
                            title: "",
                            text: "Algo salió mal, por favor vuelve a intentarlo.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                });
        } else {
            swal({
                title: "Error!",
                text: "Por favor llene todos los campos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }


    },
    actualizarDireccion: function () {
        var flag = 0;
        var info = DAO.toObject($("#frmDireccion").serializeArray());




        if (!info.calle || info.calle.length < 3) {
            $('#calle').addClass('invalid');
            flag = 1;
        }


        if (!info.estado || info.estado.length < 3) {
            $('#estado').addClass('invalid');
            flag = 1;
        }


        if (!info.municipio || info.municipio.length < 3) {
            $('#municipio').addClass('invalid');
            flag = 1;
        }


        if (!info.cp || info.cp.length < 3) {
            $('#cp').addClass('invalid');
            flag = 1;
        }


        if (!info.colonia || info.colonia.length < 3) {
            $('#colonia').addClass('invalid');
            flag = 1;
        }


        if (flag == 0) {
            DAO.execute("_ctrl/ctrl.service.php",
                {
                    exec: "actualizarDireccion",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        swal({
                            title: "",
                            text: "Dirección actualizada correctamente.",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        }, function (isConfirm) { if (isConfirm) { location.href = r.redirect; } });
                    } else if (r.status == 404) {
                        swal({
                            title: "",
                            text: "Algo salió mal, por favor vuelve a intentarlo.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                });
        } else {
            swal({
                title: "Error!",
                text: "Por favor llene todos los campos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }


    },
    borrarDireccion: function (e) {
        var el;
        // if (!confirm("Favor de confirmar la eliminació<n></n> de la dirección.")) { return; }
        swal({
            title: "ADVERTENCIA",
            text: "¿Desea eliminar esta dirección?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2C8BEB",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                // var id = $(e.target).data("id");
                var id = getUrlVars()['id'];
                DAO.execute("_ctrl/ctrl.service.php",
                    {
                        exec: "borrarDireccion",
                        data: id
                    },
                    function (r) {
                        if (r.status == 202) {
                            location.href = "perfil.html";
                        } else if (r.status == 404) {
                            swal({
                                title: "",
                                text: "Algo salió mal, por favor vuelve a intentarlo.",
                                type: "error",
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: "#2C8BEB"
                            });
                        }
                    });
            }
        });


    },
    agregarFavorito: function (id_negocio) {
        var el;
        var info = DAO.toObject($("#frmCustomerBill").serializeArray());
        // if (!confirm("¿Desea agregar a favoritos este negocio?")) { return; }
        var id_usuario = getUid();
        info.id_usuario = id_usuario;
        info.id_negocio = id_negocio;
        DAO.execute("_ctrl/ctrl.usuario.php",
            {
                exec: "agregarFavoritos",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    // alert("Negocio agregado a favoritos");
                    $('#favorito').html('<i class="material-icons" onClick="Customer.borrarFavorito(' + id_negocio + ')">star</i><br>Favorito');
                    // location.reload();
                } else if (r.status == 404) {
                    swal({
                        title: "",
                        text: "Algo salió mal, por favor vuelve a intentarlo.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            });
    },
    borrarFavorito: function (id_negocio) {
        var el;
        var info = DAO.toObject($("#frmCustomerBill").serializeArray());
        var id_usuario = getUid();
        info.id_usuario = id_usuario;
        info.id_negocio = id_negocio;
        DAO.execute("_ctrl/ctrl.usuario.php",
            {
                exec: "borrarFavorito",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    // alert("Negocio borrado de favoritos");
                    // location.reload();
                    $('#favorito').html('<i class="material-icons" onClick="Customer.agregarFavorito(' + id_negocio + ')">star_outline</i><br>Favorito');
                } else if (r.status == 404) {
                    swal({
                        title: "",
                        text: "Algo salió mal, por favor vuelve a intentarlo.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            });


    },
    getUsuario: function (e) {
        var id = getUid();
        DAO.execute("_ctrl/ctrl.service.php",
            {
                exec: "getUsuario",
                data: id
            },
            function (r) {
                if (r.status == 202) {
                    var buffer = '';
                    var direcciones = r.data.direcciones;
                    var ciudades = r.data.ciudades;
                    var usuario = r.data.usuario[0];
                    $('#nombre').val(usuario.nombre);
                    $('#correo').val(usuario.correo);
                    $('#movil').val(usuario.movil);
                    $('#contrasena').val(usuario.contrasena);
                    $('#confirmar_contrasena').val(usuario.contrasena);
                    $('.lbl-active').addClass('active');




                    ciudades.forEach(function (element) {
                        if (usuario.id_ciudad == element.id) {
                            buffer += '<option value="' + element.id + '" selected>' + element.ciudad + '</option>'
                        } else {
                            buffer += '<option value="' + element.id + '">' + element.ciudad + '</option>'
                        }
                    });
                    $('#id_ciudad').empty().html(buffer);
                    $('#id_ciudad').material_select();


                    buffer = '';
                    if (direcciones) {
                        direcciones.forEach(function (element) {
                            buffer += '<div class="row valign-wrapper">\
                        <div class="col s8">\
                        <p>\
                        '+ JSON.parse(element.direccion).calle + '\
                        '+ JSON.parse(element.direccion).colonia + '\
                        <br> '+ JSON.parse(element.direccion).ciudad + ', ' + JSON.parse(element.direccion).cp + '\
                        <br>'+ JSON.parse(element.direccion).estado + ', ' + JSON.parse(element.direccion).municipio + '\
                        </p>\
                        </div>\
                        <div class="col s4 valign">\
                        <p>\
                        <a href="editar_direccion.html?id='+ element.id + '"><i class="material-icons">edit</i></a>\
                        <br>\
                        </p>\
                        </div>\
                        </div><hr>';
                        });
                        $('.lista-direcciones').append().html(buffer);
                    } else {
                        $('.lista-direcciones').html("No tienes ninguna dirección.");
                    }
                } else if (r.status == 404) {
                    swal({
                        title: "",
                        text: "Algo salió mal, por favor vuelve a intentarlo.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            });


    },
    getServicios: function () {
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getServicios"
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data;
                    var buffer = '';
                    var cantidad = '';
                    console.log(data);
                    data.forEach(function (element) {
                        if (element[0]) {
                            cantidad = '(' + element[0].length + ')'
                        } else { cantidad = '(0)' }
                        buffer += '<div class="col s6"><a href="contacto.html?id=' + element.id + '">\
                        <div class="card">\
                        <div class="card-image">\
                        <img src="admin/assets/images/servicios/' + element.imagen + '" alt="">\
                        </div>\
                        <div class="card-action servicio">\
                        <b class="txt-blanco">' + element.servicio + ' ' + cantidad + '</b>\
                        </div>\
                        </div>\
                        </a>\
                        </div>';
                        $('.lista-servicios').empty().html(buffer);
                    });
                    $(".servicio").each(function (index) {
                        var colorR = Math.floor((Math.random() * 256));
                        var colorG = Math.floor((Math.random() * 256));
                        var colorB = Math.floor((Math.random() * 256));
                        $(this).css("background-color", "rgb(" + colorR + "," + colorG + "," + colorB + ")");
                    });


                } else {
                    $('#data').empty().html('No hay ningún servicio');
                }
            }
        );
    },
    cotizacionNegocios: function (id_zona, id_cotizacion) {
        var info = new Object();
        info.id_servicio = getUrlVars()['id'];
        info.id_usuario = getUid();
        if (id_zona) {
            info.id_zona = id_zona;
        }
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getNegocios",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data;
                    var buffer = '';
                    var zona = '';
                    $('.search').val('');
                    $('#resultados-total').html(data.length);
                    if (id_cotizacion) {
                        data.forEach(function (element) {
                            element[0].forEach(function (item) {
                                zona += item.zona + ', ';
                            });
                            zona = zona.substring(0, zona.length - 2);
                            buffer += '<li class="collection-item">\
                            <input type="checkbox" value="'+ element.id + '" id="chk_' + element.id + '" name="id_negocio[]" />\
                            <label for="chk_'+ element.id + '" class="negocio"><b class="nombre txt-negro">' + element.nombre + '</b></label>\
                        <br>\
                        <a href="#modal2" class="secondary-content" onClick="Customer.negocioDetalles('+ element.id + ')"><i class="material-icons">visibility</i></a>\
                        <p class="marginb-0">Servicio:<span class="txt-verde"> '+ element.servicio + '</span></p>\
                        <p class="marginb-0">Zona: '+ zona + '</p>\
                        </div>\
                        </li>';
                            zona = '';
                        });
                        $('.list').empty().html(buffer);
                    }
                    else {
                        data.forEach(function (element) {
                            element[0].forEach(function (item) {
                                console.log(item.zona);
                                zona += item.zona + ', ';
                            });
                            zona = zona.substring(0, zona.length - 2);
                            buffer += '<li class="collection-item">\
                            <a href="negocio.html?id=' + element.id + '" class="">\
                        <div class="negocio txt-negro"><b>'+ element.nombre + '</b>\
                        <br>\
                        <i class="material-icons secondary-content">keyboard_arrow_right</i>\
                        <p class="marginb-0">Servicio:<span class="txt-verde"> '+ element.servicio + '</span></p>\
                        <p class="marginb-0">Zona: '+ zona + '</p>\
                        </div></a>\
                        </li>';
                            zona = '';
                        });
                        $('.list').empty().html(buffer);
                    }


                    $('#servicio').empty().html(data[0].servicio);
                    var options = {
                        valueNames: ['negocio', 'servicio']
                    };


                    $('.search').change(function () {
                        var items = $('.collection-item');
                        $('#resultados-total').html(items.length);
                    });

                    var hackerList = new List('data', options);
                } else {
                    $('.list').empty().html('<li class="collection-item">No hay ningun negocio en esta zona</li>');
                    $('#resultados-total').html(0);
                }
            }
        );
    },
    getFiltros: function (id) {
        var id_servicio = getUrlVars()['id'];
        var uid = getUid();
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "filtro",
                data: uid
            },
            function (r) {
                if (r.status = 202) {
                    var zonas = r.data.zonas;
                    var servicios = r.data.servicios;
                    var buffer = '<option value="0">Todas</option>';
                    if (id) {
                        if (zonas) {
                            zonas.forEach(function (element) {
                                buffer += '<option value="' + element.id + '">' + element.zona + '</option>';
                            });
                            $('#zona').html(buffer);
                            $(document).on('change', '#zona', function () { Customer.cotizacionNegocios($('#zona').val(), id); })
                            buffer = '';
                            $('select').material_select();
                        } else {
                            $('.select').html('Aún no hay ninguna zona registrada en esta ciudad.');
                        }
                    } else {
                        if (zonas) {
                            zonas.forEach(function (element) {
                                buffer += '<option value="' + element.id + '">' + element.zona + '</option>';
                            });
                            $('#zona').html(buffer);
                            $(document).on('change', '#zona', function () { Customer.cotizacionNegocios($('#zona').val()); })
                            buffer = '';
                            $('select').material_select();


                        } else {
                            $('.select').html('<option>Aún no hay ninguna zona registrada en esta ciudad.</option>');
                        }
                    }
                } else {
                    swal({
                        title: "",
                        text: "Algo salió mal, por favor vuelve a intentarlo.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            }
        )
    },
    negocioDetalles: function (id_negocio) {
        var data = new Object();
        data.id_negocio = id_negocio;
        data.id_usuario = getUid();
        console.log(data);
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "negocioDetalles",
                data: data
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data;
                    var buffer = '';
                    var calificacion;
                    var rating = '';
                    console.log(r.data);
                    $('#nombre').empty().html(data.negocio[0].nombre);
                    if (data.testimonios) {
                        data.testimonios.forEach(function (element) {
                            calificacion = element.calificacion;
                            for (var i = 1; i <= 5; i++) {
                                if (calificacion >= i) {
                                    rating += '<i class="material-icons prefix txt-amarillo rating">start</i>';
                                } else {
                                    rating += '<i class="material-icons prefix txt-gris-claro rating">start</i>';
                                }
                            }
                            buffer += '<div class="col s12">\
                    <span class=""><b>'+ element.unombre + '</b></span><br>\
                    <span>'+ rating + '</span>\
                    <p>'+ element.testimonio + '</p>\
                    <hr>\
                    </div>';
                            rating = '';
                        });
                        $('#testimonios').empty().html(buffer);
                    } else {
                        $('#testimonios').empty().html('Este negocio aun no tiene ningún testimonio');
                    }


                    if (data.zonas) {
                        buffer = 'Zonas: ';
                        data.zonas.forEach(function (element) {
                            buffer += element.zona + ', ';
                        });
                        buffer = buffer.substring(0, buffer.length - 2);
                        $('#zonas').empty().html(buffer);
                    } else {
                        $('#zonas').empty().html('Este negocio aún no tiene ninguna zona');
                    }


                    if (data.servicios) {
                        buffer = 'Servicios: ';
                        data.servicios.forEach(function (element) {
                            buffer += element.servicio + ', ';
                        });
                        buffer = buffer.substring(0, buffer.length - 2);
                        $('#servicios').empty().html(buffer);
                    } else {
                        $('#servicios').empty().html('Este negocio aun no tiene ningun servicio');
                    }


                    if (data.favorito) {
                        $('#favorito').html('<i class="material-icons" onClick="Customer.borrarFavorito(' + id_negocio + ')">star</i><br>Favorito');
                    } else {
                        $('#favorito').html('<i class="material-icons" onClick="Customer.agregarFavorito(' + id_negocio + ')">star_outline</i><br>Favorito');
                    }
                    $('.evaluar').html('<a href="#modal1" onClick="Customer.preEvaluar(' + id_negocio + ')"><i class="material-icons">check</i><br>Evaluar</a>');
                    $('.llamar').html('<a href="tel:+' + data.negocio[0].movil + '" onClick="Customer.llamada(' + id_negocio + ')"><i class="material-icons">call</i><br>Llamar</a>');
                } else {
                    $('body').empty().html('<h2>Ups! No existe ningún negocio con este id</h2>');
                }
            }
        );
    },
    llamada: function (e) {
        var id_negocio = e;
        var id_usuario = getUid();
        var info = new Object();
        info.id_usuario = id_usuario;
        info.id_negocio = id_negocio;


        // if (confirm('Desea llamar al proveedor?')) {
        // alert('Llamando...');
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "llamada",
                data: info
            }
        );
        // } else {
        // alert('No se ha llamado');
        // }
    },
    getDireccion: function (id_direccion) {
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getDireccion",
                data: id_direccion
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data[0];
                    console.log(data);
                    var direccion = JSON.parse(data.direccion);
                    $('#calle').val(direccion.calle);
                    $('#estado').val(direccion.estado);
                    $('#cp').val(direccion.cp);
                    $('#colonia').val(direccion.colonia);
                    $('#municipio').val(direccion.municipio);
                    $('#id_direccion').val(data.id);
                    $('.lbl-active').addClass('active');
                    Customer.getCiudades(direccion.ciudad);
                } else {
                    $('#testimonios').empty().html('La dirección no existe');
                }
            }
        );
    },
    getFavoritos: function () {
        var id = getUid();
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getFavoritos",
                data: id
            },
            function (r) {
                if (r.status == 202) {
                    var negocios = r.data.negocios;
                    var zonas = r.data.zonas;
                    var servicios = r.data.servicios;
                    var buffer = '';
                    var strzonas = '';
                    var strservicios = '';
                    console.log(r.data);
                    if (negocios) {
                        for (var i = 0; i < negocios.length; i++) {
                            if (zonas[i]) {
                                zonas[i].forEach(function (element) {
                                    strzonas += element.zona + ', ';
                                });
                            }
                            strzonas = strzonas.substring(0, strzonas.length - 2);
                            if (servicios[i]) {
                                servicios[i].forEach(function (element) {
                                    strservicios += element.servicio + ', ';
                                });
                            }
                            strservicios = strservicios.substring(0, strservicios.length - 2);
                            buffer += '<li class="collection-item llamada"><a class="modal-trigger" href="#modal2" onClick="Customer.negocioDetalles(' + negocios[i].id + ')">\
                            <b><span class="title requerimiento negocio">'+ negocios[i].nombre + '</span></b>\
                            <i class="material-icons txt-gris-claro secondary-content">keyboard_arrow_right</i>\
                            <span class="title requerimiento truncate">Servicios: <span class="txt-verde">'+ strservicios + '</span></span>\
                            <span class="title requerimiento zona truncate">Zonas: '+ strzonas + '</span>\
                            </a></li>';
                            strzonas = '';
                            strservicios = '';
                        }
                        $('.list').html(buffer);


                        var options = {
                            valueNames: ['negocio', 'zona', 'servicios']
                        };


                        var hackerList = new List('data', options);


                    } else {
                        $('.collection').empty().html('Aún no tienes ningún negocio como favorito');
                    }
                } else {
                    $('.collection').empty().html('Aún no tienes ningún negocio como favorito');
                }
            }
        );
    },
    getCotizaciones: function () {
        var id = getUid();
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getCotizaciones",
                data: id
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data;
                    console.log(data);
                    var buffer = '';
                    data.forEach(function (element) {
                        buffer += '<div class="row">\
                        <a href="cotizacion_detalle.html?cotizacion='+ element.id + '">\
                        <div class="col s12">\
                        <b>'+ element.descripcion + '</b><br>\
                        <b>'+ element.fecha_atn + '</b>\
                        <br>\
                        </div>\
                        <div class="col s12" style="border-bottom: solid 1px;">\
                        </a>\
                        </div>\
                        </div>';
                    });
                    $('.container').html(buffer);
                } else {
                    $('.container').empty().html('Aún no tienes ninguna cotización');
                }
            }
        );
    },
    getHistorial: function () {
        var id = getUid();
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getHistorial",
                data: id
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data;
                    console.log(data);
                    var buffer = '';
                    var cotizaciones = data.cotizaciones.cotizaciones;
                    var mensajes = data.cotizaciones.mensajes;
                    var llamadas = data.llamadas;
                    var notificacion = '';
                    var datos = 0;
                    var fecha;
                    var dia;


                    var historial;


                    for (var i = 0; i < mensajes.length; i++) {
                        if (mensajes[i]) {
                            cotizaciones[i].mensaje = mensajes[i].length;
                        } else {
                            cotizaciones[i].mensaje = 0;
                        }
                    }
                    if (llamadas && cotizaciones) { historial = cotizaciones.concat(llamadas); }
                    else if (cotizaciones) {
                        historial = cotizaciones; $('#llamada').html('Aún no tienes ninguna llamada'); $('#llamada').hide();
                    }
                    else if (llamadas) {
                        historial = llamadas; $('#mensaje').html('Aún no tienes ningún mensaje'); $('#mensaje').hide();
                    }
                    else {
                        $('#todos').html('Aún no tienes ningun registro');
                        datos = 1;
                    }
                    if (datos == 0) {
                        historial.sort(function (a, b) {
                            return new Date(b.modified_at) - new Date(a.modified_at);
                        });

                        historial.forEach(function (element) {
                            element.modified_at = element.modified_at.replace(/-/g, '/');
                            fecha = new Date(element.modified_at);
                            var hoy = new Date();
                            var dif = (hoy.getDate() - fecha.getDate());
                            var mes = (hoy.getMonth() - fecha.getMonth());
                            if (dif == 0 && mes == 0) { dia = 'Hoy'; }
                            else if (dif == 1 && mes == 0) { dia = 'Ayer'; }
                            else if (dif == 2 && mes == 0) { dia = 'Antier'; }
                            else { dia = fecha.getDate() + '/' + (meses[fecha.getMonth()]) + '/' + fecha.getFullYear(); }
                            // dia = fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear();
                            if (element.mensaje >= 0) {
                                if (element.mensaje > 0) {
                                    notificacion += '<span class="new badge color-rojo">' + element.mensaje + '</span>';
                                }
                                buffer += '\
                            <li class="collection-item avatar cotizacion">\
                            <a href="cotizacion_detalle.html?cotizacion=' + element.id + '">\
                            <img src="admin/assets/images/cotizacion.png" alt="" class="circle icon-msj">\
                            ' + notificacion + '\
                            <b><span class="title requerimiento negocio truncate">'+ element.descripcion + ' </span></b>\
                            <p>Servicio: <span class="txt-verde servicio"> '+ element.servicio + '</span><br>Fecha:  ' + dia + '<br></p>\
                            <a href="cotizacion_detalle.html?cotizacion=' + element.id + '" class="secondary-content"><i class="material-icons txt-gris-claro">keyboard_arrow_right</i></a>\
                            </a>\
                            </li>';
                            } else {
                                buffer += '<li class="collection-item avatar llamada">\
                            <img src="admin/assets/images/llamadas.png" alt="" class="circle">\
                            <b><span class="title requerimiento negocio">'+ element.nombre + '</span></b>\
                            <p>Fecha: ' + dia + '\
                            </p></li>';
                            }
                            notificacion = '';
                        });
                        $('.list').html(buffer);

                        var options = {
                            valueNames: ['negocio', 'requerimiento', 'servicio']
                        };

                        var hackerList = new List('data', options);
                    }
                } else {
                    $('#todos').empty().html('Aún no tienes ningun registro de llamada o mensaje');
                    $('#mensaje').html('Aún no tienes ningun mensaje');
                    $('#llamada').html('Aún no tienes ninguna llamada');
                }
            }
        );
    },
    switch: function (e) {
        if (e == 1) {
            $('.llamada').addClass('todos');
            $('.llamada').removeClass('todos');
            $('.cotizacion').fadeOut(1);
            $('.llamada').fadeIn(1);
            $('#llamada').show();
            $('#mensaje').hide();
            // $('.search').val('');
            // $('.search').click();
        } else if (e == 2) {
            $('.mensaje').addClass('todos');
            $('.mensaje').removeClass('todos');
            $('.llamada').fadeOut(1);
            $('.cotizacion').fadeIn(1);
            $('#mensaje').show()
            $('#llamada').hide()
            // $('.search').val('');
            // $('.search').click();
        } else {
            $('.cotizacion').show().fadeIn(1);
            $('.llamada').fadeIn(1);
            if ($('#llamada').html() == 'Aún no tienes ninguna llamada') { $('#llamada').hide() }
            if ($('#mensaje').html() == 'Aún no tienes ningún mensaje') { $('#mensaje').hide() }
            // $('.search').val('');
            // $('.search').click();
        }
    },
    getCotizacionDetalle: function () {
        var id = getUrlVars()['cotizacion'];
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getCotizacionDetalle",
                data: id
            },
            function (r) {
                if (r.status == 202) {


                    var cotizaciones = r.data[0];
                    var notificacion = '';
                    var nuevos = r.data[1];
                    var buffer = '';
                    console.log(r.data);
                    var mensajes = r.data.mensajes;
                    var negocios = r.data.negocios;
                    for (var i = 0; i < mensajes.length; i++) {
                        if (mensajes[i]) {
                            negocios[i].mensaje = mensajes[i].length;
                        } else {
                            negocios[i].mensaje = 0;
                        }
                    }
                    negocios.forEach(function (element) {
                        element.modified_at = element.modified_at.replace(/-/g, '/');
                        fecha = new Date(element.modified_at);
                        var hoy = new Date();
                        var dif = (hoy.getDate() - fecha.getDate());
                        var mes = (hoy.getMonth() - fecha.getMonth());
                        if (dif == 0 && mes == 0) { dia = 'Hoy'; }
                        else if (dif == 1 && mes == 0) { dia = 'Ayer'; }
                        else if (dif == 2 && mes == 0) { dia = 'Antier'; }
                        else { dia = fecha.getDate() + '/' + (meses[fecha.getMonth()]) + '/' + fecha.getFullYear(); }
                        if (element.mensaje >= 0) {
                            if (element.mensaje > 0) {
                                notificacion += '<span class="new badge color-rojo">' + element.mensaje + '</span>';
                            }
                            buffer += '<li class="collection-item avatar cotizacion"><a href="chatmio.html?negocio=' + element.id_negocio + '&requerimiento=' + element.id_requerimiento + '&s=' + element.servicio + '">\
                            <img src="admin/assets/images/cotizacion.png" alt="" class="circle icon-msj">\
                            ' + notificacion + '\
                            <span class="title requerimiento negocio"><b>'+ element.negocio + ' </b></span>\
                            <p>Servicio: <span class="txt-verde">'+ element.servicio + '</span><br> ' + dia + '<br>\
                            </p>\
                            <span class="secondary-content"><i class="material-icons txt-gris-claro">keyboard_arrow_right</i></span>\
                            </a>\
                            </li>';
                        } else {
                            buffer += '<li class="collection-item avatar llamada">\
                            <img src="http://www.freeiconspng.com/uploads/phone-call-icon-16.png" alt="" class="circle">\
                            <span class="title requerimiento negocio">'+ element.nombre + '</span>\
                            <p>' + dia + '\
                            </p></li>';
                        }
                        notificacion = '';
                    });
                    $('.collection').html(buffer);
                    $('#titulo').html(negocios[0].descripcion);
                } else {
                    $('.collection').empty().html('No tienes ningun negocio en esta cotización');
                }
            }
        );
    },
    preEvaluar: function (id_negocio) {
        $('#id_negocio').val(id_negocio);
        $('#id_usuario').val(getUid());
        $('#id_requerimiento').val(getUrlVars()['cotizacion']);
    },
    evaluar: function () {
        var info = DAO.toObject($("#frmEvaluar").serializeArray());
        var flag = 0;
        if (!info.testimonio || info.testimonio.length < 3) {
            flag = 1;
        }
        if (info.calificacion == 0) {
            flag = 1;
        }
        if (flag == 0) {
            Service.execute("_ctrl/ctrl.service.php",
                {
                    exec: "evaluar",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        swal({
                            title: "",
                            text: "Gracias por su evaluación.",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    } else {
                        swal({
                            title: "",
                            text: "Algo salió mal, por favor vuelve a intentarlo.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                }
            );
        } else {
            swal({
                title: "Error!",
                text: "Por favor llene todos los campos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }
    },
    // Este metodo se usa en registro, crear direccion y editar direccion
    // Solo editar direccion envia un id el cual es de la ciudad
    // y es para preseleccionar la ciduad de la direccion
    getCiudades: function (ciudad) {
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getCiudades"
            },
            function (r) {
                if (r.status == 202) {
                    var direcciones = r.data;
                    var buffer = '';
                    if (ciudad > 1) {
                        direcciones.forEach(function (element) {
                            if (ciudad == element.ciudad) {
                                buffer += '<option value="' + element.ciudad + '" selected>' + element.ciudad + '</option>';
                            } else {
                                buffer += '<option value="' + element.ciudad + '">' + element.ciudad + '</option>';
                            }
                        });
                        $('#id_ciudad').append(buffer);
                        $('#id_ciudad').material_select();
                        $('.lbl-id_ciudad').addClass('active');
                    } else {
                        if (ciudad == 0) {
                            direcciones.forEach(function (element) {
                                buffer += '<option value="' + element.id + '">' + element.ciudad + '</option>';
                            });
                            $('#id_ciudad').append(buffer);
                            $('select').material_select();
                            $('.lbl-id_ciudad').addClass('active');
                        } else {


                            direcciones.forEach(function (element) {
                                buffer += '<option value="' + element.ciudad + '">' + element.ciudad + '</option>';
                            });
                            $('#id_ciudad').append(buffer);
                            $('select').material_select();
                            $('.lbl-id_ciudad').addClass('active');
                        }
                    }


                } else {
                    swal({
                        title: "Error!",
                        text: "Aún no hay ningúna ciudad registrada.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            }
        );
    },
    getVotaCiudades: function (e) {
        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "getVotoCiudades"
            },
            function (r) {
                if (r.status == 202) {
                    console.log(r.data);
                    var direcciones = r.data;
                    var buffer = '';
                    direcciones.forEach(function (element) {
                        buffer += '<option value="' + element.id + '">' + element.ciudad + '</option>';
                    });
                    $('#voto_ciudad').append(buffer);
                    $('select').material_select();
                    $('.lbl-vota_ciudad').addClass('active');


                } else {
                    $('.lbl-voto_ciudad').addClass('active');
                    swal({
                        title: "Error!",
                        text: "Aún no hay ningúna ciudad para votar.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            }
        );
    },
    votoCiudad: function (e) {
        var info = DAO.toObject($("#frmVotoCiudad").serializeArray());
        var flag = 0;
        if (!info.correo || info.correo.length < 4 || !isValidEmail(info.correo)) {
            console.log("correo malo" + info.correo);
            $('#correo').addClass('invalid');
            flag = 1
        }
        if (!info.voto_ciudad) {
            $('.select-dropdown').addClass('invalid');
            flag = 1
        }
        if (flag == 0) {
            Service.execute("_ctrl/ctrl.service.php",
                {
                    exec: "votoCiudad",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        swal({
                            title: "",
                            text: "Gracias por su voto, lo tomaremos en cuenta.",
                            type: "success",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                        location.href = "registro.html";
                    } else {
                        swal({
                            title: "Error!",
                            text: "No puedes votar más de dos veces por la misma ciudad.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                }
            );
        } else {
            swal({
                title: "Error!",
                text: "Por favor ingresa todos los campos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }
    }
};


$(window).load(function () {
    Customer.init();
    DAO.init();
});


DAO = {
    init: function () {
        var _self = this;
    },
    toObject: function (form) {
        var data = {};
        $.each(form, function (key, element) {
            if (element.name.indexOf("[]") >= 0) {
                var aux = data[element.name];
                if (aux == null) { aux = ""; }
                data[element.name] = aux + element.value + "|";
            } else {
                data[element.name] = element.value;
            }
        });
        return data;
    },
    execute: function (ctrl, data, callback) {
        $.ajax({
            type: "POST",
            url: ctrl,
            data: data,
            dataType: "json",
            success: function (r) { callback(r); },
            error: function (r) { console.log(r); }
        });
    }
}


Service = {
    init: function () {
        var _self = this;
    },
    toObject: function (form) {
        var data = {};
        $.each(form, function (key, element) { data[element.name] = element.value; });
        return data;
    },
    execute: function (ctrl, data, callback) {
        $.ajax({
            type: "POST",
            url: ctrl,
            data: data,
            dataType: "json",
            success: function (r) { callback(r); },
            error: function (r) { console.log(r); }
        });
    },
}


$(document).ready(function () {
    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    }
    );
});


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}


function getUid() {
    return localStorage.getItem('uid');
}


function checkSession(index) {
    if (localStorage.getItem('uid')) { return true; } else { if (!index) { location.href = 'index.html'; } }
    return false;
}


// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.


function initMap() {
    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: { lat: -34.397, lng: 150.644 },
    //     zoom: 6
    // });
    // var infoWindow = new google.maps.InfoWindow({ map: map });
    var pos = {};
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // console.log(pos);


            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // map.setCenter(pos);
            console.log(pos);
            return pos;
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}



