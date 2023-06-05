import { createRouter, createWebHistory } from 'vue-router';
import UserPage from '@/page/User/UsersPage';
import MainPage from '@/page/MainPage';
import NewUsersPage from '@/page/User/NewUsersPage';
import ArchiveUsersPage from '@/page/User/ArchiveUsersPage';
import ProductLinePage from '@/page/Kitchen/ProductLinePage';
import OrderPage from '@/page/Order/OrderPage';
import NewOrderPage from '@/page/Order/NewOrderPage';
import OrderArchive from '@/page/Order/OrderArchive';
import DishesPage from '@/page/Kitchen/Dishes/DishesPage';
import KitchenPage from '@/page/Kitchen/KitchenPage';
import DeliveryPage from '@/page/Delivery/DeliveryPage';
import BidsPage from '@/page/Bids/BidsPage';
import PromoPage from '@/page/Promo/PromoPage';

const routes = [
	{
		path: '/users_page',
		name: 'Пользователи',
		component: UserPage
	},
	{
		path: '/archive_users',
		name: 'Архив Пользователей',
		component: ArchiveUsersPage
	},
	{
		path: '/index',
		name: 'Главная',
		component: MainPage
	},
	{
		path: '/',
		redirect: '/index'
	},
	{
		path: '/new_users_page',
		name: 'Новые пользователи',
		component: NewUsersPage
	},
	{
		path: '/product_line',
		name: 'Продуктовая линия',
		component: ProductLinePage
	},
	{
		path: '/orders',
		name: 'Заказы',
		component: OrderPage
	},
	{
		path: '/new_orders',
		name: 'Новые заказы',
		component: NewOrderPage
	},
	{
		path: '/archive_order',
		name: 'Заказы в архиве',
		component: OrderArchive
	},
	{
		path: '/dishes',
		name: 'Блюда',
		component: DishesPage
	},
	{
		path: '/kitchen',
		name: 'Кухня: Актуальные заказы',
		component: KitchenPage
	},
	{
		path: '/delivery',
		name: 'Доставка: Актуальные заказы',
		component: DeliveryPage
	},
	{
		path: '/bids',
		name: 'Заявки',
		component: BidsPage
	},
	{
		path: '/promo',
		name: 'Промокоды',
		component: PromoPage
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;