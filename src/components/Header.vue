<template>
  <div style="padding:  0 32px;">
    <b-navbar toggleable="lg" type="dark" style="background:  #171E29 !important;">
      <b-navbar-brand href="#">
        <div style="display: flex; align-items: center;">
          <img src="../assets/logo.png" class="logo">
          <span class="title">180 Songs</span>
        </div>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse">

      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <div style="font-size: 32px;color: #fff">Hi, {{ userInfo.display_name }}</div>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" style="color: #fff!important">Terms</b-nav-item>
          <b-nav-item href="#" style="color: #fff!important">About Us</b-nav-item>
          <b-nav-item href="#" style="color: #fff!important">Explore Apps</b-nav-item>
          <!--          <b-nav-form>-->
          <!--            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
          <!--            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>-->
          <!--          </b-nav-form>-->

          <!--          <b-nav-item-dropdown text="Lang" right>-->
          <!--            <b-dropdown-item href="#">EN</b-dropdown-item>-->
          <!--            <b-dropdown-item href="#">ES</b-dropdown-item>-->
          <!--            <b-dropdown-item href="#">RU</b-dropdown-item>-->
          <!--            <b-dropdown-item href="#">FA</b-dropdown-item>-->
          <!--          </b-nav-item-dropdown>-->

          <!--          <b-nav-item-dropdown right>-->
          <!--            &lt;!&ndash; Using 'button-content' slot &ndash;&gt;-->
          <!--            <template v-slot:button-content>-->
          <!--              <em>User</em>-->
          <!--            </template>-->
          <!--            <b-dropdown-item href="#">Profile</b-dropdown-item>-->
          <!--            <b-dropdown-item href="#">Sign Out</b-dropdown-item>-->
          <!--          </b-nav-item-dropdown>-->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>

export default {
  name: 'Header',
  components: {},
  data() {
    return {
      userInfo: {}
    }
  },

  computed: {},

  watch: {},

  methods: {},
  beforeDestroy() {
    this.$root.$off('getUserInfo');
  },
  mounted() {
    this.$root.$on('getUserInfo', (data) => {
      this.$set(this, 'userInfo', data);
    }).bind(this);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.logo {
  width: 60px;
  height: 60px;
}

.title {
  margin-left: 8px;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  /*color: #96BF47;*/
  text-align: center;
}

.navbar.vue-fixed-header--isFixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
}
</style>
