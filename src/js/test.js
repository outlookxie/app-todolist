;(function(){
	var Page = {
		init:function(){
			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);

			//绑定点击事件
			$('.a1').on('click',function(){
				dd.device.geolocation.get({
				    targetAccuracy : 200,
				    onSuccess : function(result) {
				        /*
				        {
				            longitude : Number,
				            latitude : Number,
				            accuracy : Number,
				            isWifiEnabled : Boolean,
				            isGpsEnabled : Boolean,
				            isFromMock : Boolean,
				            provider : wifi|lbs|gps,
				            accuracy : Number,
				            isMobileEnabled : Boolean,
				            errorMessage : String,
				            errorCode : Number
				        }
				        */
				        alert(JSON.stringify(result));
				    },
				    onFail : function(err) {}
				});

				
			});
		},
		test:function(){
			alert(11);
		}
	};
	//为了能够在PC端进行测试
	if(dd.version){
		dd.ready(function(){
			Page.init();
		});
	}else{
		Page.init();
	}
})();