<h1 class="page-title">
    <i class="fa fa-lock"></i>
    Login
</h1>

<div class="content-wrap">
    <form id="login" class="global-form" name="loginForm" ng-submit="login(credentials)" novalidate>
        <div class="gf-col">
            <h3>Log in with:</h3>
            <ul>
                <li><a href="/auth/github">Log in with Github</a></li>
            </ul>
        </div>
        <div class="gf-col">
            <label>Username</label>
            <input type="username" placeholder="Username" name="username" id="username" ng-model="credentials.username" required>

            <label>Password</label>
            <input type="password" placeholder="Password" name="password" id="password" ng-model="credentials.password" required>
        </div>

        <div class="gf-actions">
            <button type="submit" class="btn">Login</button>
            <p>New User? <a href="#user/register">Register Here</a></p>
        </div>
    </form>
</div>
