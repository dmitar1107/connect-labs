function initializeContactSearch() {
	var index = new Array();
	var contacts=$.makeArray(connectInstance.user.connections);
	for (i in contacts) {
		index[i] = contacts[i].name;
	}
	$('#navbar-searchbox').typeahead({
     	source: index,
     	items: 500,
        select: function(){
          var val = this.$menu.find('.active').attr('data-value');
                   
		var marker = getContactCoordinates(contacts, val);
		if(marker){
                  connectInstance.map.filterMarkers(marker);
                }else{
                  //Need to handle this better.
                  connectInstance.showFlashMessage("No geo data available for " +  val + ".",  6000);
                }
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
          
        }
    });
	

}

function getContactCoordinates(contacts, query) {
	
	var contactSet = {};
	for (i in contacts) {
		if(contacts[i].name == query && contacts[i].lat && contacts[i].lng) {
                        var match = [];
			match.push(contacts[i].name);
			match.push(contacts[i].lat);
			match.push(contacts[i].lng);
			match.push(contacts[i].fb_id);
			return match;
		}
	}
        return false;
	
}
