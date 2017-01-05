fetchConnections = function(userId){
	var connections = {
	"records": [
			{ name:"Lane Becker", lat: 37.7752, lng: -122.419, fb_id: 625606185}, 
			{ name:"Courtney Skott", lat: 37.9, lng: -122.419, fb_id: 2703372}, 
			{ name:"Amy Muller", lat: 37.5, lng: -122.419, fb_id: 2703832}, 
			{ name:"Jerri Chou" , lat: 40.694, lng: -73.9903, fb_id: 913659}, 
			{ name:"Michael Stella" , lat: 35.9203, lng: -79.0372, fb_id: 2702233}, 
			{ name:"Sarah Greenblatt" , lat: 25.779, lng: -80.1982, fb_id: 2706035}, 
			{ name:"Juliana Mulholland" , lat: 30.2303, lng: -97.7144, fb_id: 2712652} 
	]};
	return connections;
}


fetchContact = function(contactId){
    connectInstance.api.getConnection({connection_id: contactId, user_id: connectInstance.user.id}, function(){//console.log(connectInstance.api.lastResponse)
      });
	var contact = {
		name:"Lane Becker", lat: 37.7752, lng: -122.419, fb_id: 2706035, fb_url: "http://www.facebook.com/laneb", work: "N/A", education: "N/A", hometown: "N/A", location: "San Francisco", birthday: "N/A" };
	return contact;
}