export const routes = {
	chat: 'chat',
	view: 'view',
};

export const getData = async (file) => {
	const data = await fetch(file);
	if (data.ok) {
		return {
			error: null,
			data: await data.text(),
		};
	}

	return {
		error: `Unable to fetch data from ${file}`,
		data: null,
	};
};
