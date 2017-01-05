var infoWindow = function () {

        function setup() {
			if($("#infowindow").length != 0) {
				reset();
			} else {
				$("body").append(iwBase_template);
				$(".infowindow-hide").on("click", function() {
					infoWindow.close();
				});
			}
        }

        function reset() {
		 	$("#infowindow .infowindow-body").empty();
			$("#infowindow #infowindow-header").empty();
			$("#infowindow").hide();
        }

        function close() {
		 	$("#infowindow .infowindow-body").scrollTop(0);
			$("#infowindow").fadeOut();
			$("#infowindow").remove();
        }

        function fetchContact(contactId, cluster) {
                  connectInstance.api.getConnection({
                          connection_id: contactId, 
                          user_id: connectInstance.user.id}, 
                          function(){
                                  //pull facebook data on the fly
                                  FB.api('/' + contactId, {fields: 'id,work,education'}, function(response) {
                                        var connectionData = connectInstance.api.lastResponse;
                                        
                                        if(response.education && response.education.length>0){
                                          connectionData.education=response.education[response.education.length - 1]['school']['name'];
                                        }
                                        if(response.work && response.work.length>0){
                                          connectionData.work=response.work[0]['employer']['name'];
                                        }
                                        if(cluster){
                                           infoWindow.contact(contactId, cluster, connectionData)
                                        }else{
                                           infoWindow.showSearchedContact(contactId,connectionData);
                                        }
                                       
                                        
                                  });
                                  
                          }
                  );
        }

        function getPosition( array, attr, value ){
			var position = new Object;
			if(array === Object) array = _.toArray(array);
		    for(var i = 0; i < array.length; i += 1) {
		        if(array[i][attr] == value && !position["current"]) {
		            position.current = i+1;
					position.previous = (i>0)? array[i-1]["fb_id"] : array[array.length-1]["fb_id"];
					position.next = (i<array.length-1)? array[i+1]["fb_id"] : array[0]["fb_id"];
					return position;
		        }
		    }
        }

		function pluralize(word, count) {
			var pluralized = (count<2)? word: word + "s";
			return pluralized;
		}

        function showCluster( cluster ){
			var result = pluralize(" Result", cluster.markers_.length);
			var header = cluster.markers_.length + result;
			var rendered = "";
			var list = _.template(iwCluster_list);
			for(i in cluster.markers_) {
				rendered += list({
					fb_id : cluster.markers_[i].fb_id, 
					name : cluster.markers_[i].name, 
					index : i
				});
			}
			setup();
			$("#infowindow").css("height", "375px");
			$("#infowindow-header").append(header);
			$(".infowindow-body").append("<ul class='thumbnails'></ul>");
			$(".infowindow-body .thumbnails").append(rendered);
			$("#infowindow").fadeIn();
			$(".cb-show-profile").on("click", function() {
		        fetchContact( $(this).attr("friend_id"), cluster );
		    });
        }
        function getAdditionFbInfo(){
          
          
        }
        function showContact(contactId, cluster, data){
			var contact = data;
                        if(contact.birthday){
                          var bday = "Born on " + contact.birthday;
                        }
			var fields = [
				{name: "work", value: contact.work || null},
                                {name: "education", value: contact.education || null},
				{name: "location", value: contact.location || null},
				{name: "birthday", value: bday || null}
			];
			var renderedFields ="";
			var fieldlist = _.template(iwContact_list);
			for (var i in fields) {
                            if(fields[i].value){
                              renderedFields += fieldlist({ 
					fieldname: fields[i].name, 
					fieldvalue: fields[i].value 
				});
                            }
			    
			}
                        if(cluster.markers_.length==1){
                          var position = {current: 1};
                        }else{
                          var position = getPosition(cluster.markers_, "fb_id", contactId);
                        }
                        var contents = _.template(iwContact_contents, 
			{fieldlist : renderedFields, 
				current : position.current, 
				count : cluster.markers_.length 
			});
			setup();
			$("#infowindow").css("height", "275px");
			$("#infowindow-header").html(contact.name + "<a href='javascript:connectInstance.sendDialog(" + contact.fb_id + ");' title='Message on Facebook'><img src='images/facebook-message.png' class='facebook-message' alt='Message on Facebook' /></a><a href='http://facebook.com/" + contact.fb_id + "' title='View on Facebook' target='_blank'><img src='images/map-icon-facebook.png' class='facebook-link' alt='View on Facebook'></a>");
			$(".infowindow-body").append(contents);
			$("#infowindow").fadeIn();
			
			$(".connections-back-button").on("click", function() {
				infoWindow.cluster(cluster);
		    });
			$(".connections-next").on("click", function() {
				fetchContact(position.next, cluster);
		    });
			$(".connections-previous").on("click", function() {
				fetchContact(position.previous, cluster);
		    });
			$(".contact-img").css("background-image",
				"url('http://graph.facebook.com/"+ contact.fb_id + "/picture?type=large')").on('click', function(){window.open('http://facebook.com/' + contact.fb_id, '_blank');})

        }
        function showSearchedContact(contactId, data){
			var contact = data;
                        if(contact.birthday){
                          var bday = "Born on " + contact.birthday;
                        }
			var fields = [
				{name: "work", value: contact.work || null},
                                {name: "education", value: contact.education || null},
				{name: "location", value: contact.location || null},
				{name: "birthday", value: bday || null}
			];
			var renderedFields ="";
			var fieldlist = _.template(iwContact_list);
			for (var i in fields) {
                            if(fields[i].value){
                              renderedFields += fieldlist({ 
					fieldname: fields[i].name, 
					fieldvalue: fields[i].value 
				});
                            }
			    
			}
                        
                        var contents = _.template(iwContact_contents, 
			{fieldlist : renderedFields, 
				current : 1, 
				count : 1
			});
			setup();
 			$("#infowindow").css("height", "225px");
                        
			$("#infowindow-header").html(contact.name + "<a href='javascript:connectInstance.sendDialog(" + contact.fb_id + ");' title='Message on Facebook'><img src='images/facebook-message.png' class='facebook-message' alt='Message on Facebook' /></a><a href='http://facebook.com/" + contact.fb_id + "' title='View on Facebook' target='_blank'><img src='images/map-icon-facebook.png' class='facebook-link' alt='View on Facebook'></a>");
			$(".infowindow-body").append(contents);
			$("#infowindow").fadeIn();
			
			
			$(".contact-img").css("background-image",
				"url('http://graph.facebook.com/"+ contact.fb_id + "/picture?type=large')").on('click', function(){window.open('http://facebook.com/' + contact.fb_id, '_blank');})

        }
       return {
            cluster: showCluster,
            contact: showContact,
            close: close,
            fetchContact: fetchContact,
            showSearchedContact: showSearchedContact
        };

    }();



  
