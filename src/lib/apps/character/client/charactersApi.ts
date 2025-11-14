import { pb, type CharactersRecord, type CharactersResponse } from '$lib';

export type UpdateCharacterData = Omit<Partial<CharactersRecord>, 'avatar'> & { avatar?: File };
export type CreateCharacterData = Omit<Partial<CharactersRecord>, 'avatar'> & { avatar?: File };

class CharactersApi {
	async archive(id: string) {
		const record = await pb.collection('characters').update(id, {
			archived: true
		});
		return record as CharactersResponse;
	}

	async update(id: string, data: UpdateCharacterData): Promise<CharactersResponse> {
		const formData = new FormData();
		if (data.name !== undefined) formData.append('name', data.name);
		if (data.description !== undefined) formData.append('description', data.description);
		if (data.age !== undefined) formData.append('age', String(data.age));
		if (data.avatar) formData.append('avatar', data.avatar);

		const record = await pb!.collection('characters').update(id, formData);
		return record as CharactersResponse;
	}

	async create(data: CreateCharacterData): Promise<CharactersResponse> {
		const formData = new FormData();
		if (data.name) formData.append('name', data.name);
		if (data.description) formData.append('description', data.description);
		if (data.age !== undefined) formData.append('age', String(data.age));
		if (data.avatar) formData.append('avatar', data.avatar);
		if (data.user) formData.append('user', data.user);

		const record = await pb!.collection('characters').create(formData);
		return record as CharactersResponse;
	}
}

export const charactersApi = new CharactersApi();
