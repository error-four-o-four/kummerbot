import { defineConfig } from 'vite';
import cssCustomMedia from 'postcss-custom-media';
import cssNesting from 'postcss-nesting';

// import basicSSL from '@vitejs/plugin-basic-ssl';

export default ({ mode }) => {
  const isDevMode = mode === 'development';

  // const plugins = isDevMode ? [basicSSL()] : null;
  // const server = isDevMode ? { https: true } : null;

  return defineConfig({
    appType: 'spa',
    // plugins,
    // server,
    css: {
      postcss: {
        plugins: [cssCustomMedia(), cssNesting()],
      },
    },
  });
};
