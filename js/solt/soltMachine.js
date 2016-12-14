var slot = function(){
	var _self = this;
	var viewBox;
	var viewH,ItemH,initH;
	var moveDst = [];//每个元素的移动距离
	var ItemNum = 0;
	_self.speed = 0;
	_self.stop = [];
	_self.start = true;
	_self.end = false;
	_self.endNum = 0;

	//插件初始化
	_self.init = function(ele){
		viewBox = ele;
		viewH = ele.children().eq(0).height();
		ItemH = ele.children().eq(0).find('li').eq(0).outerHeight(true);

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		ele.children().each(function(index, el) {
			var that = $(this);
			_initEachEle(that);
		});
	}//end func

	// 游戏开始
	_self.slotBegin = function(speed){
		if(_self.start){
			viewBox.children().each(function(index, el) {
				var that = $(this);
				setTimeout(function(){_slotMoving(that,index,speed)},600*index);
			});
			_self.start = false;
			setTimeout(function(){_self.end = true},2000);
		}
	}//end func

	//游戏重置
	_self.resetSlot = function(){
		_self.start = true;
		_self.endNum = 0;
		// viewBox.children().each(function(index, el) {
		// 	$(this).children('ul').css({'transform': 'translate(0,' + (-initH) + 'px)'});
		// });

		for (var i = 0; i < ItemNum; i++) {
			// moveDst[i] = initH;
			_self.stop[i] = false;
		};
	}//end func

	// 游戏结束
	_self.slotEnd = function(result,callback){
		if(_self.end){
			if(result == 0){
				var item = _differRandom(ItemNum);
			}

			viewBox.children().each(function(index, el) {
				var that = $(this);
				setTimeout(function(){_self.stop[index] = true;},600 * index);
				if(result == 0){
					setTimeout(function(){_EndMoving(that,index,item[index],callback);},600 * index);
				}
				else{
					setTimeout(function(){_EndMoving(that,index,result,callback);},600 * index);
				}
			});
			_self.end = false;
		}
	}//end func

	//初始化每一列
	function _initEachEle(ele){
		var moveBox = ele.children('ul');
		var itemBox = moveBox.children('li');

		moveBox.append(itemBox.clone());

		ItemNum = itemBox.length;
		initH = ItemH - (viewH - ItemH) / 2;
		moveBox.css({'transform': 'translate(0,' + (-initH) + 'px)'});
		moveDst.push(initH);
		_self.stop.push(false);
	}//end func

	//移动每一列
	function _slotMoving(ele,code,speed){
		var moveBox = ele.children('ul');
		var count = 0;
		_self.speed =  (viewH / 180) * speed;

		_moving();
		function _moving(){
			var thisSpeed = (viewH / 180) * (parseInt(count/10) + 1);
			thisSpeed = thisSpeed >= _self.speed ? _self.speed : thisSpeed;
			moveDst[code] = moveDst[code] + thisSpeed;
			moveDst[code] = moveDst[code] >= ItemH * ItemNum + initH ? initH : moveDst[code];
			// moveBox.css({y: -moveDst[code]});
			moveBox.css({'transform': 'translate(0,' + (-moveDst[code]) + 'px)'});
			if(!_self.stop[code]){
				requestAnimationFrame(_moving);
			}
			count++;
		}
	}//end func

	//结束的动画
	function _EndMoving(ele,code,result,callback){
		var moveBox = ele.children('ul');
		var count = 0;
		var endDistance = result == 1 ? initH + ItemH * (ItemNum - 1) : initH + ItemH * (result - 2);
		var count = 0;

		_moving();
		function _moving(){
			var thisSpeed = _self.speed - (viewH / 180) * (parseInt(count/10) + 1);
			thisSpeed = thisSpeed <= 2 ? 2 : thisSpeed;
			moveDst[code] = moveDst[code] + thisSpeed;
			moveDst[code] = moveDst[code] >= ItemH * ItemNum + initH ? initH : moveDst[code];
			// moveBox.css({y: - moveDst[code]});
			moveBox.css({'transform': 'translate(0,' + (-moveDst[code]) + 'px)'});
			if(parseInt(moveDst[code]) != parseInt(endDistance) || thisSpeed > 2){
				requestAnimationFrame(_moving);
			}
			else{
				_self.endNum++;
				if(_self.endNum == ItemNum && callback){
					setTimeout(function(){callback();},50);
				}
			}
			count++;
		}
	}//end func

	//生成一定范围内不相同的随机数
	function _differRandom(num){
		var arr = [];

		for (var i = 0; i < 3; i++) {
			var item = Math.floor(Math.random()*num + 1);
			arr.push(item);
		}
		
		_judgeSame(arr);
		//判断是否相同
		function _judgeSame(arr){
			if(arr[0] == arr[2]){
				arr[2] = Math.floor(Math.random()*num + 1);
				_judgeSame(arr);
			}
		}//end func
		
		return arr;
	}//end func
}//end obj
