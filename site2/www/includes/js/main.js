/*********************************** Global variables ************************/

// Calculating scroll (to bottom scroll) variable
var scrollHeight = 0;

// Document element variable
var docElement;

// Main section 
var main;
var mainContent;

// Navigation references
var navRefs;
var nNavRefs;

// XMLHttpRequest initialization
var xhr = new XMLHttpRequest();

// Cycle parametres
var i;

// Self object
var self;

// Scroll arrow; header, nav, wrapper offsets for resizing
var scrollArrow;
var scrollArrowParent;
var header;
var nav;
var wrapper;
var offsetMain;
var wrapperOffset;

// Logo
var logo;

// Title
var title = 'ЗаборМос - заборы по разумным ценам';

// Highslide
var media = {slideshowGroup: 'media'};
var project = {slideshowGroup: 'project'};
var g1 = {slideshowGroup: 'g1'};
var g4 = {slideshowGroup: 'g4'};
var w1 = {slideshowGroup: 'w1'};

hs.dimmingOpacity = 0.8;
hs.transitions = ['expand', 'crossfade'];
hs.fadeInOut = true;
hs.maxHeight = 500;
hs.align = 'center';
      
hs.registerOverlay({
    html: '<div class="closebutton" onclick="return hs.close(this)" title="Закрыть"></div>',
    position: 'top right',
    fade: 2 
});  
      
hs.addSlideshow({
    slideshowGroup: ['media', 'project', 'g1', 'g4', 'w1'],
    interval: 5000,
    repeat: false,
    useControls: true,
    fixedControls: 'fit',
    overlayOptions: {
        opacity: 0.75,
        position: 'bottom center',
        hideOnMouseOut: true
    }
});

// Display size
var screenMd = 750;


/******************************* Application *********************************/

var application = {
    
    // Initialization function
    
    initialize: function()
    {
        /********** Variables initialization *********/
        
        // Standard self object
        self = this;
        
        // Document element
        docElement = document.documentElement;
                                     
        // Main section initialization
        main = document.querySelector('.main'); 
        mainContent = main.querySelector('.main__content'); 
        offsetMain = self.getOffsetRect(main);

        // Wrapper
        wrapper = document.querySelector('.wrapper');
        
        // Offset wrapper
        wrapperOffset = self.getOffsetRect(wrapper);

        // Scroll button and its parent
        scrollArrow = document.querySelector('.scroll i');
        scrollArrowParent = scrollArrow.parentNode;
        
        // Navigation bar
        nav = document.querySelector('.nav');
        
        // Navigation references initialization
        navRefs = document.querySelectorAll('.nav > a');
        nNavRefs = navRefs.length;
        
        // Header
        header = document.querySelector('.header');
        
        // Logo initialization
        logo = document.querySelector('.logo');
        
        var footerRefs = document.querySelectorAll('.footer i');
        var nFooterRefs = footerRefs.length;
 
        
        /*********************** Handlers *********************/
        
        // Navigation panel
        function navClick(e) 
        {          
            if (!this.classList.contains('active')) {
                this.flag = true;
                self.openMainText(this);
            }
            
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Aside panel
        function asideClick(e) 
        {            
            if (!this.classList.contains('active')) {
                this.flag = true;
                self.openSubMainText(this);         
            }
            
            e.preventDefault();
            e.stopPropagation();   
        } 
        
        // Aside button click 
        function asideButtonClick(e)
        {
            var windowWidth = window.innerWidth;
            var aside = this.parentNode;
            var asideNav = aside.querySelector('.aside__nav');
            
            if (asideNav.style.display == 'block') {
                this.style.backgroundImage = 'url(../includes/img/elements/cl-menu.png)';
                this.style.marginLeft = '-2px';
                this.style.width = '15px';
                
                asideNav.style.display = 'none';
                
                aside.style.width = 'auto';
            }
            else {
                this.style.backgroundImage = 'url(../includes/img/elements/hv-menu.png)';
                this.style.marginLeft = '0';
                this.style.width = '100%';
            
                asideNav.style.display = 'block';
                
                aside.style.width = '100%';
            }
            
            e.preventDefault();
            e.stopPropagation();   
        }
        
        // Footer buttons
        function footerClick(e) 
        {      
            var windowWidth = window.innerWidth;
            
            if (windowWidth <= screenMd) {
                var p = this.parentNode.querySelector('p');
                if (p.style.display == 'block') {
                    self.removeClass(this,'active');
                    p.style.display = 'none';   
                }
                else {
                    self.addClass(this,'active');
                    p.style.display = 'block';
                }
            }
            
            e.preventDefault();
            e.stopPropagation();   
        } 
        
        // Scrolling function for Highslide images
        function hsClickScroll()
        {
            var imageOffset = self.getOffsetRect(this).top; 
            var clientOffset = (docElement.clientHeight-hs.maxHeight) / 2;
            window.scrollTo(0,imageOffset-clientOffset);
        }   
        
        // Scrolling button
        function scrollBy(e)
        {
            self.scrollBy();
            
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Updating state
        function updateState() 
        {
            if (history.state === null) {
                routing();
                return false;
            }
            self.updateState(history.state);
        }
        
        // Scrolling
        function scrolling() 
        {     
            var scrollTop = window.pageYOffset || docElement.scrollTop;
            
            // Navigation and aside-navigation unfixed/fixed position
            var aside = document.querySelector('.aside');
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            
            // Footer button closed
            var p;
            if (windowWidth <= screenMd)
                for (i = 0; i < nFooterRefs; ++i) {
                    p = footerRefs[i].parentNode.querySelector('p');

                    if (p.style.display == 'block') {
                        p.style.display = 'none';
                        footerRefs[i].style.borderColor = '#64c639';
                        footerRefs[i].style.color = '#64c639';
                    }
                }
            
            if (aside && windowWidth > screenMd && scrollTop >= offsetMain.top)
                aside.style.position = 'fixed';
            else if (aside && windowWidth > screenMd && aside.style.position == 'fixed')
                aside.style.position = 'static';
            else if (aside && windowWidth <= screenMd && aside.style.position == 'static')
                aside.style.position = 'fixed';

            // Style scroll button changing
            if (scrollTop < offsetMain.top) {     
                if (scrollArrowParent.classList.contains('scrollBy') && scrollTop == 0) {
                    self.removeClass(scrollArrowParent, 'scrollBy');
                    self.removeClass(scrollArrow,'fa-angle-double-up');
                    self.addClass(scrollArrow,'fa-angle-double-down');
                    
                    scrollArrowParent.style.display = 'block';
                }
                else 
                    scrollArrowParent.style.display = 'none';
            }
            else if (scrollTop > offsetMain.top) {
                scrollArrowParent.style.display = 'block';
                
                self.removeClass(scrollArrow,'fa-angle-double-down');
                self.addClass(scrollArrow,'fa-angle-double-up');
                
                scrollHeight = scrollTop;
            }
        }    
        
        // Resizing 
        function resizing(){
            var p;
            var windowWidth = window.innerWidth;
            if (windowWidth > screenMd)
                for (i = 0; i < nFooterRefs; ++i) {
                    p = footerRefs[i].parentNode.querySelector('p');
                    
                    if (footerRefs[i].style.color != '#64c639') {
                        footerRefs[i].style.borderColor = '#64c639';
                        footerRefs[i].style.color = '#64c639';
                    }
                    
                    if (p.style.display == 'none') {
                        p.style.display = 'block';
                    }
                }
            else
                for (i = 0; i < nFooterRefs; ++i) {
                    p = footerRefs[i].parentNode.querySelector('p');
                    
                    if (footerRefs[i].style.color != '#64c639') {
                        footerRefs[i].style.borderColor = '#64c639';
                        footerRefs[i].style.color = '#64c639';
                    }
                    
                    if (p.style.display == 'block') {
                        p.style.display = 'none';
                    }
                }
        }
        
        // Table collapsing
        function tableCollapse(e) 
        {
            self.tableCollapse(this);
            
            e.preventDefault();
            e.stopPropagation();
        }
 
        // Routing 
        function routing() 
        {
            var hash = document.location.hash;
            var hashList = hash.slice(3).split('/');
            var nHashList = hashList.length;
            var startHrefIndex = navRefs[0].href.indexOf('#') + 3;
            var link, linkTitle;
            
            var search = document.location.search;        
            if (!search) {
                if (hash == "" || hash == "#!/index") {
                    if (hash == "")
                        link = document.location.href+'#!/index';
                    else
                        link = document.location.href;
                    linkTitle = title;
                    history.replaceState({title:linkTitle, href:link}, null, link);
                }
                else {
                    link = document.location.href;

                    for (i = 0; i < nNavRefs; ++i)
                        if (navRefs[i].href.slice(startHrefIndex) == hashList[0]) {
                            linkTitle = navRefs[i].innerText;
                            startHrefIndex = navRefs[i].href.length + 1; 
                            break;
                        }
                    
                    asideRefs = link.slice(startHrefIndex);

                    if (asideRefs == 'fences')
                        linkTitle = linkTitle + ' (заборы)';
                    else if (asideRefs == 'gates') {
                        linkTitle = linkTitle + ' (ворота)';
                    }
                    else if (asideRefs == 'wickets')
                        linkTitle = linkTitle + ' (калитки)';
                    
                    history.replaceState({title:linkTitle, href:link}, null, link);
                }
                
                self.updateState(history.state);
            }
            else if (search.indexOf('?_escaped_fragment_=') == 0) {
                var page, pageParts, nPageParts;
                var locHref = document.location.href;
                var startSearchIndex = locHref.indexOf('?_escaped_fragment_=');
                startHrefIndex = search.indexOf('=') + 2;
                pageParts = search.slice(startHrefIndex).split('/');
                nPageParts = pageParts.length;       
                if (pageParts[0])
                    page = 'pages/' + pageParts[0] + '/' + pageParts[0] + '.html';               
                else
                    page = 'pages/index/index.html';
                    
                
                document.location.href = locHref.slice(0,startSearchIndex) + page;
            }
                
        }
        
        
        /********************* Listeners and actions ********************/    
        
        for (i = 0; i < nNavRefs; ++i)
            navRefs[i].addEventListener('click', navClick, false);  

        for (i = 0; i < nFooterRefs; ++i)
            footerRefs[i].addEventListener('click', footerClick, false); 
        
        scrollArrow.addEventListener('click', scrollBy, false);
        
        document.querySelector('.logo').addEventListener('click', navClick, false);
        
        $(main).on('click', '.aside__nav > a', asideClick);
        
        $(main).on('click', '.aside__button', asideButtonClick);
        
        $(main).on('click', '.table-collapse', tableCollapse);
        
        $(main).on('click', '.highslide', hsClickScroll);
        
        window.addEventListener('popstate', updateState, false);
        
        window.addEventListener('scroll', scrolling, false);
        
        window.addEventListener('resize', resizing, false);
        
        // Routing
        routing();
    },
    
    
    /************************** Routing functions **************************/
    
    // To load text after navigation bar's button was clicked
    openMainText: function(e) 
    {
        var startHrefIndex = e.href.indexOf('#') + 3;
        var ref = e.href.slice(startHrefIndex);
        
        xhr.open('GET', '/pages/'+ref+'/'+ref+'.html', true);
        xhr.onload = function() 
        {
            if (xhr.status == 200 || xhr.status == 304) {
                this.data = xhr.responseText;
                mainContent.innerHTML = this.data;
                               
                // Showing map
                if (ref == 'contacts')
                    self.showMap(1);
                else
                    self.showMap(0);
                
                // Navigation reference style
                if (ref == 'index') {                    
                    for (i = 0; i < navRefs.length; ++i)
                        if (navRefs[i].classList.contains('active')) {
                            self.removeClass(navRefs[i],'active');
                            break;
                        }
                }
                else {
                    active = e.parentNode.querySelector('.active');
                    if (active)
                        self.removeClass(active,'active');
                    self.addClass(e,'active');
                }
                
                // Scrolling
                window.scrollTo(0,0);
                self.removeClass(scrollArrowParent,'scrollBy');
                
                // Registration URL if it did not yet
                if (e.flag === true)                    
                    self.registerURL(e,'main');   
                // Loading aside text when popstate event was fired
                else if (e.asideHref) {
                    asideRefs = document.querySelectorAll('.aside__nav a');
                    nAsideRefs = asideRefs.length;

                    var updAsideRef;
                    startHrefIndex = asideRefs[0].href.indexOf('#') + 3;
                    for (i = 0; i < nAsideRefs; ++i)
                        if (asideRefs[i].href.slice(startHrefIndex).split('/')[1] == e.asideHref) {
                            updAsideRef = asideRefs[i];
                            break;
                        }
                            
                    updAsideRef.flag = false;
                    self.openSubMainText(updAsideRef);
                }
            } 
            else
                alert(xhr.status+': '+xhr.statusText); 
        }
        xhr.send();
    },

    // To load text after aside bar's button was clicked
    openSubMainText: function(e) 
    {
        var startHrefIndex = e.href.indexOf('#') + 3;
        var idAsideSection = '#' + e.href.slice(startHrefIndex).split('/')[1]; 
        var asideMain = document.querySelector(idAsideSection);   
        var active = e.parentNode.querySelector('.active');
        
        startHrefIndex = active.href.indexOf('#') + 3;
        var idAsideSectionActive = '#' + active.href.slice(startHrefIndex).split('/')[1]; 
        var asideMainActive = document.querySelector(idAsideSectionActive);
        
        this.addClass(asideMainActive,'hidden');
        this.removeClass(asideMain,'hidden');
        this.removeClass(active,'active');
        this.addClass(e,'active');

        if (e.flag)
            this.registerURL(e,'submain');
        
        // Scrolling to content
        var scrollOffset = self.getOffsetRect(document.querySelector(idAsideSection));
        window.scrollTo(scrollOffset.left, scrollOffset.top);
    },

    // Registration of URL if it has not yet   
    registerURL: function(e,type)
    {
        var ref = e.href;
        var hash = document.location.href;
        var link, linkTitle;
        
        if (type=='main') {
            var asideActive = document.querySelector('.aside__nav .active');
            
            if (asideActive)
                link = asideActive.href;
            else 
                link = ref;
            if (hash != link) {
                if (asideActive)
                    linkTitle = e.innerText + ' (' + asideActive.innerText + ')';   
                else
                    linkTitle = e.innerText ? e.innerText : title;
                history.pushState({title:linkTitle, href:link}, null, link);
                document.title = linkTitle;
            }
        }
        else if (type=='submain') {
            var navRefActive;
            for (i = 0; i < nNavRefs; ++i)
                if (navRefs[i].classList.contains('active'))
                    navRefActive = navRefs[i];
                
            link = ref;
            if (hash != link) {
                linkTitle = navRefActive.innerText + ' (' + e.innerText + ')';
                history.pushState({title:linkTitle, href:link}, null, link);
                document.title = linkTitle;
            }    
        }
    },

    // Update state by popstate, and new load
    updateState: function(state)
    {
        var startHrefIndex = state.href.indexOf('#') + 3;
        var refParts = state.href.slice(startHrefIndex).split('/');
        var nRefParts = refParts.length;
        document.title = state.title;
        
        var updNavRef;
        for (i = 0; i < nNavRefs; ++i)
            if (navRefs[i].href.slice(startHrefIndex) == refParts[0]) {
                updNavRef = navRefs[i];
                break;
            }

        if (logo.href.slice(startHrefIndex) == refParts[0])
            updNavRef = logo;
        
        if (updNavRef) {
            updNavRef.flag = false;
            if (nRefParts > 1)
                updNavRef.asideHref = refParts[1];
            self.openMainText(updNavRef);
        }
    },
    
    
    /************************** Content manipulations' functions *************************/
    
    // Collapsing of the tables
    tableCollapse: function(e) 
    {
        var trs = e.parentNode.parentNode.querySelectorAll('tr');
        var nTrs = trs.length;
        if (e.classList.contains('closed')) {
            this.removeClass(e,'closed');

            for(i = 0; i < nTrs; ++i) {
                trs[i].style.display = 'table-row';
            }
        }
        else {
            this.addClass(e,'closed');
            for(i = 1; i < nTrs; ++i)
                trs[i].style.display = 'none';
        }
    },

    // Scrolling button 
    scrollBy: function()
    {
        var self = this;
        var scrollTop = window.pageYOffset || docElement.scrollTop;
        
        if (scrollTop != 0) {
            self.addClass(scrollArrowParent,'scrollBy');
            window.scrollBy(0,-scrollHeight);
        }
        else
            window.scrollBy(0,scrollHeight);        
    },
    
    // Showing map
    showMap: function(flag)
    {   
        var map = document.querySelector('.map');
        
        if (flag)
            map.style.display = 'block';
        else if (map.style.display == 'block')
            map.style.display = 'none';
    },
      
       
    /************************* Utility functions ***********************/
    
    // Remove class function
    removeClass: function(obj, cls) 
    {
        var classes = obj.className.split(' ');
        var nClasses = classes.length;
        for (i = 0; i < nClasses; ++i)
            if (classes[i] == cls) {
                classes.splice(i, 1); 
                i--;
            }
        obj.className = classes.join(' ');
    },
    
    // Add class function
    addClass: function(obj, cls) 
    {
        var classes = obj.classList;
        if (!classes.contains(cls))
            obj.className = obj.className + ' ' + cls;
    },
    
    // Get offset for scrolling button
    getOffsetRect: function (obj) 
    {
        docElement = document.documentElement;
        
        var box = obj.getBoundingClientRect();

        var body = document.body;
        
        var scrollTop = window.pageYOffset || docElement.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElement.scrollLeft || body.scrollLeft;
        
        var clientTop = docElement.clientTop || body.clientTop || 0;
        var clientLeft = docElement.clientLeft || body.clientLeft || 0;
        
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        
        return {top: Math.round(top), left: Math.round(left)}
    }
}


/*** Main actions ***/

window.application = application;
document.addEventListener('DOMContentLoaded', application.initialize(), true);