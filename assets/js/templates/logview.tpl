<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    <span><a href="#!/{{build.project}}">{{project}}</a> - {{created_at}}</span>
</h1>

<div class="content-wrap">



  <table class="datatable">
    <tbody>

      <tr>
        <th width="150">Status</th>
        <td class="{{status}}">{{status}}</td>
      </tr>

      {{#if git.commit}}
        <tr>
          <th width="150">Git Commit</th>
          <td>{{git.commit}}</td>
        </tr>
      {{/if}}

      {{#if tags}}
        <tr>
          <th width="150">Git Tags</th>
          <td>{{tags}}</td>
        </tr>
      {{/if}}

    </tbody>
  </table>

  <h2 style="font-size: 150%; margin-bottom: 1em; margin-top: 1em">Stages:</h2>
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