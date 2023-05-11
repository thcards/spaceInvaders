const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.speed = 5;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }
}

class Invader extends GameObject {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
    }

    moveDown() {
        this.y += this.height;
        this.speed = -this.speed;
    }

    update() {
        this.x += this.speed;

        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.moveDown();
        }
    }
}

class InvaderType1 extends Invader {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'green', 1);
    }
}

class InvaderType2 extends Invader {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'blue', 1.5);
    }
}

class InvaderType3 extends Invader {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'red', 2);
    }
}
const player = new Player(canvas.width / 2 - 25, canvas.height - 50, 50, 10, 'white');
const invaders = [];

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
        if (i < 2) {
            invaders.push(new InvaderType1(50 + j * 60, 50 + i * 40, 40, 20));
        } else if (i < 4) {
            invaders.push(new InvaderType2(50 + j * 60, 50 + i * 40, 40, 20));
        } else {
            invaders.push(new InvaderType3(50 + j * 60, 50 + i * 40, 40, 20));
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    invaders.forEach(invader => {
        invader.update();
        invader.draw();
    });

    bullets.forEach((bullet, bulletIndex) => {
        bullet.update();
        bullet.draw();

        invaders.forEach((invader, invaderIndex) => {
            if (checkCollision(bullet, invader)) {
                bullets.splice(bulletIndex, 1);
                invaders.splice(invaderIndex, 1);
                score += 10;
            }
        });

        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }
    });

    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Lives: ${lives}`, canvas.width - 80, 20);

    requestAnimationFrame(update);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
class Bullet extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.speed = -5;
    }

    update() {
        this.y += this.speed;
    }
}

const bullets = [];

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y, 5, 10, 'white'));
    }
});
let score = 0;
let lives = 3;

update();

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
        player.moveLeft();
    } else if (event.code === 'ArrowRight') {
        player.moveRight();
    }
});

