const { createApp } = Vue;

createApp({
    data() {
        return {
            documents: [],
            currentDoc: null,
        };
    },
    methods: {
        createNewDoc() {
            const newDoc = {
                id: Date.now(),
                name: 'Untitled Document',
                entries: [],
            };
            this.documents.push(newDoc);
            this.currentDoc = newDoc;
        },
        openDoc(docId) {
            this.currentDoc = this.documents.find(doc => doc.id === docId);
        },
        exportDoc(doc) {
            // Implement export logic here
            alert(`Exporting document: ${doc.name}`);
        },
        deleteDoc(docId) {
            this.documents = this.documents.filter(doc => doc.id !== docId);
            if (this.currentDoc && this.currentDoc.id === docId) {
                this.currentDoc = null;
            }
        },
        exportToGoogleDocs() {
            // Implement export to Google Docs logic here
            alert(`Exporting ${this.currentDoc.name} to Google Docs`);
        },
        exportToPDF() {
            // Implement export to PDF logic here
            alert(`Exporting ${this.currentDoc.name} to PDF`);
        },
        generateSummary() {
            // Implement AI summary generation logic here
            alert(`Generating summary for ${this.currentDoc.name}`);
        },
    },
}).mount('#app');