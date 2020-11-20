<template>
  <div class="admin">
    <h1>this is admin page</h1>
  </div>
</template>

<script>
export default {
  middleware: ["auth"],
};
</script>

<style scoped>
.admin {
}
</style>