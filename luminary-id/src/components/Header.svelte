<script lang="ts">
    import { Link } from "svelte-routing";
    import { isWalletConnected } from '../stores/wallet';
    import { contractStore } from '../stores/contract';
  </script>
  
  <header class="bg-white shadow mb-8">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div>
        <Link to="/" class="text-2xl font-bold text-midnight-600">LuminaryID</Link>
      </div>
      
      <nav>
        <ul class="flex space-x-6">
          <li><Link to="/" class="text-gray-600 hover:text-midnight-600">Home</Link></li>
          
          {#if $isWalletConnected}
            {#if $contractStore.address}
              <li><Link to="/dashboard" class="text-gray-600 hover:text-midnight-600">Dashboard</Link></li>
              <li><Link to="/verify" class="text-gray-600 hover:text-midnight-600">Verify Age</Link></li>
            {:else}
              <li><Link to="/register" class="text-gray-600 hover:text-midnight-600">Register</Link></li>
            {/if}
          {/if}
        </ul>
      </nav>
    </div>
  </header>