$.widget("ui.jmultiselect_input", {
    options: {
        type: 'default',
        remove_btn: true,
        data_to_render: false,
        on_click: function (list) {
        },
        on_remove: function (data) {
        },
        remove_position: 'start',
        only_ids: false,
        actions: false,
        sort: false
    },
    refresh: function(){
        this._refresh();
    },
    add_list: function(list, prev){
        prev = !(prev === undefined);
        var $input = $(this.element);
        var value = $input.data('val') || {};
        $input.trigger('clean-validation');
        $.each(list, function (i, data) {
            data.i = data.i || i + 1;
            data._guid = $.get_guid();
            var id = data.id ? data.id : data._guid;
            value[id] = {
                action: prev ? 'prev' : 'add',
                value: data,
            };
        });
        $input.data('val', Object.keys(value).length === 0 ? undefined : value);
        this._set_input_label($input, value);
        this._refresh();
    },
    _create: function () {
        this._initialize();
        this._set_action_event();
        this._set_add_list_function();
    },
    _initialize: function () {
        var $input = $(this.element).data('multiselect', true);
        $input.addClass('multiselect-input').prop('readonly', true);
        var $input_group = $input.wrap('<div class="input-group" style="width: 100%"></div>').parent();
        $input_group.prepend(
            '<span class="input-group-btn" >' +
            '<button class="btn btn-' + this.options.type + ' action">' +
            '<i class="fa fa-plus" style="padding: 3px"></i>' +
            '</button>' +
            '</span>'
        ).after(
            '<table class="table table-bordered table-condensed text-center multiselect-table-list" style="margin-bottom: 0;">' +
            '<tbody class="multiselect-list"></tbody>' +
            '</table>'
        );
    },
    _refresh: function(){
        var that = this;
        var $input = (this.element);
        var $container = $input.closest('.input-group').parent();
        var value = $input.data('val') || {};
        var list = Object.values(value);
        var $list = $container.find('.multiselect-list');
        $list.empty();
        if(that.options.sort)
            list.sort(that.options.sort);
        $.each(list, function (i, obj) {
            if(obj.action !== 'remove')
                that._add_row_to_list($input, obj.value);
        });
    },
    _set_action_event: function () {
        var that = this;
        var $input = $(this.element);
        var $container = $(this.element).closest('.input-group').parent();
        $container.find('.action').click(function () {
            var list = $input.data('val') || {};
            that.options.on_click.call($input, list);
        }).data('multiselect', true);
    },
    _set_add_list_function: function () {
        var that = this;
        $.fn._multiselect_add_list = function (list, prev) {
            prev = !(prev === undefined);
            if (!$(this).data('multiselect')) {
                console.error('The element not initializing with jmultiselect_input');
                return;
            }
            var $container = $(this).closest('.input-group').parent();
            var $input = $('.multiselect-input', $container);
            var value = $input.data('val') || {};
            $input.trigger('clean-validation');
            $.each(list, function (i, data) {
                data.i = data.i || i + 1;
                data._guid = $.get_guid();
                var id = data.id ? data.id : data._guid;
                value[id] = {
                    action: prev ? 'prev' : 'add',
                    value: data,
                };
                that._add_row_to_list($input, data);
            });
            $input.data('val', Object.keys(value).length === 0 ? undefined : value);
            that._set_input_label($input, value);
        };
    },
    _add_row_to_list: function($input, data){
        var that = this;
        var $container = $input.closest('.input-group').parent();
        var options = $input.jmultiselect_input('option');
        var data_to_render = [{
            value: data.name
        }];
        if (options.data_to_render)
            data_to_render = options.data_to_render.call($input, data);
        var $row = $('<tr class="multiselect-row"></tr>').data('data', data);
        $container.find('.multiselect-list').append($row);
        var $remove = $(
            '<td class="remove">' +
            '<i class="fa fa-times"></i>' +
            '</td>');
        $remove.click(function () {
            var $container = $(this).closest('.form-group');
            var $input = $('.multiselect-input', $container);
            $(this).closest('tr').hide('fast', function () {
                var data = $(this).data('data');
                var id = data.id ? data.id : data._guid;
                var value = $input.data('val');
                options.on_remove.call(this, data);
                $input.trigger('clean-validation');
                $(this).remove();
                if (value[id])
                    if (value[id].action === 'prev')
                        value[id].action = 'remove';
                    else
                        delete value[id];
                else
                    value[id] = {
                        action: 'remove',
                        value: data
                    };
                that._set_input_label($input, value);
            });
        });
        $.each(data_to_render, function (i, obj) {
            var $cell = $('<td>' + obj.value + '</td>');
            if(obj.actions){
                $cell.click(function () {
                    var data = $(this).closest('.multiselect-row').data('data');
                    $(this).jPopover({
                        container: obj.actions.container,
                        position: obj.actions.position,
                        title: "<center>" + obj.actions.title + "</center>",
                        buttons: obj.actions.buttons(data)
                    });
                }).html('<i class="fa fa-bars">').addClass('actions');
            }
            if (obj.cell_style)
                $cell.prop('style', obj.cell_style);
            if (obj.width)
                $cell.css('width', obj.width);
            $row.append($cell)
            if (obj.set_cell_events)
                obj.set_cell_events.call($cell, data);
        });
        if (options.set_row_events)
            options.set_row_events.call($row, data);
        if (options.remove_position === 'start')
            $row.prepend($remove);
        else if (options.remove_position === 'end')
            $row.append($remove);
    },
    _set_input_label: function ($input, list) {
        var counter = 0;
        $.each(list, function (i, item) {
            if (item.action === 'add' || item.action === 'prev')
                counter++;
        });
        if (counter === 0)
            $input.val('Ningún elemento seleccionado');
        else if (counter === 1)
            $input.val('1 elemento seleccionado');
        else
            $input.val(counter + ' elementos seleccionados');
    },
    _validate_method_to_use: function ($element, method_name) {
        var methods = $element.data('public_methods') || [];
        if(!($.inArray(method_name, methods) !== -1)){
            console.error('This element can\`t use this method');
            return false;
        }
        return true;
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});