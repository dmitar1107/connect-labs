var ConnectApi = function(){
  this.location="api/";
  this.token = "empty";
  
}

ConnectApi.prototype.request = function(options){
  var _this = this;
  var requestType = options.requestType || "POST";
  var successFunction = options.successFunction || function(jsonData){
    //console.log(jsonData);
  }
  var requestHeaders = options.headers || ["X_CNTOKEN: " + _this.token];
  var errorFunction = options.errorFunction || function(jqXHR, textStatus, errorThrown){
    //console.log(textStatus);
  }
  var requestData = options.data || {};
  var endpoint = options.endpoint || "";
  var timeout = options.timeout || 60000;
  var postData = {
    "endpoint": endpoint,
    "method": requestType,
    "vars": requestData,
    "headers": requestHeaders
  }
  $.ajax(this.location, {
    type: "POST",
    data: postData,
    dataType: "json",
    success: successFunction,
    timeout : timeout,
    error: errorFunction
     
  });
}

ConnectApi.prototype.initializeSession = function(options, callback,errorCallback){
  var _this=this;
  this.request({
    requestType: "POST",
    endpoint: "users",
    data: options,
    headers: [],
    successFunction: function(jsonData){
      _this.token=jsonData.token; 
      _this.lastResponse=jsonData.user_data;
      callback();
    },
    errorFunction: function(){
      errorCallback();
    }
  });
}

ConnectApi.prototype.getConnections = function(options, callback){
  var _this=this;
  this.request({
    requestType: "GET",
    endpoint: "userconnections/" + options.user_id,
    successFunction: function(jsonData){
      _this.lastResponse=jsonData;
      callback();
    },
    timeout:300000
  });
}

ConnectApi.prototype.getConnection = function(options, callback){
  var _this=this;
  this.request({
    requestType: "GET",
    endpoint: "connections/" + options.connection_id,
    headers: ["X_CNTOKEN: " + _this.token, "X_CNUSER: " + options.user_id],
    data: options,
    successFunction: function(jsonData){
      _this.lastResponse=jsonData;
      callback();
    }
  });
}
ConnectApi.prototype.pollUser = function(options, callback){
  var _this=this;
  this.request({
    requestType: "GET",
    endpoint: "polling/" + options.fb_id,
    data: options,
    successFunction: function(jsonData){
      _this.lastResponse=jsonData;
      callback();
    }
  });
}
ConnectApi.prototype.logoutRequired = function(options, callback){
  var _this=this;
  this.request({
    requestType: "GET",
    endpoint: "logoutrequired/" + options.fb_id,
    data: options,
    successFunction: function(jsonData){
      _this.lastResponse=jsonData;
      callback();
    }
  });
}
ConnectApi.prototype.submitNewSignup = function(options, callback){
  var _this=this;
  this.request({
    requestType: "POST",
    endpoint: "usersignups/",
    data: {email: options.email},
    successFunction: function(jsonData){
      _this.lastResponse=jsonData;
      callback();
    }
  });
}

ConnectApi.prototype.setUserEmail = function(options, callback){
  var _this=this;
  this.request({
    requestType: "PUT",
    endpoint: "users/" + options.user_id,
    headers: ["X_CNTOKEN: " + _this.token, "X_CNUSER: " + options.user_id],
    data: {email: options.email},
    successFunction: function(jsonData){
      _this.lastResponse=jsonData;
      callback();
    }
  });
}

