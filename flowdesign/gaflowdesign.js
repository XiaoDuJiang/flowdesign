define(['jquery', 'jsPlumb', 'contextmenu'], function($, jsPlumb) {
	var Design = function() {
		var _canvas;
		var contextmenu
		var design = {
			//显示init
			init: function($el, options) {
				_canvas = $el;
				//隐藏节点用于记录连接数据
				_canvas.append('<input type="hidden" id="process-active-id" value="0"></input>');
				_canvas.append('<div id="process-to-info"></div>');

				//记录绑定菜单
				defaults.processMenus = options.processMenus;

				//存在节点
				if(options.canvasMenus) {
					/*右键菜单绑定*/
					contextmenu = {
						bindings: options.canvasMenus,
						menuStyle: defaults.menuStyle,
						itemStyle: defaults.itemStyle,
						itemHoverStyle: defaults.itemHoverStyle
					}
					_canvas.contextMenu('canvasMenu', contextmenu);
				}

				//配置连接信息
				jsPlumb.importDefaults({
					DragOptions: {
						cursor: 'pointer'
					},
					EndpointStyle: {
						fillStyle: '#225588'
					},
					Endpoint: ["Dot", {
						radius: 1
					}],
					ConnectionOverlays: [
						["Arrow", {
							location: 1
						}],
						["Label", {
							location: 0.1,
							id: "label",
							cssClass: "aLabel"
						}]
					],
					Anchor: 'Continuous',
					ConnectorZIndex: 5,
					HoverPaintStyle: defaults.connectorHoverStyle,
					deleteEndpointsOnDetach: false
				});

				//兼容处理
				if(window.navigator.userAgent.indexOf("MSIE") != -1) { //ie9以下，用VML画图
					jsPlumb.setRenderMode(jsPlumb.VML);
				} else { //其他浏览器用SVG
					jsPlumb.setRenderMode(jsPlumb.SVG);
				}

				//初始化数据
				var lastProcessId = 0;
				var processData = options.processData;
				if(processData.list) {
					$.each(processData.list, function(i, row) {
						var nodeDiv = document.createElement('div');
						var nodeId = "window" + row.id,
							badge = 'badge-inverse',
							icon = 'icon-star';
						if(lastProcessId == 0) //第一步
						{
							badge = 'badge-info';
							icon = 'icon-play';
						}
						if(row.icon) {
							icon = row.icon;
						}
						row.routetype = row.routetype ? row.routetype : "";
						$(nodeDiv).attr("id", nodeId)
							.attr("style", row.style)
							.attr("process_to", row.process_to)
							.attr("process_id", row.id)
							.attr("process_type", row.type)
							.attr("flownode_id", row.flownode_id)
							.attr("process_routetype", row.routetype)
							.addClass("node-" + row.type + "-1")
							.addClass("process-step btn btn-small")
							.html('<p>' + row.process_name + '</p><span>' + row.id + '</span>')
							.mousedown(function(e) {
								if(e.which == 3) { //右键绑定
									_canvas.find('#process-active-id').val(row.id);
									contextmenu.bindings = options.processMenus
									$(this).contextMenu('processMenu', contextmenu);
								}
							});
						_canvas.append(nodeDiv);
						//索引变量
						lastProcessId = row.id;
					});
				}

				//绑定选中的事件
				var timeout = null;
				//点击或双击事件,这里进行了一个单击事件延迟，因为同时绑定了双击事件
				$(".process-step").on('click', function() {
					//激活
					_canvas.find('#process-active-id').val($(this).attr("process_id"));
					clearTimeout(timeout);
					var obj = this;
					timeout = setTimeout(defaults.fnClick, 300);
				}).on('dblclick', function() {
					clearTimeout(timeout);
					defaults.fnDbClick();
				});

				//让div可以拖动
				jsPlumb.draggable(jsPlumb.getSelector(".process-step"));
				//初始化四个端点
				initEndPoints();

				//绑定连接操作
				jsPlumb.bind("connection", function(connInfo, originalEvent) {
					if(connInfo.sourceId != connInfo.targetId) {
						//先组织字符串
						var constr = '' + connInfo.targetId + ',' + connInfo.sourceEndpoint.anchor.type + ',' + connInfo.targetEndpoint.anchor.type + ';';
						//确认是否为重复连接
						var isRe = false;
						$("#process-to-info").find("input[name='con-" + connInfo.sourceId + "']").each(function(i, e) {
							if($(e).val() == constr) {
								isRe = true;
							}
						});

						//如果未重复连接就储存连接信息 
						//必须储存连接的id 删除的时候使用
						if(!isRe) {
							$("#process-to-info").append(
								'<input type="hidden" data-conid="' + connInfo.connection.id + '" name="con-' + connInfo.sourceId + '" value="' + constr + '" />'
							);
						}
					}
				});

				//绑定删除确认操作
				jsPlumb.bind("click", function(c) {
					if(confirm("你确定取消连接吗?")) {
						//删除连接信息
						$("input[data-conid='" + c.id + "']").remove();
						jsPlumb.detach(c);
					}
				});

				//关键连接步骤
				//如果list
				if(processData.list) {
					$.each(processData.list, function(y, row) {
						//如果有步骤信息
						if(row.process_to) {
							/*
							 [
								 'window75','LeftMiddle','RightMiddle',
								 'window76','LeftMiddle','RightMiddle',
								 'window77','LeftMiddle','RightMiddle'
							 ]
							 */
							//转换成数组
							row.process_to = row.process_to.split(";");
							row.process_to.pop();
							for(var x in row.process_to) {
								row.process_to[x] = row.process_to[x].split(',');
							}

							for(var i in row.process_to) {
								//连接端点
								var sourceEp, TargetEp;
								//获取起始点
								var sourceEpAry = jsPlumb.getEndpoints("window" + row.id);
								for(var j in sourceEpAry) {
									if(sourceEpAry[j].anchor.type == row.process_to[i][1]) {
										sourceEp = sourceEpAry[j];
										break;
									}
								}
								//获取连接点
								//获取endpoint
								var TargetEpAry = jsPlumb.getEndpoints(row.process_to[i][0]);
								for(var j in TargetEpAry) {
									if(TargetEpAry[j].anchor.type == row.process_to[i][2]) {
										TargetEp = TargetEpAry[j];
										break;
									}
								}
								//连接
								jsPlumb.connect({
									source: sourceEp,
									target: TargetEp
								});
							}
						}
					});
				}
			},
			//其他方法
			//增加节点
			addProcess: function(row) {
				if(row.id <= 0) {
					return false;
				}

				var nodeDiv = document.createElement('div');
				var nodeId = "window" + row.id;

				row.routetype = row.routetype ? row.routetype : "";
				//赋属性
				$(nodeDiv).attr("id", nodeId)
					.attr("style", row.style)
					.attr("process_to", row.process_to)
					.attr("process_id", row.id)
					.attr("process_type", row.type)
					.attr("flownode_id", row.flownode_id)
					.attr("process_routetype", row.routetype)
					.addClass("node-" + row.type + "-1")
					.addClass("process-step btn btn-small")
					.html('<p>' + row.process_name + '</p><span>' + row.id + '</span>')
					.mousedown(function(e) {
						if(e.which == 3) { //右键绑定
							_canvas.find('#process-active-id').val(row.id);
							contextmenu.bindings = defaults.processMenus
							$(this).contextMenu('processMenu', contextmenu);
						}
					});

				_canvas.append(nodeDiv);
				//使之可拖动 和 连线
				jsPlumb.draggable(nodeId);

				//添加endpoint
				jsPlumb.addEndpoint(nodeId, {
					anchors: "TopCenter"
				}, defaults.hollowCircle);
				jsPlumb.addEndpoint(nodeId, {
					anchors: "RightMiddle"
				}, defaults.hollowCircle);
				jsPlumb.addEndpoint(nodeId, {
					anchors: "BottomCenter"
				}, defaults.hollowCircle);
				jsPlumb.addEndpoint(nodeId, {
					anchors: "LeftMiddle"
				}, defaults.hollowCircle);

				return true;
			},
			//删除节点
			delProcess: function(activeId) {
				//删除连接点
				var delEnps = jsPlumb.getEndpoints("window" + activeId);
				for(var i in delEnps) {
					jsPlumb.deleteEndpoint(delEnps[i]);
				}

				//删除所有的记录的连接关系
				$("input[name='con-window" + activeId + "']").remove();
				var haveDelConAry = [];
				$("#process-to-info input[type='hidden']").each(function() {
					if($(this).val().indexOf("window" + activeId) != -1) {
						$(this).remove();
					}
				});

				//删除连接关系(必须)
				jsPlumb.detachAllConnections($("#window" + activeId))

				//删除节点
				$("#window" + activeId).remove();

				return true;
			},
			//获取id
			getActiveId: function() {
				return _canvas.find("#process-active-id").val();
			},
			//获取流程图数据
			getProcessInfo: function() {
				/*连接关系*/
				var ProcessToData = {};
				_canvas.find("div.process-step").each(function(i, v) {
					if($(this).attr("id")) {
						var pId = $(this).attr('process_id');
						var pLeft = parseInt($(this).css('left'));
						var pTop = parseInt($(this).css('top'));
						var pType = $(this).attr('process_type');
						var pFlowNodeId = $(this).attr('flownode_id');
						var pProcess_to = '';
						$("#process-to-info").find("input[name='con-window" + pId + "']").each(function(i, e) {
							pProcess_to += $(e).val();
						});

						ProcessToData[pId] = {};
						ProcessToData[pId]["top"] = pTop;
						ProcessToData[pId]["left"] = pLeft;
						ProcessToData[pId]["type"] = pType;
						ProcessToData[pId]["flownode_id"] = pFlowNodeId;
						ProcessToData[pId]["id"] = pId;
						ProcessToData[pId]["style"] = "top:" + pTop + "px;left:" + pLeft + "px;";
						ProcessToData[pId]["process_to"] = pProcess_to;
					}
				});
				var str = JSON.stringify(ProcessToData);
				return JSON.stringify(ProcessToData);
			},
			//清空连接
			clear: function() {
				try {
					jsPlumb.detachEveryConnection();
					$('#process-to-info').html('');
					//重画
					jsPlumb.repaintEverything();
					return true;
				} catch(e) {
					return false;
				}
			}
		}

		//私有变量
		var defaults = {
			//节点数据
			processData: {},
			//右键菜单样式
			menuStyle: {
				border: '1px solid #5a6377',
				minWidth: '150px',
				padding: '5px 0'
			},
			itemStyle: {
				fontFamily: 'verdana',
				color: '#333',
				border: '0',
				padding: '5px 40px 5px 20px'
			},
			itemHoverStyle: {
				border: '0',
				color: '#fff',
				backgroundColor: '#5a6377'
			},
			//基本连线样式
			connectorPaintStyle: {
				lineWidth: 2,
				strokeStyle: "#61B7CF",
				joinstyle: "round",
				outlineColor: "white",
				outlineWidth: 2
			},
			//鼠标悬浮在连接线上的样式
			connectorHoverStyle: {
				lineWidth: 2,
				strokeStyle: "#216477",
				outlineWidth: 2,
				outlineColor: "white"
			},
			//半圆endpoint
			hollowCircle: {
				endpoint: ["Dot", {
					radius: 8
				}], //端点的形状
				connectorStyle: {
					lineWidth: 3,
					strokeStyle: "#61B7CF",
					joinstyle: "round",
					outlineColor: "white",
					outlineWidth: 2
				}, //连接线的颜色，大小样式
				connectorHoverStyle: {
					lineWidth: 2,
					strokeStyle: "#216477",
					outlineWidth: 2,
					outlineColor: "white"
				},
				paintStyle: {
					strokeStyle: "#1e8151",
					fillStyle: "transparent",
					radius: 2,
					lineWidth: 2
				}, //端点的颜色样式
				//anchor: "AutoDefault",
				isSource: true, //是否可以拖动（作为连线起点）
				connector: ["Flowchart", {
					stub: [0, 20],
					gap: 10,
					cornerRadius: 5,
					alwaysRespectStubs: true
				}], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
				isTarget: true, //是否可以放置（连线终点）
				maxConnections: -1, // 设置连接点最多可以连接几条线
				connectorOverlays: [
					["Arrow", {
						width: 10,
						length: 10,
						location: 1
					}]
				]
			}
		}

		//初始化端点
		var initEndPoints = function() {
			$(".process-step").each(function(i, e) {
				jsPlumb.addEndpoint($(e).attr("id"), {
					anchors: "TopCenter"
				}, defaults.hollowCircle);
				jsPlumb.addEndpoint($(e).attr("id"), {
					anchors: "RightMiddle"
				}, defaults.hollowCircle);
				jsPlumb.addEndpoint($(e).attr("id"), {
					anchors: "BottomCenter"
				}, defaults.hollowCircle);
				jsPlumb.addEndpoint($(e).attr("id"), {
					anchors: "LeftMiddle"
				}, defaults.hollowCircle);

			});
		}

		return design;

	}();

	return Design;
});