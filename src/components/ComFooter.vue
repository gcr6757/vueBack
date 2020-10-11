<template>
  <div class="comFoot">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.comFoot{
  width: 100%;
  height: 50px;
  background: #000;
  text-align: center;
  line-height: 50px;
  overflow: hidden;
  .center{
    width: 100%;
    height: 100%;
    font-size: 16px;
    color: #b0b0b0;
    font-weight: bold;
  }
}
</style>