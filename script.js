const cloudName = 'upload-memory';
const uploadPreset = 'memory_journal';
const db = window.firebaseDB;

// Upload to Cloudinary
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

// Save image URL to Firestore
async function saveImageUrlToFirebase(url) {
  await firebase.firestore().collection('images').add({
    url: url,
    uploadedAt: new Date().toISOString()
  });
}

// Load images from Firestore
async function loadImagesFromFirebase() {
  const snapshot = await firebase.firestore().collection('images').get();
  snapshot.forEach((doc) => {
    const imageData = doc.data();
    addImageToCarousel(imageData.url, doc.id);
  });
}

// Delete image from Firestore
async function deleteImageFromFirebase(docId) {
  await firebase.firestore().collection('images').doc(docId).delete();
}

document.addEventListener('DOMContentLoaded', function () {
  const memoriesButton = document.getElementById('memories-button');
  const uploadInput = document.getElementById('upload-input');
  const uploadButton = document.getElementById('upload-button');
  const carousel = document.getElementById('memory-carousel');

  let currentIndex = 0;

  function updateCarousel(direction = '') {
    if (direction) {
      carousel.classList.add(`flipping-${direction}`);
      setTimeout(() => {
        carousel.classList.remove(`flipping-${direction}`);
      }, 600);
    }
    carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }

  if (memoriesButton) {
    memoriesButton.addEventListener('click', () => {
      window.location.href = 'memories.html';
    });
  }

  if (uploadButton && uploadInput && carousel) {
    uploadButton.addEventListener('click', function () {
      const file = uploadInput.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const memory = document.createElement('div');
          memory.className = 'memory';
          memory.innerHTML = `
            <img src="${e.target.result}" alt="Memory Image">
          `;
          carousel.appendChild(memory);
          currentIndex = carousel.children.length - 1;
          updateCarousel('right');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  let startX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 50 && currentIndex < carousel.children.length - 1) {
        currentIndex++;
        updateCarousel('right');
      } else if (endX > startX + 50 && currentIndex > 0) {
        currentIndex--;
        updateCarousel('left');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && currentIndex < carousel.children.length - 1) {
        currentIndex++;
        updateCarousel('right');
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        updateCarousel('left');
      }
    });
  }
});
const deletePopup = document.getElementById("delete-popup");
const deleteBtn = document.getElementById("delete-btn");
let currentImageElement = null;

document.getElementById("memory-carousel").addEventListener("click", function (e) {
  if (e.target.tagName === "IMG") {
    currentImageElement = e.target.closest(".memory");
    const rect = e.target.getBoundingClientRect();

    deletePopup.style.top = `${rect.top + window.scrollY + 10}px`;
    deletePopup.style.left = `${rect.left + window.scrollX + 10}px`;
    deletePopup.classList.remove("hidden");
  }
});

deleteBtn.addEventListener("click", () => {
  if (currentImageElement) {
    currentImageElement.remove();
    deletePopup.classList.add("hidden");
    currentImageElement = null;
  }
});
// Cloudinary config
const cloudName = 'upload-memory';
const uploadPreset = 'memory_journal';

// Reference Firestore collection
const db = window.firebaseDB;
const imagesCollection = firebase.firestore().collection('images'); // if not using modules, otherwise use getFirestore(app)

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

async function saveImageUrlToFirebase(url) {
  await addDoc(collection(db, "images"), {
    url: url,
    uploadedAt: new Date().toISOString()
  });
}

async function loadImagesFromFirebase() {
  const querySnapshot = await getDocs(collection(db, "images"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    addImageToCarousel(data.url, doc.id);
  });
}

async function deleteImageFromFirebase(docId) {
  await deleteDoc(doc(db, "images", docId));
}


// Optional: Hide popup if clicking elsewhere
document.addEventListener("click", (e) => {
  if (!deletePopup.contains(e.target) && !e.target.closest(".memory")) {
    deletePopup.classList.add("hidden");
  }
});
const cloudName = 'YOUR_C<!-- Firebase App (the core Firebase SDK) -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "xxxxxxx",
    appId: "xxxxxxx"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  window.firebaseDB = db; // Make db accessible to your main script
</script>
LOUD_NAME'; // replace with your Cloudinary cloud name
const uploadPreset = ''; // we’ll create this next

document.getElementById("upload-widget-button").addEventListener("click", function () {
  cloudinary.openUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: uploadPreset,
      sources: ["local", "url", "image"],
      multiple: false,
      cropping: false,
      folder: "memory_journal", // optional folder in Cloudinary
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        const imageUrl = result.info.secure_url;
        addImageToCarousel(imageUrl);
      }
      function createMemoryImage(url) {
        const memoryDiv = document.createElement('div');
        memoryDiv.className = 'memory';
      
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Memory';
      
        // Delete popup
        const popup = document.createElement('div');
        popup.className = 'delete-popup hidden';
        popup.innerText = 'Delete Image';
      
        // Show popup on image click
        img.addEventListener('click', (e) => {
          popup.classList.toggle('hidden');
          popup.style.top = `${e.offsetY}px`;
          popup.style.left = `${e.offsetX}px`;
        });
      
        // Delete image from carousel
        popup.addEventListener('click', () => {
          memoryDiv.remove();
        });
      
        memoryDiv.appendChild(img);
        memoryDiv.appendChild(popup);
      
        return memoryDiv;
      }
      
    }
  );
});

function addImageToCarousel(url) {
  const carousel = document.getElementById('memory-carousel');
const memoryDiv = createMemoryImage(imageUrl);
carousel.appendChild(memoryDiv);

}
document.getElementById('upload-button').addEventListener('click', async () => {
  const fileInput = document.getElementById('upload-input');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please choose a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'memory_journal');

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/upload-memory/image/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    const imageUrl = data.secure_url;

    const carousel = document.getElementById('memory-carousel');
    const memoryDiv = document.createElement('div');
    memoryDiv.className = 'memory';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Uploaded Memory';

    memoryDiv.appendChild(img);
    carousel.appendChild(memoryDiv);

    fileInput.value = '';
  } catch (err) {
    alert("Upload failed. Please try again.");
    console.error(err);
  }
});

