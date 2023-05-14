import Req from "@/js/reg";

export default {
	state: {
		products_line: []
	},
	getters: {
		getProductsLine(state) {
			return state.products_line;
		},
	},
	actions: {
		async createProductLine(ctx, data) {
			const res = await Req('product_line/create', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: data
			});

			if (res.success && res.data) 
				ctx.commit("add_products_line", res.data);
				
			return res;
		},
		async getAllProductLine(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`product_line/get_all/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_products_line", res.data);

			return res;
		},
		async getAllBannedProductLine(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`product_line/get_all_banned/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_products_line", res.data);

			return res;
		},
		async deleteProductLine(ctx, pl_id) {
			const res = await Req(`product_line/${pl_id}`, {
				method: "DELETE"
			});

			if (res.success && res.data)
				ctx.commit("delete_products_line", pl_id);

			return res;
		},
		async getOneProductLine(ctx, pl_id) {
			const res = await Req(`product_line/get_one/${pl_id}`, {
				method: "GET"
			});

			return res;
		},
		async updateProductLine(ctx, data) {
			const res = await Req(`product_line/update`, {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'PUT',
				body: data
			});
			
			if (res.success && res.data)
				ctx.commit("update_product_line", res.data);

			return res;
		}
	},
	mutations: {
		get_all_products_line(state, products_line) {
			state.products_line = products_line;
		},
		update_product_line(state, update_pl) {
			state.products_line = state.products_line.map(el => {
				if (el.id === update_pl.id) return update_pl;
				return el;
			});
		},
		add_products_line(state, product_line) {
			state.products_line.push(product_line);
		},
		delete_products_line(state, product_line_id) {
			state.products_line = state.products_line.filter(el => el.id != product_line_id);
		},
	}
}