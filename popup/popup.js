const { createApp } = Vue;

createApp({
  data() {
    return {
      documents: {},
      currentDoc: null,
    };
  },
  async mounted() {
    await this.loadDocuments();
  },
  methods: {
    async loadDocuments() {
      const { documents } = await chrome.storage.local.get('documents');
      this.documents = documents || {};
    },
    
    async createNewDoc() {
      const newDoc = {
        id: Date.now().toString(),
        name: `Document ${Date.now()}`,
        entries: [],
        createdAt: new Date().toISOString(),
      };
      
      await chrome.storage.local.set({
        documents: { ...this.documents, [newDoc.id]: newDoc },
        currentDocId: newDoc.id,
      });
      
      this.currentDoc = newDoc;
      this.documents = { ...this.documents, [newDoc.id]: newDoc };
    },
    
    async openDoc(docId) {
      this.currentDoc = this.documents[docId];
      await chrome.storage.local.set({ currentDocId: docId });
    },
    
    async exportDoc(doc) {
      const content = doc.entries
        .map(entry => `${entry.content}\nSource: ${entry.source.url}\n\n`)
        .join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      chrome.downloads.download({
        url: url,
        filename: `${doc.name}.txt`,
      });
    },
    
    async generateSummary() {
      const entriesContent = this.currentDoc.entries
        .map(entry => entry.content)
        .join('\n\n');
      
      const summary = await chrome.runtime.sendMessage({
        action: 'generateSummary',
        content: entriesContent,
      });
      
      alert(`AI Summary:\n\n${summary}`);
    }
  }
}).mount('#app');