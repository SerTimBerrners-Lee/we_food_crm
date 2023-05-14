import Req from "@/js/reg";

export default {
	state: {
		dishes: []
	},
	getters: {
		getDishes(state) {
			return state.dishes;
		},
	},
	actions: {
		async createDishes(ctx, data) {
			const res = await Req('dishes/create', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: data
			});

			if (res.success && res.data) 
				ctx.commit("add_dishes", res.data);
				
			return res;
		},
		async updateDishes(ctx, data) {
			const res = await Req('dishes/update', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'PUT',
				body: data
			});

			if (res.success && res.data)
				ctx.commit("update_dishes", res.data);
				
			return res;
		},
		async getAllDishes(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`dishes/get_all/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_dishes", res.data);

			return res;
		},
		async getOneDishes(ctx, dishes_id) {
			const res = await Req(`dishes/get_one/${dishes_id}`, {
				method: 'GET'
			});

			return res;
		},
		async getAllBannedDishes(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`dishes/get_all_banned/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_dishes", res.data);

			return res;
		},
		async deleteDishes(ctx, dishes_id) {
			const res = await Req(`dishes/${dishes_id}`, {
				method: "DELETE"
			});

			if (res.success && res.data)
				ctx.commit("delete_dishes", dishes_id);

			return res;
		}
	},
	mutations: {
		get_all_dishes(state, dishes) {
			state.dishes = dishes;
		},
		add_dishes(state, dishes) {
			state.dishes.push(dishes);
		},
		update_dishes(state, update_dishes) {
			state.dishes = state.dishes.map(el => {
				if (el.id === update_dishes.id) return update_dishes;
				return el;
			})
		},
		delete_dishes(state, dishes_id) {
			state.dishes = state.dishes.filter(el => el.id != dishes_id);
		},
	}
}