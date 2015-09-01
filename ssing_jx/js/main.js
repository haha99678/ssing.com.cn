$(function(){
	var imgList = ['images/bg.jpg','images/first-bg.jpg','images/last-bg.jpg','images/shoe.png','images/icon.png','images/texts.png'];
	var iCount = 0;
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();
	var question = $('#question');
	var answers = $('#answers');
	var recList = $('#recList');
	var resultList = $('#resultList');
	var step = $('#step');
	var stepArr = ['零','一','二','三','四','五','六','七','八','九','十'];
	var num = 1;
	var isLast = false;
	var init = function(){
		$('.screen').css({
			top: (screenHeight-832*(screenWidth/640))/2,
			transform: 'scale('+screenWidth/640+','+screenWidth/640+')'
		});
	}
	var mySwiper;
	var getCookie = function(c_name) {
	    if (document.cookie.length > 0) {
	        c_start = document.cookie.indexOf(c_name + "=")
	        if (c_start != -1) {
	            c_start = c_start + c_name.length + 1
	            c_end = document.cookie.indexOf(";", c_start)
	            if (c_end == -1)
	                c_end = document.cookie.length
	            return unescape(document.cookie.substring(c_start, c_end))
	        }
	    }
	    return ""
	}
	var checkWXLogin = function() {
	    b = getCookie('b')
	    if (b == null || b == '') {
	        var url = escape(window.location.href);
	        console.log(url);
	            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf10d7f93c75bf11c&redirect_uri=http%3A%2F%2Fssing.com.cn/api%2Fwxlogin&response_type=code&scope=snsapi_login&state="+url
	        	// window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wxf10d7f93c75bf11c&redirect_uri=http%3A%2F%2Fssing.com.cn/api%2Fwxlogin&response_type=code&scope=snsapi_login&state="+url;
	        return false;
	    }else{
	    	return true;
	    }
	}
	for(var i=0; i<imgList.length; i++){
		var img = new Image();
		img.onload = function(){
			iCount++;
			if(iCount >= imgList.length){
				$('#j_loading').empty().fadeOut(1000);

				mySwiper = new Swiper ('.swiper-vertical', {
				    direction: 'vertical',
				    noSwiping: true
				})
			}
		}
		img.src = imgList[i];
	}
	$('#start').on('click', function(e){
		e.preventDefault();
		mySwiper.slideNext();
	})
	$('#next').on('click', function(e){
		e.preventDefault();
		var id = $('input[name=answer]:checked').val();
		var next = $(this);
		if(id == undefined || id == ''){
			alert('请选择一个选项');
		}else{
			if(!isLast){
				$.ajax({
					url: '/api/next_question',
					type: 'GET',
					dataType: 'json',
					data: {optionId: id},
					success: function(data){
						var options = data.options;
						var products = data.products;
						var dataQuestion = data.question;
						var _options = '';
						var _products = '';
						for(var i in options){
							_options += '<label><input type="radio" name="answer" value="'+options[i].id+'"><span>'+options[i].optionValue+'</span></label>';
						}
						for(var j in products){
							_products += '<li><img src="http://ssing.com.cn/ssing/upload/shoes/'+products[j].uuid+'.png"><h3>'+products[j].name+'</h3><strong>RMB '+products[j].price+'</strong></li>';
						}
						num++;
						step.html(stepArr[num]);
						question.html(num+' '+dataQuestion.questionValue+'?');
						answers.html(_options);
						recList.html(_products);
						//是否最后一个问题
						if(dataQuestion.specialQuestion==false && dataQuestion.nextQuestionId==0){
							next.html('查看结果');
							isLast = true;
						}
					}
				})
			}else{
				$.ajax({
					url: '/api/next_question',
					type: 'GET',
					dataType: 'json',
					data: {optionId: id},
					success: function(data){
						var result = data.products;
						var _result = '';
						for(var k in result){
							_result += '<li><img src="http://ssing.com.cn/ssing/upload/shoes/'+result[k].uuid+'.png"><h3>'+result[k].name+'</h3><strong>RMB '+result[k].price+'</strong><button class="btn addfollow" data-uuid="'+result[k].uuid+'"><i class="icon-star"></i>关注</button></li>';
						}
						resultList.html(_result);
					}
				})
				mySwiper.slideNext();
			}
		}
		// mySwiper.slideNext();
	})
	//form validate
	$('#firstQuestion').on('click', function(e){
		e.preventDefault();
		var sex = $('input[name=sex]:checked').attr('id'),
			height = $('input[name=height]').val(),
			weight = $('input[name=weight]').val(),
			size = $('select[name=size]').val();
		// console.log(sex)
		switch('')
		{
			case height:
				alert('请输入身高');
				break;
			case weight:
				alert('请输入体重');
				break;
			case size:
				alert('请输入鞋码');
				break;
			default:
				$.ajax({
					url: '/api/first_question',
					type: 'GET',
					dataType: 'json',
					data: {sex: sex, height: height, weight: weight, size: size},
					success: function(data){
						var options = data.options;
						var products = data.products;
						var _options = '';
						var _products = '';
						for(var i in options){
							_options += '<label><input type="radio" name="answer" value="'+options[i].id+'"><span>'+options[i].optionValue+'</span></label>';
						}
						for(var j in products){
							_products += '<li><img src="http://ssing.com.cn/ssing/upload/shoes/'+products[j].uuid+'.png"><h3>'+products[j].name+'</h3><strong>RMB '+products[j].price+'</strong></li>';
						}
						question.html(num+' '+data.question.questionValue+'?');
						answers.html(_options);
						recList.html(_products);
					}
				});
				mySwiper.slideNext();
		}
	})

	var tip_viewed = localStorage.getItem('tip_viewed');
	if(tip_viewed == null || tip_viewed == 'false'){
		localStorage.setItem('tip_viewed', 'false');
		$('#tip').fadeIn();
	}
	$('#tip').on('click', function(){
		$(this).fadeOut();
		localStorage.setItem('tip_viewed', 'true');
	})

	resultList.on('click', '.addfollow', function(){
		if(checkWXLogin()){
			var uuid = $(this).data('uuid');
			$.ajax({
				url: '/api/addFollow',
				type: 'GET',
				dataType: 'json',
				data: {uuid: uuid},
				success: function(data){
					if(data.msg == 'followed'){
						alert('您已经关注过了！');
					}else if(data.msg == 'success'){
						alert('关注成功！');
					}
				}
			})
		}
	})

	$(window).resize(function() {
		screenWidth = $(window).width();
		screenHeight = $(window).height();
		init();
	});
	init();

})