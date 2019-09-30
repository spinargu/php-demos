$.widget("ui.jToolbar", {
    options: {
        class: "",
        buttons: []
    },
    /*setStateButton: function (name, show) {
        var $button = $('[name="' + name + '"]', this.element);
        if (show)
            $button.show();
        else
            $button.hide();
    },*/
    _create: function () {
        this._initialize();
        this._addButtons();
    },
    _initialize: function () {
        $(this.element).append('<div class="btn-toolbar ' + this.options.class + '"></div>');
    },
    _addButtons: function() {
        var that = this;
        var $buttonGroup = $('.btn-toolbar', this.element);
        $.each(this.options.buttons, function(index, button) {
            button = that._validate(button);
            var $button = $.button(button);
            button.validation.call($button);
            $buttonGroup.append($button);
            if (!button.show)
                $button.hide();
        });
    },
    _validate: function (button) {
        return $.extend(true,{
            show: true,
            validation: function () {}
        }, button);
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this);
    }
});