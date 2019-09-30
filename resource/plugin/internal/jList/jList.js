$.widget("ui.jList",{
	options: {
		type: "default",
        title: null,
        subtitle: "",
		sortOnInit: true,
		invert: false,
        search: {
            label: "Buscar...",
            show: true
        },
        toolbar:{
            show: false,
            buttons: [],
            actions: {
                show: false,
                buttons: null
            },
            active_deactive:{
                show: false,
                name: 'is_active',
                action: function () {
                }
            },
        },
        height: '100%',
        data: [],
        connection: {
            url: "",
            command: "",
            data: {},
            response: function (data) {
                return data;
            }
        },
        element: {
            hideInfo:{
                show: false,
                structure: function (data) {
                    return $.noop();
                }
            },
            actions: {
                show: false,
                buttons: null
            },
			check: function () {
                return {
                    show: false
                };
            },
            click: null,
			select: {
            	show: false,
				action: function () {}
			},
            structure: function(element) {
				return {
					name: element.name,
					preIcon: {
						show: false,
						title: "",
						class: ""
					},
                    icon1: {
                        show: false,
                        title: "",
                        class: ""
                    },
                    icon2: {
                        show: false,
                        title: "",
                        class: ""
                    }
				}
			},
            add_data_to_element: function(data){},
		},
	},
    add_element:function(data){
	    var $element = this._create_element(data);
	    this._add_element($element);
    },
    update_element_by_guid: function(guid, data_for_update){
	    var $element_to_update = $(this.element).find('.jlist-row[guid="' + guid + '"]');
	    var element_data = $element_to_update.data('data');
	    var updated_data = $.extend(element_data, data_for_update);
        var $element_updated = this._create_element(updated_data);
        this._remove_element_by_guid(guid, function () {
            $(this).after($element_updated);
        });
    },
    remove_element_by_guid: function(guid, before_remove){
	    this._remove_element_by_guid(guid, before_remove);
    },
	update: function (options)     {
		var that = this;
		var $list = $(this.element).find('.list');
		this.clean_cache();
		if (options) {
			options.clean = options.clean === undefined ? true : options.clean;
			if (this.options.connection.url === "") {
				if (options.data)
					this.options.data = options.data;
			}else{
				if (options.connection)
					this.options.connection = $.extend(true, this.options.connection, options.connection);
			}
			if (options.title)
				$(this.element).find('.panel-title').text(options.title);
			if (options.element)
                this.options.element = $.extend(true, this.options.element, options.element);
		}
			if (options){
				if(options.clean)
					$list.empty();
				that._initializeElements();
			} else{
				$list.empty();
				that._initializeElements();
			}
	},
    get_selected_elements: function (get_elements) {
        var result = [];
        $(this.element).find('.jlist-row-check-selected').each(function (i, obj) {
            var $element = $(obj);
            if(get_elements)
                result.push($element);
            else
                result.push($element.data('data'));

        });
        return result;
    },
    get_not_selected_elements: function (get_elements) {
        var result = [];
        $(this.element).find('.list-group-item').not('.jlist-row-check-selected').each(function (i, obj) {
            var $element = $(obj);
            if(get_elements)
                result.push($element);
            else
                result.push($element.data('data'));

        });
        return result;
    },
    mark_element_as_selected: function($element){
        $(this.element).find('.jlist-row').each(function(i,el){
            $(el).removeClass('jlist-row-selected');
        });
        $element.addClass('jlist-row-selected');
    },
    mark_element_as_selected_by_guid:function($guid){
        $(this.element).find('.jlist-row').each(function(i,el){
            $(el).removeClass('jlist-row-selected');
            if($(el).data('data'))
            {
                if($(el).data('data').guid == $guid)
                    $(el).addClass('jlist-row-selected');
            }
        });
    },
    clean_cache: function(){
	    var connection = this.options.connection;
	    var reference = connection.url + '_' + connection.command;
        $.each(sessionStorage, function (name) {
            if(name.indexOf(reference) !== -1)
                sessionStorage.removeItem(name);
        })
    },

	_create: function () {
	    $(this.element).addClass('jList');
		this._initialize();
		this._initializeElements();
	},
    _initialize: function () {
		var that = this;
		var options = this.options;
		var $panel = $(
			'<div class="panel panel-' + options.type + '" style="margin: 0">'+
				'<div class="panel-heading">' +
					'<h3 class="panel-title text-center">' + options.title + '</h3>'+
				'</div>'+
				'<div class="toolbar"></div>'+
				'<div class="input-search-container">' +
					'<input type="text" class="form-control input-search" placeholder="' + options.search.label+ '">' +
				'</div>'+
				'<ul class="list-group list"></ul>'+
				'<div class="panel-footer"></div>'+
			'</div>'
		);
        if (options.subtitle !== "")
            $panel.find('.panel-heading').after(
                '<div class="panel-subtitle well well-sm text-center" style="margin: 0; border-radius: 0">' +
                    '<b>' + options.subtitle + '</b>' +
                '</div>'
            );
        $(this.element).addClass('jList').append($panel);
        $panel.find('.list').css('height', options.height);
        $panel.find('.input-search-container').css('display', options.search.show?'':'none');

        if(options.title === null)
        	$panel.find('.panel-heading').remove();
        if(options.toolbar.show)
            this._addToolbar($panel.find('.toolbar'));
        else
            $panel.find('.toolbar').hide();
		$panel.find('.input-search').keyup(function(event) {
			if (event.which === 13) {
				var $element = $panel.find('.list-group-item.visible').first();
				if ($element.length !== 0)
					$element.find('.select').trigger('select');
			}else{
				that._search();
			}
		});
	},
    _addToolbar: function ($toolbar) {
	    var that = this;
        var toolbar = this.options.toolbar;
        if (toolbar.actions.show)
            toolbar.buttons.unshift({
                name: "actions",
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
        if(toolbar.active_deactive.show)
            toolbar.buttons.push({
                name: "deactive",
                label: "",
                class: 'pull-right',
                icon: "fa fa-circle-o",
                validation: function () {
                    $(this).data("val", true );
                },
                action: function () {
                    var $list = $(this).closest('.jList');
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
                    toolbar.active_deactive.action.call($(this), !status, $(that.element));
                    var data = {};
                    data[toolbar.active_deactive.name] = !status;
                    $list.jList('update', {
                        connection: {
                            data: data
                        }
                    });
                }
            })
        $toolbar.jButtonGroup({
            buttons: toolbar.buttons
        });
    },
    _initializeElements: function () {
		var that = this;
		var options = this.options;
		if (options.connection.url === "") {
			this._processElements(options.data)
            setTimeout(function() {
                $(that.element).find('.input-search').focus();
            }, 500);
		}else{
            $.jAjaxRequestManager({
                url: options.connection.url,
                command: options.connection.command,
                data: options.connection.data,
                cache: options.connection.cache,
                waitingAnimation: {
                    element: $(this.element).find('.list'),
                    size: "fa-5x",
                    style: "padding: 30px;"
                },
                onSuccess: function (data) {
					data = options.connection.response.call($(that.element), data);
                    that._processElements(data)
                    setTimeout(function() {
                        $(that.element).find('.input-search').focus();
                    }, 500);
                }
            });
		}
	},
	_processElements: function (elements) {
		var that = this;
		$.each(elements, function(i, element) {
			var $element = that._create_element(element);
			that._add_element($element);
		});
        if (this.options.sortOnInit)
            this._sort();
        else
            this._setColor();
	},
	_create_element: function(data) {
		var that = this;
		var $list = $(this.element).find('.list');
		var options = this.options;
		var element = options.element.structure(data);
		if (!element)
			return;
        var check = options.element.check(data);
        if(!data.guid)
            data.guid = $.get_guid();
		var $element = $('<li class="jlist-row list-group-item visible" '+data.show+'  guid="' + data.guid + '">' +
							'<table style="width: 100%;">'+
								'<tr class="jList-row">'+
									'<td class="name">' + element.name + '</td>'+
								'</tr>'+
							'</table>'+
							'<div class="hiddenInfo"></div>'+
						'</li>').data('data', data).data('element', element);
        if (options.element.actions.show  || check.show)
            $element.find('.jList-row').prepend('<td><div class="btn-group" style="display: flex; padding-left: 10px;"></div></td>');
        if (options.element.actions.show)
            $element.find('.btn-group').prepend(
                '<button type="button" class="btn btn-default btn-sm actions">' +
                    '<i class="fa fa-bars"></i>' +
                '</button>'
            ).find('.actions').click(function (e) {
                e.stopPropagation();
                var data = $(this).closest('li').data('data');
                $(this).jPopover({
                    container: $list,
                    position: 'right',
                    title: "<center>Acciones</center>",
                    buttons: options.element.actions.buttons.call(this, data)
                });
            });
        //if(data.disable_on_select)
        $element.prop('id', btoa(data.id).replace('==',''))
        if (check.show){
            $element.find('.btn-group').prepend(
                '<button type="button" class="btn btn-default btn-sm jlist-checkbox">' +
                    '<i class="fa fa-square-o fa-lg"></i>' +
                '</button>'
            ).find('.jlist-checkbox').click(function (e) {
                e.stopPropagation();
                var disabled=$(this).prop('disabled');
                if(disabled)
                    return;

                var $li = $(this).closest('li');
                var set_check = !$li.hasClass('jlist-row-check-selected');
                if(set_check) {
                    $li.addClass("jlist-row-check-selected")
                        .find('.jlist-checkbox i')
                        .removeClass('fa-square-o')
                        .addClass('fa-check-square-o');

                }else {
                    $li.removeClass("jlist-row-check-selected")
                        .find('.jlist-checkbox i')
                        .addClass('fa-square-o')
                        .removeClass('fa-check-square-o');
                }
                that._process_disables($li,set_check);
            });
            if(check.selected)
                setTimeout(function () {
                    $element.find('.jlist-checkbox').click();
                }, 0)


        }
        if(element.preIcon && element.preIcon.show)
            $element.find('.jList-row').prepend(
                '<td class="preIcon">' +
                '<i title="' + (element.preIcon.title || "") + '" class="' + element.preIcon.class+ '"></i>'+
                '</td>'
            );
        if(element.icon1 && element.icon1.show)
            $element.find('.jList-row').append(
                '<td class="preIcon">' +
                '<i title="' + (element.icon1.title || "") + '" class="' + element.icon1.class+ '"></i>'+
                '</td>'
            );
        if(element.icon2 && element.icon2.show)
            $element.find('.jList-row').append(
                '<td class="preIcon">' +
                '<i title="' + (element.icon2.title || "") + '" class="' + element.icon2.class+ '"></i>'+
                '</td>'
            );
        if (options.element.hideInfo.show){
            $element.find('.jList-row').prepend(
                '<td class="hidden-icon">' +
                    '<i class="fa fa-chevron-right" style="padding-left: 10px "></i>' +
                '</td>'
            ).find('.hidden-icon').click(function (e) {
                e.stopPropagation();
                var $element = $(this).closest('li');
                if($element.find('.hiddenInfo').is(':visible'))
                    $element.find('.hidden-icon i')
                        .removeClass('fa-chevron-down')
                        .addClass('fa-chevron-right');
                else
                    $element.find('.hidden-icon i')
                        .removeClass('fa-chevron-right')
                        .addClass('fa-chevron-down');
                $element.find('.hiddenInfo').toggle('fast');

            });
            var $hidden_structure = options.element.hideInfo.structure(data);
            $element.find('.hiddenInfo').prepend($hidden_structure);
        }
        $element.click(function (e) {
            e.stopPropagation();
            var data = $(this).data('data');

            if(options.element.click !== null)
                options.element.click.call($element, data);
            else if (options.element.select.show){
                if($(this).find('.select').is(':visible'))
                    return;
                $(this).closest('ul').find('.select').hide('fast');
                $(this).find('.select').show('fast');
            }
            if(check.show){
                $(this).find('.jlist-checkbox').click();
            }
        });
        if (options.element.select.show) {
			$element.find('.jList-row').append(
				'<td class="boton">'+
					'<button type="button" style="border-radius: 0; width: 100%;" class="btn btn-success select">Seleccionar</button>'+
				'</td>'
			).find('.select').on('click select',function (e) {
				e.preventDefault();
                var $element = $(this).closest('.list-group-item');
                var data = $element.data('data');
                options.element.select.action.call($element, data);
            }).hide();
        }
        $element.find('.hiddenInfo').hide();
        options.element.add_data_to_element.call($element,data)
        return $element;
	},
    _remove_element_by_guid: function(guid, before_remove){
        var $element_to_remove = $(this.element).find('.jlist-row[guid="' + guid + '"]');
        $element_to_remove.hide(0, function () {
            if(before_remove)
                before_remove.call($(this));
            $(this).remove();
        })
    },
    _add_element: function($element){
        var $list = $(this.element).find('.list');
        $list.append($element);
    },
    _process_disables:function ($li, set_check){
	    var data = $li.data('data');
	    if(!data.disable_on_select)
	        return;
	    var $list = $(this.element);
        $.each(data.disable_on_select,function(i,id){
            $("#"+btoa(id).replace('==',''), $list).find('.jlist-checkbox').prop('disabled',set_check);
        });
    },
    _sort: function() {
        var that = this;
        var $list = $(this.element).find('.list');
        var elements = [];
        $('li', $list).each(function(i, element) {
            var name = $(element).find('.name').text().toUpperCase();
            elements[i] = [name, $(element).data('data')];
        });
        elements.sort();
        if (this.options.invert)
            elements.reverse();
        $list.empty();
        $.each(elements, function(i, element) {
            var $element = that._create_element(element[1]);
            that._add_element($element);
        });
        that._setColor();
    },
    _search: function() {
        var $list = $(this.element).find('.list');
        var $input = $(this.element).find('.input-search');
        var textToFind = $input.val().toUpperCase();
        $('li', $list).each(function(i, element) {
            var $element = $(element);
            var text = $element.text().toUpperCase();
            var index = text.search(textToFind);
            if (index < 0)
                $(element).hide().removeClass("visible");
            else
                $(element).show().addClass("visible");
        });
        this._setColor();
    },
    _setColor: function() {
        var $list = $(this.element).find('.list');
        var color = true;
        $("li.visible", $list).each(function(i, element) {
            color = !color;
            if (color)
                $(element).addClass('list-group-item-info');
            else
                $(element).removeClass('list-group-item-info');
        });
    },
});