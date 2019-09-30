$.widget("ui.jSidebar", {
    options: {
        height: '400px',
        connection: {
            url: "",
            command: "",
            data: {},
            response: function (data) {
                return data;
            }
        },
        toolbar:{
            name: "toolbar",
            show: false,
            active_deactive: {
                show: false,
                name: "desactivados"
            },
            buttons: [],
        },
        item:{
            toolbar:{
                name: "item_toolbar",
                show: function () {
                    return false;
                },
                refresh: {
                    show: function(){
                        return false;
                    },
                },
                buttons: function () {
                    return [];
                },
            },
            structure: function (data) {
                return data;
            },
            functions: {
                actions: null,
                on_first_click: null,
                on_click: null,
                on_show: null
            }
        },
        data: null,
        item_list: null
    },
    add_item: function(item){
        this._add_item(item);
    },
    update_item: function($item, new_item){
        this._add_item(new_item, $item);
        this.remove_item($item);
    },
    update_item_list: function (connection){
        this._clean();
       connection = $.extend(this.options.connection, connection);
       this._add_item_list(connection);
    },
    _create: function () {
        this._initialize();
        this._add_toolbar();
        this._add_item_list(this.options.connection);
    },
    _initialize: function () {
        $(this.element).addClass('jsidebar').append('<div class="row">' +
            '<div class="col-md-3 "><div class="sidebar"><ul class="list-group"></ul></div></div>' +
            '<div class="col-md-9 "><div class="container-fluid"></div></div>' +
            '</div>'
        );
        if(this.options.toolbar.show) {
            $(this.element).prepend('<div class="toolbar"></div>');
        }
    },
    _clean: function (){
        $(this.element).find('.sidebar ul').empty();
        $(this.element).find('.container-fluid').empty();
    },
    _add_item_list: function (connection) {
        var that = this;
        var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
        if(this.options.item_list) {
            $.each(this.options.item_list, function (index, item) {
                if (item.code) {
                    if (!(item.code in subpermissions))
                        return;
                }
                that._add_item(item);
            });
        }else{
            var deactive = $(this.element).find('[name="deactive"]').data("val");
            connection.data.deactive = deactive;
            $.jAjaxRequestManager({
                url: connection.url,
                command: connection.command,
                data:connection.data,
                waitingAnimation:{
                    element: $(this.element)
                },
                onSuccess: function (resp) {
                    resp = connection.response(resp);
                    $.each(resp, function (index, item) {
                        item = that.options.item.structure(item);
                        that._add_item(item);
                    });

                }
            })
        }
    },
    _add_toolbar: function(){
        var that = this;
        var toolbar = this.options.toolbar;
        if(this.options.toolbar.show) {
            if(this.options.toolbar.active_deactive.show){
                toolbar.buttons.push({
                    name: "deactive",
                    label: "",
                    type: 'danger',
                    class: 'pull-right',
                    icon: "fa fa-circle-o",
                    validation: function () {
                        $(this).data("val", false);
                    },
                    action: function () {
                        var status = $(this).data("val");
                        if (status)
                            $(this).data("val", false)
                                .find('i')
                                .addClass('fa-circle-o')
                                .removeClass('glyphicon glyphicon-remove-circle');
                        else
                            $(this).data("val", true)
                                .find('i')
                                .removeClass('fa-circle-o')
                                .addClass('glyphicon glyphicon-remove-circle');
                        that.update_item_list();

                    }
                });
            }
            var $toolbar = $(this.element).find('.toolbar ').jButtonGroup({
                buttons: toolbar.buttons
            });
            $(this.element).prepend($toolbar);
        }

    },
    _create_panel: function (item) {
        var toolbar = this.options.item.toolbar;
        var $panel = $('<div class="sidebar-panel" name="' + item.name + '_panel"></div>');
        $panel.hide();
        if (toolbar.show(item.data))
            this._add_item_toolbar($panel,item);

        return $panel;
    },
    _add_item: function(item, $prev_item){
        var $ul = $(this.element).find('.sidebar ul').first();
        var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
        item = this._validate_item(item);
        if(item.code){
            if($.isArray(item.code)){
                for(var i = 0; i < item.code.length; i++){
                    if(item.code[i] in subpermissions)
                        break;
                }
            } else if(!(item.code in subpermissions))
                return;
        }
        var $item = this._create_item(item);
        if($prev_item)
            $prev_item.after($item);
        else
            $ul.append($item);

        if(item.open){
            if((item.item_list).length > 0)
                $item.find('.item').first().click();
            else
                $item.click();
        }
        // if(item.open){
        //     $item.click();
        // }


    },
    remove_item: function($item){
        var $container = $(this.element).find('.container-fluid');
        var item_options = $item.data('item_options');
        var $panel = $container.find('[name="' + item_options.name + '_panel"]').first();
        $item.remove();
        $panel.remove();
    },
    _create_item: function (item) {
        var $item;
        var that = this;
        var $container = $(this.element).find('.container-fluid ')
        if (item.item_list.length > 0) {
            $item = $('<li class="list-group-item  ' + item.name + ' " >' +
                '<div class="row">' +
                '<div class="col-xs-12 item">' +
                '<i class="fa-lg ' + item.icon + '"></i> ' +
                '<span>' + item.label + '</span>' +
                '</div>' +
                '</div>' +
                '</li>');
            var $child = $(
                '<div class="col-xs-12 childs">' +
                '<ul class="list-group"></ul>' +
                '</div>'
            ).hide();
            $item.find('.row').append($child);
            var $ul_child = $child.find('ul');
            $.each(item.item_list, function (i, child) {
                child = that._validate_item(child);
                var $sub = that._create_item(child);
                $item.data('item_options', child);
                $ul_child.append($sub);
                if(child.open)
                    $sub.click();
            });
        } else {
            $item = $('<li class="list-group-item ' + item.name + ' " >' +
                '<i class="fa-lg ' + item.icon + '"></i> ' +
                '<span>' + item.label + '</span>' +
                '</li>');
            var $panel = that._create_panel(item);
            if($.isFunction(that.options.item.functions.actions)){
                var $button = $('<button type="button" class="btn btn-default actions" style="margin-right: 10px"><i class="fa fa-bars"></i></button>');
                $button.on('click', function (e) {
                    e.stopPropagation();
                    $(this).jPopover({
                        container: $('body'),
                        position: 'right',
                        title: "<center>Acciones</center>",
                        buttons: that.options.item.functions.actions.call($item, item.data, $panel)
                    });
                });
                $item.prepend($button)
            }
            $container.append($panel);
        }
        $item.data('item_options', item);
        this._set_events($item);
        return $item;
    },
    _add_item_toolbar: function($panel,item){
        var that = this;
        var toolbar = this.options.item.toolbar;
        var $toolbar = $('<div class="toolbar"></div>');
        var buttons = toolbar.buttons(item.data);
        if(toolbar.refresh.show(item.data)){
            buttons.push({
                name: 'refresh',
                class: 'pull-right',
                icon: "fa fa-refresh",
                action: function () {
                    that.update_panel(item);
                }
            });
        }
        if(toolbar.buttons)
            $toolbar.jButtonGroup({
            buttons: buttons
        });
        $panel.prepend($toolbar);

    },
    _set_events: function ($item) {
        var $container = $(this.element).find('.container-fluid');
        var $sidebar = $(this.element).find('.sidebar');
        var $childs = $item.find('.childs').first();
        $item.find('.item').first().on('click', function () {
            var $item = $(this).closest('li');
            var item_options = $item.data('item_options');
            var $childs = $item.find('.childs').first();
            if ($childs.length !== 0) {
                var opened = $(this).hasClass('open-icon');
                if (opened) {
                    $item.removeClass('open_with_children');
                    $(this).removeClass('open-icon');
                    $childs.hide('fast');
                } else {
                    $item.addClass('open_with_children');
                    $(this).addClass('open-icon');
                    $childs.show('fast');

                }
            }
            if ($.isFunction(item_options.on_click))
                item_options.on_click.call($(this),item_options);
        });
        if ($childs.length == 0){
            var item_options = $item.data('item_options');
            var $panel = $container.find('[name="' + item_options.name + '_panel"]');
            $item.on('click', function () {
                var that = this;
                $sidebar.find('.list-group-item').removeClass('active');
                $(this).addClass('active');
                if(!$panel.is(':visible'))
                    $container.find('.sidebar-panel').hide(0, function () {
                        $panel.show(10,function () {
                            if ($.isFunction(item_options.on_first_click) && item_options.first ) {
                                item_options.on_first_click.call($(that), item_options, $panel);
                                item_options.first = false;
                            }
                        });
                    });
                if ($.isFunction(item_options.on_click) && !item_options.first)
                    item_options.on_click.call($(this),item_options, $panel);
            });
            if ($.isFunction(item_options.on_show)){
                $sidebar.find('.list-group-item').removeClass('active');
                $item.addClass('active');
                if(!$panel.is(':visible'))
                    $container.find('.sidebar-panel').hide(0, function () {
                        $panel.show(0);
                    });
                item_options.on_show.call($(this),item_options, $panel);
            }
        }


    },
    _validate_item: function (item) {
        return $.extend(true, {
            name: "item",
            label: "Elemento",
            open: false,
            icon: "fa fa-leaf",
            data: {},
            item_list: [],
            first: true,
            on_click: null,
            on_first_click: null,
            on_show: null,
        }, this.options.item.functions, item);
    },
    _add_refresh_button: function ($panel,item) {
        var that = this;
        var toolbar = item.toolbar;
        var $toolbar = $panel.find('.toolbar ');
        var $button = $.button({
            name: toolbar.refresh.name,
            class: 'pull-right',
            icon: "fa fa-refresh",
            action: function () {
                console.log('that',that);
                console.log('$(that.element)',$(that.element));
                // $(that.element).jSidebar('update_panel',this.options);
                // $jsidebar.jSidebar('update_panel',item);

            }
        });
        $toolbar.append($button);
    },
    update_panel: function(item){
        var $container = $(this.element).find('.container-fluid').first();
        var $panel = $container.find('[name="' + item.name + '_panel"]').first();
        $panel.remove();
        $panel = this._create_panel(item);
        $container.append($panel);
        $panel.show();
        if ($.isFunction(item.on_first_click)) {
            item.on_first_click.call($(this), item, $panel);
        }
        if ($.isFunction(item.on_click) && !item.first)
            item.on_click.call($(this),item, $panel);
        if ($.isFunction(item.on_show))
            item.on_show.call($(this),item, $panel);
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});