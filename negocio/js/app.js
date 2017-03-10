/* USER */
var Negocio;
var fecha_anterior;
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

Negocio = {
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
        $(document).on("click", "a.onClickEnviar", function (e) { _self.enviarChat(e); });
        $(document).on("click", "a.onUpdateProfile", function (e) { _self.updateProfile(e); });


    },
    updateProfile: function () {
        var flag = 0;
        var info = DAO.toObject($("#frmPerfil").serializeArray());
        info.id = getNid();
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
        if (!info.telefono || info.telefono.length < 10) {
            $('#telefono').addClass('invalid');
            flag = 1;
        }


        if (info.contrasena && info.contrasena.length < 6) {
            $('#contrasena').addClass('invalid');
            flag = 1;
        }


        if (info.confirmar_contrasena && info.confirmar_contrasena.length < 6 || info.confirmar_contrasena != info.contrasena) {
            $('#confirmar_contrasena').addClass('invalid');
        }
        if (info.contrasena != info.confirmar_contrasena) {
            $('#contrasena').addClass('invalid');
            $('#confirmar_contrasena').addClass('invalid');
            swal({
                title: "",
                text: "Las contraseñas no coinciden.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
            return;
        }
        if (flag == 0) {
            DAO.execute("../_ctrl/ctrl.negocio.php",
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
                        }, function (isConfirm) { if (isConfirm) { location.reload(); } });
                    } else if (r.status == 404) {
                        swal({
                            title: "",
                            text: "Algo salió mal, por favor vuelvea intentarlo.",
                            type: "error",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2C8BEB"
                        });
                    }
                });
        } else {
            swal({
                title: "",
                text: "Por favor ingrese datos válidos.",
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2C8BEB"
            });
        }


    },
    estadisticas: function (e) {
        var nid = getNid();
        var data;
        var chartinfo = [];
        Service.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "estadisticas",
                data: nid
            },
            function (r) {
                if (r.status == 202) {
                    // console.log(r.data.calificacion);
                    console.log(r.data);
                    var calificacion = Math.round(r.data.calificacion[0].calificacion, -1);
                    var rating = '';
                    for (var i = 1; i <= 5; i++) {
                        if (calificacion >= i) {
                            rating += '<i class="material-icons prefix txt-amarillo">start</i>';
                        } else {
                            rating += '<i class="material-icons prefix txt-gris-claro">start</i>';
                        }
                    }
                    data = r.data.estadisticas[0];
                    $('.rating').html(rating);
                    $('.visitas').html(data.ver_perfil);
                    $('.llamadas').html(data.btn_llamar);
                    $('.cotizaciones').html(data.cotizaciones);
                    chartinfo.push(+data.ver_perfil);
                    chartinfo.push(+data.btn_llamar);
                    chartinfo.push(+data.cotizaciones);
                } else {
                    swal({
                        title: "",
                        text: "Algo salió mal, por favor vuelve a intentarlo.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    });
                }
            });
        return (chartinfo);
    },
    testimonio: function () {
        var data = getNid();
        Service.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "testimonio",
                data: data
            }, function (r) {
                var data = r.data;
                var buffer = '';
                var rating = '';
                if (data) {
                    data.forEach(function (element) {
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
                    $('#testimonios').empty().html('Aún no tienes ningún testimonio.');
                }
            });
    },
    // Historial
    getHistorial: function (e) {
        var nid = getNid();
        Service.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "historial",
                data: nid
            },
            function (r) {
                if (r.status == 202) {
                    var data = r.data;
                    var buffer = '';
                    var buffer_msj = '';
                    var buffer_msj_nuevo = '';
                    var buffer_llamada = '';
                    var cotizaciones = data.cotizaciones.cotizaciones;
                    var llamadas = data.llamadas;
                    var mensajes = data.cotizaciones.msj;
                    var notificacion = '';
                    var historial;
                    var datos = 0;

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
                    } else if (llamadas) {
                        historial = llamadas; $('#mensaje').html('Aún no tienes ningún mensaje'); $('#mensaje').hide();
                    } else {
                        $('#todos').html('Aún no tienes ningun registro');
                        datos = 1;
                    }


                    if (datos == 0) {
                        historial.sort(function (a, b) {
                            return new Date(b.modified_at) - new Date(a.modified_at);
                        });
                        console.log(historial);
                        historial.forEach(function (element) {
                            fecha = new Date(element.modified_at);
                            var hoy = new Date();
                            var dif = (hoy.getDate() - fecha.getDate());
                            var mes = (hoy.getMonth() - fecha.getMonth());
                            if (dif == 0 && mes == 0) { dia = 'Hoy'; }
                            else if (dif == 1 && mes == 0) { dia = 'Ayer'; }
                            else if (dif == 2 && mes == 0) { dia = 'Antier'; }
                            else { dia = fecha.getDate() + '/' + (meses[fecha.getMonth()]) + '/' + fecha.getFullYear(); }
                            if (element.status == 0) { notificacion += '<span class="new badge color-rojo">Nueva</span>'; }
                            if (element.mensaje >= 0) {
                                if (element.mensaje > 0 && element.status != 0) { notificacion += '<span class="new badge color-rojo">' + element.mensaje + '</span>'; }
                                buffer += '\
                            <li class="collection-item avatar cotizacion">\
                        <a href="negocio_chat.html?usuario='+ element.id_usuario + '&requerimiento=' + element.id_requerimiento + '">\
                        <img src="../admin/assets/images/cotizacion.png" alt="" class="circle icon-msj">\
                            <div class="row cotizacion">\
                            ' + notificacion + '\
                            <span class="title requerimiento negocio truncate descripcion">'+ element.descripcion + ' </span>\
                            <p><span class="fecha">Fecha: '+ dia + '</span><br>Servicio:  ' + element.servicio + '<br></p>\
                        <a href="negocio_chat.html?usuario='+ element.id_usuario + '&requerimiento=' + element.id_requerimiento + '" class="secondary-content"><i class="material-icons txt-gris-claro">keyboard_arrow_right</i></a>\
                        </a>\
                        </li>';
                            } else {
                                buffer += '<li class="collection-item avatar llamada">\
                            <img src="../admin/assets/images/llamadas.png" alt="" class="circle">\
                            <span class="title requerimiento nombre">'+ element.nombre + '</span>\
                            <p>Fecha: ' + dia + '\
                            </p></li>';
                            }
                            notificacion = '';
                        });
                        $('.list').html(buffer);


                        var options = {
                            valueNames: ['descripcion', 'fecha', 'nuevo', 'nombre']
                        };


                        var hackerList = new List('data', options);
                    }
                } else {
                    $('#todos').empty().html('Aún no tienes ningun registro de llamada o mensaje');
                    $('#mensaje').html('Aún no tienes ningun mensaje');
                    $('#llamada').html('Aún no tienes ninguna llamada');
                }
            });
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
    getNegocio: function (e) {
        var id = getNid();
        DAO.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "getNegocio",
                data: id
            },
            function (r) {
                if (r.status == 202) {
                    var negocio = r.data[0];
                    var suscripcion = '';
                    if (negocio.fecha_fin) {
                        var fecha = new Date(negocio.fecha_fin);
                        suscripcion = "Servicio vigente hasta el: " + (fecha.getDate() + 1) + '/' + meses[fecha.getMonth()] + '/' + fecha.getFullYear();
                    } else {
                        suscripcion = "Usted aún no tiene ninguna suscripción, pongase en contacto con los administradores para obtener una."
                    }
                    $('.vigencia').html(suscripcion);
                    $('#nombre').val(negocio.nombre);
                    $('#correo').val(negocio.correo);
                    $('#telefono').val(negocio.telefono);
                    $('#movil').val(negocio.movil);
                    $('#contrasena').val(negocio.contrasena);
                    $('#confirmar_contrasena').val(negocio.contrasena);
                    $('label').addClass('active');
                    console.log(negocio);
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
    getChat: function () {
        var flag = 0;
        var info = new Object();
        info.id_negocio = getNid();
        info.id_usuario = getUrlVars()["usuario"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        var header = '<div class="row">\
        <a href= "cotizacion_detalle.html?c='+ info.id_requerimiento + '&u=' + info.id_usuario + '" >\
                    <div class="col s6 txt-blanco mensaje-div header-detalle">\
        <b>Ver cotización</b>\
            </div>\
            </a>\
            <a href= "negocio_usuario.html?usuario=' + info.id_usuario + '&negocio=' + info.id_negocio + '&requerimiento=' + info.id_requerimiento + '" >\
            <div class="col s6 mensaje-div header-cliente">\
                <span><b class="txt-blanco texto">Información del cliente</b></span>\
        <i class="material-icons txt-blanco icono">keyboard_arrow_right</i>\
            </div>\
                </a>\
            </div > ';
        $('.header').html(header);
        DAO.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "getChat",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    data = r.data;
                    var buffer = '';
                    if (data.length > 0) {
                        var hoy = new Date();
                        var dif = hoy.getDate();
                        var mes = hoy.getMonth();
                        var fecha;
                        var minuto;
                        data.forEach(function (element) {
                            dia = new Date(element.created_at);
                            dif -= dia.getDate();
                            mes -= dia.getMonth();
                            if (dif == 0 && mes == 0) { fecha = 'Hoy'; console.log("es hoy" + fecha); }
                            else if (dif == 1 && mes == 0) { fecha = 'Ayer'; console.log("es ayer" + fecha); }
                            else if (dif == 2 && mes == 0) { fecha = 'Antier'; console.log("es antier" + fecha); }
                            else { fecha = (dia.getDate()) + '/' + (meses[dia.getMonth()]) + '/' + dia.getFullYear(); }
                            if (dia.getMinutes() < 10) { minuto = '0' + dia.getMinutes(); } else { minuto = dia.getMinutes(); }
                            hora = dia.getHours() + ':' + minuto;
                            if (fecha_anterior == dia.getDate() + '/' + dia.getMonth()) { fecha = ''; }
                            buffer += '<div class="col s6 offset-s3 center-align">\
                                            <span class="center-align txt-gris-claro">'+ fecha + ' </span>\
                                        </div>';
                            if (element.tipo_usuario == 1) {
                                buffer += '<div class="col s10 offset-s2 color-negro div-msj">\
                                    <div class="caja-msj color-negro">\
                                        <b class="txt-blanco">'+ element.mensaje + '</b>\
                                    </div>\
                                    </div>\
                                    <div class="col s4 offset-s8 right-align txt-gris-claro">'+ hora + ' </div>\
                                    ';
                            } else {
                                if (element.mensaje.includes('<img')) {
                                    element.mensaje = element.mensaje.replace('tmp', '../tmp')
                                    buffer += element.mensaje + '<div class="col s10 txt-gris-claro hora">' + hora + ' </div>\
                                    ';
                                } else {
                                    buffer += '<div class="col s10 div-msj">\
                                    <div class="caja-msj color-gris-claro">\
                                        <b>'+ element.mensaje + '</b>\
                                    </div>\
                                    <span class="txt-gris-claro center-align">'+ hora + ' </span>\
                            </div>';
                                }
                            }
                            dif = hoy.getDate();
                            mes = hoy.getMonth();
                            fecha_anterior = dia.getDate() + '/' + dia.getMonth();
                        });
                        $('.chat').empty().html(buffer);
                        $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000);
                        $('.materialboxed').materialbox();
                    }
                    // alert("Datos guardados correctamente");
                    // location.href = r.redirect;
                } else if (r.status == 0) {
                    $('.chat').text('No tiene ningún mensaje, envia uno');
                }
            });
    },
    cotizacionDetalle:
    function () {
        var id_cotizacion = getUrlVars()['c'];
        var id_usuario = getUrlVars()['u'];
        Service.execute('../_ctrl/ctrl.negocio.php',
            {
                exec: 'cotizacionDetalle',
                data: id_cotizacion
            },
            function (r) {
                if (r.status == 202) {
                    console.log(r.data);
                    var data = r.data[0];
                    if (data.imagen && data.imagen != '""') {
                        var imagenes = data.imagen;
                        imagenes = JSON.parse(imagenes);
                        var buffer = '';
                        imagenes.forEach(function (element) {
                            buffer += '<div class="box materialboxed" style="background:url(../admin/uploads/cotizacion/usuario_' + id_usuario + '/' + element + ') top center; background-size:cover;"></div>';
                            $('.grid').html(buffer);
                        });
                    } else {
                        $('.grid').html('<div class="col s12">No hay ninguna imagen para mostrar.</div>');
                    }

                    var fecha = new Date(data.fecha_atn);
                    var fecha_imprimir = fecha.getDate() + '/' + meses[fecha.getMonth()] + '/' + fecha.getFullYear();
                    $('.detalle').html(data.descripcion);
                    $('.fecha').append(fecha_imprimir);
                    $('.materialboxed').materialbox();
                    $('.material-placeholder').addClass('valign');
                } else {
                    console.log('Hubo un error, por favor intentalo de nuevo.')
                }

            })
    },
    enviarChat: function () {
        var flag = 0;
        var info = new Object();
        info.id_negocio = getNid();
        info.id_usuario = getUrlVars()["usuario"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        info.mensaje = $('#message').val();
        info.tipo_usuario = 1;
        info.servicio = getUrlVars()["s"];
        // console.log($('.chat').text());
        // Usuario = 0
        // Negocio = 1
        if (!info.mensaje) {
            flag = 1;
        }
        if (flag == 0) {
            DAO.execute("../_ctrl/ctrl.service.php",
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

                        buffer += '<div class="col s6 offset-s3 center-align">\
                            <span class="txt-gris-claro">'+ fecha_imprimir + '</span>\
                        </div>\
                        <div class="col s10 offset-s2 color-negro div-msj nuevo">\
                                    <div class="caja-msj color-negro">\
                                        <b class="txt-blanco">'+ info.mensaje + '</b>\
                                    </div>\
                                    </div>\
                                     <div class="col s4 offset-s8 right-align txt-gris-claro">'+ hora + ' </div>\
                                    ';
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
    getCliente: function (e) {
        var data = new Object();
        data.usuario = getUrlVars()['usuario'];
        data.requerimiento = getUrlVars()['requerimiento'];
        data.negocio = getNid();
        Service.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "getUsuario",
                data: data
            }, function (r) {
                if (r.status == 202) {
                    var direcciones;
                    var data = r.data;
                    var usuario = r.data.usuario[0];
                    var bufferdir = '';
                    var direccion;
                    $('#nombre').val(usuario.nombre);
                    $('#ciudad').val(usuario.ciudad);
                    if (usuario.correo) { $('#correo').val(usuario.correo); }
                    if (usuario.movil) { $('#movil').val(usuario.movil); $('.atelefono').attr('href', 'tel:+' + usuario.movil); }
                    if (data.ubicacion) {
                        $('.mapa').html('<iframe width="100%" height="200" \
                        src="https://www.google.com/maps/embed/v1/view?key=AIzaSyBzHWQL9mUfvfV-iQzrrrhc_e-bS4PoiqU&center=' + data.ubicacion.lat + ',' + data.ubicacion.lng + '\
                        &zoom=15" frameborder="0"></iframe>');
                    } else { $('.ubicacion-title').empty().html('No se compartió la ubicación.') }
                    if (data.direccion) {
                        direcciones = data.direccion;
                        direccion = JSON.parse(direcciones[0].direccion);
                        // $('.mapa').html('<iframe width="100%" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBzHWQL9mUfvfV-iQzrrrhc_e-bS4PoiqU&q=' + direccion.calle + ',' + direccion.ciudad + ', ' + direccion.estado + ',' + direccion.cp + '"></iframe>');
                        direcciones.forEach(function (element) {
                            direccion = JSON.parse(element.direccion);
                            $('.direcciones').append('<div class="direccion marginb-10">' + direccion.calle + '<br>' + direccion.ciudad + ', ' + direccion.estado + '<br>' + direccion.cp + '</div>')
                        });
                    } else { $('.direcciones-title').empty().html('No se compartió ninguna dirección.') }
                    console.log(r.data);
                } else {
                    console.log(r.data);
                    $('#nombre').val(r.data[0].nombre);
                    $('#ciudad').val(r.data[0].ciudad);
                    $('.ubicacion-title').empty().html('No se compartió la ubicación.');
                    $('.direcciones-title').empty().html('No se compartió ninguna dirección.');
                }
            });
    },
    getSelects: function () {
        Service.execute("../_ctrl/ctrl.negocio.php",
            {
                exec: "select"
            },
            function (r) {
                if (r.status == 202) {
                    var buffer_zonas = '';
                    var buffer_servicios = '';
                    r.data.zonas.forEach(function (element) {
                        buffer_zonas += '<option value="' + element.id + '">' + element.zona + ' </option>';
                    });


                    r.data.servicios.forEach(function (element) {
                        buffer_servicios += '<option value="' + element.id + '">' + element.servicio + ' </option>';
                    });


                    $('#zonas').html(buffer_zonas);
                    $('#servicios').html(buffer_servicios);
                    $('select').material_select();


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
    }
};


$(window).load(function () {
    Negocio.init();
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



function getNid() {
    return localStorage.getItem('nid');
}

function checkSuscripcion() {
    var nid = getNid();
    Service.execute("../_ctrl/ctrl.negocio.php",
        {
            exec: "suscripcion",
            data: nid
        }, function (r) {
            if (r.status == 202) {
                console.log(r.data);
                var fecha_fin = new Date(r.data[0].fecha_fin);
                var hoy = new Date();
                console.log(fecha_fin);
                console.log(hoy);
                fecha_fin.setDate(fecha_fin.getDate() + 1);
                if (hoy > fecha_fin) {
                    localStorage.removeItem('nid');
                    localStorage.removeItem('ff');
                    swal({
                        title: "",
                        text: "Tu suscripción se ha vencido.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#2C8BEB"
                    }, function (isConfirm) {
                        location.href = "index.html";
                    });
                }
            } else {
                localStorage.removeItem('nid');
                localStorage.removeItem('ff');
                swal({
                    title: "",
                    text: "Tu suscripción se ha vencido.",
                    type: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#2C8BEB"
                }, function (isConfirm) {
                    location.href = "index.html";
                });
            }
        });
    // var fecha_fin = localStorage.getItem('ff');
    // var hoy = new Date();
    // if (hoy > fecha_fin) {
    //     localStorage.removeItem('nid');
    //     localStorage.removeItem('ff');
    //     swal({
    //         title: "",
    //         text: "Tu suscripción se ha vencido.",
    //         type: "error",
    //         confirmButtonText: "Aceptar",
    //         confirmButtonColor: "#2C8BEB"
    //     }, function (isConfirm) {
    //         location.href = "index.html";
    //     });
    // }
}


function checkSession(index) {
    if (localStorage.getItem('nid')) { return true; } else { if (!index) { location.href = 'index.html'; } }
    return false;
}



