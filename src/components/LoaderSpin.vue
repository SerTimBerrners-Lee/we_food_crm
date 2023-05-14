<template>
  <div class="content">
		<a-spin :indicator="indicator" />
	</div>
</template>
<script>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { defineComponent, h } from 'vue';
export default defineComponent({
  setup() {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '24px',
      },
      spin: true,
    });
    return {
      indicator,
    };
  },
});
</script>

<style scoped>
.content {
	margin: 10px;
}
</style> 