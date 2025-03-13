<script lang="ts">
    import { isWalletConnected } from '../stores/wallet';
    import { contractStore } from '../stores/contract';
    import { Link } from 'svelte-routing';
  </script>
  
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-4xl font-bold mb-6">LuminaryID</h1>
    <p class="text-xl mb-8">Privacy-Preserving Identity Verification on Midnight Blockchain</p>
    
    <div class="bg-white shadow-lg rounded-lg p-8 mb-10">
      <h2 class="text-2xl font-bold mb-4">Prove Your Age Without Revealing It</h2>
      <p class="text-gray-600 mb-6">
        LuminaryID leverages Midnight's zero-knowledge technology to let you verify your age requirements 
        without revealing your actual age or any other personal information.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-2">Privacy First</h3>
          <p class="text-sm text-gray-600">Your actual age is never revealed on the blockchain, only verification results.</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-2">Zero-Knowledge Proofs</h3>
          <p class="text-sm text-gray-600">Prove you meet age requirements without revealing any additional information.</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-bold mb-2">Decentralized Identity</h3>
          <p class="text-sm text-gray-600">Your identity is secured by the Midnight blockchain, not controlled by a central authority.</p>
        </div>
      </div>
      
      {#if $isWalletConnected}
        {#if $contractStore.address}
          <Link 
            to="/dashboard" 
            class="inline-block bg-midnight-600 hover:bg-midnight-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out"
          >
            View Your Dashboard
          </Link>
        {:else}
          <Link 
            to="/register" 
            class="inline-block bg-midnight-600 hover:bg-midnight-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out"
          >
            Register Your Identity
          </Link>
        {/if}
      {:else}
        <div class="text-center">
          <p class="mb-4 text-gray-600">Connect your Lace wallet to get started</p>
        </div>
      {/if}
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">How It Works</h2>
        <ol class="list-decimal list-inside text-left text-gray-600 space-y-2">
          <li>Register your identity with your age (kept private)</li>
          <li>Generate zero-knowledge proofs for age verification</li>
          <li>Share verification status without revealing your actual age</li>
        </ol>
      </div>
      
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Use Cases</h2>
        <ul class="list-disc list-inside text-left text-gray-600 space-y-2">
          <li>Age verification for online services</li>
          <li>Proving eligibility without revealing personal data</li>
          <li>Demonstrating Midnight's privacy capabilities</li>
        </ul>
      </div>
    </div>
  </div>