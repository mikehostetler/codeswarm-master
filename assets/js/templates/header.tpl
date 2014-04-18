{{#auth}}
<a class="menu-button" href="#/projects">
    <i class="fa fa-check-circle"></i>CodeSwarm
</a>

<a class="fa fa-bars nav-trigger"></a>

<ul class="global-nav">
	<li><a href="#/projects">Projects</a></li>
	<li><a href="#/logout">Logout</a></li>
</ul>
{{/auth}}

{{^auth}}
<a class="menu-button">
    <i class="fa fa-check-circle"></i>CodeSwarm
</a>
{{/auth}}
