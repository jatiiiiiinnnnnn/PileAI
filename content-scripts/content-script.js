let currentSelection = null;

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim();
  if (selection && selection !== currentSelection) {
    showAddButton();
    currentSelection = selection;
  }
});

function showAddButton() {
  removeExistingButtons();
  
  const button = document.createElement('div');
  button.className = 'web-curator-add-button';
  button.innerHTML = '📝 Add to Doc';
  
  document.body.appendChild(button);
  
  button.addEventListener('click', async () => {
    const content = window.getSelection().toString().trim();
    const source = {
      title: document.title,
      url: window.location.href,
    };
    
    chrome.runtime.sendMessage({
      action: 'addToDoc',
      content,
      source,
    });
    
    button.remove();
  });
  
  positionButton(button);
}

function positionButton(button) {
  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  button.style.position = 'absolute';
  button.style.top = `${rect.top + window.scrollY - 40}px`;
  button.style.left = `${rect.left + window.scrollX}px`;
}