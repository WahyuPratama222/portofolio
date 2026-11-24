<script lang="ts">
	let { command }: { command: string } = $props();
</script>

<!-- Typewriter heading: "$ command" types itself out, then the cursor blinks a few times -->
<h1 class="text-text mb-8 text-2xl font-bold">
	<span class="text-matcha">$</span>
	<span class="type" style="--n: {command.length}">{command}</span><span class="cursor"></span>
</h1>
