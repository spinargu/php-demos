$.widget("ui.jPopover", {
    options: {
        title: "Titulo",
        position: "left",
        coordinates: null,
        vertical: true,
        container: null,
        placement: null,
        auto_close: true,
        buttons: [],
        _content: ""
    },
    hide: function () {
        this._remove();
    },
    _create: function () {
        this._addButtons();
        this._initialize();
        $(this.element).popover('show');
    },
    _initialize: function () {
        var that = this;
        $('.onPopover').jPopover('hide');
        $(this.element).popover({
            title: this.options.title ? '<b>' + this.options.title +'</b>' : null,
            html: true,
            container: this.options.container,
            placement: function (tip, element) {
                if (that.options.coordinates)
                    setTimeout(function () {
                        $(tip).css({
                            top: that.options.coordinates.y,
                            left: that.options.coordinates.x
                        })
                    })

                if($.isFunction(that.options.placement))
                    that.options.placement.call(that.element, tip, element);
                that._addEvents(tip, element);
                $(tip).addClass('jPopover');
                if (that.options.auto_close)
                    $(tip).on("mouseleave mouseup",function() {
                        that._remove();
                    });
                return that.options.position;
            },
            content: function () {
                return that.options._content;
            },
            trigger: "manual"
        }).on('blur', function () {
            setTimeout(function () {
                if(that.options.auto_close)
                    that._remove();
            },100)
        }).addClass('onPopover');

        if (this.options.container !== null) {
            $(this.options.container).on('scroll', function() {
                that._remove();
            });
        }
    },
    _addButtons: function() {
        var that = this;
        var orientation = this.options.vertical ? '-vertical': '';
        var $content = $(
            '<div>' +
                '<div class="btn-group' + orientation +' btn-block"></div>' +
            '</div>');
        var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
        $.each(this.options.buttons, function(index, button) {
            if(button.code){
                if(Array.isArray(button.code)){
                    if(!button.code.find(function(code){ return (code in subpermissions)}) )
                        return;
                }else{
                    if(!(button.code in subpermissions))
                        return;
                }
            }
            button = that._validate(button);
            var $button = $.button(button);
            button.validation.call($button);
            if (button.show)
                $content.find('div').append($button);
        });
        this.options._content += $content.html();
    },
    _validate: function (button) {
        return $.extend(true,{
            show: true,
            validation: function () {}
        }, button);
    },
    _addEvents: function($tip, $element) {
        var that = this;
        $.each(this.options.buttons, function(index, button) {
            $('[name="' + button.name + '"]', $tip).click(function() {
               if ($.isFunction(button.action)){
                   setTimeout(function () {
                       button.action.call($element);
                   }, 100)
               }
            });
        });
    },
    _remove: function () {
        $(this.element)
            .popover('hide')
            .removeData('bs.popover')
            .removeClass('onPopover');
        this.destroy();
    }
});