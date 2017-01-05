var filterpanel_horizontal = "\
<div class='filter-bar'> \
		<div class='filter-bar-menu'>	 \
				 <ul>	\
						<li class='name'><span class='map-li-container'><span class='icon'></span><span class='text'>NAME</span></span><span class='pointer'></span> </li> \
						<li class='work'><span class='map-li-container'><span class='icon'></span><span class='text'>WORK</span></span><span class='pointer'></span> </li> \
						<li class='school'><span class='map-li-container'><span class='icon'></span><span class='text'>EDUCATION</span></span><span class='pointer'></span>  </li> \
						<li class='location'><span class='map-li-container'><span class='icon'></span><span class='text'>CITY</span></span><span class='pointer'></span> </li> \
						<li class='gender'><span class='map-li-container'><span class='icon'></span><span class='text'>GENDER</span></span><span class='pointer'></span>  </li>  \
						<li class='title'><span class='map-li-container'><span class='icon'></span><span class='text'>JOB TITLE</span></span><span class='pointer'></span>  </li>  \
						<li class='relationship'><span class='map-li-container'><span class='icon'></span><span class='text'>RELATIONSHIP</span></span><span class='pointer'></span>  </li>  \
				</ul> \
		</div> \
        <div class='filter-bar-typeahead short name'>  <input type='text' class='left-menu-input custom-map-filters-typeahead-input' id='nameFilterInput'  placeholder='e.g. Maxwell, Fiona, Davidson'><div class='filter-preview-btn'> <a href='#' id='apply_name'><img src='images/btn-preview-apply.png'/> </a></div></div> \
        <div class='filter-bar-typeahead work'>  <input type='text' class='left-menu-input custom-map-filters-typeahead-input' id='workFilterInput' placeholder='e.g. Toyota, Google'> <div class='ml-select-container'><ul></ul></div> </div> \
        <div class='filter-bar-typeahead school'>  <input type='text' class='left-menu-input custom-map-filters-typeahead-input' id='schoolFilterInput' placeholder='e.g. Oxford, Emeryville High'> <div class='ml-select-container'><ul></ul></div> </div> \
        <div class='filter-bar-typeahead location'>  <input type='text' class='left-menu-input custom-map-filters-typeahead-input' id='locationFilterInput' placeholder='e.g. Seattle, Paris'> <div class='ml-select-container'><ul></ul></div>  </div> \
        <div class='filter-bar-typeahead gender'><div class='mlg-choice female'><span class='mlgicon'></span><span class='mlgtext'>FEMALE</span></div>	<div class='mlg-choice male'><span class='mlgicon'></span><span class='mlgtext'>MALE</span></div></div> \
        <div class='filter-bar-typeahead short title'>  <input type='text' class='left-menu-input custom-map-filters-typeahead-input' id='titleFilterInput' placeholder='e.g. CEO, marketing, therapist'><div class='filter-preview-btn'> <a href='#' id='apply_title'><img src='images/btn-preview-apply.png'/> </a></div></div> \
        <div class='filter-bar-typeahead relationship medium'><input type='hidden' class='left-menu-input custom-map-filters-typeahead-input' id='relationshipFilterInput'> <div class='ml-select-container'><ul></ul></div></div> \
</div> \
<div id='filter-bar-toggle' title='Click to collapse or expand top bar'><span class='shade'></span> <div id='filter-bar-toggle-arrow'> </div> </div> \
";