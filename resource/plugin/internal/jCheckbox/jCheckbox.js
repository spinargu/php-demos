$.widget("ui.jCheckbox", {
    options: {
        checks:[],
        on_click:function(){},
    },
    set_checked: function(set_checked){
        var $checks = $(this.element).find('input').parent();
        $checks.each(function (i, check) {
            var data = $(check).data('data');
            if($.isFunction(set_checked)){
                var checked = set_checked(data);
                if(checked)
                    $(check).find('input').attr('checked');
                else
                    $(check).find('input').removeAttr('checked');
            }
        });
    },
    get_checked_data: function () {
        var $checks = $(this.element).find('input:checked').parent();
        var result = [];
        $checks.each(function (i, check) {
            result.push($(check).data('data'))
        });
        $checks = $(this.element).find('input').parent();
        $checks.each(function(i,chk){
            if($(chk).data('data').action == 'remove')
                result.push($(chk).data('data'));
        });
        return result;
    },
    _create: function () {
        var that = this;
        var $container = $('<div class="jCheckbox"></div>');
        $.each(this.options.checks, function (i, check) {
            check = $.extend({
                label: 'Check',
                is_checked: false,
                data: null,
                name: '',
                show:false
            },check);
            that._create_check($container, check);
        });
        $(this.element).append($container);
        this._set_action_event();
    },
    _create_check: function ($container, check) {

        $check = $(
            '<label class="jCheckbox-container ">'+ check.label +
            '<input class="action" type="checkbox" "' + (check.is_checked ? 'checked' : '') + '">'+
            '<span class="jCheckbox-checkmark"></span>'+
            '<input name="'+check.name+'" class="well well-sm" type="text">'+
            '</label>'
        ).data('data', check.data);

        var $input=$('input[type=text]',$check);
        if(!check.show)
            $input.hide();

        $input.change(function(){
            check.data.name = $(this).val();
        });
        $container.append($check);
    },
    _set_action_event: function () {
        var that = this;
        var $input = $(this.element);
        var $container = $(this.element).closest('.jCheckbox').parent();
        $container.find('.action').click(function () {
            var check = $(this).closest('.jCheckbox-container').data('data') || {};
            var $chk =  $(this).closest('.jCheckbox-container');
              that.options.on_click.call($chk);
        });
    },

    destroy: function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    }
});