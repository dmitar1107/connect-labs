var ConnectApp = function(){
  this.loadingMessageDiv=$('#signin-overlay #instructions');
}

ConnectApp.prototype.initialize = function(){
  var _this=this;
  this.loadAttempts = 0;
  this.progressIntervals = [];
  $('#signin-overlay').modal({
    backdrop: "static", 
    show: true
  });
  $(".fb-button").on("click", function(){
    _this.login()
  }).hide();
  this.api=new ConnectApi;
  this.loadingBar=$('#loading-progress');
  this.activeFilterContainer = new ConnectFilterContainer('#active-filters');
  if(ConnectHelper.isValidEmailAddress(this.emailProvided=ConnectHelper.getUrlParameter("email"))){
    $('.helper-text.fb-connect').addClass('welcome');
    this.api.submitNewSignup({email: this.emailProvided}, function(){
      if(_this.api.lastResponse.id && _this.api.lastResponse.id >0){
        _this.emailProvided_id = _this.api.lastResponse.id;
      }
    });
    $('.modal-body #email-field').val(this.emailProvided);
  }
  $('.toggleDashboardPanel').on('click', function(){
     _this.map.map.setZoom(3);
  });
  $(".locate").popover({placement:"top",title:"Current Location Toggle",content:"Zoom the map to your current location.  This requires that you enable location services when prompted.", trigger:"hover"});
  $(".satellite").popover({placement:"top",title:"Satellite Mode Toggle",content:"Toggle map view between satellite mode and standard view mode.", trigger:"hover"});
  
  this.checkStatus();
}

ConnectApp.prototype.checkStatus = function(){
  var _this=this;
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      _this.fbid = response.authResponse.userID;
      _this.accessToken = response.authResponse.accessToken;
      _this.api.logoutRequired({fb_id: _this.fbid},function(){
        if(_this.api.lastResponse.status=="logout"){
          _this.logout();
        }else{
          _this.initializeSession();
        }
      });
      
      
    } else {
      $(".fb-button").show();
    }
  });
}

ConnectApp.prototype.login = function(){
  var _this=this;
  FB.login(function(response) {
    if (response.status === 'connected') {
      _this.fbid = response.authResponse.userID;
      _this.accessToken = response.authResponse.accessToken;
      _this.initializeSession();
    }else{
      $(".fb-button").show();
    }
  }, {
    scope: 'user_checkins,friends_checkins,user_status,friends_status,user_location,friends_location,friends_about_me,friends_birthday,friends_education_history,friends_work_history,friends_groups,friends_relationships'
  });
}



ConnectApp.prototype.initializeSession = function(){
  var _this=this;
  this.loadAttempts++;
  $("#signin-overlay #loading-image").show();
  this.loadingMessageDiv.html("Importing your connections");
  this.hideFacebookScreen();
  _this.updateLoadingBar(_this.loadingBar, 850, 1);
  this.api.initializeSession({
    fb_id: this.fbid, 
    access_token: this.accessToken,
    email: this.emailProvided || null,
    signup_id: this.emailProvided_id || null
  }, function(){
    _this.user=new ConnectUser(_this.api.lastResponse);
    //Needs refactoring/optimization
    if(!(_this.user === 'undefined')){
      _this.user.getFriendCount();
      _this.loadingMessageDiv.html("Retrieving your friends");
      _this.appendUserNavSpan();
      _this.getUserConnections();
      clearInterval(_this.progress);
      _this.updateLoadingBar(_this.loadingBar, 50, 5);
        
    }else{
       _this.loadingMessageDiv.html("We experienced an error finding your information.  Please reload your page.");
    }
    
  },function(){
    
    if(_this.loadAttempts<=2){
      var pollAttempt = 0;
      _this.loadingMessageDiv.html("Geocoding friend data.  This may take up to a minute on your first visit");
         var pollingInterval=setInterval(function(){
           pollAttempt++;
           _this.api.pollUser({fb_id: _this.fbid},function(){
             if(_this.api.lastResponse.status=="complete"){
               clearInterval(pollingInterval);
               _this.initializeSession();
             }
           });
           if(pollAttempt==5){
             _this.loadingMessageDiv.html("Preparing data for filters");
           }else if(pollAttempt==10){
             _this.loadingMessageDiv.html("Optimizing data for fast loading");
           }
         }, 2000);
       }else{
         _this.loadingMessageDiv.html("We experienced an error loading your connections.  Please reload your page");
   
       }
    
  });
}

ConnectApp.prototype.getUserConnections = function(){
  var _this=this;
  this.api.getConnections({
    user_id: this.user.id
  }, function(){
    _this.loadingMessageDiv.html("Enjoy!");
    _this.user.connections=_this.api.lastResponse.connections;
    _this.user.connectionsIndex=_this.api.lastResponse.connectionsIndex;
    _this.map.initializeMarkers(_this.user.connections);
    _kmq.push(['record', 'Logged In With Facebook']);
    if(_this.user.email){
      
      
      
    }else{
      _this.showEmailForm();
    }
    initializeContactSearch();
    connectInstance.filters.initializeFilters();
    addScript("//s3.amazonaws.com/ki.js/45562/8_T.js");
    //_this.showFlashMessage(connectInstance.map.mappedPeople + " of your " + connectInstance.user.connections.length + " Facebook friends had geo data and were mapped.", 6000);	
  });
}
ConnectApp.prototype.updateConnectionsObjects = function(){
  var _this=this;
  this.api.getConnections({
    user_id: this.user.id
  }, function(){
    _this.user.connections=_this.api.lastResponse.connections;
    _this.user.connectionsIndex=_this.api.lastResponse.connectionsIndex;
    initializeContactSearch();
    connectInstance.filters.refreshFilters();
    addScript("//s3.amazonaws.com/ki.js/45562/8_T.js");
    //_this.showFlashMessage(connectInstance.map.mappedPeople + " of your " + connectInstance.user.connections.length + " Facebook friends had geo data and were mapped.", 6000);	
  });
}

ConnectApp.prototype.completeImport = function(){
 var _this=this;
  this.loadAttempts++;
  if(this.loadAttempts==1){
  this.filters.lazyLoaderUI('work');
  this.filters.lazyLoaderUI('school');
  this.filters.lazyLoaderUI('title');
  }
  this.api.initializeSession({
    fb_id: this.fbid, 
    access_token: this.accessToken,
    email: this.emailProvided || null,
    signup_id: this.emailProvided_id || null
  }, function(){
    _this.user=new ConnectUser(_this.api.lastResponse);
    //Needs refactoring/optimization
    if(!(_this.user === 'undefined')){
      _this.user.getFriendCount();
      _this.updateConnectionsObjects();     
    }else{
       _this.loadingMessageDiv.html("We experienced an error finding your information.  Please reload your page.");
    }
    
  },function(){
    
    if(_this.loadAttempts<=2){
      var pollAttempt = 0;
      var pollingInterval=setInterval(function(){
           pollAttempt++;
           _this.api.pollUser({fb_id: _this.fbid},function(){
             if(_this.api.lastResponse.status=="complete"){
               clearInterval(pollingInterval);
               _this.completeImport();
             }
           });
         }, 2000);
       }else{
         _this.loadingMessageDiv.html("We experienced an error loading your connections.  Please reload your page");
   
       }
    
  });
}
ConnectApp.prototype.updateMapMarkers = function(visibleConnectionPostions){
   
  if(visibleConnectionPostions){
    var filteredConnections = [];
    for (var i=0;i<visibleConnectionPostions.length;i++)
    { 
      filteredConnections.push(this.user.connections[visibleConnectionPostions[i]]);
    }
    this.map.updateMarkers(filteredConnections);
    filteredConnections.length=0;
  }else{
    this.map.updateMarkers(this.user.connections);
    this.map.map.panTo(this.map.mapCenter);
  }
}


ConnectApp.prototype.showFlashMessage = function(message, duration, className){
  var $flashDiv=$("#flash");
  if(className){
    $flashDiv.removeClass().addClass(className);
  }
  $flashDiv.html(message).slideDown();
  setTimeout(function() {
    $flashDiv.slideUp();
  }, duration );

}

ConnectApp.prototype.appendUserNavSpan = function(){
  var _this = this;
  $("#loggedInName").html("<img src='http://graph.facebook.com/" + connectInstance.user.fb_id + "/picture/?type=square' width='30' height='30'/>" + connectInstance.user.name);
  $("#logout").on('click', function(){
    _this.logout();
  });

  _this.filters=new ConnectFilter();
}

ConnectApp.prototype.logout = function(){
  FB.logout(function(response) {
    location.reload();
});
}

ConnectApp.prototype.hideSigninOverlay = function(){
  var _this=this;
  $('.modal-header').html("<div class='helper-text fb-connect'><p class='message' style='letter-spacing: 2px;'>We love to map people.<br>" + _this.user.connections.length + " of your " + _this.user.friend_count + " Facebook friends were mappable.</p></div>");
  $('.modal-footer').html("<p></p>");
  $('.modal-body').slideUp(function(){
    $('.modal-body').html("<div id='welcome-count'><span class='explore-button'><img src='images/explore-button.png' alt='Explore My Map'></span></div>");
    $('.modal-body').slideDown(function(){
       $('.explore-button img').on('click', function(){
         _this.showMap();
         $("#active-filters").css('z-index', 123);
         
       });
    });
  });
  $(".active-filters-count").popover({placement:"top",title:"Mappable Friends",content:"Right now the data we are using is from Facebook.  Because " + _this.user.connections.length + " of your " + _this.user.friend_count + " Facebook friends list their current city on their profile, your search results will reflect only these mappable friends.", trigger:"hover"});
 
}
ConnectApp.prototype.verifyImportCompletion = function(){
  if(this.user.import_stage==1){
    this.loadAttempts=0;
    this.completeImport();
  }
}
ConnectApp.prototype.showMap = function(){
 $('#signin-overlay').modal('hide');
  
}
ConnectApp.prototype.updateLoadingBar = function($loadingBarDiv, interval, pace){
  var _this=this;
  var current_perc = parseInt($loadingBarDiv.css('width').replace("%", ""));
  var perc = 100;
  
  //$loadingBarDiv.attr("data-percentage",100);
  this.progressIntervals.push(setInterval(function() {
    if (current_perc>=perc) {
      _this.clearProgressBarIntervals();
      if(!(typeof _this.user==="undefined") && !(typeof _this.user.fb_id==="undefined")){
        _this.verifyImportCompletion();
        if(_this.user.email){
          if(_this.map.clusterComplete){
            _this.hideSigninOverlay();
          }else{
            var checkMapComplete = setInterval(function(){
              if(_this.map.clusterComplete){
                
                clearInterval(checkMapComplete);
                _this.hideSigninOverlay();
              }
            },1000);
          }
        }else{
          _this.showEmailForm();
        } 
      }else{
        _this.loadingMessageDiv.html("Optimizing data for fast loading.");
      }
    } else {
      current_perc += pace;
      $loadingBarDiv.css('width', (current_perc)+'%');
    }

  }, interval));
}
ConnectApp.prototype.clearProgressBarIntervals = function(){
  $.each(this.progressIntervals, function(){
    window.clearInterval(this);
  });
}
ConnectApp.prototype.showEmailForm = function(){
  var _this=this;
  $('.modal-footer').children().fadeOut();
  $('.modal-header .progress').fadeOut(function(){
    $('.modal-header').html("<div class='helper-text fb-connect' style='margin-bottom:-10px'><p class='message' style='letter-spacing: 2px;'>Enter your details</p></div>");
 
  });
  $('.modal-body').slideDown();
  $('#submit-email').on('click', function(){
    _this.submitEmail();
  });
}

ConnectApp.prototype.hideFacebookScreen = function(){
  $('.modal-body').slideUp();
  $('.modal-header .helper-text.fb-connect').fadeOut(function(){
    $('.modal-header .progress').fadeIn();
  });
  setTimeout(function(){
    $('.modal-body .fb-button').hide();
    $('.modal-body .welcome-form').show();
    
  }, 1000);
}

ConnectApp.prototype.submitEmail = function(){
  $('#welcome-error').slideUp();
  var _this=this;
 if(ConnectHelper.isValidEmailAddress($('.modal-body #email-field').val())){
    this.user.email=$('.modal-body #email-field').val();
    this.api.setUserEmail({
      user_id: this.user.id,
      email: this.user.email
    }, function(){
      _this.hideSigninOverlay();
      
      _kmq.push(['record', 'In-App Email Submission']);
    });
  }else{
    $('#welcome-error').html("Please enter a valid e-mail address");
    $('#welcome-error').slideDown();
  }  
}

ConnectApp.prototype.sendDialog = function(fb_id){
  var options = {
    method: 'send',
    name: 'Sent via connect.com',
    description: '',
    picture: 'http://labs.connect.com/images/favicon.png',
    link: 'http://connect.com',
    to: fb_id
  };
  
  

  if(ConnectHelper.isMobile()){
    var params = $.param(options);
    var fbSendDialogURL = "http://www.facebook.com/" + fb_id;
    window.open(fbSendDialogURL,"_blank");
  }else{
    FB.ui(options);
  }
  
}
