$.widget("ui.jFilter", {
    options: {
        add: false,
        filters: [],
        on_apply: false,
        hide_on_apply: false,
        on_refresh: function () {}
    },
    _set_public_methods: function () {
        var that = this;
        $.fn.jfilter_add_filter_options = function (list) {
            if(!that._validate_method_to_use($(this), 'add_filter_options'))
                return;
            that._add_filter_options($(this), list);
            return $(this);
        };
        $.fn.jfilter_refresh = function () {
            if(!that._validate_method_to_use($(this), 'refresh'))
                return;
            that.options.on_refresh();
            return $(this);
        };
        $.fn.jfilter_get_data_filters = function () {
            if(!that._validate_method_to_use($(this), 'get_data_filters'))
                return;
            return that._get_data_filters();
        };
        $.fn.jfilter_show_apply_button = function () {
            if(!that._validate_method_to_use($(this), 'show_apply_button'))
                return;
            return that._show_apply_button();
        };
        $.fn.jfilter_hide_apply_button = function () {
            if(!that._validate_method_to_use($(this), 'hide_apply_button'))
                return;
            return that._hide_apply_button();
        };
    },
    _validate_method_to_use: function ($element, method_name) {
        var methods = $element.data('public_methods') || [];
        if(!($.inArray(method_name, methods) !== -1)){
            console.error('This element can\`t use this method');
            return false;
        }
        return true;
    },
    _create: function () {
        $(this.element).addClass('jFilter').data('public_methods', [
            'get_data_filters',
            'refresh',
            'hide_apply_button',
        ]);
        this._initialize();
        this._validate_filters();
        this._add_default_filters();
        this._set_public_methods();
    },
    _initialize: function () {
        var that = this;
        var $table = $(this.element);
        if(!$table.is('table')){
            console.error('The element must be a table');
            return;
        }
        $table.addClass('table table-bordered table-condensed').append(
        '<thead>' +
            '<tr>' +
                '<td class="add btn-success" >' +
                    '<i class="fa fa-plus"></i>' +
                '</td>' +
                '<th class="text-center">Filtros</th>' +
                '<td class="apply btn-success" >' +
                    '<i class="fa fa-check"></i>' +
                '</td>' +
            '</tr>' +
        '</thead>' +
        '<tbody class="tbody"></tbody>'
        );
        if(this.options.add)
            $table.find('.add').click(function () {
                that._select_filter_to_add();
            });
        else
            $table.find('.add').remove();
        if(this.options.on_apply)
            $table.find('.apply').click(function () {
                var data = that._get_data_filters();
                that.options.on_apply.call($(that.element), data);
                if(that.options.hide_on_apply)
                    $(this).hide('fast');
            }).hide();
        else
            $table.find('.apply').remove();
    },
    _validate_filters: function () {
        this.options.filters = $.map(this.options.filters, function (filter) {
            return $.extend({
                default_label: 'Todos',
                removable: true,
                default_filters: [],
                show_on_init: false
            }, filter);
        })
    },
    _add_default_filters:function () {
        var that = this;
        $.each(this.options.filters, function (i, filter) {
            if(filter.default_filters.length !== 0 || filter.show_on_init){
                that._add_filter(filter, false);
            }
        })
    },
    _select_filter_to_add: function () {
        var that = this;
        var list = this._get_filter_added_names();
        var filters = $.grep(this.options.filters, function (filter) {
            return filter.default_filters.length === 0;
        });
        $.jModal({
            title: 'Filtros',
            close: false,
            jList: {
                height: '50%',
                data: filters,
                sortOnInit: false,
                search:{
                    show: false
                },
                element: {
                    structure: function (data) {
                        return {
                            name: data.label,
                        }
                    },
                    check: function (data) {
                        return {
                            selected: $.inArray(data.name, list) !== -1,
                            show: true
                        };
                    }
                }
            },
            buttons: [
                {
                    name: "cancel",
                    class: "pull-left",
                    label: "Cancelar",
                    type:"danger",
                    icon: "fa fa-times",
                    action: function () {
                        $(this).closest('.modal').modal('hide');
                    }
                },
                {
                    name: "accept",
                    label: "Aceptar",
                    type: "success",
                    action: function () {
                        $(this).closest('.modal').jModal('close', true, function () {
                            var $jList = $(this).jModal('get_jList');
                            var list = $jList.jList('get_selected_elements');
                            that._process_selected_filters(list);
                        });
                    }
                }
            ]
        })
    },
    _get_filter_added_names: function () {
        var $table = $(this.element).find('.tbody');
        var result = [];
        $table.find('.filter').each(function (i, filter) {
            var filter_data = $(filter).data('data');
            result.push(filter_data.name);
        });
        return result;
    },
    _process_selected_filters: function (list) {
        var $table = $(this.element).find('.tbody');
        var names = $.map(list, function (filter) {
            return filter.name;
        });
        $table.find('.filter.removable').each(function (i, filter) {
            var $filter = $(filter);
            var filter_data = $filter.data('data');
            if($.inArray(filter_data.name, names) === -1)
                $filter.remove();
            else
               list = $.grep(list, function (filter) {
                   return !(filter.name === filter_data.name)
               })
        });
        this._add_filters(list);
    },
    _add_filters: function (list) {
        var that = this;
        $.each(list, function (i, filter) {
            that._add_filter(filter, true);
        });
    },
    _add_filter: function (filter, removable) {
        var that = this;
        var $table = $(this.element).find('.tbody');
        var $row = $(
            '<tr class="filter" >' +
                '<td colspan="2">' +
                    '<table class="filter-table">' +
                        '<tr>' +
                            '<td class="search btn-primary" colspan="2">' +
                                '<i class="fa fa-search"></i>' + filter.label +
                            '</td>' +
                            '<td class="remove btn-danger btn-alt">' +
                                '<i class="fa fa-times"></i>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="clean btn-info btn-alt">' +
                                '<i class="fa fa-times"></i>' +
                            '</td>' +
                            '<td class="selected_filters"></td>' +
                        '</tr>' +
                    '</td>' +
                '</table>' +
            '</tr>'
        ).data('data', filter).data('selected', []).data('public_methods', [
            'add_filter_options',
            'refresh',
            'show_apply_button'
        ]);
        $row.find('.clean').click(function () {
            var $filter = $(this).closest('.filter');
            var filter = $filter.data('data');
            $filter.find('.selected_filters').empty();
            if(filter.default_filters.length === 0 && filter.default_label !== null)
                that._add_filter_option($filter, {
                    id: 0,
                    name: filter.default_label,
                    removable: false
                });
            else{
                $.each(filter.default_filters, function (i, filter) {
                    that._add_filter_option($filter, filter)
                });
            }
            $(this).hide('fast');
            if(that.options.on_apply)
                that._show_apply_button();
            else
                that.options.refresh();
        }).hide();
        $row.find('.search').click(function () {
            var $filter = $(this).closest('.filter');
            var data = $filter.data('data');
            var selected = that._get_filter_options_selected($filter);
            data.action.call($filter, selected)
        })
        $row.find('.remove').click(function () {
            $(this).closest('.filter').remove();
            if(that.options.on_apply)
                that._show_apply_button();
            else
                that.options.refresh();
        });
        if(!removable)
            $row.find('.remove').remove();
        else
            $row.addClass('removable');
        if(filter.default_filters.length === 0 && filter.default_label !== null)
            that._add_filter_option($row, {
                id: 0,
                name: filter.default_label,
                removable: false
            });
        else {
            $.each(filter.default_filters, function (i, filter) {
                that._add_filter_option($row, filter)
            });
        }
        $table.append($row);
    },
    _add_filter_options: function ($button, list) {
        var that = this;
        var $filter = $button.closest('.filter');
        var $selected = $filter.find('.selected_filters');
        var $clean = $filter.find('.clean');
        var filter = $filter.data('data');
        $selected.empty();
        if(list.length === 0 && filter.default_label !== null) {
            that._add_filter_option($filter, {
                id: 0,
                name: filter.default_label,
                removable: false
            });
            $clean.hide('fast');
        }else{
            $.each(list, function (i, filter) {
                if(filter.removable === undefined)
                    filter.removable = true;
                that._add_filter_option($filter, filter)
            });
            $clean.show('fast');
        }
    },
    _add_filter_option: function ($filter , data) {
        var that = this;
        var $clean = $filter.find('.clean');
        var $option = $(
            '<div class="btn-group btn-group-xs filter-option">' +
                '<button class="btn btn-danger btn-alt remove">' +
                    '<i class="fa fa-times"></i>' +
                '</button>' +
                '<button class="filter-data-value btn" style="cursor: auto">' + data.name + '</button>' +
            '</div>'
        ).data('data', data);
        var $btn_close = $option.find('.remove');
        if(!data.removable)
            $btn_close.remove();
        else
            $btn_close.click(function () {
                var $filter = $(this).closest('.filter');
                var filter = $filter.data('data');
                $(this).closest('.btn-group').remove();
                if($filter.find('.filter-option').length === 0){
                    if(filter.default_filters.length === 0 && filter.default_label !== null)
                        that._add_filter_option($filter, {
                            id: 0,
                            name: filter.default_label,
                            removable: false
                        });
                    else{
                        $.each(filter.default_filters, function (i, filter) {
                            that._add_filter_option($filter, filter)
                        });
                    }
                    $clean.hide('fast');
                }else{
                    $clean.show('fast');
                }
                if(that.options.on_apply)
                    that._show_apply_button();
                else
                    that.options.refresh();
            });
        $filter.find('.selected_filters').append($option);
    },
    _get_filter_options_selected: function ($filter) {
        var result = [];
        $filter.find('.filter-option').each(function (i, option) {
            var option_data = $(option).data('data');
            result.push(option_data.id);
        });
        return result;
    },
    _get_data_filters: function () {
        var that = this;
        var result = {};
        $(this.element).find('.filter').each(function (i, filter) {
            var filter_data = $(filter).data('data');
            var value = that._get_filter_options_selected($(filter));
            if(value.length !== 0)
                result[filter_data.name] = value
        });
        return result;
    },
    _show_apply_button: function () {
        $(this.element).find('.apply').show('fast');
    },
    _hide_apply_button: function () {
        $(this.element).find('.apply').hide('fast');
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});