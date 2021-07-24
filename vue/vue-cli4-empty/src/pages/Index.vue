<script>
import MainLayout from '../Layout/MainLayout.vue';
import BlankLayout from '../Layout/BlankLayout.vue';

export default {
  props: ['layout'],
  components: {
    MainLayout,
    BlankLayout
  },
  render(createElement) {
    return createElement(this.currentComp);
  },
  data() {
    return {
      currentComp: 'main-layout'
    };
  },
  watch: {
    '$route.path': function(val) {
      this.currentComp = this.$route.meta.layout || 'main-layout';
    }
  },
  created() {
    this.currentComp = this.layout;
  }
};
</script>
