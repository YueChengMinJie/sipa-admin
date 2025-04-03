import Vue from 'vue';

import svgIcon from '@/components/svgIcon';
import imageIcon from '@/components/imageIcon';

Vue.component('svg-icon', svgIcon);
Vue.component('image-icon', imageIcon);

const req = require.context('./svg', false, /\.svg$/);

const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
