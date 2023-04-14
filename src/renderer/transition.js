function animateTo(elt, keyframes, options) {
	const animation = elt.animate(keyframes, {
		...options,
		fill: 'forwards',
	});

	return new Promise((resolve) => {
		animation.addEventListener('finish', () => {
			animation.commitStyles();
			animation.cancel();
			resolve(animation);
		});
	});
}

export function showContent(elt) {
	const keyframes = [
		{
			transform: 'scale(0.9)',
			opacity: 0,
		},
		{
			transform: 'scale(1.05)',
			opacity: 1,
		},
		{
			transform: 'scale(1)',
			opacity: 1,
		},
	];

	const options = {
		duration: 300,
		easing: 'ease-out',
	};

	return animateTo(elt, keyframes, options);
}

export function hideChoices(elt) {
	for (const child of elt.children) {
		child.classList.add('is-transparent');
	}
}

export function showChoices(elt) {
	const keyframes = [
		{
			opacity: 0,
		},
		{
			opacity: 1,
		},
	];

	const promises = [...elt.children].map((child, i) => {
		const promise = animateTo(child, keyframes, {
			duration: 300,
			delay: i * 200,
			easing: 'ease-out',
		});

		promise.then((p) => console.log(p.effect.target === child));
	});

	return promises.at(-1);
}
