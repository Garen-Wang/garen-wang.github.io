'use strict';
window.onload = function() {
	//测试数据
	Global_VAR.sTest = SysUtils.getUrlParams("sTest");
	if(Global_VAR.sTest != undefined) {
		Global_VAR.initData = "http://127.0.0.1/door/out/h5/get"; // 初始化数据
	}
	
	Global_FN.render();
}
//全局变量
var Global_VAR = {
	iWxSdkFlog: 0,
	formName: "filter_form",
	initData: SysUtils.getHttpRoot() + "/out/h5/get", // 查询接口
	add: SysUtils.getHttpRoot() + "/out/h5/add", // 申请接口
	cancel: SysUtils.getHttpRoot() + "/out/h5/cancel", // 申请接口
	getSite: SysUtils.getHttpRoot() + "/base/public/web/getSite", // 申请接口
	beforeImg: null,
	infoData: [ // 个人信息数据
		{ label: "姓名", value: "嘉然Diana" }, 
		{ label: "学号", value: "672328094" }, 
		{ label: "学院", value: "枝江学园" }, 
		{ label: "年级", value: "2020" }, 
		{ label: "人员类型", value: "是偶像！" }
	],
	// 步骤栏
	stepBox: [     
		{ "name": "提交", "url": "img/true.png" },
		{ "name": "院级审批", "url": "img/true.png" },
		{ "name": "校级审批", "url": "img/true.png" }
	],
	hoursList: [],           // 小时组
	minutesList: [],         // 分钟组
	sSiteName: "",           // 接站地点
	sSiteCode: "",           // 接站编号
	isReadonly: false,       // 是否只读 
	dSiteDate: "",           // 接站日期 
	sSiteTime: "",           // 预计时间
	yjsjYMD: "",             // 预计时间 年月日
	yjsjHM: ""               ,// 预计时间 时分
	sApplyCode: "",         // 申请码
	bIsClick: true,        // 是否已点击
}
var Global_FN = {
	render () {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			
			Global_FN.getInitData();
			
			Global_FN.pickerInit();
			Global_FN.infoData();
			
			Global_FN.getStepBox();
			Global_FN.initDatePicker();
			Global_FN.isShowLoading(false);
			
		});
	},
	// 获取人员信息
	getInitData () {
		layui.use(['form','jquery'], function() {
			let form = layui.form;
			let $ = layui.jquery;
			
			$.ajax({
				url: Global_VAR.initData,
				type: "post",
				data: "",
				error: function(data) {
					console.log("请求失败");
					$("#weuiDialog").show();
				},
				success (res) {
					Global_VAR.infoData[0].value = d.sPersonName || "";
					Global_VAR.infoData[1].value = d.sPersonCode || "";
					Global_VAR.infoData[2].value = d.sCollegeName || "";
					Global_VAR.infoData[3].value = d.iInSchool || "";
					Global_VAR.infoData[4].value = d.sDegreeName || "";
		
					Global_FN.infoData();

					d.dOutStartDate != null ? $(".dOutStartDate").text(d.dOutStartDate) : "";
					d.dOutEndDate != null ? $(".dOutEndDate").text(d.dOutEndDate) : "";
					Global_VAR.sApplyCode = d.sApplyCode;
					
					form.val(Global_VAR.formName, {
						sOutAddress: d.sOutAddress,
						sOutReason: d.sOutReason
					});
		
					if (d.iCancelState) {
						if (d.iCancelState == 1) {
							$(".btn_add").hide();
							$(".btn_cancel").show();
							Global_VAR.stepBox[0].url = "img/true.png";
							$(".logo_box img").attr("src" ,"./img/wait.png");
							$(".logo_box").show();
							$(".disabled_mask").show();
															
						} else if (d.iCancelState == 2) {
							$(".btn_add").hide();
							$(".btn_cancel").show();
							Global_VAR.stepBox[0].url = "img/true.png";
							$(".logo_box img").attr("src" ,"./img/wait.png");
							$(".logo_box").hide();
							$(".disabled_mask").hide();
						} else if (d.iCancelState == 3) {
							$(".btn_add").show();
							$(".btn_cancel").hide();
							Global_VAR.stepBox[0].url = "img/error.png";
						} else {
							$(".logo_box").hide();
							$(".disabled_mask").hide();
						}
					
					if (d.iOutApplyByC) {
						if (d.iOutApplyByC == 2) {
							$(".btn_add").hide();
							$(".btn_cancel").hide();
							Global_VAR.stepBox[1].url = "img/true.png";
						} else if (d.iOutApplyByC == 3) {
							$(".btn_add").hide();
							$(".btn_cancel").show();
							Global_VAR.stepBox[1].url = "img/error.png";
							$(".logo_box img").attr("src" ,"./img/noPass.png");
							$(".logo_box").show();
							$(".disabled_mask").show();
						} else {
							// $(".btn_add").hide();
							// $(".btn_cancel").show();
							Global_VAR.stepBox[1].url = "img/true.png";
						}
					}
								
					if (d.iOutApplyByS) {
						if (d.iOutApplyByS == 2) {
							$(".btn_add").hide();
							$(".btn_cancel").hide();
							Global_VAR.stepBox[2].url = "img/true.png";
							$(".logo_box img").attr("src" ,"./img/pass.png");
							$(".logo_box").show();
							$(".disabled_mask").show();
						} else if (d.iOutApplyByS == 3) {
							$(".btn_add").hide();
							$(".btn_cancel").show();
							Global_VAR.stepBox[2].url = "img/error.png";
							$(".logo_box img").attr("src" ,"./img/noPass.png");
							$(".logo_box").show();
							$(".disabled_mask").show();
						} else {
							// $(".btn_add").hide();
							// $(".btn_cancel").show();
							Global_VAR.stepBox[2].url = "img/true.png";
						}
					}
						
						// 已撤销
						if (d.iCancelState == 2) {
							$(".btn_add").show();
							$(".btn_cancel").hide();
							Global_VAR.stepBox[0].url = "img/true.png";
							Global_VAR.stepBox[1].url = "img/true.png";
							Global_VAR.stepBox[2].url = "img/true.png";
							$(".logo_box").hide();
							$(".disabled_mask").hide();
						}
					
						// $(".logo_box").show();
						Global_FN.getStepBox();
					} else {
						$(".btn_add").show();
						$(".btn_cancel").hide();
						$(".logo_box").hide();
						$(".disabled_mask").hide();
					}
		
					setTimeout(() => {
						Global_FN.isShowLoading(false);
					}, 500); // 隐藏加载
					
				}
			})
			
		});	
	},
	// 个人数据
	infoData() {
		layui.use(['form','jquery'], function() {
			let form = layui.form;
			let $ = layui.jquery;

			// $(".info_box").empty();
			// let sList = "";
			// $.each(Global_VAR.infoData, (index, item) => {
			// 	// console.log(item);
			// 	sList += '<div class="info_list"><span>'+ item.label +'</span><span>'+ item.value +'</span></div>';
			// })
			// $(".info_box").html(sList);
	
			form.render();
		});
	},
	// 初始化 日期 控件
	initDatePicker () {
		Global_FN.datePickerBindChange("dOutStartDate"); // 开始日期
		Global_FN.datePickerBindChange("dOutEndDate"); // 结束日期
	},
	// 日期组件事件绑定
	datePickerBindChange (value) {
		layui.use([], function() {
			let $ = layui.jquery;
			$('#'+value).on('click', function () {
				
				weui.datePicker({
					start: 1990,
					end: new Date().getFullYear(), // Global_VAR.nowYMD, // 
					onConfirm: function (result) {
						console.log(result);
						var mm = "",
						dd = "";
						result[1].value.toString().length === 1 ? mm = "0" + result[1].value : mm = result[1].value;
						result[2].value.toString().length === 1 ? dd = "0" + result[2].value : dd = result[2].value;
						$('.'+value).text(result[0].value + "-" + mm + "-" + dd );
					},
					title: '日期'
				});
			});
		});
	},
	// 获取进度栏
	getStepBox () {
		layui.use(["jquery"], function() {
			let $ = layui.jquery;
			
			// console.log(Global_VAR.stepBox);
			$(".step_box").empty();
			let sList = "";
			$.each(Global_VAR.stepBox, (index, item) => {
				// console.log(item);
				let sLine = "";
				index != Global_VAR.stepBox.length - 1 ? sLine = "line" : "";
				sList += '<div class="step '+ sLine +'">' +
						      '<img src="'+ item.url +'">' +
						      '<span>'+ item.name +'</span>' +
								 '</div>'
			})
			$(".step_box").html(sList);
		});	
	},
	// picker 初始化
	pickerInit () {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			
			$('#dSiteDate').on('click', function () {
				weui.datePicker({
					start: new Date().getFullYear() - 5,
					end: new Date().getFullYear() + 5,
					title: "年月日",
					onClose: function (result) {
						Global_FN.pickerHM();
					},
					onConfirm: function (result) {
						console.log(result);
						var m,d;
						m = result[1].value + "";
						m.length == 1 ? m = "0" + m : m 
						d = result[2].value + "";
						d.length == 1 ? d = "0" + d : d 
						Global_VAR.dSiteDate +=  result[0].value + "-" + m + "-" + d;
						console.log(Global_VAR.dSiteDate);
					}
				});
			});
			
		});	
		
	},
	// picker 时分 
	pickerHM () {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			
			// 获取小时
			if (Global_VAR.hoursList.length == 0) {
				for (let i = 0; i < 24; i++) {
					let obj = {};
					i < 10 ? obj.label = "0" + i : obj.label = "" + i
					obj.value = i;
					Global_VAR.hoursList.push(obj);
				}
				console.log(Global_VAR.hoursList);
			}

			weui.picker(Global_VAR.hoursList, {
				defaultValue: [0],
				title: "时",
				onConfirm: function (result) {
					console.log(result);
					Global_VAR.sSiteTime = result[0].label + ":00:00"
					$("#dSiteDate").text(Global_VAR.dSiteDate + " " + Global_VAR.sSiteTime);
				},
				id: 'singleLinePicker'
			});
		});	
	},
	// 提交保存 
	sub () {
		layui.use(['jquery', 'form'], function() {
			let $ = layui.jquery;

			if (Global_VAR.bIsClick == true) {
				Global_VAR.bIsClick = false;
				
				let sDialog = weui.dialog({
					title: '外出申请',
					content: '是否确定提交？',
					className: 'custom-classname',
					buttons: [{
						label: '取消',
						type: 'default',
						onClick: function () {
							Global_VAR.bIsClick = true;
						}
					}, {
						label: '确定',
						type: 'primary',
						onClick: function () { 
					
							sDialog.hide(function(){});
							
							let form = layui.form;
							let d = form.val(Global_VAR.formName);
									
							console.log(d);
									
							let req = {
								sOutAddress: d.sOutAddress || "",
								sOutReason: d.sOutReason || "",
								dOutStartDate: $(".dOutStartDate").text() || "",
								dOutEndDate: $(".dOutEndDate").text() || ""
							};
							
							console.log(req);
							
							$.each(req, (index, item) => {
								console.log(item);
								console.log(item.value);
								if (!item || item == "-" || item == "") {
									Global_FN.isShowTopTips("亲，还有内容未填写~", false);
									Global_VAR.bIsClick = true;
									return
								}
							})
							
							let startDate = new Date(req.dOutStartDate);
							let endDate = new Date(req.dOutEndDate);
							
							if (startDate > endDate) {
								Global_FN.isShowTopTips("亲，开始时间不能大于结束时间~", false);
								Global_VAR.bIsClick = true;
								return
							}
							
							console.log(req);
							
							$.ajax({
								url: Global_VAR.add,
								type: "post",
								data: req,
								success: function(res) {
									if(res.code == 1) {
										console.log(res);
										Global_FN.isShowTopTips("提交成功", true);
										Global_FN.getInitData();
									} else {
										Global_FN.isShowTopTips(res.msg, false);
										Global_VAR.bIsClick = true;
									}
								},
								error: function (res) {
									Global_FN.isShowTopTips("亲，网络异常~", false);
									Global_VAR.bIsClick = true;
								}
							})
						},
					}]
				});
			}		

		
		});
	},
	// 撤销
	cancel () {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			
			if (Global_VAR.bIsClick == true) {
				Global_VAR.bIsClick = false;
				
				let sDialog = weui.dialog({
					title: '撤销申请',
					content: '是否确定撤销？',
					className: 'custom-classname',
					buttons: [{
						label: '取消',
						type: 'default',
						onClick: function () {
							Global_VAR.bIsClick = true;
						}
					}, {
						label: '确定',
						type: 'primary',
						onClick: function () { 
					
							sDialog.hide(function(){});
							
							$.ajax({
								url: Global_VAR.cancel,
								type: "post",
								data: {
									sApplyCode: Global_VAR.sApplyCode || "",
								},
								success: function(res) {
									if(res.code == 1) {
										Global_FN.isShowTopTips("撤销成功", true);
										Global_FN.getInitData();
									} else {
										Global_FN.isShowTopTips(res.msg, false);
										Global_VAR.bIsClick = true;
									}
								},
								error: function(data) {
									Global_FN.isShowTopTips("亲，网络异常~", false);
									Global_VAR.bIsClick = true;
								}
							})
						},
					}]
				});
			}		
		})
	},
	// 显示or隐藏 加载效果
	isShowLoading(status) {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			if(status) {
				// $(".loading_mask").show();
				// $(".loading_tip").show();
				$(".loading_mask").hide();
				$(".loading_tip").hide();
			} else {
				$(".loading_mask").hide();
				$(".loading_tip").hide();
			}
		});
	},
	// 显示or隐藏 提示语
	isShowTopTips(text, status) {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			if(status) {
				$("#toastText").text(text);
				$("#weuiToast").show();
				setTimeout(() => {
					$("#weuiToast").hide()
				}, 2000);
			} else {
				$("#topTips").text(text);
				$("#topTips").show();
				setTimeout(() => {
					$("#topTips").hide()
				}, 2000);
			}
		});
	},
	// 显示确认窗
	isShowDialog (text) {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			$("#confirmText").text(text);
			$("#confirmDialog").show();
		});	
	},
	// 关闭确认窗
	closeDialog() {
		layui.use(['jquery'], function() {
			let $ = layui.jquery;
			$("#confirmDialog").hide();
			wx.closeWindow();
		});
	},
}