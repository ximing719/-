// --- script.js (登入畫面修復與功能增強) ---

document.addEventListener('DOMContentLoaded', (event) => {
    // 確保所有元素都存在
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');
    const myPhoto = document.getElementById('my-photo');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // ===================================
    // 1. 登入畫面 (Splash Screen) 邏輯
    // ===================================

    // 模擬載入時間（例如 2 秒後顯示進入按鈕）
    setTimeout(() => {
        const loadingSpinner = document.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        if (enterBtn) {
            enterBtn.style.display = 'block';
        }
    }, 2000); // 這裡可以調整延遲時間

    // 點擊進入按鈕的事件處理
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            if (splashScreen) {
                // 執行淡出動畫
                splashScreen.style.opacity = '0'; 
                
                // 動畫結束後徹底移除或隱藏
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    
                    // 顯示主內容，並讓它淡入
                    if (mainContent) {
                        mainContent.style.opacity = '1';
                    }
                }, 1000); // 這裡的 1000ms 必須與 CSS 中的 transition 速度匹配
            }
        });
    }


    // ===================================
    // 2. 自我介紹頁面 (Photo Color Change) 邏輯
    // ===================================

    if (myPhoto) {
        let colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6']; // 氣球的顏色
        let colorIndex = 0;
        
        myPhoto.addEventListener('click', () => {
            // 點擊時切換顏色
            colorIndex = (colorIndex + 1) % colors.length;
            myPhoto.style.borderColor = colors[colorIndex];
        });
    }

    // ===================================
    // 3. 漢堡選單 (Hamburger Menu) 邏輯
    // ===================================
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // 點擊時切換 nav-menu 的 'show' class
            navMenu.classList.toggle('show');
        });
    }

});