;(function(){

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
		}
	};

	var Page = {
		init:function(){
			var that = this;
			var taskId = Util.getQuery('taskId');
			var taskType = Util.getQuery('taskType');
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			//绑定事件
			this.renerTaskDetail(taskId,taskType);
		},
		renerTaskDetail:function(taskId,taskType){
			var data = localStorage.getItem('taskData');
			data = JSON.parse(data);
			var res = data.res;
			var curTask;
			//alert(taskId);
			for(var i=0;i<res.length;i++){
				if (res[i]['taskId']==taskId) {
					curTask = res[i];
					break;
				}
			}
			if(curTask){
				//alert(curTask['endDate']);
				console.log(curTask);
				$('#task-detail .input').html(curTask['taskName']);
				$('#task-detail .start-date').html(curTask['startDate']);
				$('#task-detail .end-date').html(curTask['endDate']);
				$('#task-detail .level').html(this.getLevelName(curTask['level']));
			}
		},
		getLevelName:function(level){
			var levelName = '';
			switch(level.toString()){
				case '1':levelName='非常紧急';break;
				case '2':levelName='紧急';break;
				case '3':levelName='一般';break;
			}
			return levelName;
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