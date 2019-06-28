ES.ui = {}
ES.ui.count = 0
ES.ui.comps = {}
ES.tableGridData = {};
ES.tableGridEven = {};
ES.ui.remove = function(id) {
	ES.ui.comps[id] = undefined
	ES.ui.comps[id] = null
	delete ES.ui.comps[id]
}
ES.ui.get = function(id) {
	return ES.ui.comps[id]
}
ES.ui.add = function(id, value) {
	ES.ui.comps[id] = value
}
ES.ui.get_id = function(id) {
	if (!id) {
		id = 'esui-' + ES.ui.count
		ES.ui.count++
	}
	return id
}
ES.ui.affix = function(fix_pos, fix_comp, max_top) {
	var intveral = null
	var time_span = 100
	var scroll = function() {
		var top_max = fix_pos.offset().top
		var top = max_top()
		var pos = 'fixed'
		if (top >= top_max) {
			pos = 'static'
		}
		var c = fix_comp
		var c_pos = c.css('position')
		if (c_pos != pos) {
			c.hide().css({
				'position': pos
			}).fadeIn(200)
		}
		clearTimeout(intveral)
		intveral = null
	}
	ES.get(window).scroll(function() {
		if (intveral != null) {
			clearTimeout(intveral)
			intveral = null
		}
		intveral = setTimeout(scroll, time_span)
	})
}
ES.ui.unmask = function() {
	$('.shadow').remove()
}
ES.ui.mask = function(config) {
	config = config || {}
	if (!config.multi && $('.shadow').length > 0) {
		return
	}
	var mask = '<div class="shadow"><i class="fa fa-refresh fa-spin"></i></div>'
	if (!config.ele) {
		mask = $(mask)
		mask.css({
			'line-height': $('body').height() + 'px'
		})
		$('body').append(mask)
	} else if (config.only) {
		var ele = $(config.ele)
		var top = ele.offset().top
		var height = ele.height()
		var mask1 = $(mask)
		var mask2 = $(mask)
		mask1.css({
			'position': 'absolute',
			'top': '0px',
			'height': top + 'px'
		});
		mask2.css({
			'position': 'absolute',
			'top': (top + height) + 'px',
			'height': ($('body').height() - top - height) + 'px'
		});
		ele.append(mask1).append(mask2)
	} else {
		var ele = $(config.ele)
		mask = $(mask)
		var left = ele.offset().left
		var top = ele.offset().top
		var width = ele.width()
		var height = ele.height()
		mask.css({
			'position': 'absolute',
			'top': top + 'px',
			'left': left + 'px',
			'width': width + 'px',
			'height': height + 'px',
			'line-height': height + 'px'
		})
		ele.append(mask)
	}
}

ES.ui.popup = function(config) {
	config = config || {}
	config = ES.util.merge({
		title: ES.msg.get('default_title'),
		auto_hide_default: true,
		close: true,
		center: true
	}, config)
	var render = function() {
		$('.popup').remove()
		var minHeight = ES.client_height - 70
		var minWidth = config.width || 300
		var top = (ES.client_height - minHeight) / 2 - 10
		var left = (ES.client_width - minWidth) / 2
		var div = $('<div class="popup"><div class="popup-title"></div><div class="clear"></div></div>')
		var time_out
		if (!config.title) {
			config.title = "&nbsp;"
		}
		div.children('.popup-title').html(config.title)
		if (config.close) {
			if (!config.closeStyle) {
				config.closeStyle = ''
			}
			div.children('.popup-title').append('<a href="javascript:void(0);" class="popup-close"><i class="fa fa-remove"></i></a>')
		}
		if (!config.auto_hide && config.auto_hide_default && !config.hide_buttons) {
			config.innerHTML += '<div class="popup-btn">' +
				'<div style="margin:auto;float: none;"><a href="javascript:void(0);" class="btn btn-major btn-close">' + ES.msg.get('close') + '</a></div></div>'
		}
		if (config.innerHTML) {
			div.append($('<div class="popup-content">' + config.innerHTML + '</div>'))
		}
		div.css({
			'top': top + "px",
			'left': left + "px",
			'min-width': minWidth + 'px'
		})
		if (config.css) {
			div.css(config.css)
		}
		ES.ui.mask()
		var close_func = function(e) {
			if(time_out){
				clearTimeout(time_out)
			}
			if (config.before_callback) {
				var result = config.before_callback()
				if (!result) {
					return
				}
			}

			if (config.after_callback) {
				config.after_callback()
			}
			$(document).trigger('click')
			$('.popup').remove()
			ES.ui.unmask()
			if(config.after_close){
				config.after_close()
			}
			e.preventDefault()
			return false
		}
		$('body').append(div)
		if (config.before_show) {
			config.before_show()
		}
		if (config.close) {
			$('.popup-close').click(close_func)
		}
		if (!config.auto_hide) {
			$('.popup .popup-btn .btn-close').click(close_func)
		}
		if (config.callback) {
			$('.popup').show(function() {
				config.callback()
			});
		} else {
			$('.popup').show()
		}
		var width = $('.popup').width()
		if (config.center) {
			var popup = $('.popup')
			var height = popup.height()
			var top = ((ES.client_height - height) / 2)
			popup.css({
				top: (top > 0) ? top : 0 + 'px',
				left: ((ES.client_width - width) / 2) + 'px'
			})
		}
		if (config.auto_hide) {
			time_out = setTimeout(function() {
				$('.popup').remove()
				if(config.after_callback) config.after_callback()
				ES.ui.unmask()
			}, 2000);
		}
		var pop = $('.popup')
		pop.data('value', width)
		$('.popup-title').bind("mousedown",function(event){
			var offset_x = $('.popup')[0].offsetLeft
			var offset_y = $('.popup')[0].offsetTop
			var offset_width = $('.popup')[0].offsetWidth
			var offset_height = $('.popup')[0].offsetHeight
			var mouse_x = event.pageX
			var mouse_y = event.pageY

			$(document).bind("mousemove",function(ev){
				var _x = ev.pageX - mouse_x
				var _y = ev.pageY - mouse_y
				var now_x = (offset_x + _x )
				var now_y = (offset_y + _y )
				if(now_x <= 0){
					now_x = 0
				} else if(now_x >= ES.client_width - offset_width){
					now_x = ES.client_width - offset_width
				}
				if(now_y <= 0){
					now_y = 0
				} else if(now_y >= ES.client_height - offset_height){
					now_y = ES.client_height - offset_height
				}
				pop.css({
					top:now_y + "px",
					left:now_x + "px"
				})
			})
		})
		$(document).bind("mouseup",function(){
			$(document).unbind("mousemove");
		})
		$('.popup-title').dblclick(function(){
			var pop  = $('.popup')
			var w = pop.outerWidth()
			if(w <= ES.client_width) {
				pop.css({
					top:0,
					left:0,
					width:ES.client_width,
					height:ES.client_height
				})
			} else {
				w = pop.data('value')
				pop.css({
					width: w,
					height: 'auto'
				})
				ES.ui.popup.auto_position()
			}
		})
	}
	render();
}
ES.ui.popup.auto_position = function() {
	var div = $('.popup')
	if (div.length <= 0) {
		return
	}
	ES.client_height = document.documentElement.clientHeight
	ES.client_width = document.documentElement.clientWidth

	var height = div.outerHeight()
	var width = div.outerWidth()

	var top = (ES.client_height - height) / 2 - 10
	var left = (ES.client_width - width) / 2

	if(top <0) {
		top = 0
	}

	div.css({
		'top': top + "px",
		'left': left + "px"
	})
	div.data('value', width)
	var popup_common = div.find('.popup-content')
	if(popup_common && popup_common.length > 0){
		if(ES.client_height<height){
			popup_common.css('max-height',(height-70)+'px')
			popup_common.css('height',(ES.client_height-70)+'px')
		}
	}
}
ES.ui.confirm = function(config, success, fail) {
	config = config || {}
	config = ES.util.merge({
		innerHTML: ''
	}, config)

	config.positiveBtnDisplay = config.positiveBtnDisplay || 'inline-block'

	var positiveBtnMsg = config.positiveBtnMsg || ES.msg.get('confirm')
	var cancelBtnMsg = config.cancelBtnMsg || ES.msg.get('cancel')
	config.innerHTML = '<div class="popup-common">' + config.innerHTML + '</div><div class="clear"></div><div class="main-popup-error" style="display: none"><div class="popup-error"></div><div class="popup-warn"></div></div><div class="clear"></div><div class="popup-btn">' +
		'<span style="margin-right: 8px;"><a href="javascript:void(0);" class="btn btn-reverse">' + cancelBtnMsg + '</a></span>' +
		'<span><a href="javascript:void(0);" class="btn btn-major" style="display: '+config.positiveBtnDisplay +';">' + positiveBtnMsg + '</a></span><div class="clear"></div></div>'
	config.auto_hide = false
	config.auto_hide_default = false
	var ret = ES.ui.popup(config)
	if (success) {
		$('.popup .popup-btn .btn-major').click(function(e) {
			if (!success()) {
				return
			}
			$('.popup').remove()
			if(!config.hasCallbackMask){
				ES.ui.unmask()
			}
			e.preventDefault()
			// return false
		})
	}
	$('.popup .popup-btn .btn-reverse').click(function(e) {
		if (fail && !fail()) {
			return
		}

		$('.popup').remove()
		ES.ui.unmask()
		e.preventDefault()
		// return false
	})
	return ret
}
ES.ui.alert = function(config,isHyperlink) {
	config = config || {}
	config = ES.util.merge({
		title: ES.msg.get('default_title'),
		auto_hide: true
	}, config)
	var key = config.key
	var arg = config.arg
	var msg = ES.msg.get(key, arg)
	var cls = ''
	var auto_hide = config.auto_hide
	if (config.type == 'error') {
		cls = 'class="error"'
		auto_hide = false
	}
	if(isHyperlink){
		var message  = '<p ' + cls + '><a href="'+ES.deploy+config.hyperlink+'">' + msg + '</a></p>'
	} else {
		var message  = '<p ' + cls + '>' + msg + '</p>'
	}

	ES.ui.popup({
		after_close: config.after_close,
		after_callback: config.after_callback,
		callback: config.callback,
		title: config.title,
		auto_hide: auto_hide,
		innerHTML:message
	})
}
ES.ui.input = function(config) {
	var es_input = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		var id = '#' + conf.el
		var el = $(id)
		// 中文显示
		var configCn = {
			dateFormat: 'yy-mm-dd',
			yearSuffix: '年',
			monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
			monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
			dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
			dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
			dayNamesMin: ['日','一','二','三','四','五','六']
		}
		if(ES.lang === 'zh-cn') {
			conf = ES.util.merge(conf, configCn)
			conf.changeMonth = true
			conf.changeYear = true
		}
		var datepickerValue,datepicker;
		if (el.hasClass('date')) {
			datepicker = ES.get("#ui-datepicker-div").data();
			conf.dateFormat = "yy-mm-dd"
			conf.onSelect = function(text){
				if(config.callbackFunction){
					config.callbackFunction(text)
				}
			}
			el.datepicker(conf)
			if(!datepicker){
				ES.get("#ui-datepicker-div").attr("data-value",conf.el);
			}else{
				datepickerValue = ES.get("#ui-datepicker-div").attr("data-value")
				datepickerValue += ","+ conf.el;
				ES.get("#ui-datepicker-div").attr("data-value",datepickerValue);
			}
		}
		if (el.hasClass('datemonth')) {
			datepicker = ES.get("#ui-datepicker-div").data()
			conf = ES.util.merge(conf, {
				onSelect: function(text){
					if(config.callbackFunction){
						config.callbackFunction(text)
					}
				},
				monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				changeMonth: true,
				changeYear: true,
				showButtonPanel: true,
				dateFormat: 'yy-MM',
				onClose: function (dateText, inst) {
					var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
					var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
					$(this).datepicker('setDate', new Date(year, month, 1));
				}
			})
			el.datepicker(conf)

			if(!datepicker){
				ES.get("#ui-datepicker-div").attr("data-value",conf.el);
			}else{
				datepickerValue = ES.get("#ui-datepicker-div").attr("data-value")
				datepickerValue += ","+ conf.el;
				ES.get("#ui-datepicker-div").attr("data-value",datepickerValue);
			}
		}
		if (el.hasClass('datetime')) {
			datepicker = ES.get("#ui-datepicker-div").data()
			var timeFormat = conf.second ? 'HH:mm:ss' : 'HH:mm:00'
            if(config.onlyHour){
                timeFormat =  'HH:00:00'
            }
			conf = ES.util.merge(conf,{
				dateFormat: "yy-mm-dd",
				onClose: function(text){
					if(config.callbackFunction){
						config.callbackFunction(text)
					}
				},
				timeText: ES.msg.get('timepicker_timeText'),
				// hourText: ES.msg.get('timepicker_hourText'),
				// minuteText: ES.msg.get('timepicker_minuteText'),
				//secondText: ES.msg.get('timepicker_secondText'),
				closeText: ES.msg.get('timepicker_closeText'),
				currentText: ES.msg.get('timepicker_currentText'),
				// timeInput: true,
				timeFormat: timeFormat,
				// showHour: false,
				// showMinute: false,
				controlType: 'select',
				oneLine: true
			})
			el.datetimepicker(conf)

			if(!datepicker){
				ES.get("#ui-datepicker-div").attr("data-value",conf.el);
			}else{
				datepickerValue = ES.get("#ui-datepicker-div").attr("data-value")
				datepickerValue += ","+ conf.el;
				ES.get("#ui-datepicker-div").attr("data-value",datepickerValue);
			}
		}
		if (el.hasClass('baidu-address')) {
			var script = document.createElement("script")
			var o = {}
			o.ak = 'GOEGRcwYZBAXOlU7a0bwf9DV'
			o.IPUrl = 'http://api.map.baidu.com/location/ip'
			script.type = "text/javascript"
			script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + o.ak + "&callback=trackingCallback"
			document.body.appendChild(script)
			window.trackingCallback = function() {

				var getIp = function(callback){
					$.ajax({
						url: o.IPUrl,
						type: 'GET',
						dataType: 'jsonp',
						data: {
							output: "json",
							ak: o.ak
						},
						success: callback,
						error: function(xhr) {
							alert("请求出错(请检查相关度网络状况.)")
						}
					})
				}


				getIp(function(data){
					var value = el.val()
					var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
						input: el.attr('id'),
						location: data.content.address || ''
					})
					ac.setInputValue(value)
					ac.addEventListener("onhighlight", function (e) {
						var str = ""
						var _value = e.fromitem.value
						var value = ""
						if (e.fromitem.index > -1) {
							value = _value.province + _value.city + _value.district + _value.street + _value.business
						}
						str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value
						value = ""
						if (e.toitem.index > -1) {
							_value = e.toitem.value
							value = _value.province + _value.city + _value.district + _value.street + _value.business
						}
						str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value
					})
					var myValue
					//鼠标点击下拉列表后的事件
					ac.addEventListener("onconfirm", function (e) {
						console.log(e.item.value)
						var _value = e.item.value
						myValue = _value.province + _value.city + _value.district + _value.street + _value.business
						//G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue
						setPlace()
					})

					function setPlace() {
						var local = new BMap.LocalSearch(new BMap.Map(), { //智能搜索
							onSearchComplete: function () {
								if(local.getResults().getPoi(0)){
									var pp = local.getResults().getPoi(0).point    //获取第一个智能搜索的结果
									el.data('value', pp)
								}
								el.addClass('couldDoAjax')
								el.trigger('change')
							}
						})
						local.search(myValue)
					}
				})
			}
		}

		if (el.hasClass('google-address')) {
			if(ES.get("#googleApi").length > 0){
				window.initAutocomplete();
				return;
			}
			var searchboxCss =document.createElement("link");
			searchboxCss.type = "text/css";
			searchboxCss.setAttribute("rel","stylesheet");
			searchboxCss.setAttribute("href","https://fonts.googleapis.com/css?family=Roboto:300,400,500");
			document.head.appendChild(searchboxCss);
			var googleScript =document.createElement("script");
			googleScript.type = "text/javascript";
			googleScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBg9k0ePx3cUAskKJcGmJ9JSkcX2LYz2RU&libraries=places&callback=initAutocomplete";
			googleScript.setAttribute("id","googleApi");
			document.body.appendChild(googleScript);
			window.initAutocomplete = function() {
				var id = el.attr("id");
				var autocomplete;
				var geocodeAddress = function (area,callback) {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({'address': area}, function(results, status) {
						if (status === google.maps.GeocoderStatus.OK) {
							var position = results[0].geometry.location;
							callback(position);
						} else {
							var data = {}
							data.error = "Didn't get to the latitude and longitude"
							callback(data);
						}
					});
				}
				function fillInAddress() {
					var area = document.getElementById(id).value;
					geocodeAddress(area,function (res) {
						if(res.error){
							return;
						}
						var data = {}
						data.lat = res.lat();
						data.lng = res.lng();
						el.data('value', data)
					})
				}
				autocomplete = new google.maps.places.Autocomplete((document.getElementById(id)),{types: ['geocode']});
				autocomplete.addListener('place_changed', fillInAddress);
			}
		}
		if (el.attr('type') != 'hidden') {
			var nonempty = conf.nonempty ? conf.nonempty : false
			var value = conf.value ? conf.value : ''
			var readonly = conf.readonly
			var label = conf.label
			var after_labels = conf.after_labels
			var after_button = conf.after_button
			var max_l = conf.max_l ? conf.max_l : 255
			var min_l = conf.min_l ? conf.min_l : 4
			if(el.hasClass('number')) {
				max_l = 15
				min_l = 1
			}
			var icon = conf.icon ? ES.util.format_string(ES.tpl.icon_tpl, {
				cls: conf.icon + ' input-icon'
			}) : ''
			var cls = conf.cls ? conf.cls : ''
			if (!config.placeholder) {
				config.placeholder = ''
			}
			if (!config.msg) {
				config.msg = ES.msg.get('non_empty')
			}
			if(!conf.isNotWrap){
				el.wrap("<div class='wrap input-wrap " + cls + "'></div>").attr('maxlength', max_l).attr('minlength', min_l).attr('placeholder', config.placeholder)
			}
			if(el.attr("type") == "radio" && conf.labelName){
				el.wrap("<div class='input-radio'></div>")
				el.before("<span>"+conf.labelName+"</span>");
			}
			var parent = el.parent()
			if (value) {
				el.val(value)
			}
			if (readonly) {
				el.attr('readonly', 'true')
			}
			if (icon) {
				parent.prepend(icon)
			} else {
				el.css({
					'padding-left': '10px'
				})
			}
			if (label) {
				if (nonempty) {
					label = '<span class="nonempty">*</span>' + label
				}
				if (el.attr('type') != 'checkbox' && el.attr('type') != 'radio') {
					parent.prepend(ES.util.format_string(ES.tpl.label_tpl, {
						display: label,
						id: conf.el
					}))
				}else if(el.attr('type') == 'radio' && conf.isPrepend){
					el.parents("div.input-wrap").prepend(ES.util.format_string(ES.tpl.label_tpl, {
						display: label,
						id: conf.el
					}))
				}else if(el.attr('type') == 'checkbox' && conf.isPrepend){
					el.parents("div.input-wrap").prepend(ES.util.format_string(ES.tpl.label_tpl, {
						display: label,
						id: conf.el
					}))
				} else {
					parent.append(ES.util.format_string(ES.tpl.label_tpl, {
						display: label,
						id: conf.el
					}))
				}
			}
			if (after_labels) {
				ES.each(after_labels, function(_, v) {
					if(el.attr('type') == 'radio' && conf.isPrepend){
						el.parents("div.input-wrap").append('<span class="input-content">' + v + '</span>')
					}else{
						parent.append('<span class="input-content">' + v + '</span>')
					}
				})
			}

			if (after_button && !$.isEmptyObject(after_button)) {
				after_button = [].concat(after_button)
				for(var i = 0; i<after_button.length;i++){
					if(el.attr('type') == 'radio' && conf.isPrepend){
						el.parents("div.input-wrap").append('<a id=' + after_button[i].el + ' style="margin-left:10px"></a>')
					}else if(el.attr('type') == 'checkbox' && conf.isPrepend){
						el.parents("div.input-wrap").append('<a id=' + after_button[i].el + ' style="margin-left:10px"></a>')
					}else{
						parent.append('<a id=' + after_button[i].el + ' style="margin-left:10px"></a>')
					}
					ES.ui.button(after_button[i])
				}
			}

			parent.append('<span class="msg"></span>')
			this.nonempty = nonempty
			this.msg = config.msg
			this.notSelectMsg = config.notSelectMsg //filter
			this.noSelect = config.noSelect //filter
			this.msg_type = config.msg_type
			this.customer_validate = conf.validate
			this.mask = conf.mask
			this.type = conf.type
			this.default_value = config.default_value
			this.validate = function() {
				this.clear_invalid()
				var result = true
				if (!this.get_value()) {
					if(el.hasClass('number')){
						if(this.nonempty && this.el.val()==''){
							this.set_msg(this.msg)
							result = false
						}
						/*else if(this.el.val()!='' && this.get_value()== 0){
						 this.set_msg(config.default_number_msg || ES.msg.get('more_than_zero'))
						 result = false
						 }*/
					}else if(this.nonempty){
						if(this.type == "filter"){
							if(this.get_display_value().length > 0 && this.noSelect){
								this.set_msg(this.notSelectMsg)
							}else{
								this.set_msg(this.msg)
							}
						}else{
							this.set_msg(this.msg)
						}
						result = false
					}
				}

				if(!this.get_value() && this.type == "filter" && this.noSelect ){
					if(this.get_display_value().length > 0){
						this.set_msg(this.notSelectMsg)
						result = false
					}
				}
				if (result && this.get_value() && this.mask) {
					var v = this.get_value()
					var mask = this.mask
					var reg = mask.reg || mask
					if (!reg.test(v)) {
						if (mask.msg){
							this.set_msg(mask.msg)
						}else{
							this.set_msg(ES.msg.error_regex)
						}
					} else {
						this.clear_invalid()
					}
					result = reg.test(v)
				}
				if (result && this.customer_validate) {
					result = this.customer_validate()
				}
				if(el.hasClass('baidu-address')) {
					if(this.nonempty){
						result = (this.get_value().address) ? true : false
					}
					if(!result) {
						this.set_msg(this.msg)
					}
				}
				return result
			}
			el.on('change', function(e) {
				var v = $(this).val()
				var _input = ES.ui.get(e.target.id)
				if(_input.type == "filter" && v.trim().length <= 0){
					ES.get(this).data().value = "";
				}
				var comp = _input.mask
				if (comp) {
					var reg = comp.reg || comp
					if (!reg.test(v)) {
						/**
						 var def = comp.default_value ? comp.default_value : ''
						 $(this).val(def)
						 **/
						if (comp.msg){
							_input.set_msg(comp.msg)
						}else{
							_input.set_msg(ES.msg.error_regex)
						}
						e.preventDefault()
					} else {
						_input.clear_invalid()
					}
				}
			})
		} else {
			// hidden field always return true when validating
			this.validate = function() {
				return true
			}
		}
		this.id = conf.el
		this.el = el
		this.etype = 'input'

		// number field
		if (el.hasClass('number')) {
			this.get_value = function() {
				var v = this.el.val()
				return $.isNumeric(v) ? +v : 0
			}
			el.on('change', function() {
				var v = $(this).val()
				if (!$.isNumeric(v)) {
					v = parseFloat(v)
					if(!v){
						v = "";
					}
					$(this).val(v)
				}
			})
			el.on('keyup', function(e) {
				el.change();
			})
		} else if(el.hasClass('baidu-address')){
			this.get_value = function() {
				var lanlng = {}
				if(this.el.data('value')){
					lanlng.lng = this.el.data('value').lng
					lanlng.lat = this.el.data('value').lat
				} else {
					lanlng.lng = ''
					lanlng.lat = ''
				}
				return {
					address: this.el.val(),
					longitude: lanlng.lng,
					latitude: lanlng.lat
				}
			}
		} else {
			if(el.hasClass('date') || el.hasClass('datetime')){
				el.on('change', function() {
					var v = $(this).val()
					var reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/
					//判断日期格式
					if (!reg.test(v)) {
						$(this).val('')
						return
					}
					//判断minDate maxDate v 是否在该区间
					var minDate = $(this).datepicker('option','minDate')
					var maxDate = $(this).datepicker('option','maxDate')
					if(!ES.util.judge_date_interval(minDate,maxDate,v,el.hasClass('date'))){
						$(this).val('')
					}
					if(el.hasClass('date')) {
						var formatedDate = $.datepicker.formatDate(
							$(this).datepicker('option', 'dateFormat'),
							$(this).datepicker('getDate')
						)
						$(this).val(formatedDate)
					}
				})
			}
			this.get_value = function() {
				if(this.el[0].type == 'checkbox'){
					return this.el.prop('checked')
				} else {
					var v = this.el.val()
					if(v) {
						switch (Object.prototype.toString.call(v)) {
							case '[object String]':
								v = v.trim()
								break
							default:
								break
						}
					}
					return v
				}
			}
		}
		this.set_value = function(v) {

			if(this.el.hasClass('baidu-address')){
				this.el.val(ES.util.xssunescape(v.address))
				if(v.longitude && v.latitude){
					this.el.data('value',{
						lng: v.longitude,
						lat: v.latitude
					})
				}
				if(this.el.hasClass('change-input')) this.el.trigger('change')
				return this.el

			} else {
				var val = this.el.val(ES.util.xssunescape(v))
				if(this.el.hasClass('change-input')) this.el.trigger('change')
				return val
			}

		}
		this.set_nonempty = function(nonempty) {
			var label = this.el.closest('.input-wrap').find('label')
			if (label) {
				this.nonempty = nonempty
				if (nonempty) {
					label.find('span').remove()
					label.prepend('<span class="nonempty">*</span>')
				} else {
					label.find('span').remove()
				}
			}
		}
		this.clear_invalid = function() {
			var tip_msg = this.el.closest('div').find('.msg-tip')
			if (tip_msg.length > 0){
				tip_msg.remove()
			}
			var error_style = config.msg_style || 'error'
			this.el.removeClass('es-input-invalid')
			this.el.removeClass(error_style+'_frame')
			ES.get('.main-popup-error').hide().children().hide()
			function findMsg(el){
				if(el.parent().children('.msg').length == 0){
					findMsg(el.parent())
				} else {
					el.parent().children('.msg').empty().removeClass('error').hide()
				}
			}
			if(el.attr('type') != 'hidden'){
				findMsg(this.el)
			}

		}
		this.set_msg = function(msg) {
			// this.msg = msg
			if (this.msg_type && this.msg_type == 'tips') {
				var tips = '<div class="msg-tip error">' + msg + '</div>'
				ES.get(tips).insertBefore(this.el)
			} else if(this.msg_type && this.msg_type == 'popup-tips'){
				//错误类型 默认error warn
				var error_style = config.msg_style || 'error'
				var i_cls = 'fa-times-circle'
				switch (error_style){
					case 'warn':
						i_cls = 'fa-exclamation-circle'
						break;
					default:
						break;
				}
				ES.get('.main-popup-error').children().hide()
				ES.get('.main-popup-error').show().find('.popup-'+error_style).html('<i class="fa '+i_cls+'"></i> ' + msg).show()
				if(!this.el.hasClass('select2')){
					ES.get('#'+this.id).addClass(error_style+'_frame')
				} else {
					this.el.siblings('span').find('.select2-selection').addClass(error_style+'_frame')
				}

			}else{
				function findMsg(el){
					if(el.parent().children('.msg').length==0){
						findMsg(el.parent())
					} else {
						el.parent().children('.msg').addClass('error').html('<i class="fa '+i_cls+'"></i> ' + msg).show()
					}
				}
				if(el.attr('type') != 'hidden'){
					findMsg(this.el)
				}
			}
		}
		this.disable = function() {
			if(this.el.attr('type') == 'checkbox') {
				this.el.addClass('disabled').prop('disabled', true)
			} else {
				this.el.addClass('disabled').attr('readonly', true).attr('disabled', 'disabled')
			}

		}
		this.enable = function() {
			this.el.removeClass('disabled').attr('readonly', false).removeAttr('disabled')
		}
		this.clear_value = function() {
			this.el.val('')
			return this
		}
		this.show = function() {
			this.el.parent().show()
		}
		this.hide = function() {
			this.el.parent().hide()
		}
	}
	var ret = new es_input(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.select = function(config) {
	var ret = ES.ui.input(config)
	ret.bind_list = function(list) {
		this._list = list
		var out = []
		for (var i = 0, l = list.length; i < l; i++) {
			out.push(ES.util.format_string(ES.tpl.option_tpl, list[i]))
		}
		this.el.append(out.join(''))
		return this
	}
	ret.clear_list = function() {
		this.el.empty()
		return this
	}
	ret.set_display_value = function(v) {
		return this.el.val(v)
	}
	ret.get_display_value = function() {
		return ES.get('#' + config.el + ' option:selected').text()
	}
	ret.disable = function() {
		this.el.addClass('disabled').prop('disabled', true)
	}
	if (config.disable){
		ret.el.attr('disabled', true)
	}
	ret.etype = 'select'
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.radio = function(config) {
	var ret = ES.ui.input(config)
	var radioInput = ''
	if (config.data) {
		ES.each(config.data, function (index, item) {
			radioInput += '<div class="radio-item"><label>' + item.display + '</label><input type="radio" name="' + ret.el.attr('name') + '" id="' + item.value + '"/></div>'
		})
	}
	var input = ES.get('#' + ret.id)
	input.hide();
	ES.get('#' + ret.id).after('<div class="radio-group" name="' + ret.el.attr('name') + '">' + radioInput + '</div>')
	ES.get('#' + ret.id).siblings('.radio-group').find('.radio-item').on('click', function (e) {
		// var checked = $(this).parent().find('.radio-item').hasClass('current-radio')
		var checked = $(e.target).parent('.radio-item').hasClass('current-radio')
		if(config.toggle_click && checked){
			$(this).parent().find('.radio-item').removeClass('current-radio')
			$(this).find('input').prop("checked", false)
			ES.get('#' + ret.id).val(ret.get_value()).trigger('change')
		}else {
			$(this).parent().find('.radio-item').removeClass('current-radio')
			$(this).addClass('current-radio')
			$(this).find('input').prop("checked", true)
			ES.get('#' + ret.id).val(ret.get_value()).trigger('change')
		}
	})

	ret.el = ES.get('#' + ret.id).siblings('.radio-group')

	ret.get_value = function () {
		return this.el.find('.current-radio input').attr('id')
	}

	ret.set_value = function (value) {
		ES.each(this.el.find('.radio-item input'), function (index, item) {
			if($(item).attr('id') == value){
				$(item).trigger('click')
			}
		})
		ES.get('#' + ret.id).val(ret.get_value()).trigger('change')
	}
	ret.disable = function() {
		this.el.addClass('disabled').prop('disabled', true)
	}
	if (config.disable){
		ret.el.attr('disabled', true)
	}
	ret.etype = 'radio'
	ES.ui.add(ret.id, ret)
	return ret
}


ES.ui.file = function(config) {
	var ret = ES.ui.input(config)
	var id = '#' + config.el
	var el = $(id)
	el.wrap("<a href='javascript:;' class='file-upload'></a>")
	var parent = el.parent()
	var label = '<span class="upload_file">'+config.placeholder+'</span>'
	parent.prepend(label)

	ret.clear_value = function(){
		ret.el.val('')
		ret.el.parent().find('.upload_file').html(ES.msg.get('click_upload_file'))
	}
	return ret
}
ES.ui.input_date_input = function(config) {
	config.cls = config.cls ? config.cls + " input_date_input" : 'input_date_input'
	var from_ret = ES.ui.input(config)
	var toInput,
		toClassName = config.toClassName || "date"
	if(config.disabled){
		toInput = ES.get('<input type="text" name="'+config.toName+'" id="toDate-'+config.el+'" class="'+toClassName+'" style="padding-left: 10px;" disabled="true"/>')
	} else {
		toInput = ES.get('<input type="text" name="'+config.toName+'" id="toDate-'+config.el+'" class="'+toClassName+'" style="padding-left: 10px;"/>')
	}
	toInput.insertAfter(from_ret.el.next())

	config.dateFormat = "yy-mm-dd"
	from_ret.toName = config.toName
	// 中文显示
	var configCn = {
		dateFormat: 'yy-mm-dd',
		yearSuffix: '年',
		monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六']
	}
	if(ES.lang === 'zh-cn') {
		config = ES.util.merge(config, configCn)
		config.changeMonth = true
		config.changeYear = true
	}
	var minDate = config.minDate
	var maxDate = config.maxDate
	var isDateTime = false;
	from_ret.el.datepicker(config).addClass('input-date-from')
	if(toInput.hasClass("datetime")){
		var timeFormat = config.second ? 'HH:mm:ss' : 'HH:mm:00'
		config = ES.util.merge(config,{
			timeText: ES.msg.get('timepicker_timeText'),
			closeText: ES.msg.get('timepicker_closeText'),
			currentText: ES.msg.get('timepicker_currentText'),
			timeFormat: timeFormat,
			controlType: 'select',
			minDate: config.toMinDate,
			oneLine: true
		})
		toInput.datetimepicker(config).addClass('input-date-to')
		isDateTime = true;
	}else{
		config.minDate = config.toMinDate
		toInput.datepicker(config).addClass('input-date-to')
	}

	var change_input_date = function() {
		var v = $(this).val()
		var reg = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
		//判断日期格式
		if (!reg.test(v) && !isDateTime) {
			$(this).val('')
			return
		}
		//判断minDate maxDate v 是否在该区间
		if(!ES.util.judge_date_interval(minDate,maxDate,v,true)){
			$(this).val('')
		}
	}

	from_ret.el.on('change', change_input_date)
	toInput.on('change', change_input_date)

	var from_key = from_ret.el.attr('name') || from_ret.el.attr('id')
	var to_key = toInput.attr('name') || toInput.attr('id')

	from_ret.get_value = function() {
		if(from_ret.nonempty && from_ret.el.val() == '' && toInput.val() == ''){
			return ''
		}else{
			var valueObj = {}
			valueObj[from_key] = from_ret.el.val()
			valueObj[to_key] = toInput.val()
			return valueObj
		}

	}
	from_ret.set_value = function(val) {
		from_ret.el.val(val[from_key])
		toInput.val(val[to_key])
	}
	from_ret.clear_value = function() {
		toInput.val('')
		return from_ret.el.val('')
	}
	from_ret.disable = function() {
		from_ret.el.addClass('disabled').attr('readonly', true)
		toInput.addClass('disabled').attr('readonly', true)
	}
	from_ret.enable = function() {
		from_ret.el.removeClass('disabled').attr('readonly', false)
		toInput.removeClass('disabled').attr('readonly', false)
	}
	from_ret.set_msg = function(msg) {
		config.msg = msg
		if (config.msg_type && config.msg_type == 'tips') {
			if(from_ret.el.val() == ''){
				var tips = '<div class="msg-tip error">' + msg + '</div>'
				ES.get(tips).insertBefore(from_ret.el)
			}
			if(toInput.val() == ''){
				var tips = ES.get('<div class="msg-tip error">' + msg + '</div>')
				tips.insertBefore(toInput)
				var marginLeft = tips.css('marginLeft').split('px')[0]*1+from_ret.el.outerWidth()*1
				var marginTop = tips.css('marginTop').split('px')[0]*1-toInput.outerHeight()*1
				tips.css('marginLeft',marginLeft+'px')
				tips.css({
					'marginLeft': +marginLeft+90+'px',
					'marginTop': marginTop+'px',
				})
			}

		}

	}
	from_ret.validate = function() {
		from_ret.clear_invalid()
		var result = true
		if (!from_ret.get_value() || toInput.val() == '') {
			if(from_ret.nonempty){
				from_ret.set_msg(from_ret.msg)
				result = false
			}
		}
		if (result && from_ret.customer_validate) {
			result = from_ret.customer_validate()
		}
		return result
	}

	from_ret.etype = 'input_date_input'
	ES.ui.add(from_ret.id, from_ret)
	return from_ret
}

ES.ui.input_year_month = function(config) {
	config.cls = "input_year_month"
	var from_ret = ES.ui.select(config)
	var toInput = ES.get('<select name="'+config.toName+'" id="toDate-'+config.toName+'" style="padding-left: 10px;"></select>')
	toInput.insertAfter(from_ret.el.next())

	var yearList = []
	for(var y = 2010; y <= 2020 ;y++){
		yearList.push({
			display:y+'年',
			value:y
		})
	}
	from_ret.bind_list(yearList)

	var monthList =[]
	for(var y = 1; y <= 12 ;y++){
		monthList.push({
			display:y<10?'0'+y+'月':y+'月',
			value:y<10?'0'+y:y
		})
	}
	var out = []
	for (var i = 0, l = monthList.length; i < l; i++) {
		out.push(ES.util.format_string(ES.tpl.option_tpl, monthList[i]))
	}
	toInput.append(out.join(''))


	var from_key = from_ret.el.attr('name') || from_ret.el.attr('id')
	var to_key = toInput.attr('name') || toInput.attr('id')

	from_ret.get_value = function() {
		if(from_ret.nonempty && from_ret.el.val() == '' && toInput.val() == ''){
			return ''
		}else{
			var valueObj = {}
			valueObj[from_key] = from_ret.el.val()
			valueObj[to_key] = toInput.val()
			return valueObj
		}

	}
	from_ret.set_value = function(val) {
		from_ret.el.val(val[from_key])
		toInput.val(val[to_key])
	}
	from_ret.clear_value = function() {
		toInput.val('')
		return from_ret.el.val('')
	}
	from_ret.disable = function() {
		from_ret.el.addClass('disabled').attr('readonly', true)
		toInput.addClass('disabled').attr('readonly', true)
	}
	from_ret.enable = function() {
		from_ret.el.removeClass('disabled').attr('readonly', false)
		toInput.removeClass('disabled').attr('readonly', false)
	}
	from_ret.set_msg = function(msg) {
		config.msg = msg
		if (config.msg_type && config.msg_type == 'tips') {
			if(from_ret.el.val() == ''){
				var tips = '<div class="msg-tip error">' + msg + '</div>'
				ES.get(tips).insertBefore(from_ret.el)
			}
			if(toInput.val() == ''){
				var tips = ES.get('<div class="msg-tip error">' + msg + '</div>')
				tips.insertBefore(toInput)
				var marginLeft = tips.css('marginLeft').split('px')[0]*1+from_ret.el.outerWidth()*1
				var marginTop = tips.css('marginTop').split('px')[0]*1-toInput.outerHeight()*1
				tips.css('marginLeft',marginLeft+'px')
				tips.css({
					'marginLeft': +marginLeft+90+'px',
					'marginTop': marginTop+'px',
				})
			}
		}
	}
	from_ret.validate = function() {
		from_ret.clear_invalid()
		var result = true
		if (!from_ret.get_value() || toInput.val() == '') {
			if(from_ret.nonempty){
				from_ret.set_msg(from_ret.msg)
				result = false
			}
		}
		if (result && from_ret.customer_validate) {
			result = from_ret.customer_validate()
		}
		return result
	}

	from_ret.etype = 'input_date_input'
	ES.ui.add(from_ret.id, from_ret)
	return from_ret
}


ES.ui.input_date_time = function(config) {
	var ret = ES.ui.input(config)
	config.dateFormat = "yy-mm-dd"
	// 中文显示
	var configCn = {
		dateFormat: 'yy-mm-dd',
		yearSuffix: '年',
		monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六']
	}
	if(ES.lang === 'zh-cn') {
		config = ES.util.merge(config, configCn)
		config.changeMonth = true
		config.changeYear = true
	}
	if(config.needTime){
		var timeFormat = config.second ? 'HH:mm:ss' : 'HH:mm:00'
		config = ES.util.merge(config,{
			timeText: ES.msg.get('timepicker_timeText'),
			closeText: ES.msg.get('timepicker_closeText'),
			currentText: ES.msg.get('timepicker_currentText'),
			timeFormat: timeFormat,
			controlType: 'select',
			minDate: config.toMinDate,
			oneLine: true
		})
	}
	ret.el.datepicker(config).addClass('input-date-time')
	ret.el.on('change', function() {
		var v = $(this).val()
		var reg = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
		//判断日期格式
		if (!reg.test(v) && !config.needTime) {
			$(this).val('')
			return
		}
		//判断minDate maxDate v 是否在该区间
		var minDate = $(this).datepicker('option','minDate')
		var maxDate = $(this).datepicker('option','maxDate')
		if(!ES.util.judge_date_interval(minDate,maxDate,v,true)){
			$(this).val('')
		}
	})
	var time = ES.get('<select class="input-date-time input-time"></select>')
	var out = []
	for (var i = 0; i < 24; i++) {
		var d = i < 10 ? '0' + i : '' + i
		out.push(ES.util.format_string(ES.tpl.option_tpl, {
			display: d + ':00:00',
			value: d + ':00:00'
		}))
	}
	time.append(out.join('')).val('10:00:00').insertAfter(ret.el)
	ret.el_time = time
	ret.get_value = function() {
		if (this.el.val() == ''){
			return ''
		} else if(config.needTime){
			return this.el.val()
		}else{
			return this.el.val() + ' ' + this.el_time.val()
		}
	}
	ret.set_value = function(v) {
		var arr = v.split(' ')
		this.el.val(arr[0])
		this.el_time.val(arr[1])
	}
	ret.disable = function() {
		this.el.addClass('disabled').attr('readonly', true)
		this.el_time.addClass('disabled').attr('readonly', true)
	}
	ret.enable = function() {
		this.el.removeClass('disabled').attr('readonly', false)
		this.el_time.removeClass('disabled').attr('readonly', false)
	}

	if(config.no_default_time){
		ret.set_value('')
	}

	ret.etype = 'input_date_time'
	ES.ui.add(ret.id, ret)
	return ret
}


ES.ui.input_time = function(config) {
	var hour = ES.ui.select(config)
	var out = []
	for (var i = 0; i < 24; i++) {
		var d = i < 10 ? '0' + i : '' + i
		out.push({
			display: d ,
			value: d
		})
	}
	hour.bind_list(out)

	var init_minute_second = function(item){
		for (var i = 0; i < 60; i++) {
			var d = i < 10 ? '0' + i : '' + i
			out.push(ES.util.format_string(ES.tpl.option_tpl, {
				display: d,
				value: d
			}))
		}
		item.append(out.join('')).insertAfter(hour.el)
	}
	var second = ES.get('<select class="input-time-second"></select>')
	var minute = ES.get('<select class="input-time-minute"></select>')
	init_minute_second(second)
	init_minute_second(minute)

	hour.el.on('change',function(){
		if(!minute.val()){
			minute.val('00')
		}
		if(!second.val()){
			second.val('00')
		}
	})
	hour.set_value  = function(time){
		var insertTime = time.split(':')
		hour.el.val(insertTime[0])
		minute.val(insertTime[1])
		second.val(insertTime[2])
	}
	hour.get_value = function(){
		if(hour.el.val()&&minute.val()&&second.val()){
			return hour.el.val()+':'+minute.val()+':'+second.val()
		} else {
			return ''
		}
	}
	hour.el.css({width:'20%'})
	minute.css({width:'20%'}).val('')
	second.css({width:'20%'}).val('')
	hour.clear_value()
	return hour
}

$(document).on('click', function(e) {
	var obj = $(e.srcElement || e.target);
	if(obj.hasClass("trigger")){
		obj.removeClass("trigger");
		return;
	}
	ES.get("td.brief").find("div.action-dropdown").removeClass("current");
	obj.parents("td.brief").find("div.action-dropdown").addClass("current");
	$('.input-drop').each(function(){
		if($(this).is(":visible")&&!$(obj).is(".input-drop *")){
			var item,
				input
			if($('#'+$(this).data('value')).val() && $(this).children('div.input-port-item-selected').length>0){
				if(!ES.get('#'+ES.get(this).data('value')).hasClass('no-auto-select')){  // no-auto-select  判断是否默认选中下拉框中的第一个
					item = $(this).children('div.input-port-item-selected').eq(0)
					if(item.length>0){
						$('#' + $(this).data('value')).val('').data('value', '')
						$('#'+$(this).data('value')).siblings('.uneditable-label').html('')
						item.trigger('click')
					}
				}
			} else if($('#'+$(this).data('value')).val()){
				item = $(this).children('div').eq(0)
				input = $('#' + $(this).data('value'))
				//item = $(this).children('div.input-port-item-selected').eq(0)
				if(!input.data('value')){
					if(item.length>0 && input.hasClass('needEmpty')){
						input.val('')
						input.siblings('.uneditable-label').html('')
					}
				}
				//if(item.length>0 && !input.parent().hasClass('autoFillDisabled')){
				//	item.trigger('click')
				//}
			}
			$(this).hide()
			var id = $(this).data().value;
			if(ES.get("#"+id).hasClass("trigger")){
				$(this).show()
				ES.get("#"+id).removeClass("trigger");
			}
			if(ES.get("#"+id).parent("span").hasClass("input") && !obj.hasClass("input")){
				if(!obj.parents("td").hasClass("input") && !ES.get("#"+id).parents("tr").hasClass("edit")){
					var el = ES.get("#"+id),
						value = ES.get("#"+id).val(),
						dataValue = ES.get("#"+id).data("value") || "";
					el.parents("td.input").find("span").removeClass("active");
					el.parents("td.input").find("span.view").addClass("active").html(value);
					el.parents("td.input").find("span.view").data("value",dataValue);
					ES.get(window).resize();
				}
			}
			if(ES.get("#"+id).parent("div").hasClass("edit") && !obj.parent("div").hasClass("edit") && !obj.hasClass("edit")){
				var value = ES.get("#"+id).val(),
					dataValue = ES.get("#"+id).data().value || "";
				ES.get("#"+id).hide();
				ES.get("#"+id).parent("div").find("i.edit-icon").show();
				ES.get("#"+id).parent("div").find("span.view").html(value).data("value",dataValue).show();
			}
		}
	})
	$('.power-geo-drop').each(function(){
		if($(this).is(":visible")&&!$(obj).is(".power-geo-drop *")){
			// if($(this).children('div.input-port-item-selected')){
			// 	$(this).children('div.input-port-item-selected').eq(0).trigger('click')
			// }
			$(this).hide()
		}
	})
	if(ES.get(".ui-datepicker").is(":visible") && !obj.parents("div").hasClass("ui-datepicker")&& !obj.parents("td").hasClass("input")){
		if(!obj.hasClass("ui-datepicker") && !obj.hasClass("input")){
			var valueList = ES.get("#ui-datepicker-div").attr("data-value");
			arr = (valueList || "").split(",");
			ES.each(arr,function (_,v) {
				if(ES.get("#" + v).parents("td").hasClass("input") && !ES.get("#" + v).parents("tr").hasClass("edit")){
					var el = ES.get("#"+ v),
						value = ES.get("#"+ v).val();
					el.parents("td.input").find("span").removeClass("active");
					el.parents("td.input").find("span.view").addClass("active").html(value);
					ES.get(window).resize();
				}
			})
		}
	}
})

/**
 *带[港口信息]输入联想的input
 * @param  config  控件设置项对象
 * @param  {String} config.module  港口信息区分[内贸整箱、外贸整箱、外贸拼箱]---both:全部；DomesticShippingSpu:内贸；ForeignTrunkSpu:外贸；LclSpu:拼箱
 * @param  {String} config.type  标识起始港还是目的港---from:查找起始港港口；to:查找目的港港口
 * @param  {String} config.param 其他参数
 */
ES.ui.input_port = function(config) {
	var ret = ES.ui.input(config)
	ret.param = config.param ? config.param : {}
	ret.get_value = function() {
		return this.el.data('value') ? this.el.data('value') : ''
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_display_value = function(val) {
		return this.el.val(val)
	}
	ret.set_value = function(val) {
		var g = this
		var find_geo_callback = function(res) {
			if (!res.ports || res.ports.length <= 0) {
				return
			}
			res = res.ports[0]
			if (ES.lang == 'en-us') {
				g.el.val(res.nameEn)
			} else {
				g.el.val(res.name)
			}
		}
		ES.util.ajax_get('/geo/find_port_by_code', {
			code: val
		}, find_geo_callback)
		return this.el.data('value', val)
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}
	ret.set_preference = function(list) {
		this.preference = list
	}
	var table = $('<div class="input-drop input-port-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(table)
	var type = config.type
	var related = config.related
	var module = config.module
	var both = config.module == 'both'
	var filter_geo = function(value) {
		var input = $(this)
		var inputValue = input.val()
		var drop = $('#' + input.attr('id') + '-drop')
		if (!inputValue) {
			inputValue = ''
		}

		var ws = '/port/query'
		if ('from' == type) {
			if (both) {
				ws = '/port/query_both_from_port'
			} else {
				ws = '/port/query_from_port'
			}
		} else if ('to' == type) {
			if (both) {
				ws = '/port/query_both_to_port'
			} else {
				ws = '/port/query_to_port'
			}
		}
		if(config.dataUrl){
			ws=config.dataUrl;
		}
		var port = ''
		if (related && ES.ui.get(related)) {
			port = ES.ui.get(related).get_value()
		}
		var width = input.outerWidth() - 22
		width = width <= 200 ? 200 : width
		var height = input.outerHeight()
		var offset = input.offset()
		var poupFlag = input.closest('.popup').length>0?true:false
		var infactTop = offset.top + height
		if(poupFlag){
			infactTop = infactTop-$(document).scrollTop()
		}
		drop.css({
			top: infactTop,
			left: offset.left,
			'min-width': width,
			'position':poupFlag ? 'fixed' : 'absolute'
		})
		drop.empty().html('<div class="input-port-item" data-value="-1">' + ES.msg.get('loading') + '</div>').show()
		var reqData = ES.util.merge({
			q: inputValue,
			port: port,
			type: module
		}, ret.param)
		if(config.countryId){
			reqData.country = config.countryId;
		}
		ES.util.ajax_get(ws,reqData , function(res) {
			var out = []
			var selected = false
			var preference = ES.ui.get(input.attr('id')).preference
			if(preference) {
				out.push('<div class="input-port-sep" data-value="-1">' + ES.msg.get('preference') + '</div>')
				ES.each(preference,function(_,v){
					if (ES.lang == 'en-us') {
						out.push('<div class="input-port-item " data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.nameEn + '</div>')
					} else {
						out.push('<div class="input-port-item " data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.name + '</span> - ' + v.nameEn +'</div>')
					}
				})
			}
			if (!res.ports || res.ports.length <= 0) {
				out.push('<div class="input-port-item" data-value="-1">' + ES.msg.get('default_empty_result') + '</div>')
				input.data('value', '')
			} else {
				var filter = {}
				var ports = res.ports
				ES.each(ports, function(_, v) {
					filter[v.code] = v
				})
				var t_p = []
				for (var p in filter) {
					if(filter.hasOwnProperty(p)){
						t_p.push(filter[p])
					}
				}
				t_p.sort(function(a, b) {
					return a.nameEn > b.nameEn ? 1 : -1
				})
				var group = t_p[0].nameEn[0]
				// not display group title
				// out.push('<div class="input-port-sep" data-value="-1">' + group + '</div>')
				ES.each(t_p, function(_, v) {
					if (group != v.nameEn[0]) {
						group = v.nameEn[0]
						// not display group title
						// out.push('<div class="input-port-sep" data-value="-1">' + group + '</div>')
					}
					var cls = ''
					v.type = v.type ? v.type : ''
					if (input.val() == v.name || input.val() == v.nameEn || input.val() == v.code) {
						cls = 'input-port-item-selected'
						input.data('value', v.code).data('type', v.type)
						selected = true
					}
					if (ES.lang == 'en-us') {
						out.push('<div class="input-port-item ' + cls + '" data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.nameEn + '</div>')
					} else {
						out.push('<div class="input-port-item ' + cls + '" data-value="' + v.code + '" data-type="' + v.type + '">' +
							'<span style="float:right">' + v.code + '</span><span class="port-name">' + v.name + '</span> - ' + v.nameEn + '</div>')
					}
				})
			}
			drop.empty().html(out.join('')).show()
			if (!selected) {
				drop.children('div.input-port-item').eq(0).addClass('input-port-item-selected')
				if(inputValue) {
					input.data('value', drop.children('div.input-port-item').eq(0).data().value).data('type', drop.children('div.input-port-item').eq(0).data().type)
				}
			}
			drop.children('div.input-port-item').on('click', function(e) {
				var v = $(this)
				var tar = $('#' + v.parent().data().value).val(v.children('.port-name').html())
				if (v.data().value <= 0) {
					tar.val('').data('value', '').data('type', '')
					v.parent().hide()
					e.preventDefault()
					return false
				}
				tar.data('value', v.data().value).data('type', v.data().type).trigger('change',[value])
				ES.event.fire(v.parent().data().value, 'change', v.data().value)
				v.parent().hide()
				e.preventDefault()
			})
		})
	}
	var intveral = null
	var inp = null
	var input_callback = function() {
		if(!inp)
			return
		var t_inp = $(inp)
		t_inp.data('value', t_inp.val())
		filter_geo.apply(inp)
	}
	if(window.attachEvent && document.getElementById(ret.id).onpropertychange){
		document.getElementById(ret.id).onpropertychange=function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		}
	}else{
		ES.get('#' + ret.id).on('input',function(){
			if(inp){
				ES.get('#' + ret.id).data().value = ''
				if (intveral != null) {
					clearTimeout(intveral)
					intveral = null
				}
				intveral = setTimeout(input_callback, 300)
			}
		})
	}
	ES.get('#' + ret.id).on('keydown', function(evt) {
		inp = null
		var drop = $('#' + $(this).attr('id') + '-drop')
		var children = drop.children('div.input-port-item')
		if (evt.which == 13) {
			// enter
			drop.children('div.input-port-item-selected').eq(0).trigger('click')
			evt.preventDefault()
		} else if (evt.which == 9) {
			// tab
			if($(this).val()) {
				drop.children('div.input-port-item-selected').eq(0).trigger('click')
			} else {
				drop.hide()
			}
			// tab can not preventDefault since we need browser to do other things
		} else if (evt.which == 38) {
			// arrow top
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i > 0 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i - 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else if (evt.which == 40) {
			// arrow down
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i < total - 1 && children.eq(i).hasClass('input-port-item-selected')) {
					children.eq(i).removeClass('input-port-item-selected')
					children.eq(i + 1).addClass('input-port-item-selected')
					break;
				}
			}
			evt.preventDefault()
		} else {
			if ((evt.which < 48 && evt.which > 9) ||
				(evt.which > 105 && evt.which < 112) ||
				(evt.which > 123 && evt.which < 223)) {
				evt.preventDefault()
				return
			}
			inp = this
		}
	}).on('click', function(e) {
		var c = ES.get('#' + ES.get(this).attr('id') + '-drop')
		$(document).trigger('click')
		if (!c.is(":visible")) {
			$(document).trigger('click')
			var c = ES.get(this)
			var v = c.data('value')
			c.data('value', '')
			filter_geo.apply(this, [v])
			c.data('value', v)
			c.show()
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'input_port'
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.input_city = function (config) {
	config.value_field = function (res) {
		return res.id
	}
	config.display_field = function (res) {
		return res.name
	}
	config.filter = function (list, value) {
		var ret = []
		ES.each(list, function (_, v) {
			if (v.name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
				v.nameEN.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				ret.push(v)
			}
		})
		return ret
	}
	var filter = ES.ui.input_filter(config)

	ES.util.ajax_get('/geo/query_all_city', {}, function (res) {
		filter.load_data(res.children)
	})

	return filter
}

ES.ui.input_filter = function(config) {
	var ret = ES.ui.input(config)
	var allow_enter = ret.allow_enter = config.allow_enter
	var noFilterWhenFocus = config.no_filter_when_focus
	ret.isAsync = config.isAsync || false
	ret.data = config.data ? config.data : []
	ret.validate_display = config.validate_display
	ret.value_field = config.value_field ? config.value_field : function() {
		return ''
	}
	ret.display_field = config.display_field ? config.display_field : function() {
		return ''
	}
	ret.filter = config.filter ? config.filter : function() {
		return []
	}
	ret.get_value = function() {

		if(allow_enter){
			if( ret.data.length > 0 ){
				var has_val = false
				ES.each(ret.data,ES.delegate(function(_,v){
					if(ret.display_field(v) == this.el.val()){
						this.el.data('value', this.el.val())
						has_val = true
						return false
					}
				},this))
				if(!has_val){
					this.el.data('value', '')
				}
			}else {
				this.el.data('value', '')
			}
			return this.el.data('value') || this.el.val() || ''
		}
		else{
			return this.el.data('value') || ''  //不允许输入时不应取文本框的value
		}
	}

	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_display_value = function(val) {
		return this.el.val(val)
	}
	ret.set_value = function(val) {
		if(ret.data.length>0){
			var has_val = false
			ES.each(ret.data,ES.delegate(function(_,v){
				if(ret.value_field(v)==val){
					this.el.data('value', val)
					//if ($(v.display).length > 0) {
					//	this.el.val($(v.display).html())
					//} else {
					//	this.el.val(ret.display_field(v))
					//}
					this.el.val(ret.display_field(v))
					has_val = true
					return false
				}
			},this))
			if(!has_val){
				this.el.val(val)
				this.el.data('value', val)
			}
		}else {
			this.el.val(val)
			this.el.data('value', val)
		}
		if(this.el.hasClass('change-input')) this.el.trigger('change')
		return this.el
	}
	ret.load_data = function(data) {
		this.data = data
		return this
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}
	ret.validate = function () {
		var result = true
		this.clear_invalid()
		if(this.nonempty) {
			if(this.validate_display) {  //校验展示值
				result = this.get_display_value() ? true : false
			} else {
				result = this.get_value() ? true : false
			}
			if(!result) this.set_msg(this.msg)
		}
		return result
	}
	var table = $('<div class="input-drop input-filter-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(table)
	var filter = function(arg) {
		arg = arg || {}
		var input = $(this)
		if (input.hasClass('disabled')) {
			return
		}
		input.data().isBlur = true
		var value = input.data('value')
		var display = input.val().trim()
		if (!value || !display) {
			value = ''
		}
		var drop = $('#' + input.attr('id') + '-drop')
		var par = ES.ui.get(input.attr('id'))

		var width = input.outerWidth()
		var height = input.outerHeight()
		var offset = input.offset()
		var poupFlag = input.closest('.popup').length>0?true:false
		var infactTop = offset.top + height
		if(poupFlag){
			infactTop = infactTop-$(document).scrollTop()
		}
		drop.css({
			'top': infactTop,
			'left': offset.left,
			'min-width': width,
			'max-width': '400px',
			'position':poupFlag ? 'fixed' : 'absolute'
		})
		drop.empty()

		if (par.data.length <= 0) {
			if(allow_enter){
				drop.html('').hide()
			} else if(arg.showLoadingIcon) {
				drop.html('<div><i class="fa fa-refresh fa-spin select-loading"></i></div>').show()
			} else {
				drop.html('<div>' + ES.msg.get('default_empty_result') + '</div>').show()
			}
		}

		var res
		if(noFilterWhenFocus && arg.eventType === 'focus') {
			res = par.data
		} else {
			res = (!value && !display) ? par.data : par.filter(par.data, display, value)
		}

		if (res.length <= 0) {
			if(allow_enter){
				drop.html('').hide()
			} else if(arg.showLoadingIcon) {
				drop.html('<div><i class="fa fa-refresh fa-spin select-loading"></i></div>').show()
			} else {
				drop.html('<div>' + ES.msg.get('default_empty_result') + '</div>').show()
			}
			return
		}
		var out = []
		ES.each(res, function(_, v) {
			out.push('<div data-value="' + par.value_field(v) + '">' + par.display_field(v) + '</div>')
		})
		if(!config.eventName){
			drop.html(out.join('')).show().children('div').on('click', function(e) {
				var v = $(this)
				var id = v.parent().data().value
				$('#' + id).val(v.html()).data('value', v.data().value)
				ES.event.fire(id, 'change', v.data().value)
				v.parent().hide()
				e.preventDefault()
				//================
				var dropId = v.parent().attr("data-value");
				var drop_value = v.attr("data-value");
				var input_type = $("#"+dropId).attr("data-type");
				if(input_type == "grid"){
					var html = '<input class="'+$("#"+dropId).attr("class")+'" id="'+dropId+'" data-type="grid" type="text">';
					var dropValue = $("#"+dropId).val();
					var span = $("#"+dropId).parent("div").prev("span");
					span.attr("data-value",drop_value).html(dropValue).show();
					$("#"+dropId).parent("div").remove();
					span.parent("td").append(html);
					$("#"+dropId+"-drop").remove();
				}
				//================
				if($('#' + id).hasClass("input-eidt")){
					$('#' + id).data().isBlur = false
					$('#' + id).blur()
				}
				if(config.evenChange){
					config.evenChange();
				}
			})
		}else {
			drop.html(out.join('')).show().children('div').on('click', ES.event[config.eventName])
		}

	}

	var input_listener = function(evt) {
		if(ES.ui.get(this.id).isAsync){
			// $(document).trigger('click')
			$(this).data('value','')
			ES.ui.get(this.id).data = []
			// 此处传一个参数： true, 当点击输入框后会出现一个loading图标。
			filter.apply(this, [true])
			config.delayCallback(this, filter)
		} else {
			filter.apply(this)
		}
		evt.preventDefault()
	}

	if(window.attachEvent && document.getElementById(ret.id).onpropertychange){
		document.getElementById(ret.id).onpropertychange=input_listener
	}else{
		ES.get('#' + ret.id).on('input',input_listener)
	}

	var drop = $('#' + ret.id + '-drop')

	var scrollCalculate = function(){
		var selectedTop = drop.find('.input-item-selected').offset().top
		var dropTop = drop.offset().top
		var selectedOutHeight = drop.find('.input-item-selected').outerHeight()
		var dropOutHeight = drop.outerHeight()
		if (selectedTop - dropTop + selectedOutHeight <= 1) {
			var height = 0
			ES.each(ES.get('.input-item-selected').prevAll(), function (_, item) {
				height += $(item).outerHeight()
			})
			ES.get('.input-drop').scrollTop(height)
		} else if (selectedTop - dropTop + selectedOutHeight > dropOutHeight) {
			var height = 0
			ES.each(ES.get('.input-item-selected').prevAll(), function (_, item) {
				height += $(item).outerHeight()
			})
			ES.get('.input-drop').scrollTop(height + selectedOutHeight - dropOutHeight)
		}
	}

	ES.get('#' + ret.id).on('keyup', function(evt) {
		if (evt.which == 13) {
			// enter
			if(drop.find('.input-item-selected').length>0){
				drop.children('.input-item-selected').eq(0).trigger('click')
			} else {
				drop.children('div').eq(0).trigger('click')
			}
			// if (!allow_enter) {
			// 	ES.get(this).data('value', '')
			// }

			evt.preventDefault()
		} else if (evt.which == 9) {
			// tab
			if(ES.get('#' + ret.id).val()) {
				drop.children('div').eq(0).trigger('click')
			} else {
				//drop.hide()
			}
			// tab can not preventDefault since we need browser to do other things
		} else {
			if ((evt.which < 48 && evt.which > 9) ||
				(evt.which > 105 && evt.which < 112) ||
				(evt.which > 123 && evt.which < 223)) {
				evt.preventDefault()

			}
		}
		// if (ES.get('#' + ret.id).val().trim() == '') {
		// 	ES.ui.get(ret.id).clear_value();
		// }
	}).on('keydown', function(evt) {
		// fix table issue
		var value = $(this).data().value;
		// fix table issue
		$(this).data('value','')
		var drop = $('#' + $(this).attr('id') + '-drop')
		var children = drop.children('div')
		if (evt.which == 9) {
			// tab
			if(ES.get('#' + ret.id).val() && drop[0].style.display!='none') {
				drop.children('div').eq(0).trigger('click')
			} else {
				// fix table issue yangjie
				ES.get('#' + ret.id).data().value = value;
				// fix table issue yangjie
				drop.hide()
			}
		} else if (evt.which == 38) {
			// arrow top
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i > 0 && children.eq(i).hasClass('input-item-selected')) {
					children.eq(i).removeClass('input-item-selected')
					children.eq(i - 1).addClass('input-item-selected')
					break;
				}
			}
			scrollCalculate()
			evt.preventDefault()
		} else if (evt.which == 40) {
			// arrow down
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i < total - 1 && children.eq(i).hasClass('input-item-selected')) {
					children.eq(i).removeClass('input-item-selected')
					children.eq(i + 1).addClass('input-item-selected')
					break;
				} else {
					if(drop.find('.input-item-selected').length>0) continue
					children.eq(0).addClass('input-item-selected')
					break;
				}
			}
			scrollCalculate()
			evt.preventDefault()
		}
	}).on('click', function(e) {
		e.preventDefault()
		return false
	}).on('focus', function(e) {
		if(config.isDelay) { // isDelay：true,当输入框获得焦点时，从数据库拿取下拉框中的值
//			ES.ui.get(this.id).clear_value()

			$(document).trigger('click')
			$(this).data('value','')
			ES.ui.get(this.id).data = []
			// 此处传一个参数showLoadingIcon:true, 当点击输入框后会出现一个loading图标。
			filter.call(this, {showLoadingIcon:true})
			config.delayCallback(this, filter)
		} else {
			$(document).trigger('click')
			// 当不做其他操作时，data("value") 的数值保持不变
			// $(this).data('value','')
			filter.call(this, {eventType: 'focus'})
		}
		e.preventDefault();
	}).on('mouseup', function() {
		$(this).select()
	})
	ret.etype = 'input_filter'
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.geo_selector_v2 = function(config) {
	var ret = ES.ui.select(config)
	var from_level = config.from_level || 0
	var to_level = config.to_level || 3
	var def_val = config.value || null
	var lang = config.lang
	var ratio =config.ratio
	var has_set_value = false

	var filter_geo = function(comp, level, val, set_val, is_inited) {
		var query = '/geo/query'
		if (level <= 0) {
			query = '/geo/query_all_country'
		}
		var param = {
			parent: val
		}
		if (lang){
			param.lang = lang
		}
		ES.util.ajax_get(query, param, function(res) {
			if(has_set_value && is_inited) return
			var list = res.children
			if (list.length < 1) {
				var parent_comp = comp.parent()
				comp.remove()
				reset_css(parent_comp.children('select'))
				return
			}
			var out = [ES.util.format_string(ES.tpl.option_tpl, {
				display: ES.lang == ES.consts.language.ZH_CN ? '请选择' : 'Please Select...',
				value: -1
			})]
			for (var i = 0, l = list.length; i < l; i++) {
				out.push(ES.util.format_string(ES.tpl.option_tpl, {
					display: list[i].name,
					value: list[i].id
				}))
			}
			comp.empty().append(out.join(''))
			if (set_val) {
				comp.val(set_val)
			}
			comp.unbind('change')
			comp.on('change', function() {
				var c = ES.get(this)
				var v = c.val()
				var index = c.parent().children('select').index(c)
				if (index + 1 <= to_level) {
					c.nextUntil("span").remove()
					if (v == '-1') {
						reset_css(c.parent().children('select'))
						return false;
					}
					var s = ES.get('<select data-value="' + (index + 1) + '"></select>')
					s.insertAfter(c)
					reset_css(c.parent().children('select'))
					filter_geo(s, index + 1, v)
				}
			})
			if (def_val) {
				comp.trigger('change')
			}
		})
	}
	var reset_css = function(child_list) {
		if(ratio){
			var perc = 100 / child_list.length * ratio
		}else{
			var perc = 100 / child_list.length * 0.50
		}
		for (var child in child_list) {
			if(child_list.hasOwnProperty(child)){
				child_list.eq(child).css({
					'width': perc + '%',
					'margin-right': '5px'
				})
			}
		}
	}
	ret.from_level = from_level
	ret.to_level = to_level
	ret.default_value = def_val
	filter_geo(ret.el, from_level, null, def_val, true)
	ret.el.data('value', def_val)

	ret.etype = 'geo_selector'
	ret.get_value = function() {
		var ret = 0
		var child_list = this.el.parent().children('select')
		for (var i = child_list.length - 1; i >= 0; i--) {
			ret = +(child_list.eq(i).val())
			if (ret > 0) {
				break;
			}
		}
		if (ret < 0) {
			ret = 0
		}
		return ret
	}
	ret.get_display_value = function() {
		var display_val = ''
		var child_list = this.el.parent().children('select')
		if(child_list.length==1&&child_list.eq(0).find('option:selected').val()=='-1'){
			return display_val
		}else{
			for (var i = 0; i < child_list.length; i++) {
				var thisSelect = child_list.eq(i).find('option:selected')
				if(thisSelect.val()!=-1){
					display_val += '-' + thisSelect.text()
				}
			}
			display_val = display_val.replace('-', '')
			return display_val
		}
	}
	ret.set_value = function(v) {
		def_val = null
		has_set_value = true
		var v = v || []
		this.el.parent().children('select').first().nextAll('select').remove()
		if (v.length < 1) {
			filter_geo(this.el, this.from_level, null, null)
		} else {
			v = [null].concat(v)
			var s = this.el.parent().children('select').first()
			var msg = this.el.parent().children().last()
			for (var i = 0; i < v.length - 1; i++) {
				if (i > 0) {
					s = ES.get('<select data-value="' + i + '"></select>')
					s.insertBefore(msg)
				}
				filter_geo(s, this.from_level + i, v[i], v[i + 1], false)
			}
		}
		reset_css(this.el.parent().children('select'))
	}
	ret.clear_value = function() {
		def_val = this.default_value
		this.el.nextUntil("span").remove()
		filter_geo(this.el, this.from_level, null, this.default_value)
		reset_css(this.el.parent().children('select'))
	}
	ret.disable = function(){
		var child_list = this.el.parent().children('select')
		child_list.each(function(_,v){
			$(v).addClass('disabled').attr('disabled',true)
		})
	}
	ret.enable = function(){
		var child_list = this.el.parent().children('select')
		child_list.each(function(_,v){
			$(v).removeClass('disabled').removeAttr('disabled')
		})
	}
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.geo_selector = function(config) {
	var ret = ES.ui.input(config)
	ret.el.attr('readonly', true)
	var lenList = 0,
		isLoad = false;
	if(!config.isEdit){
		config.countryId = 49
		if (ES.lang == 'en-us') {
			config.countryId = 212
		}
	}

	var displayList = [
		{"id":config.countryId},
		{"id":config.provinceId},
		{"id":config.cityId},
		{"id":config.regionId},
		{"id":config.subRegionId}
	]
	var selectId = 0;
	ES.get("#"+ret.id+"-drop").remove();
	var geo_div = $('<div class="input-drop input-geo-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(geo_div)
	var dom = {
		el: ret.id + '-drop',
		tabs: [{
			value: '',
			display: ES.msg.get('country') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('common_province') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('province') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('city') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('region') + '',
			cls: ''
		}, {
			value: '',
			display: ES.msg.get('subRegion') + '',
			cls: ''
		}],
		panels: [{}, {}, {}, {}, {},{}]
	}
	if(config.length){
		dom.tabs = dom.tabs.slice(0, config.length)
		dom.panels = dom.panels.slice(0, config.length)
	}
	var displayValue = [];
	lenList = ES.ui.tab_v(dom).len;
	var show_geo = function() {
		var geo = $(this)
		var width = config.width||geo.outerWidth()
		var height = geo.outerHeight()
		var offset = geo.offset()
		var tab_panel = ES.ui.get(geo.attr('id') + '-drop')
		tab_panel.el.css({
			top: offset.top + height,
			left: offset.left,
			width: width
		})
		tab_panel.el.show()
	}
	var filter_geo = function(tab_panel, level, val,selectedId,selectIndex, geoDefault) {
		var query = '/geo/query'
		if (level <= 0) {
			query = '/geo/query_all_country'
			level = 0;
		}
		if(isLoad){
			tab_panel.set_panel(1)
		}else{
			tab_panel.set_panel(level)
		}

		ES.util.ajax_get(query, {
			parent: val
		}, function(res) {
			var out = ['<dl>']
			var common = []
			var compare = function (c1, c2) {
				var n1 = c1.nameEN;
				var n2 = c2.nameEN;
				if (n1 < n2) {
					return -1;
				} else if (n1 > n2) {
					return 1;
				} else {
					return 0;
				}
			}
			isLoad = ES.get("#"+ret.id+"-drop").css("display").indexOf("none") >= 0;
			res.children = res.children.sort(compare);
			var groupArr = [{
				'group': 'ABCDEFG',
				'groupObj': 'A-G'
			},{
				'group': 'HIJK',
				'groupObj': 'H-K'
			},{
				'group': 'LMNOPQRS',
				'groupObj': 'L-S'
			},{
				'group': 'TUVWXYZ',
				'groupObj': 'T-Z'
			}
			]
			var provinceArr = geoDefault ||ES.consts.china_province
			if (config.countryId == 212) {
				provinceArr = geoDefault || ES.consts.indonesia_province
			}
			var split = function (classify,groupObj) {
				out.push('<dt class="clear">' + groupObj + '</dt><dd>')
				ES.each(res.children, function(_, v) {
					if (classify.indexOf(v.nameEN.substr(0,1).toUpperCase()) >= 0) {
						if (selectedId && v.id == selectedId) {
							out.push('<span data-value="' + v.id + '" class="selected">' + v.name + '</span>')
							displayValue[selectIndex] = v.name;
						} else{
							out.push('<span data-value="' + v.id + '">' + v.name + '</span>')
						}
					}
				})
				out.push('</dd>')
			}
			ES.each(provinceArr,function(_,item){
				common.push('<span data-value="' + item.id + '">' + item.name + '</span>')
			})
			ES.each(groupArr,function (_,item) {
				split(item.group,item.groupObj)
			})
			out.push('</dl>')
			if(level == 1){
				tab_panel.set_panel_dom(level + 1, out.join(''))
				tab_panel.set_panel_dom(level, common.join(''))
			} else {
				tab_panel.set_panel_dom(level, out.join(''))
			}
			var value = ES.get("#"+ret.id).val().trim()
			if(selectedId){
				ES.get("#"+ret.id).val(displayValue.join('-')).data('value', selectId)
			}
			ret.el.trigger('change')
			var id = '#' + tab_panel.id + ' .panel';

			ES.get('#' + tab_panel.id + ' .panel').eq(level).unbind().bind('click', function(e) {
				var span
				if(e.target.nodeName.toLowerCase() == 'span'){
					span = $(e.target)
				}else{
					return
				}
				var dataValue = span.data('value')
				var lev = span.closest('.panel').index()
				var spanArr1 = span.parents(id).parent().children(id).eq(1).find('span')
				var spanArr2 = span.parents(id).parent().children(id).eq(2).find('span')
				span.parents(id).find('span').removeClass('selected')
				//省份的select同步
				if (lev == 1 || lev == 2){
					var spanSelect = function(spanArrI){
						ES.each(spanArrI,function(i,item){
							if (ES.get(item).data('value') == dataValue){
								ES.get(item).parents(id).find('span').removeClass('selected')
								ES.get(item).addClass('selected')
							}
						})
					}
					spanSelect(spanArr1)
					spanSelect(spanArr2)
					if (spanArr1.parent().find('.selected').data('value') != spanArr2.parent().find('.selected').data('value')) {
						spanArr1.parent().find('.selected').removeClass('selected')
					}
				} else{
					span.addClass('selected')
				}
				var drop = span.closest('.input-geo-drop')
				var len = ES.get("#"+ret.id+"-drop .tab-v-panels div.panel").length;
				//var index = $(this).parents(id).index()+1;

				var get_selected_string = function(drop) {
					var list = drop.find('.selected')
					var res = []
					ES.each(list, function(_, v) {
						var items = ES.get(list[_]).html();
						if($.inArray(items,res) == -1) {
							res.push($(v).html())
						}
					})
					return res.join(' - ')
				}
				if (lev <= 1) {
					lev += 2
				} else {
					lev = (+lev) + 1
				}
				for (var i = lev; i<len ;i++){
					ES.get("#"+ret.id+"-drop .tab-v-panels div.panel").eq(i).html("");
				}
				ES.get('#' + drop.data('value')).val(get_selected_string(drop)).data('value', dataValue)
				if (lev >= lenList) {
					ret.el.trigger('change')
					drop.hide()
					if(config.callback) config.callback()
					return
				}
				var tab_panel = ES.ui.get(drop.attr('id'))
				filter_geo(tab_panel, lev, dataValue, null, null, geoDefault)
			})
			ES.get('#' + tab_panel.id + ' .tab').eq(0).hide()
		})
	}
	ES.get('#' + ret.id).unbind().on('click', function(e) {
		//geo BUG临时方案
		if(ES.get(".input-geo-drop .tab-v-panels").length>0){
			ES.get(".input-geo-drop .tab-v-panels").find(".panel").eq(5).html("")
			ES.get(".input-geo-drop .tab-v-panels").find(".panel").eq(4).html("")
			ES.get(".input-geo-drop .tab-v-panels").find(".panel").eq(3).html("")
		}
		isLoad = ES.get("#"+ret.id+"-drop").css("display").indexOf("none") >= 0;
		if (ES.get(this).hasClass('disabled')) {
			e.preventDefault()
			return false
		}
		show_geo.apply(this)
		var el = ES.ui.get($(this).attr('id') + '-drop')
		displayValue = [];
		var isDefault = true;
		ES.each(displayList,function(_,v){
			var q = null;
			if(_ > 0){
				q = displayList[_-1].id
			}
			if(v.id && v.id != ""){
				filter_geo(el,_,q,v.id,_, config.geoDefault)
				filter_geo(el,_+1,v.id,_,null, config.geoDefault)
				if (_ == 0){
					filter_geo(el,_+2,v.id,_,null, config.geoDefault)
				}
				selectId = v.id
				isDefault = false;
			}
		})
		if(isDefault){
			filter_geo(el, 0, null, null, null, config.geoDefault)
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'geo_selector'
	ret.get_value = function() {
		return +this.el.data('value')
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_value = function(v) {
		return this.el.data('value', v)
	}
	ret.set_display_value = function(v) {
		this.el.val(v)
		if(this.el.hasClass('change-input')) this.el.trigger('change')
		return this.el
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}

	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.input_form = function(config) {
	var es_input_form = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		var id = '#' + conf.el
		var el = $(id)
		el.addClass('form-wrap')
		var items_dom = el.children()
		var items = []
		var item_index = 0
		$.each(items_dom, function(i, v) {
			if ('input' != v.tagName.toLowerCase() &&
				'textarea' != v.tagName.toLowerCase() &&
				'select' != v.tagName.toLowerCase()){

				return true
			}
			conf.items[item_index].el = $(v).attr('id')
            console.log(conf.items[item_index].el)
			var input
			if (conf.items[item_index].type == 'multi_select_normal') {
				input = ES.ui.input_multi_select_normal(conf.items[item_index])
			}else if (conf.items[item_index].type == 'multi_select') {
				input = ES.ui.input_multi_select(conf.items[item_index])
			}else if(conf.items[item_index].type == 'multiselect') {
				input = ES.ui.input_multiselect(conf.items[item_index])
			}else if (conf.items[item_index].type == 'select') {
				input = ES.ui.select(conf.items[item_index])
			}else if (conf.items[item_index].type == 'radio') {
				input = ES.ui.radio(conf.items[item_index])
			// }else if (conf.items[item_index].type == 'checkbox') {
				// input = ES.ui.checkbox(conf.items[item_index])
			} else if (conf.items[item_index].type == 'geo') {
				input = ES.ui.geo_selector(conf.items[item_index])
			} else if (conf.items[item_index].type == 'geo_v2') {
				input = ES.ui.geo_selector_v2(conf.items[item_index])
			} else if (conf.items[item_index].type == 'geo_v3') {
				input = ES.ui.geo_selector_v3(conf.items[item_index])
			} else if (conf.items[item_index].type == 'port') {
				input = ES.ui.input_port(conf.items[item_index])
			}  else if (conf.items[item_index].type == 'port_multiple') {
				input = ES.ui.input_port_multiple(conf.items[item_index])
			} else if (conf.items[item_index].type == 'filter') {
				input = ES.ui.input_filter(conf.items[item_index])
			} else if (conf.items[item_index].type == 'qty') {
				input = ES.ui.input_qty(conf.items[item_index])
			} else if (conf.items[item_index].type == 'date_time') {
				input = ES.ui.input_date_time(conf.items[item_index])
			} else if (conf.items[item_index].type == 'time') {
				input = ES.ui.input_time(conf.items[item_index])
			} else if (conf.items[item_index].type == 'file') {
				input = ES.ui.file(conf.items[item_index])
			} else if (conf.items[item_index].type == 'btn') {
				input = ES.ui.button(conf.items[item_index])
			} else if (conf.items[item_index].type == 'date_input') {
				input = ES.ui.input_date_input(conf.items[item_index])
			} else if (conf.items[item_index].type == 'date_input_time') {
				input = ES.ui.input_date_input_time(conf.items[item_index])
			} else if (conf.items[item_index].type == 'year_month') {
				input = ES.ui.input_year_month(conf.items[item_index])
			} else if (conf.items[item_index].type == 'lcl_filter') {
				input = ES.ui.lcl_input_filter(conf.items[item_index])
			} else {
				input = ES.ui.input(conf.items[item_index])
			}
			items.push(input)
			item_index++
		})
		this.id = conf.el
		this.customer_validate = conf.validate
		this.validate = function() {
			this.clear_invalid()
			var result = true
			for (var i = 0; i < this.items.length; i++) {
				if(this.items[i].msg_type=='popup-tips'){
					if(!this.items[i].validate()){
						result = false
						break;
					}
					result = true
				} else {
					result =  this.items[i].validate() && result
				}
			}
			if (result && this.customer_validate) {
				result = this.customer_validate()
			}
			return result
		}
		this.clear_invalid = function() {
			for (var i = 0; i < this.items.length; i++) {
				this.items[i].clear_invalid()
			}
		}
		this.get_value = function() {
			var res = {}
			for (var i = 0; i < this.items.length; i++) {
				var name = this.items[i].el.attr('name')
				if (!name) {
					name = this.items[i].id
				}
				if (!name) {
					continue
				}
				if(this.items[i].etype == 'input_date_input'){
					res = ES.util.merge(res,this.items[i].get_value())
				}else{
					res[name] = this.items[i].get_value()
				}
			}
			return res
		}
		this.set_value = function(obj) {
			for (var i = 0; i < this.items.length; i++) {
				var name = this.items[i].el.attr('name')
				if (!name) {
					name = this.items[i].id
				}
				var inputType = ES.get(this.items[i].el).attr("type")
				if(inputType == "checkbox" || inputType == "radio" ){
					ES.get(this.items[i].el).prop("checked",obj[this.items[i].el.attr('name') || this.items[i].id])
				}else if(this.items[i].etype == 'input_date_input'){
					var to_el = this.items[i].toName
					if(obj[name] && obj[to_el]){
						var dateVal = {}
						dateVal[name] = obj[name]
						dateVal[to_el] = obj[to_el]
						this.items[i].set_value(dateVal)
					}
				}else if (obj[name] || obj[name]===0){
					this.items[i].set_value(obj[name])
				}
			}
		}
		this.clear_value = function() {
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i]
				var type = item.el.attr('type')
				if(type == 'checkbox'){
					item.el.attr('checked', false)
				} else {
					item.clear_value()
				}

			}
		}
		this.get_item = function(index) {
			return this.items[index]
		}
		this.get_item_by_id = function(id) {
			var res = null
			ES.each(this.items, function(_, v) {
				if (v.el.attr('name') == id || v.id == id) {
					res = v
					return false
				}
			})
			return res
		}
		this.disable = function() {
			for (var i = 0; i < this.items.length; i++) {
				if (!this.items[i].disable) {
					continue
				}
				this.items[i].disable()
			}
		}
		this.enable = function() {
			for (var i = 0; i < this.items.length; i++) {
				if (!this.items[i].enable) {
					continue
				}
				this.items[i].enable()
			}
		}
		this.items = items
		this.el = el
		this.etype = 'input_form'
	}
	var ret = new es_input_form(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.button = function(config) {
	var es_button = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		conf.text = conf.text || ''
		var id = '#' + conf.el
		var el = $(id)
		el.addClass('btn').attr('href', 'javascript:void(0)').html(conf.text)
		if (conf.cls) {
			el.addClass(conf.cls)
		}
		if (conf.onclick) {
			el.on('click', conf.onclick)
		}
		this.id = conf.el
		this.el = el
		this.etype = 'button'
	}
	var ret = new es_button(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.input_qty = function(config) {
	var es_input_qty = function(conf) {
		conf = conf || {}
		conf = ES.util.merge({
			max_value: 99999,
			min_value: 0,
			validate: function() {
				var v = +this.get_value()
				return v <= this.max_value && v >= this.min_value
			}
		}, conf)
		if (!conf.el){
			return
		}
		conf.text = conf.text || ''
		var id = '#' + conf.el
		var el = $(id)

		var cls = conf.cls ? conf.cls : ''
		el.addClass('input-qty').wrap("<div class='wrap input-wrap  " + cls + "'></div>")

		var label = conf.label
		var after_labels = conf.after_labels
		var nonempty = conf.nonempty ? conf.nonempty : false
		var parent = el.parent()

		if (label) {
			if (nonempty) {
				label = '<span class="nonempty">*</span>' + label
			}
			if (el.attr('type') != 'checkbox' && el.attr('type') != 'radio') {
				parent.prepend(ES.util.format_string(ES.tpl.label_tpl, {
					display: label,
					id: conf.el
				}))
			} else {
				parent.append(ES.util.format_string(ES.tpl.label_tpl, {
					display: label,
					id: conf.el
				}))
			}
		}

		var minus = '<button class="input-qty-minus" type="button">−</button>'
		var plus = '<button class="input-qty-plus" type="button">+</button>'

		el.parent().prepend(minus).append(plus)

		if (after_labels) {
			ES.each(after_labels, function(_, v) {
				parent.append('<span class="input-content">' + v + '</span>')
			})
		}

		el.parent().children('.input-qty-minus').on('click', function() {
			var qty = $(this).parent().children('.input-qty')
			if (+qty.val() <= 0) {
				return false
			}
			qty.val(+qty.val() - 1)
			ES.event.fire(qty.attr('id'), 'change', qty.val())
			qty.trigger("change");
		})
		el.parent().children('.input-qty-plus').on('click', function() {
			var qty = $(this).parent().children('.input-qty')
			qty.val(+qty.val() + 1)
			ES.event.fire(qty.attr('id'), 'change', qty.val())
			qty.trigger("change");
		})
		el.on('change', function(e) {
			var v = +$(this).val()
			v = Math.ceil(v)
			var comp = ES.ui.get(e.target.id)
			var change_val = v
			if (!$.isNumeric(v) || v < comp.min_value) {
				$(this).val(comp.min_value)
				change_val = comp.min_value
				e.preventDefault()
			}
			else if (v > comp.max_value) {
				$(this).val(comp.max_value)
				change_val = comp.max_value
				e.preventDefault()
			} else {
				$(this).val(v)
			}
			ES.event.fire($(this).attr('id'), 'change', change_val)
		})

		this.get_value = function() {
			var v = +(this.el.val())
			if (!$.isNumeric(v) || v < this.min_value) {
				v = this.min_value
			}
			return v
		}
		this.set_value = function(v) {
			var v = +v
			if (!$.isNumeric(v) || v < this.min_value) {
				v = this.min_value
			}
			return this.el.val(v)
		}
		this.clear_value = function() {
			return this.el.val('')
		}
		this.disable = function() {
			this.el.parent().children().attr('disabled', true)
		}
		this.enable = function() {
			this.el.parent().children().attr('disabled', false)
		}
		this.nonempty = nonempty
		this.msg = config.msg
		this.customer_validate = conf.validate
		this.validate = function() {
			this.clear_invalid()
			var result = true
			if (this.nonempty && !this.get_value()) {
				this.set_msg(this.msg)
				result = false
			}
			if (result && this.customer_validate) {
				result = this.customer_validate()
			}
			return result
		}

		this.clear_invalid = function() {
			var tip_msg = this.el.closest('div').find('.msg-tip')
			if (tip_msg.length > 0){
				tip_msg.remove()
			}
			this.el.removeClass('es-input-invalid')
			this.el.parent().children('.msg').empty().removeClass('error').hide()
		}

		this.set_msg = function(msg) {
			this.msg = msg
			if (conf.msg_type && conf.msg_type == 'tips') {
				var tips = '<div class="msg-tip error">' + msg + '</div>'
				ES.get(tips).insertBefore(this.el)
			} else{
				this.el.parent().children('.msg').addClass('error').html('<i class="fa fa-times-circle"></i> ' + msg).show()
			}
		}

		this.max_value = +conf.max_value
		this.min_value = +conf.min_value
		this.id = conf.el
		this.el = el
		this.etype = 'input_qty'
	}
	var ret = new es_input_qty(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.tab_h = function(config) {
	var es_tab_h = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		var id = "#" + conf.el
		var el = $(id)
		var tpl = ES.tpl.tab_h_tpl
		var template = Handlebars.compile(tpl)
		conf.tabs[0].cls = "current"
		var html = template(conf);
		el.append(html)
		this.id = conf.el
		this.el = el
		this.etype = 'tab_h'

		ES.get(id + ' .tab').on('click', function() {
			var last_index = $(this).parent().children('.current').data().index
			$(this).parent().children().removeClass('current')
			var index = $(this).addClass('current').data().value
			var list = ES.get(id + ' .panel')
			list.hide()
			list.eq(+index).show()
			ES.event.fire(conf.el, 'tab-change', [list.eq(+last_index), list.eq(+index)])
		})

		ES.get(id + ' .panel').eq(0).show()
	}
	var ret = new es_tab_h(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.tab_v = function(config) {
	var es_tab_v = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		var id = "#" + conf.el
		var el = $(id)
		var tpl = ES.tpl.tab_v_tpl
		var template = Handlebars.compile(tpl)
		conf.tabs[0].cls = "current"
		var html = template(conf);
		el.append(html)
		this.id = conf.el
		this.el = el
		this.etype = 'tab_v'

		ES.get(id + ' .tab').on('click', function() {
			var last_index = $(this).parent().children('.current').data().index
			$(this).parent().children().removeClass('current')
			var index = $(this).addClass('current').data().index
			var list = ES.get(id + ' .panel')
			list.hide()
			list.eq(+index).show()
			ES.event.fire(conf.el, 'tab-change', [list.eq(+last_index), list.eq(+index)])
		})

		ES.get(id + ' .panel').eq(0).show()

		this.set_panel_dom = function(index, dom) {
			var id = '#' + this.id
			ES.get(id + ' .panel').eq(index).html(dom)
		}

		this.set_panel = function(index) {
			var id = '#' + this.id
			ES.get(id + ' .tab').eq(index).trigger('click')
		}
	}
	var ret = new es_tab_v(config)
	ret.len = config.tabs.length;
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.date_selector = function(config) {
	var es_date_selector = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		var id = "#" + conf.el
		var el = $(id)
		var d = config.date
		if (!d) {
			d = ES.util.new_date()
		}
		this.el = el
		this.id = conf.el

		this.set_date = function(d) {
			var sel_index = this.el.children('.date-selector').children('ul').children('li.date-selector-selected').index()
			if (sel_index < 0) {
				sel_index = 4
			}
			sel_index--

			this.el.empty()

			var tpl = ES.tpl.date_selector
			var template = Handlebars.compile(tpl);

			var day_of_week = d.getDay()
			d.addDate(0 - day_of_week)
			d.addDate(0 - (7 * sel_index + 1))

			var total_width = this.el.width()
			var avg_width = (total_width - 11 - 30) / 7

			var date = []

			date.push({
				cls: 'date-selector-item-arrow',
				style: 'width:15px;',
				parent: this.id,
				value: ES.util.date_to_string(d),
				content: '<i class="fa fa-caret-left"></i>'
			})
			for (var i = 0; i < 7; i++) {
				d.addDate(1)
				var value = ES.util.date_to_string(d)
				var date_display = ES.util.date_to_string(d, '{{m}}/{{d}}')
				d.addDate(6)
				date_display += ' - ' + ES.util.date_to_string(d, '{{m}}/{{d}}')
				date.push({
					cls: '',
					style: 'width:' + avg_width + 'px;',
					parent: this.id,
					value: value,
					content: date_display
				})
			}
			d.addDate(1)
			date.push({
				cls: 'date-selector-item-arrow',
				style: 'width:15px;',
				parent: this.id,
				value: ES.util.date_to_string(d),
				content: '<i class="fa fa-caret-right"></i>'
			})

			var html = template({
				date: date
			})
			el.append(html)

			this.el.children('.date-selector').children('ul').children('li').on('click', function() {
				var obj = $(this)
				var index = obj.index()
				var parent = obj.data().parent
				var d = obj.data().value
				if (!obj.hasClass('date-selector-item-arrow')) {
					ES.ui.get(parent).set_current(index - 1)
				} else {
					d = new Date(obj.parent().children('.date-selector-selected').data().value)
					if (index == 0) {
						d.addDate(-49)
					} else {
						d.addDate(49)
					}
					ES.ui.get(parent).set_date(d)
				}
			})

			this.set_current(sel_index)
		}
		this.set_current = function(index) {
			var li = this.el.children('.date-selector').children('ul').children('li').removeClass('date-selector-selected').eq(index + 1).addClass('date-selector-selected')
			ES.event.fire(this.id, 'change', li.data().value)
		}
		this.set_date(config.date)
	}
	var ret = new es_date_selector(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.paging = function(config) {
	var pageSize = $.cookie('pageSize')
	var setCookie = !pageSize ? false : true
	if (!pageSize){
		pageSize = 25
	}
	ES.pageSize = pageSize
	var es_paging = function(conf) {
		conf = conf || {}
		if (!conf.el){
			return
		}
		var id = "#" + conf.el
		var el = $(id)

		this.el = el
		this.el.addClass('paging')
		this.id = conf.el
		this.show_per_page = conf.perPage || true

		this.refresh = function(total_page, page, total_count) {
			this.current = page
			var paging = $('#' + this.id)
			var from = page - 2
			var end = page + 2
			if (from <= 0) {
				from = 1
				end = from + 4
			}
			if (end > total_page) {
				end = total_page
				from = total_page - 4
			}
			if (from <= 0) {
				from = 1
			}
			if (total_count <= 0) {
				paging.empty()
				return
			}
			var itemTpl = '<a class="paging-item" href="javascript:void(0)" title="{{title}}" data-value="{{value}}" data-parent="{{parent}}">{{display}}</a>'
			paging.empty()
			var inner = []
			if (page > 1) {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-first"><i class="fa fa-angle-double-left"></i></span>',
					value: 1,
					title: 'Page ' + (1),
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span><i class="fa fa-angle-left"></i></span>',
					value: page - 1,
					title: 'Page ' + (page-1),
					parent: this.id
				}))
			} else {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled paging-first"><i class="fa fa-angle-double-left"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled"><i class="fa fa-angle-left"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
			}
			for (var i = from - 1; i < end; i++) {
				var item = '<span>' + (i + 1) + '</span>'
				if (i + 1 === page) {
					item = '<span class="paging-current">' + (i + 1) + '</span>'
				}
				inner.push(ES.util.format_string(itemTpl, {
					display: item,
					value: i + 1,
					title: 'Page ' + (i+1),
					parent: this.id
				}))
			}
			if (page < end) {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span><i class="fa fa-angle-right"></i></span>',
					value: page + 1,
					title: 'Page ' + (page+1),
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-last"><i class="fa fa-angle-double-right"></i></span>',
					value: total_page,
					title: 'Page ' + (total_page),
					parent: this.id
				}))
			} else {
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled"><i class="fa fa-angle-right"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
				inner.push(ES.util.format_string(itemTpl, {
					display: '<span class="paging-disabled paging-last"><i class="fa fa-angle-double-right"></i></span>',
					value: -1,
					title: '',
					parent: this.id
				}))
			}
			inner.push('<span class="paging-info"> ' + ES.msg.get('common_paging_recordnum', {arg0: ' ' + total_count + ' '}) + ' / ' + total_page + ' ' + ES.msg.get('common_paging_pagenum') + '</span>')
			if(this.show_per_page){
				inner.push('&nbsp;<span class="paging-info"> ' + ES.msg.get('per_page') +'：<a>25</a>，<a>50</a>，<a>100</a></span>')
			}
			paging.html(inner.join(''));
			$('#' + this.id + ' .paging-item').click(function() {
				var page = $(this).data('value')
				var id = $(this).data('parent')
				if (page > 0) {
					ES.event.fire(id, 'change', page)
				}
			})
			if(this.show_per_page){
				var set_pagesize_link = $('#' + this.id + ' .paging-info a')
				set_pagesize_link.each(function(_,v){
					if(ES.get(v).html() == ES.pageSize){
						ES.get(v).addClass('active')
					}
				})
				set_pagesize_link.click(ES.delegate(function(e) {
					var pageSize = $(e.target).html()
					ES.pageSize = pageSize
					$.cookie('pageSize', ES.pageSize, {
						expires: 365,
						path: '/'
					})
					ES.event.fire(this.id, 'change', 1)
				},this))
			}
		}
		this.current = 1
	}
	var ret = new es_paging(config)
	ES.ui.add(ret.id, ret)
	return ret
}

ES.ui.map = function(el, res, mapType) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=GOEGRcwYZBAXOlU7a0bwf9DV&callback=trackingCallback";
	document.body.appendChild(script);
	var data=res.movements;
	window.trackingCallback = function() {
		var map = new BMap.Map(el);
		if(mapType != 'current_position'){
			map.addControl(new BMap.ScaleControl({
				anchor: BMAP_ANCHOR_TOP_LEFT
			}))
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.NavigationControl({
				anchor: BMAP_ANCHOR_TOP_RIGHT,
				type: BMAP_NAVIGATION_CONTROL_SMALL
			}))
			map.addControl(new BMap.MapTypeControl({
				anchor: BMAP_ANCHOR_BOTTOM_RIGHT
			}));
		}

		var pointList = []
		for (var i = 0; i < data.length; i++) {
			var point = new BMap.Point(data[i].shipLongitude, data[i].shipLatitude)
			pointList.push(point)
		}
		var fromPoint = new BMap.Point(data[0].shipLongitude, data[0].shipLatitude)

		var myIcon = new BMap.Icon("/common/img/startingPoint.png", new BMap.Size(30,50));
		var fromMarker = new BMap.Marker(fromPoint,{icon:myIcon,offset:new BMap.Size(0, -30) });
		map.addOverlay(fromMarker);

		var currentPoint = new BMap.Point(data[data.length-1].shipLongitude, data[data.length-1].shipLatitude)
		var vectorFCArrow = new BMap.Marker(new BMap.Point(currentPoint.lng-0.01,currentPoint.lat), {
			// 初始化方向向上的闭合箭头
			icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
				scale: 1.5,
				strokeWeight: 1,
				rotation: data[data.length-1].vesselHead,//顺时针旋转30度
				fillColor: 'red',
				fillOpacity: 0.8
			})
		});
		map.addOverlay(vectorFCArrow);

		var temp ='<table style="font-size: 13px;text-align: left" class="map-table">'+
			'<tr><td>'+ES.msg.get('call_sign')+'：{{{callNo}}}</td><td>'+ES.msg.get('bow_to')+'：{{{vesselHead}}}℃</td></tr>'+
			'<tr><td>MMSI：{{{mmsi}}}</td><td>'+ES.msg.get('track_direction')+'：{{{vesselCourse}}}℃</td></tr>'+
			'<tr><td>IMO：{{{imo}}}</td><td>'+ES.msg.get('speed')+'：{{{vesselSpeed}}}kn</td></tr>'+
			'<tr><td>'+ES.msg.get('carrier')+'：{{{company}}}  </td><td>'+ES.msg.get('latitude')+'：{{{shipLatitude}}}</td></tr>' +
			'<tr><td>'+ES.msg.get('english_name')+'：{{{nameEn}}}    </td><td>'+ES.msg.get('longitude')+'：{{{shipLongitude}}}</td></tr>' +
			'<tr><td> '+ES.msg.get('chinese_name')+'：{{{nameCn}}}</td><td>'+ES.msg.get('fnd')+'：{{{etaPortName}}}</td></tr>'+
			'<tr><td>'+ES.msg.get('beam')+'：{{{width}}}m      </td><td>'+ES.msg.get('last_time')+'：{{{vesselPositionTime}}}</td></tr>' +
			'<tr><td>  '+ES.msg.get('ship_length')+'：{{{length}}}m</td></tr>'+
			'</table>'

		var infoWindow = new BMap.InfoWindow(Handlebars.compile(temp)(ES.util.merge(res,data[data.length-1])), {
			minWidth :300,     // 信息窗口宽度
			minHeight: 140,     // 信息窗口高度
			enableMessage:false//设置允许信息窗发送短息
		});  // 创建信息窗口对象
		map.openInfoWindow(infoWindow,currentPoint); //开启信息窗口
		vectorFCArrow.addEventListener("click", function(){
			map.openInfoWindow(infoWindow,currentPoint);
		})

		var middlePoint = pointList[Math.floor(data.length / 2)];
		//var opts = {
		//	position :   new BMap.Point(middlePoint.lng,middlePoint.lat+9),    // 指定文本标ox注所在的地理位置
		//	offset   : new BMap.Size(30, -30)    //设置文本偏移量
		//}
		//var label = new BMap.Label("欢迎使用百度地图，<br/>这是一个简单的文本标注哦~", opts);  // 创建文本标注对象
		//label.setStyle({
		//	fontSize : "12px",
		//	height : "100px",
		//	lineHeight : "20px",
		//	fontFamily:"微软雅黑"
		//});
		//map.addOverlay(label);

		//fromMarker.addEventListener("click", function(){
		//	var opts = {
		//		width : 200,     // 信息窗口宽度
		//		height: 100,     // 信息窗口高度
		//		title : "测试标题" , // 信息窗口标题
		//		enableMessage:false//设置允许信息窗发送短息
		//	}
		//	var infoWindow = new BMap.InfoWindow("测试<div style='color: red'>信息</div>", opts);  // 创建信息窗口对象
		//	map.openInfoWindow(infoWindow,fromPoint); //开启信息窗口
		//});
		map.centerAndZoom(middlePoint, 5);
		map.enableScrollWheelZoom();
		var polyline = new BMap.Polyline(pointList);
		map.addOverlay(polyline);
		window.trackingCallback = null
		delete window.trackingCallback
	}
}
ES.ui.newMap = function(el, result) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=GOEGRcwYZBAXOlU7a0bwf9DV&callback=trackingCallback";
	document.body.appendChild(script);
	var data=result.movements;
	var res = result.vesselTraceInfoDto

	window.trackingCallback = function() {
		//坐标转换完之后的回调函数
		var translateCallback = function (data){
			if(data.status === 0) {
				var currentPoint = data.points[0];
				var map = new BMap.Map(el);
				var vectorFCArrow = new BMap.Marker(new BMap.Point(currentPoint.lng-0.01,currentPoint.lat), {
					// 初始化方向向上的闭合箭头
					icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
						scale: 1.5,
						strokeWeight: 1,
						rotation: res.heading,//顺时针旋转30度
						fillColor: 'red',
						fillOpacity: 0.8
					})
				});
				map.addOverlay(vectorFCArrow);
				var temp ='<table style="font-size: 13px;text-align: left" class="map-table">'+
					'<tr><td>'+ES.msg.get('english_name')+'：{{{name}}} </td><td>MMSI：{{{MMSI}}}</td></tr>'+
					'<tr><td> '+ES.msg.get('chinese_name')+'：{{{cnName}}}</td><td>IMO：{{{IMO}}}</td></tr>'+
					'<tr><td>'+ES.msg.get('call_sign')+'：{{{callSign}}}</td><td>'+ES.msg.get('latitude')+'：{{{lat}}}</td></tr>'+
					'<tr><td>'+ES.msg.get('nation_owner')+'：{{{nationAndOwner}}}  </td><td>'+ES.msg.get('longitude')+'：{{{lon}}}</td></tr>' +
					'<tr><td>'+ES.msg.get('vessel_type')+'：{{{type}}}    </td><td>'+ES.msg.get('heading_course')+'：{{{headingAndCourse}}}</td></tr>' +
					'<tr><td> '+ES.msg.get('status_speed')+'：{{{statusAndSpeed}}}</td><td>'+ES.msg.get('length_beam')+'：{{{lengthAndBeam}}}</td></tr>'+
					'<tr><td>'+ES.msg.get('fnd')+'：{{{dest}}}      </td><td>'+ES.msg.get('eta')+'：{{{ETA}}}</td></tr>' +
					'<tr><td>'+ES.msg.get('draught')+'：{{{draught}}}      </td><td>'+ES.msg.get('last_time')+'：{{{lastTime}}}</td></tr>' +
					'<tr><td>'+ES.msg.get('gross_ton')+'：{{{grossTon}}}      </td><td>'+ES.msg.get('load_ton')+'：{{{loadTon}}}</td></tr>' +
					'<tr><td>'+ES.msg.get('net_ton')+'：{{{netTon}}}      </td><td>'+ES.msg.get('build_time')+'：{{{buildTime}}}</td></tr>' +
					'</table>'

				var infoWindow = new BMap.InfoWindow(Handlebars.compile(temp)(res, {
					minWidth :300,     // 信息窗口宽度
					minHeight: 140,     // 信息窗口高度
					enableMessage:false//设置允许信息窗发送短息
				}));  // 创建信息窗口对象
				map.openInfoWindow(infoWindow,currentPoint); //开启信息窗口
				vectorFCArrow.addEventListener("click", function(){
					map.openInfoWindow(infoWindow,currentPoint);
				})

				map.centerAndZoom(currentPoint, 6);
				map.enableScrollWheelZoom();
				window.trackingCallback = null
				delete window.trackingCallback
			}
		}
		var convertor = new BMap.Convertor();
		var pointArr = [];
		pointArr.push(new BMap.Point(res.lonConverted, res.latConverted));
		convertor.translate(pointArr, 1, 5, translateCallback)
	}
}

ES.ui.googleMap = function(el, res, mapType){
	var setParameter = function(el, res, mapType){
		window.googleMapData = res;
		window.googleMapEl =el;
		window.googleMapType =mapType;
	}
	if(ES.get("#googleApi").length > 0){
		setParameter(el, res, mapType);
		window.initialize();
		return false
	}
	var script =document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBg9k0ePx3cUAskKJcGmJ9JSkcX2LYz2RU&callback=initialize";
	script.setAttribute("id","googleApi");
	document.body.appendChild(script);
	setParameter(el, res, mapType);
	//创建Map 对象
	window.initialize = function ()
	{
		var mapType = window.googleMapType;
		var res = window.googleMapData;
		var el = window.googleMapEl;
		var defaultLatLng = new google.maps.LatLng(-3.4497912,115.4804679)
		if(!mapType){
			mapType = "TERRAIN";
		}
		var googleMapType = google.maps.MapTypeId[mapType];
		var mapProp = {
			zoom:6,
			mapTypeId:googleMapType,
			center:defaultLatLng
		};
		var map=new google.maps.Map(document.getElementById(el),mapProp);
		function placeMarker(config) {
			var icon = config.icon || ""
			animation = config.animation || "";
			var marker = new google.maps.Marker({
				position: config.location,
				map: config.map,
				icon:icon,
				animation:animation
			});
			var infowindow = new google.maps.InfoWindow({
				content:"<div class='map-infowindow'>"+ config.msg + "</div>"
			});

			infowindow.open(config.map,marker);
			if(config.zoom){
				map.setZoom(config.zoom);
			}
		}
		var geocodeAddress = function (resultsMap,area,isSetCenter,name) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': area}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var position = results[0].geometry.location;
					var LatLng = new google.maps.LatLng(position.lat(),position.lng());
					var content = name || "Delivery addr：" + area;
					var icon = "img/google-map-icon.png";
					if(isSetCenter){
						resultsMap.panTo(LatLng);
					}
					var data = {};
					data.location = LatLng;
					data.map = resultsMap;
					data.icon = icon;
					data.msg = content;
					placeMarker(data);
				} else {
					//find not results
				}
			});
		}
		if(res.marker && res.marker.length > 0){
			ES.each(res.marker,function (_,v) {
				if(v.address){
					geocodeAddress(map,v.address,v.isSetCenter,v.name);
				}else if(v.latitude && v.longitude){
					var LatLng = new google.maps.LatLng(v.latitude,v.longitude);
					var content = v.name;
					var zoom;
					if(v.isSetCenter){
						map.setCenter(LatLng);
						map.panTo(LatLng);
						zoom = 11;
					}
					var markerType = google.maps.Animation.BOUNCE;
					var data = {};
					data.location = LatLng;
					data.animation = markerType;
					data.map = map;
					data.msg = content;
					data.zoom = zoom;
					placeMarker(data);
				}
			});
		}
	}
}


ES.ui.slider = function(id, itemWidth, itemHeight, tailOffset, transType) {
	if(!transType) {
		transType = 'move'
	}
	var ret = {}
	var div = ES.get(id)
	if (!itemWidth) {
		itemWidth = div.width()
	}
	if (!itemHeight) {
		itemHeight = div.height()
	}
	if (!tailOffset) {
		tailOffset = 0
	}
	var itemCount = div.children('.slider-inner').children('.slider-tab').length
	ret.id = id
	ret.width = itemWidth
	ret.height = itemHeight
	ret.offset = tailOffset
	ret.transType = transType
	ret.el = div
	ret.resize = function(width , height) {
		var div = this.el
		var itemHeight = height ? height : this.height
		var itemWidth = width ? width : this.width
		this.itemWidth = itemWidth
		div.css({
			'height': itemHeight + 'px'
		})
		ES.get(id+' .slider-img').css({
			'height': itemHeight + 'px'
		})
		var itemCount = div.children('.slider-inner').children('.slider-tab').css({
			'width': itemWidth + 'px'
		}).length
		width = itemCount * itemWidth
		div.children('.slider-inner').css({
			'width': width + 'px'
		})
		div.children('.slider-controller').css({
			'margin-top': 0 - (itemHeight / 4 * 3) + 'px'
		}).children('span').css({
			'line-height': itemHeight / 2 + 'px'
		})
	}
	ret.resize()

	var pages = []
	for (var i = 0; i < itemCount; i++) {
		pages.push('<span class="slider-selector">&nbsp;</span>')
	}
	div.children('.slider-pages').html(pages.join(''))
	ES.get(id + ' .slider-selector').eq(0).addClass('slider-selected')

	var intveral = null
	var time_span = 5000
	var duration = 'right'
	ret.move = function (index) {
		var itemWidth = this.itemWidth
		if(transType == 'move'){
			div.children('.slider-inner').animate({
				'margin-left': (0 - index) * itemWidth + 'px'
			})
		}
		else if(transType == 'fade') {
			div.children('.slider-inner').fadeOut(function(){
				div.children('.slider-inner').css({
					'margin-left': (0 - index) * itemWidth + 'px'
				}).fadeIn()
			})
		}
		ES.get(id + ' .slider-selector').removeClass('slider-selected').eq(index).addClass('slider-selected')
		intervelSpan()
	}
	var current = 0
	var total = itemCount - 1
	ES.get(id + ' .slider-left').click(function (e) {
		if (current > 0) {
			current--
			ret.move(current)
			duration = 'left'
		}
		e.preventDefault()
		return true
	})
	ES.get(id + ' .slider-right').click(function (e) {
		if (current + tailOffset < total) {
			current++
			ret.move(current)
			duration = 'right'
		}
		e.preventDefault()
		return true
	})
	ES.get(id + ' .slider-selector').click(function (e) {
		var index = ES.get(this).index()
		current = index
		ret.move(current)
		e.preventDefault()
		return false
	})
	var scroll = function () {
		if (duration == 'left') {
			if (current > 0) {
				current--
				ret.move(current)
			}else{

				duration='right'
			}
		}
		else if (duration == 'right') {
			if(current + tailOffset < total){
				current++
				ret.move(current)
			}else{
				duration='left'
			}
		}
		intervelSpan()
	}
	var intervelSpan = function () {
		if (intveral != null) {
			clearTimeout(intveral)
			intveral = null
		}
		intveral = setTimeout(scroll, time_span)
	}
	intervelSpan()
	return ret
}

ES.ui.initSlider = function (id, itemWidth, itemHeight, tailOffset, transType) {
	return ES.ui.slider(id, itemWidth, itemHeight, tailOffset, transType)
}

// 只适用于客户资料维护页面
ES.ui.table_form = function(config) {
	var es_table_form = function(config) {
		config = config || {}
		if (!config.el) {
			return
		}
		this.id = config.el
		this.config = config
		this.el = $('#' + this.id)
		this.heads = config.heads || []
		this.headsLen = this.heads.length
		this.items = config.items || []

		this.init = function() {
			var thList = []
			thList.push('<thead><tr>')

			for(var i = 0; i < this.headsLen; i++) {
				if(i != this.headsLen - 1) {
					var styleStr = ""
					if(this.items[i].width){
                        styleStr="width: "+ this.items[i].width +"px;" + "min-width: "+ this.items[i].width +"px;"+ "max-width: "+ this.items[i].width +"px;"
					}
                    //什么伪操作
                    if (this.items[i].type == 'headCheckbox') {
                        thList.push('<th class="'+(this.items[i].cls=='import-export-toggle'?'title-toggle': this.items[i].cls)+'"  style="'+ styleStr +'"><input type="checkbox" class="all-checkbox-select" /></th>')
					}else{
                        thList.push('<th class="'+(this.items[i].cls=='import-export-toggle'?'title-toggle': this.items[i].cls)+'"  style="'+ styleStr +'">' + this.heads[i] + '</th>')
                    }
				} else {
					thList.push('<th class="oper-th">' + this.heads[i] + '</th>')
				}
			}
			thList.push('</tr></thead><tbody></tbody>')
			this.el.html(thList.join(''))
		}

		this._add_select = function(data, checked, cls){
			var selectItem = []
			ES.each(data || [], function (index, item) {
				if (checked && checked == item.value) {
					selectItem.push('<option value="' + item.value + '" selected=true>' + item.display + '</option>')
				} else {
					selectItem.push('<option value="' + item.value + '">' + item.display + '</option>')
				}
			})
			return '<td><select class="table-select ' + (cls || '') + '" type="text">' + selectItem.join('') + '</select></td>'
		}
		var select2config = {
			language: {
				errorLoading: function () {
					return ES.msg.get('errorLoading')
				},
				inputTooLong: function (args) {
					var overChars = args.input.length - args.maximum
					var message = ES.msg.get('input_too_long', {overChars: ' ' + overChars + ' '})
					return message
				},
				inputTooShort: function (args) {
					var remainingChars = args.minimum - args.input.length
					var message = ES.msg.get('input_too_short', {overChars: ' ' + remainingChars + ' '})
					return message
				},
				loadingMore: function () {
					return ES.msg.get('loading_more')
				},
				maximumSelected: function (args) {
					var message = ES.msg.get('maximum_selected', {number: ' ' + args.maximum + ' '})
					return message
				},
				noResults: function () {
					return ES.msg.get('result_not_found')
				},
				searching: function () {
					return ES.msg.get('searching')
				}
			}
		}
		this.add_row = function(rowData) {
			var items = this.items
			if(this.el.find('thead').length === 0) {
				this.init()
			} else if(this.el.find('tbody tr').length === 0) {
				this.el.find('thead').show()
			}
			var tdList = []
			if (rowData) {
				tdList.push('<tr data-value="' + rowData.id + '">')

				for (var i = 0, len = this.headsLen - 1; i < len; i++) {
                    if (this.items[i].type == 'headCheckbox') {
                        tdList.push('<td class="' + (this.items[i].tdCls || '') + ' "><input type="checkbox" class="checkbox-select-item" /></td>')
                    }else if (this.items[i].type == 'select') {
						tdList.push(this._add_select(this.items[i].data, rowData[this.items[i]['attr']], this.items[i].cls))
					} else if(this.items[i].type == 'datetime'){
                        tdList.push('<td><input type="text" class="renderDatetime ' + (this.items[i].cls || '') + ' "  ' + (this.items[i].readonly ? 'readonly' : '') + '  value="' + formatEmptyVal(rowData[this.items[i]['attr']]) + '"/><div class="after_label">' + (this.items[i].after_label || '') + '</div></td>')
                    }else if(this.items[i].type == 'text'){
                        tdList.push('<td class="' + (this.items[i].tdCls || '') + ' "><span>' + formatEmptyVal(rowData[this.items[i]['attr']]) + '</span></td>')
                    } else {
						if(this.items[i].render){
                            tdList.push('<td class="' + (this.items[i].tdCls || '') + ' "><span>' + this.items[i].render(rowData) + '</span></td>')
						}else{
                            tdList.push('<td><input type="text" class="' + (this.items[i].cls || '') + ' "  ' + (this.items[i].readonly ? 'readonly' : '') + '  value="' + formatEmptyVal(rowData[this.items[i]['attr']]) + '"/><div class="after_label">' + (this.items[i].after_label || '') + '</div></td>')
						}
					}
				}
			} else {
				tdList.push('<tr>')
				for (var i = 0, len = this.headsLen - 1; i < len; i++) {
					if (this.items[i].type == 'headCheckbox') {
						tdList.push('<td class="' + (this.items[i].tdCls || '') + ' "><input type="checkbox" class="checkbox-select-item" /></td>')
					}else if (this.items[i].type == 'select') {
						tdList.push(this._add_select(this.items[i].data, null, this.items[i].cls))
					} else {
						tdList.push('<td><input type="text" class="' + (this.items[i].cls || '') + ' "  ' + (this.items[i].readonly ? 'readonly' : '') + ' /><div class="after_label">' + (this.items[i].after_label || '') + '</div></td>')
					}
				}
			}
			tdList.push('<td class="oper-th"><a class="tr-delete">'+ES.msg.get('delete')+'</a></td>')
			tdList.push('</tr>')

			this.el.find('tbody').append(tdList.join(''))
            // 中文显示
            var configCn = {
                dateFormat: 'yy-mm-dd',
                yearSuffix: '年',
                monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
                dayNamesMin: ['日','一','二','三','四','五','六']
            }
            ES.get('.renderDatetime').datetimepicker(ES.util.merge({
                dateFormat: "yy-mm-dd",
                onClose: function(text){},
                timeText: ES.msg.get('timepicker_timeText'),
                closeText: ES.msg.get('timepicker_closeText'),
                currentText: ES.msg.get('timepicker_currentText'),
                timeFormat: 'HH:mm:ss',
                controlType: 'select',
                oneLine: true,
            },configCn))

            var _this = this
            ES.get(this.el).on('click', '.all-checkbox-select', function () {
                if (ES.get(this).is(':checked')) {
                    ES.get(_this.el).find('.checkbox-select-item').prop('checked', true)
                } else {
                    ES.get(_this.el).find('.checkbox-select-item').prop('checked', false)
                }
            })
            ES.each(this.el.find('tbody tr:last').find('.table-select'), function (index, item) {

				var idx = $(item).parent().index()
				if(items[idx].defaultEmpty){
					$(item).val('')
				}
				if(items[idx].onChange){
					$(item).bind('change', function () {
						items[idx].onChange.call(this)
					})
				}

				if($(item).hasClass('select-editable')){
					select2config = ES.util.merge(select2config, {
						// tags: true
					})
				}

				var select2 = $(item).select2(select2config)
				if(rowData){
					select2.val(rowData[items[idx].attr]).trigger('change')
				}
			})
		}
		this.set_value = function (data) {
			data = data || []
			for(var i = 0, len = data.length; i < len; i++){
				this.add_row(data[i])
			}
			/*if (data.length === 0){
			 this.add_row()
			 }*/
		}
		this.delete_row = function(targetTr) {
			targetTr.remove()
			// 如果表格中没有内容， 隐藏表头
			//if(this.el.find('tbody tr').length === 0) {
			//	this.el.find('thead').hide()
			//}
		}
		this.get_value = function () {
			var trList = this.el.find('tbody tr')
			var tdList,
				result,
				obj
			result = []
			$.each(trList, function(_, trObj) {
				obj = {}
				obj.id = $(trObj).data().value
				tdList = $(trObj).find('td')
				tdList.splice(tdList.length - 1)

				$.each(tdList, function(index, td) {
					var attr = config.items[index]['attr'] || 'nothing'
					obj[attr] = $(td).children().val()
				})
				result.push(obj)
			})
			return result
		}
		/**
		 * item 为要绑定的select
		 * listData 为绑定的数据
		 *	checked 为默认选中的元素
		 * */
		this.bind_list = function(item,listData, checked){
			// var item = ES.get(ele).parents('td')
			var selectItem = []
			ES.each(listData || [], function (index, item) {
				if (checked && checked == item.value) {
					selectItem.push('<option value="' + item.value + '" selected=true>' + item.display + '</option>')
				} else {
					selectItem.push('<option value="' + item.value + '">' + item.display + '</option>')
				}
			})
			if($(item).hasClass('select-editable')){
				select2config = ES.util.merge(select2config, {
					// tags: true
				})
			}
			var select2 = item.select2(select2config)
			item.html(selectItem.join(''))
		}
		/*
		 * val： 输入框中的值
		 * index：该输入框在一行中的索引
		 * valueArray: 二维数组
		 */
		this.valueUnique = function(val, index, valueArray) {
			var rowVal

			for(var i = 0, len = valueArray.length; i < len; i++) {
				rowVal = valueArray[i]
				if(val == rowVal[index]) {
					return false
				}
			}
			return true
		}

		this.setMsg = function(target, msg) {
			target.addClass('error_frame')
			target.parent().find('.after_label').addClass('error_frame')
			$('.popup-error').html('<i class="fa fa-times-circle"></i> ' +  msg).show().parent().show()
		}

		this.clear_validate = function() {
			$('.popup-error').html('').hide()
			this.el.find('.error_frame').removeClass('error_frame')
			this.el.siblings('span').find('.select2-selection').removeClass('error_frame')
			this.el.parent().find('.after_label').removeClass('error_frame')
			this.el.parent().find('.select2-selection--single').removeClass('error_frame')
		}

		this.validate = function(couldDuplicate) {
			var trArray,
				inputArray,
				valueArray,
				rowVal,
				val

			// 表格中的值以二维数组存放
			valueArray = []
			trArray = this.el.find('tbody tr')
			for(var i = 0, trLen = trArray.length; i < trLen; i++) {
				inputArray = $(trArray[i]).find('.validate')
				rowVal = []
				for(var j = 0, inputLen = inputArray.length; j < inputLen; j++) {
					var inputObj = $(inputArray[j])
					val = $.trim(inputObj.val())
					if (this.items[j].nonEmpty && val == '') {
						this.setMsg(inputObj, ES.msg.get('non_empty'))
						inputObj.parents('.search-form').find('.table_msg_info').addClass('msg_active').html(ES.msg.get('non_empty'))
						return false
					}
					if (this.items[j].unique && !this.valueUnique(val, j, valueArray) && !couldDuplicate) {
						this.setMsg(inputObj, this.heads[j] + '重复')
						return false
					}
					if(this.items[j].validate){
						var input = ES.get('#' + this.el.attr('id') + ' tbody tr:eq(' + i + ')').find('td:eq(' + j + ')').find('.validate')
						var value = input.val()
						var addErrorClass = function(input){
							input.addClass('error_frame')
							input.parent().find('.after_label').addClass('error_frame')
							input.parent().find('.select2-selection--single').addClass('error_frame')
						}

						if(!this.items[j].validate(value, input)){
							if(this.items[j].alertMsg){
								console.log(this.items[j].alertMsg)
								var otherInput = input.parents('tr').find('.'+this.items[j].alertMsg)
								addErrorClass(otherInput)
							} else {
								addErrorClass(input)
							}
							return false
						}
					}
					rowVal.push(val)
				}
				valueArray.push(rowVal)
			}
			return true
		}

		$(this.el).on('click', '.tr-delete', function() {
			if(config.deleteHandler) {
				config.deleteHandler($(this).parent().parent())
			}
		})

		function formatEmptyVal(val) {
			if(typeof val === 'undefined') {
				return ''
			}
			return val
		}

		this.init()
	}
	var ret = new es_table_form(config)
	ES.ui.add(ret.id, ret)
	return ret
}

//scrollBar
//@parameter el -- 表格外 div Class
//@parameter tableClass -- 表格class
ES.ui.bottomScrollBar = function (el,tableClass){
	var scrollDiv = ES.get("."+el);
	scrollDiv.find(".scrollBar").remove();

	var html = '<div class="scrollBar" style="overflow: auto;position: fixed;bottom: 0; display: none;z-index:6;"><div class="content" style="height: 15px;"></div></div>';

	scrollDiv.append(html);

	ES.get("."+el+" .scrollBar").scroll(function(e){
		var scrollLeft = ES.get(this).scrollLeft()
		ES.get("."+el).scrollLeft(scrollLeft)
	})

	ES.get("."+el).scroll(function(){
		var scrollLeft = ES.get(this).scrollLeft()
		ES.get("."+el+" .scrollBar").scrollLeft(scrollLeft)
	})

	ES.get(window).scroll(function(){
		ScrollBar();
	})
	var ScrollBar = function(){
		if(ES.get("."+el).length > 0) {
			var tHeight = ES.get("." + el).height() + (ES.get("." + el).offset().top - ES.get(document).scrollTop())
			var wHeight = ES.get(window).height();
			var oScrollLeft = ES.get("." + el).scrollLeft()
			var nScrollLeft = ES.get("." + el + " .scrollBar").scrollLeft()
			if (tHeight > wHeight) {
				ES.get("." + el + " .scrollBar").show();
			} else {
				ES.get("." + el + " .scrollBar").hide();
			}
			if (oScrollLeft != nScrollLeft && oScrollLeft > nScrollLeft) {
				ES.get("." + el + " .scrollBar").scrollLeft(oScrollLeft)
			} else if (oScrollLeft != nScrollLeft && oScrollLeft < nScrollLeft) {
				ES.get("." + el).scrollLeft(oScrollLeft)
			} else if (oScrollLeft == 0) {
				ES.get("." + el + " .scrollBar").scrollLeft(0)
			}
			var scrollBarWidth = ES.get('.' + el).innerWidth()
			var scrollContentWidth = ES.get('.' + tableClass).innerWidth()
			ES.get("." + el + " .scrollBar").width(scrollBarWidth);
			ES.get("." + el + " .scrollBar .content").width(scrollContentWidth);
		}
	}
	ScrollBar();
	ES.get(window).resize(ScrollBar)
}
//scrollBar

//congeal table bar
//@parameter elClass 必填 表格Class/可为Id或者class
//@parameter congealBarClass /非必填 固定操ClassName/固定在左或右需要在表格的thead的th加上data-value="left or right"
ES.ui.congealTableBar = function (elClass,congealBarClass,config) {
	var thHeight = 0,
		dTime = new Date().getTime(),
		barLeftId = 'left-bar-' + dTime,
		barLeftColumnId = 'left-column-' + dTime,
		barRightId = 'right-bar-' + dTime,
		barRightColumnId = 'right-column-' + dTime,
		el = ES.get("table#"+elClass).length > 0 ? ES.get("table#"+elClass) : ES.get("table."+elClass),
		elParent = el.parent("div");
	var getTableBody = function(index){
		el =  ES.get("table#"+elClass).length > 0 ? ES.get("table#"+elClass) : ES.get("table."+elClass);
		var trList = el.find("tbody tr");
		var tableBodyHtml = "";
		tableBodyHtml += "<tbody>"
		ES.each(trList,function(_,v){
			tableBodyHtml += "<tr>"
			var trIndex = ES.get(v).index();

			for(var i = 0 ; i < index.length ; i ++){
				var cls = cls = ES.get(v).find("td").eq(index[i]).attr("class");
				var  tdHeight = el.children("tbody").find("tr").eq(trIndex).innerHeight();
				tableBodyHtml += "<td style='height: "+tdHeight+"px;' class='"+cls+"'>"+ES.get(v).find("td").eq(index[i]).html()+"</td>";
			}
			tableBodyHtml += "</tr>"
		});
		tableBodyHtml += "</tbody>";
		return tableBodyHtml;
	}
	var congealBar = function(){
		var congealBarList = ES.get("table.sticky-enabled").find("."+congealBarClass);
		var barHtml = "",
			leftList = [],
			rightList = [],
			leftHeadHtml = '<tr>',
			rightHeadHtml = '<tr>';
		ES.each(congealBarList,function(_,v){
			var value = ES.get(v).html(),
				align = ES.get(v).attr("data-value"),
				index = ES.get(v).index(),
				width  = ES.get(v).innerWidth(),
				cls = ES.get(v).attr("class");
			if(config && config.isBriefOperation){
				width += 1;
			}
			if(align == "left"){
				leftList.push(ES.get(v).index())
				leftHeadHtml += "<th class='congeal-head "+cls+"' data-index='"+index+"' style='width:"+width+"px'>"+value+"</th>"
			}else if(align == "right"){
				rightList.push(ES.get(v).index())
				rightHeadHtml += "<th class='congeal-head "+cls+"' data-index='"+index+"' style='width:"+width+"px'>"+value+"</th>"
			}

		});
		leftHeadHtml += '</tr>';
		rightHeadHtml += '</tr>';

		if(leftList.length > 0){
			var tableBodyHtml = getTableBody(leftList);
			barHtml += "<table class='operation-bar-congeal left' id='"+barLeftId+"'><thead>"+leftHeadHtml+"</thead>"+tableBodyHtml+"</table>"
			barHtml += "<table class='operation-column-congeal' id='"+barLeftColumnId+"'><thead>"+leftHeadHtml+"</thead></table>"
		}
		if(rightList.length > 0){
			var tableBodyHtml = getTableBody(rightList);
			barHtml += "<table class='operation-bar-congeal right' id='"+barRightId+"'><thead>"+rightHeadHtml+"</thead>"+tableBodyHtml+"</table>"
			barHtml += "<table class='operation-column-congeal' id='"+barRightColumnId+"'><thead>"+rightHeadHtml+"</thead></table>"
		}
		el.parent("div").append(barHtml);
		ES.get("#"+barLeftId).delegate("tbody input","change",function () {
			var index = ES.get(this).parents("tr").index(),
				tdIndex = ES.get(this).parents("td").index(),
				isSelected = ES.get(this).prop("checked");
			el.find("tbody tr").eq(index).find("td").eq(tdIndex).find("input").prop("checked",isSelected).trigger("change");
		});
		ES.get("#"+barRightId).delegate("tbody input","change",function () {
			var index = ES.get(this).parents("tr").index(),
				tdIndex = ES.get(this).parents("td").index(),
				isSelected = ES.get(this).prop("checked");
			el.find("tbody tr").eq(index).find("td").eq(tdIndex).find("input").prop("checked",isSelected).trigger("change");
		});
	}
	var displayCongealTop = function (id) {
		var elTop = el.offset().top + el.outerHeight() - ES.get("#"+id).outerHeight();
		var scpTop = ES.get(document).scrollTop()　+ ES.get("#shell-header-inner").outerHeight();
		if (elTop > scpTop) {
			ES.get("#"+id).show();
		} else {
			ES.get("#"+id).hide();
		}
	}
	var scroll = function () {
		//thead:visible
		if (el.children("thead").offset()) {
			var affix = elParent.children('table.sticky-thead:visible')
			var leftCongeal = ES.get('#'+barLeftColumnId)
			var rightCongeal = ES.get('#'+barRightColumnId)
			var scrollHeight = ES.get(window).scrollTop()
			var theadHeight =  el.children("thead").offset().top
			var listHeight = ES.get('.sticky-enabled:visible').outerHeight()
			var topNavHeight = ES.get('#shell-header').outerHeight() + ES.get('.bread-crumbs').outerHeight()
			var toolbar = elParent.parent().parent().find('.table-toolbar:visible')
			var toolbarHeight = toolbar.outerHeight() || 0

			//console.log(scrollHeight - theadHeight + topNavHeight)
			if (scrollHeight + topNavHeight + toolbarHeight > theadHeight) {

				affix.css({
					top: (scrollHeight - listHeight - theadHeight + topNavHeight) + thHeight + toolbarHeight
				})
				if(leftCongeal.length > 0){
					leftCongeal.css({
						top: scrollHeight - theadHeight + topNavHeight + toolbarHeight,
						left:0
					})
					ES.get('#' + barLeftId).css({
						left:0
					})
				}
				if(rightCongeal.length > 0){
					rightCongeal.css({
						top: scrollHeight - theadHeight + topNavHeight + toolbarHeight,
						right:0
					})
					ES.get('#' + barRightId).css({
						right:0
					})
				}
				if(toolbar.length){
					toolbar.css({
						top: scrollHeight  + topNavHeight - theadHeight + toolbarHeight
					})
				}

			} else {
				affix.css({
					top: -listHeight + thHeight
				})
				if(leftCongeal.length > 0){
					leftCongeal.css({
						top: 0,
						left:0
					})
					ES.get('#'+barLeftId).css({
						left:0
					})
				}
				if(rightCongeal.length > 0){
					rightCongeal.css({
						top: 0,
						right:0
					})
					ES.get('#' + barRightId).css({
						right:0
					})
				}
				if(toolbar.length){
					toolbar.css({
						top: 0
					})
				}
			}
			if(ES.get("#"+barRightColumnId).length > 0){
				displayCongealTop(barRightColumnId)
			}
			if(ES.get("#"+barLeftColumnId).length > 0){
				displayCongealTop(barLeftColumnId)
			}
		}
	}

	var setCongealBarStyle = function(){
		var congealRight = elParent.find("table#" + barRightId + " thead th"),
			congealRightTop = elParent.find("table#" + barRightColumnId + " thead th"),
			congealLeft = elParent.find("table#" + barLeftId + " thead th"),
			congealLeftTop = elParent.find("table#" + barLeftColumnId + " thead th"),
			elTable = el.children("tbody"),
			tableCongealLeft = elParent.find("table#" + barLeftId).children("tbody"),
			tableCongealRight = elParent.find("table#" + barRightId).children("tbody");
		if(congealRight.length > 0){
			ES.each(congealRight,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead tr:last-child").find('th').eq(index).width();
				ES.get(v).width(width);
			});
			ES.each(congealRightTop,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead tr:last-child").find('th').eq(index).width();
				ES.get(v).width(width);
			})
		}
		if(congealLeft.length > 0){
			ES.each(congealLeft,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead th").eq(index).width();
				ES.get(v).width(width);
			});
			ES.each(congealLeftTop,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead th").eq(index).width();
				ES.get(v).width(width);
			})
		}
		var initTableCongeal = function () {
			tableCongealLeft = elParent.find("table#" + barLeftId).children("tbody");
			tableCongealRight = elParent.find("table#" + barRightId).children("tbody");
		}
		elTable.find("tr").hover(function () {
			var index = ES.get(this).index();
			initTableCongeal();
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).addClass("hoverTr");
			}
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).addClass("hoverTr");
			}
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
		},function () {
			var index = ES.get(this).index();
			initTableCongeal();
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).removeClass("hoverTr");
			}
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).removeClass("hoverTr");
			}
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
		});
		elTable.find("tr").hover(function () {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
		},function () {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
		})
		elParent.delegate("table#" + barLeftId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
			e.preventDefault();
		})
		elParent.delegate("table#" + barLeftId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
			e.preventDefault();
		})
		elParent.delegate("table#" + barRightId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
			e.preventDefault();
		})
		elParent.delegate("table#" + barRightId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
			e.preventDefault();
		})

		elParent.delegate("table#" + barLeftId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).addClass("hoverTr");
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).addClass("hoverTr");
			}
			e.preventDefault();
		})

		elParent.delegate("table#" + barLeftId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).removeClass("hoverTr");
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).addClass("hoverTr");
			}
			e.preventDefault();
		})

		elParent.delegate("table#" + barRightId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).addClass("hoverTr");
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).removeClass("hoverTr");
			}
			e.preventDefault();
		})

		elParent.delegate("table#" + barRightId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).removeClass("hoverTr");
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).removeClass("hoverTr");
			}
			e.preventDefault();
		})
		elParent.delegate("div.action-dropdown","click",function () {
			ES.get(this).addClass("current");
			ES.get(this).find(".aui-list").show();
		})
	}
	var headSticker = function() {
		var $t = ES.get("table." + elClass);
		$t.parent("div").children("table.sticky-thead").remove();
		if($t.find("thead").length > 0 && $t.find("th").length > 0){
			var $thead = $t.children("thead").clone(),
				operationItems = ES.get("."+congealBarClass),
				congealRightIndex = -1;
			ES.each(operationItems,function (_,v) {
				if(config && ES.get(v).data().value == "right" && config.isBriefOperation){
					congealRightIndex = ES.get(v).index();
					ES.get(v).addClass("brief");
				}
			})
			if(config && config.isBriefOperation && operationItems.length > 0 && congealRightIndex >= 0){

				var operationTr = $t.find("tbody tr");
				ES.each(operationTr,function (_,v) {
					var html = '<div class="action-dropdown"><i class="fa fa-cog fa-fw"></i><i class="fa fa-sort-desc"></i><div class="aui-list">'+ES.get(v).find("td").eq(congealRightIndex).html()+'</div></div>';
					ES.get(v).find("td").eq(congealRightIndex).addClass("brief").html(html);
				})
			}
			var outerWidth = "auto";
			$t.css("width",outerWidth);
			var divWidth = $t.parent("div").innerWidth();
			var tableWidth = $t.innerWidth();
			if(tableWidth < divWidth) {
				outerWidth = "100%"
			}
			thHeight = $t.children("thead").outerHeight()
			$t.addClass('sticky-enabled')
				.css({
					margin: 0,
					width: outerWidth,
					"marginBottom" : "-" + thHeight + "px"
				})
			$t.after('<table class="sticky-thead" />')
			$thead = $t.children("thead").clone();
			var $stickyHead = $t.siblings('.sticky-thead')
			$stickyHead.html($thead)
			var setWidths = function () {
				$t.find('thead th').each(function (i) {
					$stickyHead.find('th').eq(i).width($(this).width())
				})
				$stickyHead.width($t.width())
			}
			setWidths()
			scroll();
			setCongealBarStyle();
		}
	}
	var selectedBindEven = function () {
		var congealList = ES.get(".operation-bar-congeal");
		var evenChange = function (e) {
			var type = ES.get(e).attr("type"),
				tr = ES.get(e).parents("tr"),
				congealEl = "";
			if(congealList.length > 0){
				ES.each(congealList,function (_,v) {
					if(ES.get(v).hasClass("left")){
						tr = el.find("tbody tr").eq(tr.index());
						congealEl = ES.get(v);
						return false;
					}
				})
			}
			if(type != "checkbox"){
				return;
			}
			var selected = ES.get(e).prop("checked");
			if(selected){
				tr.addClass("active");
				tr.find("td").eq(0).addClass("frozen");
				if(congealList.length > 0){
					congealEl.find("tbody tr").eq(tr.index()).find("td").eq(0).addClass("frozen");
					congealEl.find("tbody tr").eq(tr.index()).addClass("active");
				}
			}else{
				tr.removeClass("active");
				tr.find("td").eq(0).removeClass("frozen");
				if(congealList.length > 0){
					congealEl.find("tbody tr").eq(tr.index()).find("td").eq(0).removeClass("frozen");
					congealEl.find("tbody tr").eq(tr.index()).removeClass("active");
				}
			}
		}
		el.delegate("tbody td input","change",function () {
			evenChange(this);
		});
		if(congealList.length > 0){
			ES.each(congealList,function (_,v) {
				if(ES.get(v).hasClass("left")){
					ES.get(v).delegate("tbody td input","change",function () {
						evenChange(this);
					})
					return false;
				}
			})
		}
		el.delegate("tbody tr","click",function (e) {
			var congealEl = "";
			if(e.target.tagName == "INPUT" && e.target.type == "checkbox"){
				return;
			}
			if(congealList.length > 0){
				ES.each(congealList,function (_,v) {
					if(ES.get(v).hasClass("left")){
						congealEl = ES.get(v);
						return false;
					}
				})
			}
			var index = ES.get(this).index();
			if(config.single){
				el.find("tbody tr").removeClass("active");
				el.find("tbody td").removeClass("frozen");
				ES.get("table.operation-bar-congeal tbody tr").removeClass("active");
				ES.get(this).parent("tbody").find("td input").prop("checked",false).trigger("change");
				if(congealEl.length > 0){
					congealEl.find("tbody").find("td input").prop("checked",false).trigger("change");
				}
				ES.get(this).addClass("active");
				ES.get(this).find("td").eq(0).addClass("frozen");
				ES.get("table.operation-bar-congeal tbody tr").eq(index).addClass("active");
				var tdInput = ES.get(this).find("td").eq(0).find("input");
				if(tdInput.length > 0 && tdInput.attr("type") == "checkbox"){
					ES.get(this).find("td").eq(0).find("input").prop("checked",true).trigger("change");
					if(congealEl.length > 0){
						congealEl.find("tbody tr").eq(ES.get(this).index()).find("td").eq(0).find("input").prop("checked",true).trigger("change");
					}
				}
			}else{
				if(ES.get(this).hasClass("active")){
					ES.get("table.operation-bar-congeal tbody tr").eq(index).removeClass("active");
					ES.get(this).removeClass("active");
				}else{
					ES.get(this).addClass("active");
					ES.get("table.operation-bar-congeal tbody tr").eq(index).addClass("active");
				}
			}
		});
	};
	headSticker();
	if(ES.get("."+congealBarClass).length > 0){
		congealBar();
	}
	ES.get(window).resize(function(){
		ES.client_height = document.documentElement.clientHeight
		ES.client_width = document.documentElement.clientWidth
		headSticker()
	})
	if(config && config.isEvenSelected){
		selectedBindEven();
	};
	ES.get(window).scroll(scroll)
	ES.get(window).resize()
}
/**
 * 云渡中目的地市、邮编使用的input
 * @param  config  控件设置项对象
 * @param  {Array} data 下拉框中的数据源
 * @param  {Function} config.input_clear_callback  当点击 X 按钮后的处理函数
 * @param  {Function} config.get_data 提供给外部获取数据源的接口，在此接口中获取数据源后再渲染下拉框。
 */
ES.ui.lcl_input_filter = function(config) {
	var ret = ES.ui.input(config)

	ret.data = config.data || []
	ret.input_clear_callback = config.input_clear_callback

	ret.get_value = function() {
		return this.el.data('value')
	}

	ret.set_value = function(val) {
		this.el.data('value', val)
	}

	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_display_value = function(val) {
		return this.el.val(val)
	}


	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}

	ret.get_data = config.get_data || function() {}

	ret.clear_dropdown = function() {
		ret.data = []
		this.renderDropdown({hide: true})
	}

	/**
	 * @param  {Boolean} obj.showEmpty 当数据源为空时，通过此参数来控制是否显示空的提示信息
	 * @param  {Boolean} obj.selected 当选择一条下拉框（此处下拉框可能不属于当前控件）中的数据时会传true值，如果此时数据源中只有一条数据会隐藏下拉框
	 * @param  {Boolean} obj.hide 当选择一条下拉框中的数据后,如果当前下拉框属于此控件，就传true值隐藏下拉框
	 * */
	ret.renderDropdown = function(obj) {
		obj = obj || {}
		var $input = ret.el

		var value = $input.data('value')
		var display = $input.val().trim()

		if (!value) {
			value = ''
		}

		var drop = $('#' + ret.id + '-drop')

		var width = $input.outerWidth()
		var height = $input.outerHeight()
		var offset = $input.offset()
		var poupFlag = $input.closest('.popup').length>0?true:false
		var infactTop = offset.top + height
		if(poupFlag){
			infactTop = infactTop-$(document).scrollTop()
		}
		drop.css({
			'top': infactTop,
			'left': offset.left,
			'min-width': width,
			'position':poupFlag ? 'fixed' : 'absolute'
		})
		drop.empty()


		if (ret.data.length <= 0) {
			if(obj.showEmpty) {
				drop.html('<div class="empty-div">' + ES.msg.get('default_empty_result') + '</div>').show()
			} else {
				drop.hide()
			}
			return
		}

		var out = []
		ES.each(ret.data, function(_, item) {
			out.push('<div >' + item + '</div>')
		})
		drop.html(out.join(''))

		if(obj.selected && ret.data.length === 1) {
			$input.val(ret.data[0])
			$input.data('value', ret.data[0])
			drop.hide()
			return
		}
		if(obj.hide) {
			drop.hide()
		} else {
			drop.show()
		}
	}

	ret.initDropdown = function() {
		this.renderDropdown({hide: true})
	}

	$('<div class="clear-input hide" title="clear"></div>').insertAfter(ret.el).on('click', function() {
		var inputObj = ES.ui.get($(this).prev().attr('id'))

		inputObj.input_clear_callback && inputObj.input_clear_callback()
	})

	var $dropWrap = $('<div class="input-drop input-filter-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append($dropWrap)

	$dropWrap.on('click', 'div', function(e) {
		var item = $(this)
		var id = item.parent().data().value

		if(item.hasClass('empty-div')) {
			return
		}

		$('#' + id).val(item.html()).data('value', item.html())

		$('.clear-input').addClass('hide')

		ES.event.fire(id, 'change', item.data().value)

		item.parent().hide()

		e.preventDefault()
	})


	var input_listener = function(evt) {
		var $this = $(this)

		if($this.val()) {
			$this.next().removeClass('hide')
		} else {
			$this.next().addClass('hide')
		}

		$this.data('value', '')
		ES.ui.get(this.id).get_data()
		evt.preventDefault()
	}

	if(window.attachEvent && document.getElementById(ret.id).onpropertychange){
		document.getElementById(ret.id).onpropertychange=input_listener
	} else {
		ES.get('#' + ret.id).on('input',input_listener)
	}


	var drop = $('#' + ret.id + '-drop')
	var scrollCalculate = function(){
		var selectedTop = drop.find('.input-item-selected').offset().top
		var dropTop = drop.offset().top
		var selectedOutHeight = drop.find('.input-item-selected').outerHeight()
		var dropOutHeight = drop.outerHeight()
		if (selectedTop - dropTop + selectedOutHeight <= 1) {
			var height = 0
			ES.each(ES.get('.input-item-selected').prevAll(), function (_, item) {
				height += $(item).outerHeight()
			})
			ES.get('.input-drop').scrollTop(height)
		} else if (selectedTop - dropTop + selectedOutHeight > dropOutHeight) {
			var height = 0
			ES.each(ES.get('.input-item-selected').prevAll(), function (_, item) {
				height += $(item).outerHeight()
			})
			ES.get('.input-drop').scrollTop(height + selectedOutHeight - dropOutHeight)
		}
	}

	ES.get('#' + ret.id).on('keyup', function(evt) {
		if (evt.which == 13) {
			// enter
			if(drop.find('.input-item-selected').length>0){
				drop.children('.input-item-selected').eq(0).trigger('click')
			} else {
				drop.children('div').eq(0).trigger('click')
			}
			evt.preventDefault()
		} else if (evt.which == 9) {
			// tab
			if(ES.get('#' + ret.id).val()) {
				drop.children('div').eq(0).trigger('click')
			} else {
				//drop.hide()
			}
			// tab can not preventDefault since we need browser to do other things
		} else {
			if ((evt.which < 48 && evt.which > 9) ||
				(evt.which > 105 && evt.which < 112) ||
				(evt.which > 123 && evt.which < 223)) {
				evt.preventDefault()

			}
		}
		// if (ES.get('#' + ret.id).val().trim() == '') {
		// 	ES.ui.get(ret.id).clear_value();
		// }
	}).on('keydown', function(evt) {
		var drop = $('#' + $(this).attr('id') + '-drop')
		var children = drop.children('div')
		if (evt.which == 9) {
			// tab
			if(ES.get('#' + ret.id).val() && drop[0].style.display!='none') {
				drop.children('div').eq(0).trigger('click')
			} else {
				drop.hide()
			}
		} else if (evt.which == 38) {
			// arrow top
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i > 0 && children.eq(i).hasClass('input-item-selected')) {
					children.eq(i).removeClass('input-item-selected')
					children.eq(i - 1).addClass('input-item-selected')
					break;
				}
			}
			scrollCalculate()
			evt.preventDefault()
		} else if (evt.which == 40) {
			// arrow down
			var total = children.length
			for (var i = 0; i < total; i++) {
				if (i < total - 1 && children.eq(i).hasClass('input-item-selected')) {
					children.eq(i).removeClass('input-item-selected')
					children.eq(i + 1).addClass('input-item-selected')
					break;
				} else {
					if(drop.find('.input-item-selected').length>0) continue
					children.eq(0).addClass('input-item-selected')
					break;
				}
			}
			scrollCalculate()
			evt.preventDefault()
		}
	}).on('click', function(e) {
		e.preventDefault()
		return false
	}).on('focus', function() {

		// $(document).trigger('click')
		// $(this).data('value','')

		if(ES.ui.get(this.id).data.length) {
			$('#' + this.id + '-drop').show()
		}

		if($(this).val()) {
			$(this).next().removeClass('hide')
		}

//		ES.ui.get(this.id).get_data()

	})

	ret.etype = 'lcl_input_filter'
	ES.ui.add(ret.id, ret)
	return ret
}

ES.mvx = {}
ES.mvx.comps = {}
ES.mvx.get = function(id) {
	return ES.mvx.comps[id]
}
ES.mvx.add = function(comp) {
	ES.mvx.comps[comp.id] = comp
}
ES.mvx.remove = function(id) {
	ES.mvx.comps[id] = undefined
	ES.mvx.comps[id] = null
	delete ES.mvx.comps[id]
}
ES.mvx.validate = function() {
	var res = true
	var map = ES.mvx.comps
	for (var i in map) {
		if (map.hasOwnProperty(i) && map[i].validate) {
			var r = map[i].validate()
			res = r && res
			if(!res) break
		}
	}
	return res
}
ES.mvx.data = function() {
	var ret = {}
	var map = ES.mvx.comps
	for (var i in map) {
		if (map.hasOwnProperty(i) && map[i].get_value && map[i].id) {
			ret[map[i].id] = map[i].get_value()
		}
	}
	return ret
}
ES.mvx.disable = function() {
	var map = ES.mvx.comps
	for (var i in map) {
		if (map.hasOwnProperty(i) && map[i].disable) {
			map[i].disable()
		}
	}
}
ES.mvx.enable = function() {
	var map = ES.mvx.comps
	for (var i in map) {
		if (map.hasOwnProperty(i) && map[i].enable) {
			map[i].enable()
		}
	}
}
ES.mvx.clear_value = function () {
	var map = ES.mvx.comps
	for (var i in map) {
		if (map.hasOwnProperty(i) && map[i].clear_value) {
			map[i].clear_value()
		}
	}
}


ES.ui.show_container_img_on_web = function (id, imagePaths) {
	var url = imagePaths[0]
	var imgHtml =
		'<div class="bd-attachment">' +
		'	<div class="attachment-img">' +
		'		<ul class="bd-img">' +
		'           <div class="img-detail"></div>' +
		'		</ul>' +
		'		<div class="left-corner corner"><i class="fa fa-angle-left"></i></div>' +
		'		<div class="right-corner corner"><i class="fa fa-angle-right"></i></div>' +
		'	</div>' +
		'</div>'

	ES.get(id).html(imgHtml)
	var active = 0
	var doCss = function (index) {
		ES.get('.img-detail').css({
			background: 'url(' + imagePaths[index] + ') center center no-repeat',
			height: '100%',
			'background-size': 'contain'
		})
	}
	var carousel = function (LorR) {
		if (LorR == 'left') {
			active--
		} else if (LorR == 'right') {
			active++
		}
		if (active < 0) {
			active = imagePaths.length - 1
		} else if (active > imagePaths.length - 1) {
			active = 0
		}
		doCss(active)
	}

	ES.get('.left-corner').on('click', function () {
		carousel('left')
	})
	ES.get('.right-corner').on('click', function () {
		carousel('right')
	})
	doCss(0)

}


ES.ui.show_container_img = function (target,imagePaths,closeMethod) {
	ES.get('.bd-attachment').remove()
	var imageLen = imagePaths.length
	var liHtml = ""
	var barHtml = ""
	for(var i = 0;i< imageLen;i++){
		liHtml += "<li><img src="+imagePaths[i]+" alt='' /></li>"
		barHtml +="<li class='bd-bottom-corner'></li>"
	}
	var imgHtml =
		'<div class="bd-attachment">' +
		'	<div class="attachment-img">' +
		'		<ul class="bd-img">' + liHtml +
		'		</ul>' +
		'		<div class="left-corner corner"><i class="fa fa-angle-left"></i></div>' +
		'		<div class="right-corner corner"><i class="fa fa-angle-right"></i></div>' +
		'	</div>' +

		'	<ul class="bottom-corner">' + barHtml +
		'	</ul>' +
		'	<div class="triangle"></div>' +
		'	<div class="img-close"></div>' +
		'</div>'
	ES.get('body').append(imgHtml)
	ES.get('.bd-bottom-corner').eq(0).addClass('corner-current')

	ES.get('.bd-attachment').css({
		'width': "40%",
		'height': "60%",
		'left': "20%",
		'top': "20%",
		'position': 'fixed'
	})
	ES.get('.bd-img').css({
		'width': ES.get('.bd-attachment').width() * imageLen + 'px'
	})
	ES.get('.bd-img li').css({
		'width': 100/imageLen + '%',
		'textAlign': 'center'
	})
	ES.get('.bd-img li img').each(function() {
		$(this).css({
			width: ($(this).width() - $(this).height()) > 0 ? "100%" : "auto",
			height: ($(this).width() - $(this).height()) > 0 ? "auto" : "100%"
		})
	})
	ES.get('.bd-bottom-corner').css({
		'width': 100/imageLen + '%'
	})
	var active = 0
	var carousel = function (elClass,index) {
		var index = parseInt(index)
		var removeWidth = ES.get('.bd-img li').width()
		ES.get('.' + elClass).unbind().bind('click',function () {
			active += index
			if (active < 0){
				active = imageLen -1
			} else if (active > (imageLen - 1)) {
				active = 0
			}
			var left = removeWidth * active
			ES.get('.bd-img').stop().animate({
				'left': '-' + left + 'px'
			})
			ES.get('.bd-bottom-corner').removeClass('corner-current').eq(active).addClass('corner-current')
		})
		ES.get('.bd-bottom-corner').hover(function(){
			active = $(this).index();
			$(this).addClass('corner-current').siblings().removeClass('corner-current')
			var left = removeWidth * active
			ES.get('.bd-img').stop().animate({
				'left': '-' + left + 'px'
			})
		})
	}
	carousel('left-corner','-1')
	carousel('right-corner','1')

	ES.get('.img-close').click(function() {
		ES.get('.bd-attachment').hide()
		closeMethod ? closeMethod() :"";
	})
}
ES.ui.geo_selector_v3 = function(config) {
	var ret = ES.ui.input(config)
	ret.el.attr('readonly', true)
	var lenList = 0,
		isLoad = false;
	config.countryId = config.countryId || 49
	if (ES.lang == 'en-us') {
		config.countryId = 212
	}
	var displayList = config.displayList || [{
			"id": config.continentId
		}, {
			"id": config.countryId
		}, {
			"id": config.provinceId
		}, {
			"id": config.cityId
		}, {
			"id": config.regionId
		}, {
			"id": config.subRegionId
		}]
	// var displayList = config.displayList || [{"id":config.countryId},{"id":config.provinceId},{"id":config.cityId},{"id":config.regionId},{"id":config.subRegionId}]
	var selectId = 1;
	ES.get("#" + ret.id + "-drop").remove();
	var geo_div = $('<div class="input-drop input-geo-drop" data-value="' + ret.id + '" id="' + ret.id + '-drop"></div>')
	$('body').append(geo_div)
	var dom = {
		el: ret.id + '-drop',
		tabs: [{
			value: 'CONTINENT',
			display: '大洲',
			cls: ''
		}, {
			value: 'COUNTRY',
			display: ES.msg.get('country') + '',
			cls: ''
		}, {
			value: 'PROVINCE',
			display: ES.msg.get('province') + '',
			cls: ''
		}, {
			value: 'CITY',
			display: ES.msg.get('city') + '',
			cls: ''
		}, {
			value: 'COUNTY',
			display: ES.msg.get('region') + '',
			cls: ''
		}, {
			value: 'TOWN',
			display: ES.msg.get('subRegion') + '',
			cls: ''
		}],
		panels: [{}, {}, {}, {}, {}, {}]
	}
	if (config.length) {
		dom.tabs = dom.tabs.slice(0, config.length)
		dom.panels = dom.panels.slice(0, config.length)
	}
	var displayValue = [];
	lenList = ES.ui.tab_v(dom).len;
	var show_geo = function() {
		var geo = $(this)
		var width = config.width || geo.outerWidth()
		var height = geo.outerHeight()
		var offset = geo.offset()
		var tab_panel = ES.ui.get(geo.attr('id') + '-drop')
		tab_panel.el.css({
			top: offset.top + height,
			left: offset.left,
			width: width
		})
		tab_panel.el.show()
	}
	var filter_geo = function(tab_panel, level, val, selectedId, selectIndex) {

		tab_panel.set_panel(level)
		// if (!level && !val) {
		//     tab_panel.set_panel(level)
		// } else {
		//     tab_panel.set_panel(level)
		//     query = '/geo/query'
		// }

		var query = '/geo/query'
		if (level <= 0) {
			query = '/geo/query_all_geoDivision'
		}
		// var param = {
		//     parent: val
		// }
		// if (lang) {
		//     param.lang = lang
		// }

		ES.util.ajax_get(query, {
			parent: val,
			geotype: dom.tabs[level].value
		}, function(res) {
			var out = ['<dl>']
			var common = []
			var compare = function(c1, c2) {
				var n1 = c1.nameEN;
				var n2 = c2.nameEN;
				if (n1 < n2) {
					return -1;
				} else if (n1 > n2) {
					return 1;
				} else {
					return 0;
				}
			}
			isLoad = ES.get("#" + ret.id + "-drop").css("display").indexOf("none") >= 0;
			res.children = res.children.sort(compare);
			var groupArr = [{
				'group': 'ABCDEFG',
				'groupObj': 'A-G'
			}, {
				'group': 'HIJK',
				'groupObj': 'H-K'
			}, {
				'group': 'LMNOPQRS',
				'groupObj': 'L-S'
			}, {
				'group': 'TUVWXYZ',
				'groupObj': 'T-Z'
			}]
			// var provinceArr = ES.consts.china_province
			// if (config.countryId == 212) {
			//     provinceArr = ES.consts.indonesia_province
			// }
			var split = function(classify, groupObj) {
				out.push('<dt class="clear">' + groupObj + '</dt><dd>')
				ES.each(res.children, function (_, v) {
					if (classify.indexOf(v.nameEN.substr(0, 1).toUpperCase()) >= 0) {
						if (selectedId && v.id == selectedId) {
							out.push('<span data-value="' + v.id + '" class="selected">' + v.name + '</span>')
							displayValue[selectIndex] = v.name;
						} else {
							out.push('<span data-value="' + v.id + '">' + v.name + '</span>')
						}
					}
				})
				out.push('</dd>')
			}
			ES.each(groupArr, function(_, item) {
				split(item.group, item.groupObj)
			})
			out.push('</dl>')
			tab_panel.set_panel_dom(level, out.join(''))
			var value = ES.get("#" + ret.id).val().trim()
			if (selectedId) {
				ES.get("#" + ret.id).val(displayValue.join('-')).data('value', selectId)
			}
			var id = '#' + tab_panel.id + ' .panel';

			ES.get('#' + tab_panel.id + ' .panel').eq(level).unbind().bind('click', function(e) {
				var span
				if (e.target.nodeName.toLowerCase() == 'span') {
					span = $(e.target)
				} else {
					return
				}
				var dataValue = span.data('value')
				var lev = span.closest('.panel').index()
				var spanArr1 = span.parents(id).parent().children(id).eq(1).find('span')
				var spanArr2 = span.parents(id).parent().children(id).eq(2).find('span')
				span.parents(id).find('span').removeClass('selected')
				//省份的select同步
				// if (lev == 1 || lev == 2) {
				//     var spanSelect = function(spanArrI) {
				//         ES.each(spanArrI, function(i, item) {
				//             if (ES.get(item).data('value') == dataValue) {
				//                 ES.get(item).parents(id).find('span').removeClass('selected')
				//                 ES.get(item).addClass('selected')
				//             }
				//         })
				//     }
				//     spanSelect(spanArr1)
				//     spanSelect(spanArr2)
				//     if (spanArr1.parent().find('.selected').data('value') != spanArr2.parent().find('.selected').data('value')) {
				//         spanArr1.parent().find('.selected').removeClass('selected')
				//     }
				// } else {
				//     span.addClass('selected')
				// }
				span.addClass('selected')
				var drop = span.closest('.input-geo-drop')
				var len = ES.get("#" + ret.id + "-drop .tab-v-panels div.panel").length;
				//var index = $(this).parents(id).index()+1;

				var get_selected_string = function(drop) {
					var list = drop.find('.selected')
					var res = []
					ES.each(list, function(_, v) {
						var items = ES.get(list[_]).html();
						if ($.inArray(items, res) == -1) {
							res.push($(v).html())
						}
					})
					return res.join(' - ')
				}
				lev += 1
				for (var i = lev; i < len; i++) {
					ES.get("#" + ret.id + "-drop .tab-v-panels div.panel").eq(i).html("");
				}
				ES.get('#' + drop.data('value')).val(get_selected_string(drop)).data('value', dataValue)
				if (lev >= lenList) {
					drop.hide()
					if (config.callback) config.callback()
					return
				}
				var tab_panel = ES.ui.get(drop.attr('id'))

				filter_geo(tab_panel, lev, dataValue)
				e.preventDefault()
				return false
			})
		})
	}
	ES.get('#' + ret.id).unbind().on('click', function(e) {
		isLoad = ES.get("#" + ret.id + "-drop").css("display").indexOf("none") >= 0;
		if (ES.get(this).hasClass('disabled')) {
			e.preventDefault()
			return false
		}
		show_geo.apply(this)
		var el = ES.ui.get($(this).attr('id') + '-drop')
		displayValue = [];
		var isDefault = true;
		ES.each(displayList, function(_, v) {
			var q = null;
			if (_ > 0) {
				q = displayList[_ - 1].id
			}
			if (v.id && v.id != "") {
				filter_geo(el, 0, q, v.id, _)
				selectId = v.id
				isDefault = false;
			}
		})
		if (isDefault) {
			filter_geo(el, 0, null)
		}
		e.preventDefault()
		return false
	})
	ret.etype = 'geo_selector'
	ret.get_value = function() {
		return +this.el.data('value')
	}
	ret.get_display_value = function() {
		return this.el.val()
	}
	ret.set_value = function(v) {
		return this.el.data('value', v)
	}
	ret.set_display_value = function(v) {
		return this.el.val(v)
	}
	ret.clear_value = function() {
		return this.el.val('').data('value', '')
	}

	ES.ui.add(ret.id, ret)
	return ret
}


ES.ui.tableGrid = function (config) {
	var grid = function () {
		var defaultConfig = {
				enableEdit: false,
				freezeHead: true,
				freezeBottomScroll: true,
				assistBar: false
			},
			tableEl = ES.get("table#"+config.el).length > 0 ? ES.get("table#"+config.el) : ES.get("."+config.el);
		var isEdit = config.enableEdit || defaultConfig.enableEdit,
			isFreezeHead = config.freezeHead || defaultConfig.freezeHead,
			isAssistBar = config.assistBar || defaultConfig.assistBar;
		//当全局编辑是返回所有数据
		var getEditData = function () {

		};
		//编辑
		var edit = function (conf) {
			var config = conf || {},
				isSingleRowModel  = config.isSingleRowModel,
				el = tableEl,
				tr = el.find("tbody tr"),
				th = el.find("thead th.edit"),
				allTh = el.find("thead th"),
				rowModelSaveEl = config.rowModelSaveEl || "",
				rowModelCancelEl = config.rowModelCancelEl || "",
				enabledPattern = config.enabledPattern || "dblclick",
				gridDataList = {},
				itemId = {};
			//当编辑项小于等与0时跳出
			if(th.length <= 0 ){
				return;
			}
			//嵌入当前自定义组件(后期可以修改其他和添加新的组件)
			var controlCreate = function (v) {
				if(v.type == "filter"){
					var filter = ES.ui.input_filter({
						el: v.el,
						type: "filter",
						isNotWrap: true,
						allow_enter: false,
						cls: v.cls || '',
						data: [],
						value_field: function (item) {
							return item.id
						},
						display_field: function (item) {
							return item.label
						},
						filter: function (dataList, display) {
							var ret = [];
							ES.each(dataList, function (_, v) {
								if (v.label.toLowerCase().indexOf(display.toLowerCase()) >= 0) {
									ret.push(v)
								}
							});
							return ret;
						},
						evenChange:function () {
							if(ES.get("#"+this.el).hasClass("focus")) return;
							var id = this.el;
							if(ES.tableGridEven[v.eventName] && ES.tableGridEven[v.eventName].type == "change"){
								ES.tableGridEven[v.eventName].even(id);
							}
							if(!isSingleRowModel){
								var value = ES.get("#"+this.el).val();
								ES.get("#"+this.el).parents("td.input").find("span").removeClass("active");
								ES.get("#"+this.el).parents("td.input").find("span.view").addClass("active").html(value);
								ES.get("#"+this.el).parents("td.input").find("span.view").data("value",ES.get("#"+this.el).data("value"));
							}
							ES.get(window).resize();
						}
					});
					if(ES.tableGridData[v.dataName]){
						filter.load_data(ES.tableGridData[v.dataName]);
					}
					ES.get("#"+v.el).on("keyup",function (e) {
						if (e.which == 9 && ES.get(this).hasClass("focus")) {
							ES.get(this).trigger(enabledPattern);
							ES.get(this).removeClass("focus");
							ES.get(window).resize();
						}
					});
				}else if(v.type == "select"){
					var select = ES.ui.select({
						el: v.el,
						type: "select",
						isNotWrap: true,
						cls: v.cls || ''
					});
					if(ES.tableGridData[v.dataName]){
						select.bind_list(ES.tableGridData[v.dataName]);
						if(v.value != ""){
							ES.get("#"+v.el).val(v.value.toString()).trigger("change");
						}
					}
					if(ES.tableGridEven[v.eventName] && ES.tableGridEven[v.eventName].type == "change"){
						var clickFun = ES.tableGridEven[v.eventName]
						ES.get("#"+v.el).on('change', function (e) {
							clickFun.even(e);
						})
					}
					if(!isSingleRowModel){
						ES.get("#"+v.el).on("change",function () {
							var value = ES.get(this).find("option:selected").text();
							ES.get(this).parents("td.input").find("span").removeClass("active");
							ES.get(this).parents("td.input").find("span.view").addClass("active").html(value);
							ES.get(this).parents("td.input").find("span.view").data("value",ES.get(this).val());
							ES.get(window).resize();
						});
						ES.get("#"+v.el).on("blur",function () {
							var value = ES.get(this).find("option:selected").text();
							ES.get(this).parents("td.input").find("span").removeClass("active");
							ES.get(this).parents("td.input").find("span.view").addClass("active").html(value);
							ES.get(window).resize();
						});
						if(v.value){
							ES.get("#"+v.el).val(v.value.toString()).trigger("change");
						}
					}
				}else{
					ES.ui.input({
						el: v.el,
						isNotWrap: true,
						callbackFunction: function () {
							if(v.type == "date" || v.type == "datetime"){
								ES.get("#ui-datepicker-div").hide(); //隐藏日期控件
							}
							var value = ES.get("#"+this.el).val();
							if(!isSingleRowModel){
								ES.get("#"+this.el).parents("td.input").find("span").removeClass("active");
								ES.get("#"+this.el).parents("td.input").find("span.view").addClass("active").html(value);
							}
							ES.get(window).resize();
						}
					});
					if(ES.tableGridEven[v.eventName]){
						var type = ES.tableGridEven[v.eventName].type,
							relatedFieldName = ES.tableGridEven[v.eventName].relatedFieldName;
						ES.get("#"+v.el).unbind(type).bind(type,function () {
							var relatedFieldId = "",
								id = ES.get(this).attr("id"),
								index = ES.get(this).parents("tr.edit").index();
							if(isSingleRowModel){
								relatedFieldId = itemId[index][relatedFieldName];
							}
							ES.tableGridEven[v.eventName].even(id,relatedFieldId);
						});
					}
					if(!isSingleRowModel){
						if(v.type != "date" && v.type != "datetime"){
							ES.get("#"+v.el).on("blur",function () {
								var value = ES.get(this).val();
								ES.get(this).parents("td.input").find("span").removeClass("active");
								ES.get(this).parents("td.input").find("span.view").addClass("active").html(value);
								ES.get(window).resize();
							});

							ES.get("#"+v.el).on("keyup",function (e) {
								if (e.which == 13) {
									ES.get(this).trigger("blur");
								}
							});
						}
					}
				}
				if(!isSingleRowModel){
					tableEl.delegate("#"+v.el,"keydown",function (e) {
						if(e.keyCode == 9){
							var index = ES.get(this).parents("td.input").index(),
								tr = ES.get(this).parents("tr").eq(0);
							ES.get(this).blur();
							ES.get(document).trigger("click");
							if(ES.get(this).hasClass("date")){
								ES.get("#ui-datepicker-div").hide();
							}
							tr.find("td").eq(index+1).trigger(enabledPattern);
							if(v.type == "filter"){
								tr.find("td").eq(index+1).find("input").addClass("focus");
							}
							if(ES.get(this).parent("span").hasClass("active")){
								var value = ES.get(this).val(),
									dataValue = ES.get(this).data();
								ES.get(this).parents("td.input").find("span").removeClass("active");
								ES.get(this).parents("td.input").find("span.view").html(value);
								if(dataValue && dataValue.value){
									ES.get(this).parents("td.input").find("span.view").data("value",dataValue.value);
								}
							}
							e.preventDefault()
						}
					});

				}

			};
			var editEvenRow = function (index) {
				var gridData = [],
					tr = tableEl.find("tbody tr");
				//启动编辑
				ES.each(th,function (_,v) {
					var thIndex = ES.get(v).index(),
						options = ES.get(v).attr("data-option");
					if(options == ""){
						return true;
					}
					options = JSON.parse(options);
					var editTd = tr.eq(index).find("td").eq(thIndex);
					tr.eq(index).addClass("edit");
					if(editTd.hasClass("forbid") || editTd.hasClass("input")){
						return true;
					}
					var id = options.name + "-" + new Date().getTime() + "-" + index,
						value = editTd.data() ? editTd.data().value || "" : editTd.text().trim(),
						displayValue = editTd.text().trim(),
						isSetDataValue = editTd.attr("data-value") ? true : false,
						html,data = {},
						type = options.type,
						name = options.name,
						cls = options.cls || "",
						dataName = options.dataName || "",
						eventName = options.eventName || "",
						validate = options.validate || "",
						compareName = options.compareName || "";
					editTd.addClass("input");
					if(isSetDataValue){
						html = "<span class='view active' data-value='"+value+"'>"+displayValue+"</span>";
					}else{
						html = "<span class='view active'>"+displayValue+"</span>";
					}
					if(type == "select"){
						html += "<span class='input'><select id='"+id+"' class='"+options.cls+"'/></select></span>";
					}else if(type == "number") {
						html += "<span class='input'><input type='text' id='"+id+"' class='number "+cls+"' value='"+displayValue+"'/></span>";
					}else if(type == "date"){
						html += "<span class='input'><input type='text' id='"+id+"' class='date "+cls+"' value='"+displayValue+"'/></span>";
					}else if(type == "datetime"){
						html += "<span class='input'><input type='text' id='"+id+"' class='datetime "+cls+"' value='"+displayValue+"'/></span>";
					}else{
						html += "<span class='input'><input type='text' id='"+id+"' value='"+displayValue+"' data-value='"+value+"' class='needEmpty "+cls+"'/></span>";
					}
					editTd.html(html);
					data.el = id;
					data.type = type;
					data.name = name;
					data.value = value;
					if(dataName != ""){
						data.dataName = dataName;
					}
					if(eventName != ""){
						data.eventName = eventName;
					}
					if(validate != ""){
						data.validate = validate;
					}
					if(compareName != ""){
						data.compareName = compareName;
					}
					gridData.push(data);
					if(!itemId[index]){
						itemId[index] = {};
					}
					itemId[index][name] = id;
				});
				ES.each(gridData,function (_,v) {
					controlCreate(v);
				});
				gridDataList[index] = gridData;
			};
			if(isSingleRowModel){
				//单行编辑模式
				var evenRealize = function (el) {
					var index = ES.get(el).index(),
						isFocus = false,
						self = el,
						congeal = ES.get("table.operation-bar-congeal");
					if(!ES.get(el).hasClass("edit")){
						editEvenRow(index);
						isFocus = true;
					}
					ES.get(el).addClass("open");
					var td = ES.get(el).find("td.input");
					ES.each(td,function (_,v) {
						ES.get(v).find("span").removeClass("active");
						ES.get(v).find("span.input").addClass("active");
						ES.get(v).find("span.input select").trigger("change");
					});
					if(enabledPattern == "clickOther"){
						isFocus = true;
					}
					if(config.enabledEven){
						config.enabledEven(el);
					}
					if(isFocus){
						td.eq(0).find("span.input input").focus().addClass("trigger");
					}
					//编辑验证方法
					var validate = function () {
						var result = true,
							compare = {},
							isCompare = false;
						ES.get(el).find("input").removeClass("error");
						ES.each(gridDataList[index],function (_,v) {
							var validate = v.validate || "",
								value = ES.get("#"+v.el).data() || {},
								errorMsg = "",
								validateList = validate.split(",");
							value = value.value || "";
							if(value == ""){
								value = ES.get("#"+v.el).val().trim();
							}
							if(validateList.indexOf("empty") >= 0 && value == ""){
								errorMsg = ES.msg.get("non_empty");
								ES.get("#"+v.el).attr("placeholder",errorMsg).addClass("error");
								result = false;
							}else if(validateList.indexOf("lessDate") >= 0 && new Date().getTime() < new Date(value.replace(/-/g,"/")).getTime()){
								ES.get("#"+v.el).addClass("error");
								result = false;
							}
							if(validateList.indexOf("compareSame") >= 0){
								isCompare = true;
								compare.toName = v.compareName;
								compare.fromEl = v.el;
							}
						});
						if(isCompare){
							ES.each(gridDataList[index],function (_,v){
								if(compare.toName && compare.toName == v.name){
									compare.toEl = v.el;
									return true;
								}
							});
							var fromValue= ES.get("#"+compare.fromEl).data("value"),
								toValue = ES.get("#"+compare.toEl).data("value");
							compare.toValue = toValue ? toValue : ES.get("#"+compare.toEl).val().trim();
							compare.fromValue = fromValue ? fromValue : ES.get("#"+compare.fromEl).val().trim();
							if(compare.toValue == compare.fromValue && result){
								ES.get("#"+compare.fromEl).addClass("error");
								ES.get("#"+compare.toEl).addClass("error");
								result = false;
							}
						}
						return result;
					};
					//保存编辑点击事件
					var saveEl = ES.get(el).find("."+rowModelSaveEl);
					if(congeal.length > 0){
						saveEl = congeal.find("tbody tr").eq(index).find("."+rowModelSaveEl);
					}
					saveEl.unbind("click").bind("click",function () {
						var data = {},
							tr = ES.get(this).parents("tr.edit");
						if(!validate()){
							return;
						}
						if(ES.get("table.operation-bar-congeal").length > 0){
							tr = el;
						}
						var oldDate = {};
						ES.each(allTh,function (_,v) {
							var thIndex = ES.get(v).index(),
								options = ES.get(v).attr("data-option") || "",
								td = tr.find("td").eq(thIndex),
								value = "",displayValue,oldValue,oldDisplay;
							if(options == ""){
								return true;
							}
							options = JSON.parse(options);
							oldValue = td.find("span.view").data() || {};
							oldDisplay = td.find("span.view").text().trim();
							if((oldValue.value || "") != ""){
								oldDate[options.name] = oldValue.value;
								oldDate[options.name+"-display"] = oldDisplay;
							}else{
								oldDate[options.name] = oldDisplay;
							}
							if(td.hasClass("input")){
								var isValue = td.find("span.input input").data() || {};
								if(td.find("span.input input").length > 0){
									if((isValue.value || "") != ""){
										//value = td.find("span.input input").data().value;
										value = td.find("span.input input").val().trim();
										displayValue = td.find("span.input input").val().trim();
										data[options.name + "-name"] = displayValue;
									}else{
										value = td.find("span.input input").val().trim();
										displayValue = value;
									}
								}else if(td.find("span.input select").length > 0){
									value =  td.find("span.input select").val();
									displayValue = td.find("span.input select").find("option:selected").text();
								}
								td.find("span").removeClass("active");
								td.find("span.view").addClass("active").html(displayValue).data("value",value);
								if(td.attr("title")){
									td.attr("title",displayValue);
								}
							}else{
								value = td.text().trim();
							}
							data[options.name] = value;
						});
						var returnData = {};
						returnData.list = data;
						returnData.el = tr;
						returnData.errorEven = function () {
							ES.each(allTh,function (_,v) {
								var thIndex = ES.get(v).index(),
									options = ES.get(v).attr("data-option") || "",
									td = tr.find("td").eq(thIndex);
								if (options == "") {
									return true;
								}
								options = JSON.parse(options);
								var value,display;
								if(oldDate[options.name + "-display"]){
									value = oldDate[options.name];
									display = oldDate[options.name + "-display"];
									td.find("span.view").html(display);
									td.find("span.view").data("value",value);
									td.find("span.input input").val(display);
									td.find("span.input input").data("value",value).trigger("change");
									td.find("span.input select").val(value).trigger("change");
								}else{
									value = oldDate[options.name];
									td.find("span.view").html(value);
									td.find("span.view").data("value",value);
									td.find("span.input input").val(value);
									td.find("span.input input").data("value",value);
								}
							})
						};
						config.rowModelSaveEven(returnData);
						ES.get(window).resize();
						tr.removeClass("open");
						ES.get(self).find("."+rowModelSaveEl).unbind("click");
					});

					//取消编辑点击事件
					var cancelEl = ES.get(el).find("."+rowModelCancelEl);
					if(congeal.length > 0){
						cancelEl = congeal.find("tbody tr").eq(index).find("."+rowModelCancelEl);
					}
					cancelEl.unbind("click").bind("click",function () {
						var tr = ES.get(this).parents("tr.edit");
						if(ES.get("table.operation-bar-congeal").length > 0){
							tr = el;
						}
						tr.find("input").removeClass("error");
						ES.each(tr.find("td"),function (_,v) {
							var value = ES.get(v).find("span.view").data(),
								displayValue = ES.get(v).find("span.view").text().trim(),
								inputEl = ES.get(v).find("span.input");
							value = value ? value.value : "";
							if(inputEl.find("input").length > 0){
								inputEl.find("input").val(displayValue);
								inputEl.find("input").data("value",value);
								inputEl.find("input").trigger("change");
							}else if(inputEl.find("select").length > 0){
								inputEl.find("select").val(value);
								inputEl.find("select").trigger("change");
							}
							ES.get(v).find("span").removeClass("active");
							ES.get(v).find("span.view").addClass("active");
						});
						ES.get(self).find("."+rowModelCancelEl).unbind("click");
						if(config.rowModelCancelEven){
							config.rowModelCancelEven(tr);
						}
						tr.removeClass("open");
						ES.get(window).resize();
					});
					ES.get(window).resize();
				};
				if(enabledPattern == "dblclick"){
					//双击TR启动编辑模式
					tableEl.delegate("tr ." + config.enabledEl,"dblclick",function (e) {
						evenRealize(this);
						e.preventDefault()
					});
				}else if(enabledPattern == "click"){
					//单击TR启动编辑模式
					tableEl.delegate("tr ." + config.enabledEl,"click",function (e) {
						evenRealize(this);
						e.preventDefault()
					});
				}else if(enabledPattern == "clickOther"){
					//其他启动编辑模式方法--点击其他元素开启
					var congeal = ES.get("table.operation-bar-congeal");
					tableEl.delegate("tr ." + config.enabledEl,"click",function (e) {
						var trEl = ES.get(this).parents("tr"),
							index = trEl.index();
						if(congeal.length > 0){
							trEl = el.find("tbody tr").eq(index);
						}
						evenRealize(trEl);
						e.preventDefault();
					});
				}
				//页面刷新页面处于编辑模式提示
				$(window).bind('beforeunload', function () {
					if(el.find("tr.edit.open").length > 0 ){
						return false;
					}
				});
			}else{
				//单格编辑
				var cellEdit = function (config) {
					var th = tableEl.find("thead th").eq(config.td),
						td = tableEl.find("tbody tr").eq(config.tr).find("td").eq(config.td),
						options = th.attr("data-option") ? JSON.parse(th.attr("data-option")) : undefined;
					if(!options) return;
					var name = options.name,
						type = options.type,
						dataName = options.dataName || undefined,
						validateName = options.validate || "",
						eventName = options.eventName || undefined,
						display = td.text().trim(),
						value = td.attr("data-value") ? td.data().value || "" : "",
						id = name + "_" + config.tr,html = "",
						v = {
							dataName: dataName,
							el: id,
							name: name,
							type: type,
							validate: validateName,
							value: value,
							eventName: eventName
						};
					td.addClass("input");
					if(value != ""){
						html += "<span class='view active' data-value='"+value+"'>"+display+"</span>";
					}else{
						html += "<span class='view active'>"+display+"</span>";
					}
					if(type == "select"){
						html += "<span class='input'><select id='"+id+"'/></select></span>";
					}else if(type == "number") {
						html += "<span class='input'><input type='text' id='"+id+"' class='number' value='"+display+"'/></span>";
					}else if(type == "date"){
						html += "<span class='input'><input type='text' id='"+id+"' class='date' value='"+display+"'/></span>";
					}else if(type == "datetime"){
						html += "<span class='input'><input type='text' id='"+id+"' class='datetime' value='"+display+"'/></span>";
					}else{
						html += "<span class='input'><input type='text' id='"+id+"' value='"+display+"' data-value='"+value+"' class='needEmpty'/></span>";
					}
					td.html(html);
					controlCreate(v);
				};
				if(enabledPattern == "dblclick"){
					//单击点击启动编辑
					tableEl.delegate("tbody td","dblclick",function (e) {
						var index = ES.get(this).index(),
							th = tableEl.find("thead th").eq(index),
							trIndex = ES.get(this).parents("tr").index();
						if(ES.get(this).find("span.input").hasClass("active")){
							return;
						}
						if(th.hasClass("edit") && !ES.get(this).hasClass("input")){
							var conf = {"tr":trIndex,"td":index};
							cellEdit(conf);
						}
						ES.get(this).find("span").removeClass("active");
						ES.get(this).find("span.input").addClass("active");
						ES.get(this).find("span.input input,span.input select").focus();
						e.preventDefault()
					});
				}else if(enabledPattern == "click"){
					//单击点击启动编辑
					tableEl.delegate("tbody td","click",function () {

					});
				}
			}
		};
		//冻结表格头部
		var freezeHead = function () {
			var offsetTop = tableEl.offset().top,
				offsetLeft = tableEl.offset().left,
				windowWidth = ES.get(window).innerWidth(),
				tableHeight = tableEl.innerHeight(),
				tableWidth = tableEl.innerWidth(),
				fixHead = tableEl.find("thead").html(),
				scrollTop = ES.get(window).scrollTop(),
				breadCrumbsHeight = ES.get("div.bread-crumbs").innerHeight(), //固定栏面包屑高度
				headerHeight = ES.get("div#shell-header").innerHeight(), //固定栏头部高度
				fixHeight = breadCrumbsHeight + headerHeight,
				fixHeadTable = "<table class='js-fix-head fix-head'><thead>"+fixHead+"</thead></table>";
			tableEl.before(fixHeadTable);
			var fixHeadMethod = function () {
				tableEl.prev(".js-fix-head").show();
				tableEl.find("thead").css("visibility","hidden");
				scrollTop = ES.get(window).scrollTop();
				offsetTop = tableEl.offset().top;
				var top = offsetTop - (scrollTop + fixHeight);
				if(top >= 0){
					top = 0;
				}
				tableEl.prev(".js-fix-head").css({
					position: "relative",
					top: -top
				});
				tableEl.css({
					marginTop: - tableEl.prev(".js-fix-head").innerHeight()
				});
				tableHeight = tableEl.innerHeight();
				if(-top > tableHeight){
					tableEl.prev(".js-fix-head").hide();
				}
			};
			var setTheadWidth = function () {
				if($("#js-fix-head").length > 1){
					ES.each($("#js-fix-head"),function (_,v) {
						if(ES.get(v).next("table").is(":visible")){
							tableEl = ES.get(v).next("table");
							return true;
						}
					})
				}
				tableEl.css({
					width:"auto"
				});
				tableEl.prev(".js-fix-head").css({
					width:"auto"
				});
				tableWidth = tableEl.innerWidth();
				windowWidth = ES.get(window).innerWidth();
				//網站最小寬度1000px
				if(windowWidth <= 1000){
					windowWidth = 1001;
				}
				//網站最小寬度1000px
				if(tableWidth < windowWidth - offsetLeft){
					tableEl.css({
						width:"100%"
					});
					tableEl.prev(".js-fix-head").css({
						width:"100%"
					});
					tableWidth = tableEl.innerWidth();
					windowWidth = ES.get(window).innerWidth();
				}
				var th = tableEl.find("thead th");
				ES.each(th,function (_,v) {
					var width = ES.get(v).width(),
						index = ES.get(v).index();
					tableEl.prev(".js-fix-head").find("thead th").eq(index).width(width+"px");
				});
				tableEl.prev(".js-fix-head").width(tableWidth+"px");
			};
			ES.get(window).scroll(function () {
				fixHeadMethod();
			});
			ES.get(window).resize(function () {
				setTheadWidth();
			});
			fixHeadMethod();
			setTheadWidth();
		};

		var freezeBottomScroll = function () {

		};

		var assistBar = function () {
			var html = "<div class='js-assist-bar assist-bar'>" +
				"<ul class='assist-list'>"+
				'<li class="item js-asc"><i class="fa fa-sort-amount-asc"></i>Sort Ascending</li>'+
				'<li class="item js-desc"><i class="fa fa-sort-amount-desc"></i>Sort Descending</li>'+
				'<li class="line"></li>'+
				"<li class='item js-group'><i class='fa fa-align-justify'></i>Group by this column</li>"+
				"<li class='js-unGroup disabled'><i class='fa fa-minus-circle' aria-hidden='true'></i>unGroup</li>"+
				"</ul>"+
				"</div>";
			ES.get("body").append(html);
			var tableData = function () {
				var tr = tableEl.find("tbody tr"),
					returnData = [];
				//获取列表数据当列表大于500条数据不建议使用
				if(tr.length > 500){
					returnData = [];
					return;
				}else{
					ES.each(tr,function (_,v) {
						if(ES.get(v).hasClass("groupBy")){
							return true;
						}
						var value = ES.get(v).data("value"),
							trIndex = ES.get(v).index(),
							td = ES.get(v).find("td"),
							data = {},
							list = [];
						ES.each(td,function (k,vl) {
							var el = ES.get(vl),
								index = el.index(),
								tdData = {};
							tdData.index = index;
							tdData.value = el.text().trim();
							if(el.hasClass("input")){
								tdData.value = el.find("span.view").text().trim();
							}
							list.push(tdData);
						});
						data.value = value || "";
						data.list = list;
						data.index = trIndex;
						returnData.push(data);
					});
				}
				return returnData;
			};
			//生成辅助栏
			var setAuxiliaryBar = function () {
				var th = tableEl.find("thead th");
				ES.each(th,function (_,v) {
					if(ES.get(v).hasClass("nonAuxiliary")){
						return true;
					}
					var html = '<i class="fa fa-sort sort js-sort" aria-hidden="true"></i><div class="assist-operation js-show-assist" data-value="'+_+'"><i class="fa fa-bars" aria-hidden="true"></i></div>';
					ES.get(v).addClass("auxiliary").append(html);
					if(isFreezeHead){
						ES.get("table.js-fix-head").find("thead th").eq(ES.get(v).index()).addClass("auxiliary").append(html);
					}
				});
				ES.get(window).resize();
			};
			var sortData = function (data,index,type) {
				data.sort(function (a,b) {
					if(!a.list || !b.list){
						return 2;
					}
					var aValue = parseFloat(a.list[index].value) ? parseFloat(a.list[index].value) : a.list[index].value,
						bValue = parseFloat(b.list[index].value) ? parseFloat(b.list[index].value) : b.list[index].value;
					if(aValue > bValue){
						if(type == "asc"){
							return 1;
						}else{
							return -1;
						}
					}else if(aValue < bValue){
						if(type == "asc"){
							return -1;
						}else{
							return 1;
						}
					}else{
						return 0;
					}
				});
			}
			//生成新列表
			var viewNew = function (data,index,sortType) {
				var html = "";
				sortData(data,index,sortType);
				ES.each(data,function (_,v) {
					var data = "<tr data-value='"+v.value+"'>";
					ES.each(v.list,function (k,vl) {
						var tdEl = tableEl.find("tbody tr").eq(v.index).find("td").eq(k),
							cls = tdEl.attr("class") || "",
							value = "";
						if(tdEl.hasClass("input")){
							var html = tdEl.find("span.view").text().trim();
							value = tdEl.find("span.view").data() ? tdEl.find("span.view").data().value || "" : "";
							if(value != ""){
								data += "<td data-value='"+value+"' class='"+cls+"'>"+html+"</td>"
							}else{
								data += "<td class='"+cls+"'>"+html+"</td>";
							}
						}else{
							value = tdEl.attr("data-value") ? tdEl.data().value : undefined;
							var title = tdEl.attr("title") || undefined;
							data += "<td class='"+cls+"'";
							if(value){
								data += " data-value='"+value+"'";
							}
							if(title){
								data += " title='"+title+"'";
							}
							data += ">"+tdEl.html()+"</td>";
						}

					});
					data += "</tr>";
					html += data;
				});
				tableEl.find("tbody").html(html);
			};
			var group = function (data,index,sort) {
				var groupListName = {};
				sort = sort || {};
				var id = sort.index || index,
					type = sort.type || "asc";
				sortData(data,index,"asc");
				ES.each(data,function (_,v) {
					var value = v.list[index].value,
						trData = {};
					if(groupListName[value]){
						trData.index = v.index;
						trData.value = v.value;
						trData.list =  v.list;
						groupListName[value].data.push(trData);
					}else{
						groupListName[value] = {};
						groupListName[value].name = value;
						groupListName[value].data = [];
						groupListName[value].len = v.list.length;
						trData.index = v.index;
						trData.value = v.value;
						trData.list =  v.list;
						groupListName[value].data.push(trData);
					}
				});
				var html = "";
				ES.each(groupListName,function (p,value) {
					var len = value.len,
						eqOne = tableEl.find("thead th").eq(0).find("input");
					html += "<tr class='groupBy'>";
					if(eqOne.length > 0 && eqOne.attr("type") == "checkbox"){
						html += '<td><input class="select-item"type="checkbox"></td>';
						len -= 1;
					}
					html += "<td colspan='"+len+"' class='title'>"+value.name+"("+value.data.length+")</td></tr>";
					sortData(value.data,id,type);
					ES.each(value.data,function (_,v) {
						var data = "<tr data-value='"+v.value+"'>";
						ES.each(v.list,function (k,vl) {
							var tdEl = tableEl.find("tbody tr").eq(v.index).find("td").eq(k),
								cls = tdEl.attr("class") || "";
							if(tdEl.hasClass("input")){
								var html = tdEl.find("span.view").text().trim(),
									value = tdEl.find("span.view").data() ? tdEl.find("span.view").data().value || "" : "";
								if(value != ""){
									data += "<td data-value='"+value+"' class='"+cls+"'>"+html+"</td>"
								}else{
									data += "<td class='"+cls+"'>"+html+"</td>";
								}
							}else{
								data += "<td class='"+cls+"'>"+tdEl.html()+"</td>";
							}

						});
						data += "</tr>";
						html += data;
					});
				});
				tableEl.find("tbody").html(html);
				ES.get("div.js-assist-bar").attr("data-group",index);
			};
			//事件绑定
			var bindEven = function () {
				var showAssistBar = function (el) {
					var left = ES.get(el).offset().left,
						top = ES.get(el).offset().top,
						width = ES.get(el).innerWidth(),
						height = ES.get(el).innerHeight(),
						assistWidth = ES.get(".js-assist-bar").innerWidth(),
						cssPar = {
							left: left + width - assistWidth,
							top: top + height,
							visibility: "visible"
						};
					ES.get("div.js-assist-bar").data("value",ES.get(el).index());
					ES.get("div.js-assist-bar").css(cssPar);
				};
				tableEl.find("thead th.auxiliary").hover(function () {
					ES.get(this).find("div.js-show-assist").addClass("active");
					// showAssistBar(this);
				},function () {
					if(ES.get("div.js-assist-bar").css("visibility") == "hidden"){
						ES.get(this).find("div.js-show-assist").removeClass("active");
					}
				});
				if(isFreezeHead){
					ES.get("table.js-fix-head").find("thead th.auxiliary").hover(function () {
						ES.get(this).find("div.js-show-assist").addClass("active");

					},function () {
						var id = ES.get("div.js-assist-bar").data("value") || -1,
							index = ES.get(this).index();
						if(ES.get("div.js-assist-bar").css("visibility") == "hidden" || id != index){
							ES.get(this).find("div.js-show-assist").removeClass("active");
						}
					});
				}
				ES.get("div.js-show-assist").unbind("click").bind("click",function () {
					ES.get("div.js-show-assist").removeClass("active");
					ES.get(this).addClass("active");
					var el = ES.get(this).parents("th.auxiliary");
					showAssistBar(el);
				});
				ES.get("div.js-assist-bar li.js-asc").unbind("click").bind("click",function () {
					var data = tableData(),
						id = ES.get("div.js-assist-bar").data("value");
					if(tableEl.find("tr.groupBy").length > 0){
						var sort = {},
							index = ES.get("div.js-assist-bar").attr("data-group");
						sort.index = id;
						sort.type = "asc";
						group(data,index,sort);
					}else{
						viewNew(data,id,"asc");
					}
					ES.get("div.js-assist-bar").css("visibility","hidden");
					ES.get("div.js-show-assist").removeClass("active");
				});

				ES.get("div.js-assist-bar li.js-desc").unbind("click").bind("click",function () {
					var data = tableData(),
						id = ES.get("div.js-assist-bar").data("value");
					if(tableEl.find("tr.groupBy").length > 0){
						var sort = {},
							index = ES.get("div.js-assist-bar").attr("data-group");
						sort.index = id;
						sort.type = "desc";
						group(data,index,sort);
					}else{
						viewNew(data,id,"desc");
					}
					ES.get("div.js-assist-bar").css("visibility","hidden");
					ES.get("div.js-show-assist").removeClass("active");
				});

				ES.get("div.js-assist-bar li.js-group").unbind("click").bind("click",function () {
					var data = tableData(),
						id = ES.get("div.js-assist-bar").data("value");
					group(data,id);
					ES.get("div.js-assist-bar").css("visibility","hidden");
					ES.get("div.js-show-assist").removeClass("active");
					ES.get("div.js-assist-bar li.js-unGroup").removeClass("disabled").addClass("item");
				});

				ES.get("div.js-assist-bar li.js-unGroup").unbind("click").bind("click",function () {
					if(ES.get(this).hasClass("disabled")){
						return;
					}
					var data = tableData(),
						id = ES.get("div.js-assist-bar").data("value");
					viewNew(data,id,"asc");
					ES.get("div.js-assist-bar").css("visibility","hidden");
					ES.get("div.js-show-assist").removeClass("active");
					ES.get("div.js-assist-bar li.js-unGroup").addClass("disabled").removeClass("item");
				});
			};
			setAuxiliaryBar();
			bindEven();
		};
		if(isEdit){
			edit(config.editConfig);
		}
		if(isFreezeHead){
			freezeHead(config.freezeConfig);
		}
		if(isAssistBar){
			assistBar(config.AssistBarConfig);
		}
	};
	var ret = new grid(config);
	return ret;
};


//congeal table bar
//@parameter elClass 必填 表格Class/可为Id或者class
//@parameter congealBarClass /非必填 固定操ClassName/固定在左或右需要在表格的thead的th加上data-value="left or right"
ES.ui.congealTableBarForSelf = function (elClass,congealBarClass, scrollTarget, config) {
	var thHeight = 0,
		dTime = new Date().getTime(),
		barLeftId = 'left-bar-' + dTime,
		barLeftColumnId = 'left-column-' + dTime,
		barRightId = 'right-bar-' + dTime,
		barRightColumnId = 'right-column-' + dTime,
		el = ES.get("table#"+elClass).length > 0 ? ES.get("table#"+elClass) : ES.get("table."+elClass),
		elParent = el.parent("div");
	var getTableBody = function(index){
		el =  ES.get("table#"+elClass).length > 0 ? ES.get("table#"+elClass) : ES.get("table."+elClass);
		var trList = el.find("tbody tr");
		var tableBodyHtml = "";
		tableBodyHtml += "<tbody>"
		ES.each(trList,function(_,v){
			tableBodyHtml += "<tr>"
			var trIndex = ES.get(v).index();

			for(var i = 0 ; i < index.length ; i ++){
				var cls = cls = ES.get(v).find("td").eq(index[i]).attr("class");
				var  tdHeight = el.children("tbody").find("tr").eq(trIndex).innerHeight();
				tableBodyHtml += "<td style='height: "+tdHeight+"px;' class='"+cls+"'>"+ES.get(v).find("td").eq(index[i]).html()+"</td>";
			}
			tableBodyHtml += "</tr>"
		});
		tableBodyHtml += "</tbody>";
		return tableBodyHtml;
	}
	var congealBar = function(){
		var congealBarList = ES.get("table.sticky-enabled").find("."+congealBarClass);
		var barHtml = "",
			leftList = [],
			rightList = [],
			leftHeadHtml = '<tr>',
			rightHeadHtml = '<tr>';
		ES.each(congealBarList,function(_,v){
			var value = ES.get(v).html(),
				align = ES.get(v).attr("data-value"),
				index = ES.get(v).index(),
				width  = ES.get(v).innerWidth(),
				cls = ES.get(v).attr("class");
			if(config && config.isBriefOperation){
				width += 1;
			}
			if(align == "left"){
				leftList.push(ES.get(v).index())
				leftHeadHtml += "<th class='congeal-head "+cls+"' data-index='"+index+"' style='width:"+width+"px'>"+value+"</th>"
			}else if(align == "right"){
				rightList.push(ES.get(v).index())
				rightHeadHtml += "<th class='congeal-head "+cls+"' data-index='"+index+"' style='width:"+width+"px'>"+value+"</th>"
			}

		});
		leftHeadHtml += '</tr>';
		rightHeadHtml += '</tr>';

		if(leftList.length > 0){
			var tableBodyHtml = getTableBody(leftList);
			barHtml += "<table class='operation-bar-congeal left' id='"+barLeftId+"'><thead>"+leftHeadHtml+"</thead>"+tableBodyHtml+"</table>"
			barHtml += "<table class='operation-column-congeal' id='"+barLeftColumnId+"'><thead>"+leftHeadHtml+"</thead></table>"
		}
		if(rightList.length > 0){
			var tableBodyHtml = getTableBody(rightList);
			barHtml += "<table class='operation-bar-congeal right' id='"+barRightId+"'><thead>"+rightHeadHtml+"</thead>"+tableBodyHtml+"</table>"
			barHtml += "<table class='operation-column-congeal' id='"+barRightColumnId+"'><thead>"+rightHeadHtml+"</thead></table>"
		}
		el.parent("div").append(barHtml);
		ES.get("#"+barLeftId).delegate("tbody input","change",function () {
			var index = ES.get(this).parents("tr").index(),
				tdIndex = ES.get(this).parents("td").index(),
				isSelected = ES.get(this).prop("checked");
			el.find("tbody tr").eq(index).find("td").eq(tdIndex).find("input").prop("checked",isSelected).trigger("change");
		});
		ES.get("#"+barRightId).delegate("tbody input","change",function () {
			var index = ES.get(this).parents("tr").index(),
				tdIndex = ES.get(this).parents("td").index(),
				isSelected = ES.get(this).prop("checked");
			el.find("tbody tr").eq(index).find("td").eq(tdIndex).find("input").prop("checked",isSelected).trigger("change");
		});
	}
	var displayCongealTop = function (id) {
		var elTop = el.offset().top + el.outerHeight() - ES.get("#"+id).outerHeight();
		var scpTop = ES.get(document).scrollTop()　+ ES.get("#shell-header-inner").outerHeight();
		if (elTop > scpTop) {
			ES.get("#"+id).show();
		} else {
			ES.get("#"+id).hide();
		}
	}
	var scroll = function () {
		//thead:visible
		if (el.children("thead").offset()) {
			var affix = elParent.children('table.sticky-thead:visible')
			var scrollHeight = scrollTarget.scrollTop()


			affix.css({
				top: scrollHeight
			})

			if(ES.get("#"+barRightColumnId).length > 0){
				displayCongealTop(barRightColumnId)
			}
			if(ES.get("#"+barLeftColumnId).length > 0){
				displayCongealTop(barLeftColumnId)
			}
		}
	}

	var setCongealBarStyle = function(){
		var congealRight = elParent.find("table#" + barRightId + " thead th"),
			congealRightTop = elParent.find("table#" + barRightColumnId + " thead th"),
			congealLeft = elParent.find("table#" + barLeftId + " thead th"),
			congealLeftTop = elParent.find("table#" + barLeftColumnId + " thead th"),
			elTable = el.children("tbody"),
			tableCongealLeft = elParent.find("table#" + barLeftId).children("tbody"),
			tableCongealRight = elParent.find("table#" + barRightId).children("tbody");
		if(congealRight.length > 0){
			ES.each(congealRight,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead tr:last-child").find('th').eq(index).width();
				ES.get(v).width(width);
			});
			ES.each(congealRightTop,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead tr:last-child").find('th').eq(index).width();
				ES.get(v).width(width);
			})
		}
		if(congealLeft.length > 0){
			ES.each(congealLeft,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead th").eq(index).width();
				ES.get(v).width(width);
			});
			ES.each(congealLeftTop,function (_,v) {
				var index = ES.get(v).attr("data-index");
				var width = el.nextAll("table.sticky-thead").find("thead th").eq(index).width();
				ES.get(v).width(width);
			})
		}
		var initTableCongeal = function () {
			tableCongealLeft = elParent.find("table#" + barLeftId).children("tbody");
			tableCongealRight = elParent.find("table#" + barRightId).children("tbody");
		}
		elTable.find("tr").hover(function () {
			var index = ES.get(this).index();
			initTableCongeal();
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).addClass("hoverTr");
			}
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).addClass("hoverTr");
			}
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
		},function () {
			var index = ES.get(this).index();
			initTableCongeal();
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).removeClass("hoverTr");
			}
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).removeClass("hoverTr");
			}
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
		});
		elTable.find("tr").hover(function () {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
		},function () {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
		})
		elParent.delegate("table#" + barLeftId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
			e.preventDefault();
		})
		elParent.delegate("table#" + barLeftId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
			e.preventDefault();
		})
		elParent.delegate("table#" + barRightId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").addClass("selected");
			e.preventDefault();
		})
		elParent.delegate("table#" + barRightId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			tableCongealRight.children("tr").eq(index).find("td.brief div.action-dropdown").removeClass("selected");
			e.preventDefault();
		})

		elParent.delegate("table#" + barLeftId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).addClass("hoverTr");
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).addClass("hoverTr");
			}
			e.preventDefault();
		})

		elParent.delegate("table#" + barLeftId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).removeClass("hoverTr");
			if(tableCongealRight.length > 0){
				tableCongealRight.children("tr").eq(index).addClass("hoverTr");
			}
			e.preventDefault();
		})

		elParent.delegate("table#" + barRightId + " tr","mouseover",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).addClass("hoverTr");
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).removeClass("hoverTr");
			}
			e.preventDefault();
		})

		elParent.delegate("table#" + barRightId + " tr","mouseout",function (e) {
			var index = ES.get(this).index();
			initTableCongeal();
			elTable.children("tr").eq(index).removeClass("hoverTr");
			if(tableCongealLeft.length > 0){
				tableCongealLeft.children("tr").eq(index).removeClass("hoverTr");
			}
			e.preventDefault();
		})
		elParent.delegate("div.action-dropdown","click",function () {
			ES.get(this).addClass("current");
			ES.get(this).find(".aui-list").show();
		})
	}
	var headSticker = function() {
		var $t = ES.get("table." + elClass);
		$t.parent("div").children("table.sticky-thead").remove();
		if($t.find("thead").length > 0 && $t.find("th").length > 0){
			var $thead = $t.children("thead").clone(),
				operationItems = ES.get("."+congealBarClass),
				congealRightIndex = -1;
			ES.each(operationItems,function (_,v) {
				if(config && ES.get(v).data().value == "right" && config.isBriefOperation){
					congealRightIndex = ES.get(v).index();
					ES.get(v).addClass("brief");
				}
			})
			if(config && config.isBriefOperation && operationItems.length > 0 && congealRightIndex >= 0){

				var operationTr = $t.find("tbody tr");
				ES.each(operationTr,function (_,v) {
					var html = '<div class="action-dropdown"><i class="fa fa-cog fa-fw"></i><i class="fa fa-sort-desc"></i><div class="aui-list">'+ES.get(v).find("td").eq(congealRightIndex).html()+'</div></div>';
					ES.get(v).find("td").eq(congealRightIndex).addClass("brief").html(html);
				})
			}
			var outerWidth = "auto";
			$t.css("width",outerWidth);
			var divWidth = $t.parent("div").innerWidth();
			var tableWidth = $t.innerWidth();
			if(tableWidth < divWidth) {
				outerWidth = "100%"
			}
			thHeight = $t.children("thead").outerHeight()
			$t.addClass('sticky-enabled')
				.css({
					margin: 0,
					width: outerWidth,
					"marginBottom" : "-" + thHeight + "px"
				})
			$t.after('<table class="sticky-thead" />')
			$thead = $t.children("thead").clone();
			var $stickyHead = $t.siblings('.sticky-thead')
			$stickyHead.html($thead)
			var setWidths = function () {
				$t.find('thead th').each(function (i) {
					$stickyHead.find('th').eq(i).width($(this).width())
				})
				$stickyHead.width($t.width())
			}
			setWidths()
			scroll();
			setCongealBarStyle();
		}
	}
	var selectedBindEven = function () {
		var congealList = ES.get(".operation-bar-congeal");
		var evenChange = function (e) {
			var type = ES.get(e).attr("type"),
				tr = ES.get(e).parents("tr"),
				congealEl = "";
			if(congealList.length > 0){
				ES.each(congealList,function (_,v) {
					if(ES.get(v).hasClass("left")){
						tr = el.find("tbody tr").eq(tr.index());
						congealEl = ES.get(v);
						return false;
					}
				})
			}
			if(type != "checkbox"){
				return;
			}
			var selected = ES.get(e).prop("checked");
			if(selected){
				tr.addClass("active");
				tr.find("td").eq(0).addClass("frozen");
				if(congealList.length > 0){
					congealEl.find("tbody tr").eq(tr.index()).find("td").eq(0).addClass("frozen");
					congealEl.find("tbody tr").eq(tr.index()).addClass("active");
				}
			}else{
				tr.removeClass("active");
				tr.find("td").eq(0).removeClass("frozen");
				if(congealList.length > 0){
					congealEl.find("tbody tr").eq(tr.index()).find("td").eq(0).removeClass("frozen");
					congealEl.find("tbody tr").eq(tr.index()).removeClass("active");
				}
			}
		}
		el.delegate("tbody td input","change",function () {
			evenChange(this);
		});
		if(congealList.length > 0){
			ES.each(congealList,function (_,v) {
				if(ES.get(v).hasClass("left")){
					ES.get(v).delegate("tbody td input","change",function () {
						evenChange(this);
					})
					return false;
				}
			})
		}
		el.delegate("tbody tr","click",function (e) {
			var congealEl = "";
			if(e.target.tagName == "INPUT" && e.target.type == "checkbox"){
				return;
			}
			if(congealList.length > 0){
				ES.each(congealList,function (_,v) {
					if(ES.get(v).hasClass("left")){
						congealEl = ES.get(v);
						return false;
					}
				})
			}
			var index = ES.get(this).index();
			if(config.single){
				el.find("tbody tr").removeClass("active");
				el.find("tbody td").removeClass("frozen");
				ES.get("table.operation-bar-congeal tbody tr").removeClass("active");
				ES.get(this).parent("tbody").find("td input").prop("checked",false).trigger("change");
				if(congealEl.length > 0){
					congealEl.find("tbody").find("td input").prop("checked",false).trigger("change");
				}
				ES.get(this).addClass("active");
				ES.get(this).find("td").eq(0).addClass("frozen");
				ES.get("table.operation-bar-congeal tbody tr").eq(index).addClass("active");
				var tdInput = ES.get(this).find("td").eq(0).find("input");
				if(tdInput.length > 0 && tdInput.attr("type") == "checkbox"){
					ES.get(this).find("td").eq(0).find("input").prop("checked",true).trigger("change");
					if(congealEl.length > 0){
						congealEl.find("tbody tr").eq(ES.get(this).index()).find("td").eq(0).find("input").prop("checked",true).trigger("change");
					}
				}
			}else{
				if(ES.get(this).hasClass("active")){
					ES.get("table.operation-bar-congeal tbody tr").eq(index).removeClass("active");
					ES.get(this).removeClass("active");
				}else{
					ES.get(this).addClass("active");
					ES.get("table.operation-bar-congeal tbody tr").eq(index).addClass("active");
				}
			}
		});
	};
	headSticker();
	if(ES.get("."+congealBarClass).length > 0){
		congealBar();
	}
	ES.get(window).resize(function(){
		ES.client_height = document.documentElement.clientHeight
		ES.client_width = document.documentElement.clientWidth
		headSticker()
	})
	if(config && config.isEvenSelected){
		selectedBindEven();
	};
	scrollTarget.scroll(scroll)
	ES.get(window).resize()
}