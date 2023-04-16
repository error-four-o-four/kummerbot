import { defineConfig } from 'vite';
import cssCustomMedia from 'postcss-custom-media';
import cssNesting from 'postcss-nesting';

export default defineConfig({
  appType: 'spa',
  css: {
    postcss: {
      plugins: [cssCustomMedia(), cssNesting()],
    },
  },
});
