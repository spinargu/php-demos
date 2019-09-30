$.extend({
    redirect: function (controller, view, data, session_storage) {
        var url = "?";
        if(controller)
            url += "c=" + controller;
        if(view)
            url += "&v=" + view;
        if(data){
            if(session_storage)
                sessionStorage.setItem(controller + '_' + view + '_view_data', JSON.stringify(data));
            else
                url += "&d=" + JSON.stringify(data);
        }
        window.location.assign(url);
    },
    create_url_to_command_get_method: function(options){
        return options.url + '?command=' + options.command + '&data=' + JSON.stringify(options.data);
    },
    get_url_data: function(){
        var url_params = $.get_url_params();
        var data = sessionStorage.getItem(url_params.c + '_' + url_params.v + '_view_data');
        data = data ? JSON.parse(data) : null;
        return data;
    },
    get_url_params: function(url) {
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};
        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');
            for (var i=0; i<arr.length; i++) {
                var a = arr[i].split('=');
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function(v) {
                    paramNum = v.slice(1,-1);
                    return '';
                });
                var paramValue = typeof(a[1])==='undefined' ? true : a[1];
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();
                if (obj[paramName]) {
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    if (typeof paramNum === 'undefined') {
                        obj[paramName].push(paramValue);
                    }
                    else {
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                else {
                    obj[paramName] = paramValue;
                }
            }
        }
        return obj;
    },
    button: function (options) {
        options =  $.extend(true,{
            name: "",
            type: "default",
            class: "",
            style: "",
            label: null,
            labelClass: "",
            icon: null,
            action: function () {},
            data: null
        }, options);
        var $button = $(
            '<button style="' + options.style + '" name="' + options.name + '" type="button" ' +
                'class="btn btn-' + options.type + ' ' + options.class + '">'+
                '<i class="' + options.icon + '" aria-hidden="true"></i> '+
                '<span class="' + options.labelClass + '">' + options.label + '</span>'+
            '</button>'
        ).click(function (e) {
            e.stopPropagation();
            var options = $(this).data('options');
            options.action.call(this, options.data)
        }).data('options', options);
        if (options.icon === null)
            $('i', $button).remove();
        if (options.label === null)
            $('span', $button).remove();
        return $button;
    },
    add_marquee: function (reference, $element) {
        if($element.parent('marquee').length !== 0)
            $element.unwrap();
        var height = $element.outerHeight();
        if (height > reference)
            $element.wrap('<marquee></marquee>');
    },
    format_money: function(n, c, d, t){
        var s = n < 0 ? "-" : "";
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d === undefined ? "." : d;
        t = t === undefined ? "," : t;
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    },
    convert_base_64_to_blob: function (base_64, type) {
        var byteCharacters = atob(base_64);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: type});
        return blob;
    },
    download_blob: function (url, fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = fileName;
        a.click();
    },
    get_moment_time_list: function (current, format, step, limits) {
        var list = [];
        limits = $.extend(true, {
            start: {
                'hour': 0,
                'minute': 0,
                'second': 0
            },
            end: {
                'hour': 0,
                'minute': 0,
                'second': 0
            }
        }, limits);
        step = $.extend(true, {
            hours: 0,
            minutes: 0,
            seconds: 0
        }, step);
        var _moment = moment(current.set(limits.start));
        var end = moment(current.set(limits.end));
        list.push({
            moment: moment(_moment),
            formatted: _moment.format(format)
        });
        do {
            _moment.add(step);
            list.push({
                moment: moment(_moment),
                formatted: _moment.format(format)
            });
        }while(_moment.isBefore(end));
        return list;
    },
    to_title_case: function(toTransform) {
        if(toTransform === null || toTransform === undefined)
            return;
        var restricted_words=['de','la','el','con','a', 'en', 'del'];
        toTransform = toTransform.toLowerCase();
        return toTransform.split(' ')
            .map(function(word,i) {
                if(jQuery.inArray(word, restricted_words) === -1 || i === 0)
                    return word[0] ? word[0].toUpperCase() + word.substr(1) : '' + word.substr(1);
                return word;
            })
            .join(' ');
    },
    get_guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    get_bool: function (val, in_array) {
        if(in_array && val === 0)
            return true;
        if(
            val === undefined ||
            val === null ||
            val === "0" ||
            val === 0 ||
            val === -1 ||
            val === "false" ||
            val === false
        )
            return false;
        return val === "1" ||
            val === 1 ||
            val === "true" ||
            val === true ||
            val > 1;
    },
    is_valid_curp: function (string) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var vowel = 'aeiouxAEIOUX';
        var consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
        var regexp = new RegExp("^[" + chars +"]{1}[" + vowel + "]{1}[" + chars +"]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{1}[" + chars +"]{2}[" + consonants + "]{3}[0-9," + chars +"]{1}[0-9]{1}$");
        return regexp.test(string);
    },
    is_valid_zip_code: function (string) {
        var regexp = new RegExp('^\\d{5}$');
        return regexp.test(string);
    },
    is_valid_phone: function (string) {
        var regexp = new RegExp('^\\d{10}$');
        return regexp.test(string);
    },
    is_valid_electoral_code: function (string) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var regexp = new RegExp("^[" + chars +"]{6}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-9]{2}[M,H,m,h]{1}[0-9]{3}$");
        return regexp.test(string);
    },
    pad: function(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    insert_at_cursor: function(myField, myValue) {
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
        }
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)
                + myValue
                + myField.value.substring(endPos, myField.value.length);
        } else {
            myField.value += myValue;
        }
    },
    remove_session_storage_command: function (options) {
        $.each(sessionStorage, function (name) {
            if(name.indexOf(options.url + '_' + options.command) !== -1)
                sessionStorage.removeItem(name);
        })
    }
});