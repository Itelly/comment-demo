//首先是页面加载完毕之后
window.onload = function () {
	//获取元素
	var list = document.getElementById('list');
	//获取每一个评论的div元素
	var lis = list.children;
	//定义一个定时器
	var timer;

	//删除节点的函数,把一个节点传进来node
	function removeNode(node) {
		//通过节点的父元素调用子节点的方法
		node.parentNode.removeChild(node);
	}

	//赞分享
	//box是分享的容器，el是分享的元素,把他们传进来
	function praiseBox(box, el) {
		//通过el.innerHTM取得点赞的文字
		var txt = el.innerHTML;
		//点赞的总数，通过数组的下标来获取
		var praiseElement = box.getElementsByClassName('praises-total')[0];
		//获取目前的点赞总数,转换成数字
		var oldTotal = parseInt(praiseElement.getAttribute('total'));
		var newTotal;
		//判断点的是点赞的文字还是取消赞的文字
		if (txt == '赞') {
			//如果是赞，那么新的总数就+1
			newTotal = oldTotal + 1;
			//改变多少人点赞的文字,如果只有我一个人赞，就显示'我觉得很赞'，如果大于1就显示'多少个人得很赞'
			praiseElement.innerHTML = (newTotal == 1) ? '我觉得很赞' : '我和' + oldTotal + '个人觉得很赞'
			el.innerHTML = '取消赞';
		}
		else {
			//如果不是赞，那么新的总数就-1
			newTotal = oldTotal - 1;
			//改变多少人点赞的文字,如果只有我一个人赞，就显示'我觉得很赞'，如果大于1就显示'多少个人得很赞'
			praiseElement.innerHTML = (newTotal == 0) ? '' : newTotal + '个人觉得很赞';
			el.innerHTML = '赞';
		}
		//判断结束后,更新点赞总数
		praiseElement.setAttribute('total',newTotal);
		//判断没有人点赞的时候是否显示文字
		praiseElement.style.display = (newTotal == 0) ? 'none' : 'block';
	}

	//发表回复，传入一个参数box，代表每一个父节点
	function replayBox(box) {
		//获取输入框
		var textarea = box.getElementsByTagName('textarea')[0];
		//获取列表
		var list = box.getElementsByClassName('comment-list')[0];
		var divli = document.createElement("div");
		divli.className = 'comment-box clearfix';
		divli.setAttribute('user','selef');
		var html = '<img class="myhead" src="images/my.jpg" alt=""/>'+
			'<div class="comment-content">'+
			'<p class="comment-text"><span class="user">我：</span>'+ textarea.value +'</p>'+
			'<p class="comment-time">'+
			getTime()+
			'<a href="javascript:;" class="comment-praise" total="0" my="0" style="">赞</a>'+
			'<a href="javascript:;" class="comment-operate">删除</a>'+
			'</p>'+
			'</div>'
		divli.innerHTML = html;
		list.appendChild(divli);
		textarea.value = '';
		textarea.onblur();
	}

	function getTime() {
		var t = new Date();  //创建一个日期对象
		var y = t.getFullYear();  //获取年份
		var m = t.getMonth() + 1; //获取月份
		var d = t.getDate();     //同理
		var h = t.getHours();
		var mi = t.getMinutes();
		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d;
		h = h < 10 ? '0' + h : h;
		mi = mi < 10 ? '0' + mi : mi;
		return y + '-' + m + '-' + d + ' ' + h + ':' + 'mi';
	}

	//回复赞
	function praiseReply(el) {
		var oldTotal = parseInt(el.getAttribute('total'));
		var my = parseInt(el.getAttribute('my'));
		var newTotal;
		if(my == 0) {
			newTotal = oldTotal + 1;
			el.setAttribute('total',newTotal);
			el.setAttribute('my',1);
			el.innerHTML = newTotal + '取消赞';
		}
		else {
			newTotal = oldTotal - 1;
			el.setAttribute('total',newTotal);
			el.setAttribute('my',0);
			el.innerHTML = (newTotal == 0) ? '赞' : newTotal + ' 赞';
		}
		el.style.display = (newTotal == 0) ? '' : 'inline-block';
	}
	//操作回复
	function operateReply(el) {
		var commentBox = el.parentNode.parentNode.parentNode;
		var box = commentBox.parentNode.parentNode.parentNode;
		var textarea = box.getElementsByClassName('comment')[0];
		var user = commentBox.getElementsByClassName('user')[0].innerHTML;
		var txt = el.innerHTML;
		if (txt == '回复') {
			textarea.focus();
			textarea.value = '回复' + user;
			textarea.onkeyup();
		}
		else {
			removeNode(commentBox);
		}
	}

	//遍历,给每一个元素都加上一个onclick事件
	//把事件代理到每条分享div容器
	for (var i = 0; i<lis.length; i++) {
		lis[i].onclick = function (e) {
			e = e || window.event;
			//定义一个变量用来存放触发元素
			var el = e.srcElement;
			//做循环，根据每一个class来判断点击了哪个元素
			switch (el.className) {
				//点击关闭按钮
				case 'close' :
					removeNode(el.parentNode);  // 调用方法，删除父节点
					break;
				//点击赞分享
				case 'praise' :
					praiseBox(el.parentNode.parentNode.parentNode,el);  //获取到父元素,即box元素，再传一个参数
					break;
				case 'btn btn-off' :
					clearTimeout(timer);
					break;
				//发表回复按钮
				case 'btn' :
					replayBox(el.parentNode.parentNode.parentNode);
					break;
				//赞回复
				case 'comment-praise' :
					praiseReply(el);
					break;
				//操作留言
				case 'comment-operate' :
					operateReply(el);
					break;
			}
		}

		//输入框
		//获取输入框的元素
		var textArea = lis[i].getElementsByClassName('comment')[0];

		//获取焦点
		textArea.onfocus = function () {
			//获取父元素的class
			this.parentNode.className = 'text-box text-box-on';
			this.value = this.value == '评论...' ? '' : this.value;
			this.onkeyup();
		}

		//失去焦点
		textArea.onblur = function () {
			var me = this;
			if (this.value == '') {
				timer = setTimeout(function () {
					me.parentNode.className = 'text-box';
					me.value = '评论...';
				}, 400)
			}
		}

		//键盘按下的事件
		textArea.onkeyup = function () {
			//获取输入框的内容长度
			var len = this.value.length;
			//获取父元素,此时的this代表着输入框textArea
			var p = this.parentNode;  //即是获取到text-box
			//获取按钮的元素
			var btn = p.children[1];
			//获取统计字数的元素
			var word = p.children[2];
			if (len == 0 || len > 140) {
				btn.className = 'btn btn-off';
			}
			else {
				btn.className = 'btn';
			}
			word.innerHTML = len + '/140';
		}
	}
}