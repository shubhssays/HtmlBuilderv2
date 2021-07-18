document.onreadystatechange = function () {
    let state = document.readyState

    if (state == 'interactive') {
        $('body').append(`<div id="loader">
        <div class="spinner-grow" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <span class="loader-text">Page loading...</span>
    </div>`)
    } else if (state == 'complete') {
        document.getElementById('interactive');
        document.getElementById('loader').style.visibility = "hidden";
    }
}




$(document).ready(function () {

    let isLeftSidebarShowing = true;

    $('#left-sidebar-toggler').click(function () {
        if (isLeftSidebarShowing) {
            $('#left-sidebar').css({
                'transform': 'translateX(-250px)'
            })

            $('#main-blog').css({
                'width': '100%'
            })

            $(this).html(`<i class="fas fa-angle-double-right"></i>`)
            isLeftSidebarShowing = false;

        } else {
            $('#left-sidebar').css({
                'transform': 'translateX(0)'
            })

            $('#main-blog').css({
                'width': 'calc(100% - 250px)'
            })
            $(this).html(`<i class="fas fa-angle-double-left"></i>`)
            isLeftSidebarShowing = true;
        }
    })

})