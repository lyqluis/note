<template>
  <div class="login">
    <h1>login</h1>
    <input type="text" v-model="user.username" />
    <input type="text" v-model="user.password" />
    <button @click="onLogin">login</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    onLogin() {
      this.$store.dispatch("user/login", this.user).then((isLogin) => {
        console.log(this.$route.query.redirect)
        const redirect = this.$route.query.redirect || "/";
        this.$router.push(redirect);
      });
    },
  },
};
</script>
