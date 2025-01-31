document.addEventListener('DOMContentLoaded', async function() {
    let folders = {};
    let currentUser = null;
    
    // Initialize cloud sync
    const syncManager = new CloudSyncManager();
    await syncManager.initialize();
    
    // Load user data and folders
    async function initialize() {
      currentUser = await syncManager.getCurrentUser();
      folders = await syncManager.getFolders();
      updateUI();
    }
    
    // AI-powered content analysis
    class ContentAnalyzer {
      async analyzePage(url) {
        const response = await fetch('https://api.example.com/analyze', {
          method: 'POST',
          body: JSON.stringify({ url })
        });
        return await response.json();
      }
      
      async suggestTags(content) {
        // AI tag suggestion logic
        return ['suggested-tag-1', 'suggested-tag-2'];
      }
      
      async categorize(content) {
        // AI categorization logic
        return {
          category: 'travel',
          confidence: 0.95
        };
      }
    }
    
    // Price tracking
    class PriceTracker {
      async trackPrice(url) {
        const price = await this.extractPrice(url);
        if (price) {
          await this.savePriceHistory(url, price);
        }
      }
      
      async getPriceHistory(url) {
        // Retrieve price history
        return [];
      }
    }
    
    // Visual preview generator
    class PreviewGenerator {
      async generatePreview(url) {
        // Generate visual preview of the page
        return {
          thumbnail: 'preview-url',
          timestamp: new Date()
        };
      }
    }
    
    // Enhanced add page with AI features
    async function addCurrentPage(folderName) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const analyzer = new ContentAnalyzer();
      const priceTracker = new PriceTracker();
      const previewGenerator = new PreviewGenerator();
      
      // Analyze content
      const analysis = await analyzer.analyzePage(tab.url);
      const suggestedTags = await analyzer.suggestTags(analysis.content);
      const category = await analyzer.categorize(analysis.content);
      
      // Generate preview
      const preview = await previewGenerator.generatePreview(tab.url);
      
      // Track price if applicable
      let priceData = null;
      if (analysis.hasPrice) {
        priceData = await priceTracker.trackPrice(tab.url);
      }
      
      const document = {
        url: tab.url,
        title: tab.title,
        date: new Date().toISOString(),
        tags: suggestedTags,
        category: category,
        preview: preview,
        priceData: priceData,
        analysis: analysis,
        offline: await saveForOffline(tab.url)
      };
      
      folders[folderName].documents.push(document);
      await syncManager.saveFolder(folderName, folders[folderName]);
      updateUI();
    }
    
    // Offline access
    async function saveForOffline(url) {
      try {
        const cache = await caches.open('documents-cache');
        await cache.add(url);
        return true;
      } catch (e) {
        console.error('Failed to cache:', e);
        return false;
      }
    }
    
    // Collaborative features
    class CollaborationManager {
      async shareFolder(folderId, users) {
        // Set up real-time collaboration
        const shareConfig = {
          folderId,
          users,
          permissions: ['view', 'edit']
        };
        return await syncManager.setupSharing(shareConfig);
      }
      
      async startCollabSession(folderId) {
        // Initialize real-time session
      }
    }
    
    // Enhanced sharing with visual collections
    async function shareFolder(folderName) {
      const folder = folders[folderName];
      const collaborationManager = new CollaborationManager();
      
      const shareOptions = [
        'Generate Visual Collection',
        'Team Collaboration',
        'Export to Notion',
        'Export to Google Docs',
        'Create Public Link'
      ];
      
      const choice = await showShareDialog(shareOptions);
      
      switch (choice) {
        case 'Generate Visual Collection':
          await generateVisualCollection(folder);
          break;
        case 'Team Collaboration':
          const users = await showUserSelector();
          await collaborationManager.shareFolder(folderName, users);
          break;
        case 'Export to Notion':
          await exportToNotion(folder);
          break;
        case 'Export to Google Docs':
          await exportToGoogleDocs(folder);
          break;
        case 'Create Public Link':
          const link = await syncManager.createPublicLink(folderName);
          showShareLink(link);
          break;
      }
    }
    
    // AI-powered search
    async function performAISearch(query) {
      const results = await fetch('https://api.example.com/ai-search', {
        method: 'POST',
        body: JSON.stringify({
          query,
          folders: Object.values(folders)
        })
      });
      
      displaySearchResults(await results.json());
    }
    
    // Automatic organization
    async function suggestOrganization() {
      const allDocs = Object.values(folders)
        .flatMap(folder => folder.documents);
      
      const analyzer = new ContentAnalyzer();
      const suggestions = await analyzer.suggestOrganization(allDocs);
      
      displayOrganizationSuggestions(suggestions);
    }
    
    // UI updates
    function updateUI() {
      displayFolders();
      updateSmartCollections();
      updateSyncStatus();
    }
    
    // Event listeners
    document.getElementById('aiSearch').addEventListener('click', () => {
      const query = document.getElementById('searchInput').value;
      performAISearch(query);
    });
    
    document.getElementById('newFolder').addEventListener('click', async () => {
      const name = await showFolderDialog();
      if (name) {
        folders[name] = createNewFolder(name);
        await syncManager.saveFolder(name, folders[name]);
        updateUI();
      }
    });
    
    // Initialize the extension
    initialize();
  });
  