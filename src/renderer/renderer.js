import router from '../router/router.js';
import { appendSection, createSectionFragment, createChosenFragment, createErrorFragment } from './helpers.js';
import { hideChoices, showChoices, showContent } from './transition.js';

export const ATTR_ROUTE = 'data-route';

export const chat = document.getElementById('chat');

export async function render() {
	// compare router pathname (/intern/option-a/etc)
	// with the ids of the rendered sections
	// called by router.route() onpopstate/onpushstate

	// remove incorrect sections
	if (chat.children.length >= router.keys.length) {
		for (let i = chat.childElementCount - 1; i >= 0; i -= 1) {
			const id = chat.children[i].id;
			const key = router.keys[i];

			if (!key || id !== key) {
				chat.children[i].remove();
			}
		}
	}

	// add necessary sections
	for (let step = 0, steps = router.keys.length; step < steps; step += 1) {
		const id = chat.children[step]?.id;
		const key = router.keys[step];
		const isLastSection = step === steps - 1;

		// correct section was rendered
		if (id && id === key) {
			updateChoices({
				section: chat.children[step],
				step,
				isLastSection,
			});
			continue;
		}

		// section was not rendered yet
		const section = appendSection(key);
		const fetched = await router.get(key);

		if (fetched.error) {
			// @todo? remove listeners?
			chat.innerHTML = '';
			const section = appendSection('error');
			section.innerHTML = '';
			section.append(createErrorFragment(router.root + '/chat'));
			return;
		}

		// use DocumentFragment for performance
		const fragment = createSectionFragment(fetched.data);

		section.innerHTML = '';
		section.append(fragment);

		updateChoices({
			section,
			step,
			isLastSection,
		});

		// @todo add animation / scroll to bottom



		// animation
		const [content, choices] = [...section.children];
		hideChoices(choices);
		await showContent(content);
		await showChoices(choices);
	}
}

function updateChoices({ section, step, isLastSection }) {
	const choices = section.children[1];
	const anchors = [...choices.querySelectorAll('a')];
	const chosen = section.children[2];

	if (isLastSection) {
		// show all choices
		choices.classList.remove('is-hidden');
		chosen.classList.add('is-hidden');

		// update href
		for (const elt of anchors) {
			const key = elt.getAttribute(ATTR_ROUTE);
			elt.href = router.getNextUrl(key);
		}
		// @todo add animation
		return;
	}

	// update chosen content
	const key = router.keys[step + 1];
	const href = router.getPrevUrl(step);
	const text = anchors.find((elt) => elt.getAttribute(ATTR_ROUTE) === key)?.innerText;
	chosen.innerHTML = '';
	chosen.append(createChosenFragment(href, text));
	// const anchor = anchors.find((elt) => elt.getAttribute(ATTR_ROUTE) === key);
	// chosen.innerHTML = '';
	// chosen.append(createChosenFragment(href, anchor.innerText));

	// hide filtered choices
	choices.classList.add('is-hidden');
	chosen.classList.remove('is-hidden');

	// update href
	for (const elt of anchors) {
		elt.href = router.getPrevUrl(step);
	}
}
