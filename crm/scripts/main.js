(function ($)
  { "use strict"

// mobile_menu
var menu = $('ul#navigation');
if(menu.length){
  menu.slicknav({
    prependTo: ".mobile_menu",
    closedSymbol: '+',
    openedSymbol:'-'
  });
};


  var nice_Select = $('select');
    if(nice_Select.length){
      nice_Select.niceSelect();
    }

/* 7.  Custom Sticky Menu  */
$(window).on('scroll', function () {
  var scroll = $(window).scrollTop();
  if (scroll < 245) {
    $(".header-sticky").removeClass("sticky-bar");
  } else {
    $(".header-sticky").addClass("sticky-bar");
  }
});

$(window).on('scroll', function () {
  var scroll = $(window).scrollTop();
  if (scroll < 245) {
      $(".header-sticky").removeClass("sticky");
  } else {
      $(".header-sticky").addClass("sticky");
  }
});


/* sildeBar scroll */
    $.scrollUp({
      scrollName: 'scrollUp', // Element ID
      topDistance: '300', // Distance from top before showing element (px)
      topSpeed: 300, // Speed back to top (ms)
      animation: 'fade', // Fade, slide, none
      animationInSpeed: 200, // Animation in speed (ms)
      animationOutSpeed: 200, // Animation out speed (ms)
      scrollText: '<i class="icon-up-open-mini"></i>', // Text for element
      activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    });


/* 9. data-background */
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
      });


/* 10. WOW active */
var wow = new WOW({
  boxClass: 'wow',
  offset: 10
});
wow.init();

/* 11. cards */
$('.card').hover(function(){
    $("#standard-card").removeClass("active");
});

$('.l-chartNews .slider-text .slider').slick({
    fade: true,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    asNavFor: '.l-chartNews .slider-info .slider'
});
$('.l-chartNews .slider-info .slider').slick({
    fade: true,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    asNavFor: '.l-chartNews .slider-text .slider'
});

$('#solutions').each(function(){
  $('header').addClass('white');
});

$('.lang-btn').click(function () {
  $('.lang-nav').slideToggle();
  $('.member-nav').slideUp();
});

$("a.anchor").on('click', function (event) {

  if (this.hash !== "") {
    event.preventDefault();

    // Store hash
    var hash = this.hash;

    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function () {

      window.location.hash = hash;
    });
  } // End if
});

$('#contact-us').on('show.bs.modal', function (e){
	let title = $(e.relatedTarget)[0].dataset.title;
	let modal_title = document.getElementById('contact-us-title');
	
	modal_title.innerHTML = title;
});

$('#start-free').on('show.bs.modal', function (e){
	let title = $(e.relatedTarget)[0].dataset.title;
	let modal_title = document.getElementById('start-free-title');
	
	modal_title.innerHTML = title;
});

$('#submit-btn').click(function(e){
	console.log('please write submit event here')
})

})(jQuery);
