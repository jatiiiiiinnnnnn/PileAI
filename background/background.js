chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'addToDoc':
        handleAddToDoc(request);
        break;
      case 'getDocuments':
        handleGetDocuments(sendResponse);
        return true; // Keep channel open for async
      case 'createNewDoc':
        handleCreateNewDoc(request, sendResponse);
        return true;
    }
  });
  
  async function handleAddToDoc({ content, source }) {
    const { currentDocId, documents } = await chrome.storage.local.get([
      'currentDocId',
      'documents',
    ]);
    
    const document = documents[currentDocId] || createNewDocument();
    document.entries.push({
      content,
      source,
      timestamp: new Date().toISOString(),
    });
  
    await chrome.storage.local.set({ documents: { ...documents, [document.id]: document } });
  }
  
  function createNewDocument() {
    return {
      id: Date.now().toString(),
      name: `Document ${Date.now()}`,
      entries: [],
      createdAt: new Date().toISOString(),
    };
  }