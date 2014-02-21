	<h2 class="section-title">Build Output</h2>

    {{#each stages}}
      {{#each commands}}
        <code class="code-output">
          <p>$ {{command}} {{args}} <span class="annotation {{#if exitCode}}fail{{else}}pass{{/if}}">{{exitCode}} - {{finished_at}}</span></p>
          {{{out}}}
        </code>
        <div class="log-bottom"></div>
      {{/each}}
    {{/each}}