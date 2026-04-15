export type HandmadeSlide = {
	src: string;
	alt: string;
	/** Titlu scurt pentru piesa afișată (opțional). */
	title?: string;
	/** Text de prezentare: materiale, concept, disponibilitate (opțional). */
	description?: string;
	/** Mai multe imagini: carusel ~3s pe pagina categoriei + săgeți în lightbox. */
	carousel?: Array<{ src: string; alt: string }>;
};

export type HandmadeCategory = {
	id: string;
	serial: string;
	title: string;
	priceLabel: string;
	slides: HandmadeSlide[];
};

const b = '/images/handmade';

/** Text scurt sub titlul categoriei pe pagina /handmade/[categorie] */
export const handmadeCategoryIntro: Record<string, string> = {
	haine:
		'Piese vestimentare lucrate manual, cu atenție la croială și detaliu. Fiecare creație pornește de la o idee și se construiește în atelier — la comandă.',
	brose:
		'Broșe și accesorii florale din materiale textile, lucrate manual — formă expresivă, ușor de purtat, ca accent pe palton, sacou sau tricot.',
	inele:
		'Inele statement din materiale textile și accesorii lucrate manual — volum vizual, ușoare la purtat, în serie limitată sau la comandă.'
};

export function getHandmadeCategoryBySlug(slug: string): HandmadeCategory | undefined {
	return handmadeCategories.find((c) => c.id === slug);
}

/** Linkuri nav / FAB atelier — aceleași rute ca `/handmade/[categorie]` */
export const handmadeCategoryNavLinks = [
	{ id: 'haine', path: '/handmade/haine', label: 'Haine' },
	{ id: 'inele', path: '/handmade/inele', label: 'Inele' },
	{ id: 'brose', path: '/handmade/brose', label: 'Broșe' }
] as const;

export const handmadeCategories: HandmadeCategory[] = [
	{
		id: 'haine',
		serial: 'S/N: HM-HAINE',
		title: 'Haine',
		priceLabel: 'La comandă',
		slides: [
			{
				src: `${b}/haine-01.png`,
				alt: 'Bluză albă handmade cu fundă din organza și perle, pe manechin',
				title: 'Bluză «Organza & perle»',
				description:
					'Bluză albă din bumbac cu croi lejer. Fundă amplă din organza transparentă, strânsă în mijloc, cu perle cusute de-a lungul marginilor și la baza gulerului.'
			},
			{
				src: `${b}/haine-02.png`,
				alt: 'Cămașă albă cu mâneci din voal și fundițe catifea vișinie — peisaj de iarnă',
				title: 'Cămașă «Voal & catifea»',
				description:
					'Cămașă albă cu corp simplu și mâneci lungi din voal ușor. La încheieturi, fundițe strânse din catifea vișinie care taie transparența mânecilor.'
			},
			{
				src: `${b}/haine-03.png`,
				alt: 'Cămașă albă detaliu mâneci și fundă catifea, zăpadă',
				title: 'Cămașă «Detaliu iarnă»',
				description:
					'Detaliu pe mânecă: mansetă și bandă verticală din catifea închisă pe fond de bumbac alb. Fundă din aceeași catifea, proporționată, cu nod clar definit.'
			},
			{
				src: `${b}/haine-04.png`,
				alt: 'Cămașă albă volane și tulle, poză în zăpadă',
				title: 'Cămașă «Volane & tulle»',
				description:
					'Cămașă cu umeri și piept acoperite de volane suprapuse din tulle alb. Volumul crește spre linia umerilor; bază simplă pentru echilibru.'
			},
			{
				src: `${b}/haine-05.png`,
				alt: 'Cămașă albă cu guler punctat cu perle',
				title: 'Cămașă «Guler perlat»',
				description:
					'Cămașă albă cu guler clasic; marginea gulerului e marcată de perle mici cusute la distanțe regulate, ca o linie punctată pe alb.'
			},
			{
				src: `${b}/haine-06.png`,
				alt: 'Cămașă albă cu dantelă la guler, fundal roz',
				title: 'Cămașă «Dantelă & roz»',
				description:
					'Cămașă albă cu guler înalt conturat de o bandă îngustă de dantelă. Închidere ascunsă; croi drept pe bust.'
			},
			{
				src: `${b}/haine-07.png`,
				alt: 'Bluză bleu cu mânecă evazată spre bază și fundă la cot, peisaj zăpadă',
				title: 'Bluză «Bleu evazat» — fundă la cot',
				description:
					'Bluză într-o nuanță bleu-pudră. Mânecă trei sferturi, evazată spre bază; fundă legată la cot, din același material, fără contrast de culoare.'
			},
			{
				src: `${b}/haine-08.png`,
				alt: 'Cămașă albă cu inimioare roșii, pe umeraș',
				title: 'Cămașă «Inimi roșii»',
				description:
					'Cămașă albă cu motiv repetat de inimioare roșii, așezate pe piept și umeri. Guler simplu, croi familiar de cămașă.'
			},
			{
				src: `${b}/haine-09.png`,
				alt: 'Ținută off-shoulder bleumarin cu fundă metalică aurie și pantaloni gri',
				title: 'Ținută «Bleumarin & fundă metal»',
				description:
					'Bluză off-shoulder bleumarin, decolteu drept pe umeri. Fundă metalică aurie, rigidă, centrată pe piept. Pantaloni gri, talie înaltă, linie dreaptă.'
			}
		]
	},
	{
		id: 'brose',
		serial: 'S/N: HM-BROȘE',
		title: 'Broșe',
		priceLabel: 'La comandă',
		slides: [
			{
				src: '/images/handmade-atelier-2.png',
				alt: 'Broșe mini croșetate pe cartonașe, flori în culori contrastante',
				title: 'Broșe croșetate mini',
				description:
					'Flori croșetate mici, în stil mandala sau floarea-soarelui, cu combinații contrastante (violet și galben, roșu și galben, accente aurii). Fiecare e montată pe cartonaș cu etichetă vizibilă — format vesel, ușor de purtat zilnic sau de oferit ca mică atenție.'
			},
			{
				src: '/images/handmade-atelier-3.png',
				alt: 'Trei broșe din organză pe cartonașe ilustrate — mod de prezentare atelier',
				title: 'Broșe organza — triadă cromatică',
				description:
					'Set de trei broșe din organză în galben, roșu și bronz, fiecare cu petale suprapuse și volum ușor la margini. Sunt expuse pe cartonașe ilustrate doar ca suport de prezentare pentru atelier — produsul este broșa; cartonașul face parte din modul de aranjare, nu este felicitare.'
			},
			{
				src: `${b}/brose-01.png`,
				alt: 'Cutie cadou cu trandafiri croșetați grena',
				title: 'Set trandafiri grena croșetați',
				description:
					'Cutie plină cu trandafiri croșetați manual din fir grena (lână sau bumbac), culoare bogată și volum rotunjit. Pot fi purtați ca broșe, folosiți ca aplicații pe textile sau păstrați ca piese mici decorative.'
			},
			{
				src: `${b}/brose-02.png`,
				alt: 'Trandafir croșetat pe cartonaș, mini șevalet de lemn',
				title: 'Tablou miniatură — trandafir croșetat',
				description:
					'Trandafir roșu croșetat aplicat pe cartonaș cu design minimalist, așezat pe șevalet de lemn. Depășește simplul accesoriu: poate fi obiect de decor sau felicitare de colecție; mesajul scris de mână întregește piesa.'
			},
			{
				src: `${b}/brose-03.png`,
				alt: 'Broșă aurie croșetată în cutie cadou pe pat de mușchi',
				title: 'Broșă aurie croșetată — cutie cadou',
				description:
					'Piesă festivă din fir metalic auriu, croșetată dens, suprafață strălucitoare. Prezentată pe pat de mușchi natural în cutie, cu șnur tradițional alb-roșu — potrivită ca dar de sărbători sau purtată ca mărțișor.'
			},
			{
				src: `${b}/brose-06.png`,
				alt: 'Guler pe manechin cu broșe florale multicolore',
				title: 'Colecție broșe florale multicolore',
				description:
					'Ansamblu pe manechin cu guler alb: flori croșetate (galben muștar, albastru pastel) și flori din material textil cu buline, alb și grena. Arată cum mai multe broșe transformă un guler simplu într-un punct focal.'
			},
			{
				src: `${b}/brose-07.png`,
				alt: 'Broșă floare din organză vișinie pe pulover crem',
				title: 'Floare din organză vișinie',
				description:
					'Broșă care mizează pe transparență și delicatețe: straturi suprapuse de organză fină (sau mătase arsă pe margini pentru volum), aspect diafan. Centrul florii are un detaliu discret; linie sofisticată, potrivită pentru seară sau ținute speciale.'
			},
			{
				src: `${b}/brose-08.png`,
				alt: 'Broșă trandafir roșu din catifea pe pulover crem',
				title: 'Broșă trandafir din catifea roșie',
				description:
					'Formă de trandafir înflorit, din catifea roșie — textură bogată și culoare profundă. Prindere cu ac lung cu protecție; accent clar de eleganță pe fundal monocrom.'
			}
		]
	},
	{
		id: 'inele',
		serial: 'S/N: HM-INELE',
		title: 'Inele',
		priceLabel: 'La comandă',
		slides: [
			{
				src: `${b}/inele-01.png`,
				alt: 'Inel statement trandafir roșu din material textil, mână cu manichiură',
				title: 'Inel «Trandafir roșu»',
				description:
					'Inel cu floare mare din material textil roșu, petale tăiate și suprapuse spre centru. Banderolă ajustabilă sau inel deschis, ușor, cu baza ascunsă sub floare.'
			},
			{
				src: `${b}/inele-02.png`,
				alt: 'Inele floare textilă pe mână manechin expoziție',
				title: 'Serie «Flori textil»',
				description:
					'Două inele distincte pe același suport: flori textile cu petale în roșu aprins și roz, centre galbene, montate pe inele subțiri metalice sau bandă textilă rigidă.'
			}
		]
	}
];
