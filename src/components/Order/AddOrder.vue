<template>
  <a-button type="primary" @click="showDrawer">
    <template #icon><PlusOutlined /></template>
    Новый заказ
  </a-button>
  <a-drawer
    title="Добавление Заказа"
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
        <a-col :span="16">
          <a-form-item label="Даты доставок" name="date_range">
            <a-range-picker
              v-model:value="form.date_range"
              style="width: 100%"
              :format="dateFormat"
              :get-popup-container="trigger => trigger.parentElement"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
         <a-form-item label="Адресс" name="address">
            <a-input v-model:value="form.address" placeholder="Адресс" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Статус оплаты" name="payment_state">
            <a-select v-model:value="form.payment_state" placeholder="Выберите роль">
              <a-select-option value="paid">Оплечено</a-select-option>
              <a-select-option value="not_paid">Не оплачено</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Метод оплаты" name="payment_method">
            <a-select v-model:value="form.payment_method" placeholder="Выберите роль">
              <a-select-option value="cash">Наличными</a-select-option>
              <a-select-option value="card">Картой</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Процесс подтверждения" name="processing">
            <a-select v-model:value="form.processing" placeholder="Выберите роль">
              <a-select-option value="confirmed">Подтвержден</a-select-option>
              <a-select-option value="not_confirmed">Не подтвержден</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

      </a-row>

      <a-row :gutter="16" style="margin-top: 10px; margin-bottom: 10px;">
        <a-col :span="12">
          <a-form-item label="Пользователь" name="user_id">
            <modal-base-users @user-selected="onUserSelected" />
            <h3 v-if="form?.user">Выбранный пользователь: <a> {{ form.user?.name + ' ' + form.user?.surname }} </a></h3>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" style="margin-top: 10px; margin-bottom: 10px;">
        <a-col :span="12">
          <a-form-item label="Продуктовая линейка" name="product_line_id">
            <modal-base-pl @pl-selected="onPlSelected" />
            <h3 v-if="form?.product_line">Продуктовая линейка: <a> {{ form.product_line?.line_name }} </a></h3>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">

        <a-col :span="12">
          <a-form-item label="Кол-во дней доставки делится на:" name="devide_by">
            <a-input-number v-model:value="form.devide_by" :min="1" />
          </a-form-item>
        </a-col>

      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Описание" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="Любое дополнение или заметка"
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
import ModalBaseUsers from '../Users/ModalBaseUsers';
import { toLocaleDatePicter } from '@/js/date.methods';
import ModalBasePl from '../Kitchen/ModalBasePl.vue';

export default defineComponent({
  components: {
    PlusOutlined,
    LoaderSpin,
    ModalBaseUsers,
    ModalBasePl
  },
  setup() {
   
    const store = useStore();

    const state = reactive({
      loading: false,
    });

    const form = reactive({
      date_range: null,
      address: '',
      payment_state: 'Не оплачено',
      payment_method: '',
      processing: 'Не подтверждено',
      user: null,
      product_line: null,
      devide_by: 2,

      description: '',
    });
    const rules = {
      address: [{
        required: true,
        message: 'Введите Адресс',
      }],
      payment_state: [{
        required: true,
        message: 'Введите Статус оплаты',
      }],
      payment_method: [{
        required: true,
        message: 'Введите Метод оплаты',
      }],
      processing: [{
        required: true,
        message: 'Введите Процесс работы над заказом',
      }],
      user: [{
        required: true,
        message: 'Выберите пользователя',
      }],
      devide_by: [{
        required: false,
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
      const result = await store.dispatch('createOrder', formaingData);
      state.loading = false;
      
      if (result.success)
        message.success("Успешно добавлено добавлен");
      else {
        const msg = result?.error || "Произошла ошибка при добавлении";
        message.error(msg);
      }

      return onClose();
    };
    const onFinish = (finish) => {
      let date_range = null;
      if (finish.date_range) {
        const dat1 = customFormat(finish.date_range[0]); 
        const dat2 = customFormat(finish.date_range[1]); 
        date_range = dat1+'|'+dat2;
      }

      console.log("finish: ", finish)
      const data = JSON.stringify({
        ...finish,
        date_range: date_range,
        user_id: form.user?.id,
        product_line_id: form.product_line?.id
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

    const onUserSelected = (selectedUser) => {
      if (selectedUser) form.user = selectedUser;
    }

    const onPlSelected = (selectedPl) => {
      console.log(selectedPl)
      if (selectedPl) form.product_line = selectedPl;
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
      onUserSelected,
      onPlSelected
    };
  },
});
</script>