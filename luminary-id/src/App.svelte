<script lang="ts">
  import { writable } from 'svelte/store';
  import { mockProveOver18, mockHasMastersDegree, mockHasVaccination } from './contract/mockContract';

  // State for active card
  const activeCard = writable<string | null>(null);

  // State for inputs and verification status
  const ageInput = writable('');
  const hasDegree = writable(false);
  const hasVaccination = writable(false);
  const ageVerified = writable(false);
  const educationVerified = writable(false);
  const medicalVerified = writable(false);

  // Verification history
  const verificationHistory = writable<{ type: string; timestamp: string; isVerified: boolean }[]>([]);

  // Mock user profile (for future expansion)
  const userProfile = {
    avatar: 'https://via.placeholder.com/150',
    name: 'Verified User',
  };

  // Prove age function
  async function proveOver18() {
    if (!$ageInput) return;
    const ageNum = BigInt($ageInput);
    const result = mockProveOver18(ageNum);
    ageVerified.set(result.isVerified);
    verificationHistory.update(history => [...history, { ...result, type: 'Age' }]);
    activeCard.set(null); // Collapse after submission
  }

  // Prove master’s degree function
  async function proveMastersDegree() {
    const result = mockHasMastersDegree($hasDegree);
    educationVerified.set(result.isVerified);
    verificationHistory.update(history => [...history, { ...result, type: 'Education' }]);
    activeCard.set(null); // Collapse after submission
  }

  // Prove vaccination function
  async function proveVaccination() {
    const result = mockHasVaccination($hasVaccination);
    medicalVerified.set(result.isVerified);
    verificationHistory.update(history => [...history, { ...result, type: 'Medical' }]);
    activeCard.set(null); // Collapse after submission
  }
</script>

<main class="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
  <h1 class="text-4xl font-bold text-center text-cyan-400 mb-8">LuminaryID</h1>

  <!-- Floating Cards -->
  <div class="cards grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
    <!-- Age Verification Card -->
    <div
      class="card"
      data-type="age"
      class:expanded={$activeCard === 'age'}
      on:click={() => activeCard.set('age')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && activeCard.set('age')}
    >
      <h2 class="text-xl font-bold text-cyan-400">Age Verification</h2>
      {#if $activeCard === 'age' && !$ageVerified}
        <input
          type="number"
          placeholder="Enter your age"
          class="input"
          bind:value={$ageInput}
          aria-label="Enter your age"
        />
        <button class="button" on:click={proveOver18}>Submit</button>
      {/if}
      {#if $ageVerified}
        <p class="text-center text-cyan-400 text-xl mt-4">✅ Verified: Over 18</p>
      {/if}
    </div>

    <!-- Education Verification Card -->
    <div
      class="card"
      data-type="education"
      class:expanded={$activeCard === 'education'}
      on:click={() => activeCard.set('education')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && activeCard.set('education')}
    >
      <h2 class="text-xl font-bold text-pink-500">Education Verification</h2>
      {#if $activeCard === 'education' && !$educationVerified}
        <label class="flex items-center space-x-2 mt-4">
          <input type="checkbox" bind:checked={$hasDegree} aria-label="I have a Master’s Degree" />
          <span>I have a Master’s Degree</span>
        </label>
        <button class="button" on:click={proveMastersDegree}>Submit</button>
      {/if}
      {#if $educationVerified}
        <p class="text-center text-pink-500 text-xl mt-4">✅ Verified: Master’s Degree</p>
      {/if}
    </div>

    <!-- Medical Verification Card -->
    <div
      class="card"
      data-type="medical"
      class:expanded={$activeCard === 'medical'}
      on:click={() => activeCard.set('medical')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && activeCard.set('medical')}
    >
      <h2 class="text-xl font-bold text-purple-500">Medical Verification</h2>
      {#if $activeCard === 'medical' && !$medicalVerified}
        <label class="flex items-center space-x-2 mt-4">
          <input type="checkbox" bind:checked={$hasVaccination} aria-label="I have had the vaccination" />
          <span>I have had the vaccination</span>
        </label>
        <button class="button" on:click={proveVaccination}>Submit</button>
      {/if}
      {#if $medicalVerified}
        <p class="text-center text-purple-500 text-xl mt-4">✅ Verified: Vaccination</p>
      {/if}
    </div>
  </div>

  <!-- Verification History -->
  <div class="history-card mt-8 max-w-4xl w-full">
    <h2 class="text-2xl font-bold text-cyan-400">Verification History</h2>
    <ul class="mt-4 space-y-2">
      {#each $verificationHistory as { type, timestamp, isVerified }}
        <li class="text-sm text-gray-300">
          {type}: {isVerified ? 'Verified' : 'Not Verified'} at {timestamp}
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  :global(body) {
    font-family: 'Orbitron', sans-serif;
    margin: 0;
    padding: 0;
  }

  .card {
    background: #222;
    border: 1px solid;
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2);
    border-radius: 8px;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 255, 255, 0.4);
  }

  .card.expanded {
    transform: scale(1.1);
    z-index: 10;
  }

  .cards:has(.expanded) .card:not(.expanded) {
    opacity: 0.5;
  }

  /* Card-specific colors */
  .card[data-type="age"] {
    border-color: #00ffff;
  }

  .card[data-type="education"] {
    border-color: #ff00ff;
  }

  .card[data-type="medical"] {
    border-color: #800080;
  }

  .input {
    background: #333;
    border: 1px solid #00ffff;
    color: white;
    padding: 0.5rem;
    margin-top: 1rem;
    width: 100%;
    border-radius: 4px;
  }

  .button {
    background: #00ffff;
    color: #222;
    padding: 0.5rem 1rem;
    border: none;
    margin-top: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .button:hover {
    background: #00cccc;
  }

  .history-card {
    background: #222;
    border: 1px solid #00ffff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2);
  }
</style>