import { createRouter, createWebHistory } from 'vue-router'
import Test from '../components/test.vue'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import SingleRecord from '../components/SingleRecord.vue'
import OriginalData from '../components/OriginalData.vue'
import NotFound from '../components/NotFound.vue'
import Errors from '../components/Errors.vue'
import ArcGIS from '../components/ArcGIS.vue'
import PageTransition from '../components/PageTransition.vue'
import DetailedInfo from '../components/DetailedInfo.vue'
import SearchWeb from '../components/SearchWeb.vue'
// import Picture from '../components/Picture.vue'
import FullPicture from '../components/FullPicture.vue'
// import Video from '../components/Video.vue'
import FullVideo from '../components/FullVideo.vue'
import Audio from '../components/Audio.vue'
import FullAudio from '../components/FullAudio.vue'
import PDF from '../components/PDF.vue'
import FullPDF from '../components/FullPDF.vue'
import ImageView from '../components/ImageView.vue';
import VideoView from '../components/VideoView.vue';

// Gis地图
import xizhou from '../components/Gis/periods/xizhou.vue'
import chunqiu from '../components/Gis/periods/chunqiu.vue'
import zhanguo from '../components/Gis/periods/zhanguo.vue'
import xihan from '../components/Gis/periods/xihan.vue'
import donghan from '../components/Gis/periods/donghan.vue'
import sanguo from '../components/Gis/periods/sanguo.vue'
import liangjin from '../components/Gis/periods/liangjin.vue'
import nanbeichao from '../components/Gis/periods/nanbeichao.vue'
import tang from '../components/Gis/periods/tang.vue'
import song from '../components/Gis/periods/song.vue'
import yuan from '../components/Gis/periods/yuan.vue'
import ming from '../components/Gis/periods/ming.vue'
import qing from '../components/Gis/periods/qing.vue'





const routes = [
  {
    path: '/',
    meta: {
      title: "西南灾害系统"
    },
    component: PageTransition,
    children: [
      {
        path: '',
        redirect: '/login',
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
      },
      {
        path: '/home',
        name: 'Home',
        component: Home,
        // meta: { requiresAuth: true },
      },
      {
        path: '/SearchWeb',
        name: 'SearchWeb',
        component: SearchWeb,
        meta: { requiresAuth: true },
      },
      {
        path: '/home/SingleRecord',
        name: 'SingleRecord',
        component: SingleRecord,
        meta: { requiresAuth: true }
      },
      {
        path: '/home/OriginalData',
        name: 'OriginalData',
        component: OriginalData,
        meta: { requiresAuth: true }
      },
      // {
      //   path: '/home/Picture',
      //   name: 'Picture',
      //   component: Picture,
      //   meta: { requiresAuth: true }
      // },
      {
        path: '/home/FullPicture/:index',
        name: 'FullPicture',
        component: FullPicture,
        meta: { requiresAuth: true }
      },
      // {
      //   path: '/home/Video',
      //   name: 'Video',
      //   component: Video,
      //   meta: { requiresAuth: true }
      // },
      {
        path: '/home/FullVideo/:id',
        name: 'FullVideo',
        component: FullVideo,
        meta: { requiresAuth: true }
      },
      {
        path: '/home/Audio',
        name: 'Audio',
        component: Audio,
        meta: { requiresAuth: true }
      },
      {
        path: '/home/FullAudio/:id',
        name: 'FullAudio',
        component: FullAudio,
        meta: { requiresAuth: true }
      },
      {
        path: '/home/PDF',
        name: 'PDF',
        component: PDF,
        meta: { requiresAuth: true }
      },
      {
        path: '/home/FullPDF/:id',
        name: 'FullPDF',
        component: FullPDF,
        meta: { requiresAuth: true }
      },
      {
        path: '/ArcGIS',
        name: 'ArcGIS',
        component: ArcGIS,
        meta: { requiresAuth: true }
      },
      {
        path: '/detailed-info/:id',
        name: 'DetailedInfo',
        component: DetailedInfo,
        meta: { requiresAuth: true }
      },
      {
        path: '/imageview',
        name: 'imageview',
        component: () => import('@/components/ImageView.vue'), // 引入你的 ImageView.vue
      },
      {
        path: '/videoview',
        name: 'VideoView',
        component: () => import('@/components/VideoView.vue'), // 引入你的 VideoView.vue
      },
      // gis
      {
        path: '/periods/qing',
        name: 'qing',
        component: qing,
      },
      {
        path: '/periods/ming',
        name: 'ming',
        component: ming,
      },
      {
        path: '/periods/yuan',
        name: 'yuan',
        component: yuan,
      },
      {
        path: '/periods/xizhou',
        name: 'xizhou',
        component: xizhou,
      },
      {
        path: '/periods/song',
        name: 'song',
        component: song,
      },
      {
        path: '/periods/chunqiu',
        name: 'chunqiu',
        component: chunqiu,
      },
      {
        path: '/periods/nanbeizhao',
        name: 'nanbeichao',
        component: nanbeichao,
      },
      {
        path: '/periods/liangjin',
        name: 'liangjin',
        component: liangjin,
      },
      {
        path: '/periods/zhanguo',
        name: 'zhanguo',
        component: zhanguo,
      },
      {
        path: '/periods/tang',
        name: 'tang',
        component: tang,
      },
      {
        path: '/periods/xihan',
        name: 'xihan',
        component: xihan,
      },
      {
        path: '/periods/donghan',
        name: 'donghan',
        component: donghan,
      },
      {
        path: '/periods/sanguo',
        name: 'sanguo',
        component: sanguo,
      },
      {
        path: '/test',
        name: 'Test',
        component: Test,
      },
    ]
  },
  {
    path: '/errors',
    name: 'Errors',
    component: Errors,
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  console.log(isAuthenticated);
  if (to.meta.requiresAuth && isAuthenticated == 'false') {
    // 如果需要登录而用户未登录，则跳转到 404 页面
    next({ name: 'Errors' });
  } else {
    // 如果路由是文件下载路由，则允许访问
    if (to.params.filename) {
      next();
    } else {
      // 否则，继续检查其他路由条件
      const isRouteExist = router.resolve(to).matched.length > 0;

      if (!isRouteExist) {
        // 如果路由不存在，则跳转到 404 页面
        next({ name: 'NotFound' });
      } else {
        // 如果不需要登录或者用户已登录，则正常跳转
        next();
      }
    }
  }
});


