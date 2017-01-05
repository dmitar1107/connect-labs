<!doctype html>
<html>

  <head>
	<script type="text/javascript">
	  var _kmq = _kmq || [];
	  var _kmk = _kmk || '75144ed6d7d6ed6afe5d5f4aab98bee018ee0eb7';
	  function _kms(u){
	    setTimeout(function(){
	      var d = document, f = d.getElementsByTagName('script')[0],
	      s = d.createElement('script');
	      s.type = 'text/javascript'; s.async = true; s.src = u;
	      f.parentNode.insertBefore(s, f);
	    }, 1);
	  }
	  _kms('//i.kissmetrics.com/i.js');
	  _kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');


	window.addEventListener('orientationchange', function() {
		if (window.orientation == 0 || window.orientation == 180) {
			// Reset scroll position if in portrait mode.
			window.scrollTo(0, 0);
		}
	}, false);

	</script>
	<meta charset="utf-8">
      <meta name="description" content="In an age when the number of people we interact with is increasing by orders of magnitude, Connect is focused on helping you make the most of your relationships. Built for Humans.  Map your connections.">
        <meta property="og:title" content="Connect Labs: Map Your Friends" /> 
        <meta property="og:image" content="images/fb-connect-logo-128.png" /> 
        <meta property="og:description" content="In an age when the number of people we interact with is increasing by orders of magnitude, Connect is focused on helping you make the most of your relationships.  Built for Humans.  Map your connections." /> 
		<meta name="viewport" content="width=device-width-100, initial-scale=1, maximum-scale=1">
	<title>Connect Labs: Map Your Friends</title>
  

	<link rel="icon" type="image/png" href="favicon.ico">
        <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link href="css/style.css?v=2" rel="stylesheet">
        <script type="text/javascript">
          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-36013074-1']);
          _gaq.push(['_setDomainName', 'connect.com']);
          _gaq.push(['_trackPageview']);

          (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          })();

        </script>
        <!--[if gte IE 8]>
        <style>
        #infowindow{
          background: url('../images/transparent-black.png');
          background-repeat: repeat;
        }
        .navbar-inner {
          height: 47px;
          background-image: url('../images/top-green-strip.png');
          background-repeat: repeat-x;
          overflow: hidden;
          border:0;
        } 
        #map-controls {
          background: url('../images/transparent-black.png');
          background-repeat: repeat;
        }
        </style>
        <![endif]-->
  </head>

  <body>
    <div class="navbar navbar-fluid-top">
      <div class="navbar-inner">
        <div class="container">
          <img class="icon toggleDashboardPanel" src="images/logo-connect-labs.png" style="position: absolute; top: 10px; left: 12px;" />
          <div id="navUtilities">
            <div id="nav-search-container">
              <span id="nb-si"></span>
              <input id="navbar-searchbox" type="text" class="typeahead" onclick="this.value=''" />
            </div>
            <div id="userLink"><span id="loggedInName"></span><span id='logout' class='logout'></span></div>
          </div>
        </div>
      </div>
    </div>
	<div id="flash"></div>

    <div id="map"></div>
    <div id="map-controls">
		<ul>
			<li class="locate"></li>
			<li class="satellite"></li>	
		<ul>
	</div>
    
    <!-- Active Filters -->
    <div id="active-filters">
      
      <div class="active-filters-count draggable"></div>
        <div class="active-filter-container">
          <ul>
            
          </ul>
        </div>
     
    </div>
    
    <!-- Modal -->
    <div id="signin-overlay" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
       <div class="helper-text fb-connect">
         <p class="welcome-message">
         Thank You! You will recieve an invite soon.<br/>&nbsp;<br/>
         In the meantime,would you like to see your Facebook friends on a map?<br/>&nbsp;<br/>Login With Facebook To Begin
         </p>
         <p class="message">
           See Your Friends on a Map<br/>Login With Facebook To Begin
         </p>
       </div>
       <div class="helper-text information" style="display:none;"></div>
       <div class="progress progress-success progress-striped active" style="display:none;">
          <div class="bar" id="loading-progress" style="width: 0%" data-percentage="0"></div>
        </div>
      </div>
      <div class="modal-body">
        
          <div class="visible fb-button" id="prodfb" href="javascript:void(0);"></div>
       
          <div class="welcome-form" style="display:none;">
			<form action="javascript:void(0);">
			  <input class="input input-large email" id="email-field" placeholder="E-mail" type="text">
			  <button id="submit-email"></button>
			</form>
            <div id="welcome-error"></div>
                                
           </div>
      </div>
      <div class="modal-footer">
         <span id="loading-image"><img src="images/loading.gif"></span>
        <p id="instructions"></p>
       
      </div>
      
    </div>


	<!-- 3rd Party Libraries -->
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="https://maps.google.com/maps/api/js?libraries=places&sensor=false" type="text/javascript"></script>
    <script src="js/underscore.min.js" type="text/javascript"></script>
    <script src="bootstrap/js/bootstrap.js" type="text/javascript"></script>
    <script src="js/jquery-ui-1.9.2.custom.min.js" type="text/javascript"></script>
	<!-- Application Files -->
    <script src="templates/infowindow.js?v=2" type="text/javascript"></script>
    <script src="templates/filters-horizontal.js?v=2" type="text/javascript"></script>
    <script src="js/data.js?v=2" type="text/javascript"></script>
    <script src="js/infowindow.js?v=2" type="text/javascript"></script>
    <script src="js/cluster.js?v=2" type="text/javascript"></script>
    <script src="js/map.js?v=2" type="text/javascript"></script>
    <script src="js/search.js?v=2" type="text/javascript"></script>
    <script src="js/connect-helper.js?v=2?v=2" type="text/javascript"></script>
    <script src="js/connect-user.js?v=2" type="text/javascript"></script>
    <script src="js/connect-api.js?v=2" type="text/javascript"></script>
    <script src="js/connect-active-filters.js?v=2" type="text/javascript"></script>
    <script src="js/connect-filter.js?v=2" type="text/javascript"></script>
    <script src="js/connect-app.js?v=2" type="text/javascript"></script>
	<div id="fb-root"></div>
    <script>
      var connectInstance = new ConnectApp;
      connectInstance.map = new ConnectMap;
      window.fbAsyncInit = function() {
        FB.init({
/*          appId      : '331620510285601', */
          appId      : '446066968792606',
          status     : true, 
          cookie     : true,
          xfbml      : true,
          oauth      : true
        });
        connectInstance.initialize();
      };
      (function(d){
        var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        d.getElementsByTagName('head')[0].appendChild(js);
      }(document));
    </script>
	<script type="text/javascript">var _kiq = _kiq || [];</script>
  <script type="text/javascript">
    function addScript(path) {
      var js = document.createElement('script');
      js.setAttribute('type', 'text/javascript');
      js.src = path;
      js.setAttribute('async', 'true');
      document.body.appendChild(js);
    }
  </script>
<div id="getsat-widget-2552"></div>
    <script type="text/javascript" src="https://loader.engage.gsfn.us/loader.js"></script>
    <script type="text/javascript">
      if (typeof GSFN !== "undefined") { GSFN.loadWidget(2552,{"containerId":"getsat-widget-2552"}); }
    </script>	
  </body>
</html>


