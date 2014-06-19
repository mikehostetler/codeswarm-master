<h1 class="page-title">
  <i class="fa fa-folder"></i>

  <a href="/#/projects" class="breadcrumb-link">Projects</a>
  <i class="fa fa-angle-right breadcrumb-hide"></i>

  <a href="{{project}}" class="breadcrumb-link breadcrumb-hide">{{project}}</a>
  <i class="fa fa-angle-right breadcrumb-hide"></i>

  <span class="breadcrumb-active breadcrumb-hide">{{_id}}</span>

  {{#unless restricted}}
  <a href="#/add-your-project" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
  {{/unless}}
</h1>

<div class="content-wrap">
  <h1 class="project-title">Build #{{_id}}
    <span class="project-title--status">
      <img src="../images/build-failing.png" alt="Build Failing">
    </span>

    <a href="#" class="btn btn-sec"><i class="fa fa-repeat"></i>Run</a>
  </h1>

  <div class="build-info">
    <div class="build-info-left">
      <h4 class="build-info--title">Author</h4>

      <div class="build-info--author">
        <img src="http://www.gravatar.com/avatar/00000000000000000000000000000000">
        <span>Trevan Hetzel</span>
      </div>
    </div>

    <div class="build-info-mid">
      <h4 class="build-info--title">Commit</h4>

      <div class="build-info--commit">
        <a href="#">04e550d (master)</a>
        <span>Remove .DS_Store and add .gitignore</span>
      </div>
    </div>

    <div class="build-info-right">
      <h4 class="build-info--title">Date</h4>

      <div class="build-info--date">
        Jan. 25, 2014
      </div>
    </div>
  </div>

  <ul class="tabs-horiz">
    <li class="build-tab"><a href="#/{{project}}/build/{{_id}}"><i class="fa fa-repeat"></i>Build</a></li>
    <li class="analysis-tab"><a href="#/{{project}}/analysis/{{_id}}"><i class="fa fa-bar-chart-o"></i>Analysis</a></li>
    <li class="source-tab"><a href="#/{{project}}/source/{{_id}}"><i class="fa fa-code"></i>Source</a></li>
  </ul>

  <ul class="breadcrumbs-secondary">
    <li><a href="#">Build</a></li>
    <li><a href="#">Internet Explorer</a></li>
    <li>IE9</li>
  </ul>

  <div class="sidebar">
    <section class="sidebar-list-contain build-groups-contain">
      <h3 class="sidebar-list-title">Build groups</h3>

      <ul class="sidebar-list">
        <li>
          <a href="#" class="accordion--trigger"><strong>Chrome</strong></a>
          <ul>
            <li><a href="#">Chrome 32</a></a></li>
            <li><a href="#">Chrome 31</a></li>
            <li><a href="#">Chrome 30</a></li>
            <li><a href="#">Chrome 29</a></li>
          </ul>
        </li>
        <li>
          <a href="#" class="accordion--trigger"><strong>Firefox</strong></a>
          <ul>
            <li><a href="#">Firefox 27</a></li>
            <li><a href="#">Firefox 26</a></li>
            <li><a href="#">Firefox 25</a></li>
            <li><a href="#">Firefox 24</a></li>
          </ul>
        </li>
        <li>
          <a href="#" class="accordion--trigger"><strong>Safari</strong></a>
          <ul>
            <li><a href="#">Safari 7.02</a></li>
            <li><a href="#">Safari 6.1</a></li>
            <li><a href="#">Safari 5.2</a></li>
            <li><a href="#">Safari 4.7</a></li>
          </ul>
        </li>
        <li>
          <a href="#" class="accordion--trigger"><strong>Internet Explorer</strong></a>
          <ul>
            <li><a href="#">IE11</a></li>
            <li><a href="#">IE10</a></li>
            <li><a href="#">IE9</a></li>
            <li><a href="#">IE8</a></li>
          </ul>
        </li>
      </ul>
    </section>
  </div>

  <div id="build-contain">

  </div>

  <!-- <h2 style="font-size: 150%; margin-bottom: 1em">Stages:</h2>
  {{#each stages}}
    <h3>{{name}}</h3>
    {{#each commands}}
    	<code>
        <p>$ {{command}} {{args}} <span class="annotation {{#if exitCode}}fail{{else}}pass{{/if}}">{{exitCode}} - {{finished_at}}</span></p>
        {{{out}}}
      </code>
    	<div class="log-bottom"></div>
    {{/each}}
  {{/each}} -->
</div>