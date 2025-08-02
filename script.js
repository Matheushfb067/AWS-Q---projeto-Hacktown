class EcoDescarte {
    constructor() {
        this.camera = document.getElementById('camera');
        this.canvas = document.getElementById('canvas');
        this.preview = document.getElementById('preview');
        this.startCameraBtn = document.getElementById('startCamera');
        this.captureBtn = document.getElementById('capturePhoto');
        this.retakeBtn = document.getElementById('retakePhoto');
        this.uploadBtn = document.getElementById('uploadPhoto');
        this.fileInput = document.getElementById('fileInput');
        this.analysisSection = document.getElementById('analysisSection');
        this.loading = document.getElementById('loading');
        this.results = document.getElementById('results');
        
        this.stream = null;
        this.initEventListeners();
    }

    initEventListeners() {
        this.startCameraBtn.addEventListener('click', () => this.startCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.retakeBtn.addEventListener('click', () => this.retakePhoto());
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            this.camera.srcObject = this.stream;
            this.camera.style.display = 'block';
            this.preview.style.display = 'none';
            
            this.startCameraBtn.style.display = 'none';
            this.captureBtn.style.display = 'inline-block';
            this.retakeBtn.style.display = 'none';
        } catch (error) {
            alert('Erro ao acessar a câmera. Verifique as permissões.');
            console.error('Erro na câmera:', error);
        }
    }

    capturePhoto() {
        const context = this.canvas.getContext('2d');
        this.canvas.width = this.camera.videoWidth;
        this.canvas.height = this.camera.videoHeight;
        
        context.drawImage(this.camera, 0, 0);
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        
        this.preview.src = imageData;
        this.preview.style.display = 'block';
        this.camera.style.display = 'none';
        
        this.captureBtn.style.display = 'none';
        this.retakeBtn.style.display = 'inline-block';
        
        this.stopCamera();
        this.analyzeImage(imageData);
    }

    retakePhoto() {
        this.preview.style.display = 'none';
        this.retakeBtn.style.display = 'none';
        this.startCameraBtn.style.display = 'inline-block';
        this.analysisSection.style.display = 'none';
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.preview.src = e.target.result;
                this.preview.style.display = 'block';
                this.camera.style.display = 'none';
                this.startCameraBtn.style.display = 'none';
                this.captureBtn.style.display = 'none';
                this.retakeBtn.style.display = 'inline-block';
                
                this.analyzeImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    async analyzeImage(imageData) {
        this.analysisSection.style.display = 'block';
        this.loading.style.display = 'block';
        this.results.style.display = 'none';

        // Simula análise de IA (substitua por API real)
        setTimeout(() => {
            const analysis = this.simulateAIAnalysis(imageData);
            this.displayResults(analysis);
        }, 2000);
    }

    simulateAIAnalysis(imageData) {
        // Simulação de análise - substitua por integração com API de IA real
        const objects = [
            {
                name: 'Garrafa Plástica',
                description: 'Garrafa de plástico PET transparente',
                type: 'plastic',
                locations: [
                    { name: 'Ecopontos', address: 'Disponíveis em supermercados e praças públicas' },
                    { name: 'Cooperativas de Reciclagem', address: 'Consulte cooperativas locais' },
                    { name: 'Coleta Seletiva', address: 'Lixeira azul - coleta às terças e sextas' }
                ]
            },
            {
                name: 'Lata de Alumínio',
                description: 'Lata de refrigerante de alumínio',
                type: 'metal',
                locations: [
                    { name: 'Postos de Coleta', address: 'Supermercados e postos de gasolina' },
                    { name: 'Sucateiros', address: 'Empresas de compra de materiais recicláveis' },
                    { name: 'Coleta Seletiva', address: 'Lixeira amarela - coleta às terças e sextas' }
                ]
            },
            {
                name: 'Resto de Comida',
                description: 'Material orgânico biodegradável',
                type: 'organic',
                locations: [
                    { name: 'Composteira Doméstica', address: 'Transforme em adubo em casa' },
                    { name: 'Coleta Orgânica', address: 'Lixeira marrom - coleta diária' },
                    { name: 'Hortas Comunitárias', address: 'Consulte hortas que aceitam compostagem' }
                ]
            }
        ];

        return objects[Math.floor(Math.random() * objects.length)];
    }

    displayResults(analysis) {
        this.loading.style.display = 'none';
        this.results.style.display = 'block';

        document.getElementById('objectName').textContent = analysis.name;
        document.getElementById('objectDescription').textContent = analysis.description;

        const disposalType = document.getElementById('disposalType');
        const typeNames = {
            plastic: 'Plástico',
            organic: 'Orgânico',
            glass: 'Vidro',
            metal: 'Metal',
            paper: 'Papel',
            electronic: 'Eletrônico'
        };

        disposalType.innerHTML = `
            <div class="disposal-badge ${analysis.type}">
                ${typeNames[analysis.type]}
            </div>
        `;

        const locationsContainer = document.getElementById('disposalLocations');
        locationsContainer.innerHTML = analysis.locations.map(location => `
            <div class="location-card">
                <h4>${location.name}</h4>
                <p>${location.address}</p>
            </div>
        `).join('');
    }
}

// Inicializa a aplicação quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new EcoDescarte();
});