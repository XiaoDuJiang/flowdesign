define(['hplus', 'layer', 'flowdesign', 'table', 'form', 'hplustree', 'chosen'], function(Hplus, layer, Design, Table, Form, Hplustree) {
	var Controller = {
		catalog: function() {
			Hplustree.api.showinit(catalog_data);
		},
		index: function() {
			var table_instance = Table.api.hplusInitTable('#my-datatable', table_options);
			//删除
			Table.api.toFunctionHandler({
				picker: '.js-delete',
				key: table_options.rowId,
				content: '确定删除？',
			});
		},
		add: function() {
			Form.api.hplusInitForm($('form[role=form]'), formdata);
		},
		edit: function() {
			Form.api.hplusInitForm($('form[role=form]'), formdata);
		},
		flowdesign: function() {
			//loading
			var layerLoading;
			//流程图信息保存
			var editorFlowObj = {
				flow_id: 0
			};
			//记录chosen是否使用
			var chosenShowObj = {
				role: false,
				ele: false
			}
			//页面数据初始化
			initInfo();

			//页面数据初始化
			function initInfo() {
				//用于记录初始化完毕
				var initNum = 0;
				//loading
				layerLoading = layer.load(1);
				//首先获取所有流程的列表 getFlowList
				$.ajax({
					type: "post",
					url: "/platform/flow/getFlowList",
					async: true,
					success: function(data) {

						if(data.code == 1) {
							//根据层级对流程图进行树形排列
							var flhtml = '';
							for(var i in data.data) {
								$level_space = "";
								for(var j = 0; j < (parseInt(data.data[i]['level']) - 1); j++) {
									$level_space += "&nbsp;&nbsp;&nbsp;&nbsp;";
								}
								flhtml += '<option value="' + data.data[i].flow_id + '">' + $level_space + data.data[i].flow_name + '</option>';
							}
							$(".flow_id").html(flhtml);

							//绑定change方法  选择和新建不同
							$("body").on("change", ".flow_id", function() {
								var val = $(this).val();
								if(val == 0) {
									//初始化值
									$(".flow_name").val("");
									$(".flow_type").val(1);
									$(".flow_table").val("main_van_loan");
									//隐藏遮盖
									$(".flow-info-shade").hide();
								} else {
									$(".flow-info-shade").show();
									for(var i in data.data) {
										if(data.data[i].flow_id == val) {
											$(".flow_name").val(data.data[i].flow_name);
											$(".flow_type").val(data.data[i].flow_type);
											$(".flow_table").val(data.data[i].flow_table);
										}
									}
								}

							});

							initNum++;
							if(initNum == 5) {
								layer.close(layerLoading);
								//默认打开窗口
								openWindow("选择流程", "flow-info-box", false);
								$(".layui-layer-content .flow_id").chosen();
							}
						} else {
							layer.alert("初始化数据失败，请刷新页面重试");
						}
					}
				});

				//获取元素表的列表 getElementList
				$.ajax({
					type: "post",
					url: "/platform/flow/getElementList",
					async: true,
					success: function(data) {
						if(data.code == 1) {
							var elehtml = "";
							for(var i in data.data) {
								elehtml += '<option value="' + data.data[i].ele_id + '">' + data.data[i].ele_cname + '</option>'
							}
							$(".node_nes_field").html(elehtml);
							$(".node_nones_field").html(elehtml);
							$(".node_auto_field").html(elehtml);
							$(".node_bill_user").html('<option value="">无</option>' + elehtml);
							initNum++;
							if(initNum == 5) {
								layer.close(layerLoading);
								//默认打开窗口
								openWindow("选择流程", "flow-info-box", false);
								$(".layui-layer-content .flow_id").chosen();
							}
						} else {
							layer.alert("初始化数据失败，请刷新页面重试");
						}
					}
				});

				//获取角色表列表 getRoleList
				$.ajax({
					type: "post",
					url: "/platform/flow/getRoleList",
					async: true,
					success: function(data) {

						if(data.code == 1) {
							var rlhtml = "";
							for(var i in data.data) {
								rlhtml += '<option value="' + data.data[i].role_id + '">' + data.data[i].role_name + '</option>'
							}
							$(".node_role").html(rlhtml);
							initNum++;
							if(initNum == 5) {
								layer.close(layerLoading);
								//默认打开窗口
								openWindow("选择流程", "flow-info-box", false);
								$(".layui-layer-content .flow_id").chosen();
							}
						} else {
							layer.alert("初始化数据失败，请刷新页面重试");
						}
					}
				});

				//获取人员表列表 getManagerList
				$.ajax({
					type: "post",
					url: "/platform/flow/getManagerList",
					async: true,
					success: function(data) {
						if(data.code == 1) {
							var mghtml = "";
							for(var i in data.data) {
								mghtml += '<option value="' + data.data[i].mg_id + '">' + data.data[i].mg_real_name + '</option>'
							}
							$(".node_user").html(mghtml);
							initNum++;
							if(initNum == 5) {
								layer.close(layerLoading);
								//默认打开窗口
								openWindow("选择流程", "flow-info-box", false);
								$(".layui-layer-content .flow_id").chosen();
							}
						} else {
							layer.alert("初始化数据失败，请刷新页面重试");
						}
					}
				});

				//获取第三级别公司列表
				$.ajax({
					type: "post",
					url: "/platform/flow/getLvThreeCompany",
					async: true,
					success: function(data) {
						if(data.code == 1) {
							var cmhtml = "";
							for(var i in data.data) {
								cmhtml += '<option value="' + data.data[i].comp_id + '">' + data.data[i].comp_name + '</option>'
							}
							$(".province_id").html(cmhtml);
							initNum++;
							if(initNum == 5) {
								layer.close(layerLoading);
								//默认打开窗口
								openWindow("选择流程", "flow-info-box", false);
								$(".layui-layer-content .flow_id").chosen();
							}
						} else {
							layer.alert("初始化数据失败，请刷新页面重试");
						}
					}
				});

				//绑定切换方法
				$("body").on("click", ".layui-layer-content .node-info-tab li", function() {
					var tablist = [];
					$(this).parent().find("li").each(function() {
						$(this).removeClass("active");
						tablist.push($(this).attr("data-tab"));
					});

					var $nid = $(this).parent().parent().next();
					//隐藏全部
					for(var i in tablist) {
						$nid.find("." + tablist[i]).hide();
					}

					var tab = $(this).attr("data-tab");
					$nid.find("." + tab).show();

					$(this).addClass("active");
					if(tab == "node-tab-ele") {
						if(!chosenShowObj.ele) {
							$(".layui-layer-content .node-tab-ele .chosen").chosen({
								placeholder_text_multiple: "此处输入值进行搜索"
							});
							chosenShowObj.ele = true;
						}
					} else if(tab == "node-tab-role") {
						if(!chosenShowObj.role) {
							$(".layui-layer-content .node-tab-role .chosen").chosen({
								placeholder_text_multiple: "此处输入值进行搜索"
							});
							chosenShowObj.role = true;
						}
					}
				});

				//绑定确定点击事件
				$("body").on("click", ".layui-layer-content .flow-info-submit", function() {
					$formdiv = $(this).parent().parent();
					//获取select值
					var flow_id = $formdiv.find(".flow_id").val();
					//获取数据
					var flow_name = $formdiv.find(".flow_name").val();
					var flow_type = $formdiv.find(".flow_type").val();
					var flow_table = $formdiv.find(".flow_table").val();
					editorFlowObj.flow_name = flow_name;
					editorFlowObj.flow_type = flow_type;
					editorFlowObj.flow_table = flow_table;
					if(flow_id == 0) {
						//新建
						if(flow_name && flow_type && flow_table) {
							$.ajax({
								type: "post",
								url: "/platform/flow/addFlow",
								async: true,
								data: {
									"flow_name": flow_name,
									"flow_type": flow_type,
									"flow_table": flow_table
								},
								beforeSend: function() {
									layerLoading = layer.load(1);
								},
								success: function(data) {

									if(data.code == 1) {
										//记录id
										editorFlowObj.flow_id = data.data;
										layer.close(layerLoading);
										layer.msg("创建表单成功", {
											time: 1000
										});
										//改变标题
										$("#flow-title").text(flow_name);
										//初始化流程图
										flowInit({
											list: []
										});

										layer.close(layerWindow);
									} else {
										layer.close(layerLoading);
										layer.alert(data.msg);
									}
								}
							});
						} else {
							layer.alert("请将流程信息填写完整");
						}
					} else {
						//编辑
						//获取节点数据
						$.ajax({
							type: "post",
							url: "/platform/flow/getNodeListByFlowId",
							async: true,
							data: {
								"flow_id": flow_id
							},
							beforeSend: function() {
								layerLoading = layer.load(1);
							},
							success: function(data) {

								if(data.code == 1) {
									//组织数据
									//记录id
									editorFlowObj.flow_id = flow_id;
									editorFlowObj.flow_name = $formdiv.find(".flow_name").val();
									editorFlowObj.flow_type = $formdiv.find(".flow_type").val();
									editorFlowObj.flow_table = $formdiv.find(".flow_table").val();

									$("#flow-title").text(flow_name);
									//改变成流程图的数据类型
									var processData = {};
									processData.list = [];
									//组织数据
									for(var i in data.data) {
										processData.list.push({
											style: data.data[i].node_position,
											type: data.data[i].node_flow_type + "-" + data.data[i].node_html_type,
											id: data.data[i].node_id,
											process_to: data.data[i].node_line,
											process_name: data.data[i].node_name,
											process_routetype: "",
											flownode_id: "",
											process_id: data.data[i].node_id
										});
									}
									//初始化流程图
									flowInit(processData);

									layer.close(layerLoading);
									layer.close(layerWindow);
								} else {
									layer.close(layerLoading);
									layer.alert(data.msg);
								}
							}
						});
					}
				});

				//绑定选择流程类型和页面类型的联动方法
				$("body").on("change", ".layui-layer-content .node_flow_type", function() {
					var secval = $(this).val();
					if(secval == "1" || secval == "2" || secval == "3") {
						$(".layui-layer-content .node_html_type").html(
							'<option value="1">查阅页面</option>' +
							'<option value="2">分配页面</option>' +
							'<option value="3">录入页面</option>' +
							'<option value="4">校队页面</option>' +
							'<option value="5">审批页面</option>'
						);
					} else {
						$(".layui-layer-content .node_html_type").html(
							'<option value="0">非普通节点</option>'
						);
					}

					if(secval == "5") {
						$(".layui-layer-content .node_name").val("并行开始");
					} else if(secval == "6") {
						$(".layui-layer-content .node_name").val("并行结束");
					}
				});

			}

			var layerWindow;
			//打开窗口
			function openWindow(title, contentClass, close) {
				/*var area = [$(window).width() > 800 ? '800px' : '95%', $(window).height() > 600 ? '600px' : '95%'];*/
				//高度自适应
				var area = ['1000px'];
				options = {
					type: 1,
					title: title,
					shadeClose: close,
					maxmin: false,
					moveOut: true,
					area: area
				}
				if($(window).width() < 480 || (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) && top.$(".J_mainContent").length > 0) {
					/*options.area = [top.$(".J_mainContent").width() + "px", top.$(".J_mainContent").height() + "px"];*/
					options.area = [top.$(".J_mainContent").width() + "px"];
					options.offset = [top.$(".J_mainContent").scrollTop() + "px", "0px"];
				}
				options.content = $("." + contentClass).html();
				layerWindow = Layer.open(options);
				if(close) {
					$(".layui-layer-setwin").show();
				} else {
					$(".layui-layer-setwin").hide();
				}
			}

			//流程图初始化方法
			function flowInit(processData) {
				//操作标志
				var operationFlag;
				//添加时候的位置信息
				var newPosition;
				//节点旧属性
				var oldNodeInfo = {};
				//编辑节点的id
				var ediotrId;
				//操作的nodeConfId
				var confId;
				//公司配置信息
				var nodeconf_list;

				//初始刷流程
				Design.init($("#flowdesign_canvas"), {
					//传入的数据
					"processData": processData,
					//右键菜单
					canvasMenus: {
						//添加
						"cmAdd": function(t) {
							//坐标
							var mLeft = $("#jqContextMenu").css("left"),
								mTop = $("#jqContextMenu").css("top");

							//初始化表单数据
							//弹出属性设置窗口
							operationFlag = "add";
							newPosition = "left:" + mLeft + ";top:" + mTop + ";"

							//初始化chosen标志
							chosenShowObj.ele = false;
							chosenShowObj.role = false;
							//坐标记录
							openWindow("添加节点", "node-info-box", true);
						},
						//保存
						"cmSave": function() {
							saveFlow();
						}
					},
					//右键节点
					processMenus: {
						//删除
						"pmDelete": function() {
							var delConfirm = layer.confirm('你确定删除节点吗？', {
								btn: ['删除', '取消'] //按钮
							}, function() {
								//删除节点
								var activeId = Design.getActiveId(); //右键当前的ID

								$.ajax({
									type: "post",
									url: "/platform/flow/deleteNode",
									async: true,
									data: {
										"node_id": activeId
									},
									beforeSend: function() {
										layerLoading = layer.load(1);
									},
									success: function(data) {

										if(data.code == 1) {
											Design.delProcess(activeId);
											saveFlow();
											layer.close(delConfirm);
										} else {
											layer.alert("删除失败");
											layer.close(delConfirm);
										}
										layer.close(layerLoading);
									}
								});
							});
						},
						//编辑
						"pmAttribute": function() {
							ediotrId = Design.getActiveId(); //右键当前的ID

							//通过id获取node数据
							$.ajax({
								type: "post",
								url: "/platform/flow/getNodeInfoById",
								async: true,
								data: {
									"node_id": ediotrId
								},
								beforeSend: function() {
									layerLoading = layer.load(1);
								},
								success: function(data) {

									if(data.code == 1) {
										//改变flag
										operationFlag = "editor";
										//初始化chosen标志
										chosenShowObj.ele = false;
										chosenShowObj.role = false;
										//打开窗口
										openWindow("编辑节点", "node-info-box", true);
										//写入数据
										setNodeInfoFormData(data.data);
										layer.close(layerLoading);
									} else {
										layer.alert("获取节点信息错误");
									}
								}
							});
						},
						/*省权限配置*/
						"pmProvinceSetting": function() {
							confId = Design.getActiveId(); //右键当前的ID
							var node_name = $("#window" + confId).find("p").text();
							//获取节点配置信息
							$.ajax({
								type: "post",
								url: "/platform/flow/getFlowNodeConfInfo",
								async: true,
								data: {
									node_id: confId
								},
								beforeSend: function() {
									layerLoading = layer.load(1);
								},
								success: function(data) {
									layer.close(layerLoading);
									//打开窗口
									openWindow("节点省份配置", "node-conf-box", true);
									//添加节点
									if(data.data && data.data.length > 0) {
										nodeconf_list = data.data;
										for(var i in nodeconf_list) {
											$(".layui-layer-content .node-conf-tab").append(
												'<li data-tab="node-tab-' + i + '">' + nodeconf_list[i]['comp_name'] + '</li>'
											);
											$(".layui-layer-content .node-tab-conf .province_id").find("option[value='" + nodeconf_list[i]['province_id'] + "']").remove();
										}
									}
									$(".layui-layer-content .node-tab-conf .node-conf-name").html(node_name + '<div class="delete-node-conf btn btn-danger btn-sm float-right" style="display:none">删除此配置</div>');
									//初始化chosen
									$(".layui-layer-content .node-tab-conf .province_id").chosen({
										placeholder_text_multiple: "此处输入值进行搜索"
									});
									$(".layui-layer-content .node-tab-conf .node_role").chosen({
										placeholder_text_multiple: "此处输入值进行搜索"
									});
									$(".layui-layer-content .node-tab-conf .node_user").chosen({
										placeholder_text_multiple: "此处输入值进行搜索"
									});
									$(".layui-layer-content .node-tab-conf .node_bill_user").chosen({
										placeholder_text_multiple: "此处输入值进行搜索"
									});
								}
							});
						}
					}

				});

				/*         省配置有关           */
				//取消
				$("body").on("click", ".layui-layer-content .node-conf-cancel", function() {
					layer.close(layerWindow);
				});

				//点击切换方法
				$("body").on("click", ".layui-layer-content .node-conf-tab li", function() {
					//切换active
					if(!$(this).attr("class") || $(this).attr("class").indexOf("active") == -1) {
						$(this).parent().find("li").removeClass("active");
						$(this).addClass("active");
						//公司隐藏显示
						if($(this).data("tab") == "node-tab-add") {
							$(".layui-layer-content .node-tab-conf .node_role").val('');
							$(".layui-layer-content .node-tab-conf .node_user").val('');
							$(".layui-layer-content .node-tab-conf .node_bill_user").val('');
							$(".layui-layer-content .node-tab-conf .node_role").trigger('chosen:updated');
							$(".layui-layer-content .node-tab-conf .node_user").trigger('chosen:updated');
							$(".layui-layer-content .node-tab-conf .node_bill_user").trigger('chosen:updated');
							$(".layui-layer-content .delete-node-conf").hide();
							$(".layui-layer-content .province_id").parent().parent().show();
						} else {
							$(".layui-layer-content .delete-node-conf").show();
							$(".layui-layer-content .province_id").parent().parent().hide();
							//改变显示值
							var info_data = nodeconf_list[parseInt($(this).data("tab").split("node-tab-")[1])];
							$(".layui-layer-content .node-tab-conf .node_role").val(info_data.node_role.split(","));
							$(".layui-layer-content .node-tab-conf .node_user").val(info_data.node_user.split(","));
							$(".layui-layer-content .node-tab-conf .node_bill_user").val(info_data.node_bill_user);
							$(".layui-layer-content .node-tab-conf .node_role").trigger('chosen:updated');
							$(".layui-layer-content .node-tab-conf .node_user").trigger('chosen:updated');
							$(".layui-layer-content .node-tab-conf .node_bill_user").trigger('chosen:updated');
						}
					}

				});

				//确定配置方法
				$("body").on("click", ".layui-layer-content .node-conf-submit", function() {
					//先判断是添加还是编辑
					var node_conf_id = $(this).parent().prev().prev().find(".node-conf-tab li[class='active']").data("tab").split("node-tab-")[1];
					var $select_div = $(this).parent().prev();
					var node_role = $select_div.find(".node_role").val();
					if(node_role) {
						node_role = node_role.join(",");
					}
					var node_user = $select_div.find(".node_user").val();
					if(node_user) {
						node_user = node_user.join(",");
					}
					var node_bill_user = $select_div.find(".node_bill_user").val();
					if(node_conf_id == "add") {
						//添加
						var province_id = $select_div.find(".province_id").val();
						if(node_role || node_user || node_bill_user) {
							$.ajax({
								type: "post",
								url: "/platform/flow/addCompanyConfig",
								async: true,
								data: {
									node_id: confId,
									province_id: province_id,
									node_role: node_role,
									node_user: node_user,
									node_bill_user: node_bill_user
								},
								beforeSend: function() {
									layerLoading = Layer.load(1);
								},
								success: function(data) {
									Layer.close(layerLoading);
									if(data.code == 1) {
										Layer.msg("添加成功", {
											time: 800
										});
										Layer.close(layerWindow);
									} else {
										Layer.alert(data.msg);
									}
								}

							});

						} else {
							Layer.alert("请至少填写一项权限");
						}
					} else {
						//编辑
						var id = nodeconf_list[node_conf_id].id;
						if(node_role || node_user || node_bill_user) {
							$.ajax({
								type: "post",
								url: "/platform/flow/editCompanyConfig",
								async: true,
								data: {
									id: id,
									node_role: node_role,
									node_user: node_user,
									node_bill_user: node_bill_user
								},
								beforeSend: function() {
									layerLoading = Layer.load(1);
								},
								success: function(data) {
									Layer.close(layerLoading);
									if(data.code == 1) {
										Layer.msg("编辑成功", {
											time: 800
										});
										Layer.close(layerWindow);
									} else {
										Layer.alert(data.msg);
									}
								}

							});
						} else {
							//不存在就删除？
							Layer.alert("请至少填写一项权限");
						}
					}
				});

				//删除配置
				$("body").on("click", ".layui-layer-content .delete-node-conf", function() {
					var node_conf_id = $(this).parent().parent().parent().parent().prev().find(".node-conf-tab li[class='active']").data("tab").split("node-tab-")[1];
					var delete_id = nodeconf_list[node_conf_id];
					if(delete_id) {
						$.ajax({
							type: "post",
							url: "/platform/flow/delCompanyConfig",
							async: true,
							data: {
								id: delete_id
							},
							beforeSend: function() {
								layerLoading = Layer.load(1);
							},
							success: function(data) {
								Layer.close(layerLoading);
								if(data.code == 1) {
									Layer.msg("删除成功", {
										time: 800
									});
									Layer.close(layerWindow);
								} else {
									Layer.alert(data.msg);
								}
							}

						});
					}
				});

				/*          节点设置            */
				//节点表单绑定提交方法
				$("body").on("click", ".layui-layer-content .node-info-submit", function() {
					var node_data = getNodeInfoFormData();
					//数据验证
					if(node_data.node_name) {
						if(node_data.node_flow_type != 4 || (node_data.node_flow_type == 4 && node_data.node_condi_func)) {
							if(node_data.node_role || node_data.node_user || node_data.node_bill_user || node_data.node_html_type == 0) {
								if(node_data.node_nes_field || node_data.node_nones_field || node_data.node_html_type == 1 || node_data.node_html_type == 0) {
									if(operationFlag == "add") {
										node_data.node_position = newPosition;
										//提交数据
										$.ajax({
											type: "post",
											url: "/platform/flow/addNode",
											async: true,
											data: node_data,
											beforeSend: function() {
												layerLoading = layer.load(1);
											},
											success: function(data) {
												//成功就在流程图上添加节点

												if(data.code == 1) {
													var nodeInfo = {
														"id": data.data,
														"process_name": node_data.node_name,
														"process_to": "",
														"style": node_data.node_position,
														"type": node_data.node_flow_type + "-" + node_data.node_html_type,
														"flownode_id": "",
														"process_id": data.data
													}
													if(!Design.addProcess(nodeInfo)) {
														layer.close(layerLoading);
														layer.alert("添加节点失败");
													} else {
														layer.close(layerLoading);
													}
													layer.close(layerWindow);
												} else {
													layer.close(layerLoading);
													layer.alert("添加节点失败");
												}
											}
										});
									} else if(operationFlag == "editor") {
										//编辑方法
										node_data.node_id = ediotrId;
										$.ajax({
											type: "post",
											url: "/platform/flow/editorNode",
											async: true,
											data: node_data,
											beforeSend: function() {
												layerLoading = layer.load(1);
											},
											success: function(data) {

												if(data.code == 1) {
													var changeDiv = $("div[process_id='" + node_data.node_id + "']");
													changeDiv.find("p").text(node_data.node_name);
													changeDiv.removeClass("node-" + changeDiv.attr("process_type") + "-1");
													changeDiv.addClass("node-" + node_data.node_flow_type + "-" + node_data.node_html_type + "-1");
													changeDiv.attr("process_type", node_data.node_flow_type + "-" + node_data.node_html_type);
													layer.close(layerLoading);
													layer.close(layerWindow);
												} else {
													layer.close(layerLoading);
													layer.alert("编辑失败");
												}
											}

										});

									}

								} else {
									layer.alert("元素中必填元素和可选元素中至少一项需要有值");
								}
							} else {
								layer.alert("权限中执行者、执行角色或元素执行者中至少一项需要有值");
							}
						} else {
							layer.alert("条件节点需要填写条件函数");
						}
					} else {
						layer.alert("节点名字为必填");
					}

				});

				//节点表单取消绑定
				$("body").on("click", ".layui-layer-content .node-info-cancel", function() {
					layer.close(layerWindow);
				});

				//获取节点表单数据方法
				function getNodeInfoFormData() {
					var node_data = {};
					node_data.flow_id = editorFlowObj.flow_id;
					node_data.node_name = $(".layui-layer-content .node_name").val();
					node_data.node_flow_type = $(".layui-layer-content .node_flow_type").val();
					node_data.node_html_type = $(".layui-layer-content .node_html_type").val();
					node_data.node_condi_func = $(".layui-layer-content .node_condi_func").val();
					node_data.node_first_func = $(".layui-layer-content .node_first_func").val();
					node_data.node_exec_func = $(".layui-layer-content .node_exec_func").val();
					node_data.node_func = $(".layui-layer-content .node_func").val();
					node_data.node_flag = $(".layui-layer-content .node_flag").val();
					node_data.node_time = $(".layui-layer-content .node_time").val();
					node_data.node_back_type = $(".layui-layer-content .node_back_type").val();
					node_data.node_role = $(".layui-layer-content .node_role").val();
					node_data.node_user = $(".layui-layer-content .node_user").val();
					node_data.node_nes_field = $(".layui-layer-content .node_nes_field").val();
					node_data.node_nones_field = $(".layui-layer-content .node_nones_field").val();
					node_data.node_bill_user = $(".layui-layer-content .node_bill_user").val();
					node_data.node_auto_field = $(".layui-layer-content .node_auto_field").val();
					node_data.node_plan = $(".layui-layer-content .node_plan").val();
					return node_data;
				}

				//写入节点表单数据方法
				function setNodeInfoFormData(node_data) {
					$(".layui-layer-content .node_name").val(node_data.node_name);
					$(".layui-layer-content .node_flow_type").val(node_data.node_flow_type);
					if(node_data.node_flow_type == "1" || node_data.node_flow_type == "2" || node_data.node_flow_type == "3") {
						$(".layui-layer-content .node_html_type").html(
							'<option value="1">查阅页面</option>' +
							'<option value="2">分配页面</option>' +
							'<option value="3">录入页面</option>' +
							'<option value="4">校队页面</option>' +
							'<option value="5">审批页面</option>'
						);
					} else {
						$(".layui-layer-content .node_html_type").html(
							'<option value="0">非普通节点</option>'
						);
					}
					$(".layui-layer-content .node_html_type").val(node_data.node_html_type);
					$(".layui-layer-content .node_condi_func").val(node_data.node_condi_func);
					$(".layui-layer-content .node_first_func").val(node_data.node_first_func);
					$(".layui-layer-content .node_exec_func").val(node_data.node_exec_func);
					$(".layui-layer-content .node_func").val(node_data.node_func);
					$(".layui-layer-content .node_flag").val(node_data.node_flag);
					$(".layui-layer-content .node_time").val(node_data.node_time);
					$(".layui-layer-content .node_back_type").val(node_data.node_back_type);
					$(".layui-layer-content .node_plan").val(node_data.node_plan);
					if(node_data.node_role) {
						$(".layui-layer-content .node_role").val(node_data.node_role.split(","));
					}
					if(node_data.node_user) {
						$(".layui-layer-content .node_user").val(node_data.node_user.split(","));
					}
					if(node_data.node_bill_user) {
						$(".layui-layer-content .node_bill_user").val(node_data.node_bill_user.split(","));
					}
					if(node_data.node_nes_field) {
						$(".layui-layer-content .node_nes_field").val(node_data.node_nes_field.split(","));
					}
					if(node_data.node_nones_field) {
						$(".layui-layer-content .node_nones_field").val(node_data.node_nones_field.split(","));
					}
					if(node_data.node_auto_field) {
						$(".layui-layer-content .node_auto_field").val(node_data.node_auto_field.split(","));
					}
				}

				//绑定编辑方法
				$("#flow_editor").bind("click", function() {
					openWindow("编辑流程", "flow-editor-box", true);
					//初始化数据
					$(".layui-layer-content .flow_name").val(editorFlowObj.flow_name);
					$(".layui-layer-content .flow_type").val(editorFlowObj.flow_type);
					$(".layui-layer-content .flow_table").val(editorFlowObj.flow_table);
				});

				//编辑提交
				$("body").on("click", ".flow-editor-submit", function() {
					//获取值
					var flow_name = $(".layui-layer-content .flow_name").val();
					var flow_type = $(".layui-layer-content .flow_type").val();
					var flow_table = $(".layui-layer-content .flow_table").val();
					//验证
					if(flow_name && flow_type && flow_table) {
						$.ajax({
							type: "post",
							url: "/platform/flow/editorFlow",
							async: true,
							data: {
								flow_id: editorFlowObj.flow_id,
								flow_name: flow_name,
								flow_type: flow_type,
								flow_table: flow_table
							},
							beforeSend: function() {
								layerLoading = layer.load(1);
							},
							success: function(data) {
								if(data.code == 1) {
									layer.close(layerLoading);
									layer.msg("编辑成功", {
										time: 1500
									});
									layer.close(layerWindow);
									//保存数据
									editorFlowObj.flow_name = flow_name;
									editorFlowObj.flow_type = flow_type;
									editorFlowObj.flow_table = flow_table;
									//改变标题
									$("#flow-title").text(flow_name);
								} else {
									layer.close(layerLoading);
									layer.alert("修改失败");
								}
							}
						});

					} else {
						layer.alert("请将表单填写完整");
					}

				});

				//绑定验证方法
				$("#flow_validate").bind("click", function() {
					$.ajax({
						type: "post",
						url: "/platform/flow/validateFlow",
						async: true,
						beforeSend: function() {
							layerLoading = layer.load(1);
						},
						data: {
							"flow_id": editorFlowObj.flow_id
						},
						success: function(data) {
							if(data.code == 1) {
								layer.close(layerLoading);
								layer.msg("流程图验证通过", {
									time: 1500
								});
							} else {
								layer.close(layerLoading);
								layer.alert("流程图验证未通过:" + data.msg);
							}
						}
					});
				});

				//绑定保存方法
				$("#flow_save").bind("click", function() {
					saveFlow();
				});

				//保存方法
				function saveFlow() {
					var processInfo = Design.getProcessInfo(); //连接信息
					processInfo = eval("(" + processInfo + ")");
					var nodelistdata = {}
					nodelistdata.list = [];
					for(var i in processInfo) {
						nodelistdata.list.push({
							"node_id": processInfo[i].id,
							"node_line": processInfo[i].process_to,
							"node_position": processInfo[i].style
						});
					}

					$.ajax({
						type: "post",
						url: "/platform/flow/saveNodeLineInfo",
						async: true,
						data: nodelistdata,
						beforeSend: function() {
							layerLoading = layer.load(1);
						},
						success: function(data) {
							layer.close(layerLoading);
							if(data.code == 1) {
								layer.msg("保存成功", {
									time: 1000
								});
							} else {
								layer.close("保存失败", {
									time: 2000
								});
							}

						}
					});
				}

				//绑定清空连接方法
				$("#flow_clear").bind("click", function() {
					var delConfirm = layer.confirm('你确定清空连接吗？', {
						btn: ['清空', '取消'] //按钮
					}, function() {
						Design.clear();
						layer.close(delConfirm);
					});
				});
			}

		},
		custflow: function() {
			var layerLoading = Layer.load(1);
			//获取用户流程
			//绘制流程图
			var cust_flow = {
				func: {
					contentInit: function() {
						$(".cust-flow-list").html("");
					},
					changeTitle: function(title) {
						$("#flow-title span").text(title);
					},
					addNode: function(name, type, remark) {
						//<div class="node-2-1-1 show-nodeinfo1" flownode_id="0">报单</div>
						$(".cust-flow-list").append(
							'<div class="' + type + ' cust-node" data-remark="' + remark + '">' + name + '</div>'
						);
					},
					addNext: function() {
						$(".cust-flow-list").append('<div class="node-right"></div>');
					},
					remarkInit: function() {
						$(".cust-flow-list").on("mouseover", ".cust-node", function(event) {
							var remark = $(this).data("remark");
							if(remark) {
								//内容
								$(".node-info").html(remark);
								//位置
								$(".node-info").css({
									"top": (event.target.offsetTop + 70) + "px",
									"left": (event.target.offsetLeft + 10) + "px"
								});
								$(".node-info").show();
							}
						});
						$(".cust-flow-list").on("mouseout", ".cust-node", function() {
							$(".node-info").hide();
						});
					}
				},
				init: function(custflowdata) {
					this.func.contentInit();
					//改变标题
					this.func.changeTitle(custflowdata.name);
					//组织数据
					for(var i = 0; i < custflowdata.flow.length; i++) {
						if(custflowdata.flow[i].status != "auto") {
							/*node-1-5-1 pass node-1-5-2 wait .node-1-5-v refuse*/
							/*开始 node-2-1-1*/
							/*结束 node-3-1-1*/
							var nodeobj = {};
							//开始
							if(i == 0) {
								nodeobj.type = "node-2-1-1";
								nodeobj.type_name = "订单开始";
							} else if(i == custflowdata.flow.length - 1 && custflowdata.status == 'end') {
								//结束
								nodeobj.type = "node-3-1-1";
								nodeobj.type_name = "订单完成";
							} else if(i == custflowdata.flow.length - 1 && custflowdata.status == 'close') {
								//终止
								nodeobj.type = "node-1-1-v";
								nodeobj.type_name = "订单终止";
							} else {
								//正常判断
								switch(custflowdata.flow[i].status) {
									case 'pass':
										nodeobj.type = "node-1-5-1";
										nodeobj.type_name = "节点完成";
										break;
									case 'wait':
										nodeobj.type = "node-1-5-2 currnode";
										nodeobj.type_name = "正在执行";
										break;
									case 'refuse':
										nodeobj.type = "node-1-5-v";
										nodeobj.type_name = "节点回退";
										break;
								}
							}

							nodeobj.name = custflowdata.flow[i].node_name;
							nodeobj.remark =
								'<p>操作人【<span>' + custflowdata.flow[i].thread_operator + '</span>】</p>' +
								'<p>日期【<span>' + custflowdata.flow[i].time + '</span>】</p>' +
								'<p>状态【<span>' + nodeobj.type_name + '</span>】</p>';

							this.func.addNode(nodeobj.name, nodeobj.type, nodeobj.remark);
							if(i != custflowdata.flow.length - 1) {
								this.func.addNext();
							}
						}
					}
					//备注
					this.func.remarkInit();
				},
			}

			//标准流程图绘制
			//标准流程图改变状态
			var standard_flow = {
				func: {
					flowInit: function(custflowdata, callback = null) {
						//获取节点数据
						$.ajax({
							type: "post",
							url: "/platform/flow/getNodeListByFlowId",
							async: true,
							data: {
								"flow_id": custflowdata.flow_id
							},
							beforeSend: function() {
								layerLoading = layer.load(1);
							},
							success: function(data) {
								if(data.code == 1) {
									//组织数据
									//改变成流程图的数据类型
									var processData = {};
									processData.list = [];
									//组织数据
									for(var i in data.data) {
										processData.list.push({
											style: data.data[i].node_position,
											type: data.data[i].node_flow_type + "-" + data.data[i].node_html_type,
											id: data.data[i].node_id,
											process_to: data.data[i].node_line,
											process_name: data.data[i].node_name,
											process_routetype: "",
											flownode_id: "",
											process_id: data.data[i].node_id
										});
									}
									//初始化流程图
									Design.init($("#flowdesign_canvas"), {
										//传入的数据
										"processData": processData
									});
									//需要隐藏一些元素
									$(".process-step").find("span").hide();
									$("._jsPlumb_endpoint").remove();
									if(callback) {
										callback(custflowdata);
									}
									layer.close(layerLoading);
								} else {
									layer.close(layerLoading);
									layer.alert(data.msg);
								}
							}
						});

					},
					changeNodeType: function(custflowdata) {
						//先将所有节点改成未执行
						$(".process-step").each(function(i, e) {
							if(i != 0) {
								stepDiv = $(this);
								var processType = $(this).attr("process_type");
								stepDiv.removeClass("node-" + processType + "-1");
								//判断一下是不是节点结束
								if(processType.split("-")[0] == "3") {
									processType = "1-" + processType.split("-")[1];
								}
								stepDiv.addClass("node-" + processType + "-3");
							}
						});
						//再改变有的节点状态
						for(var i in custflowdata.flow) {
							var node_id = custflowdata.flow[i].node_id;
							if(i != 0) {
								var $stepDiv = $("#window" + node_id);
								var processType = $stepDiv.attr('process_type');
								if(i == custflowdata.flow.length - 1 && custflowdata.status == 'close') {
									//终止
									var node_type = "v";
									$stepDiv.removeClass("node-" + processType + "-3");
									$stepDiv.addClass("node-" + processType + node_type);
								} else {
									var node_type = 3;
									switch(custflowdata.flow[i].status) {
										case 'pass':
											node_type = '1';
											break;
										case 'wait':
											node_type = '2';
											break;
										case 'refuse':
											node_type = 'v';
											break;
										case 'auto':
											node_type = '1';
											break;
										case 'close':
											node_type = 'v';
											break;
									}
									$stepDiv.removeClass("node-" + processType + "-1");
									$stepDiv.removeClass("node-" + processType + "-2");
									$stepDiv.removeClass("node-" + processType + "-3");
									$stepDiv.removeClass("node-" + processType + "-v");
									$stepDiv.addClass("node-" + processType + "-" + node_type);
									if(custflowdata.flow[i].status == "wait") {
										$stepDiv.addClass("currnode");
									}
								}
							}

						}
					},
					remarkInit: function(custflowdata) {
						//先获取有备注的节点id
						var node_ids = [];
						for(var i in custflowdata.flow) {
							if(node_ids.indexOf(custflowdata.flow[i].node_id) == -1) {
								node_ids.push(custflowdata.flow[i].node_id);
							}
						}
						//然后根据id生成div
						for(var i in node_ids) {
							node_style = $("#window" + node_ids[i]).attr("style");
							$(".process-shadow").append(
								"<div flownode_id='" + node_ids[i] + "' class='show-nodeinfo' style='position:absolute;height:70px;width:120px;" + node_style + "'></div>"
							);
						}
						//绑定事件
						$(".show-nodeinfo").bind("mouseover", function(event) {
							hover_id = $(this).attr("flownode_id");
							for(var i = custflowdata.flow.length; i > 0; i--) {
								if(custflowdata.flow[i - 1].node_id == hover_id) {
									var type_name = "";
									switch(custflowdata.flow[i - 1].status) {
										case 'pass':
											type_name = "节点完成";
											break;
										case 'wait':
											type_name = "正在执行";
											break;
										case 'refuse':
											type_name = "节点回退";
											break;
										case 'end':
											type_name = "流程完成";
											break;
										case 'close':
											type_name = "流程终止";
											break;
										case 'auto':
											type_name = "自动执行";
											break;
									}

									var remark = '<p>操作人【<span>' + custflowdata.flow[i - 1].thread_operator + '</span>】</p>' +
										'<p>日期【<span>' + custflowdata.flow[i - 1].time + '</span>】</p>' +
										'<p>状态【<span>' + type_name + '</span>】</p>';

									//内容
									$(".node-info").html(remark);

									//位置
									$(".node-info").css({
										"top": (event.target.offsetTop + 70) + "px",
										"left": (event.target.offsetLeft + 10) + "px"
									});
									$(".node-info").show();
									break;
								}
							}
						});

						$(".show-nodeinfo").bind("mouseout", function() {
							$(".node-info").hide();
						});
					}
				},
				init: function(custflowdata) {
					standard_flow_obj = this;

					function initCallBack(custflowdata) {
						standard_flow_obj.func.changeNodeType(custflowdata);
						standard_flow_obj.func.remarkInit(custflowdata);
					}
					//初始化流程图
					this.func.flowInit(custflowdata, initCallBack);
					//备注事件

				}
			}

			//tab切换
			var tab = {
				/**
				 * 初始化
				 * @param {Object} $ul 切换的ul
				 * @param {Object} callback 回调 传入选中的jq的li对象
				 */
				init: function($ul, callback = null) {
					$ul.find("li").bind("click", function() {
						$li = $(this);
						//切换
						if(!$li.attr("class") || $li.attr("class").indexOf("active") == -1) {
							$ul.find("li").removeClass("active");
							$ul.find("li").each(function() {
								$("." + $(this).data("tab")).hide();
							});
							$li.addClass("active");
							$("." + $li.data("tab")).show();
							//调用回调函数
							if(typeof callback == 'function') {
								//执行回调 传回选中的li
								callback($li);
							}
						}
					});
				}
			}

			//流程图初始化标记
			flow_flag = false;
			//初始化切换
			tab.init($(".flow-tab"), function($li) {
				$('html').animate({
					'scrollTop': '0px'
				}, 300);
				if($li.data("tab") == "mini-layout" && !flow_flag) {
					//初始化流程图
					standard_flow.init(custflowdata);
					//标记为false
					flow_flag = true;
				}
				if($li.data("tab") == "mini-layout") {
					$("svg").show();
				} else {
					$("svg").hide();
				}
			});

			//返回初始化
			$("#back-to-index").bind("click", function() {
				//关闭当前弹窗
				var index = parent.Layer.getFrameIndex(window.name);
				parent.Layer.close(index);
			});

			Layer.close(layerLoading);
			//客户流程初始化
			cust_flow.init(custflowdata);
		},
		testflow: function() {

			var layerLoading = Layer.load(1);
			//获取用户流程
			//标准流程图绘制
			//标准流程图改变状态
			var standard_flow = {
				func: {
					flowInit: function(custflowdata, callback = null) {
						//获取节点数据
						$.ajax({
							type: "post",
							url: "/platform/flow/getNodeListByFlowId",
							async: true,
							data: {
								"flow_id": custflowdata.flow_id
							},
							beforeSend: function() {
								layerLoading = layer.load(1);
							},
							success: function(data) {
								if(data.code == 1) {
									//组织数据
									//改变成流程图的数据类型
									var processData = {};
									processData.list = [];
									//组织数据
									for(var i in data.data) {
										processData.list.push({
											style: data.data[i].node_position,
											type: data.data[i].node_flow_type + "-" + data.data[i].node_html_type,
											id: data.data[i].node_id,
											process_to: data.data[i].node_line,
											process_name: data.data[i].node_name,
											process_routetype: "",
											flownode_id: "",
											process_id: data.data[i].node_id
										});
									}
									//初始化流程图
									Design.init($("#flowdesign_canvas"), {
										//传入的数据
										"processData": processData
									});
									//需要隐藏一些元素
									$(".process-step").find("span").hide();
									$("._jsPlumb_endpoint").remove();
									if(callback) {
										callback(custflowdata);
									}
									layer.close(layerLoading);
								} else {
									layer.close(layerLoading);
									layer.alert(data.msg);
								}
							}
						});

					},
					changeNodeType: function(custflowdata) {
						//先将所有节点改成未执行
						$(".process-step").each(function(i, e) {
							if(i != 0) {
								stepDiv = $(this);
								var processType = $(this).attr("process_type");
								stepDiv.removeClass("node-" + processType + "-1");
								//判断一下是不是节点结束
								if(processType.split("-")[0] == "3") {
									processType = "1-" + processType.split("-")[1];
								}
								stepDiv.addClass("node-" + processType + "-3");
							}
						});
						//再改变有的节点状态
						for(var i in custflowdata.flow) {
							var node_id = custflowdata.flow[i].node_id;
							if(i != 0) {
								var $stepDiv = $("#window" + node_id);
								var processType = $stepDiv.attr('process_type');
								if(i == custflowdata.flow.length - 1 && custflowdata.status == 'close') {
									//终止
									var node_type = "v";
									$stepDiv.removeClass("node-" + processType + "-3");
									$stepDiv.addClass("node-" + processType + node_type);
								} else {
									var node_type = 3;
									switch(custflowdata.flow[i].status) {
										case 'pass':
											node_type = '1';
											break;
										case 'wait':
											node_type = '2';
											break;
										case 'refuse':
											node_type = 'v';
											break;
										case 'auto':
											node_type = '1';
											break;
										case 'close':
											node_type = 'v';
											break;
									}
									$stepDiv.removeClass("node-" + processType + "-1");
									$stepDiv.removeClass("node-" + processType + "-2");
									$stepDiv.removeClass("node-" + processType + "-3");
									$stepDiv.removeClass("node-" + processType + "-v");
									$stepDiv.addClass("node-" + processType + "-" + node_type);
									if(custflowdata.flow[i].status == "wait") {
										$stepDiv.addClass("currnode");
									}
								}
							}

						}
					},
					remarkInit: function(custflowdata) {
						//先获取有备注的节点id
						var node_ids = [];
						for(var i in custflowdata.flow) {
							if(node_ids.indexOf(custflowdata.flow[i].node_id) == -1) {
								node_ids.push(custflowdata.flow[i].node_id);
							}
						}
						//然后根据id生成div
						for(var i in node_ids) {
							node_style = $("#window" + node_ids[i]).attr("style");
							$(".process-shadow").append(
								"<div flownode_id='" + node_ids[i] + "' class='show-nodeinfo' style='position:absolute;height:70px;width:120px;" + node_style + "'></div>"
							);
						}
						//绑定事件
						$(".show-nodeinfo").bind("mouseover", function(event) {
							hover_id = $(this).attr("flownode_id");
							for(var i = custflowdata.flow.length; i > 0; i--) {
								if(custflowdata.flow[i - 1].node_id == hover_id) {
									var type_name = "";
									switch(custflowdata.flow[i - 1].status) {
										case 'pass':
											type_name = "节点完成";
											break;
										case 'wait':
											type_name = "正在执行";
											break;
										case 'refuse':
											type_name = "节点回退";
											break;
										case 'end':
											type_name = "流程完成";
											break;
										case 'close':
											type_name = "流程终止";
											break;
										case 'auto':
											type_name = "自动执行";
											break;
									}

									var remark = '<p>操作人【<span>' + custflowdata.flow[i - 1].thread_operator + '</span>】</p>' +
										'<p>日期【<span>' + custflowdata.flow[i - 1].time + '</span>】</p>' +
										'<p>状态【<span>' + type_name + '</span>】</p>';

									//内容
									$(".node-info").html(remark);

									//位置
									$(".node-info").css({
										"top": (event.target.offsetTop + 70) + "px",
										"left": (event.target.offsetLeft + 10) + "px"
									});
									$(".node-info").show();
									break;
								}
							}
						});

						$(".show-nodeinfo").bind("mouseout", function() {
							$(".node-info").hide();
						});
					}
				},
				init: function(custflowdata) {
					$("#flowdesign_canvas").html("");
					standard_flow_obj = this;

					function initCallBack(custflowdata) {
						standard_flow_obj.func.changeNodeType(custflowdata);
						standard_flow_obj.func.remarkInit(custflowdata);
					}
					//初始化流程图
					this.func.flowInit(custflowdata, initCallBack);
					//备注事件

				}
			}

			//返回初始化
			$("#back-to-index").bind("click", function() {
				//关闭当前弹窗
				var index = parent.Layer.getFrameIndex(window.name);
				parent.Layer.close(index);
			});

			Layer.close(layerLoading);
			//初始化流程图
			$("svg").show();
			$("#flowdesign_canvas").show();
			standard_flow.init(custflowdata);
			setTimeout(function(){
				window.location.reload();
			},10000);
		}	
	}

	return Controller;
});