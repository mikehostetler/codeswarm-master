<div class="gf-col">
	<form class="global-form project-config-form" id="project-config" data-bind="submit: trySaveProject">

			<label>Repository</label>
			<input required="true" title="Enter the project repository" type="text" placeholder="ssh://git@github.com:organization/project.git" data-bind="value: repo">

			<label>Branch</label>
			<!-- ko if: availableBranches().length -->
			<select data-bind="options: availableBranches, value: branch"></select>
			<!-- /ko -->
			<!-- ko ifnot: availableBranches().length -->
			<input required="true" type="text" title="Enter the default branch" placeholder="Branch Name" data-bind="value: branch">
			<!-- /ko -->

			<label style="clear: both; display: inline">
				<input type="checkbox" name="public" class="checkbox" value="true" data-bind="checked: public">
				Public
			</label>

			<br />
			<button class="btn">Create</button>
	</form>
</div>
