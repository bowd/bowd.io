import './index.css';
import { Vizualizer } from './numbers.js';
import {
  HeapShowExample,
  HeapBalanceExample,
  HeapPushExample,
} from './examples.js';

export default {
  namespace: 'leonardo',
  components: {
    vizualizer: Vizualizer,
    'heap-show': HeapShowExample,
    'heap-push': HeapPushExample,
    'heap-balance': HeapBalanceExample,
  },
};
