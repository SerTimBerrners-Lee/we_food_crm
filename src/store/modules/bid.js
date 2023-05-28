import Req from "@/js/reg";

export default {
	state: {
		bids: []
	},
	getters: {
		getBids(state) {
			return state.bids;
		},
	},
	actions: {
		async getAllBids(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`bid/get_all/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_bids", res.data);

			return res;
		},
	},
	mutations: {
		get_all_bids(state, bids) {
			state.bids = bids;
		},
	}
}