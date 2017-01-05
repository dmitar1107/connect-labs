var ConnectFilterContainer = function (containterSelector){
  this.dragging = null;
  this.activeFilterContainer = containterSelector;
  this.draggableSelector = ".draggable";
  this.initilize();
  
}

ConnectFilterContainer.prototype.initilize = function(){
  
  this.initializeDragging();
}

ConnectFilterContainer.prototype.initializeDragging = function(){
  $(this.activeFilterContainer).draggable({containment: [ 20, 150, ($(window).width() - $(this.activeFilterContainer).width() - 20),($(window).height() - 50)], scroll: false});
}

ConnectFilterContainer.prototype.add = function(options){
  var value = options.value;
  var category = options.type;
  var remove_filter_id = options.indexOfFilter;
  var toggled_on = options.visibility;
  //refactor this to use templating
  var li_toggle_class = "";
  if(toggled_on==0){
    li_toggle_class = "toggled-off";
  }
  $(this.activeFilterContainer + ' ul').prepend('<li class="filter-' + category + ' ' + li_toggle_class + '" data-filter="' + category + "_" + remove_filter_id + '"><span id="' + category + "_" + remove_filter_id + '" class="remove-filter"></span><a class="filter-value" href="#">' + value + '</a></li>');
  this.tagFirstOfCategory(category);
}

ConnectFilterContainer.prototype.tagFirstOfCategory = function(category){
 $(this.activeFilterContainer + ' ul li.filter-' + category).removeClass('first-of-category');
 $(this.activeFilterContainer + ' ul li.filter-' + category + ':first').addClass('first-of-category');
}

ConnectFilterContainer.prototype.headline = function(text){
  var _this=this;
  $(this.activeFilterContainer + ' .active-filters-count').html(text);
  
  
}

ConnectFilterContainer.prototype.selector = function(){
  return this.activeFilterContainer;
}

ConnectFilterContainer.prototype.clear = function(options){
  $(this.activeFilterContainer + ' ul').empty();
}



     