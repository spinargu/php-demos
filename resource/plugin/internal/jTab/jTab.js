$.widget("ui.jTab", {
    options: {
        data: null,
        justified: false,
        first_active: true,
        tabs: [],
        tab: {
            structure: function (data) {
                return data
            }
        }
    },
    add_tab: function(data){
        var tab = this.options.tab.structure(data)
        tab = this._validate_tab(tab);
        this._add_tab(tab, true);
    },
    update_tab: function(data, data_id){
        this._clean();
        this._add_updated_tabs(data, data_id);
    },
    remove_tab: function(data){
        var $tab_content = $(this.element).find('.tab-content')
        var tab = this.options.tab.structure(data)
        tab = this._validate_tab(tab);
        var $li = $(this.element).find('a[href="#' + tab.name + '"]')
        var $panel = $tab_content.find('#' + tab.name);
        $li.remove();
        $panel.remove();
        this._select_first_tab();
    },
    update_tabs:function(){
        this._clean();
        this._add_tabs();
    },
    _create: function () {
        this._initialize();
        this._add_tabs();
    },
    _initialize: function () {
        var $content = $(
            '<div>' +
            '<ul class="nav nav-tabs jtab-tablist" role="tablist"></ul>' +
            '<div class="tab-content"></div>' +
            '</div>'
        );
        if (this.options.justified)
            $content.find('.nav.nav-tabs').addClass('nav-justified');
        $(this.element).append($content).addClass('jTab');
    },
    _clean: function(){
        $(this.element).find('.jtab-tablist').empty();
        $(this.element).find('.tab-content').empty();
    },
    _add_tabs: function () {
        var that = this;
        var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
        var first = true;
        var show = false;
        $.each(this.options.tabs, function (i, tab) {
            tab = that.options.tab.structure(tab);
            tab = that._validate_tab(tab);
            if (tab.code) {
                if (!(tab.code in subpermissions))
                    return;
            }
           if(!tab.add)
               return;
            if(that.options.first_active && first){
                first = false;
                show = true;
            }else
                show = false;
            that._add_tab(tab, show);
        });
    },
    _add_tab: function(tab, show) {
        var $nav = $(this.element).find('.jtab-tablist').first();
        var $tabs = $(this.element).find('.tab-content').first();
        var $li = this._create_tab(tab);
        var $panel = this._create_panel(tab);
        $nav.append($li);
        $tabs.append($panel);
        if (show){
            if($('#' + tab.name).length != 0)
                $li.find('a').tab('show');
            else
                var timer = setInterval(function () {
                    if($('#' + tab.name).length != 0){
                        $li.find('a').tab('show');
                        clearInterval(timer);
                    }
                }, 100)
        }
    },
    _add_updated_tabs: function(data, data_id){
        var that = this;
        var subpermissions = JSON.parse(atob(sessionStorage.session)).user.subpermissions;
        var first = true;
        var show = true;
        tabs = this.options.tabs;
        tabs[data_id] = data;
        // updated_tabs = Object.assign({}, tabs, data);
        $.each(tabs, function (i, tab) {
            tab = that.options.tab.structure(tab);
            tab = that._validate_tab(tab);
            if (tab.code) {
                if (!(tab.code in subpermissions))
                    return;
            }
            if(data_id == i && first){
                first = false;
                show = true;
            }else
                show = false;
            that._add_tab(tab, show);
        });
    },
    _create_tab: function(tab){
        var $tabs = $(this.element).find('.tab-content');
        var $li = $('<li role="presentation" style="' + tab.show + '" class="'+tab.classes+'">' +
            '<a href="#' + tab.name + '" aria-controls="' + tab.name + '" role="tab" data-toggle="tab" style="' + tab.style + '">' +
            '<i class="fa-lg ' + tab.icon + '"></i> '+
            tab.title +
            '</a>' +
            '</li>');
        $li.find('a').on('shown.bs.tab', function () {
            var tab = $(this).data('tab');
            var $panel = $tabs.find(this.hash);
            var first = $panel.data('first');
            if (first) {
                if ($.isFunction(tab.on_first_show))
                    tab.on_first_show.call($panel, tab.data, $(this));
                $panel.data('first', false);
            } else {
                if ($.isFunction(tab.on_show))
                    tab.on_show.call($panel, tab.data, $(this));
            }
        }).on('click', function (e) {
            var data = $(this).data('tab');
            if (data.disable_click) {
                e.preventDefault();
                e.stopPropagation();
                $(this).blur();
            }
        }).data('tab', tab);

        return $li;
    },
    _create_panel: function(tab){
        var $panel = $('<div role="tabpanel" class="tab-pane fade " id="' + tab.name + '" ></div>');
        $panel.data('first', true);
        if ($.isFunction(tab.content))
            tab.content.call($panel, this.options.data, tab.data);//ejecuta la funcion content
        return $panel;

    },
    _validate_tab: function(tab){
        return $.extend({
            add: true,
            show: false,
            name: "name",
            title: "",
            style: "",
            icon: "",
            data: {},
            disable_click: false,
            on_first_show: function(){},
            on_show: function(){},
            content: function(){},
        },tab)
    },
    _select_first_tab: function(){
        $(this.element).find('a[role="tab"]').first().tab('show')
    },

    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});