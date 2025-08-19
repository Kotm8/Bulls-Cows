<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const userId = ref(null);
const nameId = ref(null);
const gameId = ref(null);
let cows = 0;
let bulls = 0;
const guess = ref('');
const history = ref([]);
const gamesHistory = ref([])

const showRules = ref(true);
const toggleRules = () => (showRules.value = !showRules.value);
const closeRules = () => (showRules.value = false);

const showHistory = ref(false);
const toggleHistory = () => {
	showHistory.value = !showHistory.value;
	if (showHistory.value) {
		getHistory();
	}
};
const closeHistory = () => (showHistory.value = false);

const wonGame = ref(false);

const onKeydown = (e) => {
	if (e.key === 'Escape') closeRules()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

onMounted(async () => {
	try {
		const res = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
			credentials: 'include',
		});
		if (!res.ok) throw new Error('Failed to fetch user');
		const data = await res.json();
		userId.value = data.id;
		nameId.value = data.id.slice(0, 8);
		newGame();
	} catch (err) {
		console.error(err);
	}
});

async function newGame() {
	wonGame.value = false
	cows = 0;
	bulls = 0;
	history.value = [];
	const res = await fetch(`${import.meta.env.VITE_API_URL}/game`, {
		method: "POST",
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to fetch game');
	const data = await res.json();
	gameId.value = data.id;
	const gameAttemptsjson = await fetch(`${import.meta.env.VITE_API_URL}/game/${gameId.value}/attempts`, {
		method: "GET",
		credentials: 'include',
	});
	const gameAttempts = await gameAttemptsjson.json();
	gameAttempts.forEach(element => {
		history.value.push({
			guess: element.guess,
			bulls: element.bulls,
			cows: element.cows,
		});
	});
}

async function resetGame() {
	await fetch(`${import.meta.env.VITE_API_URL}/game/${gameId.value}/reset`, {
		method: "POST",
		credentials: 'include',
	});
	newGame();
}

async function postGuess() {
	if (guess.value.length === 4 && guess.value[0] !== '0') {
		const digits = guess.value.split("");
		const unique = new Set(digits);

		if (unique.size === digits.length) {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/game/${gameId.value}/guess`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ value: guess.value }),
					credentials: 'include',
				});
				if (!res.ok) throw new Error('Failed to fetch bulls and cows');
				const data = await res.json();
				history.value.push({
					guess: guess.value,
					bulls: data.bulls,
					cows: data.cows,
				});
				if (data.bulls === 4) {
					wonGame.value = true
				}
				guess.value = "";
			} catch (err) {
				console.error(err);
			}
		}
		else {
			alert("Цифры не повторяются")
		}
	} else {
		alert("4 цифры и первая ≠ 0")
	}

}

async function getHistory() {
	try {
		gamesHistory.value = [];
		const res = await fetch(`${import.meta.env.VITE_API_URL}/game`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: 'include',
		});
		if (!res) throw new Error('Failed to fetch bulls and cows');
		const data = await res.json();
		data.forEach(element => {
			gamesHistory.value.push({
				element
			});
		});
	} catch (err) {
		console.error(err);
	}
}

function getTimeDiff(created_at, updated_at) {
	const created = new Date(created_at);
	const updated = new Date(updated_at);

	const diffMs = updated - created;
	const minutes = Math.floor(diffMs / 60000);
	const seconds = Math.floor((diffMs % 60000) / 1000);

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const onEnter = () => (postGuess());

</script>

<template>
	<div
		class="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-neutral-800 to-zinc-700 bg-comic">
		<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md min-h-[85vh] max-h-[85vh] flex flex-col">
			<h2 class="text-2xl font-bold text-center text-gray-800 pb-4 border-b border-gray-300">
				Player {{ nameId }}
			</h2>
			<div class="flex gap-2 justify-center m-4">
				<div v-if="wonGame" class="text-2xl font-bold text-center text-gray-800 pb-4 border-b border-gray-300">
					Выйграл!
				</div>
				<div v-else>
					<input v-model="guess" type="text" maxlength="4" inputmode="numeric"
						class="tracking-[1em] text-center text-2xl w-52 h-14 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 caret-transparent"
						@input="guess = guess.replace(/\D/g, '').slice(0, 4)" @keyup.enter="onEnter" />
				</div>
			</div>
			<div >
				<div v-if="wonGame" class="flex gap-2 justify-center m-4">
					<button class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
						@click="newGame">Новая игра
					</button>
				</div>
				<div v-else class="flex gap-2 justify-center m-4">
					<button class="bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded"
						@click="postGuess">Проверить
					</button>
					<button class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
						@click="resetGame">Новая игра
					</button>
				</div>
			</div>
			<div class="flex-1  overflow-y-auto m-4">
				<table class="table-auto border-collapse w-full text-center">
					<thead class="bg-gray-200 ">
						<tr>
							<th class="px-2">№ попытки</th>
							<th class="px-2">Число</th>
							<th class="px-2">Быки</th>
							<th class="px-2">Коровы</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(h, index) in history" :key="index">
							<td>{{ index + 1 }}</td>
							<td>{{ h.guess }}</td>
							<td>{{ h.bulls }}</td>
							<td>{{ h.cows }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="fixed top-4 right-4 z-50">
			<button type="button"
				class="p-3 rounded-full bg-white shadow-md border hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				@click="toggleHistory">
				<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
				</svg>
			</button>

			<div v-if="showHistory">
				<div class="fixed inset-0" @click="closeHistory"></div>

				<div role="dialog" aria-label="History"
					class="absolute top-0 right-0 w-129 bg-white border rounded-lg shadow-xl p-4 z-50">
					<div class="flex items-start justify-between mb-2">
						<h3 class="font-semibold text-gray-800">История игр</h3>
						<button class="text-gray-500 hover:text-gray-700" @click="closeHistory"
							aria-label="Close rules">✕</button>
					</div>
					<div class="max-h-[350px] overflow-y-auto m-4">
						<table class="table-auto border-collapse w-full text-center">
							<thead class="bg-gray-200 ">
								<tr>
									<th class="px-2">Игра</th>
									<th class="px-2">Ответ</th>
									<th class="px-2">Попыток</th>
									<th class="px-2">Время для решения</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(h, index) in gamesHistory" :key="index">
									<td>{{ index + 1 }}</td>
									<td>{{ h.element.secretNumber }}</td>
									<td>{{ h.element.attemptNumber }}</td>
									<td>{{ getTimeDiff(h.element.createdAt, h.element.updatedAt) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<div class="fixed bottom-4 left-4 z-50">
			<button type="button"
				class="p-3 rounded-full bg-white shadow-md border hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				@click="toggleRules">
				<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
				</svg>
			</button>

			<div v-if="showRules" class="relative">
				<div class="fixed inset-0" @click="closeRules"></div>
				<div role="dialog" label="Game rules"
					class="absolute bottom-14 left-0 w-100 bg-white border rounded-lg shadow-xl p-4 z-50">
					<div class="flex items-start justify-between mb-2">
						<h3 class="font-semibold text-gray-800">Как играть</h3>
						<button class="text-gray-500 hover:text-gray-700" @click="closeRules"
							aria-label="Close rules">✕</button>
					</div>
					<ol class="list-decimal list-inside space-y-1 text-sm text-gray-700">
						<li>Компьютер загадывает <strong>4-значное число</strong> с неповторяющимися цифрами</li>
						<li>Первая цифра <strong>≠ 0</strong></li>
						<li>Ваша задача - угадать это число</li>
						<li>Введите вашу версию числа в поле ввода</li>
						<li>Нажмите <kbd class="px-1 border rounded">Enter</kbd> или <kbd
								class="px-1 border rounded">Проверить</kbd> чтобы получить подсказку</li>
						<li><strong>БЫК</strong> - цифра верна и на своем месте</li>
						<li><strong>КОРОВА</strong> - цифра верна, но не на своем месте</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
</template>
