export default function hmr() {
  if (module.hot) {
    module.hot.accept();
  }
}
