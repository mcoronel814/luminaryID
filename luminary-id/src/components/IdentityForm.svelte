<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { IdentityAttribute } from "../lib/contract";

  export let isUpdate = false;
  export let identityHash = "";
  export let initialAttributes: IdentityAttribute[] = [];

  const dispatch = createEventDispatcher();

  let attributes: IdentityAttribute[] =
    initialAttributes.length > 0
      ? [...initialAttributes]
      : [{ name: "", value: "", isPublic: false }];

  function addAttribute() {
    attributes = [...attributes, { name: "", value: "", isPublic: false }];
  }

  function removeAttribute(index: number) {
    attributes = attributes.filter((_, i) => i !== index);
  }

  function handleSubmit() {
    // Validate form
    const validAttributes = attributes.filter(
      (attr) => attr.name.trim() !== "" && attr.value.trim() !== ""
    );

    if (validAttributes.length === 0) {
      alert("Please add at least one attribute with both name and value.");
      return;
    }

    // Dispatch event with form data
    dispatch("submit", {
      identityHash,
      attributes: validAttributes,
    });
  }
</script>

<div class="card">
  <h2 class="text-xl font-semibold mb-4">
    {isUpdate ? "Update Identity" : "Create New Identity"}
  </h2>

  <form on:submit|preventDefault={handleSubmit}>
    {#if isUpdate}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Identity Hash</label
        >
        <div class="text-sm font-mono bg-gray-100 p-2 rounded break-all">
          {identityHash}
        </div>
      </div>
    {/if}

    <div class="space-y-4 mb-6">
      {#each attributes as attribute, i}
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Attribute Name</label
            >
            <input
              type="text"
              bind:value={attribute.name}
              class="input w-full"
              placeholder="e.g., firstName"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Value</label
            >
            <input
              type="text"
              bind:value={attribute.value}
              class="input w-full"
              placeholder="e.g., John"
            />
          </div>
          <div class="flex items-end justify-between sm:w-32 mt-2 sm:mt-0">
            <div class="flex items-center h-12">
              <input
                type="checkbox"
                id="public-{i}"
                bind:checked={attribute.isPublic}
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="public-{i}" class="ml-2 block text-sm text-gray-700"
                >Public</label
              >
            </div>

            {#if attributes.length > 1}
              <button
                type="button"
                on:click={() => removeAttribute(i)}
                class="h-10 w-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <div class="flex justify-between">
      <button
        type="button"
        on:click={addAttribute}
        class="btn btn-outline inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Add Attribute
      </button>

      <button type="submit" class="btn btn-primary">
        {isUpdate ? "Update Identity" : "Create Identity"}
      </button>
    </div>
  </form>
</div>
