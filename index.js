const section = document.getElementById('characters');
const radioArray = Array.from(document.querySelectorAll('input[type=radio]'));
const formQuery = document.querySelector('form');
const inputName = document.getElementById('name-search');
const backPage = document.getElementById('back-page');
const forwardPage = document.getElementById('forward-page');
let page = 1;
let status = 'Alive';
let name = '';

async function loadCharacters() {
	try {
		const fullArrayResponse = await fetch(
			`http://localhost:3000/character?_page=${page}&_limit=5&status=${status}&name_like=${name}`
		);
		const data = await fullArrayResponse.json();
		clearOldCharacters();
		createCharacter(data);
		buttonBlock(data);
		noElements(data);
	} catch (error) {
		console.log('error', error);
	}
}
loadCharacters();

function createCharacter(array) {
	array.forEach((character) => {
		const outerDiv = document.createElement('div');
		outerDiv.id = character.id;
		outerDiv.classList.add('character-background');

		const imgHolder = document.createElement('div');
		imgHolder.classList.add('inner-img');
		const img = document.createElement('img');
		img.src = character.image;
		img.classList.add('inner-img');

		imgHolder.appendChild(img);
		outerDiv.appendChild(imgHolder);

		const infoHolder = document.createElement('div');
		infoHolder.classList.add('info');

		const pName = document.createElement('p');
		pName.innerText = character.name;
		outerDiv.appendChild(pName);

		const pStatus = document.createElement('p');
		pStatus.innerText = `Status: ${character.status}`;
		const pSpecies = document.createElement('p');
		pSpecies.innerText = `Species: ${character.species}`;
		infoHolder.appendChild(pStatus);
		infoHolder.appendChild(pSpecies);

		const btnDelete = document.createElement('button');
		btnDelete.addEventListener('click', deleteCharacter);
		btnDelete.innerText = 'Usuń postać';
		btnDelete.classList.add('delete-button');

		outerDiv.appendChild(infoHolder);
		outerDiv.appendChild(btnDelete);

		section.appendChild(outerDiv);
	});
}

backPage.addEventListener('click', prevPage);
function prevPage() {
	page += -1;
	loadCharacters();
}

forwardPage.addEventListener('click', nextPage);
function nextPage() {
	page += +1;
	loadCharacters();
}

function buttonBlock(array) {
	if (page === 1) {
		backPage.disabled = true;
	} else {
		backPage.disabled = false;
	}
	if (array.length < 5) {
		forwardPage.disabled = true;
	} else {
		forwardPage.disabled = false;
	}
}

function clearOldCharacters() {
	const characters = Array.from(
		document.getElementsByClassName('character-background')
	);
	if (characters != null) {
		characters.forEach((character) => {
			character.remove(character);
		});
	}
}

radioArray.forEach((radio) => {
	radio.addEventListener('click', changeStatus);
});
function changeStatus() {
	const index = radioArray.findIndex((element) => element.checked === true);
	status = radioArray[index].defaultValue;
	page = 1;
	name = '';
	loadCharacters();
}

formQuery.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(formQuery);

	if (formData.get('name') != '' && formData.get('species') != null) {
		addCharacter(formData);
	} else {
		alert('uzupełnij pola');
	}
});
async function addCharacter(data) {
	try {
		const postData = {
			id: '',
			name: data.get('name'),
			status: data.get('status'),
			species: data.get('species'),
			image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
		};
		const response = await fetch('http://localhost:3000/character', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(postData),
		});
	} catch (error) {
		console.log('error', error);
	}
}

inputName.addEventListener('input', searchName);
function searchName() {
	name = this.value;
	loadCharacters();
}

async function deleteCharacter() {
	try {
		const response = await fetch(
			`http://localhost:3000/character/${this.parentNode.id}`,
			{ method: 'DELETE' }
		);
	} catch (error) {
		console.log('error', error);
	}
}

function noElements(array) {
	const check = document.getElementById('no-elements');
	if (array.length === 0 && check === null) {
		const paragraph = document.createElement('p');
		paragraph.id = 'no-elements';
		paragraph.innerText =
			'Nie znaleziono postaci spełniających kryteria wyszukiwania';
		section.appendChild(paragraph);
	} else if (array.length != 0 && check != null) {
		check.remove(check);
	}
}
