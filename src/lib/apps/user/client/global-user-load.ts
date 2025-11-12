import { pb, type UsersResponse, type UserExpand } from '$lib';

export async function globalUserLoad() {
	if (!pb.authStore.isValid) {
		return { user: null, sub: null };
	}

	const res = await pb.collection('users').authRefresh({ expand: 'subs_via_user' });
	const user = res.record as UsersResponse<UserExpand>;
	const sub = user.expand?.subs_via_user?.at(0) ?? null;

	const stories = await pb.collection('stories').getFullList({ filter: `user = "${user.id}"` });
	const characters = await pb
		.collection('characters')
		.getFullList({ filter: `user = "${user.id}"` });

	return { user, sub, stories, characters };
}
