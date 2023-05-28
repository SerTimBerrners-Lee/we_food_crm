<template>
  <a-button type="primary" @click="showDrawer">
    <template #icon><PlusOutlined /></template>
    Новый пользователь
  </a-button>
  <a-drawer
    title="Добавление пользователя"
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
          <a-form-item label="Имя" name="name">
            <a-input v-model:value="form.name" placeholder="Введите имя" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Фамилия" name="surname">
            <a-input v-model:value="form.surname" placeholder="Фамилия" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Роль" name="role">
            <a-select v-model:value="form.role" placeholder="Выберите роль">
              <a-select-option value="user">Покупатель</a-select-option>
              <a-select-option value="manager">Менеджер</a-select-option>
              <a-select-option value="admin">Админ</a-select-option>
              <a-select-option value="cook">Повар</a-select-option>
              <a-select-option value="delivery">Доставщик</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
         <a-form-item label="Адресс" name="adress">
            <a-input v-model:value="form.adress" placeholder="Адресс" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Телефон" name="phone">
            <a-input v-model:value="form.phone" placeholder="Мобильный телефон" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Дата рождения" name="birthday">
            <a-date-picker
              v-model:value="form.birthday"
              style="width: 100%"
              :format="dateFormat"
              :get-popup-container="trigger => trigger.parentElement"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Email" name="email">
            <a-input v-model:value="form.email" placeholder="Почта" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Статус" name="status">
            <a-select v-model:value="form.status">
              <a-select-option value="confirmed">Подтвержден</a-select-option>
              <a-select-option value="not_confirmed">Не подтвержден</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Описание" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="Любое дополнение или заметку"
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

import moment from 'moment';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import LoaderSpin from '@/components/LoaderSpin';
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import { toLocaleDatePicter } from '@/js/date.methods';

export default defineComponent({
  components: {
    PlusOutlined,
    LoaderSpin
  },
  setup() {
    const store = useStore();

    const state = reactive({
      loading: false,
    });

    const form = reactive({
      name: '',
      surname: '',
      role: 'user',
      address: '',
      phone: '',
      birthday: null,
      description: '',
      email: '',
      status: 'not_confirmed'
    });
    const rules = {
      name: [{
        required: true,
        message: 'Введите имя',
      }],
      surname: [{
        required: true,
        message: 'Введите фамилию',
      }],
      role: [{
        required: true,
        message: 'Введите Роль',
      }],
      address: [{
        required: true,
        message: 'Введите Адресс',
      }],
      phone: [{
        required: true,
        message: 'Введите Телефон',
      }],
      birthday: [{
        required: false,
        message: 'Введите дату рождения',
        type: 'object',
      }],
      email: [{
        require: true,
        message: 'Почта обязательна для новых сотрудников'
      }],
      description: [{
        required: false,
        message: 'Please enter url description',
      }],
    };
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    const onSave = async (formaingData) => {
      state.loading = true;
      const result = await store.dispatch('createUser', formaingData);
      state.loading = false;
      
      if (result.success)
        message.success("Пользователь успешно добавлен");
      else {
        const msg = result?.error || "Произошла ошибка при добавлении пользователя";
        message.error(msg);
      }

      return onClose();
    };
    const onFinish = (finish) => {
      const data = JSON.stringify({
        ...finish,
        birthday: finish.birthday ? customFormat(finish.birthday) : null
      });

      onSave(data);
    }
    const onFinishFailed = ({ errorFields }) => {
      console.log("errorFields: ", errorFields);
      return message.error("Были допушены ошибки при заполнении");
    }

    const customFormat = (value) => {
      return toLocaleDatePicter(value)
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
      customFormat,
      state,
      dateFormat,
      moment,
    };
  },
});
</script>