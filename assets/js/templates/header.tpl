{{#auth}}
<a class="menu-button" href="#/projects">
    <i class="fa fa-check-circle"></i>CodeSwarm
</a>

<a href="#" class="global-search--trigger fa fa-search"></a>

<form class="global-search">
	<input type="text" name="Search" placeholder="Search..." class="search-input">
</form>

<div class="profile-nav">
	<a href="#" class="profile-nav--trigger">
		<img src="http://www.gravatar.com/avatar/00000000000000000000000000000000" class="profile-nav--thumb">
		<span>Mike Hostetler</span>
		<i class="fa fa-caret-down"></i>
	</a>

	<ul class="profile-nav--list">
		<li><a href="#"><i class="fa fa-user"></i>Your Profile</a></li>
		<li><a href="#"><i class="fa fa-cog"></i>Account Settings</a></li>
		<li><a href="#/logout"><i class="fa fa-power-off"></i>Log Out</a></li>
	</ul>
</div>
{{/auth}}

{{^auth}}
<a class="menu-button">
    <i class="fa fa-check-circle"></i>CodeSwarm
</a>
{{/auth}}
