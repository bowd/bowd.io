import "./index.css";
import { Vizualizer } from "./numbers.js";
import { HeapExample, HeapPushExample } from './examples.js';

export default {
  namespace: "leonardo",
  components: {
    vizualizer: Vizualizer,
    "heap-example": HeapExample,
    "heap-push-example": HeapPushExample,
  }
}

