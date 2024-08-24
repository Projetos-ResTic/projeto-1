
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface Folder {
    id: number;
    name: string;
    tasks: Task[];
}

// Obtendo elementos DOM
const folderList = document.getElementById('folder-list') as HTMLUListElement;
const folderInput = document.getElementById('folder-input') as HTMLInputElement;
const addFolderBtn = document.getElementById('add-folder-btn') as HTMLButtonElement;
const selectedFolderLabel = document.getElementById('selected-folder') as HTMLHeadingElement;
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const addTaskBtn = document.getElementById('add-task-btn') as HTMLButtonElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;


let folders: Folder[] = []; 
let selectedFolderId: number | null = null; 
let folderId = 0; 
let taskId = 0; 

// salvar os dados no localStorage
function saveData() {
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('folderId', folderId.toString());
    localStorage.setItem('taskId', taskId.toString());
}

//carregar os dados do localStorage
function loadData() {
    const savedFolders = localStorage.getItem('folders');
    const savedFolderId = localStorage.getItem('folderId');
    const savedTaskId = localStorage.getItem('taskId');

    if (savedFolders) {
        folders = JSON.parse(savedFolders);
    }
    if (savedFolderId) {
        folderId = parseInt(savedFolderId, 10);
    }
    if (savedTaskId) {
        taskId = parseInt(savedTaskId, 10);
    }
}

//  renderizar a lista de pastas
function renderFolders() {
    folderList.innerHTML = ''; 
    folders.forEach(folder => {
        const li = document.createElement('li');
        li.textContent = folder.name;

    // criação e configuração do botão de exclusão de pasta
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); 
            deleteFolder(folder.id);
        };

        li.appendChild(deleteBtn);
        li.addEventListener('click', () => selectFolder(folder.id)); 
        folderList.appendChild(li);
    });
}

// renderizar a lista de tarefas da pasta selecionada
function renderTasks() {
    if (selectedFolderId === null) return; 

    const folder = folders.find(f => f.id === selectedFolderId);
    if (!folder) return;

    taskList.innerHTML = ''; 
    folder.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            ${task.text}
            <div class="buttons">
                <button class="complete-btn" onclick="completeTask(${task.id})">
                    ${task.completed ? 'Concluída' : 'Concluir'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

//  adicionar uma nova pasta
function addFolder() {
    const name = folderInput.value.trim();
    if (name) {
        folders.push({ id: folderId++, name, tasks: [] }); 
        folderInput.value = '';
        renderFolders();
        saveData();
    }
}

// selecionar uma pasta
function selectFolder(id: number) {
    selectedFolderId = id;
    const folder = folders.find(f => f.id === selectedFolderId);
    selectedFolderLabel.textContent = folder ? folder.name : 'Selecione uma pasta';
    renderTasks();
}

// excluir uma pasta
function deleteFolder(id: number) {
    folders = folders.filter(folder => folder.id !== id); 
    selectedFolderId = null;
    renderFolders();
    renderTasks();
    saveData();
}

// nova tarefa
function addTask() {
    const text = taskInput.value.trim();
    if (text && selectedFolderId !== null) {
        const folder = folders.find(f => f.id === selectedFolderId);
        if (folder) {
            folder.tasks.push({ id: taskId++, text, completed: false }); 
            taskInput.value = '';
            renderTasks();
            saveData();
        }
    }
}

// tarefa como concluída ou pendente
function completeTask(id: number) {
    const folder = folders.find(f => f.id === selectedFolderId);
    if (folder) {
        const task = folder.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed; 
            renderTasks();
            saveData();
        }
    }
}

//  excluir uma tarefa
function deleteTask(id: number) {
    const folder = folders.find(f => f.id === selectedFolderId);
    if (folder) {
        folder.tasks = folder.tasks.filter(t => t.id !== id); 
        renderTasks();
        saveData();
    }
}

// eventos de clique para adicionar pastas e tarefas
addFolderBtn.addEventListener('click', addFolder);
addTaskBtn.addEventListener('click', addTask);



loadData();
renderFolders();
