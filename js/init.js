var User = {
	init: function () {
		var _self = this;
		this.order = null;
		_self.addEventListeners();
	},
	addEventListeners: function () {
		var _self = this;

		/* ORDER */
		$(document).on("click", "a.onClickRegistro", function (e) { _self.register(); });
		$(document).on("click", "a.onClickLogin", function (e) { _self.login(); });
		$(document).on("click", "a.onClickLoginNegocio", function (e) { _self.loginNegocio(); });
		$(document).on("click", "a.onClickNegocioRegistro", function (e) { _self.registroNegocio(); });
		$(document).on("click", "a.onClickLoginAdmin", function (e) { _self.loginAdmin(); });
		$(document).on("click", "a.onClickPassRecover", function (e) { _self.recover(); });


		$('#recuperar-contrasena').on('shown.bs.modal', function () {
			$('#recuperar-contrasena .alert').hide();
			$('#txt_recuperar').val("");
		});


		$('.isNumber').keyup(function () { this.value = this.value.replace(/[^0-9\.]/g, ''); });

	},
	register: function (e) {
		var flag = 0;
		// var newsletter = 0;
		// if ($("#chk_newsletter").is(":checked")) { newsletter = 1; }
		var data = {
			nombre: $("#nombre").val(), correo: $("#correo").val(), movil: $("#movil").val(), contrasena: $("#contrasena").val(),
			confirmar_contrasena: $("#confirmar_contrasena").val(), id_ciudad: $("#id_ciudad").val(),
			exec: "registro"
		};

		if (!data.nombre || data.nombre.length < 3) {
			$('#nombre').addClass('invalid');
			flag = 1;
		}

		if (!data.correo || data.correo.length < 3) {
			$('#correo').addClass('invalid');
			flag = 1;
		}

		if (!data.movil || data.movil.length < 3) {
			$('#movil').addClass('invalid');
			flag = 1;
		}

		if (!data.contrasena || data.contrasena.length < 3) {
			$('#contrasena').addClass('invalid');
			flag = 1;
		}

		if (!data.confirmar_contrasena || data.confirmar_contrasena.length < 3) {
			$('#confirmar_contrasena').addClass('invalid');
			flag = 1;
		}

		if (flag == 0) {

			$.ajax({
				url: "_ctrl/ctrl.service.php", dataType: 'json', data: { exec: "registro", data: data }, type: "POST",
				success: function (r) {
					switch (r.status) {
						case 202:
							alert("Tu usuario ha sido registrado con éxito, te re-direccionaremos a tu cuenta.");
							localStorage.setItem('uid', r.uid);
							location.href = r.redirect;
							break;
						case 409: alert("Ya existe un usuario registrado con la cuenta de correo ingresada."); break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			alert('Por favor ingresa datos validos');
		}

	},
	login: function () {
		_self = this;

		var data = { u: $("#email").val(), p: $("#password").val() };
		var flag = 0;
		if (!data.u || data.u.length < 3) {
			$('#email').addClass('invalid');
			flag = 1;
		}
		if (!data.p) {
			$('password').addClass('invalid');
			flag = 1;
		}
		if (flag == 0) {
			$.ajax({
				url: "_ctrl/ctrl.service.php", dataType: 'json', data: { exec: "login", data: data }, type: "POST",
				success: function (r) {
					switch (r.status) {
						case 202:
							localStorage.setItem('uid', r.uid);
							location.href = r.redirect;
							break;
						case 0: alert("Usuario y/o contraseña incorrectos."); break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			alert('Por favor ingresa datos válidos');
		}
	},
	loginNegocio: function () {
		_self = this;
		var data = { u: $("#email").val(), p: $("#password").val() };
		var flag = 0;
		if (!data.u || data.u.length < 3) {
			$('#email').addClass('invalid');
			flag = 1;
		}
		if (!data.p) {
			$('password').addClass('invalid');
			flag = 1;
		}
		if (flag == 0) {
			$.ajax({
				url: "../_ctrl/ctrl.negocio.php", dataType: 'json', data: { exec: "login", data: data }, type: "POST",
				success: function (r) {
					switch (r.status) {
						case 202:
							localStorage.setItem('nid', r.nid);
							location.href = r.redirect;
							break;
						case 0: alert("Usuario y/o contraseña incorrectos."); break;
						case 200: alert("Su negocio aún no ha sido aprobado, pongase en contacto con el Administrador."); break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			alert('Por favor ingresa datos válidos');
		}
	},
	registroNegocio: function (e) {
		var flag = 0;
		var data = DAO.toObject($("#frmRegistro").serializeArray());
		var zonas = [];
		var servicios = [];
		$('#zonas :checked').each(function () {
			if ($(this).val() != "on") {
				zonas.push($(this).val());
			}
		});
		$('#servicios :checked').each(function () {
			if ($(this).val() != "on") {
				servicios.push($(this).val());
			}
		});


		if (!data.nombre || data.nombre.length < 3) {
			$('#nombre').addClass('invalid');
			flag = 1;
		}

		if (!data.correo || data.correo.length < 3) {
			$('#correo').addClass('invalid');
			flag = 1;
		}

		if (!data.movil || data.movil.length < 10) {
			$('#movil').addClass('invalid');
			flag = 1;
		}
		if (!data.telefono || data.telefono.length < 10) {
			$('#telefono').addClass('invalid');
			flag = 1;
		}

		if (!data.contrasena || data.contrasena.length < 3) {
			$('#contrasena').addClass('invalid');
			flag = 1;
		}

		if (!data.confirmar_contrasena || data.confirmar_contrasena.length < 3) {
			$('#confirmar_contrasena').addClass('invalid');
			flag = 1;
		}
		if (!data.informacion || data.informacion.length < 3) {
			$('#informacion').addClass('invalid');
			flag = 1;
		}

		if (!zonas) {
			$('#zonas').addClass('invalid');
			flag = 1;
		}
		if (!servicios) {
			$('#servicios').addClass('invalid');
			flag = 1;
		}
		data.zonas = zonas;
		data.servicios = servicios;
		console.log(data);
		if (flag == 0) {
			$.ajax({
				url: "../_ctrl/ctrl.negocio.php", dataType: 'json', data: { exec: "registro", data: data }, type: "POST",
				success: function (r) {
					switch (r.status) {
						case 202:
							alert("Tu negocio ha sido registrado con éxito, tu cuenta tiene que ser aprobada para que puedas iniciar sesión.");
							// localStorage.setItem('nid', r.nid);
							if (r.nid == 0) {
								location.href = 'index.html';
							} else {
								location.href = 'servicios.html';
							}
							break;
						case 409: alert("Ya existe un negocio registrado con la cuenta de correo ingresada."); break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			alert('Por favor ingresa datos validos');
		}

	},
	loginAdmin: function () {
		_self = this;

		var data = { u: $("#email").val(), p: $("#password").val() };
		var flag = 0;
		if (!data.u || data.u.length < 3) {
			$('#email').addClass('invalid');
			flag = 1;
		}
		if (!data.p) {
			$('password').addClass('invalid');
			flag = 1;
		}
		if (flag == 0) {
			$.ajax({
				url: "../_ctrl/ctrl.service.php", dataType: 'json', data: { exec: "loginAdmin", data: data }, type: "POST",
				success: function (r) {
					switch (r.status) {
						case 202:
							location.href = r.redirect;
							break;
						case 0: alert("Usuario y/o contraseña incorrectos."); break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			alert('Por favor ingresa datos válidos');
		}


	},
	recover: function () {
		_self = this;
		var data = { e: $("#email").val() };
		if (data.e == "" || data.e == null) { return; }
		if (!isValidEmail(data.e)) {
			alert('El e-mail ingresado no es valido');
			return;
		}
		$.ajax({
			url: "_ctrl/ctrl.register.php", dataType: 'json', data: { exec: "recover", data: data }, type: "POST",
			success: function (r) {

				switch (r.status) {
					case 202:
						alert("Hemos enviado una contraseña temporal a su correo registrado.");
						break;
					case 404:
						alert('El correo ingresado no se encuentra registrado en nuestra base de datos.');
						break;
				}
			}, error: function (errorThrown) { console.log(errorThrown); }
		});
	}
}

$(window).load(function () {
	User.init();
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


function isValidEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}