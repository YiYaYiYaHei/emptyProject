export default {
  data() {
    return {
      websock: null
    };
  },
  methods: {
    // 创建weosocket: created中调用
    createdWS(url, params) {
      let protocol = '';
      if (window.location.protocol === 'https:') {
        protocol = 'wss:/';
      } else {
        protocol = 'ws:/';
      }
      // 加window.location.host可以走vue.config.js的代理
      const wsuri = `${protocol}${window.location.host}${url}${params ? '?' + params : ''}`;
      console.log('websocket:', wsuri);
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.wsOnopen;
      this.websock.onmessage = this.wsOnmessage;
      this.websock.onerror = this.wsOnerror;
      this.websock.onclose = this.wsClose;
    },
    // 连接建立之后执行send方法发送数据
    wsOnopen() {
      console.log('连接成功');
    },
    // 连接建立失败重连：需在methods中重写此方法
    wsOnerror() {
      // this.websock && this.createdWS();
    },
    // 数据接收：需在methods中重写此方法
    wsOnmessage(e) {
      console.log('接收数据:', JSON.parse(e.data));
    },
    // 数据发送：需要向后端发送数据时调用
    wsSend(Data) {
      console.log('-------------发送数据:', Data);
      this.websock.send(Data);
    },
    // 关闭：beforeDestroy中调用this.closeWS()来关闭连接
    wsClose(e) {
      console.log('断开连接', e);
    },
    closeWS() {
      this.websocket && this.websocket.close();
      this.websocket = null;
    }
  }
};
