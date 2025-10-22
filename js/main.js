// تعریف محصولات فروشگاه
const products = [
  { id: 1, name: "New Collection", price: 110, img: "images/slider.jpeg" },
  { id: 2, name: "New Collection", price: 67, img: "images/slider2.jpeg" },
  { id: 3, name: "New Collection", price: 98, img: "images/slider3.jpeg" },
  { id: 4, name: "Lipstick", price: 12.99, img: "images/lipstick.jpg" },
  { id: 5, name: "Cherry", price: 12.99, img: "images/cherry.jpg" },
  { id: 6, name: "RedLipstick", price: 12.99, img: "images/redlipstick.jpg" },
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
    { id: 18, name: "SkyHigh ", price: 19.75, img: "images/skyhighmascara.jpeg" },
  { id: 19, name: "YSL  ", price: 13.75, img: "images/yslmascara.jpeg" },
  { id: 20, name: "Dior ", price: 18.75, img: "images/diormascara.jpeg" },
    { id: 21, name: "Shiglam ", price: 16.75, img: "images/shiglam.jpeg" },


];

// تبدیل قیمت به تومان با فرمت فارسی
function formatPrice(n) {
  return (n * 60000).toLocaleString("fa-IR") + " Toman";
}

// ساخت اسلایدر محصولات در صفحه اصلی
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
          <img src="${p.img}" alt="${p.name}" 
               style="max-height:400px; width:auto; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
        </div>
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-2">
          <h5>${p.name}</h5>
          <p>${formatPrice(p.price)}</p>
        </div>
      </div>`;
  });
});

// نمایش لیست محصولات در صفحه اصلی
if (window.location.pathname.includes("index.html")) {
  const list = document.getElementById("product-list");

  products.forEach(p => {
    list.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100" data-aos="fade-up" data-aos-duration="200">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body text-center">
            <h5>${p.name}</h5>
            <p>${formatPrice(p.price)}</p>
            <input id="qty-${p.id}" type="number" value="1" min="1" class="form-control mb-2">
            <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
  });

  // فیلتر کردن محصولات بر اساس جستجو
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

// گرفتن سبد خرید از localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// افزودن محصول به سبد خرید
function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const item = products.find(p => p.id === id);
  const exist = cart.find(i => i.id === id);

  if (exist) exist.quantity += qty;
  else cart.push({ ...item, quantity: qty });

  localStorage.setItem("cart", JSON.stringify(cart));

  Swal.fire({
    icon: "success",
    title: "Added",
    text: `${item.name} (${qty} pcs) has been added to your cart.`,
    timer: 1500,
    showConfirmButton: false,
  });
}

// نمایش محتوای سبد خرید در cart.html
if (window.location.pathname.includes("cart.html")) {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      container.innerHTML += `
        <div class="border-bottom py-2 d-flex justify-content-between">
          <div>${item.name} (x${item.quantity})</div>
          <div>${formatPrice(item.price * item.quantity)}</div>
        </div>`;
    });
    totalEl.textContent = `Total: ${formatPrice(total)}`;
  }
}

// عملکرد دکمه پرداخت
function checkout() {
  if (!cart || cart.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Your cart is empty!',
      confirmButtonText: 'ok'
    });
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

// تغییر حالت تاریک و روشن سایت
const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}

// نمایش وضعیت آب و هوا با API
const weatherBox = document.getElementById("weather-box");
const weatherStatus = document.getElementById("weather-status");

// انتخاب پیام متناسب با دمای هوا
function getWeatherMessage(temp) {
  if (temp < 5) return "It’s freezing outside! Keep yourself warm.";
  if (temp < 15) return "A bit chilly today — perfect for a cup of coffee.";
  if (temp < 25) return "It’s a lovely day — let’s post something inspiring!";
  if (temp < 35) return "Nice and warm! Don’t forget to stay hydrated.";
  return "It’s hot out there! Stay cool and take care!";
}

// دریافت و نمایش داده‌های آب‌وهوا
function showWeather(lat, lon) {
  weatherStatus.textContent = "Loading weather data...";

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => {
      if (!res.ok) throw new Error("Weather API error");
      return res.json();
    })
    .then(data => {
      const weather = data.current_weather;
      const temp = weather.temperature;
      const wind = weather.windspeed;
      const time = new Date(weather.time).toLocaleTimeString();
      const message = getWeatherMessage(temp);

      let icon = "☀️";
      if (weather.weathercode >= 51 && weather.weathercode <= 67) icon = "🌧️";
      else if (weather.weathercode >= 71 && weather.weathercode <= 77) icon = "❄️";
      else if (weather.weathercode >= 95) icon = "⛈️";

      weatherBox.innerHTML = `
        <h5 class="mb-2 text-dark">Your Location</h5>
        <p class="mb-1">${icon} Temperature: <strong>${temp}°C</strong></p>
        <p class="mb-1">Wind Speed: ${wind} km/h</p>
        <p class="text-muted small mb-3">Last updated: ${time}</p>
        <p class="fw-semibold text-pink">${message}</p>
      `;
    })
    .catch(() => {
      weatherBox.innerHTML = `<p class="text-danger">Failed to load weather data.</p>`;
    });
}

// گرفتن موقعیت کاربر با Geolocation
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => showWeather(position.coords.latitude, position.coords.longitude),
      () => {
        weatherBox.innerHTML = `<p class="text-danger">Unable to detect location. Showing Amsterdam instead.</p>`;
        showWeather(52.37, 4.90);
      }
    );
  } else {
    weatherBox.innerHTML = `<p class="text-danger">Geolocation not supported by your browser.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", getUserLocation);
window.checkout = checkout;
// 💬 Customer Comments Section
document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.getElementById("comment-form");
  const commentList = document.getElementById("comment-list");

  if (!commentForm || !commentList) return;

  // Default example comments
  let comments = JSON.parse(localStorage.getItem("comments")) || [
    { name: "Sara M.", text: "Loved the lipstick quality 😍 Fast delivery too!" },
    { name: "Lina P.", text: "Beautiful packaging and lovely shades. Highly recommend 💄" },
    { name: "Nora A.", text: "Great customer service! My order arrived on time ❤️" }
  ];

  // Render comments
  function renderComments() {
    commentList.innerHTML = "";
    if (comments.length === 0) {
      commentList.innerHTML = `<p class="text-muted">No comments yet. Be the first to share your thoughts 💕</p>`;
      return;
    }
    comments.forEach(c => {
      commentList.innerHTML += `
        <div class="comment-item">
          <h6>${c.name}</h6>
          <p>${c.text}</p>
        </div>`;
    });
  }

  renderComments();

  // Add new comment
  commentForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("comment-name").value.trim();
    const text = document.getElementById("comment-text").value.trim();

    if (name && text) {
      comments.push({ name, text });
      localStorage.setItem("comments", JSON.stringify(comments));
      renderComments();
      commentForm.reset();
    }
  });
});
// 📊 Statistics Counter Animation
function animateCount(el, target) {
  let count = 0;
  const speed = 60;
  const increment = Math.ceil(target / speed);

  const update = () => {
    count += increment;
    if (count >= target) {
      el.innerText = target;
    } else {
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
      el.classList.add('is-visible');
      const countEl = el.querySelector('.count');
      const target = parseInt(countEl.innerText);
      countEl.innerText = '0';
      animateCount(countEl, target);
      observer.unobserve(el);
    }
  });
});

// فعال‌سازی برای همه عناصر شمارنده
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
});
window.checkout=checkout;

