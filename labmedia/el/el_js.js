<%
try
{
%>
<script>
/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);

function stickBlock() {
    var body_width = window.innerWidth;
    if (body_width <= 1000) {
        $(".js-card-sticky").trigger("sticky_kit:detach");
    } else {
        $(".js-card-sticky").stick_in_parent();
    }
}

var preloader = (function () {
  var i = 0;
  var _preloader;
  return {
    start : function () {
      _preloader = jquery_preloader($("body"), 2);
      _preloader.load();
    },
    stop : function () {
      if (_preloader != undefined) {
        _preloader.aload();
        _preloader = undefined;
      }
    }
  };
})(),
SIZE_PAG = 10;

$(document).ready(function(){
	/*$('body').click(function (e) {
			var el = $(e.target),
			isBadBrowserModal = el.closest("#bad_browser").length > 0;
			if (!isBadBrowserModal &&
				  !el.closest('.el_popup_inner').length &&
					!el.hasClass('el_popup_inner') ||
					el.hasClass('close'))
			{
					$('.el_popup').fadeOut(300);
					$('html, body').css({overflow: 'auto'});
			}
	});*/
	if ($('.el_popup').length) {
		popupInnerWidth();
		$(window).resize(function () {
			popupInnerWidth();
		})
	}
  stickBlock();
});
function popupInnerWidth() {
    if ($(window).width() < 760) {
			$('.el_popup_inner').css({width: $(window).width()});
    } else {
			$('.el_popup_inner').css({width: "auto"});
    }
}

$(window).resize(function() {
    stickBlock();
});

(function (options) {
	'use strict';

	if (options.event_info.is_public == "0")
		options.event_info.is_public = false;
	else
		options.event_info.is_public = true;

	if (options.event_info.is_fact_made == "true")
		options.event_info.is_fact_made = true;
	else
		options.event_info.is_fact_made = false;

	console.log(options);

	// Замена мнемоник
	options.event_info.event_name = escapeHtmlDecode(options.event_info.event_name);
	options.event_info.topic = escapeHtmlDecode(options.event_info.topic);
	options.event_info.place = escapeHtmlDecode(options.event_info.place);
	options.event_info.desc = escapeHtmlDecode(options.event_info.desc);

	// Календарь
	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: ' ',
		nextText: ' ',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресение','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showOn: 'button',
		buttonImageOnly: true,
		buttonImage: options.data_picker_img_blue,
		hideIfNoPrevNext: true
	};

	$.datepicker.setDefaults($.datepicker.regional['ru']);

	var currentOpenedDatepicker = undefined;

	var _openDatepicker = function (input) {
		currentOpenedDatepicker = $(input);
		_changeMonthYearDatepickerCallback(input);
		_setDisabledAttr(input);
	};

	var _setDisabledAttr = function (input) {
		setTimeout(function() {
			$(input).datepicker("widget").find(".ui-datepicker-month").attr("disabled", "disabled");
		}, 1);
	};

	var _changeMonthYearDatepickerCallback = function (input) {
		setTimeout(function() {

			$(input).datepicker("widget").find(".ui-datepicker-header")
				.prepend($("<a/>")
					.addClass("js_prev_year_datepicker_jquery")
					.addClass("ui-datepicker-prev ui-corner-all")
					.attr("title", "")
					.append($("<span/>")
						.addClass("ui-icon ui-icon-circle-triangle-w")
					)
				)
				.prepend($("<a/>")
					.addClass("js_next_year_datepicker_jquery")
					.addClass("ui-datepicker-next ui-corner-all")
					.attr("title", "")
					.append($("<span/>")
						.addClass("ui-icon ui-icon-circle-triangle-w")
					)
				)
		}, 0);
	};

	var _changeYearValue = function (value) {
		$.datepicker._adjustDate(currentOpenedDatepicker, value, "Y");
	};

	$(document)
		.on("click", ".js_prev_year_datepicker_jquery", _changeYearValue.bind(null, -1))
		.on("click", ".js_next_year_datepicker_jquery", _changeYearValue.bind(null, +1));

	function setInputMask() {
		$(".e-report__input_date").inputmask({
			mask: "d.m.y",
			placeholder: "_",
			showMaskOnHover: false,
			showMaskOnFocus: false
		});
		$(".e-report__input_time").inputmask({
			mask: "h:s",
			placeholder: "_",
			showMaskOnHover: false,
			showMaskOnFocus: false
		});
	}

	var Render = {};
  // Создаем модальные окна и пагинацию для типов сотрудников
  var modCollab,
      modTutor,
  		modPrep,
      modLector,
      pagCollab,
      pagTutor,
			pagPrep,
      pagLector;
	var MAX_FILE_SIZE = 5242880;

	var i;
	var curCollab = null;
  modCollab = new ModalCollaborator({
    title: 'Участники',
    role: 'collaborator'
  });
  $('body').append(modCollab.getDomElement());
	for (i = 0; i < options.event_collaborator.length; ++i) {
		curCollab = modCollab.addCollaborator(options.event_collaborator[i]);
		modCollab.activeCollaborator(curCollab);
	}

  modTutor = new ModalCollaborator({
    title: 'Ответственные за проведение',
    role: 'tutor'
  });
  $('body').append(modTutor.getDomElement());
	for(i = 0; i < options.event_tutor.length; ++i) {
		curCollab = modTutor.addCollaborator(options.event_tutor[i]);
		modTutor.activeCollaborator(curCollab);
	}

	modPrep = new ModalCollaborator({
    title: 'Ответственные за подготовку',
    role: 'preparation'
  });
  $('body').append(modPrep.getDomElement());
	for(i = 0; i < options.event_preparation.length; ++i) {
		curCollab = modPrep.addCollaborator(options.event_preparation[i]);
		modPrep.activeCollaborator(curCollab);
	}

	modLector = new ModalCollaborator({
    title: 'Преподаватели',
    role: 'lector'
  });
  $('body').append(modLector.getDomElement());
	for(i = 0; i < options.event_lector.length; ++i) {
		curCollab = modLector.addCollaborator(options.event_lector[i]);
		modLector.activeCollaborator(curCollab);
	}

		// Создаем выпадающие списки
		// Функция для сортировки
		var sortFunc = function(a,b) {
			if (a.name <= b.name)
				return -1;
			else
				return 1;
		}
    var eventType = new CustSelect({
  	  title: "Тип мероприятия",
			id: "modal-event-type",
			name: "event_type"
    });
    eventType.addListElem(options.event_type.sort(sortFunc));
    eventType.setActiveElem(0);

		var orgForm = new CustSelect({
  	  title: "Организационная форма",
			id: "modal-org-form",
			name: "org_form"
    });

    orgForm.addListElem(options.org_form.organizational_form.sort(sortFunc));
    orgForm.setActiveElem(0);

		var eventForm = new CustSelect({
  	  title: "Форма проведения",
			id: "modal-event-form",
			name: "event_form"
    });
    eventForm.addListElem(options.event_form.event_form.sort(sortFunc));
    eventForm.setActiveElem(0);

    var city = new CustSelectSearch({
  	  title: "Город проведения"
    });
    city.addListElem(options.city);
    city.setActiveElem(0);

	function escapeHtmlDecode(text) {
	  return text
		  .replace(/&amp;/g, "&")
		  .replace(/&lt;/g, "<")
		  .replace(/&gt;/g, ">")
		  .replace(/&quot;/g, "\"")
		  .replace(/&#039;/g, "'");
	}

	function setAccessControlButton() {
		var courseCardBtn = $(".el_course_card_btn");
		var courseCardInfo = $(".el_course_card_info");
		if (options.is_tutor) {
			// courseCardInfo.css("border-right", "1px solid rgba(0, 0, 0, 0.1)");
			if (options.event_info.status_id == 'plan') {
				courseCardBtn.children('.el_course_card_btn_blue, \
																.el_course_card_btn_white, \
																.e-link_red, .style_checkbox').
											addClass("disabled");
        courseCardBtn.children('.style_checkbox').find(".style_checkbox__input").attr("disabled",
                                                                   "true");
				courseCardBtn.children('.el_course_card_btn_green, \
																.el_course_card_btn_grey').
										  removeClass("disabled");
				$("#event_state").css("color", "#0099cb");
			}
			else if (options.event_info.status_id == 'active') {
				courseCardBtn.children('.el_course_card_btn_green, .e-link_red, \
                                .style_checkbox').
											addClass("disabled");
        		courseCardBtn.children('.style_checkbox').find(".style_checkbox__input").attr("disabled",
                                                                   "true");
			  	courseCardBtn.children('.el_course_card_btn_grey, \
																.el_course_card_btn_blue, \
																.el_course_card_btn_white').
											removeClass("disabled");
			  	$("#event_state").css("color", "#3ca124");
			}
			else if (options.event_info.status_id == 'close') {
				courseCardBtn.children('.el_course_card_btn_white').
											addClass("disabled");
				courseCardBtn.children('.el_course_card_btn_grey, \
																.el_course_card_btn_blue, \
																.el_course_card_btn_green, \
																.e-link_red, .style_checkbox').
											removeClass("disabled");
        		courseCardBtn.children('.style_checkbox').find(".style_checkbox__input").removeAttr("disabled");
				$("#event_state").css("color", "#dc1e41");
			}
			else if (options.event_info.status_id == 'cancel') {
				courseCardBtn.children('.el_course_card_btn_grey, .e-link_red, \
                                .style_checkbox').
											addClass("disabled");
				courseCardBtn.children('.el_course_card_btn_white, \
																.el_course_card_btn_blue, \
																.el_course_card_btn_green').
											removeClass("disabled");
        		courseCardBtn.children('.style_checkbox').find(".style_checkbox__input").attr("disabled",
                                                                   "true");
				$("#event_state").css("color", "#666");
			}
			else {
				courseCardBtn.children('.el_course_card_btn_green, \
																.el_course_card_btn_white, \
																.el_course_card_btn_grey, \
																.e-link_red, .style_checkbox').
											addClass("disabled");
        		courseCardBtn.children('.style_checkbox').find(".style_checkbox__input").attr("disabled",
                                                                   "true");
	            $("#event_state").css("color", "yellow");
			}
		}
		else {
			courseCardBtn.children().addClass("disabled");
			// courseCardInfo.css("border-right", "none");
			if (options.event_info.status_id == 'close') {
				// courseCardInfo.css("border-right", "1px solid rgba(0, 0, 0, 0.1)");
				courseCardBtn.children(".e-link_red").removeClass("disabled");
			}
		}
	}

	function setAccessSpecialButton() {
		var specialBtnsStr = ".js_change, .js_add_file, .el_event_edit, span.remove";
		if (options.is_tutor)
			$(specialBtnsStr).show();
		else
			$(specialBtnsStr).hide();
	}

	function setTabs(activeTabRel) {
		var tabs = $(".js-tabs-group");
		tabs.children(".js-tabs[rel='" + activeTabRel + "']").addClass("active");

		var wrapper = $("#" + activeTabRel + " .event_collaborator");
		if (activeTabRel == "first") {
			Render.EventCollaboratorTableRows(wrapper, modTutor.getActiveElem());
		}
		else if (activeTabRel == "second") {
			Render.EventCollaboratorTableRows(wrapper, modPrep.getActiveElem());
		}
		else if (activeTabRel == "third") {
			Render.EventCollaboratorTableRows(wrapper, modLector.getActiveElem());
		}
		else {
			Render.EventCollaboratorTableRows(wrapper, modCollab.getActiveElem());
		}

		var activeTab = tabs.next().children(".js-tabs-item[id=" + activeTabRel + "]");

		activeTab.siblings().hide();
		activeTab.show();
	}

	Render.EventInfo = function () {
		var data = options.event_info;
		if (data != undefined) {
			$("#event_name").text(data.event_name);

			var status_id = "";
			if (data.status_id == "project")
				status_id = "В проекте";
			else if (data.status_id == "plan")
				status_id = "Планируется";
			else if (data.status_id == "active")
				status_id = "Проводится";
			else if (data.status_id == "close")
				status_id = "Завершено";
			else
				status_id = "Отменено";
			$("#event_state").text(status_id);
			$("#event_type").text(data.event_type_name);
			$("#event_plase1").text(data.place_name);
			$("#event_plase2").text(data.place);

			if (data.start_date == data.finish_date)
				$("#event_date").text(data.start_date + ", " + data.start_time + " — " + data.finish_time);
			else
				$("#event_date").text(data.start_date + ", " + data.start_time + " — " + data.finish_date + ", " + data.finish_time);
			$("#event_role").text(options.role_name);
      		$("#fact_made").prop("checked", options.event_info.is_fact_made);
      		$("#event_desc").empty().append($(data.desc).text());

			if (options.is_collaborator && $("#event_comment").length == 0) {
				var bFlag = (options.collaborator_comment.length != 0);

				if (bFlag)
					options.collaborator_comment = encodeURIComponent(decodeURIComponent(options.collaborator_comment).substr(0, 100));

				$('.el_card_info_wr tbody').append(
					$('<tr>').append(
						$("<td>").append(
							$("<span>").text("Ваш комментарий")
						),
						$("<td>").attr("id", "event_comment").append(
							$("<div>").addClass("event_table_choice_str event_table_choice_str_wrap").
									   attr("contenteditable", "true").
									   text(bFlag ? decodeURIComponent(options.collaborator_comment) : "Написать")
						)
					)
				);

				if (bFlag)
					$(".event_table_choice_str").addClass("changed");
			}
		}
	}

	// Установка доступа к функционалу по ролям
	Render.EventAccess = function (bReload) {
		bReload = bReload || false;
		var bUserRole = false;
		bUserRole = options.is_collaborator || options.is_tutor ||
								options.is_lector || options.is_preparation;
		// Информация по карточке
		var courseCardInfo = $(".el_course_card_info");
		// Кнопки управления мероприятием
		setAccessControlButton();

		if (options.event_info.is_public || bUserRole) {
			// Материалы
			Render.EventFiles(options.event_files);
			// Кнопки управления данными (зависят от EventFiles)
			setAccessSpecialButton();
			// Таблица участников
			if (!bReload) {
				var activeTab = "";
				if (options.is_tutor) {
					activeTab = "first";
				}
				else if (options.is_preparation) {
					activeTab = "second";
				}
				else if (options.is_lector) {
					activeTab = "third";
				}
				else {
					activeTab = "four";
				}

				setTabs(activeTab);
			}
		}
		else {
			courseCardInfo.children().hide();
			courseCardInfo.children("#event_name, .el_sub_text, #event_desc").show();
		}
	}

	Render.EventFileRow = function (item) {
		var link;
		var cross_bt;
		var href = "/custom_web_template.html?object_code=" +
							 "eldorado_d17_getfile&file_id=" +
							 item.id;


		link = $("<div/>").addClass("e-file__link").
							append(
								$("<a/>").attr("href", href).attr("title", item.name).
								text(item.name.substr(0, item.name.lastIndexOf(".")))
							).
							append(
								$("<span/>")
									.addClass("e-file__size")
									.text(getSize(item.size))
							);

		var cross_bt = $("<span/>").addClass("remove e-icon__cross e-icon__cross_material");

		var li = $("<li/>")
					.addClass("e-file__item e-file__item_md clearfix")
					.append(
						$("<div/>")
							.addClass("e-file__left")
							.append($("<div/>").addClass("e-file__left-txt").text(item.type))
					)
					.append(
						$("<div/>")
							.addClass("e-file__right")
							.append(
								$("<div/>")
									.addClass("e-file__inf")
									.append(
										link
									)
							)
							.append(
								$("<div/>")
									.addClass("e-file__btn-wrap e-file__btn-wrap_pos mod")
									.append(
										$("<a/>")
											.addClass("e-btn-white-red e-btn-white-red_file")
											.attr("href", href)
											.text("Скачать")
									)
									.append(cross_bt)
							)
					);

		return li;
	}

	Render.EventFiles = function (data) {
		var wraperParent = $("#event_file_list");
		var wraper = wraperParent.children("ul");

		wraper.empty();
		if (data.length != 0) {
			if (!options.is_tutor)
				$(".files").show();
			wraperParent.show();
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				wraper.append(Render.EventFileRow(item));
			}
		}
		else {
			if (!options.is_tutor)
				$(".files").hide();
			wraperParent.hide();
		}
	}

	Render.EventCollaboratorTableRow = function (item) {
		var tr = $("<tr>").append(
					$("<td/>").append(
						$("<a/>").prop("href", "view_doc.html?mode=my_account&person_id=" + item.getId()).
								  text(item.getPersonFullname())
					),
					$("<td>").text(item.getPositionName()),
					$("<td>").text(item.getSubdivisionName()),
					$("<td>").text(item.getOrgName())
				 )
					;

		return tr;
	}

	Render.EventCollaboratorTableRows = function (wrapper, data) {
		wrapper.empty();
		// wrapper.append(
		// 	$("<tr>").append(
		// 		$("<th>").text("Сотрудник"),
		// 		$("<th>").text("Должность"),
		// 		$("<th>").text("Подразделение"),
		// 		$("<th>").text("Организация")
		// 	)
		// );

    if (data.length != 0) {
  		for (var i = 0; i < data.length; i++) {
  			var item = data[i];
  			wrapper.append(Render.EventCollaboratorTableRow(item));
  		}
    }
    else
      wrapper.append("<p>Записи, удовлетворяющие запросу, не найдены</p>");

	}

	Render.ModalWindosClosed = function () {
		$('.el_popup').fadeOut(300);
		$('html, body').css('overflow-y', 'auto');
	}

	function init() {
		Render.EventInfo();
		Render.EventAccess();

		// Шестерёнка
		$("#event_edit").css("background-image", "url(" + options.gear_ico_red + ")");
		$("#event_edit").mouseover(function() {
			$(this).css("background-image", "url(" + options.gear_ico_white + ")");
		});
		$("#event_edit").mouseleave(function() {
			$(this).css("background-image", "url(" + options.gear_ico_red + ")");
		});

		// Календарь
		$(".js-datepicker").datepicker({
			defaultDate: new Date(),
			setDate: new Date(),
			beforeShow: function(input) {
				$("#el_popup_edit.el_popup").css("z-index", "20");
				_openDatepicker(input);
				$(input).next()
					.addClass("active")
					.attr("src", options.data_picker_img_white);
			},
			onClose: function() {
				$(".ui-datepicker-trigger")
					.removeClass("active")
					.attr("src", options.data_picker_img_blue);
				$("#el_popup_edit.el_popup").css("z-index", "1000");
			},
			onChangeMonthYear: _changeMonthYearDatepickerCallback
		});

		// Маска для времени и даты
		setInputMask();
		// Слушатели
		setDateListeners();
	}

	// Функции для "Отправки отзыва"
	// Удалённое действие
	function remoteAction(actionObject) {
		preloader.start();
		try {
			if (remoteAction != undefined) {
				var returnObject = {};
				var soapRequestBody;
				var soapServerUrl = actionObject.url != undefined ? actionObject.url : '/remote_actions_wsdl.xml';
				var soapFormat = actionObject.format != undefined ? actionObject.format : 'json';

				soapRequestBody  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
				soapRequestBody += "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" 			  	xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">";
				soapRequestBody += "<soap:Body>";
				soapRequestBody += "<" + actionObject.name + " xmlns=\"http://www.websoft.ru/\">";
				soapRequestBody += "<format>" + soapFormat + "</format>";
				if (actionObject.options != undefined) {
					for (var i = 0; i < actionObject.options.length; i++) {
						soapRequestBody += "<" + actionObject.options[i].name + ">" + actionObject.options[i].value + "</" + actionObject.options[i].name + ">";
					}
				}
				soapRequestBody += "</" + actionObject.name + ">";
				soapRequestBody += "</soap:Body>";
				soapRequestBody += "</soap:Envelope>";

				$.ajax({
					type: "POST",
					url: soapServerUrl,
					contentType: "text/xml",
					dataType: "xml",
					data: soapRequestBody,
					success: processSuccess,
					error: processError
				});

				function processSuccess (data, status, req) {
					if (status == "success") {
						var returnObject = {
							error: data.getElementsByTagName('error')[0].firstChild,
							type: data.getElementsByTagName('type')[0].firstChild,
							messageText: data.getElementsByTagName('messageText')[0].firstChild,
							result: data.getElementsByTagName('result')[0].firstChild
						};
						try {
							returnObject.error = returnObject.error.nodeValue;
						}
						catch(_ex){}
						try {
							returnObject.type = returnObject.type.nodeValue;
						}
						catch(_ex){}
						try {
							returnObject.messageText = returnObject.messageText.nodeValue;
						}
						catch(_ex){}
						try {
							returnObject.result = returnObject.result.nodeValue;
						}
						catch(_ex){}

						if (actionObject.callback_f != undefined) {
							actionObject.callback_f(returnObject);
						}
						preloader.stop();
						return returnObject;
					}
					else {
						preloader.stop();
						throw status;
					}
				}

				function processError(data, status, req) {
					preloader.stop();
					throw req.responseText;
				}
			}
			else {
				preloader.stop();
				throw '00';
			}
		}
		catch(_exeption) {
			returnObject = {error: 1, messageText: _exeption};
			if (typeof(actionObject.callback_f) != 'undefined') {
				actionObject.callback_f(returnObject);
			}
			preloader.stop();
			return returnObject;
		}
	}

	function ctrlSecReplacer(message) {
		var re = /((<\/)|<)(\w+)((\/>)|>)/ig;

		message = message.replace(re, function(str) {
			str = str.replace(/</, "&lt;").
								replace(/\//, "&#47;").
								replace(/>/, "&gt;");
			return str;
		});
		message = message.replace(/\\/ig, "&#92;");

		return message;
	}

  // Класс панель пагинации
  function Pagination(config) {
    var callback = config.callback,
      size = config.size,
      total = config.total,
      countVisible = config.countVisible,
      count = (total <= size ? 0 : Math.ceil(total / size)),
      btnArray = [],
      startPos = 0,
      searchString,
      endPos = Math.min(countVisible - 1, count - 1),
      leftPoints = new PaginationButton({
        number: -1,
        title: "..."
      }),
      rightPoints = new PaginationButton({
        number: -2,
        title: "..."
      }),
      empty = new PaginationButton({
        number: -100,
        title: ""
      }),
      domElement = createDomElement(),
      curActive = (btnArray.length !== 0 ? btnArray[0] : empty);

      render();
      curActive.activate();

    // Отрисовывает кнопки в панели по текущим значениям startPos endPos
    function render() {
      var container = $(".pagenav_list", domElement);
      container.children().detach();

      hidePrev();
      hideNext();
      if(curActive.getNumber() - 1 !== 0) {
        showPrev();
      }
      if(curActive.getNumber() - 1 !== btnArray.length - 1) {
        showNext();
      }

      if(startPos > 0) {
        container.append(btnArray[0].getDomElement());
        if(startPos === 2) {
          container.append(btnArray[1].getDomElement());
        }
      }
      if(startPos > 2) {
        container.append(leftPoints.getDomElement());
      }

      for(var i = startPos; i <= endPos && i < btnArray.length; i++ ) {
        container.append(btnArray[i].getDomElement());
      }

      if(endPos < btnArray.length - 3) {
        container.append(rightPoints.getDomElement());
      }
      if(endPos < btnArray.length - 1) {
        if(endPos === btnArray.length - 3) {
          container.append(btnArray[btnArray.length - 2].getDomElement());
        }
        container.append(btnArray[btnArray.length - 1].getDomElement());
      }
    }

    // Создает DOM элемент панели
    function createDomElement() {
      var strArray = [
        '<div class="pagenav">',
        '	<a href="#" class="pagenav_prev" style="display: none;">← Предыдущая</a>',
        '	<a href="#" class="pagenav_next" style="display: none;">Следующая →</a>',
        '	<div class="pagenav_list"></div>',
        '</div>'
      ],
        elem = $(strArray.join('\r\n')),
        btn;

      for(var i = 0; i < count; i++) {
        btn = new PaginationButton({
          number: i + 1,
          title: i + 1
        });
        btnArray.push(btn);
      }

      if(btnArray.length === 0) {
        elem.hide();
      }
      elem.append('<div class="clearfix"></div>');

      return elem;
    }

    // Скрывают отображают кнопки следующий предыдущий
    function hidePrev() {
      $(".pagenav_prev", domElement).hide();
    }
    function showPrev() {
      $(".pagenav_prev", domElement).show();
    }
    function hideNext() {
      $(".pagenav_next", domElement).hide();
    }
    function showNext() {
      $(".pagenav_next", domElement).show();
    }

    function getStart() {
      return (curActive.getNumber() - 1) * size;
    }

    // Вычисляет новые значения startPos endPos и вызывает render
    function updatePanel(number, fn) {
      var oldNumber = curActive.getNumber(),
        fn = (fn === undefined ? function(start, size, searchString) {return undefined} : fn);

      if(number === oldNumber) {
        return;
      }

      curActive.disactivate();

      if(number === -1) {
        startPos = Math.max(0, startPos - 3);
        endPos = Math.min(startPos + countVisible - 1, btnArray.length - 1);
        curActive = btnArray[startPos + 1];
        curActive.activate();
        fn(getStart(), size, searchString);
        render();
        return;
      }

      if(number === -2) {
        endPos = Math.min(btnArray.length - 1, endPos + 3);
        startPos = Math.max(0, endPos - countVisible + 1);
        curActive = btnArray[endPos - 1];
        curActive.activate();
        fn(getStart(), size, searchString);
        render();
        return;
      }

      curActive = btnArray[number - 1];
      curActive.activate();
      fn(getStart(), size, searchString);

      if(number - 1 === endPos && endPos < btnArray.length - 1 - Math.min(countVisible - 1, 3)) {
        endPos = Math.min(endPos + 1, btnArray.length - 1);
        startPos += 1;
        render();
        return;
      } else if(number - 1 === endPos) {
        endPos = btnArray.length - 1;
        startPos = Math.max(0, btnArray.length - countVisible);
        render();
        return;
      }

      if(number - 1 === startPos && startPos > Math.min(countVisible - 1, 3)) {
        startPos = Math.max(startPos - 1, 0);
        endPos -= 1;
        render();
        return;
      } else if(number - 1 === startPos) {
        startPos = 0;
        endPos = Math.min(countVisible - 1, btnArray.length - 1);
        render();
        return;
      }

      if(number - 1 === 0) {
        startPos = 0;
        endPos = Math.min(countVisible - 1, btnArray.length - 1);
        render();
        return;
      }

      if(number - 1 === btnArray.length - 1) {
        startPos = Math.max(0, btnArray.length - countVisible);
        endPos = btnArray.length - 1;
        render();
        return;
      }

      render();
    }

    // Делает активной указаную кнопку
    function setActive(number) {
      if(number === undefined || number > btnArray.length || number < 1) {
        return;
      }

      for(var i = 1; i <= number; i++) {
        updatePanel(i);
      }
    }

    // Получает номер текущей активной кнопки
    function getActiveNumber() {
      return curActive.getNumber();
    }

    // Обработчик нажатия на кнопку
    domElement.bind("clickPaginationButton", function(event, number) {
      updatePanel(number, callback);
    });

    // Нажатие на кнопку предыдущий
    $(".pagenav_prev", domElement).click(function(event) {
      var curNumber = curActive.getNumber();
      if(curNumber > 1) {
        updatePanel(curNumber - 1, callback);
      }
      event.preventDefault();
    });

    // Нажатие на кнопку следующий
    $(".pagenav_next", domElement).click(function(event) {
      var curNumber = curActive.getNumber();
      if(curNumber < btnArray.length) {
        updatePanel(curNumber + 1, callback);
      }
      event.preventDefault();
    });

    this.getDomElement = function() {
      return domElement;
    }
    this.getCountVisiable = function() {
      return countVisible;
    }
    this.getActiveNumber = getActiveNumber;
    this.setActive = setActive;
    this.getCallback = function() {
      return callback;
    }
    this.setSearchString = function(str) {
      searchString = str;
    }
    this.getTotal = function() {
      return total;
    }
  }

  // Класс кнопка в панели пагинации
  function PaginationButton(config) {
    var number = config.number,
      title = config.title,
      domElement = $('<a href="#" class="pagenation-btn-item">' + title + '</a>');

    domElement.click(function (event) {
      event.preventDefault();
      $(this).trigger("clickPaginationButton", [number]);
      return false;
    });

    this.getDomElement = function() {
      return domElement
    }
    this.getNumber = function() {
      return number;
    }
    this.activate = function() {
      domElement.addClass("active");
    }
    this.disactivate = function() {
      domElement.removeClass("active");
    }
  }

  // Изменение размеров окна пагинации
  function resizePagination(mod, countVis) {
    var pag = mod.getPaginationPanel(),
      cur,
      curCallback,
      curTotal;
    if(pag != undefined && pag.getCountVisiable() !== countVis) {
      cur = pag.getActiveNumber();
      curCallback = pag.getCallback();
      curTotal = pag.getTotal();
      pag = new Pagination({
        size: SIZE_PAG,
        total: curTotal,
        callback: curCallback,
        countVisible: countVis
      });
      pag.setActive(cur);
      mod.setPaginationPanel(pag);
      pag.setSearchString(mod.getSearchString());
    }
  }
  $(window).resize(function(event) {
    if(getDocumentWidth() <= 760 && modCollab != undefined) {
      resizePagination(modCollab, 3);
    }

    if(getDocumentWidth() <= 760 && modTutor != undefined) {
      resizePagination(modTutor, 3);
    }

		if(getDocumentWidth() <= 760 && modPrep != undefined) {
      resizePagination(modPrep, 3);
    }

		if(getDocumentWidth() <= 760 && modLector != undefined) {
      resizePagination(modLector, 3);
    }

    if(getDocumentWidth() > 760 && modCollab != undefined) {
      resizePagination(modCollab, 10);
    }

    if(getDocumentWidth() > 760 && modTutor != undefined) {
      resizePagination(modTutor, 10);
    }

		if(getDocumentWidth() > 760 && modPrep != undefined) {
      resizePagination(modPrep, 10);
    }

    if(getDocumentWidth() > 760 && modLector != undefined) {
      resizePagination(modLector, 10);
    }
  });
  // Поиск в массиве
  function findInArray(arr, id, fn) {
    fn = (fn === undefined ? function(a, b) {return a == b;} : fn);
    for(var i = 0; i < arr.length; i++) {
      if(fn(arr[i], id)) {
        return i;
      }
    }
    return -1;
  }
  var fn = function(a, b) {
    return a.getId() == b;
  }
  // Получаем ширину экрана
  function getDocumentWidth() {
    return Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
    );
  }

  // Класс выпадающий список
  function CustSelectSearch(config) {
	  var title = config.title,
		  optionsArray = [],
		  activeElem = [0, ""],
		  domElement = createDomElement();

	  function createDomElement() {
		  var strArray = [
			  '<div class="e-report__line">',
			  '	<div class="e-report__item e-report__item_left">' + title + '</div>',
			  '	<div class="e-report__item e-report__item_right">',
			  '		<div style="width: 100%;" class="custom-select-wrapper">',
			  '			<div class="custom-select custom-select-big sources">',
			  '               <span class="custom-select-trigger">',
			  '				    <input name="event_city" id="modal-event-city" style="width: 363px;" type="search" class="e-fillter__input-search" placeholder="Введите название"/>',
			  '               </span>',
			  '				<div class="custom-options">',
			  '				</div>',
			  '			</div>',
			  '		</div>',
			  '	</div>',
			  '</div>'
		  ],
		  elem = $(strArray.join('\r\n'));

		  return elem;
	  }

	  //обрабатываем поиск по городам в input
	  $("input", domElement).on("keyup input", function(event) {
		  if( event.which == 40 ||
			  event.which == 38 ||
			  event.which == 39 ||
			  event.which == 37 ||
			  event.which == 13 ) {
			  return;
		  }

		  if ($(this).val().length > 0) {
			  $(".custom-select", domElement).addClass('opened');
		  }

		  activeElem = [0, ""];

		  var textInput = $(this).val().toUpperCase();
		  $('.custom-option-search:not([data-value="0"])', domElement).each(function(index, el) {
			  if($(el).text().toUpperCase().indexOf( textInput ) == -1 ) {
				  $(el).removeClass("labeled");
				  $(el).hide();
			  } else {
				  $(el).show();
			  }
		  });

		  if ($(".labeled", domElement).length == 0) {
			  $(".custom-option-search:visible", domElement).first().addClass('labeled');
		  }
	  });

	  //обрабатываем нажатие клавиш ВВЕРХ, ВНИЗ, ENTER
	  $("input", domElement).keydown(function(event) {
		  if(event.keyCode == 40) {
			  //клавиша ВНИЗ
			  event.preventDefault();

			  if (!$(".custom-select", domElement).hasClass('opened')) {
				  $(".custom-select", domElement).addClass('opened');

				  return;
			  }

			  var nextItem = $(".labeled", domElement)
				  .removeClass("labeled")
				  .nextAll(":visible")
				  .first();

			  if( nextItem.length == 0 ) {
				  nextItem = $(".custom-option-search:visible", domElement).first();
			  }

			  if( !isVisible(nextItem.index()) ) {
				  $(".custom-options", domElement)[0].scrollTop = sumHeight(nextItem.index()) - $(".custom-options", domElement)[0].offsetHeight;
			  }
			  nextItem.addClass("labeled");
		  } else if(event.keyCode == 38) {
			  //клавиша ВВЕРХ
			  event.preventDefault();

			  if (!$(".custom-select", domElement).hasClass('opened')) {
				  return;
			  }

			  var prevItem = $(".labeled", domElement)
				  .removeClass("labeled")
				  .prevAll(":visible")
				  .first();

			  if( prevItem.length == 0 ) {
				  prevItem = $(".custom-option-search:visible", domElement).last();
			  }

			  if(prevItem.index() > 0 && !isVisible(prevItem.index() - 1) ) {

				  $(".custom-options", domElement)[0].scrollTop = sumHeight(prevItem.index() - 1) - prevItem[0].clientHeight;
			  }
			  prevItem.addClass("labeled");
		  } else if(event.keyCode == 13) {
			  //клавиша ENTER
			  event.preventDefault();
			  if (!$(".custom-select", domElement).hasClass('opened')) {
				  return;
			  }

			  setActiveElem($(".labeled", domElement).attr("data-value"));

			  $(".custom-option-search:hidden", domElement).show();
			  $(".custom-select", domElement).removeClass("opened");

			  $("input", domElement).blur();

			  domElement.trigger("clickCustomSelect", [title]);
		  }
	  });

	  $(".custom-select-trigger", domElement).click(function(event) {
		  $("input", domElement).focus();
	  });

	  $('input', domElement).blur(function(event) {
		  if (activeElem[0] == 0 || activeElem[1] != $(this).val()) {
			  $(".custom-select", domElement).removeClass("opened");
			  setActiveElem(0);
			  $(".custom-option-search:hidden", domElement).show();
			  domElement.trigger("clickCustomSelect", [title]);
		  }
	  });

	  //выисляет суммарную высоту элемента и предшествующих ему в списке
	  function sumHeight(index) {
		  var sum = 0;
		  $(".custom-option-search:lt(" + (index + 1) + "):visible", domElement).each(function(ind, val) {
			  sum += val.offsetHeight;
		  });
		  return sum;
	  }

	  //проверяет скрыт элемент списка или виден
	  function isVisible(index) {
		  var indicator = sumHeight(index) - $(".custom-options", domElement)[0].scrollTop;
		  if( indicator >= $(".custom-options", domElement)[0].clientHeight  || indicator <= 0 ) {
			  return false;
		  }
		  return true;
	  }

	  function setActiveElem(id) {
		  for(var i = 0; i < optionsArray.length; i++) {
			  if(id == +optionsArray[i][0]) {
				  activeElem = optionsArray[i];
				  $('.selection', domElement).removeClass('selection');
				  $('[data-value="' + id + '"]', domElement).addClass('selection');
				  $('input', domElement).val(optionsArray[i][1]);

				  enable();

				  break;
			  }
		  }
	  }

	  function addOption(arr) {
		  arr = [arr.id, arr.name];
		  var optionElem = $('<span/>').addClass('custom-option-search undefined').attr('data-value', arr[0]);

		  optionElem.mousedown(function(event) {
			  setActiveElem($(this).attr("data-value"));
			  $(".custom-select", domElement).removeClass("opened");
			  //$("input", domElement).blur();
			  domElement.trigger("clickCustomSelect", [title]);
		  });

		  optionElem.bind("mouseenter", function(event) {
			  $(".custom-option-search", domElement).removeClass("labeled");
			  $(this).addClass("labeled");
		  });

		  if(arr[1] == "") {
			  optionElem.html('&nbsp');
		  } else {
			  optionElem.text(arr[1]);
		  }

		  optionsArray.push(arr);
		  $(".custom-options", domElement).append(optionElem);
	  }

	  function enable() {
		  $(".e-report__item_right", domElement).removeClass("e-inactive");
	  }

	  this.getDomElement = function() {
		  return domElement;
	  };
	  this.addOption = addOption;
	  this.addListElem = function(list) {
		  for(var i = 0; i < list.length; i++) {
			  addOption(list[i]);
		  }
	  }
	  this.setActiveElem = setActiveElem;
	  this.getActiveElem = function() {
		  return activeElem;
	  }
	  this.getActiveElemName = function() {
		  return activeElem[1];
	  }
	  this.getActiveElemId = function() {
		  return activeElem[0];
	  }
	  this.empty = function() {
		  $(".custom-options", domElement).empty();
		  activeElem = [0, ""];
		  $(".custom-select-trigger", domElement).html('&nbsp');
		  optionsArray = [];
	  }
	  this.disable = function() {
		  $(".e-report__item_right", domElement).addClass("e-inactive");
	  }
	  this.enable = enable;
  }

  // Класс выпадающий список
  function CustSelect(config) {
	  var title = config.title,
			idElem = config.id,
			nameElem = config.name,
		  optionsArray = [],
		  activeElem = [0, ""],
		  domElement = createDomElement();

	  function createDomElement() {
		  var strArray = [
			  '<div class="e-report__line">',
			  '	<div class="e-report__item e-report__item_left">' + title + '</div>',
			  '	<div class="e-report__item e-report__item_right">',
			  '		<div style="width: 100%;" class="custom-select-wrapper">',
			  '			<div class="custom-select custom-select-big sources">',
			  '				<span name="' + nameElem + '" id="' + idElem + '" class="custom-select-trigger">&nbsp;</span>',
			  '				<div class="custom-options">',
			  '				</div>',
			  '			</div>',
			  '		</div>',
			  '	</div>',
			  '</div>'
		  ],
		  elem = $(strArray.join('\r\n'));

		  return elem;
	  }

	  function setActiveElem(id) {
		  for(var i = 0; i < optionsArray.length; i++) {
			  if(id == +optionsArray[i][0]) {
				  activeElem = optionsArray[i];
				  $('.selection', domElement).removeClass('selection');
				  $('[data-value="' + id + '"]', domElement).addClass('selection');
				  if(optionsArray[i][1] == '') {
					  $('.custom-select-trigger', domElement).html('&nbsp;');
				  } else {
					  $('.custom-select-trigger', domElement).text(optionsArray[i][1]);
				  }

				  enable();

				  break;
			  }
		  }
	  }

	  function addOption(arr) {
		  arr = [arr.id, arr.name];

		  var optionElem = $('<span/>').addClass('custom-option undefined').attr('data-value', arr[0]);

		  optionElem.click(function(event) {
			  setActiveElem($(this).attr("data-value"));
			  domElement.trigger("clickCustomSelect", [title]);
		  });

		  if(arr[1] == "") {
			  optionElem.html('&nbsp');
		  } else {
			  optionElem.text(arr[1]);
		  }

		  optionsArray.push(arr);
		  $(".custom-options", domElement).append(optionElem);
	  }

	  function enable() {
		  $(".e-report__item_right", domElement).removeClass("e-inactive");
	  }

	  this.getDomElement = function() {
		  return domElement;
	  };
	  this.addOption = addOption;
	  this.addListElem = function(list) {
		  for(var i = 0; i < list.length; i++) {
			  addOption(list[i]);
		  }
	  }
	  this.setActiveElem = setActiveElem;
	  this.getActiveElem = function() {
		  return activeElem;
	  }
	  this.getActiveElemName = function() {
		  return activeElem[1];
	  }
	  this.getActiveElemId = function() {
		  return activeElem[0];
	  }
	  this.empty = function() {
		  $(".custom-options", domElement).empty();
		  activeElem = [0, ""];
		  $(".custom-select-trigger", domElement).html('&nbsp');
		  optionsArray = [];
	  }
	  this.disable = function() {
		  $(".e-report__item_right", domElement).addClass("e-inactive");
	  }
	  this.enable = enable;
  }

  // Класс модальное окно для выбора сотрудников
  function ModalCollaborator(config) {
    var title = config.title,
      paginationElem = config.paginationElem,
      curNumber = 0,
      newCollabCount = 0,
      curPageCollabArray = [],  // массив сотрудников отображенных в данный момент
      activeArray = [],
      tmpArray = [],
      search_string,
      role = config.role,
      callback = config.callback,
      domElement = createDomElement();

    function createDomElement() {
      var strArray = [
        '<div class="el_popup">',
        '	<table>',
        '		<tr>',
        '			<td>',
        '				<div class="el_popup_inner">',
        '					<div class="close"></div>',
        '					<div class="title">' + title + '</div>',
        '					<div class="e-report__input-wrap">',
        '						<input type="text" name="search" class="e-report__input e-report__input-search" placeholder="Поиск по ФИО" />',
        '						<button class="el_popup_btn_search collab_search"><span>Найти</span></button>',
        '					</div>',
        '					<div class="el_popup_choice_erase">Очистить</div>',
        '					<div class="event_table event_table_modal on_popup">',
        '						<div class="event_table_wrapper">',
        '							<table>',
        '								<thead>',
        '									<tr>',
        '										<th></th>',
        '										<th></th>',
        '										<th>Сотрудник</th>',
        '										<th>Организация</th>',
        '										<th>Подразделение</th>',
        '										<th>Должность</th>',
        '										<th></th>',
        '									</tr>',
        '								</thead>',
        '								<tbody>',

        '								</tbody>',
        '							</table>',
        '						</div>',
        '					</div>',
        '					<div class="el_popup_btn_line el_popup_btn_line_add">',
        '						<div class="el_popup_btn_submit">Добавить<span></span></div>',
        '						<div class="el_popup_btn_cancel"><span>Отменить</span></div>',
        '					</div>',
        '				</div>',
        '			</td>',
        '		</tr>',
        '	</table>',
        '</div>'
      ],
      elem = $(strArray.join('\r\n'));

      return elem;
    }

    function afterClose() {
      for(var i = 0; i < curPageCollabArray.length; i++) {
        curPageCollabArray[i].check(false);
      }
    }

    // Закрытие модального окна по клику на подложку или крестик
    domElement.click(function(event) {
      var el = $(event.target),
        div = $(this).find('.el_popup_inner');
      if (!el.closest('.el_popup_inner').length && !el.hasClass('el_popup_inner') || el.hasClass('close')) {
        div.animate({opacity: 0}, 300,
          function () {
            domElement.fadeOut(200);
            $('html, body').css('overflow-y', 'auto');
          }
        );
        tmpArray = [];
        setTimeout(function() {
          $(".el_popup_btn_submit span", domElement).text("");
          afterClose();
        }, 300);
      }
    });

    $(".el_popup_choice_erase", domElement).click(function(event) {
      for(var i = 0; i < curPageCollabArray.length; i++) {
        curPageCollabArray[i].check(false);
        tmpArray = [];
      }

      $(".el_popup_choice_erase", domElement).addClass("el_popup_choice_erase_disable");
      $(".el_popup_btn_submit span", domElement).text("");
    });

    // Обработчик кнопки добавить
    $(".el_popup_btn_submit", domElement).click(function(event) {
      var div = $('.el_popup_inner', domElement);
      div.animate({opacity: 0}, 300,
        function () {
          domElement.fadeOut(200);
          $('html, body').css("overflow-y", "auto");
        }
      );

      activeArray = [];
      for(var i = 0; i < tmpArray.length; i++) {
        activeArray.push(tmpArray[i]);
      }

      domElement.trigger("changeDataInModal");

			var activeTab = $(".js-tabs.active").attr("rel");
			setTabs(activeTab);

      setTimeout(function() {
        $(".el_popup_btn_submit span", domElement).text("");
        afterClose();
      }, 300);
    });

    // Закрытие модального окна по кномке Отменить
    $(".el_popup_btn_cancel", domElement).click(function(event) {
      var div = $('.el_popup_inner', domElement);
      div.animate({opacity: 0}, 300,
        function () {
          domElement.fadeOut(200);
          $('html, body').css("overflow-y", "auto");
        }
      );

      tmpArray = [];
      setTimeout(function() {
        $(".el_popup_btn_submit span", domElement).text("");
        afterClose();
      }, 300);
    });

	domElement.bind("changeDataInModal", function(e) {
		var users = [];
		var i;
		for (i = 0; i < activeArray.length; ++i) {
			users.push({
				id: activeArray[i].getId(),
				fullname: activeArray[i].getPersonFullname()
			});
		}
		var regAction = {
		  	name : "eldorado_d17_ra_event_users_change",
		  	options: [{name: "event_id", value: options.event_info.event_id},
					{name: "users", value: JSON.stringify(users)},
					{name: "users_role", value: role}]
		}

		remoteAction(regAction);
	});

    // Обработка изменения
    domElement.bind("changeCheckbox", function(event, isChecked, id) {
      var index = findInArray(tmpArray, id, fn),
        curPageIndex = findInArray(curPageCollabArray, id, fn),
        container = $(".el_popup_btn_submit span", domElement);

      if(isChecked && index == -1 && curPageIndex != -1) {
        tmpArray.push(curPageCollabArray[curPageIndex]);
      } else if(!isChecked && index != -1) {
        tmpArray.splice(index, 1);
      }

      if(tmpArray.length > 0) {
        $(".el_popup_choice_erase", domElement).removeClass("el_popup_choice_erase_disable");
      } else {
        $(".el_popup_choice_erase", domElement).addClass("el_popup_choice_erase_disable");
      }

      container.text(tmpArray.length == 0 ? "" : tmpArray.length);
    });

    $(".collab_search", domElement).click(function(event) {
      search_string = $(".e-report__input-search", domElement).val();
      callback(1, SIZE_PAG, search_string);
    });

    this.getDomElement = function() {
      return domElement;
    };
		this.getCurPageCollab = function() {
      return curPageCollabArray;
    };
		this.getTmp = function() {
			return tmpArray;
		};
    this.showModal = function() {
      var divM = domElement.find('.el_popup_inner');
      $('html, body').css("overflow-y", "hidden");
      domElement.fadeIn(200,
        function () {
          divM.animate({opacity: 1}, 300);
        }
      );

      tmpArray = [];
      var index;
      for(var i = 0; i < curPageCollabArray.length; i++) {
        index = findInArray(activeArray, curPageCollabArray[i].getId(), fn);
        if(index != -1) {
          curPageCollabArray[i].check(true);
        } else {
          curPageCollabArray[i].check(false);
        }
      }
      for(var i = 0; i < activeArray.length; i++) {
        tmpArray.push(activeArray[i]);
      }

      if(tmpArray.length > 0) {
        $(".el_popup_choice_erase", domElement).removeClass("el_popup_choice_erase_disable");
      } else {
        $(".el_popup_choice_erase", domElement).addClass("el_popup_choice_erase_disable");
      }

      $(".el_popup_btn_submit span", domElement).text(tmpArray.length == 0 ? "" : tmpArray.length)
    }
    this.addCollaborator = function(colObj) {
      var colEl = new ModalCollaboratorRow(colObj);
      curPageCollabArray.push(colEl);
      $(".event_table_wrapper tbody", domElement).append(colEl.getDomElement());
      if(findInArray(tmpArray, colEl.getId(), fn) != -1) {
        colEl.check(true);
      }
			return colEl;
    }
    this.empty = function() {
      $(".event_table_wrapper tbody", domElement).empty();
      curPageCollabArray = [];
    }
    this.disactiveCollaborator = function(id) {
      var index = findInArray(activeArray, id, fn);

      if(index !== -1) {
        activeArray.splice(index, 1);
      }

      if(activeArray.length == 0) {
        $(".el_popup_choice_erase", domElement).addClass("el_popup_choice_erase_disable");
      }
    }
    this.activeCollaborator = function(colEl) {
      var index = findInArray(activeArray, colEl.getId(), fn);

      if(index === -1) {
        activeArray.push(colEl);
        $(".el_popup_choice_erase", domElement).removeClass("el_popup_choice_erase_disable");
      }
    }
    this.setPaginationPanel = function(pagPanel) {
      if(paginationElem != undefined) {
        paginationElem.getDomElement().remove();
      }
      paginationElem = pagPanel;
      $(".event_table", domElement).after(paginationElem.getDomElement());
    }
    this.getPaginationPanel = function() {
      return paginationElem;
    }
    this.setCallback = function(fn) {
      callback = fn;
    }
    this.getActiveElem = function() {
      return activeArray;
    }
    this.getSearchString = function() {
      return search_string;
    }
  }

  // Класс сотрудник в модальном окне
  function ModalCollaboratorRow(config) {
    var id = config.id,
      personFullname = config.person_fullname || "",
      orgName = config.org_name || "",
      subdivisionName = config.subdivision_name || "",
      positionName = config.position_name || "",
      domElement = createDomElement();

    function createDomElement() {
      var elem = $('<tr/>').append(
        $('<td/>'),
        $('<td/>')
          .append($('<div/>')
                .addClass('style_checkbox')
                .append($('<label/>')
                      .append($('<input/>')
                            .attr('type', 'checkbox')
                            .attr('name', "user[]")
                            .attr('value', "2")))),
        $('<td/>')
          .text(personFullname),
        $('<td/>')
          .text(orgName),
        $('<td/>')
          .text(subdivisionName),
        $('<td/>')
          .text(positionName),
        $('<td/>')
      );

      return elem;
    }

    domElement.click(function(event) {
      var input = $(this).find('input');
      var newValue;
      if(event.target == input[0]) {
        if(input.prop('checked')) {
          domElement.addClass('tr_checked');
        } else {
          domElement.removeClass('tr_checked');
        }
        domElement.trigger("changeCheckbox", [input.prop('checked'), id]);
      } else {
        newValue = !input.prop('checked');
        check(newValue);
        domElement.trigger("changeCheckbox", [newValue, id]);
      }
    });

    function check(value) {
      if(value) {
        domElement.addClass('tr_checked');
      } else {
        domElement.removeClass('tr_checked');
      }
      domElement.find('input').prop('checked', value);
    }

    this.getDomElement = function() {
      return domElement;
    }
    this.getId = function() {
      return id;
    }
    this.getPersonFullname = function() {
      return personFullname;
    }
    this.getOrgName = function() {
      return orgName;
    }
    this.getSubdivisionName = function() {
      return subdivisionName;
    }
    this.getPositionName = function() {
      return positionName;
    }
    this.check = check;
  }

  	// Получаем значение в байтах
	function getSize(value)
	{
	  var lock = 0;
	  var __size = value;

	  while (__size > 1024 && lock <= 3)
	  {
		  __size = __size / 1024.0;
		  lock++;
	  }

	  switch(lock)
	  {
		  case 0:
			  return Number(__size).toFixed(1) + " Б";
			  break;
		  case 1:
			  return Number(__size).toFixed(1) + " Кб";
			  break;
		  case 2:
			  return Number(__size).toFixed(1) + " Мб";
			  break;
		  default:
			  return "?";
			  break;
	  }
	}
	// Удаление/добавление файла
	function updateFile(file_action) {
		var form_data;
		if (typeof FormData == 'function') {
			var file = document.getElementById("addingFile").files[0];
			form_data = new FormData();
			if (file != undefined && file_action == "add_file") {
				form_data.append('action', "file_update");
				var file_size = file.size;
				var file_type = file.name;
				if (file_type.indexOf(".") != -1) {
					var temp_arr = file_type.split(".");
					file_type = temp_arr[temp_arr.length-1];
				}
				if (file_size > MAX_FILE_SIZE) {
          var popup = $("#el_popup_error");
          popup.find(".e-report__item").text("Выберите файл с меньшим размером. Вес файла не должен превышать 5 Мб");
          popup.fadeIn(300);
          return false;
				}
				if (file_type != "pdf" && file_type != "txt" && file_type != "doc" &&
					file_type != "docx" && file_type != "ppt" && file_type != "pptx" &&
					file_type != "csv" && file_type != "xls" && file_type != "rar" &&
					file_type != "wav" && file_type != "mp3" && file_type != "mp4" &&
					file_type != "avi" && file_type != "mkv") {
            var popup = $("#el_popup_error");
            popup.find(".e-report__item").text("Файл должен иметь один из следующих форматов: PDF, TXT, DOC, DOCX, PPT, PPTX, CSV, EXCEL, RAR, WAV, MP3, MP4, AVI, MKV.");
            popup.fadeIn(300);
        		$('html, body').css('overflow-y', 'hidden');
						return false;
				}
				form_data.append('file', file);
				form_data.append('file_name', file.name);
				form_data.append('file_size', file_size);
				form_data.append('file_type', file_type);
				form_data.append("file_action", file_action);
				form_data.append('event_id', options.event_info.event_id);
			}
			if (file_action == "remove_file") {
				form_data.append('action', "file_update");
				form_data.append("file_action", file_action);
				form_data.append('event_id', options.event_info.event_id);
				form_data.append("file_id", removeId);
				removeId = "";
			}

			$.ajax({
				url        : "custom_web_template.html?object_id=" + options.save_data_template_id,
				data       : form_data,
				type: "POST",
				dataType: "json",
				processData: false,
				contentType: false,
				async: true,
			}).done(function(data) {
				//var result = JSON.parse(data);
				setTimeout(function() {
					var result = data;

				  if (result.success) {
				  	if (file_action == "add_file" && result.doc_id != 0) {
							options.event_files.push({
								id: result.doc_id,
								name: file.name,
								size: file_size,
								type: file_type
							});
							var wraperParent = $("#event_file_list");
							wraperParent.show();
							var wraper = $("#event_file_list ul");
							wraper.append(Render.EventFileRow(options.event_files[options.event_files.length-1]));
				    }
				    if (file_action == "remove_file") {
						var wraperParent = $("#event_file_list");
						if (wraperParent.children("ul").length == 1)
							wraperParent.hide();
				    	var fileRemove = $("#event_file_list .fileRemove");
							fileRemove.closest(".e-file__item").remove();
				    }
				  }
				}, 300);
			});
		} else {
			var sendObject = {};
			if (file_action == "add_file") {
				sendObject.action = "file_update";
				sendObject.file_action = file_action;
				sendObject.event_id = options.event_info.event_id;
				//$("#bad_browser").fadeIn(300);
			}
			if (file_action == "remove_file") {
				sendObject.action = "file_update";
				sendObject.file_action = file_action;
				sendObject.event_id = options.event_info.event_id;
				sendObject.file_id = removeId;
				removeId = "";
			}

			$.ajax({
				url        : "custom_web_template.html?object_id=" + options.save_data_template_id,
				data       : sendObject,
				type       : "POST",
				async      : false,
				contentType: "application/x-www-form-urlencoded;charset=UTF-8"
			}).done(function(data) {
				setTimeout(function () {
					var result = JSON.parse(data);

				  if (result.success) {
						if (file_action == "add_file" && result.doc_id != 0) {
							options.event_files.push({
								id: result.doc_id,
								name: file.name,
								size: file_size,
								type: file_type
							});
							var wraper = $("#event_file_list ul");
							wraper.append(Render.EventFileRow(options.event_files[options.event_files.length-1]));
						}
						if (file_action == "remove_file") {
						  var fileRemove = $("#event_file_list .fileRemove");
							fileRemove.closest(".e-file__item").remove();
					 	}
				  }
				}, 300);
			});
		}
	}

	// Добавление участников (по ролям)
	function makeSendAjax(callback, role) {
		// Получение данных с сервера
		return	function (start, size, search_string) {
			var data = {
					collection_code: "eldorado_event_collaborators"
			}
			if(size !== undefined) {
				data.limit = size;
			}
			if(start !== undefined) {
				data.start = start;
			}
			if(search_string !== undefined) {
				data.parameters = 'search_string=' + search_string
			}
			if(role == "lector") {
				if (search_string !== undefined)
					data.parameters += ';role=' + role;
				else
					data.parameters = 'role=' + role;
			}
			preloader.start();
			$.ajax({
				type: "POST",
				url: "/pp/Ext/extjs_json_collection_data.html",
				dataType: "json",
				data: data,
				success: callback
			});
		}
	}

	function firstHandlerCollab(data, textStatus, jqXHR) {
		var prevDataTotal = data.total,
			width = getDocumentWidth();

		preloader.stop();
		pagCollab = new Pagination({
			size: SIZE_PAG,
			total: prevDataTotal,
			callback: makeSendAjax(secondHandlerCollab),
			countVisible: (width <= 760 ? 3 : 10)
		});
		modCollab.setPaginationPanel(pagCollab);
		modCollab.setCallback(makeSendAjax(secondHandlerCollab));

		for(var i = 0; i < data.results.length; i++) {
			modCollab.addCollaborator(data.results[i]);
		}
		modCollab.showModal();

		function secondHandlerCollab(data, textStatus, jqXHR) {
			var activeArray = modCollab.getActiveElem();

			preloader.stop();
			modCollab.empty();

			for(var i = 0; i < data.results.length; i++) {
				modCollab.addCollaborator(data.results[i]);
			}

			if(prevDataTotal != data.total) {
				prevDataTotal = data.total;
				pagCollab = new Pagination({
					size: SIZE_PAG,
					total: prevDataTotal,
					callback: makeSendAjax(secondHandlerCollab),
					countVisible: (width <= 760 ? 3 : 10)
				});
				modCollab.setPaginationPanel(pagCollab);
				pagCollab.setSearchString(modCollab.getSearchString());
			}
		}
	}
	function firstHandlerTutor(data, textStatus, jqXHR) {
		var prevDataTotal = data.total,
			width = getDocumentWidth();

		preloader.stop();
		pagTutor = new Pagination({
			size: SIZE_PAG,
			total: prevDataTotal,
			callback: makeSendAjax(secondHandlerTutor),
			countVisible: (width <= 760 ? 3 : 10)
		});
		modTutor.setPaginationPanel(pagTutor);
		modTutor.setCallback(makeSendAjax(secondHandlerTutor));

		for(var i = 0; i < data.results.length; i++) {
			modTutor.addCollaborator(data.results[i]);
		}
		modTutor.showModal();

		function secondHandlerTutor(data, textStatus, jqXHR) {
			var activeArray = modTutor.getActiveElem();

			preloader.stop();
			modTutor.empty();

			for(var i = 0; i < data.results.length; i++) {
				modTutor.addCollaborator(data.results[i]);
			}

			if(prevDataTotal != data.total) {
				prevDataTotal = data.total;

				pagTutor = new Pagination({
					size: SIZE_PAG,
					total: prevDataTotal,
					callback: makeSendAjax(secondHandlerTutor),
					countVisible: (width <= 760 ? 3 : 10)
				});
				modTutor.setPaginationPanel(pagTutor);
				pagTutor.setSearchString(modTutor.getSearchString());
			}
		}
	}
	function firstHandlerPrep(data, textStatus, jqXHR) {
		var prevDataTotal = data.total,
			width = getDocumentWidth();

		preloader.stop();
		pagPrep = new Pagination({
			size: SIZE_PAG,
			total: prevDataTotal,
			callback: makeSendAjax(secondHandlerPrep),
			countVisible: (width <= 760 ? 3 : 10)
		});
		modPrep.setPaginationPanel(pagPrep);
		modPrep.setCallback(makeSendAjax(secondHandlerPrep));

		/*var activeArray = modPrep.getActiveElem();
		var index;
		for(var i = 0; i < data.results.length; i++) {
			index = findInArray(activeArray, data.results[i].id, fn);
			if (index == -1) {
				modPrep.addCollaborator(data.results[i]);
			}
		}*/

		for(var i = 0; i < data.results.length; i++) {
			modPrep.addCollaborator(data.results[i]);
		}
		modPrep.showModal();

		function secondHandlerPrep(data, textStatus, jqXHR) {
			var activeArray = modPrep.getActiveElem();

			preloader.stop();
			modPrep.empty();

			for(var i = 0; i < data.results.length; i++) {
				modPrep.addCollaborator(data.results[i]);
			}

			if(prevDataTotal != data.total) {
				prevDataTotal = data.total;

				pagPrep = new Pagination({
					size: SIZE_PAG,
					total: prevDataTotal,
					callback: makeSendAjax(secondHandlerPrep),
					countVisible: (width <= 760 ? 3 : 10)
				});
				modPrep.setPaginationPanel(pagPrep);
				pagPrep.setSearchString(modPrep.getSearchString());
			}
		}
	}
	function firstHandlerLector(data, textStatus, jqXHR) {
		var prevDataTotal = data.total,
			width = getDocumentWidth();

		preloader.stop();
		pagLector = new Pagination({
			size: SIZE_PAG,
			total: prevDataTotal,
			callback: makeSendAjax(secondHandlerLector, "lector"),
			countVisible: (width <= 760 ? 3 : 10)
		});
		modLector.setPaginationPanel(pagLector);
		modLector.setCallback(makeSendAjax(secondHandlerLector, "lector"));

		for(var i = 0; i < data.results.length; i++) {
			modLector.addCollaborator(data.results[i]);
		}
		modLector.showModal();

		function secondHandlerLector(data, textStatus, jqXHR) {
			var activeArray = modLector.getActiveElem();

			preloader.stop();
			modLector.empty();

			for(var i = 0; i < data.results.length; i++) {
				modLector.addCollaborator(data.results[i]);
			}

			if(prevDataTotal != data.total) {
				prevDataTotal = data.total;

				pagLector = new Pagination({
					size: SIZE_PAG,
					total: prevDataTotal,
					callback: makeSendAjax(secondHandlerLector, "lector"),
					countVisible: (width <= 760 ? 3 : 10)
				});
				modLector.setPaginationPanel(pagLector);
				pagLector.setSearchString(modLector.getSearchString());
			}
		}
	}

	var isFirstModalCollabOpen = true;
	var isFirstModalTutorOpen = true;
	var isFirstModalPrepOpen = true;
	var isFirstModalLectorOpen = true;
	$(document).delegate('.js_change', 'click', function () {
    var tab = $(".js-tabs-group > .js-tabs.active").attr("rel");

		if (tab == "first") {
			if (isFirstModalTutorOpen) {
				var curPageCollabArray = modTutor.getCurPageCollab();
				var tmpArray = modTutor.getTmp();

				while(curPageCollabArray.length > 0)
					curPageCollabArray.pop();
				while(tmpArray.length > 0)
					tmpArray.pop();

				(makeSendAjax(firstHandlerTutor))(0, SIZE_PAG);
				isFirstModalTutorOpen = false;
			} else {
				modTutor.showModal();
			}
		}
		else if (tab == "second") {
			if (isFirstModalPrepOpen) {
				var curPageCollabArray = modPrep.getCurPageCollab();
				var tmpArray = modPrep.getTmp();

				while(curPageCollabArray.length > 0)
					curPageCollabArray.pop();
				while(tmpArray.length > 0)
					tmpArray.pop();

				(makeSendAjax(firstHandlerPrep))(0, SIZE_PAG);
				isFirstModalPrepOpen = false;
			} else {
				modPrep.showModal();
			}
		}
		else if (tab == "third") {
			if (isFirstModalLectorOpen) {
				var curPageCollabArray = modLector.getCurPageCollab();
				var tmpArray = modLector.getTmp();

				while(curPageCollabArray.length > 0)
					curPageCollabArray.pop();
				while(tmpArray.length > 0)
					tmpArray.pop();

				(makeSendAjax(firstHandlerLector, "lector"))(0, SIZE_PAG);
				isFirstModalLectorOpen = false;
			} else {
				modLector.showModal();
			}
		}
		else {
			if (isFirstModalCollabOpen) {
				var curPageCollabArray = modCollab.getCurPageCollab();
				var tmpArray = modCollab.getTmp();

				while(curPageCollabArray.length > 0)
					curPageCollabArray.pop();
				while(tmpArray.length > 0)
					tmpArray.pop();

				(makeSendAjax(firstHandlerCollab))(0, SIZE_PAG);
				isFirstModalCollabOpen = false;
			} else {
				modCollab.showModal();
			}
		}
	});

	// Открытие модального окна по нажатию "Написать отзыв"
	$(document).delegate('.e-link_red:not(.disabled)', 'click', function() {
		$('#el_popup_response_event').fadeIn(300);
		$('#user-response-event-submit').removeClass("submitted");
		$('html, body').css('overflow-y', 'hidden');
		$("#modal-message").removeClass("e-report__textarea_red");
		$("#personal-info-status").hide();

		// Изменение размера текстового поля для "Отправки отзыва"
		try {
			var dimInput = $("#el_popup_response_event .title");
			$(".e-report__textarea").css({
				"width": dimInput.width() + "px",
				"height": dimInput.height() * 5 + "px"
			}).val("").focus();
		}
		catch (e) {}
		return false;
	});
	$(document).delegate(".js-tabs", "click", function(e) {
		var activeTab = $(this).attr("rel");
		setTabs(activeTab);
	});
  $(document).delegate("#fact_made", "click", function() {
    // Удалённое действие (сохранение изменений)
    var regAction = {
      name : "eldorado_d17_ra_fact_made_change",
      options: [{name: "eventId", value: options.event_info.event_id},
                {name: "fact_made", value: $(this).prop("checked")}]
    }
    remoteAction(regAction);

    options.event_info.is_fact_made = $(this).prop("checked");
	});
	$(document).delegate(".js-tabs-item > input[name='search']",
                        window.oninput !== undefined ? "input" : "change", function() {
		var wrapper = $(this).next().children('.event_collaborator');

		var activeTab = $(this).parent().attr("id");
		var collaborators;
		if (activeTab == "first")
		 collaborators = modTutor.getActiveElem();
		else if (activeTab == "second")
 		 collaborators = modPrep.getActiveElem();
		else if (activeTab == "third")
  	 collaborators = modLector.getActiveElem();
		else
   	 collaborators = modCollab.getActiveElem();

		var queryStr = $(this).val().toLowerCase();
		var i;
		var foundCollaborators = [];
		for (i = 0; i < collaborators.length; ++i) {
			if (collaborators[i].getPersonFullname().toLowerCase().indexOf(queryStr) != -1)
				foundCollaborators.push(collaborators[i]);
		}
		Render.EventCollaboratorTableRows(wrapper, foundCollaborators);
	});

	// Установка обработчиков даты
	function setDateListeners() {
		var startd = $("#start_date .e-report__input_date");
		var finishd = $("#finish_date .e-report__input_date");
		var startt = $("#start_date .e-report__input_time");
		var finisht = $("#finish_date .e-report__input_time");

		// Дата и время начала
		startd.change(function(e) {
			$(this).removeClass("error");
			finishd.removeClass("error");
			var dateStr = $(this).val(),
				maxDate,
				dateVal;
			maxDate = startd.datepicker("option", "maxDate");
			if (dateStr.length != 0) {
				if (isValidDateInput("#start_date .e-report__input_date")) {
					dateVal = getDateFromString(dateStr);
					if (maxDate === null || dateVal <= maxDate) {
						finishd.datepicker("option", "minDate", startd.datepicker("getDate"));
					}
					else {
						startd.datepicker("setDate", maxDate);
						finishd.datepicker("option", "minDate", startd.datepicker("getDate"));
					}
				}
				else {
					startd.datepicker("setDate", null);
					startd.datepicker("option", "maxDate", finishd.datepicker("getDate"));
					finishd.datepicker("option", "minDate", null);
					startt.val("");
				}
			}
			else {
				startd.datepicker("option", "maxDate", finishd.datepicker("getDate"));
				finishd.datepicker("option", "minDate", null);
				startt.val("");
			}
			startt.trigger("change");
		});

		startd.on("keydown", function(event) {
			(event.keyCode == 13) ? $(this).trigger("change") : false;
		})

		startt.on("change", function() {
			if (startd.val().length != 10 || $(this).val().length != 5 ||
				$(this).val().indexOf("_") != -1) {
				$(this).val("");
				return false;
			}
			else {
				$(this).removeClass("error");
				finisht.removeClass("error");
				if (!isValidTime($(this).val())) {
					$(this).val("");
				}
				else if (startd.val() == finishd.val()) {
					var arrST = $(this).val().split(':');
					var arrFT = finisht.val().split(':');

					if (arrFT.length > 0) {
						if (arrST[0] > arrFT[0])
							$(this).val(finisht.val());
						else if (arrST[0] == arrFT[0]) {
							if (arrST[1] >= arrFT[1]) {
								if (arrFT[1] == "0") {
									$(this).val(arrST[0] + ":00");
									finisht.val(arrST[0] + ":01");
								}
								else
									$(this).val(arrST[0] + ":" + (+arrFT[1]-1));
							}
						}
					}
				}
			}
		});

		// Дата и время окончания
		finishd.change(function(e) {
			$(this).removeClass("error");
			startd.removeClass("error");
			var dateStr = $(this).val(),
				minDate,
				dateVal;
			minDate = finishd.datepicker("option", "minDate");
			if (dateStr.length != 0) {
				if (isValidDateInput("#finish_date .e-report__input_date")) {
					dateVal = getDateFromString(dateStr);
					if (minDate === null || dateVal > minDate) {
						startd.datepicker("option", "maxDate", finishd.datepicker("getDate"));
					}
					else {
						finishd.datepicker("setDate", minDate);
						startd.datepicker("option", "maxDate", finishd.datepicker("getDate"));
					}
				}
				else {
					finishd.datepicker("setDate", null);
					startd.datepicker("option", "maxDate", null);
					finishd.datepicker("option", "minDate", startd.datepicker("getDate"));
					finisht.val("");
				}
			}
			else {
				startd.datepicker("option", "maxDate", null);
				finishd.datepicker("option", "minDate", startd.datepicker("getDate"));
				finisht.val("");
			}
			finisht.trigger("change");
		});

		finishd.on("keydown", function(event) {
			(event.keyCode == 13) ? $(this).trigger("change") : false;
		})

		finisht.on("change", function() {
			if (finishd.val().length != 10 || $(this).val().length != 5 ||
				$(this).val().indexOf("_") != -1) {
				$(this).val("");
				return false;
			}
			else {
				$(this).removeClass("error");
				startt.removeClass("error");
				if (!isValidTime($(this).val())) {
					$(this).val("");
				}
				else if (startd.val() == finishd.val()) {
					var arrST = startt.val().split(':');
					var arrFT = $(this).val().split(':');

					if (arrST.length > 0) {
						if (arrFT[0] < arrST[0])
							$(this).val(startt.val());
						else if (arrST[0] == arrFT[0]) {
							if (arrFT[1] <= arrST[1]) {
								if (arrST[1] == "59") {
									$(this).val(arrFT[0] + ":59");
									startt.val(arrFT[0] + ":58");
								}
								else
									$(this).val(arrFT[0] + ":" + (+arrST[1]+1));
							}
						}
					}
				}
			}
		});
	}

	// Преобразует строку в дату
	function getDateFromString(str) {
		var dateArray = str.split('.');
		return new Date(dateArray[2], +dateArray[1] - 1, dateArray[0]);
	}
	function dateStr(dat) {
		var y = dat.getFullYear();
		m = dat.getMonth() + 1;
		d = dat.getDate();
		return ("0" + d).slice(-2) + "." + ("0" + m).slice(-2) + "." + y;
	}
	// Проверяет на корректность дату введеную руками в input
	function isValidDateInput(selector) {
		var elem = $(selector),
			dateStr = elem.val(),
			dateArray = dateStr.split('.'),
			dateVal;

		if(dateArray.length === 3) {
			dateVal = new Date(dateArray[2], +dateArray[1] - 1, dateArray[0]);
			if(	dateVal.getFullYear() === +dateArray[2] &&
				dateVal.getMonth() === +dateArray[1] - 1 &&
				dateVal.getDate() === +dateArray[0] ) {
				return true;
			}
		}
		return false;
	}
	function isValidTime(_time) {
		var arr = _time.split(':');
		if(arr.length != 2) {
			return false;
		}
		if(arr[0] === "" || arr[1] === "") {
			return false;
		}
		if(+arr[0] > 23 || +arr[0] < 0) {
			return false;
		}
		if(+arr[1] > 59 || +arr[1] < 0) {
			return false;
		}
		return true;
	}
	// Получение временного периода
	function getTimes() {
		var startd = $("#start_date .e-report__input_date").val();
		var finishd = $("#finish_date .e-report__input_date").val();
		var startt = $("#start_date .e-report__input_time").val();
		var finisht = $("#finish_date .e-report__input_time").val();

		if (startd.length != 0) {
			startd = getDateFromString(startd);
			if (startt.length != 0) {
				var arrST = startt.split(":");
				startd.setHours(arrST[0],arrST[1]);
			}

			startd = startd.toJSON();
		}
		else
			startd = "";
		if (finishd.length != 0) {
			finishd = getDateFromString(finishd);
			if (finisht.length != 0) {
				var arrFT = finisht.split(":");
				finishd.setHours(arrFT[0],arrFT[1]);
			}
			else {
				finishd.setHours("23","59");
			}

			finishd = finishd.toJSON();
		}
		else
			finishd = "";

		return [startd, finishd];
	}
	function fillFormEdit() {
		$("#modal-event-name").val(options.event_info.event_name);

		var eventType = $("#modal-event-type");
		eventType.text(options.event_info.event_type_name);
		eventType.next().children().removeClass("selection");
		eventType.next().children("[data-value=" + options.event_info.event_type_id + "]").addClass("selection");

		$("#modal-event-topic").val(options.event_info.topic);

		var eventForm = $("#modal-event-form");
		eventForm.text(options.event_info.event_form_name);
		eventForm.next().children().removeClass("selection");
		eventForm.next().children("[data-value=" + options.event_form_id + "]").addClass("selection");

		var orgForm = $("#modal-org-form");
		orgForm.text(options.event_info.org_form_name);
		orgForm.next().children().removeClass("selection");
		orgForm.next().children("[data-value=" + options.org_form_id + "]").addClass("selection");

		var city = $("#modal-event-city");
		city.val(options.event_info.place_name);
		city.parent().next().children().removeClass("selection labeled");
		city.parent().next().children("[data-value=" + options.event_info.place_id + "]").addClass("selection labeled");

		$("#modal-event-place").val(options.event_info.place);

		$("#start_date .e-report__input_date").val(options.event_info.start_date);
		$("#start_date .e-report__input_time").val(options.event_info.start_time);

		$("#finish_date .e-report__input_date").val(options.event_info.finish_date);
		$("#finish_date .e-report__input_time").val(options.event_info.finish_time);
	}
	function formatText(text) {
  		var val = $.trim(text);
  		val = val.replace('/\t/g', '    ');
  		return encodeURIComponent(val);
 	};
	function getFormEdit() {
		var result = {};
		result.eName = $("#modal-event-name").val();
		result.eTopic = $("#modal-event-topic").val();

		var eventType = $("#modal-event-type");
		result.eType = {};
		result.eType.name = eventType.text();
		result.eType.id = eventType.next().children("[class~=selection]").attr("data-value");

		var eventForm = $("#modal-event-form");
		result.eForm = {};
		result.eForm.name = eventForm.text();
		result.eForm.id = eventForm.next().children("[class~=selection]").attr("data-value");

		var orgForm = $("#modal-org-form");
		result.eOrgForm = {};
		result.eOrgForm.name = orgForm.text();
		result.eOrgForm.id = orgForm.next().children("[class~=selection]").attr("data-value");

		var city = $("#modal-event-city");
		result.eCity = {};
		result.eCity.name = city.val();
		result.eCity.id = city.parent().next().children("[class~=selection]").attr("data-value");

		result.ePlace = $("#modal-event-place").val();

		var dates = getTimes();
		result.eStartDate = dates[0];
		result.eFinishDate = dates[1];

		return result;
	}
	function setEventInfo(data) {
		// Установка значений options
		var eventInfo = options.event_info;
		eventInfo.event_name = data.eName;
		eventInfo.event_form_name = data.eForm.name;
		options.event_form_id = data.eForm.id;
		eventInfo.org_form_name = data.eOrgForm.name;
		options.org_form_id = data.eOrgForm.id;
		eventInfo.topic = data.eTopic;
		eventInfo.event_type_name = data.eType.name;
		eventInfo.event_type_id = data.eType.id;
		eventInfo.place_name = data.eCity.name;
		eventInfo.place_id = data.eCity.id;
		eventInfo.place = data.ePlace;
		eventInfo.start_date = $("#start_date .e-report__input_date").val();
		eventInfo.start_time = $("#start_date .e-report__input_time").val();
		eventInfo.finish_date = $("#finish_date .e-report__input_date").val();
		eventInfo.finish_time = $("#finish_date .e-report__input_time").val();
	}
	var firstOpenEdit = true;
	$(document).delegate('.el_event_edit', 'click', function () {
		$("#event-info-status").hide();
        $('#el_popup_edit').fadeIn(300);
		$('html, body').css('overflow-y', 'hidden');

		if (firstOpenEdit) {
			var firstLineForm = $("#el_popup_edit .e-report .e-report__line:eq(1)");
			firstLineForm.after(city.getDomElement());
			firstLineForm.after(orgForm.getDomElement());
			firstLineForm.after(eventForm.getDomElement());
			firstLineForm.after(eventType.getDomElement());
			firstOpenEdit = false;
		}

		fillFormEdit();
		return false;
  });
	$(document).delegate('#el_popup_edit .el_popup_btn_cancel, .el_popup_inner .close', 'click', function () {
        Render.ModalWindosClosed();
    });
	$(document).delegate("#user-response-event-submit:not(.submitted)", "click", function() {
		var message = $("#modal-message").val();
		var self = $(this);
		var re = /\S/;

		if (re.exec(message) !== null) {
			self.addClass("submitted");
			message = ctrlSecReplacer(message);

			$("#modal-message").val(message);
			$("#modal-message").removeClass("e-report__textarea_red");

			// Удалённое действие (сохранение изменений)
			var regAction = {
				name : "eldorado_d17_ra_create_event_user_response",
			  options: [{name: "eldorado_d17_response_1", value: message},
									{name: "event_id", value: options.event_info.event_id},
									{name: "event_name", value: formatText(options.event_info.event_name)},
									{name: "event_start_date",
									 value: options.event_info.start_date}],
				callback_f : function(data) {
					setTimeout(function() {
						if (data.error == 0) {
							Render.ModalWindosClosed();
						}
						else {
							$("#personal-info-status").children().last().
								text(data.messageText);
							$("#personal-info-status").show();
							self.removeClass("submitted");
						}
					}, 300);
				}
			}

			remoteAction(regAction);
		}
		else {
			$("#modal-message").addClass("e-report__textarea_red");
			$("#personal-info-status").children().last().
				text("Введите сообщение! (не менее одного символа, но не более 500)");
			$("#personal-info-status").show();
		}
	});
	$(document).delegate("#user-response-event-cancel", "click", function() {
		$("#personal-info-status").hide();
		Render.ModalWindosClosed();
	});
	var prevComment = "";
	$(document).delegate(".event_table_choice_str", "focus", function() {
		$(this).addClass("edit");
		if ($(this).text().length > 0 && $(this).hasClass("changed"))
			prevComment = $(this).text();
		if (!$(this).hasClass("changed"))
			$(this).text("");
	});

	$(document).delegate(".event_table_choice_str", "blur", function(e) {
		if ($(this).hasClass("edit")) {
			$(this).removeClass("edit");
			var pushText = $(this).text();
			if (pushText.length == 0) {
				$(this).removeClass("changed").text("Написать");
				if (prevComment.length == 0)
					return;
				else
					pushText = "";
			}
			else if (pushText == prevComment) {
				return;
			}
			else {
				$(this).addClass("changed");
			}
			prevComment = "";

			var regActionCommentSet = {
				name : "eldorado_d17_ra_event_set_collaborator_comment",
				options: [{name: "collaborator_comment", value: formatText(pushText)},
							  	{name: "eventID", value: options.event_info.event_id}]
			};
			remoteAction(regActionCommentSet);

			options.collaborator_comment = formatText(pushText);
			return;
		}
		else {
			return;
		}
	});

	var MAX_LENGTH = 100;
	$(document).delegate(".event_table_choice_str", window.oninput !== undefined ? "input" : "change", function() {
		if (!$(this).hasClass("changed"))
			$(this).addClass("changed");
		if ($(this).text().length > MAX_LENGTH) {
			document.execCommand("undo");
			return false;
		}
	});

	$(document).delegate(".event_table_choice_str", "keydown", function(e) {
		/*if (e.keyCode == 13 && e.shiftKey && (+$(this).height() <= +$(this).css("max-height").replace("px", "") - 17)) {
			document.execCommand("insertText", false, "\n");
			return false;
		}*/
		if (e.keyCode == 13) {
			e.preventDefault();
			$(this).trigger("blur");
		}
	});
	$(document).delegate('.js_add_file', 'click', function() {
		if (typeof FormData == 'function') {
				$("#file-input-wrap").children('input').click();
		} else {
				$("#bad_browser").fadeIn(300);
		}
	});
	var removeId = "";
	$(document).delegate('span.remove', 'click', function() {
		var curFile = $(this).prev();
		var curUrlFile = curFile.attr("href");
		var pos = curUrlFile.lastIndexOf("=");
		removeId = curUrlFile.substr(pos + 1);
		$(this).addClass('fileRemove');
		updateFile("remove_file");
	});
	$(document).delegate("#file-input-wrap input[type=file]", "change", function() {
		if ($(this).val().length != 0) {
			updateFile("add_file");
		}
	});

	// Удалённое действие для изменения плана
	var regActionStatusSet = {
		name : "eldorado_d17_ra_event_set_status",
		options: [{name: "eventId", value: options.event_info.event_id},
				  {name: "sNewStatusParam", value: "project"},
			  	  {name: "bSendNotificationsParam", value: false}]
	}
	$(document).delegate(".el_course_card_btn_blue:not(.disabled)", "click", function(){
		regActionStatusSet.options[1].value = "plan";
		regActionStatusSet.options[2].value = true;
		remoteAction(regActionStatusSet);

		options.event_info.status_id = "plan";
		$("#event_state").text("Планируется");
		Render.EventAccess(true);
	});
	$(document).delegate(".el_course_card_btn_green:not(.disabled)", "click", function(){
		regActionStatusSet.options[1].value = "active";
		remoteAction(regActionStatusSet);

		options.event_info.status_id = "active";
		$("#event_state").text("Проводится");
		Render.EventAccess(true);
	});
	$(document).delegate(".el_course_card_btn_white:not(.disabled)", "click", function(){
		regActionStatusSet.options[1].value = "close";
		remoteAction(regActionStatusSet);

		options.event_info.status_id = "close";
		$("#event_state").text("Завершено");
		Render.EventAccess(true);
	});
	$(document).delegate(".el_course_card_btn_grey:not(.disabled)", "click", function(){
		regActionStatusSet.options[1].value = "cancel";
		remoteAction(regActionStatusSet);

		options.event_info.status_id = "cancel";
		$("#event_state").text("Отменено");
		Render.EventAccess(true);
	});
	$(document).delegate("#user-info-submit", "click", function(){
		var data = getFormEdit();
		var regAction = {
		  	name : "eldorado_d17_ra_event_info_change",
		  	options: [{name: "eName", value: formatText(data.eName)},
						{name: "eTopic", value: formatText(data.eTopic)},
					  {name: "eTypeId", value: data.eType.id},
						{name: "eFormId", value: data.eForm.id},
					  {name: "eOrgFormId", value: data.eOrgForm.id},
					  {name: "eCityId", value: data.eCity.id},
					  {name: "ePlace", value: formatText(data.ePlace)},
					  {name: "eStartDate", value: data.eStartDate},
					  {name: "eFinishDate", value: data.eFinishDate},
				  	  {name: "eId", value: options.event_info.event_id}]
		}
		remoteAction(regAction);
		setEventInfo(data);

		Render.EventInfo();
		Render.ModalWindosClosed();
	});

  // Инициализация данных
  init();
})(<%=tools.object_to_text(options, "json")%>);
</script>
<%
}
catch(ex)
{
	Response.Write("Ошибка в файле скриптов - " + ex);
}
%>
