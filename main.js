// =====================================
// 💄 Anis MiniShop - Final main.js (Fixed & Improved)
// =====================================

// 🛍️ Product List
const products = [
  { id: 1, name: "New Collection", price: 110, img: "images/slider.jpeg" },
  { id: 2, name: "New Collection", price: 67, img: "images/slider2.jpeg" },
  { id: 3, name: "New Collection", price: 98, img: "images/slider3.jpeg" },
  { id: 4, name: "Lipstick", price: 12.99, img: "images/lipstick.jpg" },
  { id: 5, name: "Cherry", price: 12.99, img: "images/Cherry.jpg" },
  { id: 6, name: "RedLipstick", price: 12.99, img: "images/RedLipstick.jpg" },
  { id: 7, name: "ShineLipstick", price: 12.99, img: "images/lipstick3.jpg" },
  { id: 8, name: "MagicMask", price: 24.50, img: "images/foundation.jpg" },
  { id: 10, name: "GoldenMask", price: 24.50, img: "images/foundation1.jpg" },
  { id: 11, name: "FlowerMask", price: 24.50, img: "images/foundation2.jpg" },
  { id: 12, name: "NaturalMask", price: 24.50, img: "images/foundation3.jpg" },
  { id: 13, name: "Mascara", price: 18.00, img: "images/mascara.jpeg" },
  { id: 14, name: "GR Blush", price: 12.75, img: "images/blush.jpg" },
  { id: 15, name: "YSL", price: 15.35, img: "images/blush1.jpg" },
  { id: 16, name: "ShineYSL", price: 15.75, img: "images/blush2.jpg" },
  { id: 17, name: "Golden Rose", price: 15.95, img: "images/blush3.jpg" },
  { id: 18, name: "SkyHigh", price: 19.75, img: "images/SkyHighMascara.jpeg" },
  { id: 19, name: "YSL Mascara", price: 13.75, img: "images/YSL Mascara.jpeg" },
  { id: 20, name: "Dior", price: 18.75, img: "images/DiorMascara.jpeg" },
  { id: 21, name: "Shiglam", price: 16.75, img: "images/Shiglam.jpeg" },
];

// 💰 Format price
function formatPrice(n) {
  return (n * 60000).toLocaleString("fa-IR") + " Toman";
}

// 🎠 Slider setup (with accessibility)
window.addEventListener("DOMContentLoaded", () => {
  const sliderContainer = document.getElementById("slider-container");
  if (!sliderContainer) return;

  const slides = [
    products[1], products[2], products[3],
    { img: "images/slider.jpeg", name: "New Collection", price: 110 },
    { img: "images/slider2.jpeg", name: "New Collection", price: 67 },
    { img: "images/slider3.jpeg", name: "New Collection", price: 98 },
  ];

  slides.forEach((p, index) => {
    sliderContainer.innerHTML += `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <div class="d-flex justify-content-center">
          <img src="${p.img}" alt="${p.name} promotional banner" aria-label="Featured product banner"
               loading="lazy" style="max-height:400px; width:auto; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
        </div>
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-2">
          <h5>${p.name}</h5>
          <p>${formatPrice(p.price)}</p>
        </div>
      </div>`;
  });
});

// 🛍️ Display Product List
if (
  window.location.pathname.endsWith("/") ||
  window.location.pathname.includes("index.html") ||
  window.location.pathname.includes("/MiniShop/")
) {

  const list = document.getElementById("product-list");

  products.forEach(p => {
    list.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100" data-aos="fade-up" data-aos-duration="200">
          <img src="${p.img}" class="card-img-top" alt="${p.name} product image" loading="lazy">
          <div class="card-body text-center">
            <h5>${p.name}</h5>
            <p>${formatPrice(p.price)}</p>
            <input id="qty-${p.id}" type="number" value="1" min="1" class="form-control mb-2" aria-label="Product quantity">
            <button class="btn btn-primary" onclick="addToCart(${p.id})" aria-label="Add ${p.name} to cart">Add to Cart</button>
          </div>
        </div>
      </div>`;
  });

  // 🔍 Search Filter
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", e => {
      const value = e.target.value.toLowerCase();
      const cards = document.querySelectorAll(".card");
      cards.forEach(c => {
        c.style.display = c.textContent.toLowerCase().includes(value) ? "block" : "none";
      });
    });
  }
}

// 🛒 Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const item = products.find(p => p.id === id);
  const exist = cart.find(i => i.id === id);

  if (exist) exist.quantity += qty;
  else cart.push({ ...item, quantity: qty });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

  Swal.fire({
    icon: "success",
    title: "Added",
    text: `${item.name} (${qty} pcs) has been added to your cart.`,
    timer: 1500,
    showConfirmButton: false,
  });
}

// 🛍️ Update Cart Badge
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalQty;
}
document.addEventListener("DOMContentLoaded", updateCartBadge);

// 🧾 Checkout
function checkout() {
  if (!cart || cart.length === 0) {
    Swal.fire({ icon: 'info', title: 'Your cart is empty!', confirmButtonText: 'ok' });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Your purchase has been completed successfully!',
    html: 'Thank you for trusting and supporting MiniShop ❤️<br>We hope you enjoy your purchase 😘',
    confirmButtonText: 'ok',
    allowOutsideClick: false
  }).then(() => {
    localStorage.removeItem("cart");
    cart = [];
    window.location.href = "index.html";
  });
}
window.checkout = checkout;

// 🌙 Theme Toggle
const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });

  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
}

// 🌦 Weather
const weatherBox = document.getElementById("weather-box");
const weatherStatus = document.getElementById("weather-status");

function getWeatherMessage(temp) {
  if (temp < 5) return "It’s freezing outside! ❄️";
  if (temp < 15) return "A bit chilly — perfect for coffee ☕";
  if (temp < 25) return "It’s a lovely day 🌸";
  if (temp < 35) return "Nice and warm! Stay hydrated 💧";
  return "It’s hot! Stay cool 😎";
}

function showWeather(lat, lon) {
  weatherStatus.textContent = "Loading weather data...";
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const w = data.current_weather;
      const msg = getWeatherMessage(w.temperature);
      weatherBox.innerHTML = `
        <h5>Your Location</h5>
        <p>🌡 ${w.temperature}°C</p>
        <p>💨 Wind: ${w.windspeed} km/h</p>
        <p class="text-pink fw-semibold">${msg}</p>`;
    })
    .catch(() => weatherBox.innerHTML = `<p class="text-danger">Failed to load weather data.</p>`);
}

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(pos => showWeather(pos.coords.latitude, pos.coords.longitude),
    () => showWeather(52.37, 4.90));

// 💬 Comments
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("comment-form");
  const list = document.getElementById("comment-list");
  if (!form || !list) return;

  let comments = JSON.parse(localStorage.getItem("comments")) || [
    { name: "Sara M.", text: "Loved the lipstick quality 😍" },
    { name: "Lina P.", text: "Beautiful packaging and shades 💄" },
    { name: "Nora A.", text: "Fast delivery, great service!" }
  ];

  function render() {
    list.innerHTML = comments.map(c => `
      <div class="text-start mb-3 p-3 bg-white rounded shadow-sm">
        <h6 class="fw-semibold text-pink">${c.name}</h6>
        <p class="mb-0">${c.text}</p>
      </div>`).join("");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("comment-name").value.trim();
    const text = document.getElementById("comment-text").value.trim();
    if (!name || !text) return;
    comments.push({ name, text });
    localStorage.setItem("comments", JSON.stringify(comments));
    form.reset();
    render();
  });
  render();
});

// 📊 Achievement Counter Animation
function animateCount(el, target) {
  let count = 0;
  const speed = 40;
  const increment = Math.ceil(target / speed);
  const update = () => {
    count += increment;
    if (count >= target) el.innerText = target;
    else {
      el.innerText = count;
      requestAnimationFrame(update);
    }
  };
  update();
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCount(el, target);
      observer.unobserve(el);
    }
  });
});
// 💡 Fix: Keep cart badge updated across all pages
window.addEventListener("load", updateCartBadge);
setInterval(updateCartBadge, 1000); // auto-refresh badge if localStorage changes

document.querySelectorAll(".count").forEach(el => observer.observe(el));

