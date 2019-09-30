$.jFileDownloadManager = {
	_empty: true,
	_error: false,
	_requests: [],
	init: function (options) {
		var that = this;
		(function (opciones) {
			if (that._error) {
	    		$.jNotification({
                    type: 'danger',
                    icon: 'fa fa-times-circle',
                    message: 'Lo sentimos, ha ocurrido un error en alguna descarga anterior, por lo que debe actualizar la página.'
                });
				return;
			};
			options = validateOptions(options);
			sendRequest(options);
		})(options);
	    function validateOptions (options) {
			return $.extend(true,{
				url: "",
				command: "",
				data: null,
				onSuccess: null,
				ExcepcionManejable: null,
				waitingAnimation: {
					class: "fa fa-spinner fa-spin",
					size: "fa-2x",
					seconds: undefined
				}
		    }, options);
	    }
	    function sendRequest(options) {
	    	if (that._empty) {
	    		that._empty = false;
	    		if (options.waitingAnimation.element)
	    			addWaitAnimation(options);
	    		var url = getUrl(options);
	    		var iframe = document.createElement('iframe');
	            iframe.style.display = 'none';
	            document.body.appendChild(iframe);
	            iframe.src = url;
	    		$.jNotification({
                    type: 'success',
                    icon: 'fa fa-spinner fa-cog',
                    message: 'Espere un momento por favor, estamos procesando su descarga.'
                });
	    		$.jCookie.check({
	    			name: "ArchivoDescargado",
	    			seconds: options.waitingAnimation.seconds,
	    			inHalfTimeLimit: function () {
	    				$.jNotification({
		                    type: 'warning',
		                    icon: 'fa fa-exclamation-triangle',
		                    message: 'La descarga está tardando más de lo usual. \nEspere un momento por favor.'
		                });
	    			},
					timeOutExpired: function () {
						$.jNotification({
		                    type: 'danger',
		                    icon: 'fa fa-times-circle',
		                    message: 'Lo sentimos, al parecer ha ocurrido un error! Actualice la página y vuelva a intentarlo.'
		                });
						if (options.waitingAnimation.element)
							removeWaitAnimation(options);
						that._error = true;
					},
					cookieEncontrada: function (valorCookie) {
						valorCookie = decodeURIComponent(valorCookie).replace(/\+/g, " ");
						if (valorCookie == "exitoso") {
		    				$.jNotification({
			                    type: 'success',
			                    icon: 'fa fa-thumbs-o-up',
			                    message: 'El archivo ha sido descargado exitosamente.'
			                });
							if ($.isFunction(options.Exitoso))
								options.Exitoso();
						}else if (valorCookie.indexOf("excepcionInterna") != -1) {
							var mensaje = valorCookie.split("|")[1];
							if ($.isFunction(options.ExcepcionManejable))
								options.ExcepcionManejable(mensaje);
						}else if (valorCookie.indexOf("excepcion") != -1) {
							var mensaje = valorCookie.split("|")[1];
							console.error(mensaje);
						};
						if (options.waitingAnimation.element)
							removeWaitAnimation(options);
						callPendingRequest();
					}
	    		})
	    	}else{
	    		that._requests.push(options)
	    	}
	    }
	    function callPendingRequest () {
	    	that._empty = true;
	    	var options = that._requests.shift();
	    	if (options != undefined)
	    		sendRequest(options);
	    }
	    function addWaitAnimation(options) {
	    	var $element = options.waitingAnimation.element;
	    	var $animation = $('<i class=" elementAnimation ' + options.waitingAnimation.class + ' ' + options.waitingAnimation.size + '"></i>').hide();
	    	$element.wrap('<div class="contenedorAnimacion" style="text-align: center; display: inline-block; margin: 0 10px"></div>');
    		$element.parent().append($animation);
	    	$element.hide('fast', function() {
	    		$('i', $(this).parent()).show("fast");
	    	});
	    }
	    function removeWaitAnimation(options) {
	    	var $element = options.waitingAnimation.element;
	    	var $container = $element.parent();
	    	$('.elementAnimation', $container).hide('fast', function() {
	    		$(this).remove();
	    		$container.children().show('fast', function() {
	    			$element.unwrap();
	    		});
	    	});
	    }
	    function getUrl (options) {
		    var url = options.url;
		    if (options.command !== '')
		        url += '?command=' + options.command;
		    if (options.data !== null){
                if (url.indexOf('?') === -1)
                	url += '?';
                else
					url += '&';
				if(typeof options.data == "string")
					url += 'data= '+ encodeURI(options.data);
				else
					url += $.param(options.data);
            }
		    return url.replace(/"/g,"");
		}
	}

};
