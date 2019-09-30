$.widget("ui.jButtonGroup", {
    options: {
        class: "",
        justified: false,
        buttons: []
    },
    setStateButton: function (name, show) {
        var $button = $('[name="' + name + '"]', this.element);
        if (show)
            $button.show();
        else
            $button.hide();
    },
    _create: function () {
        this._initialize();
        this._addButtons();
    },
    _initialize: function () {
        $(this.element).append('<div class="jButtonGroup btn-group ' + this.options.class + '"></div>');
        if(this.options.justified)
            $(this.element).find('.btn-group').addClass('btn-group-justified');
    },
    _addButtons: function() {
        var that = this;
        var $buttonGroup = $('.jButtonGroup', this.element);
        var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
        $.each(this.options.buttons, function(index, button) {
            if(button.code){
                if(Array.isArray(button.code)){
                    if(!button.code.find(function(code){ return (code in subpermissions)}) )
                        return;
                } else{
                    if(!(button.code in subpermissions))
                        return;
                }
            }
            button = that._validate(button);
            var $button = $.button(button);
            $button.on('clean', function () {
                $(this).data('clean').call($(this));
            }).data('clean', button.clean);
            button.validation.call($button);
            $buttonGroup.append($button);
            if(that.options.justified)
                $button.wrap('<div class="btn-group" role="group"></div>');
            if (!button.show)
                $button.hide();
        });
    },
    _validate: function (button) {
        return $.extend(true,{
            show: true,
            validation: function () {},
            clean: function () {},
        }, button);
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this);
    }
});