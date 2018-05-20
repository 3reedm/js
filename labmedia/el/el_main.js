<%
Request.AddRespHeader("X-UA-Compatible", "IE=Edge");
Request.AddRespHeader("viewport", "width=device-width");
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

	var options = {
		event_collaborator: [],
		event_preparation: [],
		event_tutor: [],
		event_lector: [],
		event_files: [],
		event_type: [],
		event_form: lists.event_forms,
		org_form: lists.organizational_forms,
		city: [],
		is_collaborator: false,
		is_tutor: false,
		is_lector: false,
		is_preparation: false,
		save_data_template_id: 0,
		data_picker_img_blue: getResourceLink("calendar1.png"),
		data_picker_img_white: getResourceLink("calendar1.png"),
		gear_ico_red: getResourceLink("gear_red.svg"),
		gear_ico_white: getResourceLink("gear_white.svg")
	};

	// Шаблон для редактирования информации по мероприятию
	options.save_data_template_id = ArrayOptFirstElem(XQuery("for $elem in custom_web_templates where $elem/code = 'eldorado_d17_event_save' return $elem"), {id: {Value: 0}}).id.Value;

	var global_roles_template = ArrayOptFirstElem(XQuery("for $elem in custom_web_templates where $elem/code='eldorado_global_rules' return $elem"));
	if (global_roles_template != undefined)
	{
		var show_debug = OpenDoc(UrlFromDocID(global_roles_template.id)).TopElem.wvars.ObtainChildByKey("show_debug").value == '1';

		show_debug = false;

		var template_code = "eldorado_d17_event";
		var my_curUser = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/id = " + curUserID + " return $elem"));

		function InResponse(text)
		{
			if (show_debug)
			{
				Response.Write(text + "<br>");
			}
		}

		function InAlert(text)
		{
			if (show_debug)
			{
				alert(text);
			}
		}

		function hasRules() {
			var result = true;

			return result;
		}

		function hasEventID ()
		{
			var result = true;

			if (curObject == undefined || curObjectID == undefined || curObjectID == null || curObject == null)
			{
				result = false;
			}

			return result;
		}

		if (!hasEventID())
		{
			throw "!!!(Не указан ID мероприятия!!!(";
		}


		if (!hasRules())
		{
			throw "!!!(У вас недостаточно прав для просмотра этой страницы!!!(";
		}


		function GetEventInfo (event_id)
		{
			var result = [];

			var sql = "";

			if (OptInt(event_id, 0) == 0)
			{
				return result;
			}

			sql += "DECLARE @event_id BIGINT = " + event_id + "\r\n";
			sql += "SELECT\r\n";
			sql += "	[es].[id] AS [event_id]\r\n";
			sql += "	,[es].[status_id]\r\n";
			sql += "	,CAST([es].[event_type_id] AS varchar(max)) AS event_type_id\r\n";
			sql += "	,CAST([es].[place_id] AS varchar(max)) AS place_id\r\n";
			sql += "	,ISNULL([es].[is_public], 0) AS [is_public]\r\n";
			sql += "	,ISNULL([es].[name], '') AS [event_name]\r\n";
			sql += "	,ISNULL([ets].[name], '') AS [event_type_name]\r\n";
			sql += "	,ISNULL([ps].[name], '') AS [place_name]\r\n";
			sql += "	,ISNULL([e].[data].value('(event/place)[1]', 'VARCHAR(MAX)'), '') AS [place]\r\n";
			sql += "	,ISNULL([es].[event_form], '') AS [event_form_name]\r\n";
			sql += "	,ISNULL([es].[organizational_form], '') AS [org_form_name]\r\n";
			sql += "	,FORMAT([es].[start_date], 'dd.MM.yyyy') AS [start_date]\r\n";
			sql += "	,FORMAT([es].[finish_date], 'dd.MM.yyyy') AS [finish_date]\r\n";
			sql += "	,FORMAT([es].[start_date], 'HH:mm') AS [start_time]\r\n";
			sql += "	,FORMAT([es].[finish_date], 'HH:mm') AS [finish_time]\r\n";
			sql += "	,[e].[data].value('(event/desc)[1]', 'VARCHAR(MAX)') AS [desc]\r\n";
			sql += "	,[e].[data].value('(event/custom_elems/custom_elem[name=\"fact_made\"]/value)[1]', 'VARCHAR(MAX)') AS [is_fact_made]\r\n";
			sql += "	,[e].[data].value('(event/custom_elems/custom_elem[name=\"topic\"]/value)[1]', 'VARCHAR(MAX)') AS [topic]\r\n";
			sql += "FROM\r\n";
			sql += "	[events] AS [es]\r\n";
			sql += "	LEFT JOIN [event_types] AS [ets] ON [ets].[id] = [es].[event_type_id]\r\n";
			sql += "	LEFT JOIN [places] AS [ps] ON [es].[place_id] = [ps].[id]\r\n";
			sql += "	INNER JOIN [event] AS [e] ON [e].[id] = [es].[id]\r\n";
			sql += "WHERE\r\n";
			sql += "	[es].[id] = @event_id";

			result = XQuery("sql: " + sql);

			return result;
		}

		function GetData ()
		{
			var result = [];

			var sql = "";

			sql += "SELECT\r\n";
			sql += "	[ets].[id] AS [event_type_id],\r\n";
			sql += "	[ets].[name] AS [event_type_name]\r\n";
			sql += "FROM\r\n";
			sql += "	[event_types] AS [ets]\r\n";
			sql += "WHERE\r\n";
			sql += "	[ets].[code] != 'webinar'\r\n";

			result = XQuery("sql: " + sql);

			for (el in result)
			{
				options.event_type.push({
					id: el.event_type_id.Value,
					name: el.event_type_name.Value
				});
			}

			sql = "";

			sql += "SELECT\r\n";
			sql += "	[ps].[id] AS [city_id],\r\n";
			sql += "	[ps].[name] AS [city_name]\r\n";
			sql += "FROM\r\n";
			sql += "	[places] AS [ps]\r\n";

			result = XQuery("sql: " + sql);

			for (el in result)
			{
				options.city.push({
					id: el.city_id.Value,
					name: el.city_name.Value
				});
			}

			return result;
		}


		function GetFileType (name)
		{
			var result = "";
			if (name == "")
			{
				return result;
			}

			var name_parts = name.split(".");

			if (ArrayCount(name_parts) > 0)
			{
				result = name_parts[ArrayCount(name_parts) - 1];
			}

			return result;
		}

		function GetEventFiles (event_id)
		{
			var result = [];
			var el;
			var sql = "";

			if (OptInt(event_id, 0) == 0)
			{
				return result;
			}

			sql += "DECLARE @event_id BIGINT = " + event_id + "\r\n";
			sql += "SELECT\r\n";
			sql += "	[rs].[id]\r\n";
			sql += "	,[rs].[name]\r\n";
			sql += "	,[rs].[file_name]\r\n";
			sql += "	,[rs].[type]\r\n";
			sql += "	,[rs].[size]\r\n";
			sql += "FROM\r\n";
			sql += "	[events] AS [es]\r\n";
			sql += "	INNER JOIN [event] AS [e] ON [es].[id] = [e].[id]\r\n";
			sql += "	CROSS APPLY [e].[data].nodes('event/files/file') AS [temp](t1)\r\n";
			sql += "	INNER JOIN [resources] AS [rs] ON [rs].[id] = [t1].value('(./file_id)[1]', 'BIGINT')\r\n";
			sql += "WHERE\r\n";
			sql += "	[es].[id] = @event_id\r\n";

			var query = XQuery("sql: " + sql);

			for (el in query)
			{
				result.push({
					id: el.id.Value,
					name: el.name.Value,
					type: GetFileType(el.file_name.Value),
					size: el.size.Value
				});
			}

			return result;
		}

		function GetEventCollaborator (event_id)
		{
			var result = [];
			var sql = "";
			var el;

			if (OptInt(event_id, 0) == 0)
			{
				return result;
			}

			sql += "DECLARE @event_id BIGINT = " + event_id + "\r\n";
			sql += "SELECT\r\n";
			sql += "	DISTINCT\r\n";
			sql += "	[cs].[id]\r\n";
			sql += "	,[cs].[fullname] AS [person_fullname]\r\n";
			sql += "	,ISNULL([cs].[position_name], '') AS [position_name]\r\n";
			sql += "	,ISNULL([cs].[org_name], '') AS [org_name]\r\n";
			sql += "	,ISNULL([cs].[position_parent_name], '') AS [subdivision_name]\r\n";
			sql += "	,ISNULL(FORMAT([cs].[hire_date], 'dd.MM.yyyy'), '') AS [hire_date]\r\n";
			sql += "	,ISNULL([ecs].[is_tutor], 0) AS [is_tutor]\r\n";
			sql += "	,ISNULL([ecs].[is_preparation], 0) AS [is_preparation]\r\n";
			//sql += "	,ISNULL([cs].[pict_url], '') AS [pict_url]\r\n";
			//sql += "	,[c].[data].value('(collaborator/firstname)[1]','varchar(1)') + '. ' + [c].[data].value('(collaborator/lastname)[1]','varchar(1)') + '.' AS [initials]\r\n";
			sql += "FROM\r\n";
			sql += "	[event_collaborators] AS [ecs]\r\n";
			sql += "	INNER JOIN [collaborators] AS [cs] ON [ecs].[collaborator_id] = [cs].[id]\r\n";
			sql += "	INNER JOIN [collaborator] AS [c] ON [cs].[id] = [c].[id]\r\n";
			sql += "WHERE\r\n";
			sql += "	[ecs].[event_id] = @event_id\r\n";
			sql += "	AND\r\n";
			sql += "	[cs].[is_dismiss] <> '1'\r\n";

			result = XQuery("sql: " + sql);

			for (el in result)
			{
				if (el.is_tutor.Value)
				{
					options.event_tutor.push({
						id: el.id.Value,
						person_fullname: el.person_fullname.Value,
						position_name: el.position_name.Value,
						org_name: el.org_name.Value,
						subdivision_name: el.subdivision_name.Value,
						hire_date: el.hire_date.Value,
						is_tutor: el.is_tutor.Value,
						is_preparation: el.is_preparation.Value
					//	initials: el.initials.Value,
					//	pict_url: el.pict_url.Value
					});
				}
				if (el.is_preparation.Value)
				{
					options.event_preparation.push({
						id: el.id.Value,
						person_fullname: el.person_fullname.Value,
						position_name: el.position_name.Value,
						org_name: el.org_name.Value,
						subdivision_name: el.subdivision_name.Value,
						hire_date: el.hire_date.Value,
						is_tutor: el.is_tutor.Value,
						is_preparation: el.is_preparation.Value
					//	initials: el.initials.Value,
					//	pict_url: el.pict_url.Value
					});
				}
				if (!el.is_tutor.Value && !el.is_preparation.Value)
				{
					options.event_collaborator.push({
						id: el.id.Value,
						person_fullname: el.person_fullname.Value,
						position_name: el.position_name.Value,
						org_name: el.org_name.Value,
						subdivision_name: el.subdivision_name.Value,
						hire_date: el.hire_date.Value,
						is_tutor: el.is_tutor.Value,
						is_preparation: el.is_preparation.Value
					//	initials: el.initials.Value,
					//	pict_url: el.pict_url.Value
					});
				}
			}

			sql = "";
			sql += "DECLARE @event_id BIGINT = " + event_id + "\r\n";
			sql += "SELECT\r\n";
			sql += "	[ecs].[lector_id] AS [id]\r\n";
			sql += "	,[ecs].[lector_fullname] AS [fullname]\r\n";
			sql += "	,ISNULL([cs].[position_name], '') AS [position_name]\r\n";
			sql += "	,ISNULL([cs].[org_name], '') AS [org_name]\r\n";
			sql += "	,ISNULL([cs].[position_parent_name], '') AS [subdivision_name]\r\n";
		//	sql += "	,ISNULL([cs].[pict_url], '') AS [pict_url]\r\n";
			sql += "	,ISNULL(FORMAT([cs].[hire_date], 'dd.MM.yyyy'), '') AS [hire_date]\r\n";
			sql += "	,ISNULL([ecs].[person_id], '') AS [person_id]\r\n";
			sql += "FROM\r\n";
			sql += "	[event_lectors] AS [ecs]\r\n";
			sql += "	LEFT JOIN [collaborators] AS [cs] ON [ecs].[person_id] = [cs].[id]\r\n";
			sql += "WHERE\r\n";
			sql += "	[ecs].[event_id] = @event_id\r\n";

			result = XQuery("sql: " + sql);

			for (el in result)
			{
				options.event_lector.push({
					id: el.id.Value,
					person_id: el.person_id.Value,
					person_fullname: el.fullname.Value,
					position_name: el.position_name.Value,
					org_name: el.org_name.Value,
					subdivision_name: el.subdivision_name.Value,
					hire_date: el.hire_date.Value,
			//		pict_url: el.pict_url.Value
				});
			}
		}

		function GetEventRole()
		{
			var result = "";

			var roles = {
				tutor: "Ответственный за проведение",
				lector: "Преподаватель",
				preparation: "Ответственный за подготовку",
				collaborator: "Участник"
			};

			if (ArrayOptFindByKey(options.event_collaborator, OptInt(curUserID), "id") != undefined)
			{
				result = roles.collaborator;
				options.is_collaborator = true;

				__xquery_str = "for $e in event_results where $e/person_id=" + OptInt(curUserID) + " return $e";

				eventResDoc = OpenDoc(UrlFromDocID(ArrayOptFind(XQuery(__xquery_str), "This.event_id==" + OptInt(curObjectID)).id));
				eventResTE = eventResDoc.TopElem;

				options.collaborator_comment = UrlEncode(eventResTE.collaborator_comment.Value);
			}
			if (ArrayOptFindByKey(options.event_preparation, OptInt(curUserID), "id") != undefined)
			{
				result = roles.preparation;
				options.is_preparation = true;
			}
			if (ArrayOptFindByKey(options.event_lector, OptInt(curUserID), "person_id") != undefined)
			{
				result = roles.lector;
				options.is_lector = true;
			}
			if (ArrayOptFindByKey(options.event_tutor, OptInt(curUserID), "id") != undefined)
			{
				result = roles.tutor;
				options.is_tutor = true;
			}

			return result;
		}

		function SetEventInfo()
		{
			var event_info_arr = GetEventInfo(curObjectID);

			if (ArrayCount(event_info_arr) > 0)
			{
				options.event_info = ArrayOptFirstElem(event_info_arr);

				// Форма проведения и организационная форма
				item = ArrayOptFind(lists.event_forms, 'This.id=="' + options.event_info.event_form_name.Value + '"');
				if (item != undefined) {
					options.event_info.event_form_name.Value = item.name;
					options.event_form_id = item.id.Value;
				}

				item = ArrayOptFind(lists.organizational_forms, 'This.id=="' + options.event_info.org_form_name.Value + '"');
				if (item != undefined) {
					options.event_info.org_form_name.Value = item.name;
					options.org_form_id = item.id.Value;
				}
			}
		}

		// Заполняем объект options
		GetEventCollaborator(curObjectID);
		SetEventInfo();
		options.role_name = GetEventRole();
		options.event_files = GetEventFiles(curObjectID);
		GetData();

		try
		{
			Response.Write(tools_web.insert_custom_code(template_code + "_markup", null, true, false, 0, null, true));
			if (show_debug)
			{
				Response.Write("выполнено подключение файла вывода<br>");
			}
		}
		catch(_ex)
		{
			throw "!!!(Не удалось выполнить подключение файла вывода " + _ex + "!!!(";
		}

		try
		{
			Response.Write(tools_web.insert_custom_code(template_code + "_js", null, true, false, 0, null, true));
			if (show_debug)
			{
				Response.Write("выполнено подключение скриптов<br>");
			}
		}
		catch(_ex)
		{
			Response.Write("Не удалось выполнить скриптов " + _ex + "<br>");
		}

		try
		{
			Response.Write(tools_web.insert_custom_code(template_code + "_style", null, true, false, 0, null, true));
			if (show_debug)
			{
				Response.Write("выполнено подключение файла стилей<br>");
			}
		}
		catch(_ex)
		{
			throw "!!!(Не удалось выполнить подключение файла стилей " + _ex + "!!!(";
		}

		alert(options.is_tutor);
	}
	else
	{
		throw "!!!(Не удалось получить шаблон с глобальными настройками.!!!(";
	}
}
catch(ex)
{
	Response.Write('<div class="main-child clearfix"><center><table style="border: 5px solid red;" cellSpacing="0" cellPadding="5"><tbody><tr bgColor="#ffffff"><td style="vertical-align: middle; text-align: center; padding: 10px"><img src="pics/atten.jpg" style="margin: 5px; height: 32px; width: 32px;"></td><td style="vertical-align: middle; text-align: justify; padding: 10px"><p style="margin: 5px;"><b><font size="2">' + ((String(ex).indexOf("!!!(") + 1 > 0 || String(ex).indexOf("не") + 1 > 0) ? String(ex).split("!!!(")[1] : ex) + '</font></b></p></td></tr></tbody></table></center></div>');
}
%>
