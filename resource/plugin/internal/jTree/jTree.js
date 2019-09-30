$.widget("ui.jTree", {
	options:{
        class: "default",
        title: null,
        toolbar:{
            show: false,
            buttons: null,
            actions: {
                show: false,
                title: 'Acciones',
                position: 'right',
                buttons: null
            },
            active_deactive:{
                show: false,
                name: 'is_active',
                action: function () {
                }
            }
        },
        search: {
            show: true,
            label: "Buscar..."
        },
		tree:{
            height: '100%',
            upward: true,
			data: {
				list: [],
                connection:{
					url: null,
					data: {},
                    response: function (data) {
                        return data;
                    }
				}
			},
			event: {
				callback: null
			},
			sort: function (a, b) {
                if (a.name > b.name)
                    return 1;
                if (a.name < b.name)
                    return -1;
                return 0;
            }
		},
		node:{
            structure: function (node) {
				return node;
			}
		},
        _blueSelector: false
	},
    getSelectedNodes: function (options) {
		return this._getSelectedNodes(options);
	},
	_create: function(){
		$(this.element).addClass('jTree')
		this._initialize();
	},
    _initialize: function () {
		var that = this;
		var options = this.options;
		var $panel = $(
			'<div class="panel panel-' + options.class + '" style="margin: 0">'+
				'<div class="panel-heading">' +
					'<h3 class="panel-title">' + options.title + '</h3>'+
				'</div>'+
				'<div class="panel-body">' +
            		'<div class="toolbar"></div>'+
					'<div class="input-search-container">' +
						'<input type="text" class="form-control input-search" placeholder="' + options.search.label+ '">' +
					'</div>'+
				'</div>'+
				'<ul class="list-group mainList"></ul>'+
				'<div class="panel-footer"></div>'+
			'</div>'
		);
        if(options.title === null)
            $panel.find('.panel-heading').remove();
		if(options.toolbar.show)
			this._addToolbar($panel.find('.toolbar'));
		else
            $panel.find('.toolbar').hide();

        $(this.element).append($panel);

        if(options.search.show)
            $panel.find('.input-search').focus().keyup(function() {
                that._search();
            });
        else
            $panel.find('.input-search').hide();

		var $list = $panel.find('.mainList').hide().css('height', this.options.tree.height);;
		this._getData(options.tree, $list, $list);
	},
    _addToolbar: function ($toolbar) {
		var that = this;
        var toolbar = this.options.toolbar;
        // toolbar.buttons = [];
        if (toolbar.actions.show)
            toolbar.buttons.unshift({
                nombre: "actions",
                icon: "fa fa-bars",
                action: function () {
                    $(this).jPopover({
                        container: $('body'),
                        position: toolbar.actions.position,
                        title: "<center>" + toolbar.actions.title + "</center>",
                        buttons: toolbar.actions.buttons
                    });
                }
            });
        if (toolbar.active_deactive.show)
            toolbar.buttons.unshift({
                name: "deactive",
                label: "",
                class: 'pull-right',
                icon: "fa fa-circle-o",
                validation: function () {
                    $(this).data("val", false);
                },
                action: function () {
                    var status = $(this).data("val");
                    if (status)
                        $(this).data("val", false)
                            .addClass('btn-default')
                            .removeClass('btn-danger')
                            .find('i')
                            .addClass('fa fa-circle-o')
                            .removeClass('glyphicon glyphicon-remove-circle');
                    else
						$(this).data("val", true)
							.addClass('btn-danger')
							.removeClass('btn-default')
							.find('i')
							.removeClass('fa fa-circle-o')
							.addClass('glyphicon glyphicon-remove-circle');
                    toolbar.active_deactive.action.call($(this), status, $(that.element));
                    that.updateTree();
                }
            });
        $toolbar.jButtonGroup({
            buttons: toolbar.buttons
        });
    },
    _getData: function(options, $list, $element){
		var that = this;
		if (options.data.connection.url === null) {
			this._analyzeData(options.data.list, $list, options.event.callback)
		}else{
		    var data = options.data.connection.data;
		    if($.isFunction(data))
                data = data();
            if(this.options.toolbar.active_deactive.show)
            	data[this.options.toolbar.active_deactive.name] = $(this.element).find('[name="deactive"]').data('val');
            $.jAjaxRequestManager({
                url: options.data.connection.url,
                command: options.data.connection.command,
                data: data,
                waitingAnimation: {
					element: $element,
					size: "fa-lg"
				},
				cache: options.data.connection.cache,
                onSuccess: function (data) {
                	data = options.data.connection.response(data);
					that._analyzeData(data, $list, options.event.callback)
                    $element.show();
                },
                onHandlerException: function (mensaje) {
					console.log(mensaje);
				}
            });
		}
	},
    _analyzeData: function (data, $list, callback) {
		var that = this;
		if(that.options.tree.sort !== null)
		    data.sort(that.options.tree.sort);
		$.each(data, function(index, baseNode) {
			var info = $.extend(true, {}, baseNode);
			var node = that.options.node.structure.call($list, baseNode);
			info = $.extend(true, info, node.info);
			node = $.extend(true, {
                allowedToOpen: false,
                allowedToSelect: false,
				open: false,
				data:{
                    connection:{
						url: null,
                        response: function (data) {
                            return data;
                        }
					},
					list: []
				},
				event: {
					callback: null,
					click: null
				},
				actions:{
                    title: 'Acciones',
                    position: 'right',
                    show: false,
                    buttons: []
				},
				icon:{
					close: "fa fa-chevron-right",
					open: "fa fa-chevron-down",
                    select: "fa fa-square-o",
                    selected: "fa fa-check-square-o",
					prefix: ""
				}
			}, node);
			node.info = info;
			that._addNode(node, $list);
		});
		if ($.isFunction(callback)) 
			callback($list);
	},
    _addNode: function (node, $list) {
		var that = this;
		var $parentNode = $list.closest('.node');
		var $node = $(
			'<li class="list-group-item node">' +
				'<table>'+
					'<tr class="element">'+
						'<td class="actions-container">'+
                            '<button type="button" class="actions btn btn-default">'+
                                    '<i class="fa fa-bars"></i>'+
                            '</button>'+
                        '</td>' +
						'<td class="selector">' + 
							'<div>'+
								'<i class="' + node.icon.select + '"></i>'+
							'</div>'+
						'</td>'+
						'<td class="open">' +
							'<div>'+
								'<i class="' + node.icon.open + '"></i>'+
							'</div>'+
						'</td>'+
						'<td class="labelNode ' + (node.classLabel || "") + '">' +
						    '<i class="' + node.icon.prefix + '"></i>  ' +
            '<span class="text_to_search">' + node.label +'</span>' +
                        '</td>'+
					'</tr>'+
				'</table>'+
			'</li>'
		).data('node', node).data('data', node.info);
		$list.append($node);
		if(node.tooltip){
			$(".label",$node).tooltip({
	            trigger:"hover",
	            title: node.tooltip
        	});
		}

		if (node.allowedToSelect){
			$('.selector', $node).on('click', function(event) {
				that._selectedNode($(this).closest('.node'));
				event.stopPropagation();
			});
			if ($parentNode.data('selected'))
				node.selected = true;
			if (node.selected)
				$('.selector', $node).click();
			else
				$node.data('selected', false);
		}else{
			$('.selector', $node).addClass('notSelected');
			$('.selector i', $node).removeClass();
		}
        if ($.isFunction(node.event.click)){
            $('.labelNode', $node).on('click', function(event) {
                var $node = $(this).closest('.node');
                var data = $node.data('data');
                node.event.click.call($node, data);
                event.stopPropagation();
            }).addClass('click');
        }
		if ($.isFunction(node.click)){
			$('.labelNode', $node).on('click', function(event) {
				var $node = $(this).closest('.node');
				var data = $node.data('data');
				node.click.call($node, data);
				event.stopPropagation();
			}).addClass('click');
		}
		if (node.actions.show === undefined || !node.actions.show)
			$('.actions', $node).hide();
		else
			$('.actions', $node).click(function() {
			    var $node = $(this).closest('.node');
			    var data = $node.data('data');
                $(this).jPopover({
                    container: $(that.element).find('.mainList'),
                    position: node.actions.position,
                    title: "<center>" + node.actions.title + "</center>",
                    buttons: node.actions.buttons.call($node, data)
                });
			});
        if (node.allowedToOpen){
            $('.open, .labelNode', $node).on('click', function(event) {
                that._openNode($(this).closest('.node'));
                event.stopPropagation();
            });
            if (node.open)
			{
                $('.open', $node).click();
                // $('.labelNode', $node).click();
            }
        }else{
            $('.open', $node).addClass('doNotOpen');
            $('.open i', $node).toggleClass(node.icon.open + ' ' + node.icon.prefix);
        }
		this._setColor();
	},
	_openNode: function ($node) {
		var that = this;
		var node = $node.data('node');
		var $list = $('.list', $node).first();
		node.event.callback = function ($list) {
			$list.toggle('fast', function () {
				var $element = $(this).closest('.content').prev();
				if ($(this).is(':visible'))
					$('.open i', $element).removeClass().addClass(node.icon.close);
				else
					$('.open i', $element).removeClass().addClass(node.icon.open);
				that._search();
				that._setColor(true);
			});
		};
		if ($list.length === 0) {
			$('table', $node).append(
				'<tr class="content">'+
					'<td colspan="5">'+
						'<ul class="list list-group"></ul>'+
					'</td>'+
				'</tr>'
			);
			$list = $('.list', $node).hide();
			this._getData(node, $list, $('.open div', $node).first());
		}else{
			node.event.callback($list);
		}
	},
	_selectedNode: function ($node, select, sequential) {
		var that = this;
		var $parentNode = $node.parent().closest('.node');
		var node = $node.data('node');
		var $selector = $('.selector', $node).first();
		if (!node.allowedToSelect)
			return;
		var $icon = $('i', $selector);
		var $list = $('.list', $node);
		select = select === undefined ? $icon.hasClass(node.icon.selected) : select;
		sequential = sequential === undefined ? true : sequential;
		if (select){
			$node.data('selected', false);
			$icon.removeClass().addClass(node.icon.select);
			if ($parentNode.length !== 0 && this.options.tree.upward)
				this._selectedNode($parentNode, select, false);
		} else{
			$node.data('selected', true);
			$icon.removeClass().addClass(node.icon.selected);
			if ($parentNode.length !== 0 && this.options.tree.upward)
				if (this._checkSelectedLevelNodes($node))
					this._selectedNode($parentNode, select, false);
		}
		if ($list.length !== 0 && sequential)
			$('.node', $list).each(function(index, el) {
				that._selectedNode($(el), select);
			});
	},
    _checkSelectedLevelNodes: function ($node) {
		var $nodes = $node.siblings();
		var allSelected = true;
		$.each($nodes, function(index, node) {
			var selected = $(node).data('selected');
			if (selected === undefined)
				return;
			if (!selected) {
                allSelected = false;
				return false;	
			}
		});
		return allSelected;
	},
	_setColor: function (visibles) {
		visibles = visibles !== undefined;
		var blue = false;
		var $nodes = $('.node', this.element);
		$('.node > table', this.element).removeClass('blue');
		if (visibles)
			$nodes = $nodes.filter(':visible');
		$nodes.each(function(index, node) {
			if (blue)
				$('table', node).first().addClass('blue');
			blue = !blue;
		});
	},
	_search: function() {
		var that = this;
		var $input = $('.input-search', this.element);
		var textSearch = $input.val().toUpperCase();
		if (textSearch === '')
			$('.node', this.element).show();
		else
			$('.node', this.element).hide().each(function(index, node) {
					var $node = $(node);
					var text = $('.text_to_search',$node).first().text().toUpperCase();
					index = text.search(textSearch) + 1;
					if (index !== 0)
						that._showNode($node, true);
			});
		this._setColor();
	},
    _showNode: function ($node, showParentNode) {
		var $parentNode = $node.parent().closest('.node');
        showParentNode = showParentNode !== undefined;
		$node.show();
		if ($parentNode.length !== 0 && showParentNode)
			this._showNode($parentNode, true);
	},
    _getSelectedNodes: function (options) {
        options = $.extend(true, {
            onlyComplete: false,
            forceSelected: false,
			forNivel: false
		}, options);
		var that = this;
		var nodes = options.nivel ? {} : [];
		var $nodes = $('.mainList', this.element).first().children().toArray();
		do {
			var $node = $($nodes[0]);
			if ($node.data('selected')) {
				var data = $node.data('data');
				data.complete = that._validateCompleteSelectedNodes($node);
				if (options.onlyComplete) {
					if (!data.complete) {
						$nodes = $nodes.concat($('.list', $node).first().children().toArray());
						if (options.forceSelected){
							if (options.forNivel) {
								if (!(data.level in nodes)){
									nodes[data.level] = [];
								}
								nodes[data.level].push(data);
							}else{
								nodes.push(data);
							}
						}
					}else{
						if (options.forNivel) {
							if (!(data.level in nodes)){
								nodes[datos.level] = [];
							}
							nodes[data.level].push(data);
						}else{
							nodes.push(data);
						}
					}
				}else{
					$nodes = $nodes.concat($('.list', $node).first().children().toArray());
					if (options.forNivel) {
						if (!(data.level in nodes)){
							nodes[data.level] = [];
						}
						nodes[data.level].push(data);
					}else{
						nodes.push(data);
					}	
				}
			}else{
				$nodes = $nodes.concat($('.list', $node).first().children().toArray())
			}
			$nodes.splice(0, 1)
		} while ($nodes.length !== 0);
		return nodes;
	},
    _validateCompleteSelectedNodes: function ($node) {
		var $list = $('.list', $node).first();
		var complete = true;
		if ($list.length === 0)
			return true;
		$('.node', $list).each(function(index, node) {
			var $node = $(node);
			if (!$node.data('selected')){
				complete = false;
				return false;
			}
		});
		return complete;
	},
	updateTree: function(){
        var that = this;
        var $list = $(this.element).find('.mainList');
        $list.hide('fast', function () {
            $list.empty();
            that._getData(that.options.tree, $list, $list);
        })
	},
    updateNode: function($node){
	    var that = this;
        $node.find('tr.content').hide('fast', function () {
           $(this).remove();
            that._openNode($node);
        });
    }
});
