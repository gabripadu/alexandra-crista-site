<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { handmadeCategoryNavLinks } from '$lib/handmade/gallery';

	let navOnLightBg = $state(false);
	let handmadeNavOpen = $state(false);
	let mobileNavOpen = $state(false);
	let handmadeNavRoot: HTMLDivElement | undefined;
	let handmadeTouchHandled = false;

	afterNavigate(() => {
		mobileNavOpen = false;
		handmadeNavOpen = false;
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!mobileNavOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});

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

	function homeHash(hash: string): string {
		return localizeHref(`${resolve('/')}#${hash}`);
	}

	onMount(() => {
		window.addEventListener('scroll', updateNavContrast, { passive: true });
		window.addEventListener('resize', updateNavContrast);
		window.addEventListener('ac-nav-refresh', updateNavContrast);
		requestAnimationFrame(() => updateNavContrast());

		function closeHandmadeMenu(e: MouseEvent) {
			if (!handmadeNavOpen || !handmadeNavRoot) return;
			if (!handmadeNavRoot.contains(e.target as Node)) {
				handmadeNavOpen = false;
			}
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') handmadeNavOpen = false;
		}
		document.addEventListener('click', closeHandmadeMenu, true);
		window.addEventListener('keydown', onKey);

		return () => {
			window.removeEventListener('scroll', updateNavContrast);
			window.removeEventListener('resize', updateNavContrast);
			window.removeEventListener('ac-nav-refresh', updateNavContrast);
			document.removeEventListener('click', closeHandmadeMenu, true);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<nav
	id="site-nav"
	class="fixed top-0 z-50 flex w-full items-center justify-between border-b px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top,0px))] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 sm:px-5 md:px-8 md:py-3 {navOnLightBg
		? 'border-black/[0.08] bg-white/65'
		: 'border-white/10 bg-black/40'}"
	class:text-black={navOnLightBg}
	class:text-white={!navOnLightBg}
	class:drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)]={!navOnLightBg}
>
	<div class="magnetic-target -mt-px" data-dist="0.2">
		<a
			href={resolve('/')}
			class="nav-logo font-syne min-w-0 max-w-[min(100vw-10rem,28rem)] shrink text-left text-base font-black leading-none tracking-tighter sm:text-lg md:max-w-none md:text-2xl"
		>
			Alexandra Crîsta
		</a>
	</div>
	<div class="flex -translate-y-px items-center gap-2 sm:gap-4 md:gap-10">
		<div
			class="hidden flex-wrap items-center justify-end gap-x-8 gap-y-2 text-[9px] font-bold tracking-[0.28em] uppercase md:flex lg:gap-x-10 lg:text-[10px] lg:tracking-[0.3em]"
		>
			<a href={homeHash('design')} class="transition-opacity hover:opacity-50">Design</a>
			<a
				href={localizeHref(resolve('/handmade'))}
				class="transition-opacity hover:opacity-50"
				data-sveltekit-preload-data="hover"
			>
				Atelier
			</a>
			<div class="relative" bind:this={handmadeNavRoot}>
				<button
					type="button"
					id="nav-handmade-trigger"
					class="nav-handmade-trigger m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-[9px] font-bold tracking-[0.28em] text-current uppercase transition-opacity lg:text-[10px] lg:tracking-[0.3em]"
					aria-expanded={handmadeNavOpen}
					aria-haspopup="true"
					aria-controls="nav-handmade-menu"
					aria-label={handmadeNavOpen
						? 'Închide meniul Handmade'
						: 'Deschide categoriile Handmade: Haine, Inele, Broșe'}
					onpointerdown={(e) => {
						if (e.pointerType !== 'touch') return;
						e.preventDefault();
						e.stopPropagation();
						handmadeTouchHandled = true;
						handmadeNavOpen = !handmadeNavOpen;
					}}
					onclick={(e) => {
						if (handmadeTouchHandled) {
							handmadeTouchHandled = false;
							return;
						}
						e.stopPropagation();
						handmadeNavOpen = !handmadeNavOpen;
					}}
				>
					Handmade
				</button>
				<span
					class="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold tracking-[0.22em] uppercase {navOnLightBg
						? 'text-black/70'
						: 'text-white/80'}"
				>
					Vezi colecțiile
				</span>
				{#if handmadeNavOpen}
					<div
						id="nav-handmade-menu"
						role="menu"
						aria-labelledby="nav-handmade-trigger"
						class="absolute right-0 top-full z-[60] mt-3 min-w-[12.5rem] overflow-hidden rounded-2xl border py-2 shadow-xl backdrop-blur-xl {navOnLightBg
							? 'border-black/[0.12] bg-white/95 text-black shadow-black/10'
							: 'border-white/15 bg-neutral-950/92 text-white shadow-black/50'}"
						transition:fly={{ y: -8, duration: 220, easing: cubicOut }}
					>
						{#each handmadeCategoryNavLinks as item (item.id)}
							<a
								href={resolve(item.path)}
								role="menuitem"
								class="block px-4 py-2.5 text-[9px] font-bold tracking-[0.28em] uppercase transition-colors lg:text-[10px] lg:tracking-[0.3em] {navOnLightBg
									? 'hover:bg-black/[0.06]'
									: 'hover:bg-white/10'}"
								data-sveltekit-preload-data="hover"
								onclick={() => {
									handmadeNavOpen = false;
								}}
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<button
			type="button"
			class="relative z-[102] flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border transition-colors md:hidden {navOnLightBg
				? 'border-black/25 text-black'
				: 'border-white/30 text-white'}"
			aria-expanded={mobileNavOpen}
			aria-controls="site-mobile-nav"
			aria-label={mobileNavOpen ? 'Închide meniul' : 'Deschide meniul'}
			onclick={() => (mobileNavOpen = !mobileNavOpen)}
		>
			<span
				class="block h-0.5 w-5 origin-center rounded-full transition-transform duration-200 {mobileNavOpen
					? 'translate-y-[7px] rotate-45'
					: ''} {navOnLightBg ? 'bg-black' : 'bg-white'}"
			></span>
			<span
				class="block h-0.5 w-5 rounded-full transition-opacity duration-200 {mobileNavOpen
					? 'pointer-events-none opacity-0'
					: ''} {navOnLightBg ? 'bg-black' : 'bg-white'}"
			></span>
			<span
				class="block h-0.5 w-5 origin-center rounded-full transition-transform duration-200 {mobileNavOpen
					? '-translate-y-[7px] -rotate-45'
					: ''} {navOnLightBg ? 'bg-black' : 'bg-white'}"
			></span>
		</button>
		<div class="flex flex-col items-center">
			<a
				href="https://www.instagram.com/alexandracrista_designs/"
				target="_blank"
				rel="noopener noreferrer"
				class="magnetic-target group flex h-11 w-11 items-center justify-center rounded-full border transition-[color,background-color,border-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:h-12 md:w-12 {navOnLightBg
					? 'border-black/25 text-black hover:border-black hover:bg-black hover:text-white focus-visible:outline-black'
					: 'border-white/25 text-white hover:border-white hover:bg-white hover:text-black focus-visible:outline-white'}"
				aria-label="Instagram — profilul Alexandra Crîsta (@alexandracrista_designs)"
			>
				<svg
					class="h-[1.35rem] w-[1.35rem] shrink-0 transition-transform duration-300 group-hover:scale-105 md:h-6 md:w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.65"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
					<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
					<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
				</svg>
			</a>
			<span
				class="mt-1 hidden text-[8px] font-bold tracking-[0.22em] uppercase md:block {navOnLightBg
					? 'text-black/70'
					: 'text-white/80'}"
			>
				Colaborare
			</span>
		</div>
	</div>
	{#if mobileNavOpen}
		<button
			type="button"
			class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] md:hidden"
			aria-label="Închide meniul"
			onclick={() => (mobileNavOpen = false)}
		></button>
		<div
			id="site-mobile-nav"
			class="fixed top-0 right-0 z-[101] flex h-[100dvh] w-[min(100vw-3rem,18.5rem)] flex-col gap-0 overflow-y-auto border-l pt-[calc(4.25rem+env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pl-5 pr-[max(1rem,env(safe-area-inset-right,0px))] shadow-2xl md:hidden {navOnLightBg
				? 'border-black/10 bg-white text-black'
				: 'border-white/10 bg-[#0a0a0a] text-white'}"
			role="dialog"
			aria-modal="true"
			aria-label="Navigare site"
			transition:fly={{ x: 40, duration: 220, easing: cubicOut }}
		>
			<p class="mb-3 font-mono text-[9px] tracking-[0.35em] text-neutral-500 uppercase">Meniu</p>
			<a
				href={homeHash('about')}
				class="border-b py-3.5 text-xs font-bold tracking-[0.28em] uppercase transition-opacity active:opacity-70 {navOnLightBg
					? 'border-black/10'
					: 'border-white/15'}"
				onclick={() => (mobileNavOpen = false)}
			>
				Poveste
			</a>
			<a
				href={homeHash('design')}
				class="border-b py-3.5 text-xs font-bold tracking-[0.28em] uppercase transition-opacity active:opacity-70 {navOnLightBg
					? 'border-black/10'
					: 'border-white/15'}"
				onclick={() => (mobileNavOpen = false)}
			>
				Design
			</a>
			<a
				href={localizeHref(resolve('/handmade'))}
				class="border-b py-3.5 text-xs font-bold tracking-[0.28em] uppercase transition-opacity active:opacity-70 {navOnLightBg
					? 'border-black/10'
					: 'border-white/15'}"
				data-sveltekit-preload-data="hover"
				onclick={() => (mobileNavOpen = false)}
			>
				Atelier
			</a>
			<p
				class="mt-4 mb-1 font-mono text-[9px] tracking-[0.35em] text-neutral-500 uppercase"
			>
				Handmade
			</p>
			{#each handmadeCategoryNavLinks as item (item.id)}
				<a
					href={resolve(item.path)}
					class="border-b py-3 pl-1 text-xs font-bold tracking-[0.22em] uppercase transition-opacity active:opacity-70 {navOnLightBg
						? 'border-black/10'
						: 'border-white/15'}"
					data-sveltekit-preload-data="hover"
					onclick={() => (mobileNavOpen = false)}
				>
					{item.label}
				</a>
			{/each}
			<a
				href={homeHash('handmade')}
				class="mt-1 py-2.5 text-[10px] font-medium tracking-wide text-neutral-500 uppercase underline-offset-4 {navOnLightBg
					? 'underline decoration-black/30'
					: 'underline decoration-white/35'}"
				onclick={() => (mobileNavOpen = false)}
			>
				Secțiunea Atelier
			</a>
			<a
				href={homeHash('colaborare')}
				class="mt-4 border-b py-3.5 text-xs font-bold tracking-[0.28em] uppercase transition-opacity active:opacity-70 {navOnLightBg
					? 'border-black/10'
					: 'border-white/15'}"
				onclick={() => (mobileNavOpen = false)}
			>
				Colaborare
			</a>
		</div>
	{/if}
</nav>

<style>
	.nav-handmade-trigger {
		touch-action: manipulation;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(#nav-handmade-trigger.nav-handmade-trigger:hover) {
			opacity: 0.5;
		}
	}

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
</style>
