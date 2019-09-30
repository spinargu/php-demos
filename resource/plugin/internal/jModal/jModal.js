(function () {
    var actions = {
        public: {
            close: function (remove, callback) {
                $(this).data("remove", remove);
                $(this).on('hidden.bs.modal', function () {
                    if ($.isFunction(callback))
                        callback.call(this);
                    $(this).off('hidden.bs.modal');
                }).modal('hide');
            },
            getElementByName: function (name) {
                return $('[name="' + name + '"]', this);
            },
            getjForm: function () {
                return $(this).find('.jForm');
            },
            get_jList: function () {
                return $(this).find('.jList');
            },
            get_advance_table: function () {
                return $(this).find('.fixed-table-body .jAdvanceTable');
            },
            get_jTree: function(){
                return $(this).find('.jTree');
            }
        },
        validateOptions: function (options) {
            return $.extend(true, {
                title: "Título",
                subtitle: "",
                close: true,
                slimTitles: false,
                size: "",
                footer: true,
                buttons: [],
                events: {
                    show: function () {
                    },
                    shown: function () {
                    },
                    shownOne: function () {
                    },
                    hide: function () {
                    },
                    hidden: function () {
                    }
                },
                connection: {
                    url: "",
                    command: "",
                    data: {},
                    cache: {},
                    response: function (data) {
                        return data;
                    }
                },
                customContent: null,
                jForm: null,
                jButtonGroup: null,
                jList: null,
                jTree: null,
                jAccordion: null,
                jTab: null,
                jAdvanceTable: null,
                jMap: null
            }, options);
        },
        create: function (options) {
            var $modal = $(
                '<div class="jModal modal fade" data-keyboard="' + options.close + '" >' +
                '<div class="modal-dialog ' + options.size + '">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title text-center"><b>' + options.title + '</b></h4>' +
                '</div>' +
                '<div class="modal-body"></div>' +
                '<div class="modal-footer"><div>' +
                '</div>' +
                '</div>' +
                '</div>');
            if (options.subtitle !== "") {
                $('.modal-header', $modal).after(
                    '<div class="modal-subtitle well well-sm text-center" style="margin: 0; border-radius: 0">' +
                    '<b>' + options.subtitle + '</b>' +
                    '</div>'
                );
                $modal.find('.modal-subtitle').on('click', function () {
                    $(this).toggleClass('slim-subtitle');
                });
            }
            if (!options.footer)
                $modal.find('.modal-footer').remove();
            if (options.slimTitles) {
                $modal.find('.modal-header').css('padding', '5px');
                $modal.find('.modal-subtitle').css('padding', '5px');
            }
            $modal.data('init', true);
            return $modal;
        },
        init: function ($modal, options, callback) {
            $modal.modal({
                show: false,
                backdrop: options.close ? true : 'static',
                keyboard: options.close
            }).on('show.bs.modal', function () {
                options.events.show.call(this);
            }).on('shown.bs.modal', function () {
                if ($.isFunction(callback) && $modal.data('init'))
                    callback();
                var data = $modal.data('response');
                options.events.shown.call(this, data);
            }).one('shown.bs.modal', function () {
                options.events.shownOne.call(this);
            }).on('hide.bs.modal', function () {
                options.events.hide.call(this);
                $('.onPopover').popover('hide');
                $(this).on('hidden.bs.modal', function () {
                    options.events.hidden.call(this);
                    if ($(this).data('remove'))
                        $(this).remove();
                    $(this).data('remove', true);
                });
            }).modal("show");
        },
        addButtons: function ($modal, options) {
            var $footer = $('.modal-footer', $modal);
            $.each(options.buttons, function (i, button) {
                var action = button.action;
                button = $.extend({
                    show: true,
                    getData: false,
                }, button);
                if (button.getData)
                    button.action = function () {
                        if ($.isFunction(action)) {
                            var result = $modal.jModal().get_form().jForm('getData');
                            action.call(this, result);
                        }
                    }
                var $button = $.button(button);
                if (!button.show)
                    $button.hide();
                $footer.append($button);
            });
        },
        setjForm: function ($modal, options, data) {
            if (options.jForm === null)
                return;
            options.jForm.data = data;
            $modal.find('.modal-body').jForm(options.jForm);
        },
        setjButtonGroup: function ($modal, options, data) {
            var jButtonGroup = options.jButtonGroup;
            if (jButtonGroup === null)
                return;
            data = data ? data : jButtonGroup.data;
            jButtonGroup.buttons = $.isFunction(jButtonGroup.buttons) ? jButtonGroup.buttons.call($modal, data) : jButtonGroup.buttons;
            jButtonGroup.class = '-vertical';
            $modal.find('.modal-body').jButtonGroup(jButtonGroup);
        },
        setjList: function ($modal, options, data) {
            if (options.jList === null)
                return;
            if ($.isArray(options.jList)) {
                var that = this;
                $.each(options.jList, function (i, jList) {
                    that.process_jList($modal, jList, data);
                });
            } else
                this.process_jList($modal, options.jList, data);
        },
        process_jList: function ($modal, options, data) {
            options.data = data !== undefined ? data : options.data;
            if ($.isFunction(options.append))
                options.append.call($modal).jList(options);
            else
                $modal.find('.modal-body').jList(options);
        },
        setjTree: function ($modal, options, data) {
            if (options.jTree === null)
                return;
            options.jTree.data = data !== undefined ? data : options.jTree.data;
            var $tree = $('<div></div>').jTree(options.jTree);
            $modal.find('.modal-body').append($tree);
        },
        setjAccordion: function ($modal, options, data) {
            if (options.jAccordion === null)
                return;
            options.jAccordion.data = data !== undefined ? data : options.jAccordion.data;
            $modal.find('.modal-body').jAccordion(options.jAccordion);
        },
        setjTab: function ($modal, options, data) {
            if (options.jTab === null)
                return;
            options.jTab.data = data !== undefined ? data : options.jTab.data;
            $modal.find('.modal-body').jTab(options.jTab);
        },
        setCustomContent: function ($modal, options, data) {
            if (options.customContent === null)
                return;
            options.customContent.call($modal, data);
        },
        setjAdvanceTable: function ($modal, options, data) {
            if (options.jAdvanceTable === null)
                return;
            $modal.find('.modal-body').append('<table class="' + options.jAdvanceTable.name + ' jAdvanceTable"></table>');
            var $table = $modal.find('.jAdvanceTable');
            var _options = options.jAdvanceTable.options($table, data);
            $table = $table.jAdvanceTable(_options);
        },
        setjMap: function ($modal, options, data) {
            if (options.jMap === null)
                return;
            var $element = options.jMap.element.call($modal);
            $modal.data('jMap', true);
            var map = new google.maps.Map($element[0], options.jMap.options);
            if (options.jMap.events && options.jMap.events.length != 0) {
                $.each(options.jMap.events, function (i, event) {
                    map.addListener(event.name, event.action);
                })
            }
            $modal.data('map', map);
            options.jMap.on_success.call(map)
            $.fn.add_marker = function (marker) {
                if (!$(this).data('jMap'))
                    console.error('jMap not initializing in this element');
                var markers = $(this).data('_markers') || [];
                markers.push(marker);
                $(this).data('_markers', markers);
            }
            $.fn.add_route = function (route) {
                if (!$(this).data('jMap'))
                    console.error('jMap not initializing in this element');
                var routes = $(this).data('_routes') || [];
                routes.push(route);
                $(this).data('_routes', routes);
            }
            $.fn.clean_markers = function () {
                if (!$(this).data('jMap'))
                    console.error('jMap not initializing in this element');
                var markers = $(this).data('_markers') || [];
                $.each(markers, function (i, marker) {
                    marker.setMap(null);
                })
                $(this).data('_markers', []);
            }
            $.fn.clean_routes = function () {
                if (!$(this).data('jMap'))
                    console.error('jMap not initializing in this element');
                var routes = $(this).data('_routes') || [];
                $.each(routes, function (i, route) {
                    route.setMap(null);
                })
                $(this).data('_routes', []);
            }
        },
        setInfo: function ($modal, options, data) {
            if (!options.info)
                return;
            $modal.find('.modal-body').after(
                '<ul class="list-group" style="margin: 0;">' +
                '<li class="list-group-item list-group-item-info text-center" style="border-radius: 0">' +
                '<b>Ultima actualización</b>' +
                '</li>' +
                '<li class="list-group-item">' + (data.updateUser || data.update_user) + '</li>' +
                '<li class="list-group-item">' +
                moment(data.updateDate || data.update_date).format('DD [de] MMMM [de] YYYY [a las] kk:mm:ss a') +
                '</li>' +
                '<li class="list-group-item list-group-item-info text-center" style="border-radius: 0">' +
                '<b>Creación</b>' +
                '</li>' +
                '<li class="list-group-item">' + (data.creationUser || data.creation_user) + '</li>' +
                '<li class="list-group-item">' +
                moment(data.creationDate || data.creation_date).format('DD [de] MMMM [de] YYYY [a las] kk:mm:ss a') +
                '</li>' +
                '</ul>'
            );
            $modal.find('.modal-body').remove();
        },
        getData: function ($modal, options) {
            var that = this;
            $.jAjaxRequestManager({
                url: options.connection.url,
                command: options.connection.command,
                data: options.connection.data,
                cache: options.connection.cache,
                waitingAnimation: {
                    element: $modal.find('.modal-body'),
                    size: "fa-5x",
                    style: "padding: 30px;"
                },
                onSuccess: function (data) {
                    $modal.data('init', false);
                    if ($.isFunction(options.connection.response))
                        data = options.connection.response(data);
                    $modal.data('response', data);
                    that.setCustomContent($modal, options, data);
                    that.setjTab($modal, options, data);
                    that.setjAccordion($modal, options, data);
                    that.setjForm($modal, options, data);
                    that.setjButtonGroup($modal, options, data);
                    that.setjList($modal, options, data);
                    that.setjTree($modal, options, data);
                    that.setInfo($modal, options, data);
                    that.setjAdvanceTable($modal, options, data);
                    that.setjMap($modal, options, data);
                }
            })
        }
    };
    $.fn.jModal = function (method, arg1, arg2) {
        if (method)
            return actions.public[method].call(this, arg1, arg2);
        var that = this;
        if (!$(this).data('jmodal')) {
            console.error('The element not initializing like modal');
            return;
        }
        return {
            close: function (remove, callback) {
                $(that).data("remove", remove);
                $(that).on('hidden.bs.modal', function () {
                    if ($.isFunction(callback))
                        callback.call(this);
                    $(this).off('hidden.bs.modal');
                }).modal('hide');
            },
            get_element_by_name: function (name) {
                return $(that).find('[name="' + name + '"]');
            },
            get_form: function () {
                return $(that).find('.jForm');
            },
            get_list: function () {
                return $(that).find('.jList');
            },
            get_table: function () {
                return $(that).find('.fixed-table-body .jAdvanceTable');
            },
            get_tree: function(){
                return $(that).find('.jTree');
            }
        };
    };
    $.jModal = function (options) {
        options = actions.validateOptions(options);
        var $modal = actions.create(options);
        $modal.data('jmodal', true);
        actions.addButtons($modal, options);
        if (options.connection.url === '') {
            actions.setCustomContent($modal, options);
            actions.setjTab($modal, options);
            actions.setjAccordion($modal, options);
            actions.setjForm($modal, options);
            actions.setjButtonGroup($modal, options);
            actions.setjList($modal, options);
            actions.setjTree($modal, options);
            actions.init($modal, options, function () {
                $modal.data('init', false);
                actions.setjAdvanceTable($modal, options)
                actions.setjMap($modal, options)
            })
        } else {
            actions.init($modal, options, function () {
                actions.getData($modal, options)
            })
        }
        $modal.data('remove', true)
        return $modal;
    };
})();