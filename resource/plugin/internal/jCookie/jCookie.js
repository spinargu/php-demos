$.jCookie = {
    check: function (options) {
        var that = this;
        options = validateOptions(options);
        var timeLimit = options.seconds * 5;
        var halfTimeLimit = timeLimit / 2;
        that.delete(options.name);
        (function process() {
            setTimeout(function () {
                if (timeLimit === halfTimeLimit)
                    if ($.isFunction(options.inHalfTimeLimit))
                        options.inHalfTimeLimit();
                if (timeLimit === 0) {
                    if ($.isFunction(options.timeOutExpired))
                        options.timeOutExpired();
                    that.delete(options.name);
                    return false;
                }
                var cookie = that.getVal(options.name);
                if (cookie !== undefined) {
                    if ($.isFunction(options.cookieEncontrada))
                        options.cookieEncontrada(cookie);
                    that.delete(options.name);
                    return false;
                }
                timeLimit--;
                process();
            }, 200);
        })();
        function validateOptions (options) {
            return $.extend(true,{
                seconds: 30
            }, options);
        }    
    },
    create: function (name, val) {
        document.cookie = name + "=" + val;
    },
    delete: function (name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT;  path=/";
    },
    getVal:function (name) {
        var partes = document.cookie.split(name + "=");
        if (partes.length === 2)
            return partes.pop().split(";").shift();
    }    
};