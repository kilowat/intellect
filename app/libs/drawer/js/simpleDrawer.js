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

    self.css({
      'width': settings.width + 'px',
      'left': '-' + settings.width + 'px',
      "display": 'block',
    });

   // drawerScroll = new IScroll('#' + self.attr('id'));


    function open() {
      self.animate({
        'left': "0"
      }, settings.animateTime);

      isOpen = true;
      $('body').append('<div id="drawer-overlay"></div>');

      $(settings.hamburgerClass).toggleClass('drawer-close');

    }

    function close() {
      self.animate({
        'left': "-=" + settings.width
      }, settings.animateTime, function () {
        $('#drawer-overlay').remove();
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
