$.widget("ui.jSelect", {
	options:{
		data:[],
		message: {
			empty : "Sin datos",
			default: "Seleccione una opción"
		},
        onChange: function () {},
		callback: function () {},
		setOption: function (option) {
			return option
        },
		connection: {
            url: "",
            command: "",
            data: {},
            response: function (data) {
				return data;
            }
        },
		showDefault: true
	},
	_create: function(){
        var that = this;
        if (this.options.connection.url !== "") {
			$.jAjaxRequestManager({
                url: this.options.connection.url,
                command: this.options.connection.command,
                data: this.options.connection.data,
                cache: this.options.connection.cache,
                waitingAnimation: {
                    element: this.element
                },
                onSuccess: function (data) {
					data = that.options.connection.response(data);
                    that._addOptions(data);
                }
            });
		}else{
			this._addOptions(that.options.data);
		}
	},
	_addOptions: function(data){
		var that = this;
		$(this.element).on('change', function () {
		    var value = $(this).val();
            that.options.onChange.call(this, value);
        });
		if(data.length === 0){
			$(this.element).append('<option value="0">' + this.options.message.empty + '</option>');
			return;
		}
		if(this.options.showDefault)
			$(this.element).append('<option value="0">' + this.options.message.default + '</option>');
		
		$.each(data, function(index, option) {
			var $option = that._createOption(option);
			$(that.element).append($option);
	     });
		this.options.callback.call(this.element)
	},
	_createOption:function(option){
		option = this.options.setOption(option);
		return $('<option value="' + option.id + '">' + option.name + '</option>');
	}
	
});