(function () {
    $.fn.validate_custom_input = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            keypress: new RegExp("^[" + options.regex_text +"]{0," + options.lengthMax + "}$"),
            final: new RegExp("^[" + options.regex_text +"]{" + options.lengthMin + "," + options.lengthMax + "}$")
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateText = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            keypress: new RegExp("^[\n A-Za-z0-9 _ @.,;\"?¿¡!*\+/$&()#=%áéíóúñÁÉÍÓÚÑ-]{0," + options.lengthMax + "}$"),
            final: new RegExp("^[\n A-Za-z0-9 _ @.,;\"?¿¡!*\+/$&()#=%áéíóúñÁÉÍÓÚÑ-]{" + options.lengthMin + "," + options.lengthMax + "}$")
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateInteger = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            keypress: new RegExp("^[0-9]{0," + options.lengthMax + "}$"),
            final: new RegExp("^[0-9]{" + options.lengthMin + "," + options.lengthMax + "}$")
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateFloat = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            keypress: new RegExp("^[0-9]{0," + options.lengthMax + "}(\\.[0-9]{0,3})?$"),
            final: new RegExp("^[0-9]{" + options.lengthMin + "," + options.lengthMax + "}(\\.[0-9]{0,3})?$")
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateEmail = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            keypress: new RegExp('^[A-Za-z0-9\\._-]*@{0,1}[A-Za-z0-9_-]*\\.*[A-Za-z0-9_-]{0,3}(\\.[A-Za-z0-9_-]{0,3})?$'),
            final: new RegExp('^[A-Za-z0-9\\._-]+@[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]{2,3}(\\.[A-Za-z0-9_-]{2,3})?$')
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateZipCode = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            final: new RegExp('^\\d{5}$'),
            keypress: new RegExp('^\\d{0,5}$')
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateRFC = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            final: new RegExp('^[A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{1,4}([0-9]{1,2})([0][1-9]|[1][0-2]){0,2}([0-2][1-9]|[3][0-1]|[1-2][0]){0,2}([\\dA-Za-zÁáÉéÍíÓóÚú&ñÑ&]{0,2})([aA\\d]{0,1})$'),
            keypress: new RegExp('(^([A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{1,4})$)|(^([A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{3,4})([0-9]{0,2})$)|(^([A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{3,4})([0-9]{2})([0][1-9]?|[1][0-2]?)$)|(^([A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{3,4})([0-9]{2})([0][1-9]|[1][0-2])([0-2][1-9]?|[3][0-1]?|[1-2][0]?)$)|(^([A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{3,4})([0-9]{2})([0][1-9]|[1][0-2])([0-2][1-9]|[3][0-1]|[1-2][0])([\\dA-Za-zÁáÉéÍíÓóÚú&ñÑ&]{0,2})$)|(^([A-Za-zÁáÉéÍíÓóÚú&ñÑ&]{3,4})([0-9]{2})([0][1-9]|[1][0-2])([0-2][1-9]|[3][0-1]|[1-2][0])([\\dA-Za-zÁáÉéÍíÓóÚú&ñÑ&]{2})([aA\\d]{1})$)')
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
            $(this).on('keyup', function () {
                $(this).val($(this).val().toUpperCase());
            })
        });
    };
    $.fn.validateCURP = function (options) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var vowel = 'aeiouxAEIOUX';
        var consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
        options = setInputTextOptions(options);
        var regex = {
            final: new RegExp("^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{1}[" + chars + "]{2}[" + consonants + "]{3}[0-9," + chars + "]{1}[0-9]{1}$"),
            keypress: new RegExp("^[" + chars + "]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{0,2}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{0,2}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{1}[" + chars + "]{0,2}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{1}[" + chars + "]{2}[" + consonants + "]{0,3}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{1}[" + chars + "]{2}[" + consonants + "]{3}[0-9," + chars + "]{0,1}$|^[" + chars + "]{1}[" + vowel + "]{1}[" + chars + "]{2}[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[M,H,m,h]{1}[" + chars + "]{2}[" + consonants + "]{3}[0-9," + chars + "]{1}[0-9]{0,1}$")
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
            $(this).on('keyup', function () {
                $(this).val($(this).val().toUpperCase());
            })
        });
    };
    $.fn.validate_phone = function (options) {
        options = setInputTextOptions(options);
        var regex = {
            keypress: new RegExp("^[0-9 ,-]{0," + options.lengthMax + "}$"),
            final: new RegExp("^[0-9 ,-]{" + options.lengthMin + "," + options.lengthMax + "}$")
        };
        return $(this).each(function () {
            setInputTextValidation.call(this, options, regex);
        });
    };
    $.fn.validateSelect = function (options) {
        options = $.extend(true, {
            allowEmpty: true,
            message: {
                empty: ""
            }
        }, options);
        return $(this).each(function () {
            $(this).on('validate', function (e, value) {
                var options = $(this).data('validate-options');
                if (value === "0")
                    if (options.allowEmpty)
                        setInputTextStatus.call(this, 'valid');
                    else
                        setInputTextStatus.call(this, 'invalid', options.message.empty);
                else
                    setInputTextStatus.call(this, 'valid');
                $(this).closest('.form-group').find('.form-control-feedback').css('padding-right', '30px');
            }).on('change clean-validation', function () {
                setInputTextStatus.call(this);
            }).data('validate-options', options);
        });
    };
    $.fn.validateButton = function (options) {
        options = $.extend(true, {
            allowEmpty: true,
            message: {
                empty: ""
            },
        }, options);
        return $(this).each(function () {
            $(this).on('validate', function (e, value) {
                var options = $(this).data('validate-options');
                if(options.custom_validation){
                    var result = options.custom_validation.call(this, value);
                    if(result.valid)
                        setInputTextStatus.call(this, 'valid');
                    else
                        setInputTextStatus.call(this, 'invalid', result.message);
                }else{
                    if (value === undefined)
                        if (options.allowEmpty)
                            setInputTextStatus.call(this, 'valid');
                        else
                            setInputTextStatus.call(this, 'invalid', options.message.empty);
                    else
                        setInputTextStatus.call(this, 'valid');
                }
            }).on('clean-validation', function () {
                setInputTextStatus.call(this);
            }).data('validate-options', options);
        });
    };
    $.fn.validateDate = function (options) {
        options = $.extend(true, {
            allowEmpty: true,
            message: {
                empty: ""
            }
        }, options);
        return $(this).each(function () {
            $(this).on('validate', function (e, value) {
                var options = $(this).data('validate-options');
                if (value === null)
                    if (options.allowEmpty)
                        setInputTextStatus.call(this, 'valid');
                    else
                        setInputTextStatus.call(this, 'invalid', options.message.empty);
                else
                    setInputTextStatus.call(this, 'valid');
                // $(this).closest('.form-group').find('.form-control-feedback').css('padding-right', '30px');
            }).on('dp.change clean-validation', function () {
                setInputTextStatus.call(this);
            }).data('validate-options', options);
        });
    };
    $.fn.validateMoney = function (options) {
        options = setInputTextOptions(options);
        return $(this).each(function () {
            setInputMoneyValidation.call(this, options);
        });
    };
    $.fn.autoresize = function () {
        return $(this).each(function () {
            validate_height($(this));
            $(this).on('keyup', function () {
                validate_height($(this))
            });
        });
        function validate_height($element) {
            if(!$element.is(':visible'))
                setTimeout(function () {
                    validate_height($element);
                }, 500)
            var element = $element[0];
            var vertical_scroll = element.scrollHeight > element.clientHeight;
            if (vertical_scroll) {
                $element.height($element.height() + 1);
                validate_height($element)
            }
        }
    };
    $.fn.sanitize = function sanitize(value) {
        // var temp = "",
        //     testPlusChar = "";
        // for (i=0;i<value.length;i++) {
        //     var iPlusOne = i+1;
        //     testPlusChar += value.substring(i,iPlusOne);
        //     if ((!regex.test(testPlusChar))) {
        //         var lastChar = testPlusChar.length;
        //         temp = testPlusChar.substring(0,lastChar);
        //         testPlusChar = temp;
        //     }
        // }
        // return testPlusChar;

        var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

        for (var i = 0; i < specialChars.length; i++) {
          value= value.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }

        value = value.replace(/á/gi,"a");
        value = value.replace(/é/gi,"e");
        value = value.replace(/í/gi,"i");
        value = value.replace(/ó/gi,"o");
        value = value.replace(/ú/gi,"u");
        value = value.replace(/ñ/gi,"n");
        value = value.replace(/\u0301/g,"");
        return value.substring(0,100);
    };

    function setInputTextOptions(options) {
        return $.extend(true, {
            allowEmpty: true,
            regex_text: '',
            setKeyPressRegex: true,
            lengthMax: 0,
            lengthMin: 0,
            wordsMax: 0,
            wordsMin: 0,
            message: {
                empty: "",
                error: ""
            }
        }, options);
    }

    function setInputTextValidation(options, regex) {
        var that = this;
        if (options.setKeyPressRegex)
            $(that).limitkeypress({
                rexp: regex.keypress
            });
        $(this).on('validate', function (e, value) {
            var options = $(this).data('validate-options');
            value = value.trim();
            if (value === "")
                if (options.allowEmpty)
                    setInputTextStatus.call(this, 'valid');
                else
                    setInputTextStatus.call(this, 'invalid', options.message.empty)
            else if (regex.final.test(value))
                setInputTextStatus.call(this, 'valid');
            else
                setInputTextStatus.call(this, 'invalid', options.message.error)
        }).on('keydown clean-validation', function () {
            setInputTextStatus.call(this);
        }).data('validate-options', options);
    }

    function setInputMoneyValidation(options) {
        var that = this;
        $(this).on('validate', function (e, value) {
            var options = $(this).data('validate-options');
            if (value === 0)
                if (options.allowEmpty)
                    setInputTextStatus.call(this, 'valid');
                else
                    setInputTextStatus.call(this, 'invalid', options.message.empty)
            else
                setInputTextStatus.call(this, 'valid');
        }).on('keydown clean-validation', function () {
            setInputTextStatus.call(this);
        }).data('validate-options', options);
    }

    function setInputTextStatus(status, message) {
        var $formGroup = $(this).closest('.form-group');
        var $icon = $('.form-control-feedback', $formGroup);
        var $helper = $('.help-block', $formGroup);

        $formGroup.removeClass().addClass('form-group has-feedback');
        $icon.removeClass().addClass('form-control-feedback');
        $helper.remove();
        $(this).removeData('invalid');
        switch (status) {
            case "valid":
                $(this).removeData('invalid');
                $formGroup.addClass('has-success');
                $icon.addClass('glyphicon glyphicon-ok');
                break;
            case "invalid":
                $(this).data('invalid', true);
                $formGroup.addClass('has-error');
                $icon.addClass('glyphicon glyphicon-remove');
                $formGroup.append('<span class="help-block">' + message + '</span>');
                break;
        }
    }
})();