<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Plus from 'lucide-svelte/icons/plus';
	import HandmadeProductCard from '$lib/handmade/HandmadeProductCard.svelte';
	import { handmadeCategories, handmadeCategoryNavLinks } from '$lib/handmade/gallery';

	let loaderPercentEl: HTMLSpanElement | undefined;
	let loaderProgressEl: HTMLDivElement | undefined;
	let loaderEl: HTMLDivElement | undefined;
	let cursorDotEl: HTMLDivElement | undefined;

	let handmadeFabOpen = $state(false);

	const handmadeFabLinks = [
		{ id: 'haine', href: '/handmade/haine', label: 'Haine' },
		{ id: 'inele', href: '/handmade/inele', label: 'Inele' },
		{ id: 'brose', href: '/handmade/brose', label: 'Broșe' }
	] as const;

	function toggleHandmadeFab() {
		handmadeFabOpen = !handmadeFabOpen;
	}

	function initAnimations() {
		gsap.from('.hero-text-1', { x: -100, opacity: 0, duration: 1.5, ease: 'expo.out' });
		gsap.from('.hero-text-2', { x: 100, opacity: 0, duration: 1.5, delay: 0.2, ease: 'expo.out' });
		gsap.to('#hero-tag', { opacity: 1, duration: 1, delay: 1 });

		gsap.to('#hero-img', {
			y: 150,
			scrollTrigger: {
				trigger: 'body',
				start: 'top top',
				end: 'bottom top',
				scrub: true
			}
		});

		gsap.utils.toArray<Element>('.reveal-text').forEach((text) => {
			gsap.from(text, {
				y: 100,
				opacity: 0,
				duration: 1,
				scrollTrigger: {
					trigger: text,
					start: 'top 85%'
				}
			});
		});

		const container = document.querySelector('.horizontal-container') as HTMLElement | null;
		if (container) {
			gsap.to(container, {
				x: () => -(container.scrollWidth - window.innerWidth),
				ease: 'none',
				scrollTrigger: {
					trigger: '.horizontal-scroll-section',
					start: 'top top',
					end: () => '+=' + container.scrollWidth,
					scrub: 1,
					pin: true,
					anticipatePin: 1
				}
			});
		}

		window.addEventListener('mousemove', onMouseMove);

		document.querySelectorAll('button, a, .group').forEach((elem) => {
			elem.addEventListener('mouseenter', onCursorGrow);
			elem.addEventListener('mouseleave', onCursorShrink);
		});

		document.querySelectorAll('.magnetic-target').forEach((target) => {
			target.addEventListener('mousemove', onMagneticMove);
			target.addEventListener('mouseleave', onMagneticLeave);
		});

		document.querySelectorAll('[data-tilt]').forEach((card) => {
			card.addEventListener('mousemove', onTiltMove);
			card.addEventListener('mouseleave', onTiltLeave);
		});

		const designMagTrack = document.querySelector('.design-magazine-track') as HTMLElement | null;
		const designSection = document.getElementById('design');
		if (designMagTrack && designSection) {
			gsap.fromTo(
				designMagTrack,
				{ y: 0, x: 0 },
				{
					y: () =>
						-Math.max(0, designMagTrack.scrollHeight - designSection.offsetHeight) * 0.38,
					x: () => -Math.min(40, window.innerWidth * 0.022),
					ease: 'none',
					scrollTrigger: {
						trigger: designSection,
						start: 'top bottom',
						end: 'bottom top',
						scrub: 0.55,
						invalidateOnRefresh: true
					}
				}
			);
		}

		ScrollTrigger.refresh();
	}

	function onMouseMove(e: MouseEvent) {
		if (!cursorDotEl) return;
		gsap.to(cursorDotEl, {
			x: e.clientX - 16,
			y: e.clientY - 16,
			duration: 0.5,
			ease: 'power3.out'
		});
	}

	function onCursorGrow() {
		if (!cursorDotEl) return;
		gsap.to(cursorDotEl, { scale: 3, opacity: 0.1 });
	}

	function onCursorShrink() {
		if (!cursorDotEl) return;
		gsap.to(cursorDotEl, { scale: 1, opacity: 1 });
	}

	function onMagneticMove(e: Event) {
		const me = e as MouseEvent;
		const target = me.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = me.clientX - rect.left - rect.width / 2;
		const y = me.clientY - rect.top - rect.height / 2;
		const strength = parseFloat(target.dataset.dist ?? '0.4');
		gsap.to(target, {
			x: x * strength,
			y: y * strength,
			duration: 0.5,
			ease: 'power2.out'
		});
	}

	function onMagneticLeave(e: Event) {
		const target = (e.currentTarget as HTMLElement) ?? undefined;
		if (!target) return;
		gsap.to(target, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
	}

	function onTiltMove(e: Event) {
		const me = e as MouseEvent;
		const card = me.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		const x = (me.clientX - rect.left) / rect.width - 0.5;
		const y = (me.clientY - rect.top) / rect.height - 0.5;
		gsap.to(card, {
			rotateY: x * 20,
			rotateX: y * -20,
			duration: 0.5,
			ease: 'power2.out',
			transformPerspective: 1000
		});
	}

	function onTiltLeave(e: Event) {
		const card = (e.currentTarget as HTMLElement) ?? undefined;
		if (!card) return;
		gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1 });
	}

	function teardownInteractions() {
		if (typeof window === 'undefined' || typeof document === 'undefined') return;
		window.removeEventListener('mousemove', onMouseMove);
		document.querySelectorAll('button, a, .group').forEach((elem) => {
			elem.removeEventListener('mouseenter', onCursorGrow);
			elem.removeEventListener('mouseleave', onCursorShrink);
		});
		document.querySelectorAll('.magnetic-target').forEach((target) => {
			target.removeEventListener('mousemove', onMagneticMove);
			target.removeEventListener('mouseleave', onMagneticLeave);
		});
		document.querySelectorAll('[data-tilt]').forEach((card) => {
			card.removeEventListener('mousemove', onTiltMove);
			card.removeEventListener('mouseleave', onTiltLeave);
		});
	}

	onMount(() => {
		document.documentElement.classList.add('ac-landing');
		gsap.registerPlugin(ScrollTrigger);

		let percent = 0;
		let interval: ReturnType<typeof setInterval>;
		const tick = () => {
			percent++;
			if (loaderPercentEl) loaderPercentEl.textContent = `${percent}%`;
			if (loaderProgressEl) loaderProgressEl.style.transform = `scaleX(${percent / 100})`;

			if (percent >= 100) {
				clearInterval(interval);
				if (loaderEl) {
					gsap.to(loaderEl, {
						y: '-100%',
						duration: 1.2,
						ease: 'expo.inOut',
						onComplete: () => {
							loaderEl!.style.display = 'none';
							initAnimations();
							window.dispatchEvent(new CustomEvent('ac-nav-refresh'));
						}
					});
				}
			}
		};

		interval = setInterval(tick, 15);

		return () => {
			clearInterval(interval);
		};
	});

	onDestroy(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.classList.remove('ac-landing');
		teardownInteractions();
		if (typeof ScrollTrigger !== 'undefined') {
			ScrollTrigger.getAll().forEach((st) => st.kill());
		}
	});
</script>

<svelte:head>
	<title>Alexandra Crîsta | Avant-Garde Fashion</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@100;300;400;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Cursor Spotlight -->
<div
	bind:this={cursorDotEl}
	id="cursor-dot"
	class="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-8 w-8 rounded-full bg-white mix-blend-difference md:block"
></div>

<!-- Preloader -->
<div
	bind:this={loaderEl}
	id="loader"
	class="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-x-hidden bg-white px-4 text-black"
>
	<div class="relative mb-8 overflow-hidden">
		<span class="pointer-events-none select-none text-[20vw] leading-none font-black opacity-[0.03]"
			>CRÎSTA</span
		>
		<div class="absolute inset-0 flex items-center justify-center">
			<span
				bind:this={loaderPercentEl}
				id="loader-percent"
				class="text-5xl font-black tracking-tighter tabular-nums sm:text-7xl md:text-8xl">0%</span
			>
		</div>
	</div>
	<div class="relative h-[1px] w-64 overflow-hidden bg-black/10">
		<div
			bind:this={loaderProgressEl}
			id="loader-progress"
			class="loader-bar absolute inset-0 bg-black"
		></div>
	</div>
</div>

<!-- Hero Section -->
<section
	class="relative z-10 flex min-h-[100svh] items-center justify-center overflow-x-hidden overflow-y-hidden pb-32 pt-14 md:h-[120vh] md:min-h-0 md:pb-0 md:pt-0"
	data-nav-bg="dark"
>
	<div
		class="absolute inset-0 z-0 opacity-20 [background-size:40px_40px] bg-[radial-gradient(circle,#222_1px,transparent_1px)]"
	></div>

	<div
		id="hero-img"
		class="absolute z-0 aspect-[3/4] h-[min(58vh,28rem)] w-auto max-w-[96vw] opacity-[0.52] sm:h-[min(72vh,40rem)] sm:opacity-[0.6] md:h-[min(88vh,48rem)] md:max-w-none md:opacity-[0.65]"
	>
		<img
			src="/images/hero-alexandra.png"
			alt="Alexandra Crîsta — concept vizual"
			class="h-full w-full object-cover object-center"
		/>
	</div>

	<div class="z-10 w-full min-w-0 select-none px-3 text-center text-white md:px-0">
		<h1
			class="flex w-full max-w-[min(100%,100vw-1.5rem)] flex-col items-center leading-none md:max-w-[min(100%,96vw)]"
		>
			<span
				class="hero-text-1 text-[clamp(1.45rem,9.5vw,8.5rem)] font-black tracking-tighter text-balance uppercase italic text-white max-md:leading-[0.95]"
				>ALEXANDRA</span
			>
			<span
				class="hero-text-2 text-[clamp(1.45rem,9.5vw,8.5rem)] font-black tracking-tighter text-balance uppercase text-white max-md:leading-[0.95]"
				>CRÎSTA</span
			>
		</h1>
		<div
			class="mt-8 flex items-center justify-center gap-4 opacity-0 sm:mt-12 sm:gap-8 md:gap-8"
			id="hero-tag"
		>
			<div class="hidden h-px w-10 bg-white/55 sm:block sm:w-16 md:w-[4.5rem]"></div>
			<p
				class="max-w-[min(100%,22rem)] px-0.5 text-[10px] leading-snug font-medium tracking-[0.38em] text-white uppercase sm:max-w-[90vw] sm:text-xs sm:tracking-[0.55em] md:tracking-[0.72em]"
			>
				Sfidând Normele Prin Structură
			</p>
			<div class="hidden h-px w-10 bg-white/55 sm:block sm:w-16 md:w-[4.5rem]"></div>
		</div>
	</div>

	<div
		class="absolute bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-0 right-0 mx-auto flex w-full max-w-[100vw] flex-col gap-8 px-4 font-mono text-[10px] font-bold leading-snug tracking-[0.14em] text-neutral-400 uppercase sm:bottom-12 sm:left-12 sm:right-auto sm:mx-0 sm:max-w-none sm:flex-row sm:gap-16 sm:px-0 sm:text-xs sm:tracking-[0.2em] md:left-24 md:gap-24 md:text-[0.8125rem] md:tracking-[0.22em] lg:gap-28 lg:text-sm"
	>
		<a
			href="https://www.romaniandesignweek.ro/portofoliu/alternative-reality"
			target="_blank"
			rel="noopener noreferrer"
			class="min-w-0 max-w-full transition-opacity hover:opacity-90 sm:max-w-[16rem] md:max-w-[18rem]"
		>
			<span class="mb-1.5 block text-white">RO DESIGN WEEK</span>
			<span class="block font-extrabold text-white/90">Alternative Reality</span>
		</a>
		<a
			href="https://www.instagram.com/p/DGaX8pTCYc3/"
			target="_blank"
			rel="noopener noreferrer"
			class="max-w-[16rem] transition-opacity hover:opacity-90 md:max-w-[18rem]"
		>
			<span class="mb-1.5 block text-white">CRAFTSMANSHIP</span>
			<span class="block font-extrabold text-white/90">100% HANDMADE</span>
		</a>
	</div>
</section>

<!-- About Section -->
<section
	id="about"
	class="relative z-10 overflow-x-hidden bg-white px-4 py-16 text-black sm:px-6 sm:py-24 md:px-24 md:py-60"
	data-nav-bg="light"
>
	<div
		class="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 rotate-[-90deg] origin-left text-[20vw] font-black uppercase whitespace-nowrap opacity-[0.03]"
	>
		MANIFEST
	</div>
	<div class="relative z-10 mx-auto max-w-7xl">
		<h2
			class="reveal-text mb-8 max-w-full text-balance break-words text-3xl leading-[0.95] font-bold tracking-tighter uppercase sm:mb-10 sm:text-4xl md:mb-14 md:max-w-5xl md:text-6xl lg:text-8xl"
		>
			Fiecare cusătură este o decizie arhitecturală.
		</h2>

		<div
			class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14"
		>
			<div class="relative z-20 min-w-0 lg:col-span-6 xl:col-span-5">
				<div class="max-w-xl space-y-4 sm:space-y-5 lg:max-w-none xl:max-w-xl">
					<p
						class="reveal-text border-l-[3px] border-black/35 pl-4 text-lg font-light leading-snug text-neutral-800 italic sm:pl-5 sm:text-xl md:border-l-4 md:pl-7 md:text-2xl md:leading-snug lg:text-[1.85rem] lg:leading-[1.35]"
					>
						„Nu sunt aici doar ca să bifez sarcini, ci ca să creez un context în care oamenii și ideile
						lor să poată străluci fără măști și fără scurtături.”
					</p>
					<p
						class="reveal-text text-base leading-relaxed font-light text-neutral-600 italic sm:text-lg md:text-xl lg:text-2xl"
					>
						Sunt Alexandra Crîsta —
						<strong class="font-medium text-neutral-800">arhitect de experiențe</strong> care pune
						<strong class="font-medium text-neutral-800">autenticitatea</strong> mai presus de zgomotul
						imaginii digitale. În atelier, trec de la idee statică la ceva viu: mesaj, material și trup în
						același ritm.
					</p>
					<p class="reveal-text text-base leading-relaxed font-light text-neutral-600 sm:text-lg md:text-xl">
						„Vizibilitatea” nu îmi ajunge — caut
						<strong class="font-normal text-neutral-800">relevanță</strong>. Îmbin claritatea analizei cu
						intuiția care îndrăznește să rupă tiparul când simt că e nevoie de ceva mai cald. Meșteșugul
						mereu în dialog cu felul în care percepem o piesă, nu cu un mesaj forțat. Când se poate,
						îndrum și alți creativi spre o voce lucidă.
					</p>
					<p class="reveal-text text-base leading-relaxed font-light text-neutral-600 sm:text-lg md:text-xl">
						Mă ghidez după trei linii: conexiune umană autentică,
						<strong class="font-normal text-neutral-800">simplitate strategică</strong> în idei și curajul
						de a învăța din fiecare colecție ca dintr-un laborator.
					</p>
				</div>
				<div class="magnetic-target mt-8 inline-block max-w-full sm:mt-10">
					<a
						href="https://www.instagram.com/alexandracrista_designs/"
						target="_blank"
						rel="noopener noreferrer"
						class="group relative inline-flex max-w-full items-center gap-3 overflow-hidden rounded-full border border-black px-8 py-4 transition-colors duration-500 hover:text-white sm:gap-4 sm:px-12 sm:py-6"
					>
						<div
							class="absolute inset-0 translate-y-full bg-black transition-transform duration-500 group-hover:translate-y-0"
						></div>
						<span class="relative z-10 text-xs font-bold tracking-wide text-[0.8125rem] normal-case md:text-sm">
							Descoperă-mă
						</span>
						<ArrowUpRight
							class="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:rotate-45"
						/>
					</a>
				</div>
			</div>

			<div
				class="relative z-10 mt-8 flex w-full min-w-0 justify-center sm:mt-10 lg:sticky lg:top-32 lg:col-span-6 lg:mt-14 lg:justify-end xl:col-span-7 xl:mt-16"
			>
				<figure
					class="visual-frame visual-frame--light visual-frame--about-hero visual-frame--editorial-drift group relative w-full max-w-[22rem] sm:max-w-[26rem] lg:ml-auto lg:mr-0 lg:max-w-[min(32rem,40vw)] xl:max-w-[36rem]"
				>
					<div class="visual-frame__shell" aria-hidden="true"></div>
					<div class="visual-frame__inner">
						<img
							src="/images/alexandra-editorial.png"
							alt="Alexandra Crîsta — portret editorial, creație cu fundă metalică, peisaj de iarnă"
							class="visual-frame__media h-full w-full object-cover object-[center_22%]"
						/>
					</div>
				</figure>
			</div>
		</div>
	</div>
</section>

<!-- Fashion Week Horizontal Scroll -->
<section
	id="design"
	class="relative z-10 overflow-x-hidden bg-black pt-12 pb-16 md:pt-20 md:pb-28 lg:pb-36 xl:pb-44"
	data-nav-bg="dark"
>
	<div
		class="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
		aria-hidden="true"
	>
		<div class="design-magazine-track relative min-h-[240%] w-full will-change-transform">
			<div class="page-magazine__watermarks">
			<span class="page-magazine__mark page-magazine__mark--a">RUNWAY</span>
			<span class="page-magazine__mark page-magazine__mark--b">MATERIAL</span>
			<span class="page-magazine__mark page-magazine__mark--c">RECICLAT</span>
			<span class="page-magazine__mark page-magazine__mark--d">ATELIER</span>
			<span class="page-magazine__mark page-magazine__mark--e">ARCHIVE</span>
			<span class="page-magazine__mark page-magazine__mark--f page-magazine__mark--outline">STRUCTURĂ</span>
			<span class="page-magazine__mark page-magazine__mark--g">DEADSTOCK</span>
			<span class="page-magazine__mark page-magazine__mark--h page-magazine__mark--outline">TUFTING</span>
			<span class="page-magazine__mark page-magazine__mark--i">ARMURĂ</span>
			<span class="page-magazine__mark page-magazine__mark--j page-magazine__mark--outline">MANIFEST</span>
			<span class="page-magazine__mark page-magazine__mark--k">LABORATOR</span>
			<span class="page-magazine__mark page-magazine__mark--l">TRANSFORMARE</span>
			<span class="page-magazine__mark page-magazine__mark--m page-magazine__mark--outline">CYBERPUNK</span>
			</div>
			<div class="page-magazine__columns page-magazine__columns--in-design" lang="ro">
			<p>
				Fragmente din doze de aluminiu, tăiate și suprapuse ca solzi, traduc un limbaj de armură
				contemporană: strălucire rece, ritm industrial, detaliu care a fost cândva ambalaj efemer. Nu e
				decor — e structură care respiră sub lumină.
			</p>
			<p>
				Materiale din logica șantierului — rezistență, utilitate brută — intră în ansambluri vestimentare ca
				metaforă a reconstrucției: croiala re-echilibrează fragilitatea și rigoarea.
			</p>
			<p>
				Deadstock, in și bumbac brut poartă conversația dintre confortul texturii și asprimea metalelor; nu
				juxtapunem stiluri la întâmplare.
			</p>
			<p>
				Tufting-ul inserează cald și memorii tactile unde predomină reflexiile dure; ancoră spre meșteșug într-un
				peisaj cyberpunk.
			</p>
			<p>
				Alternative Reality propune o etică a transformării: fiecare piesă negociază risipa și onestitatea
				surselor. Arhiva runway e filă dintr-un manifest material.
			</p>
			<p>
				În atelier, patch-urile metalice și textilul sunt mereu testate la tensiune și cusătură; culoarea vine
				des din uzură, nu din paletă impusă.
			</p>
			<p>
				Notă: griurile nu sunt titluri — sunt pulbere tipografică în continuarea reportajului; în spatele
				strălucirii e un gest manual.
			</p>
			<p>
				Runway-ul devine laborator vizual: fiecare trecere anexează o ipoteză despre garderobă când resursele se
				numără cu migă.
			</p>
			</div>
			<p
			class="design-bg-whisper absolute top-[6%] left-[2%] max-w-[15rem] sm:max-w-[17rem] md:left-[4%] md:max-w-[19rem]"
		>
			Aluminiu · solzi din doze · armură modernă · strălucire industrială
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--dim absolute top-[11%] right-[3%] max-w-[14rem] text-right sm:max-w-[16rem] md:right-[5%]"
		>
			Deșeu banal → detaliu prețios · patch metalic · limbaj cyberpunk
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--faint absolute top-[20%] left-[14%] hidden max-w-[16rem] sm:left-[18%] sm:block md:max-w-[18rem]"
		>
			Textură de armură · recunoscibil · fragmente soda cans
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--dim absolute top-[23%] right-[4%] max-w-[13rem] text-right sm:top-[24%] sm:max-w-[15rem] md:top-[27%]"
		>
			Șantier · rigiditate arhitecturală · reconstrucție din declin
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--faint absolute top-[32%] right-[8%] max-w-[15rem] text-right sm:max-w-[17rem] md:right-[10%]"
		>
			Proiectate pentru rezistență brută · utilitate înainte de estetică
		</p>
		<p
			class="design-bg-whisper absolute top-[40%] left-[5%] max-w-[16rem] sm:left-[7%] sm:max-w-[18rem] md:max-w-[20rem]"
		>
			Deadstock · in & bumbac · juxtapunere confort și brutalism material
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--dim absolute top-[48%] left-[10%] hidden max-w-[14rem] md:block md:max-w-[16rem]"
		>
			Nu am vrut deșeuri noi · stocuri rămase · materiale refolosite
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--faint absolute top-[56%] right-[6%] max-w-[15rem] text-right sm:max-w-[17rem]"
		>
			Contrast · finețe fire naturale · asprime metal și șantier
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--dim absolute top-[63%] left-[4%] hidden max-w-[15rem] sm:block md:left-[6%] md:max-w-[17rem]"
		>
			Operă manuală · operă de durată · fiecare piesă negociază cu realul
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--faint absolute top-[72%] right-[10%] hidden max-w-[14rem] text-right text-pretty md:block md:max-w-[16rem]"
		>
			Plastic și metal domonate · inserții de cald · echilibru fragil
		</p>
		<p
			class="design-bg-whisper absolute right-[4%] bottom-[42%] max-w-[15rem] text-right sm:bottom-[40%] sm:max-w-[17rem] md:right-[6%]"
		>
			Tufting · textură moale și colorată · tactilitate umană
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--dim absolute bottom-[34%] left-[6%] hidden max-w-[16rem] lg:block lg:max-w-[18rem]"
		>
			Tehnică de covoare · paltoane · rucsacuri · încălțăminte · inserții tradiționale
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--faint absolute bottom-[24%] right-[12%] max-w-[14rem] text-right sm:max-w-[16rem]"
		>
			Ancoră spre trecut · memorie tactilă · univers futurist temperat
		</p>
		<p
			class="design-bg-whisper absolute bottom-[14%] left-[3%] max-w-[17rem] sm:bottom-[12%] sm:max-w-[20rem] md:left-[5%]"
		>
			Fără deșeuri noi · materiale recuperate · dialog uman — tehnologizat
		</p>
		<p
			class="design-bg-whisper design-bg-whisper--faint absolute bottom-[8%] right-[4%] max-w-[14rem] text-right sm:max-w-[16rem]"
		>
			Alternative Reality · manifest material · reconstruirea sensului
		</p>
		</div>
	</div>
	<div class="relative z-10 mx-auto mb-8 max-w-7xl px-4 md:mb-12 md:px-12 lg:mb-20 lg:px-24">
		<div class="max-w-2xl space-y-4 md:space-y-6">
			<h2 class="font-mono text-[10px] tracking-[0.75em] text-white/50 uppercase sm:text-xs sm:tracking-[1em]">
				RUNWAY ARCHIVE
			</h2>
			<div class="h-[1px] w-40 bg-white/25"></div>
			<p class="text-pretty text-sm leading-relaxed text-white/45 md:text-base">
				Mai jos, arhiva orizontală începe cu atelierul în mișcare — apoi treci prin fiecare capitol de
				prezentare.
			</p>
		</div>
	</div>

	<div
		class="horizontal-scroll-section relative z-10 h-[min(100svh,52rem)] md:h-[118svh] lg:h-[122svh]"
	>
		<div class="horizontal-container flex h-full w-max">
			<div class="relative h-full w-screen shrink-0">
				<div class="design-horizontal-bg" aria-hidden="true">
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-mid design-horizontal-bg__line--delay-2 left-[4%] top-[16%] max-w-[min(38vw,11rem)] font-mono text-[6px] uppercase not-italic tracking-[0.28em] sm:max-w-[13rem] sm:text-[8px] sm:tracking-[0.34em] md:left-[6%] md:top-[20%]"
					>
						Atelier · material în lucru · probă croială · aceeași rigoare ca pe podium
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--ghost design-horizontal-bg__line--life-heavy design-horizontal-bg__line--delay-3 left-[2%] bottom-[26%] hidden font-syne text-[clamp(1.65rem,8.5vw,4.25rem)] font-black leading-[0.92] tracking-[-0.04em] sm:bottom-[30%] sm:block"
					>
						Milano
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--dim design-horizontal-bg__line--life-light design-horizontal-bg__line--delay-1 right-[5%] top-[24%] max-w-[min(40vw,12rem)] text-right font-sans text-[7px] font-light uppercase tracking-[0.38em] sm:text-[9px] md:top-[28%] md:max-w-[14rem]"
					>
						Runway · arhivă · video loop · gri ca filtru editorial
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--pose-br right-[7%] bottom-[34%] max-w-[10rem] text-right font-playfair text-[9px] font-semibold not-italic leading-snug sm:max-w-[12rem] sm:text-[11px]"
					>
						2024 · Maison de Mode · volum și tăietură testate în lumină rece
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--dim design-horizontal-bg__line--life-breathe design-horizontal-bg__line--delay-4 left-[10%] top-[42%] hidden max-w-[9rem] origin-center -rotate-90 font-mono text-[5px] uppercase tracking-[0.48em] lg:block lg:text-[6px]"
					>
						secvență atelier
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-mid design-horizontal-bg__line--delay-4 right-[12%] top-[48%] hidden max-w-[11rem] font-playfair text-[8px] italic leading-relaxed md:block md:text-[10px]"
					>
						Deadstock în conversație cu metal rece — nu decor, structură.
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--pose-tl right-[3%] top-[56%] hidden max-w-[9rem] text-right font-mono text-[5px] font-bold uppercase tracking-[0.42em] md:block md:text-[7px]"
					>
						loop · lumină rece · cadru îngust
					</p>
				</div>
				<div
					class="relative z-10 flex h-full w-full items-center justify-center px-[8vw] pb-12 pt-2 md:px-[10vw] md:pb-16 md:pt-4"
				>
					<div
						class="group relative w-full max-w-[16.25rem] sm:max-w-[17.75rem] md:max-w-[19.5rem] lg:max-w-[21rem] xl:max-w-[22.5rem]"
					>
						<div
							class="aspect-[4/5] max-h-[52svh] w-full overflow-hidden border border-white/5 bg-neutral-900 sm:max-h-[55svh] md:max-h-[58svh]"
						>
							<video
								class="h-full w-full object-cover object-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35 grayscale opacity-70 transition-[filter,opacity] duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-focus-within:grayscale-0 group-focus-within:opacity-100 active:grayscale-0 active:opacity-100"
								src="/videos/about-atelier.mp4"
								autoplay
								muted
								loop
								playsinline
								tabindex="0"
								aria-label="Atelier — material în mișcare, Maison de Mode — atinge sau treci cu mouse-ul pentru culoare"
							></video>
						</div>
						<div class="mt-5 md:mt-6">
							<p class="mb-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
								Milano / 2024
							</p>
							<h3
								class="px-1 text-center text-[1.35rem] font-black leading-[0.98] tracking-tighter text-white uppercase sm:px-0 sm:text-4xl md:text-5xl lg:text-[3rem]"
							>
								Maison de Mode
							</h3>
						</div>
					</div>
				</div>
			</div>
			<div class="relative h-full w-screen shrink-0">
				<div class="design-horizontal-bg" aria-hidden="true">
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-light design-horizontal-bg__line--delay-3 left-[5%] top-[18%] max-w-[min(42vw,12rem)] font-sans text-[6px] font-thin uppercase tracking-[0.42em] sm:text-[9px] sm:tracking-[0.3em] md:left-[7%]"
					>
						Paris · materiale recuperate · siluetă și responsabilitate în același cadru
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--ghost design-horizontal-bg__line--life-heavy design-horizontal-bg__line--delay-1 right-[3%] top-[10%] font-syne text-[clamp(2.1rem,8vw,4rem)] font-black leading-[0.85] tracking-[-0.06em]"
					>
						Gala
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--dim design-horizontal-bg__line--life-mid design-horizontal-bg__line--delay-2 left-[6%] bottom-[30%] max-w-[11rem] font-mono text-[6px] uppercase tracking-[0.22em] sm:max-w-[13rem] sm:text-[8px] sm:tracking-[0.3em]"
					>
						Avant-garde · două corpuri · texturi care nu concurează, se completează
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--pose-br right-[8%] bottom-[22%] max-w-[10rem] text-right font-sans text-[7px] font-medium leading-snug sm:max-w-[12rem] sm:text-[10px]"
					>
						2023 · lumină caldă pe reciclat · prezentare sustenabilă
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--dim design-horizontal-bg__line--life-breathe design-horizontal-bg__line--delay-2 right-[14%] top-[44%] hidden origin-center -rotate-90 font-mono text-[5px] uppercase tracking-[0.5em] md:block md:text-[6px]"
					>
						capitol paris
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-light design-horizontal-bg__line--delay-4 left-[8%] top-[52%] hidden max-w-[12rem] font-playfair text-[9px] italic leading-relaxed sm:block sm:text-[11px]"
					>
						Culoare la hover — același gest ca în atelier: revezi materialul sub lumină nouă.
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--pose-tl left-[3%] top-[66%] max-w-[min(34vw,9rem)] font-mono text-[5px] font-normal uppercase tracking-[0.5em]"
					>
						reciclat · siluetă · dublu cadru
					</p>
				</div>
				<div
					class="relative z-10 flex h-full w-full items-center justify-center px-[8vw] pb-12 pt-2 md:px-[10vw] md:pb-16 md:pt-4"
				>
					<div
						class="w-full max-w-[16.25rem] sm:max-w-[17.75rem] md:max-w-[19.5rem] lg:max-w-[21rem] xl:max-w-[22.5rem]"
					>
					<div
						class="relative aspect-[9/16] max-h-[54svh] w-full overflow-hidden border border-white/5 bg-neutral-900 sm:max-h-[57svh] md:max-h-[60svh]"
					>
						<button
							type="button"
							class="peer absolute inset-0 z-10 cursor-default border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35"
							aria-label="Paris — imagine în tonuri de gri; atinge sau focalizează pentru culori complete"
						></button>
						<img
							src="/images/design-paris.png"
							class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center grayscale opacity-70 transition-[filter,opacity,transform] duration-700 ease-out peer-hover:grayscale-0 peer-hover:opacity-100 peer-hover:scale-[1.02] peer-focus-visible:grayscale-0 peer-focus-visible:opacity-100 peer-focus-visible:scale-[1.02] peer-active:grayscale-0 peer-active:opacity-100 peer-active:scale-[1.02]"
							alt="Paris — prezentare modă sustenabilă, două modele în ținute din materiale reciclate"
						/>
					</div>
					<div class="mt-5 md:mt-6">
						<p class="mb-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">Paris / 2023</p>
						<h3
							class="px-1 text-center text-[1.35rem] font-black leading-[0.98] tracking-tighter text-white uppercase sm:px-0 sm:text-4xl md:text-5xl lg:text-[3rem]"
						>
							Avant-Garde Gala
						</h3>
					</div>
				</div>
				</div>
			</div>
			<div class="relative h-full w-screen shrink-0">
				<div class="design-horizontal-bg" aria-hidden="true">
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-mid design-horizontal-bg__line--delay-1 right-[4%] top-[20%] max-w-[min(44vw,13rem)] text-right font-mono text-[6px] font-semibold uppercase tracking-[0.35em] sm:text-[8px] md:top-[24%]"
					>
						London · The Void Show · proiecție „Alternative Reality” pe linia podiumului
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--ghost design-horizontal-bg__line--life-heavy design-horizontal-bg__line--delay-4 left-[1%] bottom-[16%] font-syne text-[clamp(1.85rem,7.5vw,3.4rem)] font-black leading-[0.88] tracking-[-0.05em]"
					>
						Void
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--dim design-horizontal-bg__line--life-light design-horizontal-bg__line--delay-3 left-[7%] top-[36%] hidden max-w-[12rem] font-sans text-[7px] font-light not-italic tracking-[0.08em] sm:block sm:text-[9px]"
					>
						Cyberpunk temperat · contrast între golul scenei și densitatea ținutei
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-mid design-horizontal-bg__line--delay-2 right-[6%] bottom-[36%] max-w-[11rem] text-right font-playfair text-[8px] not-italic leading-snug sm:max-w-[13rem] sm:text-[11px]"
					>
						2023 · manifest material · fiecare trecere, o ipoteză despre garderobă
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--dim design-horizontal-bg__line--life-breathe design-horizontal-bg__line--delay-1 left-[12%] bottom-[14%] hidden max-w-[10rem] origin-center -rotate-90 font-mono text-[5px] uppercase tracking-[0.48em] lg:block lg:text-[6px]"
					>
						linie podium
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--pose-w left-[5%] top-[58%] max-w-[min(36vw,10rem)] font-mono text-[6px] uppercase tracking-[0.26em] md:max-w-[12rem] md:text-[8px]"
					>
						Metal · textil · lumină scenă — straturi citite de la distanță, apoi de aproape
					</p>
					<p
						class="design-horizontal-bg__line design-horizontal-bg__line--faint design-horizontal-bg__line--life-light design-horizontal-bg__line--delay-4 right-[10%] top-[62%] hidden max-w-[10rem] text-right font-sans text-[6px] font-bold uppercase tracking-[0.24em] sm:block sm:text-[8px]"
					>
						proiecție · linie podium · gri editorial
					</p>
				</div>
				<div
					class="relative z-10 flex h-full w-full items-center justify-center px-[8vw] pb-12 pt-2 md:px-[10vw] md:pb-16 md:pt-4"
				>
					<div
						class="w-full max-w-[16.25rem] sm:max-w-[17.75rem] md:max-w-[19.5rem] lg:max-w-[21rem] xl:max-w-[22.5rem]"
					>
					<div
						class="relative aspect-[9/16] max-h-[54svh] w-full overflow-hidden border border-white/5 bg-neutral-900 sm:max-h-[57svh] md:max-h-[60svh]"
					>
						<button
							type="button"
							class="peer absolute inset-0 z-10 cursor-default border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35"
							aria-label="London — imagine în tonuri de gri; atinge sau focalizează pentru culori complete"
						></button>
						<img
							src="/images/design-london.png"
							class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center grayscale opacity-70 transition-[filter,opacity,transform] duration-700 ease-out peer-hover:grayscale-0 peer-hover:opacity-100 peer-hover:scale-[1.02] peer-focus-visible:grayscale-0 peer-focus-visible:opacity-100 peer-focus-visible:scale-[1.02] peer-active:grayscale-0 peer-active:opacity-100 peer-active:scale-[1.02]"
							alt="London — defilare, model pe podium, proiecție „Alternative Reality”"
						/>
					</div>
					<div class="mt-5 md:mt-6">
						<p class="mb-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">London / 2023</p>
						<h3
							class="px-1 text-center text-[1.35rem] font-black leading-[0.98] tracking-tighter text-white uppercase sm:px-0 sm:text-4xl md:text-5xl lg:text-[3rem]"
						>
							The Void Show
						</h3>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Editorial / portret -->
<section
	id="prezentare-editorial"
	class="relative z-10 overflow-x-hidden bg-white px-4 py-16 text-black sm:px-6 sm:py-24 md:px-24 md:py-32"
	data-nav-bg="light"
>
	<div
		class="pointer-events-none absolute top-24 right-0 text-[14vw] font-black uppercase leading-none text-black/[0.04]"
	>
		VIZUAL
	</div>
	<div
		class="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-x-16"
	>
		<div class="min-w-0 space-y-6 lg:col-span-6">
			<p class="font-mono text-[10px] tracking-[0.45em] text-neutral-400 uppercase">Editorial</p>
			<h2 class="reveal-text text-4xl font-bold tracking-tighter uppercase md:text-6xl">
				Alternative Reality
			</h2>
			<div class="space-y-4 text-lg leading-relaxed text-neutral-600 md:text-xl">
				<p class="reveal-text">
					Alternative Reality este o colecție de tip manifest împotriva consumerismului excesiv care are ca
					punct principal ideea transformării, atât în ceea ce privește procesul de realizare al ținutelor,
					cât și convertibilitatea pieselor vestimentare. Colecția își propune să dezvolte piese complexe,
					reutilizând echipamente de lucru din domeniul construcțiilor ca metaforă pentru construirea unei
					realități alternative.
				</p>
			</div>
		</div>
		<div class="flex w-full justify-center lg:col-span-6 lg:justify-end">
			<figure
				class="visual-frame visual-frame--light visual-frame--editorial-drift group relative w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-[24rem] xl:max-w-[26rem]"
			>
				<div class="visual-frame__shell" aria-hidden="true"></div>
				<div class="visual-frame__inner">
					<img
						src="/images/alternative-reality-editorial.png"
						alt="Alternative Reality — model în mișcare, jachetă statement din materiale reutilizate, cadru editorial urban"
						class="visual-frame__media h-full w-full object-cover object-[center_45%]"
					/>
				</div>
			</figure>
		</div>
	</div>
</section>

<!-- Atelier / Products -->
<section
	id="handmade"
	class="relative z-10 overflow-x-hidden bg-[#fafafa] px-4 py-14 text-black sm:px-6 sm:py-24 md:px-24 md:py-60"
	data-nav-bg="light"
>
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 border-b border-black/10 pb-10 sm:mb-24 sm:pb-14 md:mb-40 md:pb-16">
			<div class="max-w-2xl">
				<h2
					class="mb-5 break-words text-5xl leading-[0.82] font-black tracking-tighter uppercase sm:mb-8 sm:text-7xl md:text-9xl lg:text-[12vw]"
				>
					ATELIER
				</h2>
				<p class="font-mono text-xs tracking-[0.5em] text-neutral-500 uppercase italic">
					Colecție Unicat / Handmade
				</p>
			</div>
			<div
				class="magnetic-target mx-auto mt-20 flex w-full max-w-md flex-col items-center gap-4 md:mt-28 lg:mt-36"
				data-dist="0.2"
			>
				<span
					class="max-w-[19rem] text-center text-[10px] font-bold leading-relaxed tracking-[0.24em] text-neutral-700 uppercase"
				>
					Apasă + pentru categorii — Haine, Inele, Broșe
				</span>
				<div class="relative flex flex-col items-center">
					{#if handmadeFabOpen}
						<div
							id="handmade-fab-actions"
							class="mb-4 flex w-full min-w-[12rem] flex-col items-stretch gap-2.5 sm:min-w-[13.5rem]"
							role="group"
							aria-label="Categorii atelier handmade"
						>
							{#each handmadeCategoryNavLinks as item, i (item.id)}
								<div
									in:fly={{
										y: 14,
										duration: 280,
										delay: 45 + i * 58,
										easing: cubicOut
									}}
								>
									<a
										href={resolve(item.path)}
										class="handmade-fab-link group flex w-full items-center justify-center rounded-full border-2 border-black bg-white px-5 py-2.5 text-center text-[10px] font-bold tracking-[0.22em] text-black uppercase shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-[color,background-color,box-shadow,transform] duration-300 hover:bg-black hover:text-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-black active:scale-[0.98]"
										data-sveltekit-preload-data="hover"
										onclick={() => {
											handmadeFabOpen = false;
										}}
									>
										{item.label}
									</a>
								</div>
							{/each}
						</div>
					{/if}
					<button
						type="button"
						class="handmade-direct-btn group relative flex h-[4.75rem] w-[4.75rem] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-[color,background-color,box-shadow] duration-300 hover:bg-black hover:text-white hover:shadow-[0_16px_48px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-black"
						aria-expanded={handmadeFabOpen}
						aria-controls="handmade-fab-actions"
						aria-haspopup="true"
						aria-label={handmadeFabOpen
							? 'Închide meniul categoriilor'
							: 'Deschide meniul — Haine, Inele, Broșe'}
						onclick={toggleHandmadeFab}
					>
						<Plus
							class="h-7 w-7 transition-transform duration-300 {handmadeFabOpen
								? 'rotate-45'
								: 'group-hover:rotate-90'}"
						/>
					</button>
				</div>
			</div>
		</div>

		<div
			class="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
		>
			{#each handmadeCategories as cat, i (cat.id)}
				<div
					class={handmadeCategories.length === 3 && i === 2
						? 'md:col-span-2 md:flex md:justify-center lg:col-span-1'
						: ''}
				>
					<div
						class={handmadeCategories.length === 3 && i === 2
							? 'w-full max-w-md lg:max-w-none'
							: 'w-full'}
					>
						<HandmadeProductCard
							serial={cat.serial}
							title={cat.title}
							priceLabel={cat.priceLabel}
							slides={cat.slides}
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Colaborare -->
<section
	id="colaborare"
	class="relative isolate z-10 overflow-x-hidden bg-[#0a0a0a] px-4 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-white sm:px-6 md:px-24 md:pt-12 md:pb-10"
	data-nav-bg="dark"
>
	<div
		class="pointer-events-none absolute right-0 bottom-1 z-0 max-w-[100vw] select-none overflow-hidden text-right font-mono text-[clamp(1.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-white/[0.05] uppercase md:bottom-2 md:right-4"
		aria-hidden="true"
	>
		COLABORARE
	</div>
	<div class="relative z-[1] mx-auto w-full max-w-7xl">
		<div
			class="flex w-full max-w-[42rem] flex-col items-start gap-4 text-pretty md:gap-5 lg:max-w-[46rem]"
		>
			<h2
				class="colaborare-headline reveal-text w-full min-w-0 text-balance break-words text-xl leading-[1.08] font-bold tracking-tighter uppercase sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
			>
				Construim împreună universul vestimentar.
			</h2>
			<div class="magnetic-target inline-block" data-dist="0.2">
				<a
					href="https://www.instagram.com/direct/t/17845325352021081/"
					target="_blank"
					rel="noopener noreferrer"
					class="group colaborare-direct-btn relative inline-flex items-center gap-4 border-2 border-white/40 px-8 py-4 text-[10px] font-bold tracking-[0.35em] uppercase shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-white md:px-10 md:py-5"
					aria-label="Scrie-i Alexandrei pe Instagram Direct"
				>
					Scrie-mi
					<ArrowUpRight class="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Grain Overlay -->
<div
	class="pointer-events-none fixed inset-0 z-[9999] opacity-5"
	style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');"
></div>

<style>
	@reference "./layout.css";

	/* CTA Instagram Direct — secțiunea #handmade */
	@keyframes handmade-direct-pulse {
		0%,
		100% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.16),
				0 0 0 0 rgba(0, 0, 0, 0);
		}
		45% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.16),
				0 0 0 10px rgba(0, 0, 0, 0.07);
		}
		55% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.16),
				0 0 0 6px rgba(0, 0, 0, 0.04);
		}
	}
	.handmade-direct-btn {
		animation: handmade-direct-pulse 2.75s ease-in-out infinite;
	}
	.handmade-direct-btn:hover,
	.handmade-direct-btn:focus-visible {
		animation: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.handmade-direct-btn {
			animation: none;
		}
	}

	/* CTA Instagram — secțiunea #colaborare (fundal închis) */
	@keyframes colaborare-direct-pulse {
		0%,
		100% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.35),
				0 0 0 0 rgba(255, 255, 255, 0);
		}
		45% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.35),
				0 0 0 10px rgba(255, 255, 255, 0.07);
		}
		55% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.35),
				0 0 0 6px rgba(255, 255, 255, 0.04);
		}
	}
	.colaborare-direct-btn {
		animation: colaborare-direct-pulse 2.75s ease-in-out infinite;
	}
	.colaborare-direct-btn:hover,
	.colaborare-direct-btn:focus-visible {
		animation: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.colaborare-direct-btn {
			animation: none;
		}
	}

	/* #colaborare: titlu pe un singur rând când încape */
	.colaborare-headline {
		text-wrap: balance;
	}
	@media (min-width: 1280px) {
		.colaborare-headline {
			white-space: nowrap;
			font-size: clamp(2rem, 3.25vw, 3.25rem);
		}
	}

	/* #design — runway orizontal: text în fundal, textură + mișcare neuniformă */
	.design-horizontal-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
		contain: layout style;
	}

	@keyframes design-hbg-life-heavy {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(-0.8deg) scale(1);
			opacity: 1;
		}
		22% {
			transform: translate3d(14px, -10px, 0) rotate(0.6deg) scale(1.045);
			opacity: 0.88;
		}
		55% {
			transform: translate3d(-12px, 12px, 0) rotate(-0.4deg) scale(0.97);
			opacity: 0.94;
		}
		78% {
			transform: translate3d(8px, 6px, 0) rotate(0.35deg) scale(1.02);
			opacity: 0.9;
		}
	}

	@keyframes design-hbg-life-mid {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(0.6deg) scale(1);
			opacity: 1;
		}
		33% {
			transform: translate3d(-10px, 7px, 0) rotate(-0.5deg) scale(1.03);
			opacity: 0.82;
		}
		66% {
			transform: translate3d(8px, -6px, 0) rotate(0.35deg) scale(0.98);
			opacity: 0.91;
		}
	}

	@keyframes design-hbg-life-light {
		0%,
		100% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
		50% {
			transform: translate3d(5px, -8px, 0) scale(1.025);
			opacity: 0.78;
		}
	}

	@keyframes design-hbg-life-breathe {
		0%,
		100% {
			opacity: 1;
		}
		35% {
			opacity: 0.62;
		}
		65% {
			opacity: 0.88;
		}
	}

	.design-horizontal-bg__line {
		position: absolute;
		margin: 0;
		user-select: none;
		text-wrap: balance;
		text-rendering: geometricPrecision;
		-webkit-font-smoothing: antialiased;
	}

	.design-horizontal-bg__line--faint {
		color: rgb(175 175 175 / 0.36);
		text-shadow:
			0 1px 0 rgb(0 0 0 / 0.45),
			0 0 1px rgb(255 255 255 / 0.06),
			0 0 28px rgb(0 0 0 / 0.35);
	}

	.design-horizontal-bg__line--dim {
		color: rgb(155 155 155 / 0.5);
		text-shadow:
			0 1px 0 rgb(0 0 0 / 0.4),
			0 0 1px rgb(255 255 255 / 0.05),
			0 0 22px rgb(0 0 0 / 0.3);
	}

	.design-horizontal-bg__line--ghost {
		color: rgb(130 130 130 / 0.2);
		text-shadow:
			0 2px 0 rgb(0 0 0 / 0.5),
			0 0 2px rgb(255 255 255 / 0.04),
			0 0 40px rgb(0 0 0 / 0.25);
	}

	.design-horizontal-bg__line--life-heavy {
		animation: design-hbg-life-heavy 24s ease-in-out infinite;
		will-change: transform, opacity;
	}

	.design-horizontal-bg__line--life-mid {
		animation: design-hbg-life-mid 17s ease-in-out infinite;
		will-change: transform, opacity;
	}

	.design-horizontal-bg__line--life-light {
		animation: design-hbg-life-light 12s ease-in-out infinite;
		will-change: transform, opacity;
	}

	.design-horizontal-bg__line--life-breathe {
		animation: design-hbg-life-breathe 13s ease-in-out infinite;
		will-change: opacity;
	}

	.design-horizontal-bg__line--delay-1 {
		animation-delay: -2.5s;
	}
	.design-horizontal-bg__line--delay-2 {
		animation-delay: -6s;
	}
	.design-horizontal-bg__line--delay-3 {
		animation-delay: -11s;
	}
	.design-horizontal-bg__line--delay-4 {
		animation-delay: -15s;
	}

	.design-horizontal-bg__line--pose-tl {
		transform: rotate(-2.4deg) translate3d(-3px, 2px, 0);
	}
	.design-horizontal-bg__line--pose-br {
		transform: rotate(1.8deg) translate3d(4px, -1px, 0);
	}
	.design-horizontal-bg__line--pose-w {
		transform: rotate(-4deg) translate3d(2px, 0, 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.design-horizontal-bg__line--life-heavy,
		.design-horizontal-bg__line--life-mid,
		.design-horizontal-bg__line--life-light,
		.design-horizontal-bg__line--life-breathe {
			animation: none;
			will-change: auto;
			opacity: 1;
		}
	}

	/* Text „revistă” în #design + parallax (initAnimations → .design-magazine-track) */
	.design-magazine-track {
		overflow: visible;
		padding: clamp(2.5rem, 5vw, 4.5rem) clamp(0.75rem, 4vw, 3rem) clamp(3rem, 7vw, 5.5rem);
		box-sizing: border-box;
	}
	.page-magazine__columns {
		position: relative;
		z-index: 1;
		column-count: 2;
		column-gap: clamp(1rem, 3vw, 2.25rem);
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-size: 0.625rem;
		line-height: 1.82;
		letter-spacing: 0.03em;
		color: rgb(163 163 163 / 0.62);
		hyphens: auto;
		text-align: justify;
		text-wrap: pretty;
	}
	/* #design: font mai clar pe negru pur */
	.page-magazine__columns--in-design {
		min-height: 70%;
		padding-top: clamp(3rem, 8vh, 5rem);
		color: rgb(180 180 180 / 0.58);
	}
	.page-magazine__columns p {
		margin: 0 0 0.85em;
		break-inside: avoid;
	}
	.page-magazine__columns p:last-child {
		margin-bottom: 0;
	}
	@media (max-width: 639.98px) {
		.design-magazine-track {
			min-height: auto;
			padding: 1rem 0.5rem 2.25rem 0.75rem;
		}
		.page-magazine__columns {
			column-count: 1;
			column-gap: 0.75rem;
			font-size: 0.6875rem;
			line-height: 1.82;
			text-align: left;
		}
		.page-magazine__columns--in-design {
			min-height: auto;
			padding-top: 0.5rem;
		}
	}
	@media (min-width: 640px) {
		.page-magazine__columns {
			column-count: 3;
			font-size: 0.65rem;
			color: rgb(163 163 163 / 0.58);
		}
		.page-magazine__columns--in-design {
			color: rgb(186 186 186 / 0.55);
		}
	}
	@media (min-width: 1024px) {
		.page-magazine__columns {
			column-count: 4;
			font-size: 0.6875rem;
			line-height: 1.88;
			color: rgb(168 168 168 / 0.55);
		}
		.page-magazine__columns--in-design {
			color: rgb(190 190 190 / 0.52);
		}
	}
	.page-magazine__watermarks {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
	}
	.page-magazine__mark {
		position: absolute;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-weight: 200;
		line-height: 1;
		letter-spacing: 0.4em;
		text-transform: uppercase;
		color: rgb(120 120 120 / 0.26);
		white-space: nowrap;
	}
	.page-magazine__mark--a {
		top: 18%;
		left: 50%;
		transform: translateX(-50%) rotate(-8deg);
		font-size: clamp(2.5rem, 14vw, 7rem);
	}
	.page-magazine__mark--b {
		top: 48%;
		right: -4%;
		transform: rotate(72deg);
		transform-origin: center;
		font-size: clamp(2rem, 11vw, 5.5rem);
	}
	.page-magazine__mark--c {
		bottom: 8%;
		left: -2%;
		transform: rotate(-6deg);
		font-size: clamp(1.75rem, 9vw, 4.5rem);
	}
	.page-magazine__mark--d {
		top: 62%;
		left: 12%;
		transform: rotate(6deg);
		font-size: clamp(1.5rem, 8vw, 3.5rem);
		color: rgb(110 110 110 / 0.22);
	}
	.page-magazine__mark--outline {
		color: rgb(24 24 24 / 0.45);
		-webkit-text-stroke: 1px rgb(56 56 56 / 0.32);
		paint-order: stroke fill;
	}
	.page-magazine__mark--e {
		top: 2%;
		left: -8%;
		transform: rotate(-4deg);
		font-size: clamp(2rem, 13vw, 6.5rem);
		color: rgb(96 96 96 / 0.2);
	}
	.page-magazine__mark--f {
		top: 28%;
		right: -6%;
		left: auto;
		transform: rotate(9deg);
		transform-origin: center;
		font-size: clamp(1.85rem, 10.5vw, 5.25rem);
		letter-spacing: 0.35em;
	}
	.page-magazine__mark--g {
		top: 42%;
		left: -14%;
		transform: rotate(-7deg);
		font-size: clamp(1.65rem, 9vw, 4.75rem);
		color: rgb(105 105 105 / 0.19);
	}
	.page-magazine__mark--h {
		top: 58%;
		right: 8%;
		left: auto;
		transform: rotate(-11deg);
		font-size: clamp(1.5rem, 8.5vw, 4.25rem);
		letter-spacing: 0.48em;
	}
	.page-magazine__mark--i {
		top: 74%;
		left: 18%;
		transform: rotate(5deg);
		font-size: clamp(1.45rem, 7.5vw, 3.75rem);
		color: rgb(108 108 108 / 0.21);
	}
	.page-magazine__mark--j {
		top: 88%;
		left: -4%;
		transform: rotate(-6deg);
		font-size: clamp(1.55rem, 8.25vw, 4rem);
	}
	.page-magazine__mark--k {
		top: 14%;
		right: 18%;
		left: auto;
		transform: rotate(14deg);
		transform-origin: center;
		font-size: clamp(1.25rem, 6.25vw, 3rem);
		color: rgb(95 95 95 / 0.18);
		letter-spacing: 0.32em;
	}
	.page-magazine__mark--l {
		top: 50%;
		right: -12%;
		left: auto;
		transform: rotate(78deg);
		transform-origin: center;
		font-size: clamp(1.35rem, 7vw, 3.35rem);
		color: rgb(102 102 102 / 0.17);
		letter-spacing: 0.28em;
	}
	.page-magazine__mark--m {
		bottom: 2%;
		right: 6%;
		top: auto;
		left: auto;
		transform: rotate(4deg);
		font-size: clamp(1.4rem, 7.25vw, 3.6rem);
		letter-spacing: 0.38em;
	}

	/* #design — fragmente de fundal (lizibile, discrete) */
	.design-bg-whisper {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.625rem;
		line-height: 1.65;
		letter-spacing: 0.09em;
		color: rgb(170 170 170 / 0.62);
	}
	@media (min-width: 640px) {
		.design-bg-whisper {
			font-size: 0.6875rem;
		}
	}
	@media (min-width: 768px) {
		.design-bg-whisper {
			font-size: 0.75rem;
		}
	}
	.design-bg-whisper--dim {
		color: rgb(165 165 165 / 0.52);
	}
	.design-bg-whisper--faint {
		color: rgb(155 155 155 / 0.42);
	}

	.loader-bar {
		transform-origin: left;
		transform: scaleX(0);
	}

	/* Cadru tăiat, reutilizat în #design (închis) și secțiune editorial (deschis) */
	.visual-frame {
		filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.22));
	}

	.visual-frame--light {
		filter: drop-shadow(0 20px 36px rgba(0, 0, 0, 0.12));
	}

	.visual-frame__shell {
		position: absolute;
		inset: -3px;
		z-index: 0;
		background: linear-gradient(125deg, #0f0f0f 0%, #2a2a2a 45%, #111 100%);
		opacity: 0.92;
		clip-path: polygon(0% 10%, 11% 0%, 100% 0%, 100% 76%, 86% 100%, 0% 90%);
		transform: rotate(-0.6deg);
		pointer-events: none;
	}

	.visual-frame--light .visual-frame__shell {
		background: linear-gradient(125deg, #d4d4d4 0%, #fafafa 40%, #a3a3a3 100%);
		opacity: 1;
	}

	.visual-frame__inner {
		position: relative;
		z-index: 1;
		overflow: hidden;
		background: #e5e5e5;
		aspect-ratio: 3 / 4;
		width: 100%;
		max-height: min(58vh, 540px);
		clip-path: polygon(0% 9%, 10% 0%, 100% 0%, 100% 77%, 87% 100%, 0% 91%);
		transform: rotate(0.35deg);
		transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.visual-frame--light .visual-frame__inner {
		background: #f5f5f5;
	}

	.visual-frame:hover .visual-frame__inner {
		transform: rotate(0deg) translateY(-2px);
	}

	.visual-frame__media {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 100%;
		min-width: 100%;
		object-position: center center;
		transform: scale(1.02);
		transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.visual-frame:hover .visual-frame__media {
		transform: scale(1.06);
	}

	@media (min-width: 1024px) {
		.visual-frame__inner {
			max-height: min(64vh, 600px);
		}
	}

	/* Cadran mare lângă poveste în #about */
	.visual-frame--about-hero .visual-frame__inner {
		max-height: min(58vh, 520px);
	}

	@media (min-width: 1024px) {
		.visual-frame--about-hero .visual-frame__inner {
			max-height: min(72vh, 640px);
		}
	}

	@keyframes editorial-frame-float {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
		33% {
			transform: translate3d(5px, -10px, 0) rotate(-1.15deg);
		}
		66% {
			transform: translate3d(9px, 6px, 0) rotate(1deg);
		}
	}

	/* #about + #prezentare-editorial: doar loop continuu, fără „breakout” la hover */
	.visual-frame--editorial-drift {
		will-change: transform;
		cursor: default;
		transform-origin: 50% 55%;
	}

	@media (prefers-reduced-motion: no-preference) {
		.visual-frame--editorial-drift {
			animation: editorial-frame-float 7.5s ease-in-out infinite;
		}
	}

	.visual-frame--editorial-drift:hover .visual-frame__inner {
		transform: rotate(0.35deg);
	}

	.visual-frame--editorial-drift:hover .visual-frame__media {
		transform: scale(1.02);
	}

	@media (prefers-reduced-motion: reduce) {
		.visual-frame--editorial-drift {
			animation: none;
		}
	}
</style>
