import Req from "@/js/reg";

export default {
	state: {
		orders: [],
		orders_user: []
	},
	getters: {
		getOrders(state) {
			return state.orders;
		},
		getOrdersUser(state) {
			return state.orders_user;
		}
	},
	actions: {
		async createOrder(ctx, data) {
			const res = await Req('order/create', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: data
			});

			if (res.success && res.data) 
				ctx.commit("add_order", res.data);
				
			return res;
		},
		async updateOrder(ctx, data) {
			const res = await Req('order/update', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'PUT',
				body: data
			});

			if (res.success && res.data)
				ctx.commit("update_order", res.data);
				
			return res;
		},
		async getAllOrders(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`order/get_all/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_orders", res.data);

			return res;
		},
		async getNotConfirmedOrders(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`order/get_not_confirmed/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_orders", res.data);

			return res;
		},
		async getOneOrder(ctx, order_id) {
			const res = await Req(`order/get_one/${order_id}`, {
				method: 'GET'
			});

			return res;
		},
		async getAllBannedOrder(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`order/get_all_banned/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_orders", res.data);

			return res;
		},
		async deleteOrder(ctx, order_id) {
			const res = await Req(`order/${order_id}`, {
				method: "DELETE"
			});

			if (res.success && res.data)
				ctx.commit("delete_order", order_id);

			return res;
		},
		async fetchMyOrders(ctx, user_id) {
			const res = await Req(`order/get_my_orders/${user_id}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_orders_user", res.data);

			return res;
		},
	},
	mutations: {
		get_all_orders(state, orders) {
			state.orders = orders;
		},
		add_order(state, order) {
			state.orders.push(order);

			if (state.orders_user.length)
				state.orders_user.push(order);
		},
		update_order(state, update_order) {
			state.orders = state.orders.map(el => {
				if (el.id === update_order.id) return update_order;
				return el;
			});

			if (state.orders_user.length) {
				state.orders_user = state.orders_user.map(el => {
					if (el.id === update_order.id) return update_order;
					return el;
				});
			}
		},
		delete_order(state, order_id) {
			state.orders = state.orders.filter(el => el.id != order_id);
			if (state.orders_user.length)
				state.orders_user = state.orders_user.filter(el => el.id != order_id);
		},
		get_orders_user(state, orders) {
			state.orders_user = orders;
		}
	}
}