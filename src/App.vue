<template>
  <authorized-page v-if="!isAuth" />
  <a-layout v-else>
    <a-layout-sider
      id="left-menu-custom"
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo">WeFood</div>

      <a-menu v-model="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="$router.push('/index')">
          <fund-outlined />
          <span class="nav-text">Главная</span>
        </a-menu-item>

        <a-menu-item key="2">
          <phone-outlined />
          <span class="nav-text" @click="$router.push('/bids')">Заявки</span>
        </a-menu-item>

        <a-sub-menu key="sub1">
          <template #icon>
            <user-outlined />
          </template>
          <template #title>Пользователи</template>
          <a-menu-item key="3" @click="$router.push('/new_users_page')">Новые</a-menu-item>
          <a-menu-item key="4" @click="$router.push('/users_page')">
            <span class="nav-text">Все</span>
          </a-menu-item>
          <a-menu-item key="5">
            <span class="nav-text" @click="$router.push('/archive_users')">Архив</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub2">
          <template #icon>
            <shopping-outlined />
          </template>
          <template #title>Заказы</template>
          <a-menu-item key="6" @click="$router.push('/new_orders')">Новые</a-menu-item>
          <a-menu-item key="7">
            <span class="nav-text" @click="$router.push('/orders')">Актуальное</span>
          </a-menu-item>
          <a-menu-item key="8">
            <span class="nav-text" @click="$router.push('/archive_order')">Архив</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub3">
          <template #icon>
            <table-outlined />
          </template>
          <template #title>Кухня</template>
          <a-menu-item key="9" @click="$router.push('/product_line')">Продуктовая линия</a-menu-item>
          <a-menu-item key="10" @click="$router.push('/kitchen')">
            <span class="nav-text">Актуальные Заказы</span>
          </a-menu-item>
          <a-menu-item key="11">
            <span class="nav-text">Заказы Архив</span>
          </a-menu-item>
          <a-menu-item key="12" @click="$router.push('/dishes')">
            <span class="nav-text">Блюда</span>
          </a-menu-item>
          <a-menu-item key="13">
            <span class="nav-text">Блюда Архив</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub4">
          <template #icon>
            <delivered-procedure-outlined />
          </template>
          <template #title>Доставка</template>
          <a-menu-item key="14" @click="$router.push('/delivery')">
            <span class="nav-text">Актуальное</span>
          </a-menu-item>
          <a-menu-item key="15">
            <span class="nav-text">Архив</span>
          </a-menu-item>
        </a-sub-menu>

      </a-menu>
    </a-layout-sider>
    <a-layout>

      <a-layout-header :style="{ background: '#fff', padding: 0 }" class="header" >
        <div class="profile">
          <a class="name">{{ authUser?.name }} {{ authUser?.surname }} </a>
          <a-tag><span>{{ authUser?.role }}</span></a-tag>
        </div>
         <a-button danger @click="logout()">
          <template #icon><login-outlined /></template>
          Выйти
        </a-button>
      </a-layout-header>

      <a-layout-content :style="{ margin: '24px 16px 0' }" id="main-content-custom">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view />
        </div>
      </a-layout-content>

    </a-layout>
  </a-layout>
</template>

<script>
import { FundOutlined, ShoppingOutlined, LoginOutlined, UserOutlined, DeliveredProcedureOutlined, PhoneOutlined, TableOutlined } from '@ant-design/icons-vue';
import AuthorizedPage from '@/page/AuthorizedPage.vue';
import { mapGetters, mapMutations } from 'vuex';
import '@/assets/main.css';

export default {
  components: {
    FundOutlined,
    ShoppingOutlined,
    AuthorizedPage,
    LoginOutlined,
    UserOutlined,
    DeliveredProcedureOutlined,
    PhoneOutlined,
    TableOutlined
  },
  data () {
    return {
      selectedKeys: '4',
    };
  },
  computed: mapGetters(['isAuth', 'authUser']),
  methods: {
    ...mapMutations(['logout']),
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
  },
  mounted() {
    console.log("isAuth: ", this.isAuth);
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.ant-layout {
  height: 100vh;
}
.ant-layout-sider, .ant-menu {
  background: #141414 !important;
}
.ant-menu-title-content {
  font-weight: bold;
}
.logo {
  color: white;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
}

#left-menu-custom {
  position: fixed !important;
  height: 100vh;
}

#main-content-custom {
  margin-left: 200px !important;
}

#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

.ant-layout-sider {
  overflow: auto !important;
}
[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}

.profile {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  line-height: 20px;
  margin-right: 20px;
}
.profile .ant-tag {
  font-size: 10px;
  width: fit-content !important;
}
</style>