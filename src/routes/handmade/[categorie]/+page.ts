import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getHandmadeCategoryBySlug, handmadeCategoryIntro } from '$lib/handmade/gallery';

export const load: PageLoad = ({ params }) => {
	const category = getHandmadeCategoryBySlug(params.categorie);
	if (!category) throw error(404, 'Categorie negăsită');
	const intro = handmadeCategoryIntro[category.id] ?? '';
	return { category, intro };
};
