var ConnectUser = function(options){
  this.id=options.id || null;
  this.name=options.name || null;
  this.fb_id=options.fb_id || null;
  this.zip=options.zip || null;
  this.email=options.email || null;
  this.friend_count=null;
  this.import_stage=options.import_stage || null;
  this.getFriendCount();
}

ConnectUser.prototype.getFriendCount = function(){
  var _this=this;
  FB.api('me/friends',
  function(response) {
    _this.friend_count=response['data'].length;
}
);
}