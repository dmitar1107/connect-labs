var ConnectFilter = function (){
	$(".navbar").after(_.template(filterpanel_horizontal));
	this.overloadIntersection();
	this.results = new Object;
	this.conditions = new Object;
    this.previewMode = 0;
    this.filterBarState = "open";
}

ConnectFilter.prototype.add = function(name, val){
	switch(name) {
		case "gender":
		  if(val=="female") {	
		  	this.results.gender = _.flatten(connectInstance.user.connectionsIndex.gender.female);
		  } else {
		  	this.results.gender = _.flatten(connectInstance.user.connectionsIndex.gender.male);
		  }
		  this.conditions.gender = {vis: 1, val: val};
		  break;
		case "relationship":
		    if(val=="Other") {
            	var other = [];
                other.push(this.findSimilar(connectInstance.user.connectionsIndex.relationship, "Divorced"));
                other.push(this.findSimilar(connectInstance.user.connectionsIndex.relationship, "Separated"));
                other.push(this.findSimilar(connectInstance.user.connectionsIndex.relationship, "Complicated"));
                other.push(this.findSimilar(connectInstance.user.connectionsIndex.relationship, "Widowed"));
            }
 			if(!this.conditions.relationship) {
 				this.conditions.relationship = []; 
 				if(val=="Other") {
 					this.results.relationship = [_.flatten(other)];
 				} else {
 					this.results.relationship = [_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.relationship, val))];
 				}
 	        } else {
			    this.results.relationship.push(this.findSimilar(connectInstance.user.connectionsIndex.relationship, val));
            }
 			this.conditions.relationship.push({vis: 1, val: val});
			break;
		case "work":
 			if(!this.conditions.work) {
 				this.conditions.work = []; 
				this.results.work = [_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.work, val))];
			} else {
				this.results.work.push(_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.work, val)));
 			}
			this.conditions.work.push({vis: 1, val: val});
		  	break;
		case "school":
		 	if(!this.conditions.school) {
		 		this.conditions.school = []; 
		 		this.results.school = [_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.school, val))];
		 	} else {
				this.results.school.push(_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.school, val)));
	 		}
			this.conditions.school.push({vis: 1, val: val});
		 	break;
		case "location":
		 	if(!this.conditions.location) {
		 		this.conditions.location = []; 
		 		this.results.location = [_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.location, val))];
			} else {
				this.results.location.push(this.findSimilar(connectInstance.user.connectionsIndex.location, val));
			}	
 		 	this.conditions.location.push({vis: 1, val: val});
			break;
		case "name":
			if(!this.conditions.name) {
				this.conditions.name = []; 
				this.results.name = [_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.name, val))];
			} else {
				this.results.name.push(this.findSimilar(connectInstance.user.connectionsIndex.name, val));
			}
 		 	this.conditions.name.push({vis: 1, val: val});
			break;
		case "title":
			if(!this.conditions.title) {
				this.conditions.title = []; 
				this.results.title = [_.flatten(this.findSimilar(connectInstance.user.connectionsIndex.title, val))];
			} else {
				this.results.title.push(this.findSimilar(connectInstance.user.connectionsIndex.title, val));
			}
 			this.conditions.title.push({vis: 1, val: val});
			break;
	}
	_kmq.push(['record', 'Apply Filter', {'filter-name':name}]); 
	this.process(name);
}	

ConnectFilter.prototype.process = function(){
    this.previewMode = 0;
	var condition_count = this.filtercount();
	var type = _.keys(this.conditions);
	var results_to_compare = [];
        
	var net = [];
	$("#infowindow").hide();
        for(var i=0;i<type.length;i++)  { // first, collect all the filter results
		if(_.isArray(this.conditions[type[i]])) {
			var arrayCollection=[];
			for(j in this.results[type[i]])
				if(this.conditions[type[i]][j].vis==1)
					arrayCollection.push(this.results[type[i]][j])
			net.push(_.flatten(arrayCollection));
		} else {
			if(this.conditions[type[i]].vis==1)
				net.push(_.flatten(this.results[type[i]]));
		}
	}

	if (type.length>1) {
                for (var i = 0; i < net.length; i++){
                  if(net[i].length>0)
                    results_to_compare.push(net[i]);
                }
		if(results_to_compare.length==0){
                  this.results.reduced = [];
                }else{
                  this.results.reduced = _.uniq(_.intersection(results_to_compare));
                }
	} else {
		this.results.reduced = _.uniq(_.flatten(net));
	} 
	this.render(this.results.reduced); 
}

ConnectFilter.prototype.preview = function(name, val){
    this.previewMode = 1;
    var previewArray = [];
	var previewFilter = [];
	switch(name) {
		case "work":
		 	if(!this.conditions.work) {
				previewArray = _.flatten(this.findSimilar(connectInstance.user.connectionsIndex.work, val));
			} else {
				previewArray.push(this.findSimilar(connectInstance.user.connectionsIndex.work, val));
				previewArray.push(this.results.work);
 			}
		  	break;
		case "school":
			if(!this.conditions.school) {
				previewArray = _.flatten(this.findSimilar(connectInstance.user.connectionsIndex.school, val));
			} else {
				previewArray.push(this.findSimilar(connectInstance.user.connectionsIndex.school, val));
				previewArray.push(this.results.school);
 			}
		  	break;
		case "location":
			if(!this.conditions.location) {
				previewArray = _.flatten(this.findSimilar(connectInstance.user.connectionsIndex.location, val));
			} else {
				previewArray.push(this.findSimilar(connectInstance.user.connectionsIndex.location, val));
				previewArray.push(this.results.location);	
				previewArray = _.flatten(previewArray);
			}
			break;
		case "name":
			if(!this.conditions.name) {
				previewArray = _.flatten(this.findSimilar(connectInstance.user.connectionsIndex.name, val));
			} else {
				previewArray.push(this.findSimilar(connectInstance.user.connectionsIndex.name, val));
				previewArray.push(this.results.name);	
				previewArray = _.flatten(previewArray);
			}
			break;
		case "title":
			if(!this.conditions.title) {
				previewArray = _.flatten(this.findSimilar(connectInstance.user.connectionsIndex.title, val));
			} else {
				previewArray.push(this.findSimilar(connectInstance.user.connectionsIndex.title, val));
				previewArray.push(this.results.title);	
				previewArray = _.flatten(previewArray);
			}
			break;
	}

	if(Object.keys(connectInstance.filters.conditions).length==1 && name != "gender") {
		previewFilter = _.flatten(_.uniq(previewArray));
		
	} else if(typeof this.results.reduced != 'undefined' && this.results.reduced.length>0) {
   		previewFilter.push(this.results.reduced);
        previewFilter.push(previewArray);
        previewFilter = _.flatten(_.uniq(_.intersection(previewFilter)));
		
	} else {
		previewFilter = _.flatten(_.uniq(previewArray));
		
	}

	if(previewFilter.length>0) {
		connectInstance.updateMapMarkers(_.uniq(previewFilter));
	} else {
		connectInstance.map.clearOverlays();
		connectInstance.map.map.setZoom(1);
	}
}

ConnectFilter.prototype.render = function(){
	this.updateToggles();
	if(this.results.reduced.length==0 && this.filtercount()==0){ 
		connectInstance.updateMapMarkers();
	} else if(this.results.reduced.length==0 && this.filtercount()>0) {
		connectInstance.map.clearOverlays();
	    connectInstance.map.map.setZoom(1);
	} else {
		connectInstance.updateMapMarkers(this.results.reduced);
	}
}

ConnectFilter.prototype.remove = function(name, val){
	if(val && _.isArray(this.results[name][val])) {
		if(this.conditions[name].length<2) {
			delete this.conditions[name];
			delete this.results[name];
		} else {
			this.results[name].splice([val],1)			
			this.conditions[name].splice([val],1);
		}
	} else {
		this.results[name].length=0;
		delete this.conditions[name];
	}
	this.results.reduced.length=0;
	this.process();
}



ConnectFilter.prototype.toggleVisibility = function(name, id){
	//eg "work" "0" or "gender" "1"
	if(id) { // see if it's an array and loop if so
          if(_.isArray(this.conditions[name])) {
		if(this.conditions[name][id].vis==1) {
			this.conditions[name][id].vis=0;
		} else {
			this.conditions[name][id].vis=1;
		}
          }else{
            if(this.conditions[name].vis==1) {
			this.conditions[name].vis=0;
		} else {
			this.conditions[name].vis=1;
            }
          }
	} else {
		if(this.conditions[name].vis==1) {
			this.conditions[name].vis=0;
		} else {
			this.conditions[name].vis=1;
		}
	}
	this.process();
}

ConnectFilter.prototype.clear = function(){
	var active = _.keys(this.conditions);
	for(i=0;i<active.length;i++)
		this.remove(active)
}

ConnectFilter.prototype.matchByName = function(o, s) {
	var matches = [];
	var regex = new RegExp(val, "i")
	for(var key in obj) {
	    if(key.match(regex)) 
	    	matches.push(obj[key]);
	}
	return matches;
}

ConnectFilter.prototype.findSimilar = function(obj, val) {
	var matches = [];
	var regex = new RegExp(val + ".*", "i")
	for(var key in obj) 
		if(key.match(regex)) {
			matches.push(obj[key]);
		}
	return _.flatten(_.map(matches, _.values));
}

ConnectFilter.prototype.updateToggles = function() {
	var _this=this;
	var i=0;
        connectInstance.activeFilterContainer.clear();
	for(var key in this.conditions) { 
		if(_.isArray(this.conditions[key])) {
    		for(j in this.conditions[key]){
                connectInstance.activeFilterContainer.add({
					type : key,
					value : this.conditions[key][j].val,
                    visibility: this.conditions[key][j].vis,
					indexOfFilter : j
				});
 	   		}
	 	   	
		} else {
			connectInstance.activeFilterContainer.add({
				type : key,
				value : this.conditions[key].val, 
                                visibility: this.conditions[key].vis,
				indexOfFilter : i
			});

		}
		i++;
	}
	i=0;
	for(var key in this.conditions) {  
		if(_.isArray(this.conditions[key])) {
    		for(j in this.conditions[key]){
    			$("#"+key+"_"+j).on("click", function() { 
    				var ids = $(this).attr('id').split("_")
					_this.remove(ids[0], ids[1]); 
				});
	 	   	}
                        
		} else {
			$("#"+key+"_"+i).on("click", function() { 
                          var ids = $(this).attr('id').split("_")
			  _this.remove(ids[0], ids[1]); 
			  //_this.remove(key, i); 
			});
		}
		i++;
	}
        $(connectInstance.activeFilterContainer.selector() + ' li').on("click", function(){
          var filter_id = $(this).attr('data-filter').split("_");
            _this.toggleVisibility(filter_id[0], filter_id[1]);
          if($(this).hasClass('toggled-off')){
            $(this).removeClass('toggled-off');
          }else{
            $(this).addClass('toggled-off');
          }
        });
       
        
}

ConnectFilter.prototype.previewInterface = function(name, val, el, inval) {
	_this = this;
	_this.preview(name, val);
	if($(".filter-preview-btn").length > 0) $(".filter-preview-btn").remove();
	$("#"+name+"FilterInput").after("<div class='filter-preview-btn'> <a href='#' id='apply_"+ name +"'><img src='images/btn-preview-apply.png'/> </a></div>");
	$("#apply_"+name).on("click", function() {
		_this.add(name, val);
		$(".selected").removeClass("selected");
		//$(".filter-preview-btn").remove();
		$(inval).val('');
	})
}

ConnectFilter.prototype.exitFilter = function() {
    $(".selected").removeClass("selected");
   // $(".filter-preview-btn").remove();
    $("#workFilterInput").val('');
    $("#schoolFilterInput").val('');
    $("#locationFilterInput").val('');
    $("#nameFilterInput").val('');
    $("#genderFilterInput").val('');
    $("#relationshipFilterInput").val('');
    this.process();
}
ConnectFilter.prototype.refreshFilters = function(){
  var schoolTypeAhead = $("#schoolFilterInput").typeahead();
  var workTypeAhead = $("#workFilterInput").typeahead();
  schoolTypeAhead.data('typeahead').source = _.keys(connectInstance.user.connectionsIndex.school);
  workTypeAhead.data('typeahead').source = _.keys(connectInstance.user.connectionsIndex.work);
  $('.loading-filter').fadeOut('slow', function(){
    $('.loading-filter').siblings().fadeIn();
    $('.loading-filter').remove();
  });
  
  
  
}
ConnectFilter.prototype.lazyLoaderUI = function(name){
  if( $('.filter-bar-typeahead.' + name + ' .loading-filter').length == 0){
    $('.filter-bar-typeahead.' + name).prepend('<div class="loading-filter">Processing filter.  This may take a minute during your initial load...<div class="progress progress-striped active" style="height: 10px;"><div class="bar" style="width: 100%;"></div></div></div></div>');
    $('.loading-filter').siblings().hide();
  }
  
}
ConnectFilter.prototype.initializeFilters = function() {
	var _this=this;
    $("#schoolFilterInput").typeahead({
        source: _.keys(connectInstance.user.connectionsIndex.school), 
        items: 2000,
        select: function(){
                var val = this.$menu.find('.active').attr('data-value');
                this.$element
                  .val(this.updater(val))
                  .change()                
				_this.add("school", val);
				_this.exitFilter();
        }
    });
	
    $("#workFilterInput").typeahead({
        source: _.keys(connectInstance.user.connectionsIndex.work), 
        items: 2000,
        select: function(){
                var val = this.$menu.find('.active').attr('data-value');
                this.$element
                  .val(this.updater(val))
                  .change()           
              	_this.add("work", val);
              	_this.exitFilter();
        }
    });

    $("#locationFilterInput").typeahead({
        source: _.keys(connectInstance.user.connectionsIndex.location),
        items: 2000,
        select: function(){
            var val = this.$menu.find('.active').attr('data-value');
            this.$element
                .val(this.updater(val))
                .change()
            _this.add("location", val);
            _this.exitFilter();
        }
    });


    //var rels = _this.compileRelationships();
    rels = ["Single", "In a Relationship", "Engaged", "Married", "Other", "Not Stated"]
    $("#relationshipFilterInput").typeahead({
        source: rels,
        items: 15,
        select: function(){
                var val = this.$menu.find('.active').attr('data-value');
                this.$element
                  .val(this.updater(val))
                  .change()               
                _this.add("relationship", val);  
        		$(".selected").removeClass("selected");
        		_this.exitFilter();
        }
    });

	$(".filter-bar-menu ul li span").on("click", function(e) {
        var filterName = $(this).parent("li").attr("class");
        if(typeof filterName != 'undefined') {
            var clicked = $("." + filterName);
            //var delay = 500;

            if(_this.previewMode==1)  _this.exitPreview();
            if ($(".filter-bar-typeahead div.selected").length == 0)
                delay=0;

            if (filterName.indexOf("selected") <= 0) {
                _kmq.push(['record', 'Open Filter', {'filter-name':filterName}]);
                $(".selected").removeClass("selected");
                //setTimeout(function() {
                    clicked.addClass("selected");
                    setTimeout(function() {
                        $("." + filterName).find("input").focus();
                    }, 500);
                //}, delay);
            }else{
                filterName = filterName.substring(0, filterName.length - 9);
                $(".selected").removeClass("selected");
            }
        }
	});

	$("#filter-bar-toggle").on("click", function(e) {
		if(_this.filterBarState=="open") {
			connectInstance.map.mapdiv.style.height=($(window).height()-46)+'px';
			$("#filter-bar-toggle-arrow").css("background", "url('images/btn-filter-toggle-collapse.png')");
			$(".filter-bar-menu").slideUp("fast");
			$("#map").animate({"top": "-=72px"}, "fast");
			$("#filter-bar-toggle").animate({"top": "-=72px"}, "fast");
    		_this.filterBarState="closed";
    	} else {
			$(".filter-bar-menu").fadeIn("slow");
			$("#filter-bar-toggle-arrow").css("background", "url('images/btn-filter-toggle-open.png')");
			$("#map").animate({"top": "+=72px"}, "fast", function(){ 
				connectInstance.map.mapdiv.style.height=($(window).height()-118)+'px';
			});
			$("#filter-bar-toggle").animate({"top": "+=72px"}, "fast");
	    	_this.filterBarState="open"	;
    	}
	});


	$(".female").on("click", function() {
	    _this.add("gender", "female");
	    $(".selected").removeClass("selected");
	});
	$(".male").on("click", function() {
	    _this.add("gender", "male");
	    $(".selected").removeClass("selected");
	});

	$("#nameFilterInput").change(function() {
		if ($(this).val()=='') {_this.remove("name")} 
		else {
			var val = $(this).val()
			_this.add("name", val);
			_this.exitFilter();
		}
	});	

	$("#apply_name").on("click", function() {
		_this.add("name", $('#nameFilterInput').val());
		_this.exitFilter();
	});

	$("#titleFilterInput").change(function() {
		if ($(this).val()=='') {_this.remove("title")} 
		else {
			var val = $(this).val()
			_this.add("title", val);
			_this.exitFilter();
		}
	});	

	$("#apply_title").on("click", function() {
		_this.add("title", $('#titleFilterInput').val());
		_this.exitFilter();
	});

}


ConnectFilter.prototype.filtercount = function(){
	var filterCount=0;
        for(var key in this.conditions) { 
          if(_.isArray(this.conditions[key])) {
            for(var i in this.conditions[key]){
              if(this.conditions[key][i].vis == 1)
                filterCount++;
            } 
          } else {
            if(this.conditions[key].vis == 1)
                filterCount++;
          }
        }
	return filterCount;
}

ConnectFilter.prototype.compileRelationships = function() {
    var relTypes= _.keys(connectInstance.user.connectionsIndex.relationship);
    if(_.find(relTypes, function(num) {return (num == "Widowed") || (num == "Separated") || (num == "Divorced")|| (num == "It's Complicated")})) {
        relTypes.push("Other");
    }
    relTypes = _.without(relTypes, "Widowed", "Separated", "Divorced", "It's Complicated", "");
    return relTypes;
}

ConnectFilter.prototype.overloadIntersection = function() {
	var cached = _.intersection;
  	_.intersection = function() {
		var rest = arguments, arr = [];
	    arr = rest.length == 1 ? rest[0] : rest;
	    return eval(_.reduce(arr, function(m, v, i) {return m + 'arr['+i+'],';}, 'cached(').slice(0, -1) + ')');
  	}
}