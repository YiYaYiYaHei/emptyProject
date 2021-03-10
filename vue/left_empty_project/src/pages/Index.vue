/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<script>
import MainLayout from './layout/MainLayout.vue'
import BlankLayout from './layout/BlankLayout.vue'

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
    }
  },
  watch: {
    '$route.path': function(val) {
      this.currentComp = this.$route.meta.layout || 'main-layout';
    }
  },
  created() {
    this.currentComp = this.layout;
  },
  beforeDestroy() {
    this.$store.dispatch('resetStore');
  }
}
</script>

