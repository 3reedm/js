<%
try
{
	function getResourceLink(resourceCode)
	{
		var resource_file = ArrayOptFirstElem(XQuery("for $elem in resources where $elem/code='" + resourceCode + "' return $elem"));

		if(resource_file != undefined)
		{
			return "download_file.html?file_id=" + RValue(resource_file.id);
		}
		else
		{
			return "";
		}
	}

	tenancy_name = tools.get_thread_tenancy_name();

	// Проверка, является ли текущий пользователь АР или ФР
	sql = "";
	sql += "SELECT TOP 1\r\n";
	sql += "	[func].[person_id] AS [is_boss]\r\n";
	sql += "FROM \r\n";
	sql += "	[" + tenancy_name + "].[func_managers] AS [func]\r\n";
	sql += "	INNER JOIN [" + tenancy_name + "].[collaborators] AS [coll] ON [coll].[id] = [func].[person_id] AND [coll].[id] = " + curUserID + "\r\n";
	sql += "	INNER JOIN [" + tenancy_name + "].[boss_types] AS [type] ON [type].[id] = [func].[boss_type_id] AND [type].[code] IN ('main', 'main_adm')\r\n";

	is_boss = ((ArrayOptFirstElem(XQuery("sql: " + sql), {is_boss: {Value: 0}}).is_boss.Value) != 0);

	// Проверка, является ли текущий пользователь Тренером
	sql = "";
	sql += "SELECT TOP 1\r\n";
	sql += "	[els].[person_id] AS [is_lector]\r\n";
	sql += "FROM \r\n";
	sql += "	[" + tenancy_name + "].[event_lectors] AS [els]\r\n";
	sql += "	INNER JOIN [" + tenancy_name + "].[collaborators] AS [cs] ON [els].[person_id] = [cs].[id] AND [cs].[id] = " + curUserID + "\r\n";

	is_lector = ((ArrayOptFirstElem(XQuery("sql: " + sql), {is_lector: {Value: 0}}).is_lector.Value) != 0);

	// Проверка, является ли текущий пользователь Администратором (роль)
	sql = "";
	sql += "SELECT TOP 1\r\n";
	sql += "	[cs].[id] AS [is_admin]\r\n";
	sql += "FROM \r\n";
	sql += "	[" + tenancy_name + "].[collaborators] AS [cs]\r\n";
	sql += "WHERE\r\n"
	sql += "	[cs].[id] = " + curUserID + "\r\n";
	sql += "	AND (([cs].[is_arm_admin] = 1\r\n";
	sql += "			AND [cs].[role_id] = 'admin')\r\n";
	sql += "		OR CONVERT(varchar(max), [cs].[category_id]) LIKE '%' + '>resp_external_training<%'\r\n";
	sql += "		OR CONVERT(varchar(max), [cs].[category_id]) LIKE '%'  + '>hr_boss<%')\r\n";

	is_admin = ((ArrayOptFirstElem(XQuery("sql: " + sql), {is_admin: {Value: 0}}).is_admin.Value) != 0);

	access = false;
	options = {access: access};
	if (is_boss || is_lector || is_admin) {
		access = true;

		if (is_admin || is_lector ) {
			sql = "";
			sql += "SELECT \r\n";
			sql += "	CAST([cs].[id] AS varchar(max)) AS [id],\r\n";
			sql += "	[cs].[fullname] AS [coll_fullname],\r\n";
			sql += "	[cs].[position_name] AS [pos_name],\r\n";
			sql += "	[cs].[position_parent_name] AS [subdiv_name]\r\n";
			sql += "FROM\r\n";
			sql += "	[" + tenancy_name + "].[collaborators] AS [cs]\r\n";
			sql += "ORDER BY [coll_fullname]\r\n";
		}
		else {
			sql = "";
			sql += "SELECT \r\n";
			sql += "	CAST([coll].[id] AS varchar(max)) AS [id],\r\n";
			sql += "	[coll].[fullname] AS [coll_fullname],\r\n";
			sql += "	[pos].[name] AS [pos_name],\r\n";
			sql += "	ISNULL([subdiv].[name], '') AS [subdiv_name]\r\n";
			sql += "FROM\r\n";
			sql += "	[" + tenancy_name + "].[func_managers] AS [manag]\r\n";
			sql += "	INNER JOIN [" + tenancy_name + "].[boss_types] AS [boss_type] ON [boss_type].[id] = [manag].[boss_type_id] \r\n";
			sql += "	INNER JOIN [" + tenancy_name + "].[collaborators] AS [coll] ON [coll].[id] = [manag].[object_id]\r\n";
			sql += "	INNER JOIN [" + tenancy_name + "].[positions] AS [pos] ON [pos].[id] = [coll].[position_id]\r\n";
			sql += "	LEFT JOIN [" + tenancy_name + "].[subdivisions] AS [subdiv] ON [subdiv].[id] = [pos].[parent_object_id]\r\n";
			sql += "WHERE\r\n";
			sql += "	[manag].[person_id] = " + curUserID + "\r\n";
			sql += "	AND\r\n";
			sql += "		[manag].[catalog] = 'collaborator'\r\n";
			sql += "	AND\r\n";
			sql += "		[boss_type].[code] IN ('main', 'main_adm')\r\n";
			sql += "ORDER BY [coll_fullname]\r\n";
		}
		collab_list = XQuery("sql: " + sql);

		if (is_admin || is_boss) {
			sql = "";
			sql += "SELECT \r\n";
			sql += "	CAST([es].[id] AS varchar(max)) AS [id],\r\n";
			sql += "	[es].[name] AS [name],\r\n";
			sql += "	ISNULL(CASE WHEN CONVERT(DATE, [es].[start_date]) = '1900-01-01' THEN '' ELSE CONVERT(varchar(max), [es].[start_date], 126) END, '0') AS [start_date],\r\n";
			sql += "	ISNULL(CASE WHEN CONVERT(DATE, [es].[finish_date]) = '1900-01-01' THEN '' ELSE CONVERT(varchar(max), [es].[finish_date], 126) END, '0') AS [finish_date]\r\n";
			sql += "FROM\r\n";
			sql += "	[" + tenancy_name + "].[events] AS [es]\r\n";
			sql += "	LEFT JOIN [" + tenancy_name + "].[education_orgs] AS [eds] ON [es].[education_org_id]=[eds].[id]\r\n";
			sql += "WHERE\r\n";
			sql += " 	[eds].[code] IS NULL\r\n";
			sql += " 	OR [eds].[code] != 'ku'\r\n";
			sql += "ORDER BY [name]\r\n";
		}
		else {
			sql = "";
			sql += "SELECT \r\n";
			sql += "	CAST([es].[id] AS varchar(max)) AS [id],\r\n";
			sql += "	[es].[name] AS [name],\r\n";
			sql += "	ISNULL(CASE WHEN CONVERT(DATE, [es].[start_date]) = '1900-01-01' THEN '' ELSE CONVERT(varchar(max), [es].[start_date], 126) END, '0') AS [start_date],\r\n";
			sql += "	ISNULL(CASE WHEN CONVERT(DATE, [es].[finish_date]) = '1900-01-01' THEN '' ELSE CONVERT(varchar(max), [es].[finish_date], 126) END, '0') AS [finish_date]\r\n";
			sql += "FROM\r\n";
			sql += "	[" + tenancy_name + "].[events] AS [es]\r\n";
			sql += "	INNER JOIN [" + tenancy_name + "].[event_lectors] AS [els] ON [es].[id]=[els].[event_id]\r\n";
			sql += "	LEFT JOIN [" + tenancy_name + "].[education_orgs] AS [eds] ON [es].[education_org_id]=[eds].[id]\r\n";
			sql += "WHERE\r\n";
			sql += " 	([es].[education_org_id] IS NULL\r\n";
			sql += " 	OR [eds].[code] != 'ku')\r\n";
			sql += " 	AND [els].[person_id] = " + curUserID + "\r\n";
			sql += "ORDER BY [name]\r\n";
		}
		event_list = XQuery("sql: " + sql);

		sql = "";
		sql += "SELECT \r\n";
		sql += "	CAST([eds].[id] AS varchar(max)) AS [id],\r\n";
		sql += "	[eds].[name] AS [name]\r\n";
		sql += "FROM\r\n";
		sql += "	[" + tenancy_name + "].[education_orgs] AS [eds]\r\n";
		sql += "WHERE\r\n";
		sql += " 	[eds].[code] IS NULL\r\n"
		sql += " 	OR [eds].[code] != 'ku'\r\n";
		sql += "ORDER BY [name]\r\n";

		edu_org_list = XQuery("sql: " + sql);

		educat_event_list = ArraySelectAll(lists.event_forms);

		var excel_link = "/custom_web_template.html?object_id=" + ArrayOptFirstElem(XQuery("for $elem in custom_web_templates where $elem/code='hlebprom_edu_external_learning_report_excel" + "' return $elem"), {id: {Value: 0}}).id.Value;
		options = {
			access: access,
			collab_list: collab_list,
			event_list: event_list,
			edu_org_list: edu_org_list,
			is_boss: is_boss,
			is_lector: is_lector,
			is_admin: is_admin,
			educat_event_list: educat_event_list,
			excel_link: excel_link,
			data_picker_img_blue: getResourceLink("calendar1.png"),
			data_picker_img_white: getResourceLink("calendar1.png")
		}
	}
}
catch(ex)
{
	Response.Write("Ошибка в файле сервера - " + ex);
}
%>
<script>
(function (options) {
	'use strict';

	if (options.access) {
		var SHIFT_TIME = 2592000000;

		// Полифиллы для IE
		if (!Array.prototype.find) {
		  Array.prototype.find = function(predicate) {
		    if (this == null) {
		      throw new TypeError('Array.prototype.find called on null or undefined');
		    }
		    if (typeof predicate !== 'function') {
		      throw new TypeError('predicate must be a function');
		    }
		    var list = Object(this);
		    var length = list.length >>> 0;
		    var thisArg = arguments[1];
		    var value;

		    for (var i = 0; i < length; i++) {
		      value = list[i];
		      if (predicate.call(thisArg, value, i, list)) {
		        return value;
		      }
		    }
		    return undefined;
		  };
		}

		// Доработка интерфейсного скрипта
		$(document).on("click", ".h-chips__item", function() {
			var self = $(this);
			var active_siblings = self.siblings(".active");
			if (self.hasClass("h-chips__item_all")) {
				if (active_siblings.length > 0) {
					self.toggleClass("active");
					active_siblings.toggleClass("active");
				}
			}
			else {
				var all_chip = self.siblings(".h-chips__item_all");
				if (all_chip.hasClass("active")) {
					self.addClass("active");
					all_chip.removeClass("active");
				}
				else if (self.hasClass("active")) {
					self.removeClass("active");
					(active_siblings.length == 0) ? all_chip.addClass("active"): false;
				}
				else {
					if ( (self.siblings().length - active_siblings.length) == 1) {
						active_siblings.removeClass("active");
						all_chip.addClass("active");
					}
					else {
						self.addClass("active");
					}
				}
			}
		});

		$(document).on("click", ".js-open-modal", function (event) {
			var curDiv = $(this).attr('data-href');
			var curDivM = $(curDiv).find('.h-modal');

			$('body').css("overflow-y", "hidden");

			$(curDiv).fadeIn(200, function () {
				curDivM.animate({opacity: 1, top: '20px'}, 300);
			});

			//$(".sticky").hide();
		});

		// Прелоадер
		var preloader = (function () {
			var i = 0;
			var _preloader;
			return {
				start: function () {
					if (!!_preloader) {
						i++;
					}
					else {
						_preloader = jquery_preloader($("body"), 2);
						_preloader.load();
					}
				},
				stop: function () {
					if (i == 0) {
						if (_preloader != undefined) {
							_preloader.aload();
							_preloader = undefined;
						}
					}
					else {
						i--;
					}
				}
			};
		})();

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

		// Преобразует строку в дату
		function getDateFromString(str) {
			var dateArray = str.split('.');
			return new Date(dateArray[2], +dateArray[1] - 1, dateArray[0]);
		}

		// Получение временного периода
		function getTimes() {
			var startd = $("input[name=start_date]:not(.h-date-input)").val();
			var finishd = $("input[name=finish_date]:not(.h-date-input)").val();
			var startt = $("input[name=start_date].h-date-input").val();
			var finisht = $("input[name=finish_date].h-date-input").val();
			var timeNow = new Date();

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
			else {
				if (startd == "")
					startd = (new Date(timeNow.valueOf() - SHIFT_TIME)).toJSON();
				finishd = "";
			}

			return [startd, finishd];
		}

		// Модальные окна
		// Общий класс
		function Modal(config) {
			this.title = config.title;
			this.multiple = config.multiple;
			this.modal_id = config.modal_id;
			this.domElement = this.createDomElement(config.container);
			this.buffer = [];
			this.data = [];
			this.cur_data = this.data;
			this.list = $("#coll_list", this.domElement);
			this.table_header = $(".h-modal__table-head", this.domElement);
			this.no_results = $(".no_results", this.domElement);
			this.btn_inner = $(".h-btn__inner", this.domElement);
			this.cancel_btn = $("#cancel_btn", this.domElement);
			this.choose_btn = $("#choose_btn", this.domElement);
			this.choose_all_btn = $("#choose_all", this.domElement);
			this.remove_all_btn = $("#remove_all", this.domElement);
			this.$persons_table = $("#persons", this.domElement);
			this.$pagination = $(".pagination", this.domElement);
			this.$pagination_btns = $(".pagination-btns", this.domElement);
			this.$pagination_list = $(".pagination-list", this.domElement);
			this.$pagination_right = $(".pagination-right", this.domElement);
			this.$pagination_left = $(".pagination-left", this.domElement);
			this.text_input = $("#search_field", this.domElement);
			this.clear_text_input = $("#clear_text_input", this.domElement);
			this.done_typing_interval = 800;
			this.typing_timer = 0;
			this.number_of_pages = 15;
			this.page_size = 10;
			this.page_limit = 10;
			this.cur_page = 1;
		}

		Modal.prototype.createDomElement = function (container) {
			var html = '';
			html += '<div id="' + this.modal_id + '" class="overlay">';
			html += '	<div class="h-modal h-modal_bot">';
			html += '		<i class="js-close-modal h-modal__close"></i>';
			html += '		<div class="h-modal__content">';
			html += '			<div class="h-modal__h2">' + this.title + '</div>';
			html += '			<div class="h-modal__input-wrap h-modal__input-wrap_mrgn">';
			html += '				<div class="h-modal__input-wrap h-modal__input-wrap_pos">';
			html += '					<input type="text" id="search_field" class="h-input h-input_sm h-input_zoom" placeholder="Имя сотрудника" />';
			html += '					<i class="h-icon__zoom h-icon__zoom_pos"></i>';
			html += '				</div>';
			html += '				<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '					<a id="clear_text_input" class="h-modal__link" href="javascript:void(0);">Очистить поиск</a>';
			html += '				</div>';
			html += '			</div>';
			if (this.multiple) {
				html += '			<div id="top_buttons" class="h-modal__btn-wrap h-modal__btn-wrap_row">';
				html += '				<a id = "choose_all" class="h-btn-red" href="javascript:void(0);">Выбрать все</a>';
				html += '				<a id = "remove_all" class="h-btn-red h-btn-red_mrgn" href="javascript:void(0);">Очистить все</a>';
				html += '			</div>';
			}
			html += '			<div class="h-modal__table-wrap no_results" style="display: none; font-weight: bolder;">Результаты поиска отсутствуют</div>';
			html += '			<div class="h-modal__table-wrap h-modal__table-wrap_pos colb">';
			html += '				<div class="h-modal__table-head">';
			html += '					<div class="h-modal__col h-modal__col_triple h-modal__col_sl"><b>Сотрудник</b></div>';
			html += '					<div class="h-modal__col h-modal__col_triple"><b>Должность</b></div>';
			html += '					<div class="h-modal__col h-modal__col_triple"><b>Подразделение</b></div>';
			html += '				</div>';
			html += '				<div class="h-modal__table-body">';
			html += '					<div id="coll_list">';
			html += '					</div>';
			html += '					<div class="pagination" style="display: none;">';
			html += '						<div class="pagination-btns" style="display: none;">';
			html += '							<a href="javascript:;" class="pagination-left" style="display: none;"><div>Предыдущая</div></a>';
			html += '							<a href="javascript:;" class="pagination-right"><div>Следующая</div></a>';
			html += '						</div>';
			html += '						<ul class="pagination-list" style="display: none;">';
			html += '							<li><a href="javascript:;" class="active">1</a></li>';
			html += '						</ul>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="h-modal__bottom">';
			html += '			<a id="choose_btn" class="h-btn" href="javascript:void(0);">';
			html += '				<span>Выбрать</span>';
			html += '				<span ' + (this.multiple ? '' : 'style="display: none;"') + ' class="h-btn__inner">0</span>';
			html += '			</a>';
			html += '			<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '				<a id="cancel_btn" class="h-modal__link " href="javascript:void(0);">Отменить</a>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';

			var elem = $(html);
			$(container).append(elem);

			return elem;
		}

		Modal.prototype.getDomElement = function() {
			return this.domElement;
		}

		Modal.prototype.setData = function(new_data) {
			this.data = new_data;
			this.cur_data = this.data;
		}

		Modal.prototype.done_typing = function () { // поиск
			var search_field = this.domElement.find("#search_field");
			if (search_field.val().trim() != "")
			{
				var pattern = search_field.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				var filtered_arr = this.data.filter(function(item) {
					return item.coll_fullname.toLowerCase().search(new RegExp(pattern.trim().toLowerCase())) == 0;
				});
				this.cur_data = filtered_arr;
			}
			else
			{
				this.cur_data = this.data;
			}

			this.set_page(1);
			this.render();
		}

		Modal.prototype.clear_search_results = function() {
			this.text_input.val("");
			this.cur_data = this.data;
			this.render();
		}

		Modal.prototype.render_list = function(page_number) {
			this.list.empty();
			var list = this.cur_data.slice((page_number - 1)*this.page_size, (page_number - 1)*this.page_size + (this.page_size));
			if (list.length == 0) {
				this.table_header.hide();
				this.no_results.show();
			}
			else {
				this.table_header.show();
				this.no_results.hide();
			}

			var search_field = this.domElement.find("#search_field");
			var match_len = search_field.val().trim().length;
			for (var i = 0; i < list.length; i++)
			{
				var elem = list[i];
				var html = '<div class="h-modal__table-row">';
				html += '	<div class="h-modal__col h-modal__col_triple">';
				html += '		<div class="h-checkbox__item">';

				if (this.multiple) {
					html += '			<input id="' + elem.id + '" class="h-checkbox" type="checkbox">';
					html += '			<label for="' + elem.id + '" class="h-checkbox__label h-checkbox__label_red"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.coll_fullname.substr(0, match_len) + '</mark>' + elem.coll_fullname.substr(match_len, elem.coll_fullname.length) : elem.coll_fullname ) + '</span></label>';
				}
				else {
					html += '			<input id="' + elem.coll_id + '" region-id="' + elem.region_id + '" class="h-radio coll_option" type="radio" name="radio">';
					html += '			<label for="' + elem.coll_id + '" class="h-radio-label"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.coll_fullname.substr(0, match_len) + '</mark>' + elem.coll_fullname.substr(match_len, elem.coll_fullname.length) : elem.coll_fullname ) + '</span></label>';
				}

				html += '		</div>';
				html += '	</div>';
				html += '	<div class="h-modal__col h-modal__col_triple">';
				html += '		<span class="h-modal__col-sp">' + elem.pos_name + '</span>';
				html += '	</div>';
				html += '	<div class="h-modal__col h-modal__col_triple">';
				html += '		<span class="h-modal__col-sp">' + elem.subdiv_name + '</span>';
				html += '	</div>';
				html += '</div>';
				this.list.append(html);
				if (this.buffer.indexOf(elem.id) != -1) {
					$("input[id=" + elem.id + "]").prop("checked", true);
				}
			}
		}

		Modal.prototype.render = function () {
			this.number_of_pages = Math.ceil(this.cur_data.length / this.page_size);
			if (this.number_of_pages > 1)
			{
				this.$pagination.show();
				this.$pagination_btns.show();
				this.$pagination_list.show();
				this.$pagination_right.show();
			}
			else
			{
				this.$pagination.hide();
				this.$pagination_btns.hide();
				this.$pagination_list.hide();
				this.$pagination_right.hide();
			}
			this.render_list(this.cur_page);
			this.render_pages();

			var modalBody = this.domElement.find("#coll_list");
			var modalHead = this.domElement.find(".h-modal__table-head");
			var scrollSize = modalHead.width() - modalBody.width();
			if (scrollSize > 0)
				modalHead.css("padding-right", scrollSize);
		}

		Modal.prototype.render_pages = function() {
			var pages_div = this.$pagination_list.empty();
			var i;
			if (this.number_of_pages <= this.page_limit) {
				for (i = 1; i <= this.number_of_pages; ++i)
				{
					pages_div.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>')
				}
			}
			else {
				if (this.cur_page < 7) {
					for (i = 1; i <= 7; ++i) {
						pages_div.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>');
					}
					pages_div.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
					pages_div.append('<li><a href="javascript:;" id="page_' + this.number_of_pages + '">' + this.number_of_pages + '</a></li>');
				}
				else {
					if (this.number_of_pages - 3 > this.cur_page) {
						pages_div.append('<li><a href="javascript:;" id="page_' + 1 + '">' + 1 + '</a></li>');
						pages_div.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
						var start = this.cur_page - 2;
						var stop = this.cur_page + 2;
						for (i = start; i <= stop; ++i) {
							pages_div.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>');
						}
						pages_div.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
						pages_div.append('<li><a href="javascript:;" id="page_' + this.number_of_pages + '">' + this.number_of_pages + '</a></li>');
					}
					else {
						pages_div.append('<li><a href="javascript:;" id="page_' + 1 + '">' + 1 + '</a></li>');
						pages_div.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
						for (i = this.number_of_pages - 6; i <= this.number_of_pages; ++i) {
							pages_div.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>');
						}
					}
				}
			}
			this.$pagination_list.find("#page_" + this.cur_page).addClass("active");
		}

		Modal.prototype.set_page = function(page) {
			if (page != this.cur_page && page <= this.number_of_pages)
			{
				this.cur_page = page;
				this.render();
			}
			if (this.cur_page > 1)
			{
				this.$pagination_left.show();
				if (this.cur_page >= this.number_of_pages)
				{
					this.$pagination_right.hide();
				}
			}
			else
			{
				this.$pagination_left.hide();
			}
		}

		Modal.prototype.set_next_page = function() {
			this.set_page(this.cur_page + 1);
		}

		Modal.prototype.set_prev_page = function() {
			this.set_page(this.cur_page - 1);
		}

		Modal.prototype.close_modal = function() {
			this.domElement.find(".js-close-modal").trigger("click");
		}

		Modal.prototype.set_events = function() {
			var __self = this;
			this.domElement.find(".h-modal__table-body").on("click", ".h-checkbox", function() {
				var $this = $(this);
				var index = __self.buffer.indexOf($this.attr("id"));
				if ($this.prop("checked")) {
					(index == -1) ? __self.buffer.push($this.attr("id")) : false;
				}
				else {
					__self.buffer.splice(index, 1);
				}
				__self.btn_inner.html(__self.buffer.length);
			});

			this.domElement.find(".js-close-modal").on("click", function() {
				__self.buffer = __self.buffer.slice(0, __self.buffer.length);
				__self.btn_inner.html(__self.buffer.length);
				__self.set_page(1);

				$(".sticky").show();
			});

			this.domElement.find("[data-href=#" + this.modal_id + "]").on("click", function() {
				__self.buffer = __self.buffer.slice(0, __self.buffer.length);
				__self.btn_inner.html(__self.buffer.length);
				__self.clear_search_results();
			});

			this.domElement.find("#remove_all_colls").on("click", function() {
				__self.buffer = [];
				__self.render();
			});

			this.domElement.find(".pagination-list").
							delegate("a:not(.active)", "click", function(e) {
				__self.domElement.find("#" + this.modal_id + " .pagination-list a:.active").removeClass("active");
				$(this).addClass("active");
				__self.set_page(Number($(this)[0].innerHTML));

				e.preventDefault();
				e.stopImmediatePropagation();
			});

			this.domElement.find(".pagination-left").on("click", function(e) {
				__self.set_prev_page(e);
			});

			this.domElement.find(".pagination-right").on("click", function(e) {
				__self.set_next_page(e);
			});

			this.cancel_btn.on("click", function() {
				__self.close_modal();
			});

			this.choose_all_btn.on("click", function() {
				__self.buffer = __self.data.map(function (elem){ return elem.id});
				__self.btn_inner.html(__self.buffer.length);
				__self.render_list(__self.cur_page);
			});

			this.remove_all_btn.on("click", function(){
				__self.buffer = [];
				__self.btn_inner.html(__self.buffer.length);
				__self.render_list(__self.cur_page);
			});

			this.text_input.on("keyup paste cut", function() {
				clearTimeout(__self.typing_timer);
				__self.typing_timer = setTimeout(__self.done_typing(), __self.done_typing_interval);
			});

			this.text_input.on("keydown", function() {
				clearTimeout(__self.typing_timer);
			});

			this.clear_text_input.on("click", function() {
				__self.clear_search_results();
			});
		}
		// Сотрудник
		function CollabModal(config) {
			Modal.apply(this, arguments);
		}

		CollabModal.prototype = Object.create(Modal.prototype);
		CollabModal.prototype.constructor = CollabModal;

		// Мероприятие
		function EventsModal(config) {
			Modal.apply(this, arguments);
		}

		EventsModal.prototype = Object.create(Modal.prototype);
		EventsModal.prototype.constructor = EventsModal;

		EventsModal.prototype.createDomElement = function (container) {
			var html = '';
			html += '<div id="' + this.modal_id + '" class="overlay">';
			html += '	<div class="h-modal h-modal_bot">';
			html += '		<i class="js-close-modal h-modal__close"></i>';
			html += '		<div class="h-modal__content">';
			html += '			<div class="h-modal__h2">' + this.title + '</div>';
			html += '			<div class="h-modal__input-wrap h-modal__input-wrap_mrgn">';
			html += '				<div class="h-modal__input-wrap h-modal__input-wrap_pos">';
			html += '					<input type="text" id="search_field" class="h-input h-input_sm h-input_zoom" placeholder="Название мероприятия" />';
			html += '					<i class="h-icon__zoom h-icon__zoom_pos"></i>';
			html += '				</div>';
			html += '				<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '					<a id="clear_text_input" class="h-modal__link" href="javascript:void(0);">Очистить поиск</a>';
			html += '				</div>';
			html += '			</div>';
			if (this.multiple) {
				html += '			<div id="top_buttons" class="h-modal__btn-wrap h-modal__btn-wrap_row">';
				html += '				<a id = "choose_all" class="h-btn-red" href="javascript:void(0);">Выбрать все</a>';
				html += '				<a id = "remove_all" class="h-btn-red h-btn-red_mrgn" href="javascript:void(0);">Очистить все</a>';
				html += '			</div>';
			}
			html += '			<div class="h-modal__table-wrap no_results" style="display: none; font-weight: bolder;">Результаты поиска отсутствуют</div>';
			html += '			<div class="h-modal__table-wrap h-modal__table-wrap_pos colb">';
			html += '				<div class="h-modal__table-head">';
			html += '					<div class="h-modal__col h-modal__col_triple h-modal__col_sl"><b>Название мероприятия</b></div>';
			html += '					<div class="h-modal__col h-modal__col_triple"><b>Дата и время начала</b></div>';
			html += '					<div class="h-modal__col h-modal__col_triple"><b>Дата и время окончания</b></div>';
			html += '				</div>';
			html += '				<div class="h-modal__table-body">';
			html += '					<div id="coll_list">';
			html += '					</div>';
			html += '					<div class="pagination" style="display: none;">';
			html += '						<div class="pagination-btns" style="display: none;">';
			html += '							<a href="javascript:;" class="pagination-left" style="display: none;"><div>Предыдущая</div></a>';
			html += '							<a href="javascript:;" class="pagination-right"><div>Следующая</div></a>';
			html += '						</div>';
			html += '						<ul class="pagination-list" style="display: none;">';
			html += '							<li><a href="javascript:;" class="active">1</a></li>';
			html += '						</ul>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="h-modal__bottom">';
			html += '			<a id="choose_btn" class="h-btn" href="javascript:void(0);">';
			html += '				<span>Выбрать</span>';
			html += '				<span ' + (this.multiple ? '' : 'style="display: none;"') + ' class="h-btn__inner">0</span>';
			html += '			</a>';
			html += '			<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '				<a id="cancel_btn" class="h-modal__link " href="javascript:void(0);">Отменить</a>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';

			var elem = $(html);
			$(container).append(elem);

			return elem;
		}

		EventsModal.prototype.done_typing = function () { // поиск
			var search_field = this.domElement.find("#search_field");
			if (search_field.val().trim() != "")
			{
				var pattern = search_field.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				var filtered_arr = this.data.filter(function(item) {
					return item.name.toLowerCase().search(new RegExp(pattern.trim().toLowerCase())) == 0;
				});
				this.cur_data = filtered_arr;
			}
			else
			{
				this.cur_data = this.data;
			}

			this.set_page(1);
			this.render();
		}

		EventsModal.prototype.render_list = function(page_number) {
			this.list.empty();
			var list = this.cur_data.slice((page_number - 1)*this.page_size, (page_number - 1)*this.page_size + (this.page_size));
			if (list.length == 0) {
				this.table_header.hide();
				this.no_results.show();
			}
			else {
				this.table_header.show();
				this.no_results.hide();
			}

			var match_len = this.domElement.find("#search_field").val().trim().length;
			for (var i = 0; i < list.length; i++)
			{
				var elem = list[i];
				var html = '<div class="h-modal__table-row">';
				html += '	<div class="h-modal__col h-modal__col_triple">';
				html += '		<div class="h-checkbox__item">';

				if (this.multiple) {
					html += '			<input id="' + elem.id + '" class="h-checkbox" type="checkbox">';
					html += '			<label for="' + elem.id + '" class="h-checkbox__label h-checkbox__label_red"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.name.substr(0, match_len) + '</mark>' + elem.name.substr(match_len, elem.name.length) : elem.name ) + '</span></label>';
				}
				else {
					html += '			<input id="' + elem.coll_id + '" region-id="' + elem.region_id + '" class="h-radio coll_option" type="radio" name="radio">';
					html += '			<label for="' + elem.coll_id + '" class="h-radio-label"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.coll_fullname.substr(0, match_len) + '</mark>' + elem.coll_fullname.substr(match_len, elem.coll_fullname.length) : elem.coll_fullname ) + '</span></label>';
				}

				html += '		</div>';
				html += '	</div>';
				html += '	<div class="h-modal__col h-modal__col_triple">';
				html += '		<span class="h-modal__col-sp">' + this.convert_date_to_104_format_with_time(new Date(elem.start_date)) + '</span>';
				html += '	</div>';
				html += '	<div class="h-modal__col h-modal__col_triple">';
				html += '		<span class="h-modal__col-sp">' + this.convert_date_to_104_format_with_time(new Date(elem.finish_date)) + '</span>';
				html += '	</div>';
				html += '</div>';
				this.list.append(html);
				if (this.buffer.indexOf(elem.id) != -1) {
					$("input[id=" + elem.id + "]").prop("checked", true);
				}
			}
		}

		EventsModal.prototype.convert_date_to_104_format_with_time = function (input_date) {
			var dd = ((input_date.getDate() < 10 ) ? "0" + (input_date.getDate()) : input_date.getDate())+ ".";
			var mm = ((input_date.getMonth() + 1 < 10 ) ? "0" + (input_date.getMonth() + 1) : input_date.getMonth() + 1)+ ".";
			var yyyy = input_date.getFullYear() + " ";
			var date = new Date(input_date);
			var time = date.toTimeString().split(' ')[0].substr(0, 5);
			return time + " " + dd + mm + yyyy;
			
		}

		// Учебные организации
		function EduOrgsModal(config) {
			Modal.apply(this, arguments);
		}

		EduOrgsModal.prototype = Object.create(Modal.prototype);
		EduOrgsModal.prototype.constructor = EduOrgsModal;

		EduOrgsModal.prototype.createDomElement = function (container) {
			var html = '';
			html += '<div id="' + this.modal_id + '" class="overlay">';
			html += '	<div class="h-modal h-modal_bot">';
			html += '		<i class="js-close-modal h-modal__close"></i>';
			html += '		<div class="h-modal__content">';
			html += '			<div class="h-modal__h2">' + this.title + '</div>';
			html += '			<div class="h-modal__input-wrap h-modal__input-wrap_mrgn">';
			html += '				<div class="h-modal__input-wrap h-modal__input-wrap_pos">';
			html += '					<input type="text" id="search_field" class="h-input h-input_sm h-input_zoom" placeholder="Название мероприятия" />';
			html += '					<i class="h-icon__zoom h-icon__zoom_pos"></i>';
			html += '				</div>';
			html += '				<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '					<a id="clear_text_input" class="h-modal__link" href="javascript:void(0);">Очистить поиск</a>';
			html += '				</div>';
			html += '			</div>';
			if (this.multiple) {
				html += '			<div id="top_buttons" class="h-modal__btn-wrap h-modal__btn-wrap_row">';
				html += '				<a id = "choose_all" class="h-btn-red" href="javascript:void(0);">Выбрать все</a>';
				html += '				<a id = "remove_all" class="h-btn-red h-btn-red_mrgn" href="javascript:void(0);">Очистить все</a>';
				html += '			</div>';
			}
			html += '			<div class="h-modal__table-wrap no_results" style="display: none; font-weight: bolder;">Результаты поиска отсутствуют</div>';
			html += '			<div class="h-modal__table-wrap h-modal__table-wrap_pos colb">';
			html += '				<div class="h-modal__table-head">';
			html += '					<div class="h-modal__col h-modal__col_sl"><b>Название учебной организации</b></div>';
			html += '				</div>';
			html += '				<div class="h-modal__table-body">';
			html += '					<div id="coll_list">';
			html += '					</div>';
			html += '					<div class="pagination" style="display: none;">';
			html += '						<div class="pagination-btns" style="display: none;">';
			html += '							<a href="javascript:;" class="pagination-left" style="display: none;"><div>Предыдущая</div></a>';
			html += '							<a href="javascript:;" class="pagination-right"><div>Следующая</div></a>';
			html += '						</div>';
			html += '						<ul class="pagination-list" style="display: none;">';
			html += '							<li><a href="javascript:;" class="active">1</a></li>';
			html += '						</ul>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="h-modal__bottom">';
			html += '			<a id="choose_btn" class="h-btn" href="javascript:void(0);">';
			html += '				<span>Выбрать</span>';
			html += '				<span ' + (this.multiple ? '' : 'style="display: none;"') + ' class="h-btn__inner">0</span>';
			html += '			</a>';
			html += '			<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '				<a id="cancel_btn" class="h-modal__link " href="javascript:void(0);">Отменить</a>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';

			var elem = $(html);
			$(container).append(elem);

			return elem;
		}

		EduOrgsModal.prototype.done_typing = function () { // поиск
			var search_field = this.domElement.find("#search_field");
			if (search_field.val().trim() != "")
			{
				var pattern = search_field.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				var filtered_arr = this.data.filter(function(item) {
					return item.name.toLowerCase().search(new RegExp(pattern.trim().toLowerCase())) == 0;
				});
				this.cur_data = filtered_arr;
			}
			else
			{
				this.cur_data = this.data;
			}

			this.set_page(1);
			this.render();
		}

		EduOrgsModal.prototype.render_list = function(page_number) {
			this.list.empty();
			var list = this.cur_data.slice((page_number - 1)*this.page_size, (page_number - 1)*this.page_size + (this.page_size));
			if (list.length == 0) {
				this.table_header.hide();
				this.no_results.show();
			}
			else {
				this.table_header.show();
				this.no_results.hide();
			}

			var match_len = this.domElement.find("#search_field").val().trim().length;
			for (var i = 0; i < list.length; i++)
			{
				var elem = list[i];
				var html = '<div class="h-modal__table-row">';
				html += '	<div class="h-modal__col h-modal__col_single">';
				html += '		<div class="h-checkbox__item">';

				if (this.multiple) {
					html += '			<input id="' + elem.id + '" class="h-checkbox" type="checkbox">';
					html += '			<label for="' + elem.id + '" class="h-checkbox__label h-checkbox__label_red"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.name.substr(0, match_len) + '</mark>' + elem.name.substr(match_len, elem.name.length) : elem.name ) + '</span></label>';
				}
				else {
					html += '			<input id="' + elem.coll_id + '" region-id="' + elem.region_id + '" class="h-radio coll_option" type="radio" name="radio">';
					html += '			<label for="' + elem.coll_id + '" class="h-radio-label"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.coll_fullname.substr(0, match_len) + '</mark>' + elem.coll_fullname.substr(match_len, elem.coll_fullname.length) : elem.coll_fullname ) + '</span></label>';
				}

				html += '		</div>';
				html += '	</div>';
				html += '</div>';
				this.list.append(html);
				if (this.buffer.indexOf(elem.id) != -1) {
					$("input[id=" + elem.id + "]").prop("checked", true);
				}
			}
		}

		// Формы проведения
		function EducatEventsModal(config) {
			Modal.apply(this, arguments);
		}

		EducatEventsModal.prototype = Object.create(Modal.prototype);
		EducatEventsModal.prototype.constructor = EducatEventsModal;

		EducatEventsModal.prototype.createDomElement = function (container) {
			var html = '';
			html += '<div id="' + this.modal_id + '" class="overlay">';
			html += '	<div class="h-modal h-modal_bot">';
			html += '		<i class="js-close-modal h-modal__close"></i>';
			html += '		<div class="h-modal__content">';
			html += '			<div class="h-modal__h2">' + this.title + '</div>';
			html += '			<div class="h-modal__input-wrap h-modal__input-wrap_mrgn">';
			html += '				<div class="h-modal__input-wrap h-modal__input-wrap_pos">';
			html += '					<input type="text" id="search_field" class="h-input h-input_sm h-input_zoom" placeholder="Название мероприятия" />';
			html += '					<i class="h-icon__zoom h-icon__zoom_pos"></i>';
			html += '				</div>';
			html += '				<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '					<a id="clear_text_input" class="h-modal__link" href="javascript:void(0);">Очистить поиск</a>';
			html += '				</div>';
			html += '			</div>';
			if (this.multiple) {
				html += '			<div id="top_buttons" class="h-modal__btn-wrap h-modal__btn-wrap_row">';
				html += '				<a id = "choose_all" class="h-btn-red" href="javascript:void(0);">Выбрать все</a>';
				html += '				<a id = "remove_all" class="h-btn-red h-btn-red_mrgn" href="javascript:void(0);">Очистить все</a>';
				html += '			</div>';
			}
			html += '			<div class="h-modal__table-wrap no_results" style="display: none; font-weight: bolder;">Результаты поиска отсутствуют</div>';
			html += '			<div class="h-modal__table-wrap h-modal__table-wrap_pos colb">';
			html += '				<div class="h-modal__table-head">';
			html += '					<div class="h-modal__col h-modal__col_sl"><b>Именование формы проведения</b></div>';
			html += '				</div>';
			html += '				<div class="h-modal__table-body">';
			html += '					<div id="coll_list">';
			html += '					</div>';
			html += '					<div class="pagination" style="display: none;">';
			html += '						<div class="pagination-btns" style="display: none;">';
			html += '							<a href="javascript:;" class="pagination-left" style="display: none;"><div>Предыдущая</div></a>';
			html += '							<a href="javascript:;" class="pagination-right"><div>Следующая</div></a>';
			html += '						</div>';
			html += '						<ul class="pagination-list" style="display: none;">';
			html += '							<li><a href="javascript:;" class="active">1</a></li>';
			html += '						</ul>';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="h-modal__bottom">';
			html += '			<a id="choose_btn" class="h-btn" href="javascript:void(0);">';
			html += '				<span>Выбрать</span>';
			html += '				<span ' + (this.multiple ? '' : 'style="display: none;"') + ' class="h-btn__inner">0</span>';
			html += '			</a>';
			html += '			<div class="h-modal__btn-wrap h-modal__btn-wrap_pos">';
			html += '				<a id="cancel_btn" class="h-modal__link " href="javascript:void(0);">Отменить</a>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';

			var elem = $(html);
			$(container).append(elem);

			return elem;
		}

		EducatEventsModal.prototype.done_typing = function () { // поиск
			var search_field = this.domElement.find("#search_field");
			if (search_field.val().trim() != "")
			{
				var pattern = search_field.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				var filtered_arr = this.data.filter(function(item) {
					return item.name.toLowerCase().search(new RegExp(pattern.trim().toLowerCase())) == 0;
				});
				this.cur_data = filtered_arr;
			}
			else
			{
				this.cur_data = this.data;
			}

			this.set_page(1);
			this.render();
		}

		EducatEventsModal.prototype.render_list = function(page_number) {
			this.list.empty();
			var list = this.cur_data.slice((page_number - 1)*this.page_size, (page_number - 1)*this.page_size + (this.page_size));
			if (list.length == 0) {
				this.table_header.hide();
				this.no_results.show();
			}
			else {
				this.table_header.show();
				this.no_results.hide();
			}

			var match_len = this.domElement.find("#search_field").val().trim().length;
			for (var i = 0; i < list.length; i++)
			{
				var elem = list[i];
				var html = '<div class="h-modal__table-row">';
				html += '	<div class="h-modal__col h-modal__col_single">';
				html += '		<div class="h-checkbox__item">';

				if (this.multiple) {
					html += '			<input id="' + elem.id + '" class="h-checkbox" type="checkbox">';
					html += '			<label for="' + elem.id + '" class="h-checkbox__label h-checkbox__label_red"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.name.substr(0, match_len) + '</mark>' + elem.name.substr(match_len, elem.name.length) : elem.name ) + '</span></label>';
				}
				else {
					html += '			<input id="' + elem.coll_id + '" region-id="' + elem.region_id + '" class="h-radio coll_option" type="radio" name="radio">';
					html += '			<label for="' + elem.coll_id + '" class="h-radio-label"><span class="h-modal__col-sp">' + (match_len > 0 ? '<mark>' + elem.coll_fullname.substr(0, match_len) + '</mark>' + elem.coll_fullname.substr(match_len, elem.coll_fullname.length) : elem.coll_fullname ) + '</span></label>';
				}

				html += '		</div>';
				html += '	</div>';
				html += '</div>';
				this.list.append(html);
				if (this.buffer.indexOf(elem.id) != -1) {
					$("input[id=" + elem.id + "]").prop("checked", true);
				}
			}
		}

		// Страница
		var app = {
			form: {
				filterHtml: {
					startDate: "",
					collab: "",
					eventType: "",
					eduOrg: "",
					educatEvent: ""
				},
				setInputMask: function () {
					$(".a-choice-request-input").inputmask({
						mask: "d.m.y",
						placeholder: "_",
						showMaskOnHover: false,
						showMaskOnFocus: false
					});
					$(".h-date-input").inputmask({
						mask: "h:s",
						placeholder: "_",
						showMaskOnHover: false,
						showMaskOnFocus: false
					});
				},
				remoteAction: function (actionObject) {
					try {
						if (app.form.remoteAction != undefined) {
							var returnObject = {};
							var soapRequestBody;
							var soapServerUrl = actionObject.url != undefined ? actionObject.url : '/remote_actions_wsdl.xml';
							var soapFormat = actionObject.format != undefined ? actionObject.format : 'json';

							soapRequestBody = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
							soapRequestBody += "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">";
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

							var processSuccess = function (data, status, req) {
								if (status === "success") {
									var returnObject = {
										error: data.getElementsByTagName('error')[0].firstChild,
										type: data.getElementsByTagName('type')[0].firstChild,
										messageText: data.getElementsByTagName('messageText')[0].firstChild,
										result: data.getElementsByTagName('result')[0].firstChild
									};
									try{
										returnObject.error = returnObject.error.nodeValue;
									}
									catch(_ex) {}
									try{
										returnObject.type = returnObject.type.nodeValue;
									}
									catch(_ex) {}
									try{
										returnObject.messageText = returnObject.messageText.nodeValue;
									}
									catch(_ex) {}
									try{
										returnObject.result = returnObject.result.nodeValue;
									}
									catch(_ex) {}

									if (actionObject.callback_f != undefined) {
										actionObject.callback_f(returnObject);
									}

									return returnObject;
								}
								else {
									throw status;
								}
							}

							var processError = function (data, status, req) {
								throw req.responseText;
							}

							$.ajax({
								type: "POST",
								url: soapServerUrl,
								contentType: "text/xml",
								dataType: "xml",
								data: soapRequestBody,
								success: processSuccess,
								error: processError
							});
						}
						else
						{
							throw '00'
						}
					}
					catch(_exeption) {
						returnObject = {error: 1, messageText: _exeption};
						if (typeof(actionObject.callback_f) != 'undefined') {
							actionObject.callback_f(returnObject);
						}
						return returnObject;
					}
				},
				formatNumber: function (number, decimals, dec_point, thousands_sep) {
					number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
					var n = !isFinite(+number) ? 0 : +number,
						prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
						sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
						dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
						s = '',
						toFixedFix = function (n, prec) {
							var k = Math.pow(10, prec);
							return '' + (Math.round(n * k) / k).toFixed(prec);
						};

					// Fix for IE parseFloat(0.55).toFixed(0) = 0;
					s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
					if (s[0].length > 3) {
						s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
					}

					if ((s[1] || '').length < prec) {
						s[1] = s[1] || '';
						s[1] += new Array(prec - s[1].length + 1).join('0');
					}
					return s.join(dec);
				},
				renderFilter: function() {
					var html = "";
					$(".h-filter__list").empty();

					html += app.form.filterHtml.startDate;
					html += app.form.filterHtml.collab;
					html += app.form.filterHtml.eventType;
					html += app.form.filterHtml.eduOrg;
					html += app.form.filterHtml.educatEvent;

					$(".h-filter__list").append(html);
				}
			},
			filter: {
				collabFilter: [],
				$collabList: null,
				eventFilter: [],
				$eventList: null,
				eduOrgFilter: [],
				$eduOrgList: null,
				educatEventFilter: [],
				$educatEventList: null,
				resultTables: [[],[],[],[]],
				render: function() {
					this.$collabList = $("#collab_list", $(".h-filter__list"));
					this.$eventList = $("#event_list", $(".h-filter__list"));
					this.$eduOrgList = $("#edu_org_list", $(".h-filter__list"));
					this.$educatEventList = $("#educat_event_list", $(".h-filter__list"));
					this.renderCollabBlock(this.collabFilter);
					this.renderEventBlock(this.eventFilter);
					this.renderEduOrgBlock(this.eduOrgFilter);
					this.renderEducatEventBlock(this.educatEventFilter);
				},
				renderCollabBlock: function(objects) {
					this.$collabList.empty();
					var html = '';
					while (this.resultTables[0].length)
						this.resultTables[0].pop();

					for (var i = 0; i < objects.length; i++) {
						var item = options.collab_list.find(function(element, index, array){return element.id ==  objects[i]});

						html += '<li data-id=' + item.id + ' class="h-choice__item h-choice__item_def">';
						html += '	<span class="h-choice__link">' + item.coll_fullname + '<i class="h-choice__item_close"></i></span>';
						html += '</li>';

						this.resultTables[0].push(item.id);
					}
					this.$collabList.append(html);
				},
				renderEventBlock: function(objects) {
					this.$eventList.empty();
					var html = '';
					while (this.resultTables[1].length)
						this.resultTables[1].pop();

					for (var i = 0; i < objects.length; i++) {
						var item = options.event_list.find(function(element, index, array){return element.id ==  objects[i]});

						html += '<li data-id=' + item.id + ' class="h-choice__item h-choice__item_def">';
						html += '	<span class="h-choice__link">' + item.name + '<i class="h-choice__item_close"></i></span>';
						html += '</li>';

						this.resultTables[1].push(item.id);
					}
					this.$eventList.append(html);
				},
				renderEduOrgBlock: function(objects) {
					this.$eduOrgList.empty();
					var html = '';
					while (this.resultTables[2].length)
						this.resultTables[2].pop();

					for (var i = 0; i < objects.length; i++) {
						var item = options.edu_org_list.find(function(element, index, array){return element.id ==  objects[i]});

						html += '<li data-id=' + item.id + ' class="h-choice__item h-choice__item_def">';
						html += '	<span class="h-choice__link">' + item.name + '<i class="h-choice__item_close"></i></span>';
						html += '</li>';

						this.resultTables[2].push(item.id);
					}

					this.$eduOrgList.append(html);
				},
				renderEducatEventBlock: function(objects) {
					this.$educatEventList.empty();
					var html = '';
					while (this.resultTables[3].length)
						this.resultTables[3].pop();

					for (var i = 0; i < objects.length; i++) {
						var item = options.educat_event_list.find(function(element, index, array){return element.id ==  objects[i]});

						html += '<li data-id=' + item.id + ' class="h-choice__item h-choice__item_def">';
						html += '	<span class="h-choice__link">' + item.name + '<i class="h-choice__item_close"></i></span>';
						html += '</li>';

						this.resultTables[3].push(item.id);
					}

					this.$educatEventList.append(html);
				},
				hasIntersection: function(a, b) {
					var hasIntersect = false;
					for (var i = 0; i < b.length; i++) {
						if (a.indexOf(b[i]) != -1) {
							hasIntersect = true;
							break;
						}
					}
					return hasIntersect;
				},
				setEvents: function() {
					$(document).on("DOMNodeInserted DOMNodeRemoved", app.filter.$collabList, function() {
						app.filter.$collabList.children().length > 0 ? app.filter.$collabList.css('margin-bottom', '10px') : app.filter.$collabList.css('margin-bottom', '0px');
					});
					$(document).on("click", "#collab_list .h-choice__item_close", function() {
						var $li = $(this).closest("li");
						var $ul = $li.closest("ul");
						var index = app.filter.collabFilter.indexOf($li.attr("data-id"));
						app.filter.collabFilter.splice(index, 1);
						app.filter.resultTables[0].splice(index, 1);
						$li.remove();
						$ul.trigger("DOMNodeRemoved");


						toggleControlButtons();
					});

					$(document).on("DOMNodeInserted DOMNodeRemoved", app.filter.$eventList, function() {
						app.filter.$eventList.children().length > 0 ? app.filter.$eventList.css('margin-bottom', '10px') : app.filter.$eventList.css('margin-bottom', '0px');
					});
					$(document).on("click", "#event_list .h-choice__item_close", function() {
						var $li = $(this).closest("li");
						var $ul = $li.closest("ul");
						var index = app.filter.eventFilter.indexOf($li.attr("data-id"));
						app.filter.eventFilter.splice(index, 1);
						app.filter.resultTables[1].splice(index, 1);
						$li.remove();
						$ul.trigger("DOMNodeRemoved");

						toggleControlButtons();
					});

					$(document).on("DOMNodeInserted DOMNodeRemoved", app.filter.$eduOrgList, function() {
						app.filter.$eduOrgList.children().length > 0 ? app.filter.$eduOrgList.css('margin-bottom', '10px') : app.filter.$eduOrgList.css('margin-bottom', '0px');
					});
					$(document).on("click", "#edu_org_list .h-choice__item_close", function() {
						var $li = $(this).closest("li");
						var $ul = $li.closest("ul");
						var index = app.filter.eduOrgFilter.indexOf($li.attr("data-id"));
						app.filter.eduOrgFilter.splice(index, 1);
						app.filter.resultTables[2].splice(index, 1);
						$li.remove();
						$ul.trigger("DOMNodeRemoved");

						toggleControlButtons();
					});

					$(document).on("DOMNodeInserted DOMNodeRemoved", app.filter.$educatEventList, function() {
						app.filter.$educatEventList.children().length > 0 ? app.filter.$educatEventList.css('margin-bottom', '10px') : app.filter.$educatEventList.css('margin-bottom', '0px');
					});
					$(document).on("click", "#educat_event_list .h-choice__item_close", function() {
						var $li = $(this).closest("li");
						var $ul = $li.closest("ul");
						var index = app.filter.educatEventFilter.indexOf($li.attr("data-id"));
						app.filter.educatEventFilter.splice(index, 1);
						app.filter.resultTables[3].splice(index, 1);
						$li.remove();
						$ul.trigger("DOMNodeRemoved");

						toggleControlButtons();
					});
				}
			},
			resultTable: {
				choosenProgramId: 0,
				data: [],
				filteredData: [],
				list: $("#result_table").find(".h-education__table > tbody"),
				pageSize: 10,
				curPage: 1,
				numberOfPages: 15,
				$table: $("#result_table").find(".h-education__table"),
				$allProgram: $(".h-all-programm"),
				$counter: $(".h-all-programm_calc"),
				$emptyMessage: $("#empty_message"),
				$pagination: $("#result_table .pagination"),
				$paginationBtns: $("#result_table .pagination-btns"),
				$paginationList: $("#result_table .pagination-list"),
				$paginationRight: $("#result_table .pagination-right"),
				$paginationLeft: $("#result_table .pagination-left"),
				pageLimit: 10,
				render: function() {
					this.filteredData = this.data;

					this.numberOfPages = Math.ceil(this.filteredData.length / this.pageSize);
					if (this.numberOfPages > 1)
					{
						this.$pagination.show();
						this.$paginationBtns.show();
						this.$paginationList.show();
						this.$paginationRight.show();
					}
					else
					{
						this.$pagination.hide();
						this.$paginationBtns.hide();
						this.$paginationList.hide();
						this.$paginationRight.hide();
					}

					this.renderList(this.curPage);
					this.renderPages();
					preloader.stop();
				},
				renderList: function(pageNumber) {
					$('#result_table tr:not(:first)').remove();

					if (this.filteredData.length == 0) {
						this.$emptyMessage.text("По выбранным параметрам " +
										"данные не найдены. Измените " +
										"параметры фильтра и попробуйте снова.");
						this.$emptyMessage.show();
						this.$allProgram.hide();
						this.$table.hide();
					}
					else {
						this.$emptyMessage.hide();
						this.$allProgram.show();
						this.$table.show();
					}

					this.$counter.html(this.filteredData.length);

					var list = this.filteredData.slice((pageNumber - 1)*this.pageSize, (pageNumber - 1)*this.pageSize + (this.pageSize));
					for (var i = 0; i < list.length; i++)
					{
						var elem = list[i];

						var html = '';
						html += '<tr>';
						html += '	<td>';
						html +=	'   	<p class="h-courses-table-p-black">';
						html +=	'       	' + elem.name;
						html +=	'   	</p>';
						html += '	</td>';
						html += '	<td>';
						html += '		<div class="h-courses-table-p">';
						html += '			<span class="h-courses-table-span">Должность:</span>';
						html += '				' + elem.pos_name;
						html += '		</div>';
						html += '		<div class="h-courses-table-p">';
						html += '			<span class="h-courses-table-span">Подразделение:</span>';
						html += '				' + elem.sub_name;
						html += '		</div>';
						html += '		<div class="h-courses-table-p">';
						html += '			<span class="h-courses-table-span">Категория:</span>';
						html += '				' + elem.cat_name;
						html += '		</div>';
						html += '	</td>';
						html += '	<td>';
						html += '		<div class="h-courses-table-p">';
						html += '			<span class="h-courses-table-span">Курс:</span>';
						html += '				' + elem.ems_name;
						html += '		</div>';
						html += '		<div class="h-courses-table-p">';
						html += '			<span class="h-courses-table-span">Учебный центр:</span>';
						html += '				' + elem.edorg_name;
						html += '		</div>';
						html += '		<div class="h-courses-table-p">';
						html += '			<span class="h-courses-table-span">Форма обучения:</span>';
						html += '				' + elem.ems_type;
						html += '		</div>';
						html += '	</td>';
						html += '	<td>';
						html += '		<div class="h-courses-table-p">';
						html += '			' + EventsModal.prototype.convert_date_to_104_format_with_time(new Date(elem.start_date)) + " &mdash; " +
						EventsModal.prototype.convert_date_to_104_format_with_time(new Date(elem.finish_date));
						html += '			<span class="h-courses-table-span">';
						html += '				' + (elem.duration_fact ? elem.duration_fact + ' ч' : '');
						html += '			</span>';
						html += '		</div>';
						html += '	</td>';
						html += '	<td>';
						html += '		<p class="h-courses-table-p-black">';
						html += '			' + elem.cost;
						html += '		</p';
						html += '	</td>';
						html += '	<td>';
						html += '		<p class="h-courses-table-p-black">';
						html += '			' + elem.event_form;
						html += '		</p';
						html += '	</td>';
						html += '</tr>';

						this.list.append(html);
					}
					this.renderPages();
				},
				renderPages: function() {
					var pagesDiv = this.$paginationList.empty();
					var i;
					if (this.numberOfPages <= this.pageLimit) {
						for (i = 1; i <= this.numberOfPages; i++)
						{
							pagesDiv.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>')
						}
					}
					else {
						if (this.curPage < 7) {
							for (i = 1; i <= 7; i++) {
								pagesDiv.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>');
							}
							pagesDiv.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
							pagesDiv.append('<li><a href="javascript:;" id="page_' + this.numberOfPages + '">' + this.numberOfPages + '</a></li>');
						}
						else {
							if (this.numberOfPages - 3 > this.curPage) {
								pagesDiv.append('<li><a href="javascript:;" id="page_' + 1 + '">' + 1 + '</a></li>');
								pagesDiv.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
								var start = this.curPage - 2;
								var stop = this.curPage + 2;
								for (i = start; i <= stop; i++) {
									pagesDiv.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>');
								}
								pagesDiv.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
								pagesDiv.append('<li><a href="javascript:;" id="page_' + this.numberOfPages + '">' + this.numberOfPages + '</a></li>');
							}
							else {
								pagesDiv.append('<li><a href="javascript:;" id="page_' + 1 + '">' + 1 + '</a></li>');
								pagesDiv.append('<li><a href="javascript:;" style="pointer-events: none;">...</a></li>');
								for (i = this.numberOfPages - 6; i <= this.numberOfPages; i++) {
									pagesDiv.append('<li><a href="javascript:;" id="page_' + i + '">' + i + '</a></li>');
								}
							}
						}

					}

					pagesDiv.find("#page_" + this.curPage).addClass("active");
				},
				setPage: function(page) {
					if (page != this.curPage && page <= this.numberOfPages)
					{
						this.curPage = page;
						this.render();
					}
					if (this.curPage > 1)
					{
						this.$paginationLeft.show();
						if (this.curPage >= this.numberOfPages)
						{
							this.$paginationRight.hide();
						}
					}
					else
					{
						this.$paginationLeft.hide();
					}
				},
				setNextPage: function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					app.resultTable.setPage(this.curPage + 1);
				},
				setPrevPage: function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					app.resultTable.setPage(this.curPage - 1);
				},
				setEvents: function() {
					$(document).on("click", "#result_table .pagination-list a:not(.active)", function(e) {
						$("#result_table .pagination-list a:.active").removeClass("active");
						$(this).addClass("active");
						app.resultTable.setPage(Number($(this)[0].innerHTML));

						e.preventDefault();
						e.stopImmediatePropagation();
					});

					$(document).on("click",	"#result_table .pagination-left", function(e) {
						app.resultTable.setPrevPage(e);

						e.preventDefault();
						e.stopImmediatePropagation();
					});

					$(document).on("click",	"#result_table .pagination-right", function(e) {
						app.resultTable.setNextPage(e);

						e.preventDefault();
						e.stopImmediatePropagation();
					});
				},
				getData: function(type) {
					type = type || "";

					var times = getTimes();

					if (options.is_boss) {
						if (app.filter.resultTables[0].length == 0) {
							options.collab_list.forEach(function(item, i, arr) {
								app.filter.resultTables[0].push(item.id);
							});
						}
					}
					if (options.is_lector) {
						if (app.filter.resultTables[1].length == 0) {
							options.event_list.forEach(function(item, i, arr) {
								app.filter.resultTables[1].push(item.id);
							});
						}
					}

					preloader.start();
					if (type != "excel") {
						$.ajax({
							type: "POST",
							url: "/pp/Ext/extjs_json_collection_data.html",
							dataType: "json",
							data: {
								collection_code: "hlebprom_edu_rc_external_learning_report_results",
								parameters: ";startd=" + times[0] +
											";finishd=" + times[1] +
											";collabs=" + JSON.stringify(app.filter.resultTables[0]) +
											";evens=" + JSON.stringify(app.filter.resultTables[1]) +
											";edorgs=" + JSON.stringify(app.filter.resultTables[2]) +
											";edevens=" + JSON.stringify(app.filter.resultTables[3])
							},
							success: function (data, textStatus, jqXHR) {
								app.resultTable.data = data.results[0];
								if (app.resultTable.data.length > 0)
									$(".h-download-to-excel").addClass("active");
								else
									$(".h-download-to-excel").removeClass("active");
								app.resultTable.render();
							},
							error: function (data, textStatus, jqXHR) {
								preloader.stop();
								alert("Ошибка: " + data.error + "\n\nТип ошибки: " + textStatus);
							}
						});
					}
					else {
						if (app.resultTable.data.length != 0) {
							var i;
							for (i = 0; i < app.resultTable.data.length; ++i) {
								app.resultTable.data[i].start_date = EventsModal.prototype.convert_date_to_104_format_with_time(app.resultTable.data[i].start_date);
								app.resultTable.data[i].finish_date = EventsModal.prototype.convert_date_to_104_format_with_time(app.resultTable.data[i].finish_date);
							}

							var form = $("#excel_report");
							form.find("input[name='resultTable']").val(JSON.stringify(app.resultTable.data));
							form.submit();

							preloader.stop();
						}
					}
				}
			}
		}

		app.form.filterHtml.startDate = "";
		app.form.filterHtml.startDate += '<li class="h-filter__row h-choice__row">';
		app.form.filterHtml.startDate += '	<div class="h-filter__left h-filter__left_spad">Дата начала мероприятия</div>';
		app.form.filterHtml.startDate += '	<div class="h-filter__right">';
		app.form.filterHtml.startDate += '		<div id="start_date" class="h-subordinates-date">';
		app.form.filterHtml.startDate += '			<ul class="h-chips__row" style="margin-left: -7px">';
		app.form.filterHtml.startDate += '				<li class="h-chips__item h-chips__item_all from">';
		app.form.filterHtml.startDate += '					<div>';
		app.form.filterHtml.startDate += '			  		<input type="" name="start_date" class="js-datepicker a-choice-request-input" placeholder="20.07.2017">';
		app.form.filterHtml.startDate += '					</div>';
		app.form.filterHtml.startDate += '				</li>';
		app.form.filterHtml.startDate += '				<li class="h-chips__item h-chips__item_all">';
		app.form.filterHtml.startDate += '		  		<input type="" name="start_date" class="h-date-input" placeholder="00:00">';
		app.form.filterHtml.startDate += '				</li>';
		app.form.filterHtml.startDate += '			</ul>';
		app.form.filterHtml.startDate += '		</div>';
		app.form.filterHtml.startDate += '		<div class="h-subordinates-date def">';
		app.form.filterHtml.startDate += '			<span style="margin-left: -10px;">&mdash;</span>';
		app.form.filterHtml.startDate += '		</div>';
		app.form.filterHtml.startDate += '		<div id="finish_date" class="h-subordinates-date">';
		app.form.filterHtml.startDate += '			<ul class="h-chips__row" style="margin-left: -7px">';
		app.form.filterHtml.startDate += '				<li class="h-chips__item h-chips__item_all after">';
		app.form.filterHtml.startDate += '					<div>';
		app.form.filterHtml.startDate += '			  		<input type="" name="finish_date" class="js-datepicker a-choice-request-input" placeholder="20.07.2017">';
		app.form.filterHtml.startDate += '					</div>';
		app.form.filterHtml.startDate += '				</li>';
		app.form.filterHtml.startDate += '				<li class="h-chips__item h-chips__item_all">';
		app.form.filterHtml.startDate += '		  		<input type="" name="finish_date" class="h-date-input" placeholder="00:00">';
		app.form.filterHtml.startDate += '				</li>';
		app.form.filterHtml.startDate += '			</ul>';
		app.form.filterHtml.startDate += '		</div>';
		app.form.filterHtml.startDate += '	</div>';
		app.form.filterHtml.startDate += '</li>';

		app.form.filterHtml.collab = "";
		app.form.filterHtml.collab += '<li id="collab_filter" class="h-filter__row h-choice__row">';
		app.form.filterHtml.collab += '	<div class="h-filter__left h-filter__left_spad">Сотрудник</div>';
		app.form.filterHtml.collab += '	<div class="h-filter__right">';
		app.form.filterHtml.collab += '		<div class="h-chips h-chips_mrg">';
		app.form.filterHtml.collab += ' 		<ul id="collab_list" class="h-chips__row"></ul>';
		app.form.filterHtml.collab += '			<a data-href="#modal_collab" class="h-choice__item_button h-margin-bottom js-open-modal" href="javascript:void(0);">Выбрать</a>';
		app.form.filterHtml.collab += '		</div>';
		app.form.filterHtml.collab += '	</div>';
		app.form.filterHtml.collab += '</li>';

		app.form.filterHtml.eventType = "";
		app.form.filterHtml.eventType += '<li id="event_filter" class="h-filter__row h-choice__row">';
		app.form.filterHtml.eventType += '	<div class="h-filter__left h-filter__left_spad">Мероприятие</div>';
		app.form.filterHtml.eventType += '	<div class="h-filter__right">';
		app.form.filterHtml.eventType += '		<div class="h-chips h-chips_mrg">';
		app.form.filterHtml.eventType += ' 			<ul  id="event_list" class="h-chips__row"></ul>';
		app.form.filterHtml.eventType += '			<a data-href="#modal_event" class="h-choice__item_button h-margin-bottom js-open-modal" href="javascript:void(0);">Выбрать</a>';
		app.form.filterHtml.eventType += '		</div>';
		app.form.filterHtml.eventType += '	</div>';
		app.form.filterHtml.eventType += '</li>';

		app.form.filterHtml.eduOrg = "";
		app.form.filterHtml.eduOrg += '<li id="edu_org_filter" class="h-filter__row h-choice__row">';
		app.form.filterHtml.eduOrg += '	<div class="h-filter__left h-filter__left_spad">Учебный центр</div>';
		app.form.filterHtml.eduOrg += '	<div class="h-filter__right">';
		app.form.filterHtml.eduOrg += '		<div class="h-chips h-chips_mrg">';
		app.form.filterHtml.eduOrg += ' 		<ul  id="edu_org_list" class="h-chips__row"></ul>';
		app.form.filterHtml.eduOrg += '			<a data-href="#modal_edu_org" class="h-choice__item_button h-margin-bottom js-open-modal" href="javascript:void(0);">Выбрать</a>';
		app.form.filterHtml.eduOrg += '		</div>';
		app.form.filterHtml.eduOrg += '	</div>';
		app.form.filterHtml.eduOrg += '</li>';

		app.form.filterHtml.educatEvent = "";
		app.form.filterHtml.educatEvent += '<li id="educat_event_filter" class="h-filter__row h-choice__row">';
		app.form.filterHtml.educatEvent += '	<div class="h-filter__left h-filter__left_spad">Форма проведения</div>';
		app.form.filterHtml.educatEvent += '	<div class="h-filter__right">';
		app.form.filterHtml.educatEvent += '		<div class="h-chips h-chips_mrg">';
		app.form.filterHtml.educatEvent += '			<ul id="educat_event_list" class="h-chips__row"></ul>';
		app.form.filterHtml.educatEvent += '        	<a data-href="#modal_educat_event" class="h-choice__item_button h-margin-bottom js-open-modal" href="javascript:void(0);">Выбрать</a>';
		app.form.filterHtml.educatEvent += '		</div>';
		app.form.filterHtml.educatEvent += '	</div>';
		app.form.filterHtml.educatEvent += '</li>';

		function toggleMessage (flag) {
			if (flag) {
				app.resultTable.$emptyMessage.text("Для построения отчёта требуется " +
						  "выбрать хотя бы одно условие выборки. " +
						  "Произведите выбор условия и повторите попытку");
				app.resultTable.$emptyMessage.show();
				app.resultTable.$allProgram.hide();
				app.resultTable.$table.hide();
				app.resultTable.$pagination.hide();
			}
			else {
				app.resultTable.$emptyMessage.hide();
				app.resultTable.$allProgram.hide();
				app.resultTable.$table.hide();
				app.resultTable.$pagination.hide();
			}
		}

		function toggleControlButtons () {
			var startd = $("input[name=start_date]:not(.h-date-input)").val();
			var finishd = $("input[name=finish_date]:not(.h-date-input)").val();

			var flag = false;
			if (startd.length == 10 || finishd.length == 10)
				flag = true;
			else {
				var windows = [
					app.filter.collabFilter,
					app.filter.eventFilter,
					app.filter.eduOrgFilter,
					app.filter.educatEventFilter
				]
				var i;
				for (i = 0; i < windows.length; ++i)
					if (windows[i].length != 0) {
						flag = true;
						break;
					}
			}
			if (flag) {
				if (!$(".h-build-report").hasClass("active")) {
					toggleMessage(false);
					$(".h-build-report").addClass("active");
				}
			}
			else {
				if ($(".h-build-report").hasClass("active")) {
					toggleMessage(true);
					$(".h-build-report, .h-download-to-excel").removeClass("active");
				}
			}
		}

		// Инициализация
		app.init = function() {
			// Форма
			app.form.renderFilter();
			app.form.setInputMask();

			// Фильтр
			app.filter.setEvents();
			app.filter.render();

			// Результат
			toggleMessage(true);

			// Создание окон выбора
			// Сотрудники
			var collabWindow = new CollabModal({
				title: "Выбор сотрудника",
				multiple: true,
				modal_id: "modal_collab",
				container: "body"
			});

			collabWindow.setData(options.collab_list);
			collabWindow.set_events();

			collabWindow.choose_btn.on("click", function(e) { // Выбор значений
				collabWindow.close_modal();
				app.filter.collabFilter = collabWindow.buffer.slice(0, collabWindow.buffer.length);
				app.filter.renderCollabBlock(app.filter.collabFilter);

				toggleControlButtons();
			});

			$(document).on("click", "[data-href=#modal_collab]", function() {
				collabWindow.buffer = app.filter.collabFilter.slice(0, app.filter.collabFilter.length);
				collabWindow.btn_inner.html(collabWindow.buffer.length);
				collabWindow.clear_search_results();
				collabWindow.set_page(1);
			});

			collabWindow.render();

			// Мероприятия
			var eventWindow = new EventsModal({
				title: "Выбор мероприятия",
				multiple: true,
				modal_id: "modal_event",
				container: "body"
			});

			eventWindow.setData(options.event_list);
			eventWindow.set_events();

			eventWindow.choose_btn.on("click", function(e) { // Выбор значений
				eventWindow.close_modal();

				app.filter.eventFilter = eventWindow.buffer.slice(0, eventWindow.buffer.length);
				app.filter.renderEventBlock(app.filter.eventFilter);

				toggleControlButtons();
			});

			$(document).on("click", "[data-href=#modal_event]", function() {
				eventWindow.buffer = app.filter.eventFilter.slice(0, app.filter.eventFilter.length);
				eventWindow.btn_inner.html(eventWindow.buffer.length);
				eventWindow.clear_search_results();
				eventWindow.set_page(1);
			});

			eventWindow.render();

			// Учебные центры
			var eduOrgWindow = new EduOrgsModal({
				title: "Выбор обучающей организации",
				multiple: true,
				modal_id: "modal_edu_org",
				container: "body"
			});

			eduOrgWindow.setData(options.edu_org_list);
			eduOrgWindow.set_events();

			eduOrgWindow.choose_btn.on("click", function(e) { // Выбор значений
				eduOrgWindow.close_modal();

				app.filter.eduOrgFilter = eduOrgWindow.buffer.slice(0, eduOrgWindow.buffer.length);
				app.filter.renderEduOrgBlock(app.filter.eduOrgFilter);

				toggleControlButtons();
			});

			$(document).on("click", "[data-href=#modal_edu_org]", function() {
				eduOrgWindow.buffer = app.filter.eduOrgFilter.slice(0, app.filter.eduOrgFilter.length);
				eduOrgWindow.btn_inner.html(eduOrgWindow.buffer.length);
				eduOrgWindow.clear_search_results();
				eduOrgWindow.set_page(1);
			});

			eduOrgWindow.render();

			// Формы проведения
			var educatEventWindow = new EducatEventsModal({
				title: "Выбор формы проведения",
				multiple: true,
				modal_id: "modal_educat_event",
				container: "body"
			});

			educatEventWindow.setData(options.educat_event_list);
			educatEventWindow.set_events();

			educatEventWindow.choose_btn.on("click", function(e) { // Выбор значений
				educatEventWindow.close_modal();

				app.filter.educatEventFilter = educatEventWindow.buffer.slice(0, educatEventWindow.buffer.length);
				app.filter.renderEducatEventBlock(app.filter.educatEventFilter);

				toggleControlButtons();
			});

			$(document).on("click", "[data-href=#modal_educat_event]", function() {
				educatEventWindow.buffer = app.filter.educatEventFilter.slice(0, app.filter.educatEventFilter.length);
				educatEventWindow.btn_inner.html(educatEventWindow.buffer.length);
				educatEventWindow.clear_search_results();
				educatEventWindow.set_page(1);
			});

			educatEventWindow.render();

			// Календарь
			$(".js-datepicker").datepicker({
				setDate: new Date(),
				beforeShow: function(input) {
					_openDatepicker(input);
					$(input).next()
						.addClass("active")
						.attr("src", options.data_picker_img_white)
				},
				onClose: function() {
					$(".ui-datepicker-trigger")
						.removeClass("active")
						.attr("src", options.data_picker_img_blue)
				},
				onChangeMonthYear: _changeMonthYearDatepickerCallback
			});

			var startd = $("input[name=start_date]:not(.h-date-input)");
			var finishd = $("input[name=finish_date]:not(.h-date-input)");
			var startt = $("input[name=start_date].h-date-input");
			var finisht = $("input[name=finish_date].h-date-input");

			// Дата и время начала
			startd.change(function(e) {
				$(this).removeClass("error");
				finishd.removeClass("error");
				var dateStr = $(this).val(),
					maxDate,
					dateVal;
				maxDate = startd.datepicker("option", "maxDate");
				if (dateStr.length != 0) {
					if (isValidDateInput("input[name=start_date]:not(.h-date-input)")) {
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
				toggleControlButtons();
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
						if (finisht.val().length > 0) {
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
					if (isValidDateInput("input[name=finish_date]:not(.h-date-input)")) {
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
				toggleControlButtons();
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

						if (startt.val().length > 0) {
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

			// Преобразует строку в дату
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

			/*// Фиксированный поиск
			(function(){
				var a = document.querySelector('#sticky'), b = null, P = 0;  // если ноль заменить на число, то блок будет прилипать до того, как верхний край окна браузера дойдёт до верхнего края элемента. Может быть отрицательным числом
				window.addEventListener('scroll', Ascroll, false);
				document.body.addEventListener('scroll', Ascroll, false);
				function Ascroll() {
				  if (b == null) {
				    var Sa = getComputedStyle(a, ''), s = '';
				    for (var i = 0; i < Sa.length; i++) {
				      if (Sa[i].indexOf('overflow') == 0 || Sa[i].indexOf('padding') == 0 || Sa[i].indexOf('border') == 0 || Sa[i].indexOf('outline') == 0 || Sa[i].indexOf('box-shadow') == 0 || Sa[i].indexOf('background') == 0) {
				        s += Sa[i] + ': ' +Sa.getPropertyValue(Sa[i]) + '; '
				      }
				    }
				    b = document.createElement('div');
				    b.style.cssText = s + ' box-sizing: border-box; width: ' + a.offsetWidth + 'px;';
				    a.insertBefore(b, a.firstChild);
				    var l = a.childNodes.length;
				    for (var i = 1; i < l; i++) {
				      b.appendChild(a.childNodes[1]);
				    }
				    a.style.height = b.getBoundingClientRect().height + 'px';
				    a.style.padding = '0';
				    a.style.border = '0';
				  }
				  var Ra = a.getBoundingClientRect();

				  if ((Ra.top - P) <= -300) {
				    b.className = 'sticky';
				    b.style.top = P + 'px';

						// Изменение внешнего вида фильтра
						$(b).find(".h-filter__row").addClass('fixed');
						var leftFilters = $(b).find(".h-filter__left");
						leftFilters.css("display", "inline-block");

						var rightFilters = $(b).find(".h-filter__right");
						rightFilters.css("display", "inline-block");

						$("#collab_list").hide();
						$("#event_list").hide();
						$("#edu_org_list").hide();
						$("#educat_event_list").hide();

						$("#collab_filter").width("15%");
						$("#event_filter").width("15%");
						$("#edu_org_filter").width("15%");
						$("#educat_event_filter").width("15%");

						var img = $(b).find(".ui-datepicker-trigger");
						$(img).attr("style", "display: none !important");
						$(b).css("background-color", "white");

						$("#sticky").children().first().css("border-bottom", "1px solid #f5f5f5");

						$(".h-build-report, .h-download-to-excel").addClass("dimension");
						$(".h-build-report").text("ПО");
						$(".h-download-to-excel").text("");
				  }
					else {
				    b.className = '';
				    b.style.top = '';

						// Изменение внешнего вида фильтра
						$(b).find("li").removeClass('fixed');
						var leftFilters = $(b).find(".h-filter__left");
						leftFilters.css("display", "table-cell");

						var rightFilters = $(b).find(".h-filter__right");
						rightFilters.css("display", "table-cell");

						$("#collab_list").show();
						$("#event_list").show();
						$("#edu_org_list").show();
						$("#educat_event_list").show();

						$("#collab_filter").width("auto");
						$("#event_filter").width("auto");
						$("#edu_org_filter").width("auto");
						$("#educat_event_filter").width("auto");

						var img = $(b).find(".ui-datepicker-trigger");
						$(img).attr("style", "display: block !important");
						$(b).css("background-color", "transparent");

						$("#sticky").children().first().css("border-bottom", "none");

						$(".h-build-report, .h-download-to-excel").removeClass("dimension");
						$(".h-build-report").text("Построить отчёт");
						$(".h-download-to-excel").text("Выгрузить в Excel");
				  }
				  window.addEventListener('resize', function() {
				    a.children[0].style.width = getComputedStyle(a, '').width
				  }, false);
				}
			})()*/

			// Построение отчёта
			$(".h-build-report.active").live("click", function(){
				// Результат
				app.resultTable.setEvents();
				app.resultTable.getData();
				app.resultTable.setPage(1);
			});

			// Выгрузка в Excel
			$(".h-download-to-excel.active").live("click", function(){
				// Результат
				app.resultTable.setEvents();
				app.resultTable.getData('excel');
			});

			$(".h-download-to-excel.empty").live("click", function(){
				// Результат
				toggleMessage(true);
			});
		}

		app.init();
	}
	else {
		$("#main").remove();
		$("#result_table").remove();
		$(".access_denied").show();
	}
})(<%=tools.object_to_text(options, "json")%>);
</script>
