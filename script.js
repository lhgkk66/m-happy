// 游戏状态
const gameState = {
    prizeOrder: ['玩具🧸', '花朵💐', '谢谢惠顾😢', '转账520💰', '心意许愿卷🎁', '谢谢惠顾😢', '花朵💐', '玩具🧸', '转账520💰'],
    prizeIndex: 0,
    opened: new Set(),
    isPlaying: false,
    finalPrizeFound: false,
    usedIndices: [] // 追踪已使用的格子
};

// 祝福语列表
const blessingMessages = [
    '亲爱的妈妈，祝你生日快乐！',
    '感谢您这些年对我的照顾和爱护。',
    '您就像一盏灯，照亮了我人生的道路。',
    '妈妈，您是我心中最美的人。',
    '您的笑容，是我最温暖的回忆。',
    '谢谢您用爱浇灌了我的成长。',
    '每一次的陪伴，我都记得清楚。',
    '妈妈，我爱您，永远永远！',
    '祝您岁岁平安，岁岁欢乐。',
    '感恩有您，生活才如此美好。',
    '您的爱，是永恒的。',
    '希望您的每一天都闪闪发光。',
    '妈妈，谢谢您给了我生命。',
    '您的爱像海一样深，像天一样广。',
    '在您的陪伴下，我成长得更坚强。',
    '妈妈，您永远是我心目中的英雄。'
];

// 页面切换
function goToGame() {
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('game-page').classList.add('active');
    gameState.isPlaying = true;
    gameState.prizeIndex = 0;
    gameState.opened = new Set();
    gameState.usedIndices = [];
    gameState.finalPrizeFound = false;
}

function goToBlessing() {
    document.getElementById('game-page').classList.remove('active');
    document.getElementById('blessing-page').classList.add('active');
    startBlessingMessages();
}

// 随机抽奖逻辑 - 点击抽奖按钮时触发
function triggerRandomDraw() {
    if (!gameState.isPlaying) {
        return;
    }

    // 获取所有未开启的格子
    const availableIndices = [];
    for (let i = 0; i < 9; i++) {
        if (!gameState.opened.has(i)) {
            availableIndices.push(i);
        }
    }

    // 如果没有可用的格子，退出
    if (availableIndices.length === 0) {
        return;
    }

    // 随机选择一个未开启的格子
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // 触发该格子的抽奖
    drawPrize(randomIndex);
}

// 直接点击格子抽奖逻辑
function drawPrize(index) {
    if (!gameState.isPlaying || gameState.opened.has(index)) {
        return;
    }

    const gridItem = document.querySelectorAll('.grid-item')[index];
    gameState.opened.add(index);
    gridItem.classList.add('opened');

    // 获取当前奖励
    const currentPrize = gameState.prizeOrder[gameState.prizeIndex];
    gameState.prizeIndex++;

    // 显示奖励并播放动画
    showPrizeAnimation(gridItem, currentPrize, index);

    // 检查是否抽到中心大奖（必须是中心位置且是心意许愿卷）
    if (index === 4 && currentPrize === '心意许愿卷🎁') {
        gameState.finalPrizeFound = true;
        gameState.isPlaying = false;
        
        // 禁用抽奖按钮
        const drawBtn = document.getElementById('draw-button');
        if (drawBtn) {
            drawBtn.disabled = true;
        }
        
        // 延迟后跳转到祝福页面
        setTimeout(() => {
            createFireworks();
            setTimeout(() => {
                goToBlessing();
            }, 2000);
        }, 1500);
    }
}

// 显示奖励动画
function showPrizeAnimation(element, prize, index) {
    element.textContent = prize;
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'prizePop 0.6s ease-out';
    }, 10);

    // 播放音效（可选）
    playSound();

    // 中心大奖特殊效果
    if (index === 4 && prize === '心意许愿卷🎁') {
        element.style.animation = 'finalPrizeGlow 1s ease-in-out infinite';
    }
}

// 播放音效
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // 音效失败时不影响正常流程
        console.log('Sound not available');
    }
}

// 创建烟火特效
function createFireworks() {
    const gamePageLeft = document.querySelector('#game-page .left-fireworks');
    const gamePageRight = document.querySelector('#game-page .right-fireworks');

    if (gamePageLeft && gamePageRight) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            const colors = ['#e8a87c', '#d4749f', '#b8695c', '#c89fb3', '#a89080'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;

            const isLeft = Math.random() > 0.5;
            const container = isLeft ? gamePageLeft : gamePageRight;

            const startX = isLeft ? Math.random() * 200 : Math.random() * 200;
            const startY = Math.random() * window.innerHeight;

            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';

            container.appendChild(particle);

            // 烟火动画
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 10;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let x = startX;
            let y = startY;
            let opacity = 1;

            function animate() {
                x += vx;
                y += vy;
                vy += 0.2; // 重力效果
                opacity -= 0.02;

                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }

            animate();
        }
    }
}

// 启动祝福消息
function startBlessingMessages() {
    const container = document.getElementById('messages-container');
    let messageIndex = 0;

    function showNextMessage() {
        if (messageIndex < blessingMessages.length) {
            const message = blessingMessages[messageIndex];
            const isRight = messageIndex % 2 === 0;

            const bubble = document.createElement('div');
            bubble.className = `message-bubble ${isRight ? 'right' : 'left'}`;

            const textSpan = document.createElement('div');
            textSpan.className = 'message-text';
            textSpan.textContent = message;

            bubble.appendChild(textSpan);
            container.appendChild(bubble);

            // 自动滚动到最新消息
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);

            messageIndex++;
            setTimeout(showNextMessage, 1000);
        } else {
            // 所有消息显示完后，创建连续烟火
            startContinuousFireworks();
        }
    }

    showNextMessage();
}

// 启动连续烟火
function startContinuousFireworks() {
    const blessingPageLeft = document.querySelector('#blessing-page .left-fireworks');
    const blessingPageRight = document.querySelector('#blessing-page .right-fireworks');

    if (blessingPageLeft && blessingPageRight) {
        setInterval(() => {
            // 左边烟火
            createContinuousFirework(blessingPageLeft, true);
            // 右边烟火
            createContinuousFirework(blessingPageRight, false);
        }, 300);
    }
}

function createContinuousFirework(container, isLeft) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';

        const colors = ['#e8a87c', '#d4749f', '#b8695c', '#c89fb3', '#a89080', '#d4a574'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;

        const startX = isLeft ? 50 + Math.random() * 100 : window.innerWidth - 150 + Math.random() * 100;
        const startY = 100 + Math.random() * 200;

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';

        container.appendChild(particle);

        // 上升动画
        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = 3 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 5;

        let x = startX;
        let y = startY;
        let opacity = 1;
        let life = 0;

        function animate() {
            x += vx;
            y += vy;
            vy += 0.1;
            life++;
            opacity = Math.max(0, 1 - life / 100);

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }

        animate();
    }
}

// 添加 CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes prizePop {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes finalPrizeGlow {
        0%, 100% {
            box-shadow: 0 0 30px rgba(232, 168, 124, 0.6), inset 0 0 10px rgba(232, 168, 124, 0.3);
        }
        50% {
            box-shadow: 0 0 50px rgba(232, 168, 124, 0.9), inset 0 0 20px rgba(232, 168, 124, 0.5);
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
window.addEventListener('load', () => {
    console.log('🎉 Birthday Blessing Page Loaded!');
});
