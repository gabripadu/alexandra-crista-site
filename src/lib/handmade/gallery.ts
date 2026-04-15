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
					'Bluză albă lucrată manual, cu fundă din organza fină și accente de perle. Siluetă lejeră, finisaje atente; piesă din atelier, disponibilă la comandă.'
			},
			{
				src: `${b}/haine-02.png`,
				alt: 'Cămașă albă cu mâneci din voal și fundițe catifea vișinie — peisaj de iarnă',
				title: 'Cămașă «Voal & catifea»',
				description:
					'Cămașă albă cu mâneci din voal fin și fundițe din catifea vișinie — contrast între transparență și materiale opace. Croi curat, detalii lucrate în atelier. La comandă.'
			},
			{
				src: `${b}/haine-03.png`,
				alt: 'Cămașă albă detaliu mâneci și fundă catifea, zăpadă',
				title: 'Cămașă «Detaliu iarnă»',
				description:
					'Focus pe mâneci și fundă din catifea, în combinație cu bumbacul alb al piesei. O linie atemporală, gândită pentru ținute de sezon rece. Realizată manual — la comandă.'
			},
			{
				src: `${b}/haine-04.png`,
				alt: 'Cămașă albă volane și tulle, poză în zăpadă',
				title: 'Cămașă «Volane & tulle»',
				description:
					'Straturi de volane și tulle pentru volum controlat și mișcare în imagine. Alb pur pe fundal de zăpadă, aer editorial. Lucrată în atelier, la comandă.'
			},
			{
				src: `${b}/haine-05.png`,
				alt: 'Cămașă albă cu guler punctat cu perle',
				title: 'Cămașă «Guler perlat»',
				description:
					'Guler evidențiat prin perle cusute punctual, lumină discretă pe alb. Piesă rafinată pentru garderoba de zi sau seară. La comandă, în atelier.'
			},
			{
				src: `${b}/haine-06.png`,
				alt: 'Cămașă albă cu dantelă la guler, fundal roz',
				title: 'Cămașă «Dantelă & roz»',
				description:
					'Dantelă fină la guler, contrast soft pe fundal roz. Croială clasică cu accent romantic, executată și finisată manual. Disponibilă la comandă.'
			},
			{
				src: `${b}/haine-07.png`,
				alt: 'Bluză bleu cu mânecă evazată spre bază și fundă la cot, peisaj zăpadă',
				title: 'Bluză «Bleu evazat» — fundă la cot',
				description:
					'Mânecă cu evazare spre bază și fundă proporționată la cot, echilibru între volum și siluetă. Nuanță bleu, detalii finisate în atelier. La comandă.'
			},
			{
				src: `${b}/haine-08.png`,
				alt: 'Cămașă albă cu inimioare roșii, pe umeraș',
				title: 'Cămașă «Inimi roșii»',
				description:
					'Motiv de inimi roșii pe alb, piesă jucăușă și purtabilă. Potrivită cadourilor sau ținutelor cu accente romantice. Lucrată manual — la comandă.'
			},
			{
				src: `${b}/haine-09.png`,
				alt: 'Ținută off-shoulder bleumarin cu fundă metalică aurie și pantaloni gri',
				title: 'Ținută «Bleumarin & fundă metal»',
				description:
					'Bluză off-shoulder bleumarin cu fundă metalică aurie, asortată cu pantaloni gri — siluetă contemporană, prezență clară. Concept la comandă în atelier.'
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
				src: '/images/handmade-atelier-1.png',
				alt: 'Flori textile handmade pe mână manechin din lemn — inele și broșe',
				title: 'Atelier «Flori pe mână»',
				description:
					'Prezentare flori textile handmade pe mână de manechin — inele și broșe coordonate, culoare și volum lucrate manual. Piese unicat sau în serie mică; la comandă.'
			},
			{
				src: '/images/handmade-atelier-2.png',
				alt: 'Broșe mini tricotate pe cartonașe Martie — preț atelier',
				title: 'Broșe mini «Martie»',
				description:
					'Broșe mini tricotate, expuse pe cartonașe dedicate sezonului. Ușoare, expresive, ideale ca accente pe palton sau sacou. Disponibile la atelier.'
			},
			{
				src: '/images/handmade-atelier-3.png',
				alt: 'Triadă broșe organza — galben, roșu și bronz pe cartonașe ilustrate',
				title: 'Triadă «Organza chromatică»',
				description:
					'Set de trei broșe din organza în galben, roșu și bronz, pe cartonașe ilustrate. Contrast de transparență și culoare; lucrate manual. La comandă.'
			},
			{
				src: `${b}/brose-01.png`,
				alt: 'Trandafiri croșetați în cutie cadou cu fundă',
				title: 'Cutie «Trandafiri croșetați»',
				description:
					'Trandafiri croșetați, prezentați în cutie cadou cu fundă — gata de oferit sau de purtat ca broșă. Finisaje atente, lucrate în atelier.'
			},
			{
				src: `${b}/brose-02.png`,
				alt: 'Broșe tricotate roșii pe cartonașe, mini șevalet',
				title: 'Serie «Roșu tricotat»',
				description:
					'Broșe tricotate în roșu intens, aranjate pe cartonașe cu mini șevalet. Textură caldă, prezență grafică pe țesături neutre. La comandă.'
			},
			{
				src: `${b}/brose-03.png`,
				alt: 'Broșă tricotată aurie cu fir mărțișor, cutie cu mușchi',
				title: '«Aur de mărțișor»',
				description:
					'Broșă tricotată aurie cu fir de mărțișor, în cutie cu mușchi — piesă de sezon cu aer festiv. Realizată manual; serie limitată sau la comandă.'
			},
			{
				src: `${b}/brose-04.png`,
				alt: 'Colectie broșe mini tricotate pe suport lemn',
				title: 'Colecție «Mini pe lemn»',
				description:
					'Colecție de broșe mini tricotate, expuse pe suport din lemn — ușor de privit și ales. Fiecare piesă e lucrată individual în atelier.'
			},
			{
				src: `${b}/brose-05.png`,
				alt: 'Broșe flori din organza pe cartonașe, tonuri galben, roșu, maro',
				title: 'Flori organza «Tonuri calde»',
				description:
					'Broșe în formă de floare din organza, pe cartonașe — paletă galben, roșu, maro. Volum aerat, fixare sigură. La comandă în atelier.'
			},
			{
				src: `${b}/brose-06.png`,
				alt: 'Manechin cu guler alb și broșe florale colorate handmade',
				title: 'Expoziție «Manechin & guler»',
				description:
					'Manechin cu guler alb și broșe florale colorate handmade — vizual de vitrină sau expoziție. Combinații de culori la cerere; consultanță în atelier.'
			},
			{
				src: `${b}/brose-07.png`,
				alt: 'Broșă burgund din organza cu ace, pe pulover crem',
				title: '«Burgund pe crem»',
				description:
					'Broșă burgund din organza, cu sistem de prindere cu ace, purtată pe pulover crem — contrast bogat și purtabil zi de zi. Lucrată manual, la comandă.'
			},
			{
				src: `${b}/brose-08.png`,
				alt: 'Trandafir roșu fabric, broșă pe pulover ribbed crem — fundal roz',
				title: '«Trandafir statement»',
				description:
					'Trandafir roșu textil, broșă cu impact vizual pe tricot ribbed crem — fundal roz, atmosferă editorială. Piesă puternică, unică sau la comandă.'
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
					'Inel statement cu trandafir roșu din material textil, volum conturat și ușor la purtat. Finisaje la petale și bază; realizat în atelier — la comandă.'
			},
			{
				src: `${b}/inele-02.png`,
				alt: 'Inele floare textilă pe mână manechin expoziție',
				title: 'Serie «Flori textil»',
				description:
					'Serie de inele cu flori textile, variate ca formă și culoare, prezentate pe mână de expunere. Potrivite ca set sau piesă unică; serie limitată sau la comandă.'
			}
		]
	}
];
