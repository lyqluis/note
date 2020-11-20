<template>
  <div class="container">
    <div>
      <Logo />
      <h2>list</h2>
      <ul>
        <li v-for="good in goods" :key="good.id">
          <n-link :to="`/detail/${good.id}`">
            {{ good.name }}
          </n-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, error }) {
    const { ok, goods } = await $axios.$get("/api/goods");
    if (ok) {
      // 和data()一样，直接返回数据即可
      return {
        goods,
      };
    }
    // 错误处理
    error({statusCode: 400, message: '数据查询失败'})
  },
  // data() {
  //   return {
  //     goods: [
  //       { id: 1, name: "cup", price: 999 },
  //       { id: 2, name: "apple", price: 9 },
  //       { id: 3, name: "orange", price: 9 },
  //       { id: 4, name: "water", price: 99 },
  //     ],
  //   };
  // },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
