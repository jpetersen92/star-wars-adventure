kaboom({
    global: true,
    fullscreen: true,
    scale: 1.5,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

loadSprite('tile', 'https://i.imgur.com/aUk8N3M.png', {
    sliceX: 8,
    sliceY: 1,
    anims: {
        idle: { from: 4, to: 4 },
        run: { from: 0, to: 3 },
        attack: { from: 5, to: 7 }
    }
})

loadSprite('trooper-tile', 'https://i.imgur.com/CgiQNFU.png', {
    sliceX: 7,
    sliceY: 1,
    anims: {
        stand: { from: 4, to: 4 },
        run: { from : 0, to: 3 },
        shoot: { from: 5, to: 6 }
    }
})

loadSprite('vader-tile', 'https://i.imgur.com/NQgRoty.png', {
    sliceX: 9,
    sliceY: 2,
    anims: {
        stand: { from: 14, to: 14 },
        run: { from: 9, to: 12 },
        attack: {from: 14, to: 17 }
    }
})

loadSprite('ground', 'https://i.imgur.com/M6rwarW.png')
loadSprite('wall', 'https://i.imgur.com/M6rwarW.png')
loadSprite('level-1', 'https://i.imgur.com/ML4Ccw3.jpg')

// define some constants
const JUMP_FORCE = 400;
const MOVE_SPEED = 200;
const FALL_DEATH = 640;
const ENEMY_SPEED = 50;
const BULLET_SPEED = 320;
const BOSS_HEALTH = 1000;
let enabled = false;
// define layers, draw "ui" on top, and "game" is default layer
layers(['bg', 'obj', 'ui',], 'obj')

camIgnore(['ui']);

// controls
add([
    text(`
up:    Jump
left:  Move Left
right: Move Right
space: Attack
spawn enemy: T
spawn boss: B
    `.trim(), 10),
    origin("botleft"),
    pos(4, height() - 4),
    layer("ui"),
]);

const health = (hp) => {
    return {
        hurt(n) {
            hp -= (n === undefined ? 1 : n);
            this.trigger("hurt");
            if (hp <= 0) {
                this.trigger("death");
            }
        },
        heal(n) {
            hp += (n === undefined ? 1 : n);
            this.trigger("heal");
        },
        hp() {
            return hp;
        },
    }
}

// add level to scene
const level = addLevel([
    "                                                                                                                                     ",
    "                                                                                                                                     ",
    "                                                                                                                                     ",
    "                                                                                            ==                                       ",
    "                                                                                           ====                                      ",
    "                                                                                          ======                                     ",
    "                                          ===========                                    ========                                    ",
    "                                                                                        ==========                                   ",
    "                                                                                       ============                                  ",
    "=====                                                                                 ==============                                 ",
    "                                  =========                                          ================                                ",
    "                                                                                    ==================                               ",
    "                                                                                   ====================                              ",
    "                          +                                                       +=====================                             ",
    "====================      ==========================================================================================================="
], {

    width: 20,
    height: 20,
    pos: vec2(0, 0),

    "=": [
        sprite('ground'),
        solid(),
    ],

    "+": [
        sprite('wall'),
        solid(),
        "wall",
    ],

})

add([
    sprite('level-1'),
    layer('bg'),
    pos(-500, -610),
])
add([
    sprite('level-1'),
    layer('bg'),
    pos(1400, -610),
])
// define player object
const player = add([
    sprite('tile', {
        animSpeed: 0.1,
        frame: 4,
    }),
    pos(0, 0),
    body(),
    scale(0.5),
    "player",
])

player.action(() => {
    camPos(player.pos)

    // if (player.pos.y >= FALL_DEATH) {
	// 	respawn();
	// }
})

player.play('idle')

keyPress('right', () => {
    player.scale.x = 0.5
    player.play('run')
})

keyRelease('right', () => {
    player.play('idle')
})

keyDown("right", () => {
	player.move(MOVE_SPEED, 0);
});

keyPress('left', () => {
    player.scale.x = -0.5
    player.play('run')
})

keyRelease('left', () => {
    player.play('idle')
})

keyDown("left", () => {
	player.move(-MOVE_SPEED, 0);
});

keyPress("up", () => {
	if (player.grounded()) {
		player.jump(JUMP_FORCE);
	}
})

keyPress("space", () => {
    player.play('attack')
})

keyDown("space", () => {
    enabled = true;
})

keyRelease('space', () => {
    player.play('idle')
    enabled = false;
})


action("trooper", (t) => {
        t.scale.x = -0.6
        t.move(t.dir * 50, 0)
        t.timer -=dt()
        if(t.timer <= 0) {
            t.dir = - t.dir
        t.timer = rand(5)
        } if(t.dir === 1) {
        t.scale.x = 0.6
        }
        // t.timer -=dt()
        // if(t.timer <= 0) {
        //     t.play('shoot')
        //     t.timer = rand(10)
        // }
        // t.timer -=dt()
        // if(t.timer <= 0) {
        // t.play('run')
        // t.timer = rand(5)
        // }
})

collides("trooper", "wall", (t) => {
t.dir = -t.dir
})

const spawnTrooper = () => {
    const trooper = add([
        sprite('trooper-tile', {
            animSpeed: 0.15,
            frame: 4,
        }),
        pos(rand(600, width()), 0),
        body(),
        scale(0.6),
        "trooper",
        {dir: 1, timer: 0}
    ])
    
    trooper.play('run')
}

// const trooper2 = add([
//     sprite('trooper-tile', {
//         animSpeed: 0.15,
//         frame: 4,
//     }),
//     pos(rand(600, width()), 0),
//     body(),
//     scale(0.6),
//     "trooper",
//     {dir: 1, timer: 0}
// ])

// trooper2.play('run')

// const trooper3 = add([
//     sprite('trooper-tile', {
//         animSpeed: 0.15,
//         frame: 4,
//     }),
//     pos(rand(600, width()), 0),
//     body(),
//     scale(0.6),
//     "trooper",
//     {dir: 1, timer: 0}
// ])

// trooper3.play('run')

// const trooper4 = add([
//     sprite('trooper-tile', {
//         animSpeed: 0.15,
//         frame: 4,
//     }),
//     pos(rand(600, width()), 0),
//     body(),
//     scale(0.6),
//     "trooper",
//     {dir: 1, timer: 0}
// ])

// trooper4.play('run')

const spawnBoss = () => {
    const vader = add([
        sprite('vader-tile', {
            animSpeed: 0.12,
            frame: 14,
        }),
        pos(rand(600, width()), 0),
        body(),
        scale(0.6),
        "boss",
        {dir: 1, timer: 0}
    ])
    
    vader.play('run')
}

action("boss", (b) => {
    b.scale.x = -0.6
    b.move(b.dir * 50, 0)
    b.timer -=dt()
    if(b.timer <= 0) {
        b.dir = - b.dir
    b.timer = rand(5)
    } if(b.dir === 1) {
    b.scale.x = 0.6
    } 
    b.timer -=dt()
    if(b.timer <= 0) {
        b.play('attack')
        b.timer = rand(5)
    }
    b.timer -=dt()
    if(b.timer <= 0) {
    b.play('run')
    b.timer = rand(5)
    }
})

collides("vader", "wall", (t) => {
    t.dir = -t.dir
    })

keyPress('b', () => {
    spawnBoss();
})

keyPress('t', () => {
    spawnTrooper();
})


overlaps('player', 'trooper', (p, t) => {
    if(enabled === true){
        destroy(t)
    }
})

collides('player', 'trooper', (p, t) => {
    if(enabled === true){
        destroy(t)
    }
})
