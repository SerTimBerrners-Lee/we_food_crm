import Req from "@/js/reg";

export default {
	state: {
		users: []
	},
	getters: {
		getUsers(state) {
			return state.users;
		},
	},
	actions: {
		async createUser(ctx, data) {
			const res = await Req('user/create', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: data
			});

			if (res.success && res.data) 
				ctx.commit("add_user", res.data);
				
			return res;
		},
		async updateUser(ctx, data) {
			const res = await Req('user/update', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'PUT',
				body: data
			});

			if (res.success && res.data)
				ctx.commit("update_user", res.data);
				
			return res;
		},
		async getAllUsers(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`user/get_all/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_user", res.data);

			return res;
		},
		async getOneUser(ctx, user_id) {
			const res = await Req(`user/get_one/${user_id}`, {
				method: 'GET'
			});

			return res;
		},
		async getAllBannedUser(ctx, { page = 1, limit = 25 }) {
			const res = await Req(`user/get_all_banned/${page}/${limit}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_user", res.data);

			return res;
		},
		async deleteUser(ctx, user_id) {
			const res = await Req(`user/${user_id}`, {
				method: "DELETE"
			});

			if (res.success && res.data)
				ctx.commit("delete_user", user_id);

			return res;
		}
	},
	mutations: {
		get_all_user(state, users) {
			state.users = users;
		},
		add_user(state, user) {
			state.users.push(user);
		},
		update_user(state, update_user) {
			state.users= state.users.map(el => {
				if (el.id === update_user.id) return update_user;
				return el;
			})
		},
		delete_user(state, user_id) {
			state.users = state.users.filter(el => el.id != user_id);
		},
	}
}