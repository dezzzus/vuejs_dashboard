<template>
  <header class="site-header">
    <div class="container-fluid">
        <a href="/" class="site-logo">
            <img class="hidden-md-down" src="static/img/logo-2.png" alt="">
            <img class="hidden-lg-down" src="static/img/logo-2-mob.png" alt="">
        </a>

        <div class="site-header-content">
            <div class="site-header-content-in">
                <div class="site-header-shown">
                    <div class="dropdown user-menu">
                        <button class="dropdown-toggle" id="dd-user-menu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="static/img/avatar-2-64.png" alt="">
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dd-user-menu">
                            <a class="dropdown-item" href="#"><span class="font-icon glyphicon glyphicon-user"></span>Profile</a>
                            <a class="dropdown-item" href="#"><span class="font-icon glyphicon glyphicon-cog"></span>Settings</a>
                            <a class="dropdown-item" href="#"><span class="font-icon glyphicon glyphicon-question-sign"></span>Help</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#"><span class="font-icon glyphicon glyphicon-log-out"></span>Logout</a>
                        </div>
                    </div>
                </div><!--.site-header-shown-->
            </div><!--site-header-content-in-->
        </div><!--.site-header-content-->

        <div class="site-header-links">
          <a href="/#/audience">Audience</a>
        </div>
    </div><!--.container-fluid-->
</header><!--.site-header-->


</template>

<style></style>

<script>
export default {
  name: 'app-header',
  data () {
    return { }
  }
}
</script>
