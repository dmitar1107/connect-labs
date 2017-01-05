var iwBase_template = "\
	<div id='infowindow' > \
		<div id='infowindow-header'></div> \
		<div class='infowindow-body'></div> \
		<div class='infowindow-hide'></div> \
	</div> \
";

var iwContact_contents = "\
	<div class='contact-info'> \
		<div class='contact-img'></div> \
		<div class='contact-infolist'> \
			<ul> \
				<%= fieldlist %> \
			</ul> \
		</div> \
	</div> \
	<% if (count>1) { %> <div class='connections-back'> \
		<div class='connections-back-button'> \
			<span></span>Back \
		</div>  \
		<div class='connections-nav'> \
			<span class='connections-previous'></span> \
			<span class='connections-nav-text'> <%= current %> of <%= count %></span> \
			<span class='connections-next'></span> \
		</div> \
	</div> <% }  %> \
";

var iwContact_list = "\
	<li> \
		<span class='p-icon <%= fieldname %>'></span> \
		<span class='info-container'> \
			<span class='plabel' id='profile-detail-<%= fieldname %>'><%= fieldvalue %></span> \
			<span></span> \
		</span>\
	</li> \
";

var iwCluster_list = "<li class='cb-show-profile' friend_id='<%= fb_id %>' marker_index='<%= index %>'> <div class='thumbnail'> <div class='cluster-item' style='background-image: url(https://graph.facebook.com/<%= fb_id %>/picture?type=normal);'> </div><div class='caption'><%= name %></div></div> </li>";
