$.widget("ui.jMosaic", {
    options:{
        base: '',
        return_button: {
            icon: 'fa fa-home',
            label: 'Inicio',
        },
        buttons:[],
        structure: null,
        on_shown: null,
        _history: []
    },

    _create: function(){
        this.options._history = [];
        this._initialize();
        this._add_buttons(this.options.buttons, false);
    },
    _initialize: function () {
        $(this.element).addClass('jMosaic').append('<div class="row mosaic-container"></div>');
    },
    _add_buttons: function(buttons, add_return, sub_mosaic){
        var that = this;
        var return_button = this.options.return_button;
        var $container = $('.mosaic-container', this.element);
        if (add_return) {
            var $button = $(
                '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">'+
                '<div class="mosaic mosaic-home">'+
                '<div class="mosaic-icon-container">'+
                '<i class="mosaic-icon ' + return_button.icon + ' fa-5x"></i>'+
                '</div>'+
                '<div class="mosaic-name-container">'+
                '<span class="mosaic-name">' + return_button.label + '</span>'+
                '</div>'+
                '</div>'+
                '</div>'
            ).click(function() {
                that._clean_container(function () {
                    var buttons = that.options._history.pop();
                    var back = that.options._history.length !== 0;
                    if($.isFunction(return_button.click))
                        return_button.click();
                    that._add_buttons(buttons, back);
                });
            });
            $container.append($button);
        }else{
            if (!add_return && !sub_mosaic)
                this.options._history.unshift(buttons);
        }
        $.each(buttons, function(i, button) {
            if ($.isFunction(that.options.structure)) {
                button = that.options.structure(button);
            }
            button =  $.extend(true,{
                name: "Elemento " + i,
                icon: "fa fa-cube",
                size: "col-xs-12 col-sm-6 col-md-4 col-lg-3"
            }, button);
            if (button.exposed) {
                that._add_buttons(button.buttons, false, true);
                return;    
            }
            $button = $(
                '<div class="' + button.size + '">'+
                    '<div class="mosaic ' + (sub_mosaic ? 'mosaic-sub' : '') + '">'+
                        '<div class="mosaic-icon-container">'+
                        '<i class="mosaic-icon ' + button.icon + ' fa-5x"></i>'+
                        '</div>'+
                        '<div class="mosaic-name-container">'+
                            '<span class="mosaic-name">' + button.name + '</span>'+
                        '</div>'+

                    '</div>'+
                '</div>'
            ).data('data', button);
            if(button.icon == null){
                $button.find('.mosaic-icon-container').remove();
                $button.find('.mosaic-name-container').css({
                    'display': 'inline-table',
                    'height': '100%',
                });
                $button.find('.mosaic-name').css({
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                    'font-size': 'x-large',
                });

            }
            if (button.buttons)
                $button.data('buttons', button.buttons);
            $button.click(function() {
                var data = $(this).data('data');
                var buttons = $(this).data('buttons');
                if (buttons) {
                    that._clean_container(function () {
                        if($.isFunction(data.on_show_buttons))
                            data.on_show_buttons(data);
                        that._add_buttons(buttons, true, true);
                    });
                } else{
                    if($.isFunction(data.click))
                        data.click();
                    else
                        $.redirect(button.controller, button.view);
                }
            });
            $container.append($button);
        });
        if (add_return !== undefined)
            $container.show('fast', function () {
                if ($.isFunction(that.options.on_shown))
                    that.options.on_shown.call(that.element);
                $('.panel-title', that.element).each(function(index, el) {
                    $.add_marquee(20, $(el))
                });
            });
        var resizeId;
        $(window).resize(function() {
            clearTimeout(resizeId);
            resizeId = setTimeout(function () {
                $('.panel-title', that.element).each(function(index, el) {
                    $.add_marquee(20, $(el))
                });
            }, 500);
        });
    },
    _clean_container: function (callback) {
        var $container = $('.mosaic-container', this.element);
        $container.hide('fast', function() {
            $('.mosaic', $(this)).parent().remove();
            if ($.isFunction(callback))
                callback();
        });
    }
});