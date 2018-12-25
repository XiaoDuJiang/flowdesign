$(function() {
	var loadingLayer;

	//绑定详细信息显示
	//node_id
	//custFlowData[i].node_id
	$("body").on("mouseover", ".show-nodeinfo", function(e) {
		//组织数据
		var nodeid = $(this).attr("flownode_id");
		for(var i = (custFlowData.length - 1); i >= 0; i--) {
			if(custFlowData[i].node_id == nodeid) {
				$(".node-info p span").eq(0).text(custFlowData[i].node_operator);
				$(".node-info p span").eq(1).text(custFlowData[i].node_operatortime);
				//还需要备注
				var remark = "暂无备注";
				if(custFlowData[i].node_appresult) {
					remark = custFlowData[i].node_appresult
				}
				$(".node-info p span").eq(2).text(remark);
				//改变位置
				$(".node-info").css({
					"top": (e.target.offsetTop + 70) + "px",
					"left": (e.target.offsetLeft + 10) + "px"
				});
				$(".node-info").css("display", "block");
				break;
			}
		}
	});

	//详细信息隐藏
	$("body").on("mouseout", ".show-nodeinfo", function(e) {
		$(".node-info").css("display", "none");
	});

	$("body").on("mouseover", ".show-nodeinfo1", function(e) {
		//组织数据
		var nodeIdx = $(this).attr("flownode_id");

		$(".node-info p span").eq(0).text(custFlowData[nodeIdx].node_operator);
		$(".node-info p span").eq(1).text(custFlowData[nodeIdx].node_operatortime);
		//还需要备注
		var remark = "暂无备注";
		if(custFlowData[nodeIdx].node_appresult) {
			remark = custFlowData[nodeIdx].node_appresult
		}
		$(".node-info p span").eq(2).text(remark);

		//改变位置
		$(".node-info").css({
			"top": (e.target.offsetTop + 70) + "px",
			"left": (e.target.offsetLeft + 10) + "px"
		});
		$(".node-info").css("display", "block");
	});

	//详细信息隐藏
	$("body").on("mouseout", ".show-nodeinfo1", function(e) {
		$(".node-info").css("display", "none");
	});

	//tab切换绑定
	$(".flow-tab li").bind("click", function() {
		clickTab = $(this);
		if(!clickTab.attr("class") || clickTab.attr("class").indexOf("active") == -1) {
			$(".flow-tab li").removeClass("active");
			$(this).addClass("active");
			$(".cust-flow").addClass("displaynone");
			$(".mini-layout").addClass("displaynone");
			$("." + $(this).attr("data-tab")).removeClass("displaynone");
			//如果获取过数据了就不获取了
			if($(this).attr("data-tab") == 'mini-layout' && !workFlowProcess) {
				getStandardFlow();
			}
		}

	});

	/******用户流程初始化*******/
	var custFlowData;
	var workFlowId = 7;
	var workFlowProcess;
	getCustFlow();

	//获取用户流程
	function getCustFlow() {
		$("html").animate({
			scrollTop: 0
		});
		//获取url中的cust_id
		var urlAry = window.location.href.split("?");
		if(urlAry.length > 1) {
			urlAry = urlAry[1].split("&");
			if(urlAry[0].indexOf('cust_id=') != -1) {
				var cust_id = parseInt(urlAry[0].split("=")[1]);
				if(cust_id && !isNaN(cust_id) && cust_id > 0) {
					$.ajax({
						type: "get",
						url: "/Home/Nodesprocess/processTest",
						async: true,
						data: {
							'cust_id': cust_id
						},
						beforeSend: function() {
							loadingLayer = layer.load(1);
						},
						success: function(data) {
							data = eval('(' + data + ')');
							if(data.status == 200) {
								custFlowData = data.data.process;
								workFlowId = data.data.workflow_id;
								routeType = data.data.flag;
								$(".cust-flow-title").find("span").text(data.data.cust_name);
								//绘制流程图
								custFlowDraw();
							} else {
								layer.alert(data.message, {
									time: 3000
								});
							}
							//消除遮罩
							layer.close(loadingLayer);
						}
					});

				}
			}
		}

	}

	//绘制客户流程
	function custFlowDraw() {
		for(var i = 0; i < custFlowData.length; i++) {
			//第一个是开始节点
			if(i == 0) {
				$(".cust-flow-list").append(
					'<div class="node-s-1 show-nodeinfo1" flownode_id="' + i + '">' + custFlowData[i].node_name + '</div>' +
					'<div class="node-right"></div>'
				);
			} else {
				//看状态 node_type 0输入 1审批
				//状态 i,v,t是绿色
				//E是终止
				//"curr" 1 当前
				//如果是终止
				if(custFlowData[i].node_stauts == "E") {
					$(".cust-flow-list").append(
						'<div class="node-e-1 show-nodeinfo1" flownode_id="' + i + '">' + custFlowData[i].node_name + '<div>'
					);
				} else {
					var nodeClass = "node-1";
					//如果是正在执行的节点
					if(custFlowData[i].curr == 1) {
						nodeClass = nodeClass + "-2 currnode";
					} else if(custFlowData[i].node_stauts == "J" || custFlowData[i].node_stauts == "S") {
						nodeClass = nodeClass + "-4 show-nodeinfo1";
					} else {
						nodeClass = nodeClass + "-1 show-nodeinfo1";
					}
					//如果不是最后一个节点
					if(i != (custFlowData.length - 1)) {
						$(".cust-flow-list").append(
							'<div class="' + nodeClass + '" flownode_id="' + i + '">' + custFlowData[i].node_name + '</div>' +
							'<div class="node-right"></div>'
						);
					} else {
						$(".cust-flow-list").append(
							'<div class="' + nodeClass + '" flownode_id="' + i + '">' + custFlowData[i].node_name + '</div>'
						);
					}
				}

			}
		}
	}

	/******标准流程初始化*******/
	//获取标准流程
	function getStandardFlow() {
		$.ajax({
			type: "post",
			url: "/Home/Cust/getProcessInfo",
			async: true,
			data: {
				'workflow_id': workFlowId,
				'type': 1
			},
			beforeSend: function() {
				loadingLayer = layer.load(1);
			},
			success: function(data) {
				data = eval("(" + data + ")");
				if(data.status == '200') {
					flowId = data.list['0'].id;
					//存放流程图信息
					var processData = {};
					processData = data.list['0'];
					processData.list = data.list.list;
					workFlowProcess = processData;
					Design.init($("#flowdesign_canvas"), {
						"processData": processData
					});
					standardFlowDraw();
					$("._jsPlumb_endpoint").hide();
					//消除遮罩
					layer.close(loadingLayer);
				} else {
					layer.alert(data.msg, {
						time: 3000
					});
				}
			}
		});

	}

	//标准流程图变成显示当前状态
	function standardFlowDraw() {
		//将所有节点变成未执行
		$(".process-step").each(function() {
			var stepDiv = $(this);
			var processType = stepDiv.attr('process_type');
			//如果不是开始
			if(processType != 's') {
				stepDiv.removeClass("node-" + processType + "-1");
				stepDiv.addClass("node-" + processType + "-3");
			}

		});

		//记录nodeid
		nodeids = [];
		currids = [];
		//先获取在执行的节点
		for(var i in custFlowData) {
			nodeids.push(custFlowData[i].node_id);
			if(custFlowData[i].curr == 1) {
				currids.push(custFlowData[i].node_id);
			}
		}

		//获取最后一位的index
		var maxIndex = nodeids.indexOf(currids[0]);
		var minIndex = nodeids.indexOf(currids[0]);
		for(var i = 1; i < currids.length; i++) {
			if(maxIndex < nodeids.indexOf(currids[i])) {
				maxIndex = nodeids.indexOf(currids[i]);
			}
			if(maxIndex > nodeids.indexOf(currids[i])) {
				minIndex = nodeids.indexOf(currids[i]);
			}
		}

		//显示数据
		//替换样式
		for(var i = 0; i <= maxIndex; i++) {
			//如果这个节点可以显示
			var custNode = $(".process-step[flownode_id='" + custFlowData[i].node_id + "']");
			//如果存在节点
			if(custNode) {
				//并且这个节点显示
				for(var j = 0; j < custNode.length; j++) {
					if(!custNode.eq(j).attr("process_routetype") || custNode.eq(j).attr("process_routetype") == routeType) {
						custNode.eq(j).removeClass("node-" + custNode.eq(j).attr('process_type') + "-3");
						if(i <= maxIndex && i >= minIndex) {
							//如果正在执行
							custNode.eq(j).addClass("node-" + custNode.eq(j).attr('process_type') + "-2");
							custNode.eq(j).addClass("currnode");
						} else {
							if(custFlowData[i].curr == 0) {
								custNode.eq(j).addClass("node-" + custNode.eq(j).attr('process_type') + "-1");
								//按照定位生成一个div
								//class="show-nodeinfo"
								//flownode_id
								$(".process-shadow").append(
									"<div flownode_id='" + custFlowData[i].node_id + "' class='show-nodeinfo' style='position:absolute;height:70px;width:120px;top:" + custNode.eq(j).offset().top + "px;left:" + custNode.eq(j).offset().left + "px;'></div>"
								);

							} else if(custFlowData[i].curr == 1) {
								//如果正在执行
								custNode.eq(j).addClass("node-" + custNode.eq(j).attr('process_type') + "-2");
								custNode.eq(j).addClass("currnode");
							}
						}
					}
				}

			}

		}

	}

});