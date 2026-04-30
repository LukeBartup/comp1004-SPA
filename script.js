let notes = [];
let currentNoteId = null;


const newnoteBtn = document.getElementById('newnoteBtn');
const noteEditor = document.getElementById('noteEditor');
const welcome = document.getElementById('welcome');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveBtn = document.getElementById('saveBtn');


function createNewNote() {
    console.log("creating new note");

    currentNoteId = null;

    //hide welcome message, show note editor
    welcome.style.display = 'none';
    noteEditor.style.display = 'block';

    //clear
    noteTitle.value = '';
    noteContent.value = '';

    noteTitle.focus();
}
function savetoLocalStorage() {
    localStorage.setItem('myNotes', JSON.stringify(notes));
}
function loadNotes() {
    const savedNotes = localStorage.getItem('myNotes');

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    } else {
        notes = [
            {
                id: 1,
                title: "welcome to SecureNote",
                content: "this is an example note",
                date: "Today"
            }
        ];
        savetoLocalStorage();
    }
}

function saveNote() {
    const title = noteTitle.value;
    const content = noteContent.value;

    if (!title.trim()) {
        alert("Please enter a title");
        return;
    }

    if (currentNoteId) {

        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = title;
            notes[noteIndex].content = content;
            notes[noteIndex].date = "updated just now";
        }
    } else {
        //creating new note object
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleDateString()
        };

        notes.push(newNote);
    }
    savetoLocalStorage();

    console.log("savig note:", title);
    alert("Note Saved: " + title);

    //display welcome message agian
    welcome.style.display = 'block';
    noteEditor.style.display = 'none';

    updateNotesList();
}

function updateNotesList() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `<h3>${note.title}</h3>  <p>${note.content.substring(0,50)}....</p> <small>${note.date}</small>`;

        noteElement.addEventListener('click', () => {
            selectNote(note.id);
        });

notesList.appendChild(noteElement);
    })
}

function selectNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        currentNoteId  = id;
        //show editor with note content

        welcome.style.display = 'none';
        noteEditor.style.display = 'block'
        noteTitle.value = note.title;
        noteContent.value = note.content;

        updateNotesList
    }
}

function exportNotes() {
    const jsonString = JSON.stringify(notes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "my-notes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function importNotes(Event) {
    const file = event.target.files[0];

    if(!file) {
        return;
    }

    const reader = new FIleReader();

    reader.onload = function(e) {
        const text = e.target.result;

        const importedNotes = JSON.parse(text);
        notes = importedNotes;
        savetoLocalStorage ();
        updateNotesList();
        alert("Notes imported successfuly");
    };
    reader.readAsText(file);
    event.target.value = "";
}

//initializing the app
function init() {
    console.log("NoteApp intitialized");

    loadNotes();

    newnoteBtn.addEventListener('click', createNewNote);
        saveBtn.addEventListener('click', saveNote);

        exportBtn.addEventListener('click', exportNotes);
        importInput.addEventListener('change', importNotes);

        updateNotesList();
}

//run inittialisation when page is loaded
document.addEventListener('DOMContentLoaded', init);
