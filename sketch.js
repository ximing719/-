// --- sketch.js (最終版：飄動、計分、爆破效果) ---

let balloons = [];
let particles = [];
let score = 0;
const TARGET_POPS = 10;
let poppedCount = 0;
let gameState = 'playing'; 
const MAX_BALLOONS = 8; 

// 七種顏色
const balloonColors = [
    [231, 76, 60], [243, 156, 18], [241, 196, 15], 
    [46, 204, 113], [52, 152, 219], [155, 89, 182], 
    [236, 112, 99]
];

// *** 確保 setup() 存在且正確呼叫 canvas.parent('canvas-holder') ***
function setup() {
    let canvas = createCanvas(800, 500); 
    canvas.parent('canvas-holder'); 
    gameState = 'playing';
    initializeGame();
}

function initializeGame() {
    balloons = [];
    particles = [];
    score = 0;
    poppedCount = 0;
    for (let i = 0; i < MAX_BALLOONS; i++) {
        createRandomBalloon(true); 
    }
}

function createRandomBalloon(isInitial = false) {
    let x = random(0, width);
    let y = isInitial ? random(height) : height + 50; 
    let colorIndex = floor(random(balloonColors.length));
    let c = balloonColors[colorIndex];
    let speed = random(0.8, 1.8); 
    balloons.push(new Balloon(x, y, c, speed));
}

// *** 確保 draw() 存在且負責更新畫面 ***
function draw() {
    // 背景漸層
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(135, 206, 235), color(240, 248, 255), inter);
        stroke(c);
        line(0, y, width, y);
    }
    
    // 更新 HTML 中的分數顯示
    select('#score-display').html(`分數: ${score} / 目標: 100 (${poppedCount} 顆)`);

    if (gameState === 'playing') {
        // 氣球邏輯
        for (let i = balloons.length - 1; i >= 0; i--) {
            let balloon = balloons[i];
            balloon.update();
            balloon.display();
            if (balloon.y < -50) {
                balloons.splice(i, 1);
                createRandomBalloon(false); 
            }
        }
        
        // 粒子邏輯
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.update();
            p.display();
            if (p.isFinished()) {
                particles.splice(i, 1);
            }
        }
        
    } else if (gameState === 'finished') {
        textAlign(CENTER, CENTER);
        textSize(48);
        fill(39, 174, 96);
        text("🎉 恭喜通關！🎉", width / 2, height / 2);
        textSize(24);
        fill(52, 73, 94);
        text(`最終得分: ${score}`, width / 2, height / 2 + 60);
    }
}

function mouseClicked() {
    if (gameState !== 'playing') return;
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        for (let i = balloons.length - 1; i >= 0; i--) {
            let balloon = balloons[i];
            if (balloon.isClicked(mouseX, mouseY)) {
                // 生成粒子
                for (let j = 0; j < 20; j++) {
                    particles.push(new Particle(balloon.x, balloon.y, balloon.color));
                }
                balloons.splice(i, 1); 
                score += 10;
                poppedCount++;
                if (poppedCount >= TARGET_POPS) {
                    gameState = 'finished';
                }
                createRandomBalloon(false); 
                break; 
            }
        }
    }
}

// 氣球物件類別 (不變)
class Balloon {
    constructor(x, y, color, speed) {
        this.x = x; this.y = y; this.r = 30; this.color = color;
        this.speed = speed; this.angle = random(TWO_PI); 
        this.wobble = random(0.01, 0.03); 
    }
    update() {
        this.y -= this.speed;
        this.x += sin(this.angle) * 0.8;
        this.angle += this.wobble;
    }
    // sketch.js (Balloon Class 內部)

display() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], 220); 
    
    // 1. 畫氣球主體
    ellipse(this.x, this.y, this.r * 2, this.r * 2.5);
    
    // 2. 畫高光反射 (立體感)
    push(); // 暫存繪圖狀態
    fill(255, 255, 255, 180); // 白色，高透明度
    // 將高光畫在左上方，模擬光源
    ellipse(this.x - this.r * 0.4, this.y - this.r * 0.4, this.r * 0.6, this.r * 0.8);
    pop(); // 恢復繪圖狀態

    // 3. 畫線 (氣球尾巴)
    stroke(100);
    strokeWeight(1);
    line(this.x, this.y + this.r * 1.25, this.x, this.y + 100); 
}
    isClicked(px, py) {
        let d = dist(this.x, this.y, px, py);
        return d < this.r;
    }
}

// 粒子物件類別 (不變)
class Particle {
    constructor(x, y, color) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, 6)); 
        this.color = color;
        this.lifespan = 255;
    }
    update() {
        this.vel.mult(0.98); 
        this.pos.add(this.vel);
        this.lifespan -= 5;
    }
    display() {
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.lifespan);
        ellipse(this.pos.x, this.pos.y, 8, 8);
    }
    isFinished() {
        return this.lifespan < 0;
    }
}