
$(document).ready(function(){

  $('aside').simpleDrawer();

  $(".vtip").tipTip({
    defaultPosition: "right",
    maxWidth: '340px',
  });

  $('.chekcer').iCheck({checkboxClass: 'icheckbox_flat', radioClass: 'iradio_flat',});

  $('.gallery .bxslider').bxSlider({
    pagerCustom: '.gallery .bx-pager',
    captions: true,
  });

  $('.selectize').selectize();
  $('.selectize-grey').selectize();

  //set file input css
  ;( function( $, window, document, undefined )
    {
    	$( '.inputfile' ).each( function()
    	{
    		var $input	 = $( this ),
    			$label	 = $input.next( 'label' ),
    			labelVal = $label.html();

    		$input.on( 'change', function( e )
    		{
    			var fileName = '';

    			if( this.files && this.files.length > 1 )
    				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
    			else if( e.target.value )
    				fileName = e.target.value.split( '\\' ).pop();

    			if( fileName )
    				$label.find( 'span' ).html( fileName );
    			else
    				$label.html( labelVal );
    		});

    		// Firefox bug fix
    		$input
    		.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
    		.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
    	});
    })( jQuery, window, document );
    /////////////////////////////////

  //action menu

  $('.action-menu').hover(function(){
    var self = $(this);
    var t;

    self.find('.action-menu-block').fadeIn(10);
    self.addClass('selected');

    self.mouseleave(function(){
      t = setTimeout(function(){
        self.find('.action-menu-block').fadeOut('fast', function(){
          self.find('.action-menu-block').clearQueue();
          self.removeClass('selected');
        });

      },10)
    });

    self.find('.action-menu-block').hover(function(){
      clearTimeout(t);
    });

  });
  ///////////////////////////////////
});
