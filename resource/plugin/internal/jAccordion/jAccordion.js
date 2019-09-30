$.widget("ui.jAccordion", {
    options: {
        oneOpen: true,
        panels: []
    },
    add_panel: function (panel) {
        var $jAccordion = $(this.element).find('.jAccordion');
        var data = this.options.data;
        panel = this._validate(panel);
        var $panel = $(
            '<div name="' + panel.name + '" class="panel panel-' + panel.type + '">'+
            '<div class="panel-heading">'+
            '<h4 class="panel-title"><i class="' + panel.icon + '"></i><icon></icon></h4>'+
            '</div>'+
            '<div class="panel-collapse collapse">'+
            '<div class="panel-body"></div>'+
            '<div class="panel-footer"></div>'+
            '</div>'+
            '</div>'
        ).data('data', panel.data);
        $jAccordion.append($panel);
        var $title = $panel.find('.panel-title');
        var $body = $panel.find('.panel-body');
        var $footer = $panel.find('.panel-footer');
        if (panel.open){
            $panel.find('.collapse').addClass('in');
            $panel.find('.panel-heading').addClass('open-icon');
        }
        if ($.isFunction(panel.title))
            panel.title.call($title, data, panel.data, panel.title);
        else
            $title.find('i').after('<span>' + panel.title + '</span>');
        if ($.isFunction(panel.content))
            panel.content.call($body, data, panel.data);
        if ($.isFunction(panel.footer))
            panel.footer.call($footer, data, panel.data);
        else
            $footer.remove();
        this._setEvents();
    },
    get_data: function (get) {
        get = get === undefined ? function (data) {
            return data;
        } : get;
        var data = {};
        $(this.element).find('.panel').each(function (i, element) {
            var panel_data = $(element).data('data');
            var panel_name = $(element).attr('name');
            panel_data = get(panel_data);
            data[panel_name] = panel_data;
        });
        return data;
    },
    _create: function () {
        this._initialize();
        this._addPanels();
    },
    _initialize: function () {
        $(this.element).append('<div class="panel-group jAccordion"></div>');
    },
    _addPanels: function() {
        var that = this;
        var $jAccordion = $(this.element).find('.jAccordion');
        var data = this.options.data;
        $.each(this.options.panels, function(index, panel) {
            panel = that._validate(panel);
            var $panel = $(
                '<div name="' + panel.name + '" class="panel panel-' + panel.type + '">'+
                    '<div class="panel-heading">'+
                        '<h4 class="panel-title"><i class="' + panel.icon + '"></i><icon></icon></h4>'+
                    '</div>'+
                    '<div class="panel-collapse collapse">'+
                        '<div class="panel-body"></div>'+
                        '<div class="panel-footer"></div>'+
                    '</div>'+
                '</div>'
            ).data('data', panel.data)
                .data('options',panel);
            if (panel.show) {
                $jAccordion.append($panel);
                var $title = $panel.find('.panel-title');
                var $body = $panel.find('.panel-body');
                var $footer = $panel.find('.panel-footer');
                if (panel.open) {
                    $panel.find('.collapse').addClass('in');
                    $panel.find('.panel-heading').addClass('open-icon');
                }
                if ($.isFunction(panel.title))
                    panel.title.call($title, data, panel.data);
                else
                    $title.find('i').after('<span>' + panel.title + '</span>');
                if ($.isFunction(panel.content))
                    panel.content.call($body, data, panel.data);
                if ($.isFunction(panel.footer))
                    panel.footer.call($footer, data, panel.data);
                else
                    $footer.remove();
            }

            that._setEvents($panel);

        });
    },
    _setEvents: function ($panel) {
        var $jAccordion = $(this.element).children();
        var options = this.options;
        var data_options = $panel.data('options');
        $panel.find('.panel-heading').off('click').on('click', function() {
            if (options.oneOpen)
                $(this).closest('.jAccordion').find('.collapse.in').each(function(index, el) {
                    $(el).collapse('toggle');
                });
            $(this).next().collapse('toggle');
            if ($.isFunction(data_options.on_click))
                data_options.on_click.call($(this));
        });
        $jAccordion.find('.panel-group .collapse').off('shown.bs.collapse').on('shown.bs.collapse', function () {
            $(this).prev().addClass('open-icon');
        }).off('hidden.bs.collapse').on('hidden.bs.collapse', function () {
            $(this).prev().removeClass('open-icon');
        });
    },
    _validate: function (panel) {
        return $.extend(true,{
            name: "panel",
            type: "default",
            open: false,
            title: "Titulo",
            content: null,
            footer: null,
            data: null,
            icon: "",
            show: true,
            on_click: function () {}
        }, panel);
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this);
    }
});