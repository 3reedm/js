var searchInput="";

function ajax() { //Ajax отправка сообщения
    var msg = $("#form").serialize();
    $.ajax({
        type: "POST",
        url: "php/sendmessage.php",
        data: msg,
        success: function(data) {
            $.jGrowl(data);
        },
        error:  function(xhr, str){
            alert("Возникла ошибка!");
        }
    });
}

function ajaxs(ids, colls, prices, price) { //Ajax отправка формы
    
    loadMsgCart(ids, colls, prices, price);
    
    var msg = $("#checkin").serialize();
    $.ajax({
        type: "POST",
        url: "php/sendcart.php",
        data: msg,
        success: function(data) {
            $.jGrowl(data);
        },
        error:  function(xhr, str){
            alert("Возникла ошибка!");
        }
    });
}

function setCookie(name, value, expires, path, domain, secure) {
    expires instanceof Date ? expires = expires.toGMTString() : typeof(expires) == 'number' && (expires = (new Date(+(new Date) + expires * 1e3)).toGMTString());
    var r = [name + "=" + escape(value)], s, i;
    for(i in s = {expires: expires, path: path, domain: domain}){
        s[i] && r.push(i + "=" + s[i]);
    }
    return secure && r.push("secure"), document.cookie = r.join(";"), true;
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
  setCookie(name, "", { expires: -1 });
}

function addCart(p1, p2, p3, del){
    if (!p3 || p3==0) {p3=1;}
    
    msg.id = p1; // АйДи
    msg.price = parseInt(p2); // Цена
    msg.count = parseInt(p3); // Количество
    
    var check = false;
    var cnt = false;
    var totalCountGoods = 0;
    var totalprice = 0;
    var goodsId = 0;
    var basket = '';
    
    $('#clearBasket').show();
    $('#checkOut').show();
    $('.hPb').show();
    $('.hPe').hide();
    
    basket = decodeURI(getCookie("basket"));
    if (basket=='null') {basket = '';}
    basketArray = basket.split(",");
    for(var i=0; i<basketArray.length-1;i++) {
        goodsId = basketArray[i].split(":");
        if(goodsId[0]==msg.id) { // ищем, не покупали ли мы этот товар ранее            
            check = true;
            cnt = goodsId[1];
            break;
        }
    }

    if(!check && !del) {
        basket+= msg.id + ':' + msg.count + ':' + msg.price + ',';
        $.jGrowl("Добавлено!");
    } else if (check && !del) {
        $.jGrowl("Количество изменено!");
        basket = basket.replace(msg.id + ':' + cnt + ':' + msg.price + ',', msg.id + ':' + (parseInt(cnt) + 1) + ':' + msg.price + ',');
    } else if (check && del) {
        basket = basket.replace(msg.id + ':' + cnt + ':' + msg.price + ',', '');
        $.jGrowl("Удалено!");
        if (basket == '') {
            $('#clearBasket').triggerHandler('click');
            history.back();
        }
    } else {
        $.jGrowl("Нет такого товара в корзине!");
        return false;
    }
    
           
    basketArray = basket.split(",");// Находим все товары
    for(var i=0; i<basketArray.length-1;i++) {
        goodsId = basketArray[i].split(":"); // Находим id товара, цену и количество
        totalCountGoods+=parseInt(goodsId[1]);
        totalprice+=parseInt(goodsId[1])*parseInt(goodsId[2]);
    }

    $('#totalGoods').text(totalCountGoods);
    $('#totalPrice').text(totalprice);
    setCookie("totalPrice", totalprice, {path: "/"});
    setCookie("basket", basket, {path: "/"});
    
    return false;
}

function loadMsgCart(ids, colls, prices, price) {    
    var cart='';
    
    for (i=0; i<ids.length; i++)
        cart = cart + "id №" + (i + 1) + " - " + ids[i] + ', количество - ' + colls[i] + ', цена - ' + prices[i] + '; ';
    
    $('#message').val(cart + ' | Итоговая цена: ' + price);   
}

function loadShop(data, selector, ids, price) {  
    var cart=[];
    
    $(data).each(function() {
        for (i=0; i<ids.length; i++)
            if (ids[i]==$(this).find('Id').text()) {
                cart.push($(this));
            }
    });
    
    $(cart).each(function() {
        $(selector + ' table').append(
            '<tr>' +
                '<td><img src="' + $(this).find('Image').text() + '"></td>' +
                '<td>' + $(this).find('Title').text() + '</td>' +
                '<td align="center"><input type="text" value="1" style="width: 20px; text-align: right"></td>' +
                '<td align="right">' + $(this).find('Price').text() + '</td>' +
                '<td align="center"><a id="good-' + $(this).find('Id').text() + '-' + $(this).find('Price').text() + '" href="#" class="deltocart"><img src="images/remove_x.gif"><br>Убрать</a></td>' +
            '</tr>'
        );
    });
    
    if (cart.length == 0) {
        $(selector).empty();
        $(selector).append(
            '<h3 align="left">Корзина пуста</h3>'
        );
        return false;
    }
    $(selector + ' table').append(
        '<tr>' +
            '<td align="right" style="background:#ddd; font-weight:bold">Итого</td>' +
            '<td align="right" style="background:#ddd; font-weight:bold">' + price + ' руб.</td>' +
        '</tr>'
    );
}

function loadCategories(data, selector) {     
    var counts=0, s=0;

    $(data).each(function () {
        if (s==3) {
            s==0;
            $(selector).append(
                '<div class="product_box no_margin_right">' +
                '<a href="products.html' + $(this).attr('hash') + '"><img src="' + $(this).attr('image') + '"></img></a>' +
                '<h3>' + $(this).attr('title') + '</h3>' +
                '</div>'
            );
            
            if (counts != data.length)
                $(selector).append('<div class="cleaner"></div>');
        }
        else {       
            $(selector).append(
                '<div class="product_box">' +
                '<a href="products.html' + $(this).attr('hash') + '"><img src="' + $(this).attr('image') + '"></img></a>' +
                '<h3>' + $(this).attr('title') + '</h3>' +
                '</div>'
            );
        }
        
        counts++;
    });
}

function loadBestBar(data, selector) {    
    var s=0;
    $(data).each(function(){
        if (s==4)
            return false;
        $(selector + ' .sidebar_box:last .content').append(
            '<div class="bs_box">' +
            '<a href="#"><img src="' + $(this).find('ImageBest').text() + '"></a>' +
            '<h4><a href="productdetail.html' + $(this).find('Hash').text() + '" id="id-' + $(this).find('Id').text() + '" class="best">' + $(this).find('Title').text() + '</a></h4>' +
            '<p class="price">' + $(this).find('Price').text() + ' руб.</p>' +
            '<div class="cleaner"></div>' +
            '</div>'
        );
        ++s;
    }); 
}


function loadSearch(data, selector, value) { 
    var counts=0, s=0, flag=0;

    if (value == "") {
        $(selector).append('Товары, соответствующие данному запросу, не найдены.');
        return false;
    }
        
    $(data).each(function () {
        if (($(this).find('Title').text().toLowerCase().indexOf(value.toLowerCase().substr(0, 3))!=-1) ||  (value.toLowerCase().indexOf($(this).find('Title').text().toLowerCase().substr(0, 3))!=-1)) {
            if (flag == 0)
                flag=1;
            s++;
        
            if (s==3) {
                s==0;
                $(selector).append(
                    '<div class="product_box no_margin_right">' +
                    '<h3>' + $(this).find('Title').text() + '</h3>' +
                    '<a href="productdetail.html' + $(this).find('Hash').text() + '"><img src="' + $(this).find('Image').text() + '"></a>' +
                    '<p>' + $(this).find('Description').text() + '</p>' +
                    '<p class="product_price">' + $(this).find('Price').text() + ' руб.</p>' +
                    '<a id="good-' + $(this).find('Id').text() + '-' + $(this).find('Price').text() + '" href="#" class="addtocart"></a>' +
                    '<a href="productdetail.html' + $(this).find('Hash').text() + '" id="id-' + $(this).find('Id').text() + '" class="detail"></a></div>'
                );
            
                if (counts != data.length)
                    $(selector).append('<div class="cleaner"></div>');
            }
            else {       
                $(selector).append(
                    '<div class="product_box">' +
                    '<h3>' + $(this).find('Title').text() + '</h3>' +
                    '<a href="productdetail.html' + $(this).find('Hash').text() + '"><img src="' + $(this).find('Image').text() + '"></a>' +
                    '<p>' + $(this).find('Description').text() + '</p>' +
                    '<p class="product_price">' + $(this).find('Price').text() + ' руб.</p>' +
                    '<a id="good-' + $(this).find('Id').text() + '-' + $(this).find('Price').text() + '" href="#" class="addtocart"></a>' +
                    '<a href="productdetail.html' + $(this).find('Hash').text() + '" id="id-' + $(this).find('Id').text() + '" class="detail"></a>' + 
                    '</div>' 
                );
            }
        
            counts++;
        }
    });
    
    if (flag == 0)
        $(selector).append('Товары, соответствующие данному запросу, не найдены.');
}


function loadProducts(data, selector, n) {
    n = n || 0; 
    var counts=0, s=0;

    $(data).each(function () {
        s++;
        
        if ((counts==n) && (n!=0))
            return false;
        if (s==3) {
            s==0;
            $(selector).append(
                '<div class="product_box no_margin_right">' +
                '<h3>' + $(this).find('Title').text() + '</h3>' +
                '<a href="productdetail.html' + $(this).find('Hash').text() + '"><img src="' + $(this).find('Image').text() + '"></a>' +
                '<p>' + $(this).find('Description').text() + '</p>' +
                '<p class="product_price">' + $(this).find('Price').text() + ' руб.</p>' +
                '<a id="good-' + $(this).find('Id').text() + '-' + $(this).find('Price').text() + '" href="#" class="addtocart"></a>' +
                '<a href="productdetail.html' + $(this).find('Hash').text() + '" id="id-' + $(this).find('Id').text() + '" class="detail"></a></div>'
            );
            
            if (counts != n - 1)
                $(selector).append('<div class="cleaner"></div>');
        }
        else {       
            $(selector).append(
                '<div class="product_box">' +
                '<h3>' + $(this).find('Title').text() + '</h3>' +
                '<a href="productdetail.html' + $(this).find('Hash').text() + '"><img src="' + $(this).find('Image').text() + '"></a>' +
                '<p>' + $(this).find('Description').text() + '</p>' +
                '<p class="product_price">' + $(this).find('Price').text() + ' руб.</p>' +
                '<a id="good-' + $(this).find('Id').text() + '-' + $(this).find('Price').text() + '" href="#" class="addtocart"></a>' +
                '<a href="productdetail.html' + $(this).find('Hash').text() + '" id="id-' + $(this).find('Id').text() + '" class="detail"></a>' + 
                '</div>' 
            );
        }
        
        counts++;
    });
}

function loadCategoriesBar(data, selector) {    
    $(data).each(function(){
        $(selector).append(
            '<li><a href="products.html' + $(this).attr('hash') + '">' + $(this).attr('title') + '</a></li>'
        );           
    }); 
}

function loadDetail(data, selector, id) {
    var product;
    $(data).each(function(){
        if ($(this).find('Id').text() == id) {
            $(selector).append(
                '<div class="content_half float_l">' +
                    '<a rel="lightbox[portfolio]" href="' + $(this).find('Image').text() + '"><img src="' + $(this).find('Image').text() + '" alt="image"></a>' +
                '</div>' +
                '<div class="content_half float_r">' +
                    '<table>' +
                        '<tr>' +
                            '<td width="160">Цена:</td>' +
                            '<td>' + $(this).find('Price').text() + ' руб.</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Доступность:</td>' +
                            '<td>' + $(this).find('Access').text() + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Модель:</td>' +
                            '<td>' + $(this).find('Model').text() + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Производство:</td>' +
                            '<td>' + $(this).find('Produce').text() + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Количество:</td>' +
                            '<td><input type="text" value="1" style="width: 20px; text-align: right"></td>' +
                        '</tr>' +
                    '</table>' +
        
                    '<div class="cleaner h20"></div>' +

                    '<a href="#" class="addtocart"></a>' + 
                '</div>' +
   
                '<div class="cleaner h30"></div>' +
    
                '<h5>Описание товара</h5>' +
                '<p id="description">' + $(this).find('Description').text() + '</p>' +	
            
                '<div class="cleaner h50"></div>' +
            
                '<h3>Другие товары</h3>' +
                '<div id="similar"></div>' 
            ); 
            
            return false;
        }            
    });
}

$(document).ready(function(){         
    // Загрузка товаров
    var loadData;
    
    $.ajax({
        type: "GET",
        url: "products.xml",
        dataType: "xml",
        success: function(xml){
            loadData = xml;
            loadCategoriesBar($(loadData).find("Category"), '.sidebar_list'); 
            loadBestBar($(loadData).find("Product"), '#sidebar'); 
            $('.sidebar_list li:first').addClass('first');
            $('.sidebar_list li:last').addClass('last');
        }
    });

    // Корзина 
    msg = new Array();
    var basket = '';
	var totalprice = 0;
	var totalCountGoods = 0;

    if (!getCookie('basket')) {setCookie('basket', '', {path: '/'});}
    
    basket = decodeURI(getCookie('basket'));
	basketArray = basket.split(',');// Находим все товары
	
    for(var i=0; i<basketArray.length-1;i++) {
		goodsId = basketArray[i].split(':'); // Находим id товара, цену и количество
		totalCountGoods+=parseInt(goodsId[1]);
		totalprice+=parseInt(goodsId[1])*parseInt(goodsId[2]);
	}
	
    if (totalprice > 0) {
        $('#basket table').css("margin-top", "13px");
        $('#basket table').css("margin-left", "8px");
		$('#clearBasket').show();
		$('#checkOut').show();
		$('.hPb').show();
		$('.hPe').hide();
	}
	
    if (!totalprice) {totalprice = 0;}
    
	$('#totalPrice').text(totalprice);
    $('#totalGoods').text(totalCountGoods);
    
    $('#clearBasket').click(function() {
        setCookie("totalPrice", '', {path: "/"});
        setCookie("basket", '', {path: "/"});
        $('#totalPrice').text('0');
        $('#totalGoods').text('0');
        $('#basket table').css("margin-top", "20px");
        $('#basket table').css("margin-left", "17px");
        $('.hPb').hide();
        $('.hPe').show();
        $(this).hide();
        $('#checkOut').hide();
        $.jGrowl("Корзина очищена!");	
        
        return false;
    });
    
    $(document).keydown(function(e){
        if (e.keyCode == 13) {
            document.getElementById("searchbutton").focus();
        }
    });
    
    // Основной код   
    $('#top_nav ul li a').bind('data', function(e){
        $('.selected').removeClass('selected');
        $(this).addClass('selected'); 
        ref = $(this).attr('href');
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            dataType: "html",
            success: function(html){
                $('.float_r').empty();
                $('.float_r').append(html);
                if (ref == 'main.html') {
                    loadProducts($(loadData).find("Product"), '.float_r', 3);
                    $('#slider').nivoSlider();   
                }
                if (ref == 'products.html') {
                    loadCategories($(loadData).find("Category"), '.float_r');  
                }
                if (ref == 'checkout.html') {
                    $('#pricemail').text($('#totalPrice').text());
                }
            }
        });
        $('title').text($(this).text() + ' (Enter+)');
    });
    $('#top_nav ul li a').click(function(e){    
        e.preventDefault();
        $(this).triggerHandler('data');
        
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));  
    });
    
    var yaproFieldTrim = false;
    $('.send').live("click", function(e){
        e.preventDefault();
        yaproFieldTrim = true;// включаем автоматическое применение функции trim
        var error = "";
        error += $('#form').yaproField("name", "must", "Введите имя");
        error += $('#form').yaproField("email", {"m":true, "v":"e"}, "Введите E-mail правильно");
        error += $('#form').yaproField("subject", "must", "Введите название темы");
        error += $('#form').yaproField("message", "must", "Введите сообщение");
        yaproFieldTrim = false;// отменяем автоматическое применение функции trim
        if (error != "") {
            srollToFirstError();
            return false;
        }
        ajax();
        return false;
    });
    
    $('.sendCart').live("click", function(e){
        e.preventDefault();
        yaproFieldTrim = true;// включаем автоматическое применение функции trim
        var error = "";
        error += $('#checkin').yaproField("name", {"m":true, "v":"w"}, "Введите имя правильно");
        error += $('#checkin').yaproField("address", {"m":false, "v":"x"}, "Введите адрес");
        error += $('#checkin').yaproField("email", {"m":true, "v":"e"}, "Введите E-mail правильно");
        error += $('#checkin').yaproField("number", {"m":true, "v":"p"}, "Введите телефон правильно");
        yaproFieldTrim = false;// отменяем автоматическое применение функции trim
        if (error != "") {
            srollToFirstError();
            return false;
        }
        
        var products=[];
        var colls=[];
        var prices=[];
        var totalPrice = decodeURI(getCookie("totalPrice"));
                
        goodId = 0;
        basket = decodeURI(getCookie("basket"));
        basketArray = basket.split(",");
        for(var i=0; i<basketArray.length-1; ++i) {
            goodsId = basketArray[i].split(":");
            products.push(goodsId[0]); 
            colls.push(goodsId[1]);
            prices.push(goodsId[2]);
        }
        ajaxs(products, colls, prices, totalPrice);
        return false;
    });
    
    $('#report a').live('data', function(e){
      $('#top_nav ul li a[href="checkout.html"]').trigger('data');
      return false;
    });
    $('#report a').live('click', function(e){    
        e.preventDefault();
        $(this).trigger('data');
        
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));  
        return false;
    });
    
    $('a[href^="products.html#"]').live('data', function(e){
        $('.selected').removeClass('selected');
        $('#top_nav ul li a[href="products.html"]').addClass('selected');
        ref = $(this).attr('href');
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            dataType: "html",
            success: function(html){
                $('.float_r').empty();
                $('.float_r').append(html);
                loadProducts($(loadData).find("Category[hash='" + ref.substr(13) + "'] Product"), '.float_r');  
            }
        });
        $('title').text($(this).text() + ' (Enter+)');
        return false;
    });
    $('a[href^="products.html#"]').live('click', function(e){    
        e.preventDefault();
        $(this).trigger('data');
        
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));  
        return false;
    });
    
    $('#templatemo_footer p a').bind('data', function(e){
        $('#top_nav ul li :contains("' + $(this).text() + '")').triggerHandler('data');
        window.scrollTo(0,0);
    });
    $('#templatemo_footer p a').click(function(e){
        e.preventDefault();
        $(this).triggerHandler('data');
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));  
    });
    
    $('#site_title a').bind('data', function(e){
        $('#top_nav ul :first a').triggerHandler('data');
    });
    $('#site_title a').click(function(e){
        e.preventDefault();
        $(this).triggerHandler('data');
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));        
    });
    
    $('#searchbutton').bind('data', function(e){
        $('.selected').removeClass('selected'); 
        $.ajax({
            type: "GET",
            url: 'search.html',
            dataType: "html",
            success: function(html){
                $('.float_r').empty();
                $('.float_r').append(html);
                loadSearch($(loadData).find("Product"), '.float_r', searchInput);  
            }
        });
        $('title').text($(this).attr('title') + ' (Enter+)');
    });
    $('#searchbutton').click(function(e){
        e.preventDefault();
        $(this).triggerHandler('data');
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState({text: searchInput}, null, 'search.html');        
    });
       
    $('#checkOut').bind('data', function(e){
        $('.selected').removeClass('selected'); 
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            dataType: "html",
            success: function(html){
                $('.float_r').empty();
                $('.float_r').append(html);
                
                var products=[];
                var totalPrice = decodeURI(getCookie("totalPrice"));
                
                goodId = 0;
                basket = decodeURI(getCookie("basket"));
                basketArray = basket.split(",");
                for(var i=0; i<basketArray.length-1; ++i) {
                    goodsId = basketArray[i].split(":");
                    products.push(goodsId[0]); 
                }
                loadShop($(loadData).find("Product"), '.float_r', products, totalPrice);  
            }
        });
        $('title').text($(this).attr('title') + ' (Enter+)');
    });
    $('#checkOut').click(function(e){
        e.preventDefault();
        $(this).triggerHandler('data');
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));        
    });
    
    $('.best').live('data', function(e){
        $('.selected').removeClass('selected');
        data = $(this).attr('id').split('-');
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            dataType: "html",
            success: function(html){
                $('.float_r').empty();
                $('.float_r').append(html);
                loadDetail($(loadData).find("Product"), '.float_r', data[1]); 
                loadProducts($(loadData).find("Product"), '#similar', 3); 
            }
        });
        window.scrollTo(0,0);
        return false;
    });
    $('.best').live('click', function(e){
        e.preventDefault();
        $(this).trigger('data');
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));
        return false;
    });
    
    
    $('a[href^="productdetail.html"]').live('data', function(e){
        $('.selected').removeClass('selected');
        data = $(this).attr('id').split('-');
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            dataType: "html",
            success: function(html){
                $('.float_r').empty();
                $('.float_r').append(html);
                loadDetail($(loadData).find("Product"), '.float_r', data[1]); 
                loadProducts($(loadData).find("Product"), '#similar', 3); 
            }
        });
        window.scrollTo(0,0);
        return false;
    });
    $('a[href^="productdetail.html"]').live('click', function(e){
        e.preventDefault();
        $(this).trigger('data');
        a = document.location.pathname.split('/');
        if (a.slice(-1) != $(this).attr('href'))
            history.pushState(null, null, $(this).attr('href'));
        return false;
    });
    
    $('.addtocart').live('click', function(e) {
        e.preventDefault();
        if ($('#basket table').css("margin-top") == "20px") {
            $('#basket table').css("margin-top", "13px");
            $('#basket table').css("margin-left", "8px");
        }
        data = $(this).attr('id').split('-');
        addCart(data[1], data[2], 1, false);
        return false;
    });
    
    $('.deltocart').live('click', function(e) {
        e.preventDefault();
        data = $(this).attr('id').split('-');
        addCart(data[1], data[2], 1, true);
        $(this).parent().parent().remove();
        return false;
    });
    
    var a = document.location.pathname.split('/');
    var b = document.location.hash.substr(1);
    if (b == "") {
        history.replaceState(null, null, "main.html");
        a = document.location.pathname.split('/');
        $("a[href='" + a.slice(-1) + "']").triggerHandler('data'); 
    }
    else {
        history.replaceState(null, null, b);
        $("a[href='" + b + "']").triggerHandler('data'); 
    }
    
    $(window).resize(function(){ 
        var shift = ($(window).width() - $('#templatemo_wrapper').width());
        if (shift <= 0)
            shift = 0;
        else
            shift = shift / 2;
        $('#templatemo_body_wrapper').width($('#templatemo_wrapper').width() + 2 * shift);
        $('#templatemo_wrapper').attr({'margin-right': shift, 'margin-left': shift});
    });
		
    $(window).bind('popstate', function(e){
        a = document.location.pathname.split('/');
        if (a.slice(-1) != 'search.html') {
            b = document.location.hash;
            if (b == "")
                $("a[href='"+a.slice(-1)+"']").triggerHandler('data');
            else
                $("a[href='"+a.slice(-1)+b+"']").trigger('data');
        }
        if (a.slice(-1) == 'search.html') {
            searchInput = history.state.text;
            $("#searchbutton").triggerHandler('data');
        }
    });
}); 