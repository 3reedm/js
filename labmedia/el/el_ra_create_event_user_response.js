ERROR = 0;
MESSAGE = "";

__new_response_doc = OpenNewDoc("x-local://wtv/wtv_response.xmd");
__new_response_doc.BindToDb(DefaultDb);
__new_response = __new_response_doc.TopElem;

__new_response.custom_elems.ObtainChildByKey("eldorado_d17_response_1").value =
	eldorado_d17_response_1;

__xquery_str = "for $elem in response_types where $elem/code = " +
							 "'eldorado_d17_response_event' return $elem";
cur_response_type_id = ArrayOptFirstElem(XQuery(__xquery_str)).id;
__new_response.response_type_id = cur_response_type_id;
__new_response.person_id = curUserID;
__new_response.person_fullname = curUser.lastname + " " +
																 curUser.firstname + " " +
																 curUser.middlename;

__new_response.object_id = event_id;
__new_response.object_name = UrlDecode(event_name);
__new_response.object_start_date = event_start_date;

__new_response_doc.Save();
