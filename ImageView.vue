<template>
  <div class="media-container">
    <img v-if="isImage" :src="decodedUrl" :alt="fileName" />
    <video v-else controls>
      <source :src="decodedUrl" :type="videoType" />
      您的浏览器不支持视频播放
    </video>
    <div class="file-name">{{ fileName }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const decodedUrl = ref('');
const fileName = ref('');

const isImage = computed(() => {
  return decodedUrl.value.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
});

const videoType = computed(() => {
  const ext = decodedUrl.value.split('.').pop();
  return `video/${ext === 'mp4' ? 'mp4' : 'avi'}`;
});

onMounted(() => {
  decodedUrl.value = decodeURIComponent(route.query.url);
  fileName.value = route.query.name || '未命名文件';
});
</script>

<style scoped>
.media-container {
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  padding: 20px;
  text-align: center;
}

img, video {
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
}

.file-name {
  margin-top: 10px;
  font-size: 16px;
  color: #666;
}
</style>