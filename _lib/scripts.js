Cufon.replace('h2.orange', { fontFamily: 'Gotham_Medium' });
Cufon.replace('h2.red', { fontFamily: 'Gotham_Rounded_Medium' });

jQuery(document).ready(function($){
	var offset = [],
		btn_widths = [],
		menu_width = [],
		items = $('.navbar > li'),
		dropdown = [],
		dropdown_width = [],
		sub_dropdown_width = [],
		dd_items = $('.dropdown > div.subnav'),
		i;
		
	for(i = 0; i < items.length; i++){
		offset.push($('.navbar > li').eq(i).position());
		btn_widths.push($('.navbar > li').eq(i).width());
		menu_width.push($('.navbar .subnav').eq(i).width());

		$('.navbar .subnav').eq(i).css({'left': - Math.ceil((menu_width[i] / 2) - (btn_widths[i] / 2))})
	};
	
	// resize dropdown menu items according to logest width;
	for(i = 0; i < dd_items.length; i++){
		dropdown.push($('.dropdown').eq(i));
		dropdown_width.push($('.dropdown').eq(i).width());
		sub_dropdown_width.push($(dd_items).eq(i).width());
		
		if($(dd_items).eq(i).width() < dropdown_width[i]){
			dropdown[i].find('.subnav').width(dropdown[i].width());
		}else{
			dropdown[i].width(sub_dropdown_width[i]);
			dd_items.eq(i).width(sub_dropdown_width[i]);
		};
	};
	
	// footer toggle
	$('#selector li div').bind('click', function(){
		var selected = $(this).attr('rel');
		
		$('#selector li div').removeClass('selected');
		$(this).addClass('selected');
		
		$('.footer_content').addClass('hide');
		$('#' + selected).removeClass('hide');
		
		$('#selector li div').removeClass('arrow');
		$(this).next().addClass('arrow');

	});
	
	// Rotator
	var timer,
		speed = 1000,
		pause = false,
		maxItems = 5;
		curItem = 1;

	// Does element exist?
	if (!$('#rotator').length) {
		// If not, exit.
		return;
	};
	
	
	$('#rotator li:first').addClass('current');

	// Rotator function.
	function rotate(element) {
		// Stop, if user has interacted.
		if (pause) {
			return;
		}
		
		var $next_li = $(element).next('li').length ? $(element).next('li') : $('#rotator li:first')// Either the next /first <li>.,
			$next_a = $('#rotator-nav a.current').parent('li').next('li').length ? $('#rotator-nav a.current').parent('li').next('li').find('a') : $('#rotator-nav a:first');// Either next / first control link.

		// Animate.
		$('#rotator-nav a.current').removeClass('current');
		$next_a.addClass('current');
		
		curItem = $next_a.find('span').text();

		// Continue.
		function doIt() {
			rotate($next_li);
		}

		// Fade out <li>.
		$(element).fadeOut(speed);

		// Show next <li>.
		$($next_li).fadeIn(speed, function() {
			// Slight delay.
			timer = setTimeout(doIt, 4000);
		});
	}

	// Add click listeners for controls.
	$('#rotator-nav a').bind('click', function() {
		
		// Remove Class 
		$('#rotator_play_pause').removeAttr('class')
		
		// Change button text.
		$('#rotator_play_pause').addClass('paused').html('Play');

		// Show target, hide other <li>.
		$($(this).attr('href')).show().siblings('li').hide();

		// Add class="current" and remove from all others.
		$(this).addClass('current').parent('li').siblings('li').find('a').removeClass('current');;

		// Pause animation.
		pause = true;
		
		clearTimeout(timer)

		// Nofollow.
		this.blur();
		return false;
	});

	
	$('#rotator-nav .left-right').bind('click', function(e){
		var item = $(this).attr('id');
			
		
		// Pause animation.
		pause = true;
		clearTimeout(timer)
		
		if(item === 'nextImg'){
			curItem++;
			if(curItem >= maxItems + 1){
				curItem = 1;
			};
			
			//change images
			changeImage(curItem);
			
		}else{
			curItem -= 1;
			if(curItem <= 1){
				curItem = maxItems;
			};
			
			//change images
			changeImage(curItem);
		};
		
		function changeImage(item){
			$('#rotator-nav li a').removeClass('current');
			$('#rotator-nav li').eq(item -1).find('a').addClass('current');
			
			$('#rotator li').hide();
			$('#img-' + item).show()
		};

	});

	// Hide all but first <li>.
	
	$('#rotator li').hide().first().show();
	//$('#rotator li:first').show();
	
	// add current class to first nav element
	$('#rotator-nav a:first').addClass('current');
	
	setTimeout(function(){rotate($('#rotator li:visible:first'))}, 6000);
});