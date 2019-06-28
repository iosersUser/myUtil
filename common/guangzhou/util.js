ES.deploy = '${TRUCK_DEPLOY}'
ES.sso_truck={
    'login':'${SSO_LOGIN_URL}',
    'loginType':'${SSO_LOGIN_TYPE}',
    'timeout':'${SSO_TIME_OUT_URL}',
    'sso_logout':"${SSO_LOG_OUT_URL}",
    'info_logout':"${SSO_INFO_LOG_OUT_URL}"
}

ES.tpl.menu_tpl = [
    '<div class="menu-operation">{{menuOpt}} <i class="fa fa-outdent menu-retract"></i> </div>',
    '<div class="menu-operation-open">{{menuOptOpen}} <i class="fa fa-indent"></i> <div class="open-menu-info">{{menuOpen}}</div></div>',
    '{{#if menus}}<ul class="menus">',
    '	{{#each menus}}',
    '		{{#if parent}}',
    '			<li class="main-nav-left menu"><a href="' + ES.deploy + '{{url}}" {{#if isBlank}}target="_blank"{{/if}}><span>{{name}}</span> <span class="trangle"></span></a></li>',
    '		{{else}}',
    '			<li class="main-nav-left title" data-value="{{id}}"><i class="iconfont-menu {{iconClass}}"></i><span> {{name}}</span></li>',
    '  		{{/if}}',
    '	{{/each}}',
    '</ul>{{/if}}'
].join('');

ES.menu_show = function (config, callback) {
    var url = '/user/menu'
    var activeButtonConfig = null
    ES.util.ajax_get(url, {}, function (res) {
        if(res.menus.length == 0){
            ES.ui.alert({
                key: "当前账号未分配权限，请联系管理员！",
                auto_hide: false
            })
            return
        }
        res.menus.sort(function (a, b) {
            return (a.parentSeq || 0) - (b.parentSeq || 0)
        })
        var findAllParents = function (list) {
            var ret = []
            var temp = []
            ES.each(list, function (_, menu) {
                if (menu.parent && temp.indexOf(menu.parent) < 0) {
                    temp.push(menu.parent)
                    ret.push({
                        name: menu.parent,
                        id: menu.parentId,
                        parent: null,
                        url: null
                    })
                }
                if(window.location.href.indexOf(menu.url) >= 0 && menu.url){
                    activeButtonConfig = menu
                }
            })
            return ret
        }

        Handlebars.registerHelper('username', function () {
            return ES.user.userName
        })
        var findAllChirden = function (parent, list) {
            var ret = []
            // var blankList = ['OPERATIONAL_DATA','TOP30_OPERATIONAL_DATA','CARRIER_OPERATIONAL_DATA']
            var blankList = ['DATAV_VIEW']  // 运营数据可视化
            ES.each(list, function (index, menu) {
                if (menu.parent && menu.parent === parent) {
                    menu.isBlank = blankList.indexOf(menu.parentId) >= 0 ? true : false
                    ret.push(menu)
                }
            })
            return ret
        }

        var sorted = []
        var list = res.menus
        var parents = findAllParents(list)
        var menuIconMap = {
            'TRANSACTION': 'icon-dating',// 交易大厅
            'ORDER': 'icon-yewuguanli', // 业务管理
            'ACCOUNTING_BUYER': 'icon-tongji', //统计
            'USER_MANAGEMENT': 'icon-yonghuguanli', //用户管理
            'COMPANY_MANAGE': 'icon-qiyeguanli', //企业管理
            'TRANSACTION_SELLER': 'icon-dating', //货源大厅
            'FINANCE_SELLER': 'icon-caiwuguanli', //财务管理
            'TERMINAL_SERVICE': 'icon-iconmt', //码头服务
            'SUBSIDY_RECORD': 'icon-gonggongfuwu', //公共服务
            'FLEET_BASIC_DATA': 'icon-jichushuju', //基础数据
            'TARIFF_MANAGEMENT': 'icon-yunjiaguanli', //运价本管理
            'COMPANY_RECORD_MANAGEMENT': 'icon-beian', //外线集装箱车辆备案管理
            'SUBSIDY_RECORD_MGT': 'icon-gonggongfuwu' //公共服务管理
        }
        ES.each(parents, function (i, parentmenu) {
            var children = findAllChirden(parentmenu.name, list)
            if (parentmenu.id === 'COUPON') {
                parentmenu.name = parentmenu.name + '(' + res.couponSize + ')'
            }
            parentmenu.iconClass = menuIconMap[parentmenu.id] || 'icon-caidan'

            sorted.push(parentmenu)
            sorted = sorted.concat(children)
        })

        var template = Handlebars.compile(ES.tpl.menu_tpl)

        ES.get('#personal-info-left').append(template({
            menuOpt: ES.msg.get('closeMenu'),
            menuOpen: ES.msg.get('openMenu'),
            menus: sorted,
            maintitle: ES.msg.my_sea
        }))
        ES.get('#personal-info-left .menu').on('click', function () {
            var href = $(this).find('a').attr('href')
            $(this).find('a').attr('href', href)
        })

        ES.get('.info-basic').hide()

        //当前页面菜单高亮
        ES.each(ES.get('#personal-info-left .menu'), function (_, item) {
            if (location.pathname.indexOf('booking-list.') >= 0 || location.pathname.indexOf('booking-list-seller') >= 0) {
                //$(item).addClass('active')
                ES.each(ES.get('#personal-info-left .menu'), function (i, inner_item) {
                    if (ES.get(inner_item).children().attr('href').indexOf('view-order') >= 0 || ES.get(inner_item).children().attr('href').indexOf('booking-list') >= 0 || ES.get(inner_item).children().attr('href').indexOf('booking-list-seller') >= 0) {
                        ES.get(inner_item).addClass('active')
                        return false
                    }
                })
                return false
            } else {
                var locationName = location.pathname;
                if (ES.lang == "en-us") {
                    locationName = location.pathname.replace("-en", "")
                }
                if (ES.get(item).children().attr('href').indexOf(locationName) >= 0) {
                    ES.get(item).addClass('active')
                }
            }
        })

        //菜單收放
        ES.get('#personal-info-left .title').on('click', function () {
            var toggleMenu = function (item) {
                if (item.next().hasClass('menu')) {
                    item.next().toggle()
                    toggleMenu(item.next())
                }
            }
            toggleMenu(ES.get(this))
        })

        ES.get('#personal-info-left .title').trigger('click')

        //左侧菜单
        var leftWidth = 137;
        var retractWidth = 30;
        if (ES.lang == "en-us") {
            retractWidth = 36;
        }
        if(ES.util.isBuyer()) {
            leftWidth = 165
        } else if(ES.util.isSeller()) {
            leftWidth = 170
        } else if(ES.util.isReviewer()) {
            leftWidth = 230
        } else {
            leftWidth = 230
        }
        ES.get('.menu-operation').click(function () {
            ES.get('.menu-operation-open').show()
            ES.get('.menu-operation').hide()
            ES.get('.menus').hide()
            ES.get('#personal-info-left').css({
                'width': retractWidth
            })
            var width = ES.get('#personal-info-right').width()
            ES.get('#personal-info-right').css({
                'width': leftWidth - retractWidth + width,
                'margin-left': retractWidth
            })
            ES.get(window).resize()
        })

        ES.get('.menu-operation-open').click(function () {
            ES.get('.menu-operation-open').hide()
            ES.get('.menu-operation').show()
            ES.get('.menus').show()
            ES.get('#personal-info-left').css({
                'width': leftWidth
            })
            var width = ES.get('#personal-info-right').width()
            ES.get('#personal-info-right').css({
                'width': width - (leftWidth - 30),
                'margin-left': leftWidth
            })
            ES.get(window).resize()
        })


        ES.util.truck_breadcrumb(config)
        //如果没有匹配合适的路径   则取menus 里面 合适的url
        // 车队页面导向限制 特殊处理 
        if(ES.user.userGroup == "Seller"){
        	if(!activeButtonConfig){
        		for(var x = 0; x < res.menus.length; x++){
        			//剔除详情
        			if(res.menus[x].parentSeq){
        				ES.util.redirect(res.menus[x].url.split("/")[2])
        				return
        			}
        		}
        		return
        	}
        }
        callback && callback(activeButtonConfig)
    })
}

ES.util.truck_breadcrumb = function (config) {
    ES.each(ES.get('#personal-info-left .title'), function (index, item) {
        ES.each(ES.consts.menu_default_open, function (i, v) {
            if($(item).data('value') == v){
                $(item).trigger('click')
                return true
            }
        })
    })

    //放开当前子菜单所在的一组菜单，同时返回父菜单名
    function openMenu() {
        var name = ''
        ES.each(ES.get('.menus .active').prevAll(), function (_, item) {
            if ($(item).hasClass('title')) {
                name = $(item).find('span').html()
                var memuvalidate = function (value) {
                    var result = true
                    ES.each(ES.consts.menu_default_open, function (i, v) {
                        if(value == v) {
                            result = false
                            return
                        }
                    })
                    return result
                }

                if(memuvalidate($(item).data('value'))) $(item).trigger('click')

                return false
            }
        })
        return name
    }

    var parentNode = openMenu()
    ES.util.ajax_get("/message_push/import_remind",{},function (res) {
        var showMarquee = ''
        if(res.messageInfo){
            showMarquee = res.messageInfo
        }
        if(config && config.items){
            var template = Handlebars.compile(ES.get('#breadcrumb-detail-tpl').html())
            if(showMarquee) {
                config.showMarquee = showMarquee
            }
            ES.get('.bread-crumbs').html(template(config))
        } else {
            var activeMenu = ES.get('.menus').find('.active')
            var childNode = activeMenu.find('a span:eq(0)').html()
            if(ES.get('#breadcrumb-tpl').html() != void 0){
                var template = Handlebars.compile(ES.get('#breadcrumb-tpl').html())
                var objMenu = {
                    "parent-node": parentNode,
                    "child-node": childNode
                }
                if(showMarquee){
                    objMenu.showMarquee = showMarquee
                }
                ES.get('.bread-crumbs').html(template(objMenu))
            }
        }
    })
}

ES.truck_show = function () {
    ES.get('#shell-header-language a').click(function () {
        ES.lang = ES.get(this).data('value')
        $.cookie('lang', ES.lang, {
            expires: 365,
            path: '/'
        })
        location.reload()
    })
    var tracking_input = ES.ui.input({
        el: 'trackingNo',
        placeholder: ES.msg.get('inputTracking'),
        cls: 'tracking-input',
        label: ES.msg.get('cargoTracking') + '',
        after_labels: ['<a id="search_tracking"></a>']
    })

    ES.mvx.add(tracking_input)

    var tracking_btn = ES.ui.button({
        el: 'search_tracking',
        cls: 'tracking-btn',
        text: '<i class="fa fa-search" aria-hidden="true"></i>',
        onclick: function () {
            if(!ES.util.isBuyer()){
                ES.util.redirect('order-detail.html?no=' + tracking_input.get_value())
            }else{
                ES.util.redirect('order-detail.html?no=' + tracking_input.get_value())
            }
        }
    })
    ES.mvx.add(tracking_btn)
    $('#login-head').click(function () {
        if (ES.user) {
            //ES.util.authority_redirect(ES.user.authorities)
            ES.util.redirect('truck-home.html')
        } else {
            ES.util.redirectLogin()
            // ES.util.redirect('login.html')
        }
    })

    $('#shell-wrap').css({
        visibility: 'visible'
    })
    $('#shell-nav-wrap').css({
        visibility: 'visible'
    })
    $('#shell-search').css({
        visibility: 'visible'
    })
    $('#shell-top-inner').css({
        visibility: 'visible'
    })
    if (ES.client_width <= 1300) {
        ES.get('.weixin-wrap').css({
            'right': '-100px'
        }).hover(function () {
            ES.get(this).animate({
                'right': '0'
            })
        }, function () {
            ES.get(this).animate({
                'right': '-100px'
            })
        })
    }
    ES.get('.weixin-wrap').show()

    ES.get('#to-top a').eq(1).click(function () {
        ES.util.scroll_to_top(0)
    })
    ES.get('#to-top a').eq(2).mouseover(function () {
        $('.app_code').show()
    }).mouseout(function () {
        $('.app_code').hide()
    })

    ES.get('#to-top').hover(function () {
        ES.get(this).stop().animate({
            right: 0
        })
    }, function () {
        ES.get(this).stop().animate({
            right: -45
        })
    })

    // resize window

    var init = function () {
        if(ES.util.isBuyer()) {
            ES.get('#personal-info-left').css('width', '165px')
            ES.get('#personal-info-right').css('margin-left', '165px')
        } else if(ES.util.isSeller()) {
            ES.get('#personal-info-left').css('width', '170px')
            ES.get('#personal-info-right').css('margin-left', '170px')
        }
        ES.get('.main-body').scroll(scroll)
        resize(20)
        ES.get(window).resize(function () {
            ES.client_height = document.documentElement.clientHeight
            ES.client_width = document.documentElement.clientWidth
            resize(0)
        })
    }
    var resize = function (offset) {
        var leftNav = ES.get('#personal-info-left')
        var mainBody = ES.get('#personal-info-right')
        var width = ES.client_width
        var height = ES.client_height - 69
        var padding = 15
        var widthLeft = leftNav.width()
        var widthBody = width - widthLeft - 2 * padding - offset
        if (width <= 1000) {
            widthLeft = widthLeft
            widthBody = 850
        }
        leftNav.css({
            'width': widthLeft,
            'height': height,
            'overflow-y': 'auto'
        })
        mainBody.css({
            'padding': '38px ' + padding + 'px ' + padding + 'px ' + padding + 'px',
            'width': widthBody
        })
        var footerHeight = ES.get('#shell-footer-copyright').outerHeight()
        var paddingTop = 38
        $('#personal-info-right').scroll().css({
            'min-height': height - footerHeight - paddingTop - padding - 1
        })
        ES.get('#shell-footer').show()
    }
    init()
}
ES.util.ajax = $.ajax

ES.util.ajax_get = function (url, param, callback, scope, arg, error) {
    url = ES.deploy + '/ws-truck' + url + '${EXT}'
    return $.ajax({
        url: url,
        cache: false,
        context: scope,
        dataType: 'json',
        data: param,
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }

            } else {
                callback(res, arg)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                if (ES.lang == "en-us") {
                    key = ES.msg.get("login_first")
                }
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardRedirectLogin();
                        //ES.util.forwardredirect('login.html')
                        // window.location.href = ES.sso_truck.login
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        if (error) {
                            error()
                        }
                    }
                })
            }
        }
    })
}
ES.util.ajax_post = function (url, param, callback) {
    url = ES.deploy + '/ws-truck' + url
    return $.ajax({
        type: "POST",
        url: url,
        data: param,
        headers: {
            'X-Requested-By': 'eshipping'
        },
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }
            } else {
                callback(res)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardRedirectLogin()
                        //ES.util.forwardredirect('login.html')
                        // window.location.href = ES.sso_truck.login
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error'
                })
            }
        }
    })
}
ES.util.ajax_submit = function (url, param, callback, error) {
    url = ES.deploy + '/ws-truck' + url
    return $.ajax({
        type: 'POST',
        url: url,
        data: ES.stringify(param),
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        headers: {
            'X-Requested-By': 'eshipping'
        },
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }
            } else {
                callback(res)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardRedirectLogin()
                        // ES.util.forwardredirect('login.html')
                        // window.location.href = ES.sso_truck.login
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        if (error) {
                            error()
                        }
                    }
                })
            }

        }
    });
}
ES.util.cross_get = function (url, param, callback, scope) {
    $.ajax({
        url: url,
        cache: false,
        context: scope,
        jsonp: "callback",
        dataType: "jsonp",
        data: param,
        success: function (res) {
            if (res.message) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: res.message,
                    type: 'error'
                })
                if (res.stackTrace) {
                    console.log(res.stackTrace);
                }
            } else {
                callback(res)
            }
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: 'network_error_key',
                    type: 'error'
                })
                return
            }
            var key = 'ajax_failed'
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = []
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                })
                key = out.join('<br>')
            }
            ES.ui.unmask()
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardredirect('login.html')
                    }
                })
            } else {
                ES.ui.alert({
                    title: ES.msg.get('tuochetong'),
                    key: key,
                    type: 'error'
                })
            }
        }
    })
}
ES.util.bind_data = function (data, url, param, el, value, isNull) {
    if (el && data.length == 0) {
        if (isNull) {
            data.push({
                value: '',
                display: ES.msg.get('all')
            })
        }
        ES.util.ajax_get(url, param || {}, function (res) {
            ES.get(res.datas).each(function (_, v) {
                data.push({
                    value: v.code,
                    display: v.name
                })
            })
            if (el) {
                el.bind_list(data)
            }
            if (value) {
                el.set_value(value)
            }
        })
    } else {
        if (el) {
            el.bind_list(data)
        }
        if (value) {
            el.set_value(value)
        }
    }

}


ES.util.advancedQuery = function($el, array) {
	if ($el.length < 0) {
		return []
	}
	var _array = [];
	return function() {
		$el.each(function(i) {
			_array[_array.length] = $(this).attr("name")
		})
		if (array) {
			_array = _array.concat(array);
		}
		return _array
	}()
}

ES.util.advancedQueryBtn = function(callback) {
	ES.ui.button({
		el: 'advancedQueryBtn',
		text: "",
		cls: 'btn',
		onclick: function() {
			if($("[advancedQuery]").parents(".input-wrap").css("display") != "none"){
				$("[advancedQuery]").attr("advancedQuery", false);
				$("[advancedQuery]").parents(".input-wrap").hide("fast");
                $(this).removeClass('active');
			}else{
				$("[advancedQuery]").attr("advancedQuery", true);
				$("[advancedQuery]").parents(".input-wrap").show("fast");
                $(this).addClass('active');
			}
			if(callback){
				callback()
			}
		}
	})
	$('#advancedQueryBtn').trigger('click')
}

// 基于 jquery-form 插件，用ajax提交form
// 上传文件时使用
// options {formId:'x', data: {}, beforeSubmit:function(){}, success: function(){}}
ES.util.ajax_submit_form = function(options) {
    var form,
        para

    para = {
        dataType: options.dataType || 'json',
        headers: {
            'X-Requested-By': 'eshipping'
        },
        beforeSubmit: function () {
            return options.beforeSubmit && options.beforeSubmit()
        },
        data: options.data || {},
        success: function (res) {
            options.success && options.success(res)
        },
        error: function (res) {
            if (res.status == 408) {
                ES.ui.alert({
                    key: 'network_error_key',
                    type: 'error'
                });
                return
            }
            var key = 'ajax_failed';
            if (res.responseJSON && res.responseJSON.message) {
                key = res.responseJSON.message
            } else if (res.responseJSON && $.isArray(res.responseJSON)) {
                var out = [];
                ES.each(res.responseJSON, function (_, v) {
                    out.push(v.message)
                });
                key = out.join('<br>')
            }
            ES.ui.unmask();
            if (key == ES.consts.tips.LOGIN_FIRST ||
                key == ES.consts.tips.LOGIN_FIRST_EN) {
                ES.ui.alert({
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        ES.util.forwardredirect('../login.html')
                    }
                })
            } else {
                ES.ui.alert({
                    key: key,
                    type: 'error',
                    after_callback: function () {
                        options.error && options.error()
                    }
                })
            }
        }
    }

    form = $('#' + options.formId)
    if(form.length === 0) {
        return
    }

    form.ajaxSubmit && form.ajaxSubmit(para)
}
ES.util.date_to_string = function (d, format, hasTime) {
    if (!format) {
        if(hasTime){
            format = '{{y}}-{{m}}-{{d}} {{hour}}:{{min}}:{{sec}}'
        } else {
            format = '{{y}}-{{m}}-{{d}}'
        }
    }
    var curr_date = d.getDate();
    if (curr_date < 10) {
        curr_date = '0' + curr_date
    }
    var curr_month = d.getMonth() + 1; //Months are zero based
    if (curr_month < 10) {
        curr_month = '0' + curr_month
    }
    var curr_year = d.getFullYear();

    var curr_hour = d.getHours()
    if (curr_hour < 10) {
        curr_hour = '0' + curr_hour
    }
    var curr_Minutes = d.getMinutes()
    if (curr_Minutes < 10) {
        curr_Minutes = '0' + curr_Minutes
    }
    //var curr_seconds = d.getSeconds()
    //if (curr_seconds < 10) {
    //    curr_seconds = '0' + curr_seconds
    //}

    if(hasTime){
        return ES.util.format_string(format, {
            y: curr_year,
            m: curr_month,
            d: curr_date,
            hour: curr_hour,
            min: curr_Minutes,
            sec: '00'
        })
    } else {
        return ES.util.format_string(format, {
            y: curr_year,
            m: curr_month,
            d: curr_date
        })
    }

}
ES.util.date_preDays = function(i){
	var date = new Date();
	date.setDate(date.getDate() - i);
	return ES.util.date_to_string(date);
}

ES.util.checkItems = function (config){
    this.items = [];
    this.itemsTrParent = config ? config.itemsTrParent : $('.box-list tbody');
    this.itemsAllLength = function(){
        return this.itemsTrParent.find('tr').length
    };
    this.itemsAllBtn = $('.sticky-thead .js-container-checkbox');

    this.time = null;
    this.itemsAll = function () {
        var _array = []
        for (var i = 0; this.itemsAllLength() > i; i++) {
            _array.push(i);
        }
        return _array
    };
    this.listenerCheckBox = function (index, type) {
        if (type == "single") {
            this.items = ((this.items.indexOf(index) > -1) && (this.items.length == 1)) ? [] : [index];
        } else if (type === "none") {
            this.items = [];
        } else if (type === "all") {
            this.items = this.itemsAll();
        } else if (this.items.indexOf(index) > -1) {
            this.items.splice(this.items.indexOf(index), 1)
        } else {
            this.items.push(index)
        }

        if (this.items.length >= this.itemsAllLength()) {
            this.itemsAllBtn.prop('checked', true)
        } else {
            this.itemsAllBtn.prop('checked', false)
        }

        this.itemsTrParent.find('tr input').prop("checked", false)
        this.itemsTrParent.find('tr').removeClass('active')
        for (var i = 0; i < this.items.length; i++) {
            this.itemsTrParent.find('tr:eq(' + this.items[i] + ') input').prop("checked", true);
            this.itemsTrParent.find('tr:eq(' + this.items[i] + ')').addClass('active')
        }
        return this.items
    };
    return this;
}

ES.util.priceFormat = function (obj){
    return (parseFloat(obj || 0) * 100).toFixed(0) / 100;
}

// 只有查看权限
ES.util.isReviewer = function() {
    var authorities = ES.user ? ES.user.authorities : []
    for(var i = 0, len = authorities.length; i < len; i++) {
        if ('REGISTRATION_REVIEW' == authorities[i]) {
            return true
        }
    }
    return false
}
// 车队
ES.util.isSeller = function() {
    var authorities = ES.user ? ES.user.authorities : []
    for(var i = 0, len = authorities.length; i < len; i++) {
        if ('COMPANY_REGISTRATION' == authorities[i]) {
            return true
        }
    }
    return false
}
// 码头管理员
ES.util.isPortAdmin = function() {
    var authorities = ES.user ? ES.user.authorities : []
    for(var i = 0, len = authorities.length; i < len; i++) {
        if ('COMPANY_AUDIT' == authorities[i]) {
            return true
        }
    }
    return false
}
// 委托方
ES.util.isBuyer = function() {
    if(!ES.util.isSeller() && !ES.util.isPortAdmin() && !ES.util.isReviewer()) {
        return true
    } else {
        return false
    }
}

ES.util.diff = function (newData, historyData) {
    function diffObject(newData, oldData){
        var flag = true
        for(var attr in newData ){
            if(!oldData.hasOwnProperty(attr) && newData[attr]) {
                flag = false
                return false
            }
            flag = diffChildren(newData[attr], oldData[attr])
            if (!flag) {
                return false
            }
        }
        return flag
    }

    function diffArray(newData, oldData){
        if(newData.length != oldData.length){
            return false
        }
        var flag = true
        for(var i=0, len=newData; i<len.length; i++){
            flag = diffChildren(newData[i], oldData[i])
            if (!flag) {
                return false
            }
        }
        return flag
    }

    function diffChildren(newData, oldData){
        if(newData instanceof Array){
            return diffArray(newData, oldData)
        }else if(newData instanceof Object){
            return diffObject(newData, oldData)
        }else{
            return newData == oldData
        }
    }

    function diffParent(newData, oldData){
        var attributeList = []
        //Object的diff
        for(var attr in newData) {
            if(oldData.hasOwnProperty(attr)) {
                var newVal = newData[attr]
                var historyVal = oldData[attr]
                if(!diffChildren(newVal, historyVal)){
                    attributeList.push(attr)
                }
            }
        }

        //attribute
        return attributeList
    }
    var diffResult =  diffParent(newData, historyData)
    return diffResult
}

ES.util.Base64 = function() {  

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  

    // public method for encoding  
    var encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  

    // public method for decoding  
    var decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  

    // private method for UTF-8 encoding  
    var _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  

        }  
        return utftext;  
    }  

    // private method for UTF-8 decoding  
    var _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
    return {
    	encode: encode,
    	decode: decode,
    	_utf8_encode: _utf8_encode,
    	_utf8_decode: _utf8_decode
    }
}

//托架号校验
ES.util.validate_trailer_no = function (number) {
    if(!number){
        return false
    }
    var arr = ["皖", "京", "渝", "闽", "甘", "粤", "桂", "贵", "琼", "冀", "豫", "黑", "鄂", "湘", "苏", "赣", "吉", "辽", "蒙", "宁", "青", "沪", "鲁", "晋", "陕", "川", "津", "新", "藏", "滇", "浙", "港", "澳", "台"]
    if(number.length != 7){
        return false
    }
    if(arr.indexOf(number.substr(0,1)) < 0){
        return false
    }
    if(number.substr(6,1) != "挂"){
        return false
    }
    //判断中间五位数字组合
    return /^[a-zA-Z0-9]*$/.test( number.substr(1, 5))
}