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
		$(document).on("click", "a.onClickRecuperar", function (e) { _self.recover(); });
		$(document).on("click", "a.onClickRecuperarAdmin", function (e) { _self.recoverAdmin(); });


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

		if (data.confirmar_contrasena != data.contrasena) {
			swal({
				title: ":(",
				text: "Las contraseñas ingresadas no coindicen.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
			flag = 2;
			$('#contrasena').addClass('invalid');
			$('#confirmar_contrasena').addClass('invalid');
			return;
		}

		if (!data.id_ciudad) {
			$('.select-dropdown').addClass('invalid');
			flag = 1;
		}

		if (!data.nombre || data.nombre.length < 3) {
			$('#nombre').addClass('invalid');
			flag = 1;
		}

		if (!data.correo || data.correo.length < 3 || !isValidEmail(data.correo)) {
			$('#correo').addClass('invalid');
			flag = 1;
		}

		if (!data.movil || data.movil.length < 10) {
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
							swal({
								title: "Registro",
								text: "Tu usuario ha sido registrado con éxito, te re-direccionaremos a tu cuenta.",
								type: "success",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							}, function (isConfirm) { if (isConfirm) { location.href = r.redirect; } });
							localStorage.setItem('uid', r.uid);
							break;
						case 409:
							swal({
								title: "Error!",
								text: "Ya existe un usuario registrado con la cuenta de correo ingresada.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							$('#correo').addClass('invalid');
							break;
						case 408:
							swal({
								title: "Error!",
								text: "Ya existe un usuario registrado con el número de teléfono ingresado.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							$('#movil').addClass('invalid');
							break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else if (flag == 1) {
			swal({
				title: "Error!",
				text: "Por favor ingresa datos válidos.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
		}

	},
	login: function () {
		_self = this;

		var data = { u: $("#email").val(), p: $("#password").val() };
		var flag = 0;
		if (!data.u || data.u.length < 3 || !isValidEmail(data.u)) {
			$('#email').addClass('invalid');
			flag = 1;
		}
		if (!data.p || data.p.length < 3) {
			$('#password').addClass('invalid');
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
						case 0:
							swal({
								title: "Error!",
								text: "Usario y/o contraseña incorrectos.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			swal({
				title: "Error!",
				text: "Por favor ingresa datos válidos.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
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
							var hoy = new Date();
							var fecha_fin = new Date(r.data[0].fecha_fin);
							fecha_fin.setDate(fecha_fin.getDate() + 1);
							if (fecha_fin >= hoy) {
								var difmes = fecha_fin.getMonth() - hoy.getMonth();
								var difdia = fecha_fin.getDate() - hoy.getDate();
								if (difmes == 0 && difdia < 15) {
									swal({
										title: "Aviso",
										text: "Tu suscripción vence en " + difdia + " dia(s).",
										type: "info",
										confirmButtonText: "Aceptar",
										confirmButtonColor: "#2C8BEB"
									}, function (isConfirm) {
										if (isConfirm) {
											location.href = r.redirect;
										}
									});
								} else {
									location.href = r.redirect;
								}
								localStorage.setItem('nid', r.nid);
								localStorage.setItem('ff', fecha_fin);
							} else {
								swal({
									title: "Error!",
									text: "Tu suscripción se ha vencido, por favor ponte en contacto con el Administrador para renovarla.",
									type: "error",
									confirmButtonText: "Aceptar",
									confirmButtonColor: "#2C8BEB"
								});
							}
							break;
						case 0:
							swal({
								title: "Error!",
								text: "Usario y/o contraseña incorrectos.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							break;
						case 201:
							swal({
								title: "Error!",
								text: "Aún no tienes ninguna suscripción activa.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							break;
						case 200:
							swal({
								title: "Error!",
								text: "Su negocio aún no ha sido aprobado, pongase en contacto con el Administrador..",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			swal({
				title: "Error!",
				text: "Por favor ingresa datos válidos.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
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
							swal({
								title: "Registro",
								text: "Tu negocio ha sido registrado con éxito, tu cuenta tiene que ser aprobada para que puedas iniciar sesión.",
								type: "success",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							// localStorage.setItem('nid', r.nid);
							if (r.nid == 0) {
								location.href = 'index.html';
							} else {
								location.href = 'servicios.html';
							}
							break;
						case 409:
							swal({
								title: "Error!",
								text: "Ya existe un negocio con la cuenta de correo ingresada.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			swal({
				title: "Error!",
				text: "Por favor ingresa datos válidos.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
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
						case 0:
							swal({
								title: "Error!",
								text: "Usario y/o contraseña incorrectos.",
								type: "error",
								confirmButtonText: "Aceptar",
								confirmButtonColor: "#2C8BEB"
							});
							break;
					}
				}, error: function (errorThrown) { console.log(errorThrown); }
			});
		} else {
			swal({
				title: "Error!",
				text: "Por favor ingresa datos válidos.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
		}


	},
	recover: function () {
		_self = this;
		var data = { e: $("#correo").val() };
		console.log(data);
		if (data.e == '' || data.e < 3 || !isValidEmail(data.e)) {
			swal({
				title: "Error!",
				text: "El e-mail ingresado no es válido.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
			return;
		}
		$.ajax({
			url: "_ctrl/ctrl.service.php", dataType: 'json', data: { exec: "recover", data: data }, type: "POST",
			success: function (r) {

				switch (r.status) {
					case 202:
						swal({
							title: "Recuperar contraseña",
							text: "Hemos enviado la contraseña a su correco electrónico.",
							type: "success",
							confirmButtonText: "Aceptar",
							confirmButtonColor: "#2C8BEB"
						});
						break;
					case 404:
						swal({
							title: "Error!",
							text: "El correo no se encuentra registrado en nuestra base de datos.",
							type: "error",
							confirmButtonText: "Aceptar",
							confirmButtonColor: "#2C8BEB"
						});
						break;
				}
			}, error: function (errorThrown) { console.log(errorThrown); }
		});
	},
	recoverAdmin: function () {
		_self = this;
		var data = { e: $("#correo").val() };
		console.log(data);
		if (data.e == '' || data.e < 3 || !isValidEmail(data.e)) {
			swal({
				title: "Error!",
				text: "El e-mail ingresado no es válido.",
				type: "error",
				confirmButtonText: "Aceptar",
				confirmButtonColor: "#2C8BEB"
			});
			return;
			return;
		}
		$.ajax({
			url: "../_ctrl/ctrl.negocio.php", dataType: 'json', data: { exec: "recover", data: data }, type: "POST",
			success: function (r) {

				switch (r.status) {
					case 202:
						swal({
							title: "Recuperar contraseña",
							text: "Hemos enviado la contraseña a su correco electrónico.",
							type: "success",
							confirmButtonText: "Aceptar",
							confirmButtonColor: "#2C8BEB"
						});
						break;
					case 404:
						swal({
							title: "Error!",
							text: "El correo no se encuentra registrado en nuestra base de datos.",
							type: "error",
							confirmButtonText: "Aceptar",
							confirmButtonColor: "#2C8BEB"
						});
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