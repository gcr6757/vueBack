<template>
  <div class="login">
    <LoginFoot>
      <template #center>
        <div class="footer">
          vue后台管理系统
        </div>
      </template>
    </LoginFoot>
  </div>
</template>

<script>
//引入公共的底部
import LoginFoot from '@components/ComFooter'
export default {
  components: {
    LoginFoot
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
}
</style>