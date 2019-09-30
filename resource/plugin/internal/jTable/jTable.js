$.widget("ui.jTable", {
    options:{
        classes: 'table table-bordered',
        rows: [
            {
                cells:[]
            }
        ]
    },

    _create: function(){
        this._initialize();
        this._add_rows(this.options.rows);
    },
    _initialize: function () {
        $(this.element).addClass('jTable').append('<table class="jTable-main ' + this.options.classes + '" style="width: 100%"></table>');
    },
    _add_rows: function(rows){
        var $table = $(this.element).find('.jTable-main');
        var that = this;
        $.each(rows, function (i, row) {
            row = that._validate_row(row);
            var $row = that._create_row(row);
            $table.append($row);
        })
    },
    _create_row: function(row){
        var $row = $('<tr></tr>');
        this._add_cells($row, row.cells);
        return $row;
    },
    _add_cells: function($row, cells){
        var that = this;
        $.each(cells, function (i, cell) {
            cell = that._validate_cell(cell);
            var $cell = that._create_cell(cell);
            $row.append($cell);
        })
    },
    _create_cell: function(cell){
        var $cell = cell.header ? $('<th></th>') : $('<td></td>');
        if(cell.colspan)
            $cell.attr('colspan', cell.colspan);
        if(cell.rowspan)
            $cell.attr('rowspan', cell.rowspan);
        $cell.attr('class', cell.classes);
        $cell.attr('style', cell.style);
        if($.isFunction(cell.content)){
            cell.content.call($cell)
        }else{
            $cell.html(cell.content);
        }
        return $cell;
    },
    _validate_row: function (row) {
        return $.extend({
            cells: []
        }, row);
    },
    _validate_cell: function (cell) {
        return $.extend({
            header: false,
            colspan: null,
            rowspan: null,
            classes:'',
            style:'',
            content: ''
        }, cell);
    }

});