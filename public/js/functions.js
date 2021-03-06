var wH = $(window).height(),
  wW = $(window).width(),
  ua = navigator.userAgent,
  touchendOrClick = (ua.match(/iPad|iPhone|iPad/i)) ? "touchend" : "click",

  deviceAgent = navigator.userAgent.toLowerCase(),
  isMobile = deviceAgent.match(/(iphone|ipod|ipad)/);

if (isMobile || wW <= 767) {
  $('body').addClass('is_mobile');
} else {
  $('body').removeClass('is_mobile');
}

function initResize() {
  $(window).resize(function() {
    setTimeout(function() {
      $('.header_container').css({
        height: $('.header').outerHeight()
      });
    }, 30);

    $('.video iframe').css({
      maxHeight: $(window).outerHeight() - $('header').outerHeight()
    });

    $('body').css({
      paddingBottom: $('footer').outerHeight()
    })
  }).trigger('resize');
}

function initEventsOnClick() {
  // Tel
  if (!isMobile) {
    $('body').on('click', 'a[href^="tel:"]', function() {
      $(this).attr('href',
        $(this).attr('href').replace(/^tel:/, 'callto:'));
    });
  }
}

function initEventsOnScroll() {
  $(window).scroll(function() {

    var scrollPosition = $(window).height() + $(window).scrollTop(),
        visibleArea = $(document).height() - $('.footer').outerHeight(),
        limit = 20;

    if(scrollPosition > visibleArea + limit) {
      $('body').addClass('footer_in_view').find('#launcher, .btn_feedback').css({
        bottom: $('.footer').outerHeight()
      });
    }

    else {
      $('body').removeClass('footer_in_view').find('#launcher, .btn_feedback').css({
        bottom: 0
      })
    }
  }).trigger('scroll');
}


// Header

function initHeader() {
  if (isMobile || wW <= 768) {
    $('.header_nav .nav_list__item > a').on('click', function(e) {
      e.stopPropagation();

      var href = $(this).attr('href');

      if (!$(this).parent('.nav_list__item').hasClass('nav_list__item--selected')) {
        $('.header_nav').addClass('header_nav--selected');
        $('.header_nav .nav_list__item').removeClass('nav_list__item--selected');
        $(this).parent('.nav_list__item').addClass('nav_list__item--selected');
        e.preventDefault();
      } else {
        return true;
      }
    });

  } else {
    hideSubMenu();
  }

  $('.btn_menu').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    $('body').addClass('body--menu_opened');
    $('.sidebar_menu').addClass('sidebar_menu--open');
  });

  $('.sidebar_menu, .header_search').on('click', function(e) {
    e.stopPropagation();
  });

  $('body, .btn_close_menu, .menu_overlay, .btn_close_header').on('click', function() {
    $('body').removeClass('body--menu_opened body--search_showed');
    $('.sidebar_menu').removeClass('sidebar_menu--open');
    $('.header_search').removeClass('header_search--show');
    hideSubMenu();
  });

  $('.btn_open_search').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    $('body').addClass('body--search_showed');
    $('.header_search').addClass('header_search--show');
  });
}

function hideSubMenu() {
  $('.header_nav').removeClass('header_nav--selected');
  $('.nav_list__item').removeClass('nav_list__item--selected');
}


// Smooth scroll

function initSmoothScroll() {
  $('.smooth_scroll').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash),
          offset = $(this).data('scroll-offset') ? $(this).data('scroll-offset') : 0;
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - offset
        }, 1000);
        return false;
      }
    }
  });
}


// Affix

function initAffix() {
  $('.btn_affix').affix({
    offset: {
      top: function () {
        return (this.top =  $('.site_nav').offset().top - $('.header_container').outerHeight())
      }
    }
  });

  $(window).resize(function() {
    $('.btn_affix').css({
      right: $('.header .container').offset().left + 15
    })
  }).trigger('resize')
}

function initStickyNav() {
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navHeight = $('.header_nav').outerHeight();

  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta) {
      return;
    }

    if (st > lastScrollTop && st > navHeight){
      // Scroll Down
      hideSubMenu();
      $('.header_nav, .header, .btn_affix')
        .removeClass('nav_down')
        .addClass('nav_up');
    } else {
      // Scroll Up
      hideSubMenu();
      if(st + $(window).height() < $(document).height()) {
        $('.header_nav, .header, .btn_affix')
          .removeClass('nav_up')
          .addClass('nav_down')
      }
    }

    lastScrollTop = st;
  }

  $(window).resize(function() {
    setTimeout(function() {
      $('.header_nav').css({
        paddingTop: $('.header').outerHeight()
      });
    }, 30)
  }).trigger('resize');
}


// Fileupload

function initFileUpload() {
  $('._upload_file').on(touchendOrClick, function (e) {
    e.preventDefault();

    var id = $(this).data('file-id');

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $(id).parents('.fileupload')
            .removeClass('fileupload--fail')
            .addClass('fileupload--uploaded')
            .attr('style', 'background-image: url('+ e.target.result +')')
            .find(".fileupload__field").val(e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
      }
    }

    $(id).click().on('change', function () {
      readURL(this);
    })
  })
}

function pie() {
  if ($('.pie').length) {
    function cssTransform(degs) {
      return "rotate(" + degs + "deg) translate(0, -25%)";
    }

    var Pie = function(el, options, color = true) {
      options = options || {};
      options.color = options.color || 'white';
      options.backgroundColor = options.backgroundColor || 'black';

      this.el = el;
      this.inner = this.el.querySelector('.pie_inner');
      this.blocker1 = this.el.querySelector('.pie_blocker-1');
      this.blocker2 = this.el.querySelector('.pie_blocker-2');
      this.pieLeft = this.el.querySelector('.pie_circle-left');
      this.pieRight = this.el.querySelector('.pie_circle-right');

      if (color) {
        this.pieLeft.style.backgroundColor = options.color;
        this.pieRight.style.backgroundColor = options.color;
      }

      this.blocker1.style.backgroundColor = options.backgroundColor;
      this.blocker2.style.backgroundColor = options.backgroundColor;

    };

    Pie.prototype.set = function(percentage) {
      this.percentage = percentage
      this.degs = 360 * this.percentage;

      var degs1 = this.degs > 180 ? 180 : this.degs;
      var degs2 = this.degs > 180 ? this.degs - 180 : 0;

      this.blocker1.style.webkitTransform = cssTransform(degs1);
      this.blocker2.style.webkitTransform = cssTransform(degs2);
    };

// DEMO

    var pie = new Pie(document.querySelector('.pie'), {
        mask: true,
        color: '#0388ef',
        backgroundColor: '#f3f4f5'
      },
      false
    );

    var percent = 0;

    function incrementPie() {
      if (percent >= 100) percent = 0;
      pie.set(percent++ * 0.01);
    }

    setInterval(incrementPie, 600);
  }
}


// Init

$(document).ready(function() {
  initResize();
  initEventsOnClick();
  initEventsOnScroll();
  initHeader();
  initStickyNav();
  initSmoothScroll();
  initAffix();
  initFileUpload();
  pie();
});

