
function ListModule($ct){
	this.init($ct);

}

ListModule.prototype.init = function($ct){
    this.$task_list = $ct;
    this.task_list = [];
    this.$addTaskSummit = $('.addTaskSummit');
 	this.$content = $('.content');
    this.$task_detail =$('.task-detail');
 	this.$detail_content=$('.detail-content');
 	this.$desc=$('.desc');
 	this.$datetime=$('.datetime');
 	this.$detail_submit = $('.detail-submit');
 	this.deleteIndex;
 	this.detailIndex;
 	this.$datetime.datetimepicker();
    // 渲染页面
    this.initRender();
    //绑定事件
    this.listenSubmitAdd();
    this.listenDetail();
    this.listenDelete();
    this.listenSubmitchange();
    

}
/************第一次进入页面时渲染页面************/
ListModule.prototype.initRender = function(){

     this.$task_list.html('');
	//取出数据库中的记录
	this.task_list=store.get('task_list');
	//渲染到页面上
	if(this.task_list){
		var taskHtmlStr ='';
		for(var i=this.task_list.length-1;i>=0;i--){
			var oneItem = 
			  '<div class="list-item"><!--任务项目-->'+
'					<span><input type="checkbox" /></span>'+
'					<span class="item-content">'+this.task_list[i].content+'</span>'+
'					<span class="fr">'+
'					<span class="action detail">详情</span>'+
'					<span class="action delete">删除</span>'+
'					</span>'+
'				</div>';
			taskHtmlStr = taskHtmlStr + oneItem;
	    }
	   $(taskHtmlStr).appendTo(this.$task_list);   
	}else{ 
		//刚开始数据库中无数据，this.task_list===undefined 无push属性
		this.task_list=[];
	}
	this.listenDetail();
	this.listenDelete();	
}


/* 数据库存储形式
  task_list =[
     newData: { content:  aaa },
     newData: { content:  bbb },
     newData: { content:  ccc }
  ]

*/

/************监听事件绑定**********************/
/*增加新的表单*/
 ListModule.prototype.listenSubmitAdd = function(){
 	var _this = this;
 	_this.$addTaskSummit.click(function(){
 		var newData = {};
 		newData.content = _this.$content.val();
 		_this.task_list.push(newData)
 		_this.$content.val('');
 		//存入数据库
 		store.set('task_list',_this.task_list)
 		this.initRender();
 	})

 }
/*修改并提交已有表单*/
 ListModule.prototype.listenSubmitchange = function(){
    var _this = this;

 	this.$detail_submit.click(function(){
        var newItem={};
        newItem.content =_this.$detail_content.val();
        newItem.desc =  _this.$desc.val();
        newItem.datetime = _this.$datetime.val();
        $.extend(_this.task_list[_this.detailIndex],newItem);
        store.set('task_list',_this.task_list);
 		_this.$task_detail.hide();
 		_this.initRender();
 	})
 	
 }
/*查看原有表单详情*/
  ListModule.prototype.listenDetail = function(){
  	var _this = this;

 	$(_this.$task_list.find('.detail')).click(function(){
        _this.detailIndex = _this.task_list.length-1-$(this).parent().parent().index();
        _this.$detail_content.val(_this.task_list[_this.detailIndex].content);
        _this.$desc.val(_this.task_list[_this.detailIndex].desc);
        _this.$datetime.val(_this.task_list[_this.detailIndex].datetime);
 		_this.$task_detail.show();
 	})
 	
 }
 /*删除表单*/
  ListModule.prototype.listenDelete = function(){
 	var _this = this;
 	$(_this.$task_list.find('.delete')).click(function(){
 		var r = confirm('确认删除吗？');
 		if(r){
          _this.deleteIndex = _this.task_list.length-1-$(this).parent().parent().index();
          //数组删除
          _this.task_list.splice(_this.deleteIndex,1);
          //数据库删除
          store.set('task_list',_this.task_list);
          //DOM 删除
 		  $(this).parent().parent().remove();
 		}
 	})
 }



new ListModule($('.task-list'));

/*补充：  设置闹钟*/