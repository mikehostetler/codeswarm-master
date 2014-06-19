<h1 class="page-title">
    <i class="fa fa-plus-circle"></i>
    Add a new Project
</h1>

<div class="content-wrap">
    <!--div class="sidebar-left">
        <section class="sidebar-list-contain">
            <h3 class="sidebar-list-title">&nbsp;</h3>

            <ul class="sidebar-list">
                <li class="sidebar-list--active">
                    <a class="choose-source" data-link="source"><strong>#1 - Choose Source</strong></a>
                </li>
                <li>
                    <a class="choose-repo" data-link="repo"><strong>#2 - Choose Repository</strong></a>
                </li>
                <li>
                    <a class="choose-type" data-link="type"><strong>#3 - Choose Type</strong></a>
                </li>
            </ul>
        </section>
    </div-->

    <form id="new-project" class="global-form">
        <div class="gf-col">
            <label>Repository</label>
            <input id="project-repo" required="true" name="repo" type="text" title="Enter the clone URL"
                   placeholder="git://github.com/username/project.git" ng-model="strRepository"/>

            <label>Branch</label>
            <input id="project-branch" required="true" name="branch" type="text" title="Enter the default branch"
                   placeholder="master" ng-model="strBranch">

            <label>Project Type</label>
            <select ng-model="selectedtype" ng-options="a as a.name for a in projectType">
                <option value="">-- choose project type --</option>
            </select>

            <label>Make Project Public?</label>
            <input type="checkbox" name="public" class="checkbox" ng-model="publicrepo"/>
            Public?
        </div>

        <div class="gf-actions">
            <button class="btn" ng-click="newproject()">Create Project</button>
        </div>
    </form>
</div>
