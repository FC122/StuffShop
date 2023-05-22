import { createApp } from 'vue';

function bootstrap() {
  import('./App.vue').then((module) => {
    const App = module.default;
    createApp(App).mount('#app');
  });
}

bootstrap();
