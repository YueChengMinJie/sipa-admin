import Vue from 'vue'
import mqtt from 'mqtt'
import { uuid } from '@/utils/commonTools'

export function mqttSetup() {
  const options = {
    clean: true,
    connectTimeout: 5000,
    clientId: `ams-pc-${process.env.VUE_APP_ENV}-${uuid()}`,
    username: 'admin',
    password: 'emqx@admin'
  }

  const client = mqtt.connect(process.env.VUE_APP_MQTT_URL, options)

  client.on('connect', () => {
    console.log('EMQX连接成功')
  })

  client.on('reconnect', error => {
    console.log('正在重连EMQX:', error)
  })

  client.on('error', error => {
    console.log('EMQX连接失败:', error)
  })

  client.on('end', error => {
    console.log('与EMQX断开连接:', error)
  })

  Vue.prototype.$mqttClient = client

  window.addEventListener('beforeunload', function () {
    disConnectMqtt()
  })
}

export function disConnectMqtt() {
  if (Vue.prototype.$mqttClient) {
    console.log('断开EMQX连接')
    Vue.prototype.$mqttClient.end()
    Vue.prototype.$mqttClient = null
  }
}
