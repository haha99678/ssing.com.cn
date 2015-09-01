$(function(){
	$('.icon-filter').on('click', function(){
		$('html').addClass('open');
	})
	$('.filter-close').on('click', function(){
		$('html').removeClass('open');
		$('.filter-dialog .pro-list').hide();
	})

	$('#filterCats > li > a').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		var $parents = $(this).parents('li');
		if(!$parents.hasClass('active')){
			$parents.addClass('active').siblings('li').removeClass('active');
		}else{
			$parents.removeClass('active')
		}
	})

	$('.filter-sub li').on('click', function(){
		var o = $(this);
		var $small = o.parents('li').find('small.label');
		var val = o.data('value');
		if(!o.hasClass('checked')){
			o.addClass('checked').siblings('li').removeClass('checked');
			var txt = o.find('span').text();
			$small.text(txt);
			$small.data('value', val);
		}else{
			$(this).removeClass('checked');
			if($small.text() != '全部'){
				$small.text('全部');
				$small.data('value', '');
			}
		}
	})

	$('#filterBtn').on('click', function(){
		var arrVal = [];
		$('.f-value').each(function(index, el){
			var val = $(this).data('value');
			arrVal.push(val);
		})
		sessionStorage.setItem('gender', arrVal[0]);
		sessionStorage.setItem('category', arrVal[1]);
		sessionStorage.setItem('brand', arrVal[2]);
		// window.location.href = 'search-result.shtml?page=1&gender='+arrVal[0]+'&category='+arrVal[1]+'&brand='+arrVal[2];
		if($(this).data('role') == 'compare'){
			$('.filter-dialog .pro-list').show();
			getResult();
		}else{
			window.location.href='search-result.shtml?gender='+arrVal[0]+'&category='+arrVal[1]+'&brand='+arrVal[2];
		}
		// $.ajax({
		// 	url: '/api/search',
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	data: {page: '1', gender: arrVal[0], category: arrVal[1], brand: arrVal[2]},
		// 	success: function(data){
		// 		console.log(data);
		// 	}
		// })
	})
})