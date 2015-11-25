;(function(){
	var hash;
	var isShow = true;
	var t = 0;
	var pullDtd;

	//模拟数据
	var data = {
		res:[
			{
				taskId:4,
				taskName:'完成微应用设计方案',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:1,
				state:1
			},
			{
				taskId:5,
				taskName:'完成微应用代码开发',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:2,
				state:1
			},
			{
				taskId:6,
				taskName:'微应用发布上线',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:2,
				state:1
			},
			{
				taskId:1,
				taskName:'了解钉钉微应用开发文档',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:1,
				state:2
			},
			{
				taskId:2,
				taskName:'下载钉钉微应用开发demo',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:3,
				state:2
			}
		]
	};
	alert(111);
	//模拟数据
	if(!localStorage.getItem('taskData')){
		localStorage.setItem('taskData',JSON.stringify(data));
	}
	var Util = {
		getQuery:function(param){
			var url = window.location.href;
            var searchIndex = url.indexOf('?');
            var searchParams = url.slice(searchIndex + 1).split('&');
            for (var i = 0; i < searchParams.length; i++) {
                var items = searchParams[i].split('=');
                if (items[0].trim() == param) {
                    return items[1].trim();
                }
            }
		},
		getTargetUrl:function(replaceUrl,targetUrl){
			var protocol = location.protocol;
			var host = location.host;
			var pathname = location.pathname.replace(replaceUrl,targetUrl);
			return protocol+'//'+host+pathname;
		}

	};

	var Page = {
		init:function(){
			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			this.initData();
			//绑定事件
			this.bind();
			//初始化导航的title,采用事件的方式实现解耦
			$('body').trigger('navigation.title.change',[{
				"title":"我的任务"
			}]);
			//初始化导航的右上角,采用事件的方式实现解耦
			$('body').trigger('navigation.rightButton.change',[{
				"text":"新增",
				"show":true,
				"callback":function(){
					that.go('add');
				}
			}]);
			//绑定下拉事件
			dd.ui.pullToRefresh.enable({
				onSuccess: function() {
					setTimeout(function(){
						//todo 相关数据更新操作
						dd.ui.pullToRefresh.stop();
					},2000);
				},
				onFail: function() {
				}
			});
			//绑定每个任务的点击事件，事件采用代理的方式
			$('.doc').on('click','.item',function(){
				var _this = $(this);
				_this.addClass('active');
				setTimeout(function(){
					that.go('detail',_this.data('taskid'),_this.data('task-type'));
					_this.removeClass('active');
				},100);
				//alert(_this.data('task-type'));
				
			});

			var t3 = localStorage.getItem('_t_');
			//
			if(!t3){
				localStorage.setItem('_t_',t);
			}else{
				t = t3;
			}
			document.addEventListener('resume', function(e) {
			    e.preventDefault();
			    //判断是否有数据更新
			    var t2 = localStorage.getItem('_t_');
			    if(t2!=t){
			    	t = t2;
			    	that.initData();
			    }
			}, false);
		},
		test:function(){
			alert(11);
		},
		initData:function(){
			var toDoHtml = [];
			var doneHtml = [];
			var that = this;
			var data = localStorage.getItem('taskData');
			data = JSON.parse(data);
			var todoCount=0;
			var doneCount=0;
			for(var i=0;i<data.res.length;i++){
				if(data.res[i].state==1){
					todoCount++;
					toDoHtml.push(that.renderItem(data.res[i],'todo'));
				}
			}
			//先清空现有数据
			$('#todolist .bd').html('');
			$('<ol/>').html(toDoHtml.join('')).appendTo($('#todolist .bd'));

			$('#todolist .hd span').text('（'+todoCount+'）');

			for(var i=0;i<data.res.length;i++){
				if(data.res[i].state==2){
					doneCount++;
					doneHtml.push(that.renderItem(data.res[i],'done'));
				}
			}
			//先清空现有数据
			$('#donelist .bd').html('');
			$('<ol/>').html(doneHtml.join('')).appendTo($('#donelist .bd'));
			$('#donelist .hd span').text('（'+doneCount+'）');
		},
		renderItem:function(item,type){
			var html = '';
			var levelName = '';
			switch(parseInt(item.level)){
				case 1:levelName='非常紧急';break;
				case 2:levelName='紧急';break;
				case 3:levelName='一般';break;
			}
			html = '<li class="item" data-taskid="'+item.taskId+'" data-task-type="'+type+'"><div class="wrap"><h3>'+item.taskName+'<i class="p'+item.level+'">'+levelName+'</i></h3></div></li>';
			return html;
		},
		bind:function(){
			//采用事件监听的方式是为了能够在统一一个地方设置导航的Title
			$('body').on('navigation.title.change',function(e,res){
				dd.biz.navigation.setTitle({
				    title : res.title
				});
			});
			//采用事件监听的方式是为了能够在统一一个地方设置导航的右上角按钮文案及点击事件
			$('body').on('navigation.rightButton.change',function(e,res){
				dd.biz.navigation.setRight({
					show: res.show,//控制按钮显示， true 显示， false 隐藏， 默认true
					control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
					showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
					text: res.text,
					onSuccess:function(){
						res.callback&&res.callback();
					}
				});
			});
		},
		getLevelName:function(level){
			var levelName = '';
			switch(level){
				case 1:levelName='非常紧急';break;
				case 2:levelName='紧急';break;
				case 3:levelName='一般';break;
			}
			return levelName;
		},
		go:function(page,taskId,taskType){
			var that = this;
			if(page=='add'){
				//这里替换为对应的页面url
				dd.biz.util.openLink({
					url:Util.getTargetUrl('index.html','add.html')
				});
				return;
				
			}else if(page=='detail'){
				dd.biz.util.openLink({
					url:Util.getTargetUrl('index.html','detail.html')+'?taskId='+taskId+'&taskType='+taskType
				});
				return;
			}
		}
	};
	if(dd.version){
		dd.ready(function(){
			Page.init();
		});
	}else{
		Page.init();
	}
})();