<template>
  <nuxt-child />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { NuxtError } from '@nuxt/types'
import { Notification } from 'element-ui'
@Component
export default class extends Vue {
  @Prop() private error!: any

  @Watch('error', { immediate: true })
  private handleError(error: NuxtError) {
    console.log('error.vue,', error)
    // alert(error)
    if (error.statusCode === 401) {
      Notification.warning({
        title: '알림',
        message: '토큰만료',
      })
      this.$store.dispatch('LogOut', false)
      return this.$router.push('/login')
    } else if (error.statusCode === 403) {
      return this.$router.push('/403')
    } else if (error.statusCode === 404) {
      return this.$router.push('/404')
    }
    try {
      Notification.success({
        title: 'error',
        message: error.message || '',
      })
    } catch (e) {
      console.log('error.vue', e)
    }
  }
}
</script>

<style lang="scss" scoped></style>
