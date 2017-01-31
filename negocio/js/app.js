/* USER */
var Negocio;

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
                    // console.log(data);
                    var buffer = '';
                    var buffer_msj = '';
                    var buffer_msj_nuevo = '';
                    var buffer_llamada = '';
                    var cotizaciones = data.cotizaciones.cotizaciones;
                    var llamadas = data.llamadas;
                    var mensajes = data.cotizaciones.msj;
                    var notificacion = '';
                    var historial;

                    for (var i = 0; i < mensajes.length; i++) {
                        if (mensajes[i]) {
                            cotizaciones[i].mensaje = mensajes[i].length;
                        } else {
                            cotizaciones[i].mensaje = 0;
                        }
                    }

                    historial = cotizaciones.concat(llamadas);
                    historial.sort(function (a, b) {
                        return new Date(b.modified_at) - new Date(a.modified_at);
                    });
                    console.log(historial);

                    historial.forEach(function (element) {
                        if (element.mensaje >= 0) {
                            if (element.mensaje > 0) { notificacion += `Nuevos mensajes: (` + element.mensaje + `)`; }
                            buffer += `<li><div class="row cotizacion">
                        <a href="negocio_chat.html?usuario=`+ element.id_usuario + `&requerimiento=` + element.id_requerimiento + `">
                        <div class="col s12">
                        <b class="descripcion">`+ element.descripcion + `</b><br>
                        <b class="fecha">`+ element.fecha_atn + `</b>
                        `+ notificacion + `
                        <br>
                        </div>
                        <div class="col s12" style="border-bottom: solid 1px;">
                        </a>
                        </div>
                        </div></li>`;
                        } else {
                            buffer += `<div class="row llamada">
                        <div class="col s12">
                        <b class="nombre">`+ element.nombre + `</b><br>
                        <b>`+ element.modified_at + `</b>
                        <br>
                        </div>
                        <div class="col s12" style="border-bottom: solid 1px;">
                        </div>
                        </div>`;
                        }
                        notificacion = '';
                    });

                    // if (cotizaciones) {
                    //     for (var i = 0; i < cotizaciones.length; i++) {
                    //         if (mensajes[i]) {
                    //             buffer_msj_nuevo += `<li><div class="row">
                    //     <a href="negocio_chat.html?usuario=`+ cotizaciones[i].id_usuario + `&requerimiento=` + cotizaciones[i].id_requerimiento + `">
                    //     <div class="col s12">
                    //     <b class="descripcion">`+ cotizaciones[i].descripcion + `</b><br>
                    //     <b class="fecha">`+ cotizaciones[i].fecha_atn + `</b>
                    //     <b class="nuevo"> Mensajes nuevos: (`+ mensajes[i].length + `)</b>
                    //     <br>
                    //     </div>
                    //     <div class="col s12" style="border-bottom: solid 1px;">
                    //     </a>
                    //     </div>
                    //     </div></li>`;
                    //         } else {

                    //             buffer_msj += `<li><div class="row">
                    //     <a href="negocio_chat.html?usuario=`+ cotizaciones[i].id_usuario + `&requerimiento=` + cotizaciones[i].id_requerimiento + `">
                    //     <div class="col s12">
                    //     <b class="descripcion">`+ cotizaciones[i].descripcion + `</b><br>
                    //     <b class="fecha">`+ cotizaciones[i].fecha_atn + `</b>
                    //     <br>
                    //     </div>
                    //     <div class="col s12" style="border-bottom: solid 1px;">
                    //     </a>
                    //     </div>
                    //     </div></li>`;
                    //         }
                    //     };
                    //     $('#mensaje .list').html(buffer_msj_nuevo);
                    //     $('#mensaje .list').append(buffer_msj);
                    // } else {
                    //     $('#mensaje').html('Aún no tienes ningun mensaje');
                    // }
                    // if (data.llamadas) {
                    //     data.llamadas.forEach(function (element) {
                    //         buffer_llamada += `<div class="row">
                    //     <div class="col s12">
                    //     <b>`+ element.nombre + `</b><br>
                    //     <b>`+ element.fecha + `</b>
                    //     <br>
                    //     </div>
                    //     <div class="col s12" style="border-bottom: solid 1px;">
                    //     </div>
                    //     </div>`;
                    //     });
                    //     $('#llamada .list').html(buffer_llamada);
                    // } else {
                    //     $('#llamada').html('Aún no tienes ninuna llamada');
                    // }
                    $('.list').html(buffer);

                    var options = {
                        valueNames: ['descripcion', 'fecha', 'nuevo', 'nombre']
                    };

                    var hackerList = new List('data', options);
                } else {
                    $('#todos').empty().html('Aún no tienes ningun registro de llamada o mensaje');
                    $('#mensaje').html('Aún no tienes ningun mensaje');
                    $('#llamada').html('Aún no tienes ninguna llamada');
                }
            }
        )
    },
    switch: function (e) {
        if (e == 1) {
            $('.llamada').addClass('todos');
            $('.llamada').removeClass('todos');
            $('.cotizacion').hide();
            $('.llamada').show();
            // $('.search').val('');
            // $('.search').click();
        } else if (e == 2) {
            $('.mensaje').addClass('todos');
            $('.mensaje').removeClass('todos');
            $('.llamada').hide();
            $('.cotizacion').show();
            // $('.search').val('');
            // $('.search').click();
        } else {
            $('.cotizacion').show();
            $('.llamada').show();
            // $('.search').val('');
            // $('.search').click();
        }
    },
    getChat: function () {
        var flag = 0;
        var info = new Object();
        info.id_negocio = getNid();
        info.id_usuario = getUrlVars()["usuario"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        console.log(info);
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
                        data.forEach(function (element) {
                            if (element.tipo_usuario == 1) {
                                buffer += `<div class="col s10 offset-s2">
                                <div class="card">
                                    <div class="card-content grey lightrn-1">
                                        <p>`+ element.mensaje + `</p>
                                    </div>
                                    <div class=" right-align">
                                        <b>Usuario</b>
                                    </div>
                                </div>
                            </div>`;
                                // buffer += `<div class="col-md-4 col-md-offset-4"><span>` + element.mensaje + `</span></div>`;
                            } else {
                                buffer += `<div class="col s10">
                                <div class="card">
                                    <div class="card-content grey lightrn-1">
                                        <p>`+ element.mensaje + `</p>
                                    </div>
                                    <div class="">
                                        <b>Proveedor</b>
                                    </div>
                                </div>
                            </div>`;
                                // buffer += `<div class="col-md-4"><span class="red">Negocio: ` + element.mensaje + `</span></div>`;
                            }
                        });
                        $('.chat').empty().html(buffer);
                    }
                    // alert("Datos guardados correctamente");
                    // location.href = r.redirect;
                } else if (r.status == 0) {
                    $('.chat').text('No tiene ningún mensaje, envia uno');
                }
            });

    },
    enviarChat: function () {
        var flag = 0;
        var info = new Object();
        info.id_negocio = getNid();
        info.id_usuario = getUrlVars()["usuario"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        info.mensaje = $('#message').val();
        info.tipo_usuario = 1;

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

                    if (r.status == 202) {
                        var buffer = `<div class="col s10 offset-s2">
                                <div class="card">
                                    <div class="card-content grey lightrn-1">
                                        <p>`+ info.mensaje + `</p>
                                    </div>
                                    <div class=" right-align">
                                        <b>Usuario</b>
                                    </div>
                                </div>
                            </div>`;
                        $('#message').val('');
                        if ($('.chat').text()) {
                            $('.chat').append(buffer);
                        } else {
                            $('.chat').empty().append(buffer);
                        }
                    } else if (r.status == 404) {
                        alert("Algo salio mal, vuelve a intentarlo");
                    }
                });
        } else {
            alert('No puedes enviar un mensaje vacio');
        }
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
                        buffer_zonas += `<option value="` + element.id + `">` + element.zona + ` </option>`;
                    });

                    r.data.servicios.forEach(function (element) {
                        buffer_servicios += `<option value="` + element.id + `">` + element.servicio + ` </option>`;
                    });

                    $('#zonas').html(buffer_zonas);
                    $('#servicios').html(buffer_servicios);
                    $('select').material_select();

                } else {
                    alert("Algo salio mal");
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

function checkSession(index) {
    if (localStorage.getItem('nid')) { return true; } else { if (!index) { location.href = 'index.html'; } }
    return false;
}

