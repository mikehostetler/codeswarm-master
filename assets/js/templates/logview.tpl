<h1 class="page-title">
  <i class="fa fa-folder"></i>
  <a href="/#/projects" class="breadcrumb-link">Projects</a>
  <i class="fa fa-angle-right breadcrumb-hide"></i>
  <a href="#!/{{build.project}}" class="breadcrumb-link breadcrumb-hide">{{project}}</a>
  <i class="fa fa-angle-right breadcrumb-hide"></i>
  <span class="breadcrumb-active breadcrumb-hide">{{_id}}</span>
  {{#unless restricted}}
  <a href="#/project/new" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
  {{/unless}}
</h1>

<div class="content-wrap">
  <h1 class="project-title">Build #{{_id}} 
    <span class="project-title--status">
      <img src="../images/build-failing.png" alt="Build Failing">
    </span>

    <a href="#" class="btn btn-sec"><i class="fa fa-repeat"></i>Run</a>
  </h1>

  <ul class="tabs-horiz">
    <li class="current-tab"><a href="#"><i class="fa fa-repeat"></i>Build</a></li>
    <li><a href="#/pull-requests"><i class="fa fa-bar-chart-o"></i>Analysis</a></li>
    <li><a href="#/branches"><i class="fa fa-code"></i>Source</a></li>
  </ul>

  <div class="sidebar">
    <section class="sidebar-list-contain build-groups-contain">
      <h3 class="sidebar-list-title">Build groups</h3>

      <ul class="sidebar-list">
        <li><a href="#"><strong>Chrome</strong></a></li>
        <li><a href="#"><strong>Firefox</strong></a></li>
        <li><a href="#"><strong>Safari</strong></a></li>
        <li><a href="#"><strong>Internet Explorer</strong></a></li>
      </ul>
    </section>
  </div>

  {{#each stages}}
    {{#each commands}}
      <code class="code-output">
        <p>$ {{command}} {{args}} <span class="annotation {{#if exitCode}}fail{{else}}pass{{/if}}">{{exitCode}} - {{finished_at}}</span></p>
        {{{out}}}
      </code>
      <div class="log-bottom"></div>
    {{/each}}
  {{/each}}

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