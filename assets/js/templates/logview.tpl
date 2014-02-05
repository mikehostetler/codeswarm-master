<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    <span><a href="#!/{{build.project}}">{{project}}</a> - {{created_at}}</span>
</h1>

<div class="content-wrap">

  <h2 class="{{status}}" style="font-size: 100%; margin-bottom: 1em">{{status}}</h2>

  <h2 style="font-size: 150%; margin-bottom: 1em">Stages:</h2>
  {{#each stages}}
    <h3>{{name}}</h3>
    {{#each commands}}
    	<code>
        <p>$ {{command}} {{args}} <span class="annotation {{#if exitCode}}fail{{else}}pass{{/if}}">{{exitCode}} - {{finished_at}}</span></p>
        {{{out}}}
      </code>
    	<div class="log-bottom"></div>
    {{/each}}
  {{/each}}
</div>