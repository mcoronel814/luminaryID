<script lang="ts">
import { writable } from 'svelte/store';
import { 
  mockProveOver18, 
  mockHasMastersDegree, 
  mockHasVaccination,
  type VerifiedStatus // Import the type from your mock contract 
} from './contract/mockContract';


  // State variables
  const ageInput = writable('');
  const isAgeVerified = writable(false);
  const isEducationVerified = writable(false);
  const isMedicalVerified = writable(false);
  const verificationHistory = writable<VerifiedStatus[]>([]);
  const proving = writable(false);

  // Mock user profile
  const userProfile = {
    avatar: 'https://via.placeholder.com/150',
    name: 'Verified User',
  };

  // Prove age function
  async function proveOver18() {
    if (!$ageInput) { alert('Enter your age first!'); return; }
    const ageNum = BigInt($ageInput);
    $proving = true;
    setTimeout(() => {
      const result = mockProveOver18(ageNum);
      $isAgeVerified = result.isVerified;
      $verificationHistory = [...$verificationHistory, result];
      $proving = false;
      alert(result.isVerified ? 'Age verified—over 18!' : 'Oops, you’re not over 18.');
    }, 2000); // Fake delay for drama
  }

  // Prove master’s degree function
  async function proveMastersDegree() {
    const hasDegree = confirm('Do you have a Master’s Degree?'); // Mock input
    const result = mockHasMastersDegree(hasDegree);
    $isEducationVerified = result.isVerified;
    $verificationHistory = [...$verificationHistory, result];
    alert(result.isVerified ? 'Master’s degree verified—nice!' : 'No master’s degree found.');
  }

  // Prove vaccination function
  async function proveVaccination() {
    const hasVaccination = confirm('Have you had the vaccination?'); // Mock input
    const result = mockHasVaccination(hasVaccination);
    $isMedicalVerified = result.isVerified;
    $verificationHistory = [...$verificationHistory, result];
    alert(result.isVerified ? 'Vaccination verified—awesome!' : 'No vaccination verified.');
  }
</script>

<main class="min-h-screen flex items-center justify-center p-4 bg-cyberGray-900">
  <div class="cyber-card max-w-6xl w-full space-y-6">
    <h1 class="text-4xl font-bold text-center text-cyberBlue">LuminaryID</h1>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-3 gap-6">
      <!-- Age Verification -->
      <div class="cyber-card col-span-1">
        <h2 class="text-xl font-bold text-cyberPink">Age Verification</h2>
        <input type="number" placeholder="Enter your age" class="cyber-input w-full mt-4" bind:value={$ageInput} />
        <button class="cyber-button w-full mt-4" on:click={proveOver18} disabled={$proving}>
          {#if $proving}Proving...{:else}Prove I’m Over 18{/if}
        </button>
        {#if $isAgeVerified}
          <p class="text-center text-cyberBlue text-xl mt-4">✅ Verified: Over 18</p>
        {/if}
      </div>

      <!-- Education Verification -->
      <div class="cyber-card col-span-1">
        <h2 class="text-xl font-bold text-cyberPink">Education Verification</h2>
        <p class="mt-2">Prove you have a Master’s Degree</p>
        <button class="cyber-button w-full mt-4" on:click={proveMastersDegree}>
          Prove Master’s Degree
        </button>
        {#if $isEducationVerified}
          <p class="text-center text-cyberBlue text-xl mt-4">✅ Verified: Master’s Degree</p>
        {/if}
      </div>

      <!-- Medical Verification -->
      <div class="cyber-card col-span-1">
        <h2 class="text-xl font-bold text-cyberPink">Medical Verification</h2>
        <p class="mt-2">Prove you’ve had a vaccination</p>
        <button class="cyber-button w-full mt-4" on:click={proveVaccination}>
          Prove Vaccination
        </button>
        {#if $isMedicalVerified}
          <p class="text-center text-cyberBlue text-xl mt-4">✅ Verified: Vaccination</p>
        {/if}
      </div>

      <!-- User Profile -->
      <div class="cyber-card col-span-1">
        <h2 class="text-xl font-bold text-cyberPink">User Profile</h2>
        <img src={userProfile.avatar} alt="Avatar" class="w-24 h-24 rounded-full mx-auto mt-4" />
        <p class="text-center mt-2">{userProfile.name}</p>
      </div>

      <!-- Verification History -->
      <div class="cyber-card col-span-2">
        <h2 class="text-xl font-bold text-cyberPink">Verification History</h2>
        <ul class="mt-4 space-y-2">
          {#each $verificationHistory as { timestamp, isVerified, type }}
            <li class="text-sm">{timestamp}: {type} - {isVerified ? 'Verified' : 'Failed'}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</main>

<style>
  /* Cyberpunk styles */
  :global(.cyber-card) {
    @apply bg-cyberGray-800 p-6 rounded-lg border border-cyberBlue shadow-lg shadow-cyberBlue/50;
  }
  :global(.cyber-button) {
    @apply bg-cyberPink text-white font-bold py-2 px-4 rounded hover:bg-cyberBlue transition-all duration-300;
  }
  :global(.cyber-input) {
    @apply bg-cyberGray-700 text-white border border-cyberPink rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyberBlue;
  }
  :global(.bg-cyberGray-900) {
    @apply bg-gray-900;
  }
  :global(.text-cyberBlue) {
    @apply text-blue-400;
  }
  :global(.text-cyberPink) {
    @apply text-pink-500;
  }
</style>