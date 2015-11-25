;(function(){
	var hash;
	var isShow = true;

	//模拟数据
	var data = {
		todo:[
			{
				taskId:4,
				taskName:'完成微应用设计方案',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:1
			},
			{
				taskId:5,
				taskName:'完成微应用代码开发',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:2
			},
			{
				taskId:6,
				taskName:'微应用发布上线',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:2
			}
		],
		done:[
			{
				taskId:1,
				taskName:'了解钉钉微应用开发文档',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:1
			},
			{
				taskId:2,
				taskName:'下载钉钉微应用开发demo',
				startDate:"2015-11-11",
				endDate:"2015-11-12",
				level:3
			}
		]
	};

	var Page = {
		init:function(){
			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			this.initData();
			//绑定事件
			this.bind();
			//绑定左上角返回事件
			this.setLeft();
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
						dd.ui.pullToRefresh.stop();
					},3000);
				},
				onFail: function() {
				}
			});
			//绑定每个任务的点击事件，事件采用代理的方式
			$('.doc').on('click','.item',function(){
				var _this = $(this);
				_this.addClass('active');
				setTimeout(function(){
					_this.removeClass('active');
				},300);
				//alert(_this.data('task-type'));
				that.go('detail',_this.data('taskid'),_this.data('task-type'));
			});
		},
		initData:function(){
			var toDoHtml = [];
			var doneHtml = [];
			var that = this;
			for(var i=0;i<data.todo.length;i++){
				toDoHtml.push(that.renderItem(data.todo[i],'todo'));
			}
			$('<ol/>').html(toDoHtml.join('')).appendTo($('#todolist'));

			$('#todolist .hd span').text('（'+data.todo.length+'）');

			for(var i=0;i<data.done.length;i++){
				doneHtml.push(that.renderItem(data.done[i],'done'));
			}
			$('<ol/>').html(doneHtml.join('')).appendTo($('#donelist'));
			$('#donelist .hd span').text('（'+data.done.length+'）');
		},
		renderItem:function(item,type){
			var html = '';
			var levelName = '';
			switch(item.level){
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
		setLeft:function(){
			var that = this;
			dd.biz.navigation.setLeft({
			    show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
			    control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
			    showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准       
			    onSuccess : function(result) {
			        hash = location.hash.substring(1);
			        if(hash=='add'){
			        	isShow = false;
			        	$('#task-add').addClass('slideOut').on('animationend', function () {
			        		if(!isShow){
			        			$(this).hide().removeClass('slideOut');
			        		}
				        }).on('webkitAnimationEnd', function () {
				            if(!isShow){
			        			$(this).hide().removeClass('slideOut');
			        		}
				        });
				        location.hash="#";
				        that.go('');
			        }else if(hash=='detail') {
			        	isShow = false;
			        	$('#task-detail').addClass('slideOut').on('animationend', function () {
			        		if(!isShow){
			        			$(this).hide().removeClass('slideOut');
			        		}
				            
				        }).on('webkitAnimationEnd', function () {
				            if(!isShow){
			        			$(this).hide().removeClass('slideOut');
			        		}
				        });
				        location.hash="#";
				        that.go('');
			        }else{
			        	dd.biz.navigation.close();
			        }
			    },
			    onFail : function(err) {}
			});
		},
		renerTaskDetail:function(taskId,taskType){
			//alert(taskType);
			var d = data[taskType];
			var curTask;
			for(var i=0;i<d.length;i++){
				if (d[i]['taskId']==taskId) {
					curTask = d[i];
					break;
				}
			}
			if(curTask){
				//alert(curTask['endDate']);
				$('#task-detail .input').html(curTask['taskName']);
				$('#task-detail .start-date').html(curTask['startDate']);
				$('#task-detail .end-date').html(curTask['endDate']);
				$('#task-detail .select').html(this.getLevelName(curTask['level']));
			}
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
				dd.biz.util.openLink({
					url:'http://10.1.137.211:3000/add.html?taskId='+taskId+'&taskType='+taskType
				});
				return;

				isShow = true;
				$('#task-add').show().addClass('slideIn').on('animationend', function () {
					if(isShow){
						$(this).removeClass('slideIn');
					}
		        }).on('webkitAnimationEnd', function () {
		           if(isShow){
						$(this).removeClass('slideIn');
					}
		        });
				location.hash="#add";
				$('body').trigger('navigation.rightButton.change',[{
					"text":"保存",
					"show":true,
					"callback":function(){
						isShow = false;
			        	$('#task-add').addClass('slideOut').on('animationend', function () {
			        		if(!isShow){
			        			$(this).hide().removeClass('slideOut');
			        		}
				        }).on('webkitAnimationEnd', function () {
				            if(!isShow){
			        			$(this).hide().removeClass('slideOut');
			        		}
				        });
				        location.hash="#";
				        that.go('');
					}
				}]);
			}else if(page=='detail'){
				dd.biz.util.openLink({
					url:'http://10.1.137.211:3000/detail.html?taskId='+taskId+'&taskType='+taskType
				});
				return;

				that.renerTaskDetail(taskId,taskType);
				isShow = true;
				$('#task-detail').show().addClass('slideIn').on('animationend', function () {
					if(isShow){
						$(this).removeClass('slideIn');
					}
		        }).on('webkitAnimationEnd', function () {
		           if(isShow){
						$(this).removeClass('slideIn');
					}
		        });
				location.hash="#detail";
				$('body').trigger('navigation.rightButton.change',[{
					"text":"test",
					"show":false,
					"callback":function(){
						
					}
				}]);

			}else{
				$('body').trigger('navigation.rightButton.change',[{
					"text":"新增",
					"show":true,
					"callback":function(){
						that.go('add');
					}
				}]);
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