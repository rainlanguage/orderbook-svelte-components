<script lang="ts">
	import '../app.postcss';
	import { getOrderbookAddress, initOrderbook, orderbook } from '$lib';
	import { browser } from '$app/environment';
	import { configureChains } from '@wagmi/core';
	import { avalanche, mainnet, goerli, polygonMumbai } from '@wagmi/core/chains';
	import { createConfig, account } from 'svelte-wagmi-stores';
	import { Web3Modal } from '@web3modal/html';
	import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
	import {
		Button,
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Input,
		Label,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	let address: string = '0x34200e026fbac0c902a0ff18e77a49265ca6ac99',
		subgraphEndpoint: string = 'https://nhs-sg-router.hello-8ae.workers.dev/';

	$: if (subgraphEndpoint) {
		getOrderbookAddress(subgraphEndpoint).then(({ orderbookAddress }) => {
			if (orderbookAddress) address = orderbookAddress;
		});
	}

	// all this boilerplate is from the web3modal docs
	const chains = [mainnet, avalanche, goerli, polygonMumbai];
	const projectId = import.meta.env.VITE_PROJECT_ID;

	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

	// except here we're using createConfig form this package instead of wagmi
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains }),
		publicClient
	});

	const ethereumClient = new EthereumClient(wagmiConfig, chains);

	let web3modal: Web3Modal;

	// necessary if you're using SSR, because there's no window for the modal to attach to
	$: if (browser) {
		web3modal = new Web3Modal(
			{
				projectId,
				themeVariables: {
					'--w3m-logo-image-url':
						'https://uploads-ssl.webflow.com/627b9589504d3adc8db27d80/6283b4807a13aa6e4df650ee_RainProtocol_Logo%201.svg',
					'--w3m-background-color': '#000000'
				}
			},
			ethereumClient
		);
		web3modal.setDefaultChain(goerli);
	}

	$: console.log($account);
</script>

<div class="flex flex-col h-screen relative">
	<Navbar
		let:hidden
		let:toggle
		class="px-2 sm:px-4 py-2.5 sticky w-full z-20 top-0 left-0 border-b"
		fluid
	>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Orderbook
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<!-- <NavUl {hidden}>
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/services">Services</NavLi>
			<NavLi href="/pricing">Pricing</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl> -->
		<Button
			outline
			on:click={() => {
				web3modal.openModal();
			}}>Connect wallet</Button
		>
	</Navbar>
	<div class="flex overflow-scroll relative grow">
		<Sidebar class="sticky top-0 bottom-0 shrink-0 ">
			<SidebarWrapper class="h-full bg-white border-r-gray-300 border-r rounded-none">
				<SidebarGroup>
					<SidebarItem label="Home" href="/" />
					<SidebarItem label="Orders" href="/orders" />
					<SidebarItem label="Vaults" href="/vaults" />
					<SidebarItem label="Take orders" href="/queries/take-orders" />
				</SidebarGroup>
				<SidebarGroup border>
					<Label for="subgraphEndpoint">Subgraph Endpoint</Label>
					<Input type="text" id="subgraphEndpoint" bind:value={subgraphEndpoint} />
					<Label for="address">Address</Label>
					<Input type="text" id="address" bind:value={address} />
					<Button
						on:click={() => {
							initOrderbook({ address, subgraphEndpoint });
						}}>Init</Button
					>
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
		{#if $orderbook}
			<div class="w-full bg-gray-50">
				<slot />
			</div>
		{/if}
	</div>
</div>
