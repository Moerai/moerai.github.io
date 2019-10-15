var nowIdx1 = 0, nowIdx2= 0, nowIdx3 = 0;

jQuery(function($) {
	if($('.recommend_option').length) {
		getMonthlySelection();	
	}
	
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip();
	
	lightbox.option({
      'maxHeight': 380,
      'albumLabel': '%1 / %2'
    })
	
	
	$('.nav.nav-pills .none-tab').click(function(){
		$('.nav.nav-pills').removeClass('view');
		return false;
	});
	$('.nav.nav-pills').click(function(){
		if($(this).hasClass('view')){
			$(this).removeClass('view');
		}else{
			$(this).addClass('view');
		}
	});
	$('.nav.nav-pills li').click(function(){
		if(!$(this).hasClass('none-tab')){
			$('.nav.nav-pills li').removeClass('active');
			$(this).addClass('active');
		}
	});
	
	var element = document.querySelector('.highlight'); 	
	
	// header main menu
	
	var lastScrollTop = 0;
	$(window).scroll(function(event){
	   var st = $(this).scrollTop();
	   if (st >lastScrollTop){
	       $('header,.affixed').removeClass('up');
	   } else  if(st < lastScrollTop){
   		   if(st < 160){
			   $('header,.affixed').addClass('up');
		   }
	   }
	   lastScrollTop = st;
	});
	
	/*
	$('.main-menu').hover(function(){ // mouse over
		$('.main-nav').addClass('hover');
		$('.main-menu > li').mouseenter(function(){
			if($(this).find(".sub").length > 0){
				if($('.main-nav').hasClass("hover_none")){
					$('.main-nav').removeClass('hover_none');
				}
			}else{
				$('.main-nav').addClass('hover_none');
			}
		});
	},function(){
		$('.main-nav').removeClass('hover');
		$('.main-nav').removeClass('hover_none');
	});
	*/
	
	
	$('.main-menu').hover(function(){ // mouse over
		$('.main-nav').addClass('hover');
	},function(){
		$('.main-nav').removeClass('hover');
		$('.main-nav').removeClass('hover_none');
	});

	$('.main-menu > li').mouseenter(function(){
		if($(this).find(".sub").length > 0){
			if($('.main-nav').hasClass("hover_none")){
				$('.main-nav').removeClass('hover_none');
			}
		}else{
			$('.main-nav').addClass('hover_none');
		}
	});
	
	
	$('.main-menu a').focusin(function(){ // focus in
		$(this).parents('li').addClass('hover');
		$('.main-nav').addClass('hover');
	});
	$('.main-menu a').focusout(function(){ // focus out
		$(this).parents('li').removeClass('hover');
		$('.main-nav').removeClass('hover');
	});
	
	
	if( $('#main_slide_bg').length ){
		var mainBGSwiper = new Swiper('#main_slide_bg .swiper-container', {
		    speed: 400,
		    slidesPerView:1,
		    effect: 'fade',
		    loop:true,
		    touchRatio: 0,
		     autoplay: false,/*{
			    delay: 4000,
			    disableOnInteraction : true
		    }*/
			pagination: {
				el: '.swiper-pagination',
				clickable: false,
			}
		    
		});
	}	
	
	if( $('#main_slide_navi').length ){
		var mainSwiper = new Swiper('#main_slide_navi .swiper-container', {
		    speed: 400,
		    slidesPerView:3,
		    centeredSlides: true,
		    breakpoints: {
				1024: { slidesPerView: 1 }
			},
		    loop:true,
		    autoplay: {
			   delay: 4000,
			   disableOnInteraction : false
		    },
			pagination: {
				el: '.swiper-pagination',
				clickable: false,
			}
		});
	}
	
	if( $('.swiper-container-list').length ){
		var mainListSwiper = new Swiper('.swiper-container-list', {
		    speed: 400,
		    slidesPerView:1,
		    loop:true,
		    touchRatio: 0,
		     autoplay:false,/* {
			    delay: 4000,
			    disableOnInteraction : true
		    }*/
			pagination: {
				el: '.swiper-pagination',
				clickable: false,
			}
		    
		});
	}
	
	if( $('#main_slide_navi').length ){	
		mainSwiper.on('slideNextTransitionStart', function () {
            if($(window).width() > 1024){
                nowIdx1 = ( mainSwiper.activeIndex+($('#main_slide_navi .swiper-pagination .swiper-pagination-bullet').length)-2) % $('#main_slide_navi .swiper-pagination .swiper-pagination-bullet').length ;
            }else{
                nowIdx1 =  mainSwiper.activeIndex % $('#main_slide_navi .swiper-pagination .swiper-pagination-bullet').length;
            }
			mainBGSwiper.slideNext();
			mainListSwiper.slideNext();

		});
		mainSwiper.on('slidePrevTransitionStart', function () {
			nowIdx1 = ( mainSwiper.activeIndex+($('#main_slide_navi .swiper-pagination .swiper-pagination-bullet').length)-2) % $('#main_slide_navi .swiper-pagination .swiper-pagination-bullet').length ;
			mainBGSwiper.slidePrev();
			mainListSwiper.slidePrev();			
		});

		mainBGSwiper.on('slideNextTransitionEnd', function () {			
			nowIdx2 =  mainBGSwiper.activeIndex % $('#main_slide_bg .swiper-pagination .swiper-pagination-bullet').length;
			if(nowIdx1 != nowIdx2) mainBGSwiper.slideNext();
		});
		mainBGSwiper.on('slidePrevTransitionEnd', function () {		
			nowIdx2 =  mainBGSwiper.activeIndex % $('#main_slide_bg .swiper-pagination .swiper-pagination-bullet').length;
			if(nowIdx1 != nowIdx2) mainBGSwiper.slidePrev();
		});
		mainListSwiper.on('slideNextTransitionEnd', function () {			
			nowIdx3 =  mainListSwiper.activeIndex % $('.swiper-container-list .swiper-pagination .swiper-pagination-bullet').length 	;
			if(nowIdx1 != nowIdx3) mainListSwiper.slideNext(1);
		});

		mainListSwiper.on('slidePrevTransitionEnd', function () {		
			nowIdx3 =  mainListSwiper.activeIndex % $('.swiper-container-list .swiper-pagination .swiper-pagination-bullet').length 	;
			if(nowIdx1 != nowIdx3) mainListSwiper.slidePrev(1);

		});
	}
	
	
	
	
	
	
	
	$('.main_view_next').click(function(){
//		mainBGSwiper.slideNext();
		mainSwiper.slideNext();
//		mainListSwiper.slideNext();
	});
	$('.main_view_prve').click(function(){
//		mainBGSwiper.slidePrev();
		mainSwiper.slidePrev();
//		mainListSwiper.slidePrev();
	});
	
	$('.main_view_stop').click(function(){
//		mainBGSwiper.autoplay.stop();
		mainSwiper.autoplay.stop();
//		mainListSwiper.autoplay.stop();
		$(this).addClass('hidden');
		$('.main_view_play').removeClass('hidden');
	});
	$('.main_view_play').click(function(){
//		mainBGSwiper.autoplay.start();
		mainSwiper.autoplay.start();
//		mainListSwiper.autoplay.start();
		$(this).addClass('hidden');
		$('.main_view_stop').removeClass('hidden');
	});
	
	if( $('#swiper_slide_scroll').length ){
		var swiper_scroll = new Swiper('#swiper_slide_scroll .swiper-container', {
				//width:1140,
				slidesPerView:4,
				loop:true,
				spaceBetween: 20,							
				scrollbar: {
					el: '.swiper-scrollbar',
					hide: true,
				},
				breakpoints: {
					2070: { slidesPerView: 3},
					1500: { slidesPerView: 2},
					640: { slidesPerView: 1}
				}
				
		});
	}

	bhover_swiper();
	
	
	
	
	
	$('header .user-menu .search').click(function(){ // 검색 레이어 열기
		$('.layer-bg').remove();
		$('.header-sitemap').removeClass('active');
		$('.header-search-layer').addClass('active');
		$('body').append('<div class="layer-bg"></div>');
		//$('html,body').css({'overflow-y':'hidden'});
		return false;
	});
	$('body').on('click','header .header-search-close',function(){ // 검색 레이어 닫기
		$('.header-search-layer').removeClass('active');
		$('.layer-bg').remove();
		//$('html,body').css({'overflow-y':'auto'});
	});
	
	
	$('header .user-menu .sitemap').click(function(){ // 사이트맵 레이어 열기
		$('.layer-bg').remove();
		$('.header-search-layer').removeClass('active');
		$('.header-sitemap').addClass('active');
		$('body').append('<div class="layer-bg"></div>');
		//$('html,body').css({'overflow-y':'hidden'});
		return false;
	});
	$('body').on('click','header .header-sitemap-close',function(){ // 사이트맵 레이어 닫기
		$('.header-sitemap').removeClass('active');
		$('.layer-bg').remove();
		//$('html,body').css({'overflow-y':'auto'});
	});
	
	$('body').on('click','.layer-bg',function(){ // 배경 클릭시 검색 레이어 및 사이트맵 닫기
		$('.header-search-layer').removeClass('active');
		$('.header-sitemap').removeClass('active');
		$('.layer-bg').remove();
		//$('html,body').css({'overflow-y':'auto'});
	});
	
	
	
	$('body').on('click','.open_3depth',function(){
		
		var width = $('body').width();
		//alert(width);
		if(width > 767){
			if($(this).hasClass('open')){
				$(this).removeClass('open');
				$(this).parent('li').removeClass('active');
			}else{
				$(this).addClass('open');
				$(this).parent('li').addClass('active');
			}
		}else{
			
			$('.depth02 li').removeClass('active');
			
			$(this).parent('li').addClass('active');
			
			if($(this).hasClass('open')){
				$(this).removeClass('open');
				$(this).parent('li').removeClass('active');
			}else{
				$('.depth02 li .open_3depth.open').removeClass('open');
				$(this).addClass('open');
			}
			
		}
	});

    $('body .depth01 li > span').click(function(){
        $('.depth01 li').removeClass('active');
        $(this).parent('li').addClass('active');
        
        if(!$(this).parents(".header-sitemap-content").hasClass("on")){
			$(this).parents(".header-sitemap-content").addClass("on");
		}
    });

	var searchOptions = {
		url: function(phrase) {
			return "./getAutoComplete.do";
		},
		getValue: function(element) {
			return element.title;
		},

		ajaxSettings: {
			dataType: "json",
			method: "GET",
			data: {
			}
		},
		preparePostData: function(data) {
			data.phrase = $("#keyword").val();
			return data;
		},
		list: {
			match: {
				enabled: true
			}
		},
		theme: "square"
	};

	var searchOptions2 = {
		url: function(phrase) {
			return "./getAutoComplete.do";
		},
		getValue: function(element) {
			return element.title;
		},

		ajaxSettings: {
			dataType: "json",
			method: "GET",
			data: {
			}
		},
		preparePostData: function(data) {
			data.phrase = $("#keywords").val();
			return data;
		},
		list: {
			match: {
				enabled: true
			}
		},
		theme: "square"
	};

	//헤더의 자동완성
	if( $('#keyword').length ){
		$("#keyword").easyAutocomplete(searchOptions);
	}

	//검색결과 body의 자동완성
	if( $('#keywords').length ){
		$("#keywords").easyAutocomplete(searchOptions2);
	}
	
	
	// 알림탭
	$('.none-tab a[data-toggle="modal"]').click(function(){
		var target = $(this).data('target');
		$(target).modal();
	});
	
	
});






function geSlideDataIndex(swipe){
    var activeIndex = swipe.activeIndex;
    var slidesLen = swipe.slides.length;
    if(swipe.params.loop){
        switch(swipe.activeIndex){
            case 0:
                activeIndex = slidesLen-3;
                break;
            case slidesLen-1:
                activeIndex = 0;
                break;
            default:
                --activeIndex;
        }
    }
    return  activeIndex;
}


// SWIPER SLIDER + ANIMATE CSS
function bhover_swiper(){
 $.each($('[data-swiper="true"]'),function(){
	var name = $(this).attr('id');
	var loop = $(this).data('swiper-loop');
	var slidesperview = $(this).data('swiper-slidesperview');
	var speed = $(this).data('swiper-speed');
	var autoplay_used = $(this).data('swiper-autoplay-used');
	var autoplay_speed = $(this).data('swiper-autoplay');
	var spacebetween = $(this).data('swiper-spacebetween');
	var breakpoint = $(this).data('swiper-breakpoints');
	var slidesperview_mobile = $(this).data('swiper-slidesperview-mobile');
	var slidesperview_tablet = $(this).data('swiper-slidesperview-tablet');
	
	if(breakpoint != true){
		name = new Swiper('#'+name+' .swiper-container', {
			loop: loop,
			slidesPerView: Number(slidesperview),
			speed: Number(speed),
			autoplay: {
				delay: Number(autoplay_speed),
				disableOnInteraction: false
			},
			spaceBetween: Number(spacebetween),
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
		      nextEl: '#'+name+' .swiper-button-next',
		      prevEl: '#'+name+' .swiper-button-prev',
		    },
			on: {
			    init: function () {
					$.each($('.swiper-slide-active [data-animate="swiper-animated"]'),function(){
						var animation,repeat = '';
						if($(this).data('animate-animation') !== undefined){
							animation = $(this).data('animate-animation');
						}
						if($(this).data('animate-repeat') !== undefined){
							repeat = $(this).data('animate-repeat');
						}
						$(this).addClass('animated '+ animation + ' ' + repeat);
						delay = $(this).data('animate-delay');
						if(delay !== undefined){
							$(this).css("animation-delay", delay).css("-webkit-animation-delay", delay).css("-moz-animation-delay", delay).css("-ms-animation-delay", delay).css("-o-animation-delay", delay);	
						}
					});
			    },
			    slideChangeTransitionEnd: function () {
				    
				    $.each($('.swiper-slide [data-animate="swiper-animated"]'),function(){
					    var animation,repeat = '';
					    if($(this).data('animate-animation') !== undefined){
							animation = $(this).data('animate-animation');
						}
						if($(this).data('animate-repeat') !== undefined){
							repeat = $(this).data('animate-repeat');
						}
					    $(this).removeClass('animated '+ animation + ' ' + repeat);
					    $(this).css("animation-delay", '').css("-webkit-animation-delay", '').css("-moz-animation-delay", '').css("-ms-animation-delay", '').css("-o-animation-delay", '');
				    });
				    
				    
				    $.each($('.swiper-slide-active [data-animate="swiper-animated"]'),function(){
						var animation,repeat = '';
						if($(this).data('animate-animation') !== undefined){
							animation = $(this).data('animate-animation');
						}
						if($(this).data('animate-repeat') !== undefined){
							repeat = $(this).data('animate-repeat');
						}
						$(this).addClass('animated '+ animation + ' ' + repeat);
						delay = $(this).data('animate-delay');
						if(delay !== undefined){
							$(this).css("animation-delay", delay).css("-webkit-animation-delay", delay).css("-moz-animation-delay", delay).css("-ms-animation-delay", delay).css("-o-animation-delay", delay);	
						}
					});
			    }
			  }
		});
	}else{
		name = new Swiper('#'+name+' .swiper-container', {
			loop: loop,
			slidesPerView: Number(slidesperview),
			speed: Number(speed),
			autoplay: {
				delay: Number(autoplay_speed),
				disableOnInteraction: false
			},
			spaceBetween: Number(spacebetween),
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
		      nextEl: '#'+name+' .swiper-button-next',
		      prevEl: '#'+name+' .swiper-button-prev',
		    },
			breakpoints: {
				768: { slidesPerView: Number(slidesperview_mobile) },
			    992: { slidesPerView: Number(slidesperview_tablet) }
			},
			on: {
			    init: function () {
					$.each($('.swiper-slide-active [data-animate="swiper-animated"]'),function(){
						var animation,repeat = '';
						if($(this).data('animate-animation') !== undefined){
							animation = $(this).data('animate-animation');
						}
						if($(this).data('animate-repeat') !== undefined){
							repeat = $(this).data('animate-repeat');
						}
						$(this).addClass('animated '+ animation + ' ' + repeat);
						delay = $(this).data('animate-delay');
						if(delay !== undefined){
							$(this).css("animation-delay", delay).css("-webkit-animation-delay", delay).css("-moz-animation-delay", delay).css("-ms-animation-delay", delay).css("-o-animation-delay", delay);	
						}
					});
			    },
			    slideChangeTransitionEnd: function () {
				    
				    $.each($('.swiper-slide [data-animate="swiper-animated"]'),function(){
					    var animation,repeat = '';
					    if($(this).data('animate-animation') !== undefined){
							animation = $(this).data('animate-animation');
						}
						if($(this).data('animate-repeat') !== undefined){
							repeat = $(this).data('animate-repeat');
						}
					    $(this).removeClass('animated '+ animation + ' ' + repeat);
					    $(this).css("animation-delay", '').css("-webkit-animation-delay", '').css("-moz-animation-delay", '').css("-ms-animation-delay", '').css("-o-animation-delay", '');
				    });
				    
				    
				    $.each($('.swiper-slide-active [data-animate="swiper-animated"]'),function(){
						var animation,repeat = '';
						if($(this).data('animate-animation') !== undefined){
							animation = $(this).data('animate-animation');
						}
						if($(this).data('animate-repeat') !== undefined){
							repeat = $(this).data('animate-repeat');
						}
						$(this).addClass('animated '+ animation + ' ' + repeat);
						delay = $(this).data('animate-delay');
						if(delay !== undefined){
							$(this).css("animation-delay", delay).css("-webkit-animation-delay", delay).css("-moz-animation-delay", delay).css("-ms-animation-delay", delay).css("-o-animation-delay", delay);	
						}
					});
			    }
			  }
		});
	}
	if(autoplay_used == false){
		name.autoplay.stop();
	}
 });
}
// SWIPER SLIDER + ANIMATE CSS END
$(function(){
	TotalHeight();
});

$(window).resize(function(){
	TotalHeight();
});

function TotalHeight(){
	if($("#contents").hasClass("aaa")){
		$("#contents").removeClass("aaa");
		$("#contents").css("padding-bottom","0");
	}
	var htmlH = $("html").height();	
	if($(window).outerHeight() < htmlH-160 && $(window).outerHeight() > htmlH-160-148){
		$("#contents").addClass("aaa");
		$("#contents").css("padding-bottom","148px");
	}else{		
		$("#contents").css("padding-bottom","0");
	}
}



