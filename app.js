// Three.js 3D STL Viewer Implementation
let scene, camera, renderer, controls;
let modelMesh;
let autoRotate = true;
const container = document.getElementById('threejs-container');

function init3DViewer() {
    if (!container) return;

    // Create Scene
    scene = new THREE.Scene();
    
    // Create Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 80, 220);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go too far under ground
    controls.minDistance = 50;
    controls.maxDistance = 500;

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased ambient light
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2); // Main strong light
    dirLight1.position.set(100, 200, 150);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd51e29, 0.7); // Stronger red accent light
    dirLight2.position.set(-100, 100, -100);
    scene.add(dirLight2);

    const cameraLight = new THREE.DirectionalLight(0xffffff, 0.6); // Frontal light to ensure visibility
    cameraLight.position.set(0, 50, 150);
    scene.add(cameraLight);

    // Load STL Model
    const loader = new THREE.STLLoader();
    
    // Relative path to STL from index.html in root
    loader.load('./R-Tec_Liner_550mm.stl', 
        function (geometry) {
            // Material styling (Semi-metallic industrial steel look for better visibility)
            const material = new THREE.MeshStandardMaterial({
                color: 0x9ca3af, // Silver/grey color that stands out
                metalness: 0.4,
                roughness: 0.4,
                flatShading: false
            });

            // Compute normals and center geometry
            geometry.computeVertexNormals();
            geometry.center();

            // Create Mesh
            modelMesh = new THREE.Mesh(geometry, material);
            modelMesh.castShadow = true;
            modelMesh.receiveShadow = true;

            // Compute Bounding Sphere to auto-fit camera
            geometry.computeBoundingSphere();
            const sphere = geometry.boundingSphere;
            const radius = sphere.radius;
            
            // Scale and position model nicely
            modelMesh.rotation.x = -Math.PI / 2; // Orient correctly
            modelMesh.rotation.z = Math.PI / 4;
            scene.add(modelMesh);

            // Adjust camera position based on model size
            camera.position.set(radius * 2.2, radius * 1.8, radius * 2.6);
            controls.target.set(0, 0, 0);
            controls.update();

            // Hide Loading Spinner
            const spinner = document.getElementById('loading-spinner');
            if (spinner) {
                spinner.style.opacity = '0';
                setTimeout(() => {
                    spinner.style.display = 'none';
                }, 500);
            }

            // Dispatch event for Playwright automated capture
            console.log("Model loaded successfully. Dispatching model-loaded event.");
            window.dispatchEvent(new Event('model-loaded'));
        },
        // Progress callback
        function (xhr) {
            if (xhr.lengthComputable) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                const loadingText = document.querySelector('.loading-text');
                if (loadingText) {
                    loadingText.innerText = `Đang tải mô hình 3D R-Tec Liner: ${percent}%`;
                }
            }
        },
        // Error callback
        function (error) {
            console.error('Lỗi khi tải STL:', error);
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) {
                loadingText.innerText = 'Lỗi tải mô hình 3D. Vui lòng tải lại trang.';
            }
            const spinner = document.querySelector('.spinner');
            if (spinner) spinner.style.borderTopColor = '#d51e29';

            // Still dispatch loaded event to avoid blocking PDF generator in case of network issues
            window.dispatchEvent(new Event('model-loaded'));
        }
    );

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        if (modelMesh && autoRotate) {
            modelMesh.rotation.z += 0.003;
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    if (!camera || !renderer || !container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// 3D Controls Bindings
document.getElementById('reset-view-btn')?.addEventListener('click', () => {
    if (!camera || !controls || !modelMesh) return;
    modelMesh.geometry.computeBoundingSphere();
    const radius = modelMesh.geometry.boundingSphere.radius;
    camera.position.set(radius * 2.2, radius * 1.8, radius * 2.6);
    controls.target.set(0, 0, 0);
    controls.update();
});

const autoRotateBtn = document.getElementById('autorotate-btn');
autoRotateBtn?.addEventListener('click', () => {
    autoRotate = !autoRotate;
    if (autoRotate) {
        autoRotateBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Tự động xoay: Bật';
        autoRotateBtn.style.color = '#ffffff';
    } else {
        autoRotateBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Tự động xoay: Tắt';
        autoRotateBtn.style.color = 'var(--text-muted)';
    }
});

// Lightbox Modal for Accessory Galleries
const lightbox = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.getElementById('lightbox-prev');
const nextBtn = document.getElementById('lightbox-next');

let currentGalleryImages = [];
let currentImageIndex = 0;

function setupLightbox() {
    // Collect all thumbnails
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Find parent cell to identify the specific gallery of this item
            const parentCell = thumb.closest('td');
            const itemTitle = thumb.closest('tr').querySelector('td:nth-child(3) strong').innerText;
            const itemDescVn = thumb.closest('tr').querySelector('.description-vn').innerText;
            
            // Gather all thumbnails in this cell
            const cellThumbs = Array.from(parentCell.querySelectorAll('.gallery-thumb'));
            currentGalleryImages = cellThumbs.map(img => img.src);
            currentImageIndex = cellThumbs.indexOf(thumb);
            
            openLightbox(currentGalleryImages[currentImageIndex], `${itemTitle} <br><span style="font-size:12px; color:var(--text-secondary); font-weight:normal">${itemDescVn}</span>`);
        });
    });

    // Close buttons
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation buttons
    prevBtn?.addEventListener('click', showPrevImage);
    nextBtn?.addEventListener('click', showNextImage);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.style.display !== 'flex') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    
    lightboxImg.src = src;
    lightboxCaption.innerHTML = caption;
    lightbox.style.display = 'flex';
    
    // Toggle nav buttons based on gallery size
    if (currentGalleryImages.length > 1) {
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

function closeLightbox() {
    if (lightbox) lightbox.style.display = 'none';
}

function showPrevImage() {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    
    const itemTitle = document.querySelector(`img[src="${currentGalleryImages[currentImageIndex]}"]`)?.closest('tr').querySelector('td:nth-child(3) strong').innerText || "";
    const itemDescVn = document.querySelector(`img[src="${currentGalleryImages[currentImageIndex]}"]`)?.closest('tr').querySelector('.description-vn').innerText || "";
    
    lightboxImg.src = currentGalleryImages[currentImageIndex];
    lightboxCaption.innerHTML = `${itemTitle} <br><span style="font-size:12px; color:var(--text-secondary); font-weight:normal">${itemDescVn}</span>`;
}

function showNextImage() {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    
    const itemTitle = document.querySelector(`img[src="${currentGalleryImages[currentImageIndex]}"]`)?.closest('tr').querySelector('td:nth-child(3) strong').innerText || "";
    const itemDescVn = document.querySelector(`img[src="${currentGalleryImages[currentImageIndex]}"]`)?.closest('tr').querySelector('.description-vn').innerText || "";
    
    lightboxImg.src = currentGalleryImages[currentImageIndex];
    lightboxCaption.innerHTML = `${itemTitle} <br><span style="font-size:12px; color:var(--text-secondary); font-weight:normal">${itemDescVn}</span>`;
}// PDF Download Trigger (interceptor for both old button and new link)
document.getElementById('download-pdf-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = './Bao_cao_giai_phap_Vinfast_Murrplastik.pdf';
    link.download = 'Bao_cao_giai_phap_Vinfast_Murrplastik.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


// Navigation Highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
    setupLightbox();
});
