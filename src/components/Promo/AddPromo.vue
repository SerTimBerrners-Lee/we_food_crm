<template>
  <a-button type="primary" @click="showDrawer">
    <template #icon><PlusOutlined /></template>
    Добавить промокод
  </a-button>
  <a-drawer
    title="Добавление Промокода"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form
      :model="form"
      :rules="rules"
      layout="vertical"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >

      <a-row :gutter="16">
        <a-col :span="12">
         <a-form-item label="Название" name="name">
            <a-input v-model:value="form.name" placeholder="Название" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
         <a-form-item label="Описание" name="description">
            <a-input v-model:value="form.description" placeholder="Описание" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">

				<a-col :span="12">
          <a-form-item label="Дата действия до" name="max_date_actions">
            <a-date-picker
              v-model:value="form.max_date_actions"
              style="width: 100%"
              :format="dateFormat"
              :get-popup-container="trigger => trigger.parentElement"
            />
          </a-form-item>
        </a-col>
      </a-row>

     <a-form-item>
       <a-space>
        <a-button @click="onClose">Отменить</a-button>
        <a-button type="primary" html-type="submit" v-if="!state.loading">Сохранить</a-button>
        <LoaderSpin v-else />
      </a-space>
     </a-form-item>
    </a-form>

  </a-drawer>
</template>
<script>
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import LoaderSpin from '@/components/LoaderSpin';
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  components: {
    PlusOutlined,
    LoaderSpin,
  },
  setup() {
   
    const store = useStore();

    const state = reactive({
      loading: false,
    });

    const form = reactive({
			name: '',
      description: '',
			max_date_actions: null
    });
    const rules = {
      name: [{
        required: true,
        message: 'Введите название',
      }],
      description: [{
        required: true,
        message: 'Введите описание',
      }],
			max_date_actions: [{
        required: true,
        message: 'Введите Дату действия',
      }],
    };

    const visible = ref(false);
    const showDrawer = async () => {
      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    const onSave = async (formaingData) => {
      state.loading = true;
      const result = await store.dispatch('createPromo', formaingData);
      state.loading = false;
      
      if (result.success)
        message.success("Успешно обновлено добавлен");
      else {
        const msg = result?.error || "Произошла ошибка при добавлении";
        message.error(msg);
      }

      return onClose();
    };
    const onFinish = (finish) => {
			let max_date_actions;
			if (finish.max_date_actions)
				max_date_actions = finish.max_date_actions.$d;

      const data = JSON.stringify({
        ...finish,
				max_date_actions: max_date_actions
      });

      onSave(data);
    }
    const onFinishFailed = () => {
      return message.error("Были допушены ошибки при заполнении");
    }

		const dateFormat = 'DD.MM.YYYY';

    return {
      form,
      rules,
      visible,
      showDrawer,
      onClose,
      onSave,
      onFinish,
      onFinishFailed,
      state,
			dateFormat
    };
  },
});
</script>