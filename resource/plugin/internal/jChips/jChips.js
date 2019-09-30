$.widget("ui.jChips", {
    options: {
        _space_type: '<<>>',
        chips: [],
        excluded_chips:[],
        on_select_space:function () { },
        on_chips_change: function() { },
        on_add_excluded_chip_message:function (label) {
            return 'No se permite agregar el elemento <b>' + label + '</b>';
        },
    },
    add_chip: function(validate_excluded, chip){
        var that = this;
        var $space = this._get_selected_space_or_last();
        chip = this._validate_chip(chip);
        var parts = chip.label.split('<<>>');
        var guid = $.get_guid();
        $.each(parts, function (i, label) {
            if(validate_excluded && $.get_bool($.inArray(label, that.options.excluded_chips) + 1)){
                that._on_add_excluded_chip(label);
                return;
            }
            var part = $.extend({}, chip, {
                guid: guid,
                label: label
            });
            var $chip = that._create_chip(part);
            var added = that._add_chip($space, $chip);
            $space = added.after;
            if(parts.length > 1 && i === 1)
                that._select_space(added.before);
            else
                that._select_space(added.after);
        });
        var chips_string = this._get_chips_string();
        this.options.on_chips_change(chips_string);
    },
    get_chips_string: function(){
        return this._get_chips_string();
    },
    clean_state: function(){
        $(this.element).find('.jChips').removeClass('bg-danger')
    },
    set_error_state: function(){
        $(this.element).find('.jChips').addClass('bg-danger')
    },
    _create: function () {
        this._initialize();
        this._add_chips();
        this._add_container_events();
    },
    _initialize: function () {
        $(this.element).append('<div class="jChips"></div>');
    },
    _add_chips: function(){
        var that = this;
        var $chips = $(this.element).find('.jChips');
        var $space = this._create_space();
        $chips.append($space);
        $.each(this.options.chips, function (i, chip) {
            var guid = $.get_guid();
            chip = that._validate_chip(chip);
            chip.guid = guid;
            var $chip = that._create_chip(chip);
            var result = that._add_chip($space, $chip);
            $space = result.after;
        });
        var chips_string = this._get_chips_string();
        this.options.on_chips_change(chips_string);
    },
    _add_chip: function($space, $chip){
        $space.after($chip);
        $space.remove();
        var $before = this._create_space();
        var $after = this._create_space();
        $chip.before($before);
        $chip.after($after);
        return {
            chip: $chip,
            before: $before,
            after: $after
        }
    },
    _add_container_events: function(){
        var that = this;
        $(this.element).on('click', function (e) {
            e.stopPropagation();
            that._unselect_chips();
            that._unselect_spaces();
        })
    },
    _remove_chip: function($chip, all_parts){
        var that = this;
        if(all_parts){
            var chip_data = $chip.data('data');
            var parts = $('.chip.' + chip_data.guid);
            $.each(parts, function (i, part) {
                $(part).next().hide('fast', function () {
                    $(this).remove();
                });
                $(part).hide('fast', function () {
                    $(this).remove();
                    var chips_string = that._get_chips_string();
                    that.options.on_chips_change(chips_string);
                })
            });
        }else{
            $chip.next().hide('fast', function () {
                $(this).remove();
            });
            $chip.hide('fast', function () {
                $(this).remove();
                var chips_string = that._get_chips_string();
                that.options.on_chips_change(chips_string);
            })
        }
        var chips_string = this._get_chips_string();
        this.options.on_chips_change(chips_string);
    },
    _create_chip: function(options){
        var that = this;
        var $chip = $(
            '<div class="chip ' + options.guid + '">' +
                '<div class="chip-text">' + options.label + '</div>' +
                '<div class="btn-group btn-group-xs chip-actions" role="group">' +
                    '<button class="btn btn-default chip-move"><i class="fa fa-arrows"></i></button>' +
                    '<button class="btn btn-danger chip-delete"><i class="fa fa-times"></i></button>' +
                '</div>' +
            '</div>'
        ).data('data', options);
        var $chip_delete = $chip.find('.chip-delete');
        var $chip_move = $chip.find('.chip-move');
        if(!options.delete)
            $chip_delete.remove();
        else
            $chip_delete.hide().on('click', function (e) {
                e.stopPropagation();
                var $chip = $(this).closest('.chip');
                that._remove_chip($chip, true);
            });
        if(!options.move)
            $chip_move.remove();
        else
            $chip_move.hide().on('click', function (e) {
                e.stopPropagation();
                var $chip = $(this).closest('.chip');
                that._set_chip_to_move($chip);
            });
        $chip.on('click', function (e) {
            e.stopPropagation();
            that._select_chip($(this));
        });
        return $chip;
    },
    _create_space: function(){
        var $space = $('<div class="chip-space">_</div>');
        var that = this;
        $space.on('click', function (e) {
            e.stopPropagation();
            that._select_space($(this));
        });
        return $space;
    },
    _get_selected_space_or_last: function(){
        var $selected = $('.chip-space.chip-space-selected');
        if($selected.length === 0)
            return $('.chip-space').last();
        return $selected
    },
    _get_chips_string: function(){
        var $chips = $(this.element).find('.chip');
        var result = '';
        $.each($chips, function (i, chip) {
            var chip_data = $(chip).data('data');
            result += chip_data.label;
        });
        return result;
    },
    _select_chip: function($chip){
        var chip_data = $chip.data('data');
        var parts = $('.chip.' + chip_data.guid);
        var selected = $chip.hasClass('chip-selected');
        this._unselect_chips();
        this._unselect_spaces();
        if(selected && $chip.find('.chip-delete').is(':visible'))
            $chip.find('.chip-move, .chip-delete').hide('fast');
        else
            $chip.find('.chip-move, .chip-delete').show('fast');

        $.each(parts, function (i, part) {
            if(selected && $chip.find('.chip-delete').is(':visible'))
                $(part).removeClass('chip-selected');
            else
                $(part).addClass('chip-selected');
        });
    },
    _select_space: function($space){
        var $chip_to_move = $(this.element).find('.chip.chip-to-move');
        if($chip_to_move.length === 0){
            var selected = $space.hasClass('chip-space-selected');
            this._unselect_chips();
            this._unselect_spaces();
            if(selected)
                $space.removeClass('chip-space-selected');
            else{
                this.options.on_select_space();
                $space.addClass('chip-space-selected');
            }
        }else{
            var new_chip_data = $chip_to_move.data('data');
            var $new_chip = this._create_chip(new_chip_data);
            var $next_space = $chip_to_move.next();
            var $prev_space = $chip_to_move.prev();
            if($space.is($next_space) || $space.is($prev_space))
                this._unselect_chips();
            else{
                this._remove_chip($chip_to_move, false);
                this._add_chip($space, $new_chip);
                var chips_string = this._get_chips_string();
                this.options.on_chips_change(chips_string);
            }
        }
    },
    _set_chip_to_move: function($chip){
        this._unselect_chips();
        $chip.addClass('chip-to-move');
    },
    _unselect_chips: function(){
        $('.chip').removeClass('chip-selected chip-to-move');
        $('.chip-delete').hide('fast');
        $('.chip-move').hide('fast');
    },
    _unselect_spaces: function(){
        $('.chip-space').removeClass('chip-space-selected');
    },
    _on_add_excluded_chip: function(label){
        var message = this.options.on_add_excluded_chip_message(label);
        $.jNotification({
            type: 'danger',
            icon: 'fa fa-times-circle',
            message: message
        });
    },
    _validate_chip: function(options){
        return $.extend({
            delete: true,
            move: true,
            label: "chip"
        }, options)
    },
    destroy: function () {
        $.Widget.prototype.destroy.apply(this);
    }
});