import {mapGetters, mapState} from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    }),
    ...mapState({
      userRole: state => state.userInfo.userInfo.role
    })
  },
  methods: {
    /* 退出 */
    logout(msg = '注销成功', type = 'success') {
      msg && this.$message[type](msg);
      localStorage.clear();
      this.$store.dispatch('resetStore');
      this.$router.push('/login');
    }
  }
};
