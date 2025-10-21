let entries = [];
let deferredPrompt = null;

const form = document.getElementById('entry-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const entriesContainer = document.getElementById('entries-container');
const installButton = document.getElementById('install-btn');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registrado com sucesso'))
        .catch((err) => console.log('Falha ao registrar o Service Worker:', err));
}

const renderEntries = () => {
    entriesContainer.innerHTML = '';

    if (entries.length === 0) {
        entriesContainer.innerHTML = `<p class="no-entries-msg">Nenhuma entrada registrada.</p>`;
        return;
    }

    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';

        entryDiv.innerHTML = `
                    <strong>${entry.title}</strong> <br>
                    <small>${entry.date}</small>
                    <p>${entry.description}</p>
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                `;

        const deleteBtn = entryDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteEntry(index));

        entriesContainer.appendChild(entryDiv);
    });
};

const loadEntries = () => {
    const saved = localStorage.getItem("entries");
    if (saved) {
        entries = JSON.parse(saved);
    }
    renderEntries();
};

const saveEntries = () => {
    localStorage.setItem("entries", JSON.stringify(entries));
};

const addEntry = (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const date = dateInput.value;

    if (!title || !date) {
        alert("Preencha o título e a data!");
        return;
    }

    const newEntry = { title, description, date };

    entries.unshift(newEntry);

    saveEntries();
    renderEntries();

    titleInput.value = '';
    descriptionInput.value = '';
    dateInput.value = '';
};

const deleteEntry = (index) => {
    entries = entries.filter((_, i) => i !== index);

    saveEntries();
    renderEntries();
};

const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    console.log("Evento beforeinstallprompt DISPARADO E CAPTURADO");
    deferredPrompt = e;
    installButton.style.display = 'block';
};

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
});

const handleInstallClick = () => {
    console.log(deferredPrompt)
    if (deferredPrompt) {
        console.log("Botão de instalação clicado");
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação');
            } else {
                console.log('Usuário recusou a instalação');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadEntries();

    form.addEventListener('submit', addEntry);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    installButton.addEventListener('click', handleInstallClick);
});
