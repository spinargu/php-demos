$.jNotification = function (options) {
    var $notification = $('#jNotification');
    var timeout = null;
    if($notification.length !== 0){
        $notification.remove();
        clearTimeout(timeout);
    }
    $notification = $(
        '<div id="jNotification" style="z-index: 99999" class="alert alert-' + options.type + ' alert-fixed-bottom">' +
        '<strong><i class="' + options.icon + '"></i></strong> ' + options.message +
        '<button class="btn btn-danger btn-sm pull-right"><i class="fa fa-times "></i></button>' +
        '</div>'
    ).hide().on('mouseenter', function () {
        clearTimeout(timeout);
    }).on('mouseleave', function () {
        var that = this;
        timeout = setTimeout(function () {
            $(that).slideUp('fast', function () {
                $(this).remove();
            })
        },10 * 1000)
    });
    $('button', $notification).click(function () {
        $(this).closest('#jNotification').slideUp('fast', function () {
            $(this).remove();
            clearTimeout(timeout);
        })
    });
    $('body').append($notification);
    $notification.slideDown('fast', function () {
        var that = this;
        timeout = setTimeout(function () {
            $(that).slideUp('fast', function () {
                $(this).remove();
            })
        },10 * 1000)
    });
};