/* USER */
var Customer;

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

        if (info.contrasena && info.contrasena.length < 6) {
            $('#contrasena').addClass('invalid');
            flag = 1;
        }

        if (info.confirmar_contrasena && info.confirmar_contrasena.length < 6 || info.confirmar_contrasena != info.contrasena) {
            $('#confirmar_contrasena').addClass('invalid');
        }
        if (info.contrasena != info.confirmar_contrasena) {
            alert('Las contraseñas no coindicen');
        }
        if (flag == 0) {
            DAO.execute("_ctrl/ctrl.service.php",
                {
                    exec: "updateProfile",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        alert("Datos guardados correctamente");
                        location.reload();
                    } else if (r.status == 404) {
                        alert("Algo salio mal, vuelve a intentarlo");
                    }
                });
        } else {
            alert("Por favor ingresa datos correctos.")
        }

    },
    cotizacion: function () {
        var info = JSON.parse(localStorage.getItem('cotizacion'));
        DAO.execute("_ctrl/ctrl.service.php",
            {
                exec: "cotizar",
                data: info
            },
            function (r) {
                if (r.status == 202) {
                    info = '';
                    info = DAO.toObject($("#frmCotizacion").serializeArray());
                    info.id_cotizacion = r.id_cotizacion;
                    console.log(info);
                    DAO.execute("_ctrl/ctrl.service.php",
                        {
                            exec: "cotizacion",
                            data: info
                        },
                        function (r) {
                            if (r.status == 202) {
                                alert("Su cotizacion se ha enviado a los proveedores, ellos se pondrán en contacto con usted");
                                location.href = r.redirect;
                            } else if (r.status == 404) {
                                alert("Algo salio mal, vuelve a intentarlo");
                            }
                        });
                } else if (r.status == 404) {
                    alert("Algo salio mal, vuelve a intentarlo");
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

        if (!info.cotizacion || info.cotizacion < 3) {
            flag = 1;
            $('#cotizacion').addClass('invalid');
        }
        if (info.fecha || info.dia) {
            if ($('#hoy').val()) {
                info.fecha_submit = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
            } else if ($('#hoy').val()) {
                info.fecha_submit = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
            }
        } else {
            flag = 1;
        }
        console.log(info);
        if (flag == 0) {
            localStorage.setItem('cotizacion', JSON.stringify(info));
            alert('Ahora seleccione la lista de proveedores con los que desea cotizar');
            location.href = "cotizacion.html?id=" + id_servicio;
        } else {
            alert("Verifique bien su información");
        }
        // DAO.execute("_ctrl/ctrl.service.php",
        //     {
        //         exec: "cotizar",
        //         data: info
        //     },
        //     function (r) {
        //         if (r.status == 202) {
        //             alert("Su cotización se ha guardado, por favor seleccione a que proveedores desea enviarle la cotizacion");
        //             location.href = r.redirect;
        //         } else if (r.status == 404) {
        //             alert("Algo salio mal, vuelve a intentarlo");
        //         }
        //     });

    },
    getChat: function () {
        var flag = 0;
        var info = new Object();
        info.id_usuario = getUid();
        info.id_negocio = getUrlVars()["negocio"];
        info.id_requerimiento = getUrlVars()["requerimiento"];
        console.log(info);
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
                        data.forEach(function (element) {
                            if (element.tipo_usuario == 0) {
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

                    if (r.status == 202) {
                        // alert("Datos guardados correctamente");
                        // location.href = r.redirect;
                        // var buffer = `<div class="col-md-4 col-md-offset-4"><span>` + info.mensaje + `</span></div>`;
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

                        // $('.chat').append(buffer);
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

        if (flag == 0) {
            DAO.execute("_ctrl/ctrl.service.php",
                {
                    exec: "agregarDireccion",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        alert("Datos guardados correctamente");
                        location.href = r.redirect;
                    } else if (r.status == 404) {
                        alert("Algo salio mal, vuelve a intentarlo");
                    }
                });
        } else {
            alert('Por favor ingrese datos válidos');
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
                        alert("Datos guardados correctamente");
                        location.href = r.redirect;
                    } else if (r.status == 404) {
                        alert("Algo salio mal, vuelve a intentarlo");
                    }
                });
        } else {
            alert("Por favor ingrese información válida.")
        }

    },
    borrarDireccion: function (e) {
        var el;
        if (!confirm("Favor de confirmar la eliminación de la dirección.")) { return; }
        var id = $(e.target).data("id");
        DAO.execute("_ctrl/ctrl.service.php",
            {
                exec: "borrarDireccion",
                data: id
            },
            function (r) {
                if (r.status == 202) {
                    alert("Dirección borrada correctamente eliminados correctamente");
                    location.reload();
                } else if (r.status == 404) {
                    alert("Algo salio mal, vuelve a intentarlo");
                }
            });

    },
    agregarFavorito: function (id_negocio) {
        var el;
        var info = DAO.toObject($("#frmCustomerBill").serializeArray());
        if (!confirm("¿Desea agregar a favoritos este negocio?")) { return; }
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
                    alert("Negocio agregado a favoritos");
                    location.reload();
                } else if (r.status == 404) {
                    alert("Algo salio mal, vuelve a intentarlo");
                }
            });

    },
    borrarFavorito: function (id_negocio) {
        var el;
        var info = DAO.toObject($("#frmCustomerBill").serializeArray());
        if (!confirm("¿Desea eliminar de favoritos este negocio?")) { return; }
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
                    alert("Negocio agregado a favoritos");
                    location.reload();
                } else if (r.status == 404) {
                    alert("Algo salio mal, vuelve a intentarlo");
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
                    $('.lbl-active').addClass('active');

                    ciudades.forEach(function (element) {
                        if (usuario.id_ciudad == element.id) {
                            buffer += `<option value="` + element.id + `" selected>` + element.ciudad + `</option>`
                        } else {
                            buffer += `<option value="` + element.id + `">` + element.ciudad + `</option>`
                        }
                    });
                    $('#id_ciudad').empty().html(buffer);
                    $('#id_ciudad').material_select();

                    buffer = '';
                    if (direcciones) {
                        direcciones.forEach(function (element) {
                            buffer += `<div class="row">
                        <div class="col s8">
                        <p>
                        `+ JSON.parse(element.direccion).calle + `
                        `+ JSON.parse(element.direccion).colonia + `
                        <br> `+ JSON.parse(element.direccion).ciudad + `, ` + JSON.parse(element.direccion).cp + `
                        <br>`+ JSON.parse(element.direccion).estado + `, ` + JSON.parse(element.direccion).municipio + `
                        </p>
                        </div>
                        <div class="col s4">
                        <p>
                        <a href="editar_direccion.html?id=`+ element.id + `"> Editar</a>
                        <br>
                        <a class="onBorrarDireccion" data-id="`+ element.id + `">Eliminar</a>
                        </p>
                        </div>
                        </div>`;
                        });
                        $('#direcciones').empty().html(buffer);
                    } else {
                        $('#titulo-direccion').html("No tienes ninguna dirección. <br>Agrega una dando click aquí.");
                    }
                } else if (r.status == 404) {
                    alert("Algo salio mal, vuelve a intentarlo");
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
                    data.forEach(function (element) {
                        buffer += `<div class="col s6"><a href="contacto.html?id=` + element.id + `">
                        <div class="card">
                        <div class="card-image">
                        <img src="http://dc461.4shared.com/img/3SFWaUJuce/s24/14890de1aa0/PLOMERIA" alt="">
                        </div>
                        <div class="card-action">
                        <b>` + element.servicio + `</b>
                        </div>
                        </div>
                        </a>
                        </div>`;
                    });
                    $('#data').empty().html(buffer);

                } else {
                    $('#data').empty().html('No hay ningún servicio');
                }
            }
        );
    },
    cotizacionNegocios: function (id_zona, id_cotizacion = null) {
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
                    console.log(r.data);
                    var buffer = '';
                    // console.log(data);
                    // $('#nombre-servicio').html(data[0].servicio);
                    $('.search').val('');
                    $('#resultados-total').html(data.length);
                    if (id_cotizacion) {
                        data.forEach(function (element) {
                            buffer += `<li><div class="col s9">
                    <input type="checkbox" value="`+ element.id + `" id="chk_` + element.id + `" name="id_negocio[]" />
                    <label for="chk_`+ element.id + `" class="negocio">` + element.nombre + `</label>
                    </li></div> <div class="col s2"><a class="modal-trigger" href="#modal1" onClick="Customer.negocioDetalles(`+ element.id + `)">View</a></div></li>`;
                        });
                        $('.list').empty().html(buffer);
                    }
                    else {
                        data.forEach(function (element) {
                            buffer += `<li><a href="negocio.html?id=` + element.id + `">
                    <div class="col s12">
                    <b class="negocio">`+ element.nombre + `</b>
                    <br>
                    </div>
                    <div class="col s12 border-negocio" style="border-bottom: solid 1px;">
                    <p class="servicio">Servicio: `+ element.servicio + `</p>
                    </div>
                    </a>
                    </div></li>`;
                        });
                        $('.list').empty().html(buffer);
                    }

                    var options = {
                        valueNames: ['negocio', 'servicio']
                    };

                    var hackerList = new List('data', options);
                } else {
                    $('.list').empty().html("No hay ningun negocio en esta zona");
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
                        zonas.forEach(function (element) {
                            buffer += `<option value="` + element.id + `">` + element.zona + `</option>`;
                        });
                        $('#zona').html(buffer);
                        $(document).on('change', '#zona', function () { Customer.cotizacionNegocios($('#zona').val(), id); })
                        buffer = '';
                        servicios.forEach(function (element) {
                            if (id_servicio == element.id) {
                                buffer += `<option value="` + element.id + `" selected>` + element.servicio + `</option>`;
                            } else {
                                buffer += `<option value="` + element.id + `">` + element.servicio + `</option>`;
                            }
                        });
                        $('#servicio').html(buffer);
                        $(document).on('change', '#servicio', function () { location.href = "cotizacion.html?id=" + ($('#servicio').val()); })
                        $('select').material_select();
                    } else {
                        zonas.forEach(function (element) {
                            buffer += `<option value="` + element.id + `">` + element.zona + `</option>`;
                        });
                        $('#zona').html(buffer);
                        $(document).on('change', '#zona', function () { Customer.cotizacionNegocios($('#zona').val()); })
                        buffer = '';
                        servicios.forEach(function (element) {
                            if (id_servicio == element.id) {
                                buffer += `<option value="` + element.id + `" selected>` + element.servicio + `</option>`;
                            } else {
                                buffer += `<option value="` + element.id + `">` + element.servicio + `</option>`;
                            }
                        });
                        $('#servicio').html(buffer);
                        $(document).on('change', '#servicio', function () { location.href = "llamada.html?id=" + ($('#servicio').val()); })
                        $('select').material_select();
                    }
                } else {
                    alert('Algo salió mal');
                }
            }
        )
    },
    // getNegocioZona: function (id_zona, id) {
    //     var data = new Object();
    //     data.id_servicio = getUrlVars()['id'];
    //     data.id_zona = id_zona;
    //     console.log(data);
    //     Service.execute("_ctrl/ctrl.service.php",
    //         {
    //             exec: "getNegocioZona",
    //             data: data
    //         },
    //         function (r) {
    //             if (r.status = 202) {

    //                 var negocios = r.data;
    //                 var buffer = '';
    //                 console.log(negocios);
    //                 if (negocios) {
    //                     if (id) {
    //                         negocios.forEach(function (element) {
    //                             buffer += `<div class="col s9"><li>
    //                 <input type="checkbox" value="`+ element.id + `" id="chk_` + element.id + `" name="id_negocio[]" />
    //                 <label for="chk_`+ element.id + `">` + element.nombre + `</label>
    //                 </li></div> <div class="col s2"><a class="modal-trigger" href="#modal1" onClick="Customer.negocioDetalles(`+ element.id + `)">View</a></div>`;
    //                         });
    //                     } else {
    //                         negocios.forEach(function (element) {
    //                             buffer += `<a href="negocio.html?id=` + element.id + `">
    //                 <div class="col s12">
    //                 <b>`+ element.nombre + `</b>
    //                 <br>
    //                 </div>
    //                 <div class="col s12 border-negocio" style="border-bottom: solid 1px;">
    //                 <p>Servicio: `+ element.servicio + `</p>
    //                 </div>
    //                 </a>
    //                 </div>`;
    //                         });
    //                     }
    //                     $('#data').empty().hide().html(buffer).fadeIn('slow');
    //                     $('#resultados-total').empty().html(negocios.length);

    //                 } else {
    //                     $('#data').empty().html("Ningún negocioesta registrado en esta zona");
    //                     $('#resultados-total').empty().html(0);
    //                 }


    //             } else {
    //                 alert("Algo ocurrio mal");
    //             }
    //         }
    //     )
    // },
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
                    console.log(data);
                    if (data.testimonios) {
                        data.testimonios.forEach(function (element) {
                            buffer += `<div class="card">
                    <div class="card-content">
                    <span class=""><b>`+ element.unombre + `</b></span>
                    <p>`+ element.testimonio + `</p>
                    </div>
                    </div>`;
                        });
                        $('#testimonios').empty().html(buffer);
                    } else {
                        $('#testimonios').empty().html('Este negocio aun no tiene ningún testimonio');
                    }

                    if (data.zonas) {
                        buffer = '';
                        data.zonas.forEach(function (element) {
                            buffer += element.zona + `, `;
                        });
                        $('#zonas').empty().html(buffer);
                    } else {
                        $('#zonas').empty().html('Este negocio aún no tiene ninguna zona');
                    }

                    if (data.servicios) {
                        buffer = '';
                        data.servicios.forEach(function (element) {
                            buffer += element.servicio + `, `;
                        });
                        $('#servicios').empty().html(buffer);

                        $('#nombre').empty().html(data.negocio[0].nombre);
                    } else {
                        $('#nombre').empty().html('Este negocio aun no tiene ningun servicio');
                    }

                    if (data.favorito) {
                        $('#favorito').html('<a onClick="Customer.borrarFavorito(' + id_negocio + ')">Agregado a favoritos</a > ');
                    } else {
                        $('#favorito').html('<a onClick="Customer.agregarFavorito(' + id_negocio + ')">Agregar a favoritos</a > ');
                    }

                } else {
                    $('#testimonios').empty().html('No hay ningun testimonio');
                }
            }
        );
    },
    llamada: function (e) {
        var id_negocio = getUrlVars()['id'];
        var id_usuario = getUid();
        var info = new Object();
        info.id_usuario = id_usuario;
        info.id_negocio = id_negocio;

        Service.execute("_ctrl/ctrl.service.php",
            {
                exec: "llamada",
                data: info
            }
        );
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
                    $('#pais').val(direccion.pais);
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
                    var data = r.data;
                    var buffer = '';
                    data.forEach(function (element) {
                        buffer += `<div class="row">
                        <a class="modal-trigger" href="#modal1" onClick="Customer.negocioDetalles(`+ element.id + `)">
                        <div class="col s12">
                        <b>`+ element.nombre + `</b>
                        <br>
                        </div>
                        <div class="col s12" style="border-bottom: solid 1px;">
                        <p>Servicios: Plomería, Electricista</p>
                        </a>
                        </div>
                        </div>`;
                    });
                    $('.container').html(buffer);
                } else {
                    $('.container').empty().html('Aún no tienes ningún negocio como favorito');
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
                        buffer += `<div class="row">
                        <a href="cotizacion_detalle.html?cotizacion=`+ element.id + `">
                        <div class="col s12">
                        <b>`+ element.descripcion + `</b><br>
                        <b>`+ element.fecha_atn + `</b>
                        <br>
                        </div>
                        <div class="col s12" style="border-bottom: solid 1px;">
                        </a>
                        </div>
                        </div>`;
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
                    var buffer_msj = '';
                    var buffer_llamada = '';
                    var cotizaciones = data.cotizaciones.cotizaciones;
                    var mensajes = data.cotizaciones.mensajes;
                    var llamadas = data.llamadas;
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
                            if (element.mensaje > 0) {
                                notificacion += `<b> Mensajes nuevos: (` + element.mensaje + `)`;
                            }
                            buffer += `<li><div class="row cotizacion">
                        <a href="cotizacion_detalle.html?cotizacion=`+ element.id + `">
                        <div class="col s12">
                        <b class="requerimiento">`+ element.descripcion + `</b><br>
                        <b>`+ element.fecha_atn + `</b>
                        <br>
                        `+ notificacion + `
                        </div>
                        <div class="col s12" style="border-bottom: solid 1px;">
                        </a>
                        </div>
                        </div></li>`;
                        } else {
                            buffer += `<li><div class="row llamada">
                        <div class="col s12">
                        <b class="negocio">`+ element.nombre + `</b><br>
                        <b>`+ element.modified_at + `</b>
                        <br>
                        </div>
                        <div class="col s12" style="border-bottom: solid 1px;">
                        </div>
                        </div></li>`
                        }
                        notificacion = '';
                    });

                    // for (var i = 0; i < cotizaciones.length; i++) {
                    //     if (mensajes[i]) {
                    //         notificacion += `<b> Mensajes nuevos: (` + mensajes[i].length + `)`;
                    //     }
                    //     buffer_msj += `<div class="row">
                    //     <a href="cotizacion_detalle.html?cotizacion=`+ cotizaciones[i].id + `">
                    //     <div class="col s12">
                    //     <b>`+ cotizaciones[i].descripcion + `</b><br>
                    //     <b>`+ cotizaciones[i].fecha_atn + `</b>
                    //     <br>
                    //     `+ notificacion + `
                    //     </div>
                    //     <div class="col s12" style="border-bottom: solid 1px;">
                    //     </a>
                    //     </div>
                    //     </div>`;
                    //     notificacion = "";
                    // }
                    // $('#mensaje').html(buffer);

                    // data.llamadas.forEach(function (element) {
                    //     buffer_llamada += `<div class="row">
                    //     <div class="col s12">
                    //     <b>`+ element.nombre + `</b><br>
                    //     <b>`+ element.modified_at + `</b>
                    //     <br>
                    //     </div>
                    //     <div class="col s12" style="border-bottom: solid 1px;">
                    //     </div>
                    //     </div>`;
                    // });
                    // $('#llamada').html(buffer);
                    buffer += buffer_llamada;
                    buffer += buffer_msj;
                    $('.list').html(buffer);

                    var options = {
                        valueNames: ['negocio', 'requerimiento']
                    };

                    var hackerList = new List('data', options);
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
            // $('.search').val('');
            // $('.search').click();
        } else if (e == 2) {
            $('.mensaje').addClass('todos');
            $('.mensaje').removeClass('todos');
            $('.llamada').fadeOut(1);
            $('.cotizacion').fadeIn(1);
            // $('.search').val('');
            // $('.search').click();
        } else {
            $('.cotizacion').show().fadeIn(1);
            $('.llamada').fadeIn(1);
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
                    var nuevos = r.data[1];
                    var buffer = '';
                    console.log(r.data);

                    for (var i = 0; i < cotizaciones.length; i++) {
                        if (nuevos[i]) {
                            buffer += `
                        <a href="chatmio.html?negocio=`+ cotizaciones[i].id_negocio + `&requerimiento=` + cotizaciones[i].id_requerimiento + `">
                        <div class="col s12">
                        <br>
                        </div>
                        <div class="row" style="border-bottom: solid 1px;">
                        <div class="col s6">
                        <p>`+ cotizaciones[i].negocio + ` <b>Nuevos mensajes: (` + nuevos[i].length + `)</b></p>
                        </div>`;
                            if (cotizaciones[i].status == 0) {

                                buffer += `<div class="s6"><p><a href="#modal1" onClick="Customer.preEvaluar(` + cotizaciones[i].id_negocio + `)">Evaluar</a></p></div>`;
                            }
                            buffer += `</a>
                        </div>`;
                        } else {
                            buffer += `
                        <a href="chatmio.html?negocio=`+ cotizaciones[i].id_negocio + `&requerimiento=` + cotizaciones[i].id_requerimiento + `">
                        <div class="row" style="border-bottom: solid 1px;">
                        <div class="col s12">
                        <br>
                        </div>
                        <div class="col s6">
                        <p>`+ cotizaciones[i].negocio + `</p>
                        </div>`;
                            if (cotizaciones[i].status == 0) {
                                buffer += `<div class="s6">
                                <p><a href="#modal1" onClick="Customer.preEvaluar(` + cotizaciones[i].id_negocio + `)">Evaluar</a></p>
                            </div>`;
                            }
                            buffer += `
                        </a >
                        </div >
                        </div > `;
                        }

                    }
                    // data.forEach(function (element) {
                    //     buffer += `< div class="row" >
                    //     <a href="chatmio.html?negocio=`+ element.id_negocio + `&requerimiento=` + element.id_requerimiento + `">
                    //     <div class="col s12">
                    //     <b>`+ element.descripcion + `</b>
                    //     <b>`+ element.fecha_atn + `</b>
                    //     <br>
                    //     </div>
                    //     <div class="col s12" style="border-bottom: solid 1px;">
                    //     <p>`+ element.negocio + `</p>
                    //     </a>
                    //     </div>
                    //     </div>`;
                    // });

                    $('.negocios').html(buffer);
                    $('#titulo').html(cotizaciones[0].descripcion);
                } else {
                    $('.negocios').empty().html('No tienes ningun negocio en esta cotización');
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
                        alert("Gracias por su evaluación");
                        location.reload();
                    } else {
                        alert('Algo salió mal');
                    }
                }
            );
        } else {
            alert("Por favor llena todos los campos");
        }
    },
    // Este metodo se usa en registro, crear direccion y editar direccion
    // Solo editar direccion envia un id el cual es de la ciudad
    // y es para preseleccionar la ciduad de la direccion
    getCiudades: function (ciudad = null) {
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
                    alert('Aún no hay ningúna ciudad registrada')
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
                    alert('Aún no hay ningúna ciudad para votar');
                }
            }
        );
    },
    votoCiudad: function (e) {
        var info = DAO.toObject($("#frmVotoCiudad").serializeArray());
        var flag = 0;
        if (!info.correo || info.correo.length < 4) {
            $('#correo').addClass('invalid');
            flag = 1
        }
        if (!info.voto_ciudad) { flag = 1 }
        if (flag == 0) {
            Service.execute("_ctrl/ctrl.service.php",
                {
                    exec: "votoCiudad",
                    data: info
                },
                function (r) {
                    if (r.status == 202) {
                        alert("Gracias por tu voto, lo tomaremos en cuenta");
                        location.href = "registro.html";
                    } else {
                        alert("No puedes votar mas de dos veces por la misma ciudad");
                    }
                }
            );
        } else {
            alert('Por favor llena todos los campos con información válida');
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

