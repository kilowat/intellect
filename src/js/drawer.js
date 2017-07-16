(function ($) {


  $.fn.simpleDrawer = function (options) {
    var isOpen = false;
    var self = this;
    var settings = $.extend({
      'width': 280,
      'animateTime': 100,
      'hamburgerClass': '.drawer-hamburger'
    });

    var hamburgerLeft = $(settings.hamburgerClass).position().left;

    if(innerWidth <=1000)
      self.addClass('is-drawer');

    self.css({
      //'width': settings.width + 'px',
      'left': '-' + settings.width + 'px',
    });

   // drawerScroll = new IScroll('#' + self.attr('id'));


    function open() {
      self.animate({
        'left': "0"
      }, settings.animateTime);

      self.addClass('is-drawer');
      isOpen = true;
      $('body').append('<div id="drawer-overlay"></div>');

      $(settings.hamburgerClass).toggleClass('drawer-close');

    }

    function close() {
      self.animate({
        'left': "-=" + settings.width
      }, settings.animateTime, function () {
        $('#drawer-overlay').remove();
        self.removeClass('is-drawer');
      });

      $(settings.hamburgerClass).toggleClass('drawer-close');

      isOpen = false;
    }
/*
    $("body").swipe({
      allowPageScroll:"vertical",
      swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        if (direction === "left" || direction === "right") {
          if (isOpen) {
            close();
          } else {
            open();
          }
        }
      }
    });
*/
    $(settings.hamburgerClass).click(function () {
      if (isOpen) {
        close();
      } else {
        open();
      }
    });
    return this;
  };
})(jQuery);
