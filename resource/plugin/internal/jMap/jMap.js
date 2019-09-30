$.widget("ui.jMap", {
    options: {
        map: {},
        kmls: [],
        events: [],
        markers: [],
        routes: [],
        on_finish_render: function () {},
        _kmls_google: [],
        _markers_google: [],
        _routes_google: [],
        _info_windows_google: []
    },
    _set_public_methods: function () {
        var that = this;
        $.fn.jMap_add_marker = function (data) {
            if(!that._validate_method_to_use($(this), 'add_marker'))
                return;
            that._add_marker(data);
            return $(this);
        };
        $.fn.jMap_add_route = function (data) {
            if(!that._validate_method_to_use($(this), 'add_route'))
                return;
            that._add_route(data);
            return $(this);
        };
        $.fn.jMap_clean_markers = function () {
            if(!that._validate_method_to_use($(this), 'clean_marker'))
                return;
            that._clean_markers();
            return $(this);
        };
        $.fn.jMap_clean_routes = function () {
            if(!that._validate_method_to_use($(this), 'clean_route'))
                return;
            that._clean_routes();
            return $(this);
        };
        $.fn.jMap_bounds_to_markers = function () {
            if(!that._validate_method_to_use($(this), 'bounds_to_markers'))
                return;
            that._bounds_to_markers();
            return $(this);
        };
        $.fn.jMap_show_info_window_marker = function (marker, data) {
            if(!that._validate_method_to_use($(this), 'show_info_window_marker'))
                return;
            that._show_info_window_marker(marker, data);
            return $(this);
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
        var that = this;
        $(this.element).addClass('jMap').data('public_methods', [
            'add_marker',
            'add_route',
            'clean_marker',
            'clean_route',
            'bounds_to_markers',
            'show_info_window_marker',
            'get_marker_by_guid'
        ]);
        var check = setInterval(function () {
            try{
                if(google !== undefined){
                    that._initialize();
                    clearInterval(check);
                    that._add_kmls(that.options.kmls);
                    that._add_events(that.options.events);
                    that._add_markers(that.options.markers);
                    that._set_public_methods();
                    that.options.on_finish_render(that._map);
                }
            }catch (e){
            }
        })
    },
    _initialize: function () {
        this._map = new google.maps.Map(this.element[0], this.options.map);
    },
    _add_kmls: function (kmls) {
        var that = this;
        $.each(kmls, function (i, kml) {
            kml.map = that._map;
            that.options._kmls_google.push(new google.maps.KmlLayer(kml.url, kml))
        })
    },
    _add_events: function (events) {
        var that = this;
        $.each(events, function (i, event) {
            that._map.addListener(event.name, event.action);
        })
    },
    _validate_marker: function (marker) {
        return $.extend({
            events: [],
            customise: function () {}
        }, marker);
    },
    _validate_route: function (route) {
        return $.extend({
            events: [],
            customise: function () {}
        }, route);
    },
    _add_markers: function (markers) {
        var that = this;
        $.each(markers, function (i, marker) {
            that._add_marker(marker);
        })

    },
    _add_marker: function (marker) {
        marker = this._validate_marker(marker);
        var marker_google = new google.maps.Marker({
            map: this._map,
            position: marker.position,
        });
        marker_google.setLabel(marker.label);
        marker_google.additional_data = marker.additional_data;
        $.each(marker.events, function (name, action) {
            marker_google.addListener(name, action);
        });
        marker.customise(marker_google);
        this.options._markers_google.push(marker_google);
    },
    get_marker_by_guid: function($guid){
        var _marker;
        $.each(this.options._markers_google,function(i,marker){
            if(marker.additional_data.guid == $guid)
                _marker = marker;
        });
        return _marker;
    },
    add_marker_events: function($guid,$events){
       $.each(this.options._markers_google, function(i,marker){
           if(marker.additional_data.guid == $guid){
             $.each($events,function(name, action){
                   marker.addListener(name,action);
               });
           }
       });
    },
    _add_route: function (route_options) {
        var that = this;
        var route = new google.maps.DirectionsRenderer({
            map: this._map,
            markerOptions: {
                visible: false
            },
            preserveViewport: true
        });
        //route = this._validate_route(route);
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(route_options, function (response, status) {
            if (status == 'OK') {
                route.setDirections(response);
                that.options._routes_google.push(route);
            }
        });
    },
    _clean_markers: function () {
        $.each(this.options._markers_google, function (i, marker) {
            marker.setMap(null);
        });
        this.options._markers_google = [];
    },
    _clean_routes: function () {
        $.each(this.options._routes_google, function (i, route) {
            route.setMap(null);
        });
        this.options._routes_google = [];
    },
    _clean_info_windows: function () {
        $.each(this.options._info_windows_google, function (i, info_window) {
            info_window.close();
        });
        this.options._info_windows_google = [];
    },
    _bounds_to_markers: function () {
        var bounds = new google.maps.LatLngBounds();
        $.each(this.options._markers_google, function (i, marker) {
            bounds.extend(marker.position);
        })
        this._map.fitBounds(bounds);
    },
    _show_info_window_marker: function (marker, data) {
        this._clean_info_windows();
        var $window = $(
            '<div>' +
                '<table class="table table-striped table-condensed text-center">' +
                    '<thead>' +
                        '<tr><th colspan="2">' + data.title + '</th></tr>' +
                    '</thead>' +
                    '<tbody></tbody>' +
                '</table>' +
            '</div>'
        );
        $.each(data.info, function (name, value) {
            var $row = $(
                '<tr>' +
                    '<td>' + name + '</td>' +
                    '<td>' + value + '</td>' +
                '</tr>'
            );
            $window.find('tbody').append($row);
        });
        var infowindow = new google.maps.InfoWindow({
            maxWidth: data.max_width,
            content: $window.html()
        });
        infowindow.open(this._map, marker);
        this.options._info_windows_google.push(infowindow);
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});
