import FileManager from './components/FileManager.vue';

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FileManager', FileManager);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

FileManager.install = install;

export default FileManager;
