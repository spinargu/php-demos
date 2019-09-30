(function() {
	var actions = {
		idle: true,
		queue: [],
		validateOptions: function (options) {
            return $.extend(true,{
                url: "",
                command: "",
                data: "",
                form_data: false,
                files: [],
                onSuccess: function (response) {},
                onHandlerException: function (response) {
                    $.jNotification({
                        type: 'danger',
                        icon: 'fa fa-warning',
                        message: response
                    });
                },
				onError: function (response) {
                    $.jNotification({
                        type: 'danger',
                        icon: 'fa fa-warning',
                        message: 'Ha ocurrido un error, contacta a tu administrador.'
                    });
                    console.error(response);
                },
                waitingAnimation: {
                    modal: false,
                	removeOnResponse: true,
                    hide_on_response: false,
                	element: null,
                    class: "fa fa-spin mdi mdi-camera-iris",
                    size: "fa-3x",
                    // color: "#000000",
                    style: ""
                },
                cache: {
                    save: false,
                    method: "jquery|session|local",
                    reference: function (reference) {
						return reference;
                    }
                }
            }, options);
        },
        processRequest: function(options) {
			var that = this;
            // if (this.idle) {
                this.idle = false;
                if (options.cache.save) {
                    var cache = that.getCache(options);
                    if (cache !== undefined){
                        options.onSuccess(cache.data);
                        that.callWaitingRequest();
                        return;
                    }
                }
                if (options.waitingAnimation.element || options.waitingAnimation.modal)
                    this.addWaitingAnimation(options, function () {
                        that.sendRequest(options);
                    });
                else
                    this.sendRequest(options);
            // }else
            //     this.queue.push(options)
        },
		callWaitingRequest: function () {
            this.idle = true;
            var options = this.queue.shift();
            if (options !== undefined)
                this.processRequest(options);
        },
		sendRequest: function(options) {
			var that = this;
            var data = {
                command: options.command,
                data: options.data
            };
            if(options.form_data){
                data = new FormData();
                data.append('command', options.command);
                data.append('data', JSON.stringify(options.data));
                $.each(options.files, function (i, file) {
                    if(file.blob !== undefined)
                        data.append(file.name, file.blob, file.filename);
                })
            }
            if(options.add_data)
                options.add_data(data);
			$.ajax({
                type: 'POST',
                url: options.url,
                data: data,
                processData: !options.form_data,
                contentType: options.form_data ? false : 'application/x-www-form-urlencoded; charset=UTF-8'
            }).done(function (data) {
                if(typeof data === "string")
                    data =  JSON.parse(data);
                that.validateResponse(data, options)
            }).fail(function (response) {
                response = JSON.parse(response);
                if (options.waitingAnimation.removeOnResponse && options.waitingAnimation.element)
                    that.removeWaitingAnimation(options, function () {
                        options.onError(response.response);
                    });
                else
                    options.onError(response.response);
            });
		},
		validateResponse: function (response, options) {
            var that = this;
            switch(response.status * 1){
                case 200:
                    if (options.cache.save)
                        this.setCache(options, response.data);
                    if ((options.waitingAnimation.removeOnResponse && options.waitingAnimation.element) || options.waitingAnimation.modal)
                        this.removeWaitingAnimation(options, function () {
                            options.onSuccess(response.data);
                            that.callWaitingRequest();
                        });
                    else{
                        options.onSuccess(response.data);
                        that.callWaitingRequest();
                    }
                    break;
                case 400:
                    if (options.waitingAnimation.element)
                        this.removeWaitingAnimation(options, function () {
                            options.onHandlerException(response.message);
                            that.callWaitingRequest();
                        });
                    else{
                        options.onHandlerException(response.message);
                        that.callWaitingRequest();
                    }
                    break;
                case 401:
                    window.location.assign('/view/public?c=security&v=not_authorized');
                    break;
                case 500:
                    if (options.waitingAnimation.removeOnResponse && options.waitingAnimation.element)
                        this.removeWaitingAnimation(options, function () {
                            options.onError(response.message);
                        });
                    else
                        options.onError(response.message);
                    break;
            }
        },
		getCache: function (options) {
            var data;
            var reference = options.url+ "_" + options.command + "_";
			reference = options.cache.reference(reference, options.data);
            switch(options.cache.method){
                case "jquery":
                    data = $('body').data(reference);
                    break;
                case "session":
                    data = sessionStorage.getItem(reference);
                    data = (data === null ? undefined : JSON.parse(data));
                    break;
                case "local":
                    data = localStorage.getItem(reference);
                    datos = (data === null ? undefined : JSON.parse(data));
                    break;
            }
            return data;
        },
		setCache: function (options, data) {
            var reference = options.url + "_" + options.command + "_";
			reference = options.cache.reference(reference, options.data);
            var cache = {
                data: data,
                date: new Date()
            };
            switch(options.cache.method){
                case "jquery":
                    $('body').data(reference, cache);
                    break;
                case "session":
                    sessionStorage.setItem(reference, JSON.stringify(cache));
                    break;
                case "local":
                    localStorage.setItem(reference, JSON.stringify(cache));
                    break;
            }
        },
        addWaitingAnimation: function (options, callback) {
		    var animation = options.waitingAnimation;
		    if(animation.modal && actions.queue.length === 0){
                $.jModal({
                    title: "Procesando...",
                    close: false,
                    events: {
                        shown: function () {
                            $(this).addClass('modal-waiting-animation text-center').find('.modal-body').append('<i id="animation" ' +
                                ' style="padding: 30px ' + animation.style +
                                ' color: ' + animation.color + '"' +
                                ' class=" fa-5x ' + animation.class + '">' +
                                '</i>');
                            callback();
                        }
                    }
                });
                return;
            }
            var $element = animation.element;
            if($element.length === 0)
                throw "Invalid element to hide.";
            var $animation = $('<i id="animation" style="' + animation.style + ' color: ' + animation.color + '" ' +
                'class="' + animation.class + ' ' + animation.size + '">' +
                '</i>').hide();
            if($element.hasClass('btn')){
                $element.prop('disabled', true);
                var first = true;
                $element.children().hide("fast", function () {
                    if(first){
                        first = false;
                        callback();
                    }
                    $element.append($animation);
                    $animation.removeClass('fa-3x')
                        .addClass('fa-2x')
                        .css({
                            'top': '-5px',
                            'position': 'relative'
                        }).show('fast');
                });
            }else{
                $element.wrap('<div style="text-align: center;"></div>');
                $element.parent().append($animation);
                $element.hide("fast", function() {
                    callback();
                    $('#animation', $(this).parent()).show("fast");
                });
            }
        },
		removeWaitingAnimation: function (options, callback) {
		    if( options.waitingAnimation.modal){
		        if(actions.queue.length === 0){
                    callback();
                    $('.modal-waiting-animation').modal('hide');
                }
		        return;
            }
            var $element = options.waitingAnimation.element;
            if(options.waitingAnimation.hide_on_response)
                $element.hide('fast');
            if($element.hasClass('btn')) {
                $element.find('#animation').hide('fast', function () {
                    callback();
                    $(this).remove();
                    $element.children().show('fast', function () {
                        $element.prop('disabled', false)
                    })
                })
            }else{
                var $container = $element.parent();
                $('#animation', $container).hide("fast", function () {
                    callback();
                    $(this).remove();
                    $element.show("fast", function () {
                        $element.unwrap();
                    });
                });

            }
        }
	};
	$.jAjaxRequestManager = function (options) {
		options = actions.validateOptions(options);
		actions.processRequest(options)
	};
})();
