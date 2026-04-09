<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Plus from 'lucide-svelte/icons/plus';
	import HandmadeProductCard from '$lib/handmade/HandmadeProductCard.svelte';
	import { handmadeCategories } from '$lib/handmade/gallery';

	let loaderPercentEl: HTMLSpanElement | undefined;
	let loaderProgressEl: HTMLDivElement | undefined;
	let loaderEl: HTMLDivElement | undefined;
	let cursorDotEl: HTMLDivElement | undefined;
	let navOnLightBg = $state(false);

	function updateNavContrast() {
		if (typeof document === 'undefined') return;
		const nav = document.getElementById('site-nav');
		const x = Math.min(window.innerWidth - 8, Math.max(8, window.innerWidth / 2));
		const y = 30;
		for (const el of document.elementsFromPoint(x, y)) {
			if (nav && (el === nav || nav.contains(el))) continue;
			const marker = el.closest('[data-nav-bg]');
			if (marker) {
				navOnLightBg = marker.getAttribute('data-nav-bg') === 'light';
				return;
			}
		}
		navOnLightBg = false;
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
							requestAnimationFrame(() => updateNavContrast());
						}
					});
				}
			}
		};

		interval = setInterval(tick, 15);

		window.addEventListener('scroll', updateNavContrast, { passive: true });
		window.addEventListener('resize', updateNavContrast);
		requestAnimationFrame(() => updateNavContrast());

		return () => {
			clearInterval(interval);
			window.removeEventListener('scroll', updateNavContrast);
			window.removeEventListener('resize', updateNavContrast);
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
	class="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white text-black"
>
	<div class="relative mb-8 overflow-hidden">
		<span class="pointer-events-none select-none text-[20vw] leading-none font-black opacity-[0.03]"
			>CRÎSTA</span
		>
		<div class="absolute inset-0 flex items-center justify-center">
			<span
				bind:this={loaderPercentEl}
				id="loader-percent"
				class="text-8xl font-black tracking-tighter tabular-nums">0%</span
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

<!-- Navigation -->
<nav
	id="site-nav"
	class="fixed top-0 z-50 flex w-full items-center justify-between border-b px-5 py-2.5 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 md:px-8 md:py-3 {navOnLightBg
		? 'border-black/[0.08] bg-white/65'
		: 'border-white/10 bg-black/40'}"
	class:text-black={navOnLightBg}
	class:text-white={!navOnLightBg}
	class:drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)]={!navOnLightBg}
>
	<div class="magnetic-target -mt-px" data-dist="0.2">
		<span
			class="nav-logo max-w-[min(100vw-8rem,28rem)] text-left text-lg font-black tracking-tighter leading-none sm:text-xl md:max-w-none md:text-2xl"
		>
			Alexandra Crîsta
		</span>
	</div>
	<div class="flex -translate-y-px items-center gap-8 md:gap-10">
		<div
			class="hidden flex-wrap items-center justify-end gap-x-8 gap-y-2 text-[9px] font-bold tracking-[0.28em] uppercase md:flex lg:gap-x-10 lg:text-[10px] lg:tracking-[0.3em]"
		>
			<a href="#about" class="transition-opacity hover:opacity-50">Poveste</a>
			<a href="#design" class="transition-opacity hover:opacity-50">Design</a>
			<a href="#handmade" class="transition-opacity hover:opacity-50">Handmade</a>
			<a href="#colaborare" class="transition-opacity hover:opacity-50">Colaborare</a>
		</div>
		<button
			type="button"
			class="magnetic-target group flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border transition-all {navOnLightBg
				? 'border-black/20 hover:bg-black'
				: 'border-white/20 hover:bg-white'}"
			aria-label="Deschide meniul"
		>
			<div
				class="h-px w-5 transition-colors {navOnLightBg
					? 'bg-black group-hover:bg-white'
					: 'bg-white group-hover:bg-black'}"
			></div>
			<div
				class="h-px w-3.5 transition-colors {navOnLightBg
					? 'bg-black group-hover:bg-white'
					: 'bg-white group-hover:bg-black'}"
			></div>
		</button>
	</div>
</nav>

<!-- Hero Section -->
<section class="relative z-10 flex h-[120vh] items-center justify-center overflow-hidden" data-nav-bg="dark">
	<div
		class="absolute inset-0 z-0 opacity-20 [background-size:40px_40px] bg-[radial-gradient(circle,#222_1px,transparent_1px)]"
	></div>

	<div
		id="hero-img"
		class="absolute z-0 aspect-[3/4] h-[min(88vh,48rem)] w-auto opacity-[0.58] sm:opacity-[0.65]"
	>
		<img
			src="/images/hero-alexandra.png"
			alt="Alexandra Crîsta — concept vizual"
			class="h-full w-full object-cover object-center"
		/>
	</div>

	<div class="z-10 select-none text-center text-white">
		<h1 class="flex max-w-[min(100%,96vw)] flex-col items-center px-2 leading-none">
			<span
				class="hero-text-1 text-[clamp(1.75rem,11.5vw,8.5rem)] font-black tracking-tighter uppercase italic text-white"
				>ALEXANDRA</span
			>
			<span
				class="hero-text-2 text-[clamp(1.75rem,11.5vw,8.5rem)] font-black tracking-tighter uppercase text-white"
				>CRÎSTA</span
			>
		</h1>
		<div class="mt-12 flex items-center justify-center gap-8 opacity-0" id="hero-tag">
			<div class="h-px w-16 bg-white/55 sm:w-[4.5rem]"></div>
			<p
				class="max-w-[90vw] px-1 text-[11px] leading-snug font-medium uppercase tracking-[0.65em] text-white sm:text-xs md:tracking-[0.72em]"
			>
				Sfidând Normele Prin Structură
			</p>
			<div class="h-px w-16 bg-white/55 sm:w-[4.5rem]"></div>
		</div>
	</div>

	<div
		class="absolute bottom-12 left-12 flex gap-20 font-mono text-[9px] tracking-widest text-neutral-500 uppercase md:left-24"
	>
		<a
			href="https://www.romaniandesignweek.ro/portofoliu/alternative-reality"
			target="_blank"
			rel="noopener noreferrer"
			class="max-w-[14rem] transition-opacity hover:opacity-75"
		>
			<span class="mb-1 block text-white">RO DESIGN WEEK</span>
			<span class="block">Alternative Reality</span>
		</a>
		<a
			href="https://www.instagram.com/p/DGaX8pTCYc3/"
			target="_blank"
			rel="noopener noreferrer"
			class="max-w-[14rem] transition-opacity hover:opacity-75"
		>
			<span class="mb-1 block text-white">CRAFTSMANSHIP</span>
			<span class="block">100% HANDMADE</span>
		</a>
	</div>
</section>

<!-- About Section -->
<section id="about" class="relative z-10 overflow-hidden bg-white px-6 py-60 text-black md:px-24" data-nav-bg="light">
	<div
		class="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 rotate-[-90deg] origin-left text-[20vw] font-black uppercase whitespace-nowrap opacity-[0.03]"
	>
		MANIFEST
	</div>
	<div class="relative z-10 mx-auto max-w-7xl">
		<h2
			class="reveal-text mb-12 max-w-5xl text-5xl leading-[0.9] font-bold tracking-tighter uppercase md:mb-14 md:text-8xl"
		>
			Fiecare cusătură este o decizie arhitecturală.
		</h2>

		<div
			class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14"
		>
			<div class="relative z-20 min-w-0 lg:col-span-6 xl:col-span-5">
				<div class="max-w-xl space-y-5 lg:max-w-none xl:max-w-xl">
					<p
						class="reveal-text text-xl leading-relaxed font-light text-neutral-600 italic md:text-2xl"
					>
						Sunt Alexandra Crîsta —
						<strong class="font-medium text-neutral-800">arhitect de experiențe</strong> care pune
						<strong class="font-medium text-neutral-800">autenticitatea</strong> mai presus de zgomotul
						imaginii digitale. În atelier, trec de la idee statică la ceva viu: mesaj, material și trup în
						același ritm.
					</p>
					<p class="reveal-text text-lg leading-relaxed font-light text-neutral-600 md:text-xl">
						„Vizibilitatea” nu îmi ajunge — caut
						<strong class="font-normal text-neutral-800">relevanță</strong>. Îmbin claritatea analizei cu
						intuiția care îndrăznește să rupă tiparul când simt că e nevoie de ceva mai cald. Meșteșugul
						mereu în dialog cu felul în care percepem o piesă, nu cu un mesaj forțat. Când se poate,
						îndrum și alți creativi spre o voce lucidă.
					</p>
					<p class="reveal-text text-lg leading-relaxed font-light text-neutral-600 md:text-xl">
						Mă ghidez după trei linii: conexiune umană autentică,
						<strong class="font-normal text-neutral-800">simplitate strategică</strong> în idei și curajul
						de a învăța din fiecare colecție ca dintr-un laborator.
						<span class="mt-4 block border-l-2 border-black/15 pl-5 text-base text-neutral-700 italic md:text-lg">
							„Nu sunt aici doar ca să bifez sarcini, ci ca să creez un context în care oamenii și ideile
							lor să poată străluci fără măști și fără scurtături.”
						</span>
					</p>
				</div>
				<div class="magnetic-target mt-10 inline-block">
					<a
						href="https://www.instagram.com/alexandracrista_designs/"
						target="_blank"
						rel="noopener noreferrer"
						class="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-black px-12 py-6 transition-colors duration-500 hover:text-white"
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
					<div
						class="ac-animate-spin-slow pointer-events-none absolute -bottom-6 -right-5 z-10 flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-white bg-black p-4 text-center text-[7px] leading-tight font-bold tracking-widest text-white uppercase shadow-lg sm:-bottom-8 sm:-right-7 sm:h-36 sm:w-36 sm:border-8 sm:text-[9px]"
					>
						Design • Inovație • Curaj • Măiestrie •
					</div>
				</figure>
			</div>
		</div>
	</div>
</section>

<!-- Fashion Week Horizontal Scroll -->
<section
	id="design"
	class="relative z-10 overflow-hidden bg-black pt-20 pb-28 md:pb-36 lg:pb-44"
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
	<div class="relative z-10 mx-auto mb-12 max-w-7xl px-6 md:px-12 lg:mb-20 lg:px-24">
		<div class="max-w-2xl space-y-6">
			<h2 class="font-mono text-xs tracking-[1em] text-white/50 uppercase">RUNWAY ARCHIVE</h2>
			<div class="h-[1px] w-40 bg-white/25"></div>
			<p class="text-sm leading-relaxed text-white/45 md:text-base">
				Mai jos, arhiva orizontală începe cu atelierul în mișcare — apoi treci prin fiecare capitol de
				prezentare.
			</p>
		</div>
	</div>

	<div class="horizontal-scroll-section relative z-10 h-[118svh] md:h-[122svh]">
		<div class="horizontal-container flex h-full w-max">
			<div
				class="flex h-full w-screen shrink-0 items-center justify-center px-[8vw] pb-12 pt-2 md:px-[10vw] md:pb-16 md:pt-4"
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
							class="text-[1.875rem] font-black leading-[0.98] tracking-tighter text-white uppercase sm:text-4xl md:text-5xl lg:text-[3rem]"
						>
							Maison de Mode
						</h3>
					</div>
				</div>
			</div>
			<div
				class="flex h-full w-screen shrink-0 items-center justify-center px-[8vw] pb-12 pt-2 md:px-[10vw] md:pb-16 md:pt-4"
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
							class="text-[1.875rem] font-black leading-[0.98] tracking-tighter text-white uppercase sm:text-4xl md:text-5xl lg:text-[3rem]"
						>
							Avant-Garde Gala
						</h3>
					</div>
				</div>
			</div>
			<div
				class="flex h-full w-screen shrink-0 items-center justify-center px-[8vw] pb-12 pt-2 md:px-[10vw] md:pb-16 md:pt-4"
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
							class="text-[1.875rem] font-black leading-[0.98] tracking-tighter text-white uppercase sm:text-4xl md:text-5xl lg:text-[3rem]"
						>
							The Void Show
						</h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Editorial / portret -->
<section
	id="prezentare-editorial"
	class="relative z-10 overflow-hidden bg-white px-6 py-24 text-black md:px-24 md:py-32"
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
<section id="handmade" class="relative z-10 bg-[#fafafa] px-6 py-60 text-black md:px-24" data-nav-bg="light">
	<div class="mx-auto max-w-7xl">
		<div class="mb-40 border-b border-black/10 pb-16">
			<div class="max-w-2xl">
				<h2 class="mb-8 text-9xl leading-[0.8] font-black tracking-tighter uppercase md:text-[12vw]">
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
					Comandă unicat — apasă pentru Instagram Direct
				</span>
				<a
					href="https://www.instagram.com/direct/t/17845325352021081/"
					target="_blank"
					rel="noopener noreferrer"
					class="handmade-direct-btn group relative flex h-[4.75rem] w-[4.75rem] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-[color,background-color,box-shadow] duration-300 hover:bg-black hover:text-white hover:shadow-[0_16px_48px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-black"
					aria-label="Deschide conversația cu Alexandra pe Instagram Direct"
				>
					<Plus
						class="h-7 w-7 transition-transform duration-300 group-hover:rotate-90"
					/>
				</a>
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
	class="relative isolate z-10 overflow-hidden bg-[#0a0a0a] px-6 pt-10 pb-8 text-white md:px-24 md:pt-12 md:pb-10"
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
				class="colaborare-headline reveal-text w-full min-w-0 text-2xl leading-[1.08] font-bold tracking-tighter uppercase sm:text-3xl md:text-4xl lg:text-5xl"
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

	@keyframes nav-logo-float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	.nav-logo {
		display: inline-block;
		animation: nav-logo-float 4s ease-in-out infinite;
		will-change: transform;
	}

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
	@media (min-width: 1024px) {
		.colaborare-headline {
			white-space: nowrap;
			font-size: clamp(2rem, 3.25vw, 3.25rem);
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
