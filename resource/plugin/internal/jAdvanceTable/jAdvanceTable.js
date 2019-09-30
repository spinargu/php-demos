$.widget("ui.jAdvanceTable",{
	options: {
		toolbar:{
			name: "toolbar",
			show: false,
            class: "",
            customContent: null,
			buttons: null,
			actions: {
				show: false,
				buttons: null
			},
			active_deactive:{
				show:false,
				name: 'is_active',
				action: function () {
                }
			},
			add_remove:{
				show: false,
				name: 'is_vote',
				action: function () {
                }
			},
			search: {
				show: false,
				auto_search: false,
				title: "Búsqueda Avanzada",
				onInit: {
					showPanel: false,
					showButton: true
				},
				buttons:{
					close: true
				},
                fields: null
			},
            filters: {
                show: false,
				array: false,
                buttons:[]
            },
			callback: null
		},
		table: {
            height: '80%',
			connection: {
				url: null,
				command: null,
				data: null,
				response: function (data) {
                    return data;
                }
			},
			message: {
				loading: "Cargando registros, espere por favor...",
				recordsPerPage: "%1 registros por página.",
				showingRows: "Mostrando %1 a %2 de %3 filas.",
				search: "Búsqueda rápida",
				noMatches: "No se encontraron registros",
				allRows: "Todos"
			},
			columns: [],
			actions: {
                title: 'Opciones',
                btnPosition: 'left',
                popoverPosition: 'right',
                show: true,
                validate_show: function () {
                    return true;
                },
                buttons: []
			},
			options: {
                height: '100%',
                classes: 'table',
				trimOnSearch: false,
				striped: true,
				pagination: true, 
				pageSize: 50,
				pageList: [50, 100, 150, 200],
				search: true, 
				showColumns: false,
				showRefresh: true, 
				showToggle: false,
				idField: "id",
                uniqueId: "id",
				method: 'post',
				contentType: "application/x-www-form-urlencoded"
			}
		}
	},
	get_data_to_filter: function () {
        var data = {};
        var options = this.options;
        var toolbar = options.toolbar;
        var connection = options.table.connection;

        if (toolbar.show && toolbar.search.show)
            $.extend(data, this.get_search_data());
        if (toolbar.show && toolbar.filters.show)
            $.extend(data, this.get_filter_data());
        if(toolbar.show && toolbar.active_deactive.show){
            var active_deactive = $(this.element)
                .closest('.bootstrap-table')
                .find('[name="' + toolbar.active_deactive.name + '"]')
                .data('val');
            data[toolbar.active_deactive.name] = active_deactive === undefined ? true : active_deactive;
        }
        if(toolbar.show && toolbar.add_remove.show){
            var add_remove = $(this.element)
                .closest('.bootstrap-table')
                .find('[name="' + toolbar.add_remove.name + '"]')
                .data('val');
            data[toolbar.add_remove.name] = add_remove === undefined ? true : add_remove;
        }
        if ($.isFunction(connection.data))
            data = connection.data(data);
        return data;
    },
	get_search_data: function () {
		var data;
		var options = this.options;
		var $table = $(this.element).closest('.bootstrap-table');
		if (options.toolbar.show && options.toolbar.search.show)
			data = $('.field-container', $table).jForm('getData').data;
		return data;
	},
    get_filter_data: function () {
		var that = this;
        var $table = $(this.element).closest('.bootstrap-table');
        var result = {};
        $.each(this.options.toolbar.filters.buttons, function (i, filter) {
            var $btn_filter = $table.find('[name="' + filter.name + '"]');
			var value = undefined;
            if(that.options.toolbar.filters.array){
                var $row_filter = $btn_filter.closest('tr');
                var storage = [];
                value = [];
                if(!$btn_filter.is(':visible') && filter.on_hide_value)
                	$.each(filter.on_hide_value, function (i, val) {
                        value.push(val);
                    });
                else
                    $row_filter.find('.filter').each(function (i, $filter) {
                        var data = $($filter).data('data');
                        if(data.id !== 0){
                            storage.push(data);
                            value.push(data.id);
                        }
                    });
                if($row_filter.data('locked')){
                	if(storage.length === 0)
                        sessionStorage.removeItem(window.location.search +'_' + filter.name);
                    else
                        sessionStorage.setItem(window.location.search +'_' + filter.name, JSON.stringify(storage));
                }
                result[filter.name] = value.length === 0 ? undefined : value;
            }else{
                if(!$btn_filter.is(':visible') && filter.on_hide_value)
                    value = filter.on_hide_value;
                else
					value = $btn_filter.data('val');
                result[filter.name] = value;
            }
        });
        return result;
    },
    get_filter_data_by_button: function ($button) {
        var value = null;
        if(!$button.is(':visible'))
            return value;
        if(this.options.toolbar.filters.array){
            var $row_filter = $button.closest('tr');
            value = [];
            $row_filter.find('.filter').each(function (i, $filter) {
                var data = $($filter).data('data');
                if(data.id !== 0)
                    value.push(data.id);
            });
            value = value.length === 0 ? null : value;
        }else{
            value = $button.data('val');
        }
        return value;
    },
	refresh: function () {
		$(this.element).bootstrapTable('refresh');
    },
	add_filter_data: function ($button, list) {
		var that = this;
		var $row = $button.closest('tr');
        var $selected = $row.find('.selected_filters');
		var $clean = $row.find('.filter-clean');
        var button = $button.data('data');
        $selected.empty();
        if(list.length === 0) {
            that._add_button_selected_filter($selected, {
                id: 0,
                name: button.all_name,
                removable: false
            });
            $clean.hide('fast');
        }else{
            $.each(list, function (i, filter) {
            	if(filter.removable === undefined)
                    filter.removable = true;
                that._add_button_selected_filter($selected, filter)
            });
            $clean.show('fast');
        }
    },
	get_element_by_name: function(name){
        var $table = $(this.element).closest('.bootstrap-table');
        return $table.find('[name="' + name + '"]');
	},
	_create: function () {
        var that = this;
        var options = this.options;
        var toolbar = options.toolbar;
        var connection = options.table.connection;
        var message = options.table.message;
        var tableOptions = options.table.options;
        var toolbarName = "#" + toolbar.name;
        if (options.table.actions.show)
            this._addActionColumn();
        if (options.toolbar.show)
            this._addToolbar();
        else
            toolbarName = "";
        var one = true;
        if(tableOptions.customSearch)
            window[tableOptions.customSearch] = tableOptions.customSearch;
        $(this.element).bootstrapTable($.extend({
            toolbar: toolbarName,
            url: connection.url,
            queryParams: function () {
                var data = {};
                if(one){
					one = false;
                    if (toolbar.show && toolbar.search.show)
                        that._addSearch();
                    if (toolbar.show && toolbar.filters.show)
                        that._addFilters();
                    if (toolbar.show && toolbar.active_deactive.show)
                        that._add_active_deactive_button();
                    if (toolbar.show && toolbar.add_remove.show)
                        that._add_add_remove_button();
                }
                if (toolbar.show && toolbar.search.show)
                	$.extend(data, that.get_search_data());
                if (toolbar.show && toolbar.filters.show)
                    $.extend(data, that.get_filter_data());
                if(toolbar.show && toolbar.active_deactive.show){
                    var active_deactive = $(that.element)
                        .closest('.bootstrap-table')
                        .find('[name="' + toolbar.active_deactive.name + '"]')
                        .data('val');
                    data[toolbar.active_deactive.name] = active_deactive === undefined ? true : active_deactive;
                }
                if(toolbar.show && toolbar.add_remove.show){
                    var add_remove = $(that.element)
                        .closest('.bootstrap-table')
                        .find('[name="' + toolbar.add_remove.name + '"]')
                        .data('val');
                    data[toolbar.add_remove.name] = add_remove === undefined ? true : add_remove;
                }
                if ($.isFunction(connection.data))
                    data = connection.data(data);
                if(!data)
                	return false;
                setTimeout(function () {
                    $(that.element).bootstrapTable('showLoading');
                }, 0);
                return {
                    command: connection.command,
                    data: data
                }
            },
            responseHandler: function (data) {
                $(that.element).bootstrapTable('hideLoading');
            	if(data.status === "500"){
                    $.jNotification({
                        type: 'danger',
                        icon: 'fa fa-warning',
                        message: 'Ha ocurrido un error al obtener los datos de la tabla'
                    });
            		console.error(data.message)
					return	[];
				}
                return connection.response(data.data);
            },
            onLoadError: function (status, res) {
            	if(res.statusText === 'abort')
            		return;
            	$.jNotification({
					type: 'danger',
					icon: 'fa fa-warning',
					message: 'Ha ocurrido un error al obtener los datos de la tabla'
				});
            	console.error(res);
            },
            formatLoadingMessage: function () {
                return message.loading;
            },
            formatRecordsPerPage: function (pageNumber) {
                return message.recordsPerPage.replace("%1", pageNumber);
            },
            formatShowingRows: function (pageFrom, pageTo, totalRows) {
                return message.showingRows
                    .replace("%1", pageFrom)
                    .replace("%2", pageTo)
                    .replace("%3", totalRows);
            },
            formatSearch: function () {
                return message.search;
            },
            formatNoMatches: function () {
                return message.noMatches;
            },
            formatAllRows: function () {
                return message.allRows;
            },
            columns: options.table.columns
        }, tableOptions))
		if($(this.element).closest('.modal').lenght == 0)
			$(this.element).closest('.fixed-table-container').css({
				'height': options.table.height
			});
        else
            $(this.element).closest('.fixed-table-body').css({
                'height': options.table.height
            });
	},
	_addActionColumn: function () {
		var that = this;
		var actions = this.options.table.actions;
        var validate_show = actions.validate_show;
		var actionColumn =  {
		    field: 'actions',
			width: 50,
			halign: "center", 
			align: "center",
			valign: "middle",
            rowspan: actions.rowspan,
            cellStyle: function (value, row, index, field) {
                return {
                    css: {"padding": "0 !important"}
                };
            },
			formatter: function(value, row, index) {
			    var show = validate_show(row);
                if (!show)
                    return '';
				return  '<button type="button" class="btn btn-default actions"><i class="fa fa-bars"></i></button>';
			},
			events:{
				'click .actions': function (e, value, row, index) {
					e.stopPropagation();
                    $(this).jPopover({
                        container: $(that.element).closest('.fixed-table-body'),
                        position: actions.popoverPosition,
                        title: "<center>" + actions.title + "</center>",
                        buttons: actions.buttons.call($(this),row,index)
                    });
				}
			}
		};
		if (this.options.table.columns === null)
			this.options.table.columns= [];
		if (actions.btnPosition === "left")
			if(actions.rowspan)
				this.options.table.columns[0].unshift(actionColumn);
			else
				this.options.table.columns.unshift(actionColumn);
		else
			if(actions.rowspan)
        		this.options.table.columns[0].push(actionColumn);
    		else
				this.options.table.columns.push(actionColumn);
	},
	_addToolbar: function () {
		var toolbar = this.options.toolbar;
		if (toolbar.buttons === null)
			toolbar.buttons = [];
		if (toolbar.search.show)
			toolbar.buttons.unshift({
				name: "search",
				icon: 'fa fa-search',
				show: toolbar.search.onInit.showButton,
				action: function () {
				    var $table = $(this).closest('.bootstrap-table');
					$('.search-container', $table).toggle('fast', function () {
						if ($(this).is( ":visible" ))
							$(this).trigger('onShow');
						else
							$(this).trigger('onHide');
					});    
				}
			});
		if (toolbar.actions.show) {
            if (toolbar.actions.btnPosition == 'left')
                toolbar.buttons.unshift({
                    nombre: "actions",
                    icon: "fa fa-bars",
                    action: function () {
                        $(this).jPopover({
                            container: $('body'),
                            position: 'right',
                            title: "<center>Acciones</center>",
                            buttons: toolbar.actions.buttons
                        });
                    }
                });
            else
                toolbar.buttons.push({
                    nombre: "actions",
                    icon: "fa fa-bars",
                    action: function () {
                        $(this).jPopover({
                            container: $('body'),
                            position: 'right',
                            title: "<center>Acciones</center>",
                            buttons: toolbar.actions.buttons
                        });
                    }
                });

        }
		var $toolbar = $('<div id="' + toolbar.name + '"></div>').jButtonGroup({
            class: toolbar.class,
            buttons: toolbar.buttons
        });
        $(this.element).before($toolbar);
        if ($.isFunction(this.options.toolbar.customContent)) {
            this.options.toolbar.customContent.call($toolbar);
        }
    },
	_addSearch: function () {
		var that = this;
		var $table = $(this.element).closest('.bootstrap-table');
		var toolbar = this.options.toolbar;
		var $toolbar = $('.fixed-table-toolbar', $table);
		var $searchContainer = $(
			'<div class="row search-container">'+
				'<div class="col-xs-12">'+
					'<div class="panel panel-primary" style="margin-bottom: 5px;">'+
						'<div class="panel-heading">'+
							'<h5 class="panel-title">' + toolbar.search.title + '</h5>'+
						'</div>'+
						'<div class="panel-body" style="padding-bottom: 0;">'+
							'<div class="field-container"></div>'+
						'</div>'+
						'<div class="panel-footer" style="text-align: right"></div>'+
					'</div>'+
				'</div>'+
			'</div>'
		).bind('onShow', function() {
			$('.search', $table).hide('fast');
			$('.search input', $table).val('').keyup();
		}).bind('onHide', function() {
			$('.search', $table).show('fast');
            $('.field-container', $table).jForm('clean');
			$(that.element).bootstrapTable("refresh");
		}).bind('on_clean', function() {
            $('.field-container', $table).jForm('clean');
			$(that.element).bootstrapTable("refresh");
		});
		if (!toolbar.search.onInit.showPanel)
			$searchContainer.hide();
		if(!toolbar.search.auto_search)
			$('.panel-footer', $searchContainer).append(
				$.button({
					name: "buscar",
					type: "success",
					label: "Buscar",
					style: "margin-left: 10px",
					icon: "fa fa-search",
					action: function () {
						$(that.element).bootstrapTable("refresh");
					}
				})
			);
		if (toolbar.search.buttons.close)
			$('.panel-footer', $searchContainer).prepend(
				$.button({
					name: "cerrar",
					type: "danger",
					label: "Cerrar",
                    icon: "fa fa-times",
					action: function () {
                        $searchContainer.hide("fast").trigger('onHide');
                    }
				})
			);
        if (toolbar.search.buttons.clean)
            $('.panel-footer', $searchContainer).prepend(
                $.button({
                    name: "clean",
                    type: "info",
                    label: "Limpiar",
                    icon: "mdi mdi-broom",
                    action: function () {
                        $searchContainer.trigger('on_clean');
                    }
                })
            );
        var time_to_search;
        $.each(this.options.toolbar.search.fields, function (i, field) {
			if(toolbar.search.auto_search){
                field.onKeyUp = function () {
                	clearTimeout(time_to_search);
					time_to_search = setTimeout(function () {
                        $(that.element).bootstrapTable("refresh");
                    }, 1500)
                };
			}
        })
        $('.field-container', $searchContainer).jForm({
			elements: this.options.toolbar.search.fields
        });
		$toolbar.after($searchContainer).wrap('<div class="row"><div class="col-xs-12"></div></div>');
		if ($.isFunction(toolbar.callback))
			toolbar.callback.call($toolbar);
	},
    _addFilters: function () {
		var that = this;
        var $table = $(this.element).closest('.bootstrap-table');
        var toolbar = this.options.toolbar;
        var $toolbar = $('.fixed-table-toolbar', $table);
		var $filter_table = $(
            '<div class="row jadvancetable-filters" style="margin-bottom: 10px">' +
				'<div class="col-xs-12">' +
					'<table class="table table-bordered table-condensed" >' +
						'<tr>' +
							'<th colspan="3" class="text-center">Filtros</th>' +
						'</tr>' +
					'</table>'+
            	'</div>' +
            '</div>'
		);
		var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
		$.each(toolbar.filters.buttons, function(index, button) {
			button = $.extend({
				show: true,
                icon: 'fa fa-search',
                class: 'btn-sm',
                all_name: 'Todos',
                removable: true,
                default_filters: []
			}, button);
			if(button.show === false)
				return;
			if(button.code){
				if(!(button.code in subpermissions))
					return;
			}
            var $row = $(
				'<tr>' +
					'<td class="btn-container" style="padding: 0 !important; vertical-align: middle">' +
						'<div class="btn-group btn-group-sm" style="display: flex">' +
							'<button class="btn btn-danger filter-clean">' +
								'<i class="fa fa-times"></i>' +
							'</button>' +
							'<button name="' + button.name + '" class="btn btn-primary filter-options" style="width: 100%">' +
                				'<i class="fa fa-search" style="margin-right: 3px"></i>' + button.label +
							'</button>' +
						'</div>' +
					'</td>' +
					'<td class="selected_filters" style="width: 100%; padding: 0 0 5px 0 !important;"></td>' +
					'<td class="lock-filter" style="cursor:pointer;">' +
						'<i class="fa fa-unlock"></i>' +
					'</td>' +
				'</tr>'
			).data('locked', false);
            var $selected = $row.find('.selected_filters');
            $row.find('.filter-options').click(function () {
				button.action.call(this);
            }).data('data', button);
            $row.find('.filter-clean').click(function () {
                $selected.empty();
                if(button.default_filters.length === 0)
                    that._add_button_selected_filter($selected, {
                        id: 0,
                        name: button.all_name,
                        removable: false
                    });
                else{
                    $.each(button.default_filters, function (i, filter) {
                        that._add_button_selected_filter($selected, filter)
                    });
                }
                that.refresh();
                $(this).hide('fast');
            }).hide();
            $row.find('.lock-filter').click(function () {
                var $row = $(this).closest('tr');
                var locked = $row.data('locked');
                that._set_lock_state($(this), !locked);
            });

            $filter_table.find('table').append($row);
            if(button.default_filters.length === 0)
                that._add_button_selected_filter($selected, {
                    id: 0,
                    name: button.all_name,
                    removable: false
                });
			else{
            	$.each(button.default_filters, function (i, filter) {
                    that._add_button_selected_filter($selected, filter)
                });
			}
			if(sessionStorage.getItem(window.location.search +'_' + button.name)){
				var list = JSON.parse(sessionStorage.getItem(window.location.search +'_' + button.name));
                that.add_filter_data($row.find('.filter-options'), list);
                that._set_lock_state($row.find('.lock-filter'), true);
            }

		});
		if($filter_table.find('tr').length !== 1)
        	$toolbar.after($filter_table).wrap('<div class="row"><div class="col-xs-12"></div></div>');
    },
    _add_button_selected_filter: function ($panel , data) {
		var that = this;
		var $row = $panel.closest('tr');
        var $clean = $row.find('.filter-clean');
		var $option = $(
            '<div class="btn-group btn-group-xs filter" style="margin: 5px 0 0 5px">' +
            	'<button class="btn btn-danger btn-close">' +
            		'<i class="fa fa-times" style="padding: 3px 0"></i>' +
            	'</button>' +
            	'<button class="filter-data-value ' + (data.id === 0 ? 'filter-data-value-all' : '') + ' btn" style="cursor: auto">'	 + data.name + '</button>' +
            '</div>'
		).data('data', data);
		var $btn_close = $option.find('.btn-close');
		if(!data.removable)
            $btn_close.remove();
		else
            $btn_close.click(function () {
            	var button = $row.find('.filter-options').data('data');
				$(this).closest('.btn-group').remove();
                if($panel.find('.filter').length === 0){
                    if(button.default_filters.length === 0)
                        that._add_button_selected_filter($panel, {
                            id: 0,
                            name: button.all_name,
                            removable: false
                        });
                    else{
                        $.each(button.default_filters, function (i, filter) {
                            that._add_button_selected_filter($panel, filter)
                        });
                    }
                    $clean.hide('fast');
                }else{
                    $clean.show('fast');
				}
				that.refresh();
            });
		$panel.append($option);
    },
    _add_active_deactive_button: function () {
		var that = this;
        var $table = $(this.element).closest('.bootstrap-table');
        var toolbar = this.options.toolbar;
        var $toolbar = $('.columns.columns-right.btn-group.pull-right', $table);
        if($toolbar.length === 0){
            $toolbar = $('<div class="columns columns-right btn-group pull-right"></div>');
            $table.find('.fixed-table-toolbar').append($toolbar);
        }
        var $button = $.button({
            name: toolbar.active_deactive.name,
            class: 'pull-right',
            icon: "fa fa-circle-o",
            action: function () {
                var status = $(this).data("val");
                if (status)
                    $(this).data("val", false)
                        .addClass('btn-danger')
                        .removeClass('btn-default')
                        .find('i')
                        .removeClass('fa fa-circle-o')
                        .addClass('glyphicon glyphicon-remove-circle');
                else
                    $(this).data("val", true)
                        .addClass('btn-default')
                        .removeClass('btn-danger')
                        .find('i')
                        .addClass('fa fa-circle-o')
                        .removeClass('glyphicon glyphicon-remove-circle');
                toolbar.active_deactive.action.call($(this), status, $(that.element));
                $(that.element).bootstrapTable('refresh');
            }
		}).data("val", true);
        $toolbar.append($button);
    },
	_set_lock_state: function($button, lock){
        var $row = $button.closest('tr');
        var filter =  $row.find('.filter-options').data('data');
        var storage = [];
        if(lock){
            $row.data('locked', true);
            $button.addClass('btn btn-danger')
                .find('i').removeClass('fa-unlock')
                .addClass('fa-lock');
            $row.find('.filter').each(function (i, $filter) {
                var data = $($filter).data('data');
                if(data.id !== 0){
                    storage.push(data);
                }
            });
            if(storage.length === 0)
                sessionStorage.removeItem(window.location.search +'_' + filter.name);
            else
                sessionStorage.setItem(window.location.search +'_' + filter.name, JSON.stringify(storage));

        }else {
            $row.data('locked', false);
            $button.removeClass('btn btn-danger')
                .find('i').removeClass('fa-lock')
                .addClass('fa-unlock');
            sessionStorage.removeItem(window.location.search +'_' + filter.name);
        }
	},
	_destroy: function() {
	  	this.options = {};
	}
});