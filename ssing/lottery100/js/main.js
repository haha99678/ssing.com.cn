$(function(){
	var imgList = ['images/bg.jpg', 'images/circle.png', 'images/colorfull.png', 'images/start.png', 'images/arr.png', 'images/gift1.png', 'images/gift2.png', 'images/gift3.png', 'images/gift4.png', 'images/gift5.png', 'images/gift6.png'];

	var turnplate={
        restaraunts: [],             //大转盘奖品名称
        colors: [],                  //大转盘奖品区块对应背景颜色
        imgs: [],					 //大转盘奖品对应图片
        outsideRadius: 237,          //大转盘外圆的半径
        textRadius: 165,             //大转盘奖品位置距离圆心的距离
        insideRadius: 94,            //大转盘内圆的半径
        startAngle: 0,               //开始角度
        bRotate: false               //false:停止;ture:旋转
	};

	turnplate.restaraunts = ["一等奖AIR MAG", "二等奖Yeezy 750", "三等奖AJ1 retro high 2015", "四等奖三叶草GLC", "五等奖型格绘手机壳", "六等奖型格杂志月刊"];
	turnplate.colors = ["#ffd570", "#ffeb8c", "#ffd570", "#ffeb8c","#ffd570", "#ffeb8c"];
	turnplate.imgs = ['images/gift1.png', 'images/gift2.png', 'images/gift3.png', 'images/gift4.png', 'images/gift5.png', 'images/gift6.png'];

	var	iCount = 0,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		mySwiper;

	var core = {
		init: function(){
			core.preload();
			core.resize();
			core.getMember();
			// core.checkWXLogin();
		},
		preload: function(){
			for(var i=0; i<imgList.length; i++){
				var img = new Image();
				img.onload = function(){
					iCount++;
					if(iCount >= imgList.length){
						$('#j_loading').empty().delay(350).fadeOut(1000);
						mySwiper = new Swiper ('.swiper-vertical', {
						    direction: 'vertical',
						    noSwiping: true
						});
						core.drawRouletteWheel();
					}
				}
				img.src = imgList[i];
			}
		},
		getCookie: function(c_name){
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
		},
		checkWXLogin: function(){
			var b = core.getCookie('b')
			if (b == null || b == '') {
			    var url = escape(window.location.href);
			    console.log(url);
			        // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf10d7f93c75bf11c&redirect_uri=http%3A%2F%2Fssing.com.cn/api%2Fwxlogin&response_type=code&scope=snsapi_login&state="+url
			    	window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wxf10d7f93c75bf11c&redirect_uri=http%3A%2F%2Fssing.com.cn/api%2Fwxlogin&response_type=code&scope=snsapi_login&state="+url;
			    return false;
			}else{
				return true;
			}
		},
		checkLottery: function(){
			$.ajax({
				url: '',
				type: 'GET',
				dataType: 'json',
				data: {param1: 'value1'},
				success: function(data){
					if('已抽过奖'){
						return true;
					}
				}
			})
		},
		resize: function(){
			$('.screen').css({
				top: (screenHeight-832*(screenWidth/640))/2+40,
				transform: 'scale('+screenWidth/640+','+screenWidth/640+')'
			});
		},
		getMember: function(){
			$.ajax({
				url: '',
				type: 'GET',
				dataType: 'json',
				data: {param1: 'value1'},
				success: function(data){
					var _list = '',
						i = 0;
					for(i in list){
						_list += '<li><div class="member-face"><img src="'+data[i].headimgurl+'"></div><span>'+data[i].nickname+'</span></li>'
					}
					var follow = $('#followers'),
						lis = follow.find('li');
					follow.width((lis.width()+15)*lis.length);
				}
			})
		},
		drawRouletteWheel: function(){
			var canvas = document.getElementById('wheelCanvas');
			if(canvas.getContext){
				//根据奖品个数计算圆周角度
				var arc = Math.PI/(turnplate.restaraunts.length/2);
				var ctx = canvas.getContext('2d');
			}
			ctx.clearRect(0,0,552,552);
			ctx.strokeStyle = '#ebb354';
			for(var i = 0; i < turnplate.restaraunts.length; i++){
				var angle = turnplate.startAngle + i * arc;
				ctx.fillStyle = turnplate.colors[i];
				ctx.beginPath();
				//arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
				ctx.arc(276, 276, turnplate.outsideRadius, angle, angle + arc, false);    
		      	ctx.arc(276, 276, turnplate.insideRadius, angle + arc, angle, true);
		      	// ctx.stroke();
		      	// ctx.fill();
		      	ctx.save();   

		      	//----绘制奖品开始----
		      	ctx.fillStyle = "#E5302F";
		        var text = turnplate.restaraunts[i];

		        var line_height = 17;
		        //translate方法重新映射画布上的 (0,0) 位置
		        ctx.translate(276 + Math.cos(angle + arc / 2) * turnplate.textRadius, 276 + Math.sin(angle + arc / 2) * turnplate.textRadius);
		           
		        //rotate方法旋转当前的绘图
		        ctx.rotate(angle + arc / 2 + Math.PI / 2);

		        var letterImg = new Image();
		        letterImg.src = turnplate.imgs[i];
				ctx.drawImage(letterImg,-75,-36, 150, 72);
				//把当前画布返回（调整）到上一个save()状态之前 
				ctx.restore();
			}
		},
		rotateFn: function(item, txt){
			var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
			if(angles<270){
				angles = 270 - angles; 
			}else{
				angles = 360 - angles + 270;
			}
			$('#turnplate').stopRotate();
			$('#turnplate').rotate({
				angle: 0,
				animateTo: angles+1800,
				duration: 8000,
				callback: function (){
					// alert(txt);
					$('.prize').text(txt.substr(0,3));
					$('.award').text(txt.substr(3));
					$('.prizeAward').text(txt);
					$('.awardimg').attr('src', turnplate.imgs[item-1]);
					mySwiper.slideNext();
					turnplate.bRotate = !turnplate.bRotate;
				}
			});
		},
		rnd: function(n, m){
			var random = Math.floor(Math.random()*(m-n+1)+n);
			return random;
		}
	};
	core.init(0);

	$(window).resize(function() {
		screenWidth = $(window).width();
		screenHeight = $(window).height();
		core.resize();
	})

	//跳转到下一页
	$('#start').on('click', function(e){
		e.preventDefault();
		mySwiper.slideNext();	
	})

	//开始抽奖
	$('#wheelStart').on('click', function(){
		//是否抽过奖
		if(core.checkLottery()){
			alert('您已经抽过奖了，请继续关注履型者其他活动！');
		}else{
			if(turnplate.bRotate)return;
			turnplate.bRotate = !turnplate.bRotate;
			//获取随机数(奖品个数范围内)
			var item = core.rnd(1,turnplate.restaraunts.length);
			core.rotateFn(item, turnplate.restaraunts[item-1]);
			console.log(item);
		}
	})

	//填写收货信息
	$('#delivery').on('click', function(e){
		e.preventDefault();
		mySwiper.slideNext();
	})
	
	//分享
	$('#deliverySubmit').on('click', function(e){
		e.preventDefault();
		$('#pageShare').fadeIn();
	})

	//侧边导航展开
	$('.header-link').on('click', function(e){
		e.preventDefault();
		$('html').toggleClass('side-open');
	})
})