export type HandmadeSlide = {
	src: string;
	alt: string;
};

export type HandmadeCategory = {
	id: string;
	serial: string;
	title: string;
	priceLabel: string;
	slides: HandmadeSlide[];
};

const b = '/images/handmade';

export const handmadeCategories: HandmadeCategory[] = [
	{
		id: 'haine',
		serial: 'S/N: HM-HAINE',
		title: 'Haine',
		priceLabel: 'La comandă',
		slides: [
			{
				src: `${b}/haine-01.png`,
				alt: 'Bluză albă handmade cu fundă din organza și perle, pe manechin'
			},
			{
				src: `${b}/haine-02.png`,
				alt: 'Cămașă albă cu mâneci din voal și fundițe catifea vișinie — peisaj de iarnă'
			},
			{
				src: `${b}/haine-03.png`,
				alt: 'Cămașă albă detaliu mâneci și fundă catifea, zăpadă'
			},
			{
				src: `${b}/haine-04.png`,
				alt: 'Cămașă albă volane și tulle, poză în zăpadă'
			},
			{
				src: `${b}/haine-05.png`,
				alt: 'Cămașă albă cu guler punctat cu perle'
			},
			{
				src: `${b}/haine-06.png`,
				alt: 'Cămașă albă cu dantelă la guler, fundal roz'
			},
			{
				src: `${b}/haine-07.png`,
				alt: 'Bluză bleu cu mânecă clopoț și fundă la cot, peisaj zăpadă'
			},
			{
				src: `${b}/haine-08.png`,
				alt: 'Cămașă albă cu inimioare roșii, pe umeraș'
			},
			{
				src: `${b}/haine-09.png`,
				alt: 'Ținută off-shoulder bleumarin cu fundă metalică aurie și pantaloni gri'
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
				alt: 'Flori textile handmade pe mână manechin din lemn — inele și broșe'
			},
			{
				src: '/images/handmade-atelier-2.png',
				alt: 'Broșe mini tricotate pe cartonașe Martie — preț atelier'
			},
			{
				src: '/images/handmade-atelier-3.png',
				alt: 'Triadă broșe organza — galben, roșu și bronz pe cartonașe ilustrate'
			},
			{
				src: `${b}/brose-01.png`,
				alt: 'Trandafiri croșetați în cutie cadou cu fundă'
			},
			{
				src: `${b}/brose-02.png`,
				alt: 'Broșe tricotate roșii pe cartonașe, mini șevalet'
			},
			{
				src: `${b}/brose-03.png`,
				alt: 'Broșă tricotată aurie cu fir mărțișor, cutie cu mușchi'
			},
			{
				src: `${b}/brose-04.png`,
				alt: 'Colectie broșe mini tricotate pe suport lemn'
			},
			{
				src: `${b}/brose-05.png`,
				alt: 'Broșe flori din organza pe cartonașe, tonuri galben, roșu, maro'
			},
			{
				src: `${b}/brose-06.png`,
				alt: 'Manechin cu guler alb și broșe florale colorate handmade'
			},
			{
				src: `${b}/brose-07.png`,
				alt: 'Broșă burgund din organza cu ace, pe pulover crem'
			},
			{
				src: `${b}/brose-08.png`,
				alt: 'Trandafir roșu fabric, broșă pe pulover ribbed crem — fundal roz'
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
				alt: 'Inel statement trandafir roșu din material textil, mână cu manichiură'
			},
			{
				src: `${b}/inele-02.png`,
				alt: 'Inele floare textilă pe mână manechin expoziție'
			}
		]
	}
];
