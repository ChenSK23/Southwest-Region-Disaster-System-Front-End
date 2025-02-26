<template>
  <div>
    <video controls :src="url"></video>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const url = ref('');

onMounted(() => {
  // 获取 URL 参数
  url.value = new URLSearchParams(window.location.search).get('url');
});
</script>
