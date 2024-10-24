"use strict"; // Do NOT remove this directive!
var moveSpeed; // no smaller than 2
var interAttack; // time inbtween attacks 6 min
var range; // 24 - 32
var damage; //3-5 is resonable
var invincibleTime; // 60 - 180
var maxHealth; // 4 - 7
var statusColor = [];
var redColors = [0x800000, 0xce0c0c, 0xff4545, 0xff7a7a, 0xffaaaa, 0xffe3e3];
var purpleColors = [0x1d0032, 0x57008a, 0x8e33c3, 0xd9acf3];
var greenColors = [0x208000, 0x40ff00, 0xb5ff9d];
var darkblueColors = [0x002176, 0x4e7fff, 0xb9ccff];
var orangeColors = [0xd07200, 0xff991e, 0xffc885];
var yellowColors = [0xdbd200, 0xfff500, 0xfff971, 0xfffdc5];
var lightblueColors = [0x00928a, 0x00d2c7, 0x00fff2, 0xbffffc];
var character = -1;
var characters =
	//   color,speed,interAttack,range,damage,invincibleTime
	[[],
	[redColors, 2, 12, 10, 5, 120],// berserker
	[purpleColors, 3, 10, 16, 5, 60],// rider
	[greenColors, 3, 10, 24, 6, 30],// assassin
	[darkblueColors, 5, 15, 28, 12, 30],// mage
	[orangeColors, 4, 6, 32, 5, 30],// archer
	[yellowColors, 3, 10, 14, 5, 90],// saber
	];

var stat = 0;
var enemyx = 16;
var enemyy = 16;
var eSprite;
var edir;
var mySprite;
var gTimer;
var invincibleTimer;
var invincible = false;
var eb = [];
var b = [];
var rpatt = -1;
var bNum = 0;
var rand = 0;
var end = true;

var surviveTime = 0;
var count = 0;
var dir, sdir;
var x = 16;
var y = 28;

var erattackTimer;
var rage = false;
var rageLim = false;
var erCounter = 0;
var hitNum = 0;
var selecting = false;
var hard;

var selectionTimer;

var x3 = [12, 13, 14, 15, 16, 17, 12, 13, 14, 15, 16, 17, 16, 17, 16, 17, 16, 17, 12, 13, 14, 15, 16, 17, 12, 13, 14, 15, 16, 17, 16, 17, 16, 17, 16, 17, 12, 13, 14, 15, 16, 17, 12, 13, 14, 15, 16, 17];
var x2 = [12, 13, 14, 15, 16, 17, 12, 13, 14, 15, 16, 17, 16, 17, 16, 17, 16, 17, 12, 13, 14, 15, 16, 17, 12, 13, 14, 15, 16, 17, 12, 13, 12, 13, 12, 13, 12, 13, 14, 15, 16, 17, 12, 13, 14, 15, 16, 17];
var y2n3 = [9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20];
var dischar = function (startx, y, word) {
	var split = word.split('');
	for (var i = 0; i < split.length; i++) {
		PS.glyph(startx + i, y, split[i]);
	}
}

var gotHit = function () {
	stat++;
	PS.spriteSolidColor(mySprite, statusColor[stat]);
	invincible = true;
	invincibleTimer = PS.timerStart(invincibleTime, invi);
}

var eHit = function () {
	PS.spriteSolidColor(eSprite, 0x87e1db);
	hitNum += damage;
	PS.spriteSolidAlpha(eSprite, 255 - hitNum);
	PS.audioPlay("fx_drip2");
}

var ebcreate = function (ebx, eby, ebdir) {
	var tempSprite = PS.spriteSolid(1, 1);
	PS.spriteSolidColor(tempSprite, 0x87e1db);
	PS.spritePlane(tempSprite, 0);
	PS.spriteAxis(tempSprite, 0, 0);
	var temp = [ebx, eby, ebdir, tempSprite];
	eb.push(temp);
}

var ebupd = function () {
	for (var i = eb.length - 1; i >= 0; i--) {
		if (eb[i][0] < 0 || eb[i][0] > 31 || eb[i][1] < 0 || eb[i][1] > 31) {
			PS.spriteDelete(eb[i][3]);
			eb.splice(i, 1);
			continue;
		}
		if (eb[i][0] == x && eb[i][1] == y) {
			PS.spriteDelete(eb[i][3]);
			eb.splice(i, 1);
			if (!invincible) {
				gotHit();
			}
			continue;
		}
		//console.log(eb.length);
		if (eb[i][2] == 0) {
			eb[i][0]--;
			eb[i][1]--;
		} else if (eb[i][2] == 1) {
			eb[i][1]--;
		} else if (eb[i][2] == 2) {
			eb[i][0]++;
			eb[i][1]--;
		} else if (eb[i][2] == 3) {
			eb[i][0]--;
		} else if (eb[i][2] == 5) {
			eb[i][0]++;
		} else if (eb[i][2] == 6) {
			eb[i][0]--;
			eb[i][1]++;
		} else if (eb[i][2] == 7) {
			eb[i][1]++;
		} else if (eb[i][2] == 8) {
			eb[i][0]++;
			eb[i][1]++;
		} PS.spriteMove(eb[i][3], eb[i][0], eb[i][1]);

		if (eb[i][0] < 0 || eb[i][0] > 31 || eb[i][1] < 0 || eb[i][1] > 31) {
			PS.spriteDelete(eb[i][3]);
			eb.splice(i, 1);
			continue;
		}
	}
}

var bcreate = function (bdir) {
	PS.audioPlay("fx_drip1");
	bNum++;
	var tempSprite = PS.spriteSolid(1, 1);
	PS.spriteSolidColor(tempSprite, 0xFFFFFF);
	PS.spritePlane(tempSprite, 0);
	PS.spriteAxis(tempSprite, 0, 0);
	var temp = [x, y, bdir, tempSprite, 0];
	b.push(temp);
}

var bupd = function () {
	for (var i = b.length - 1; i >= 0; i--) {
		if (b[i][0] < 0 || b[i][0] > 31 || b[i][1] < 0 || b[i][1] > 31 || b[i][4] >= range) {
			PS.spriteDelete(b[i][3]);
			b.splice(i, 1);
			continue;
		}
		if (b[i][0] <= enemyx + 1 && b[i][0] >= enemyx - 1 && b[i][1] <= enemyy + 1 && b[i][1] >= enemyy - 1) {
			eHit();
			PS.spriteDelete(b[i][3]);
			b.splice(i, 1);
			continue;
		}
		if (b[i][2] == 1) {
			b[i][1]--;
			// if (b[i][1] < 0)
			// 	b[i][1] = 31;
		} else if (b[i][2] == 2) {
			b[i][1]++;
			// if (b[i][1] > 31)
			// 	b[i][1] = 0;
		} else if (b[i][2] == 3) {
			b[i][0]--;
			// if (b[i][0] < 0)
			// 	b[i][0] = 31;
		} else if (b[i][2] == 4) {
			b[i][0]++;
			// if (b[i][0] > 31)
			// 	b[i][0] = 0;
		}
		PS.spriteMove(b[i][3], b[i][0], b[i][1]);
		b[i][4]++;
		//
		if (b[i][0] < 0 || b[i][0] > 31 || b[i][1] < 0 || b[i][1] > 31 || b[i][4] >= range) {
			PS.spriteDelete(b[i][3]);
			b.splice(i, 1);
			continue;
		}
	}
}

var echeck = function () {
	if (enemyy >= 30) {
		edir = 8 - edir;
		enemyy--;
	} else if (enemyy <= 1) {
		edir = 8 - edir;
		enemyy++;
	} else if (enemyx >= 30) {
		edir = 8 - edir;
		enemyx--;
	} else if (enemyx <= 1) {
		edir = 8 - edir;
		enemyx++;
	}
}

var eattack = function () {
	var patt = Math.floor(Math.random() * (3));
	if (patt == 1) {
		ebcreate(enemyx - 1, enemyy - 1, 0);
		ebcreate(enemyx + 1, enemyy - 1, 2);
		ebcreate(enemyx - 1, enemyy + 1, 6);
		ebcreate(enemyx + 1, enemyy + 1, 8);
	} else if (patt == 2) {
		ebcreate(enemyx, enemyy - 1, 1);
		ebcreate(enemyx - 1, enemyy, 3);
		ebcreate(enemyx + 1, enemyy, 5);
		ebcreate(enemyx, enemyy + 1, 7);
		ebcreate(enemyx - 1, enemyy - 1, 0);
		ebcreate(enemyx + 1, enemyy - 1, 2);
		ebcreate(enemyx - 1, enemyy + 1, 6);
		ebcreate(enemyx + 1, enemyy + 1, 8);
	}
}

var erattack = function () {
	// rage = true;
	// rageLim = false;
	//console.log(erCounter);
	if (erCounter >= 15) {
		PS.timerStop(erattackTimer);
		erCounter = 0;
		rage = false;
		rageLim = false;
		PS.spriteSolidColor(eSprite, PS.COLOR_BLUE);
	}
	if (erCounter >= 12 || erCounter < 3) {
		erCounter++;
	}
	else if (rpatt == 5) {
		for (var i = 0; i < 32; i += 4) {
			ebcreate(i, 31, 1);
		}
		erCounter++;
	}
	else if (rpatt == 4) {
		for (var i = 0; i < 32; i += 4) {
			ebcreate(31, i, 3);
		}
		erCounter++;
	}
	else if (rpatt == 3) {
		for (var i = 0; i < 32; i += 4) {
			ebcreate(i, 0, 7);
		}
		erCounter++;
	}
	else if (rpatt == 2) {
		for (var i = 0; i < 32; i += 4) {
			ebcreate(0, i, 5);
		}
		erCounter++;
	}
	else if (rpatt == 1) {
		ebcreate(enemyx, enemyy - 1, 1);
		ebcreate(enemyx - 1, enemyy, 3);
		ebcreate(enemyx + 1, enemyy, 5);
		ebcreate(enemyx, enemyy + 1, 7);
		ebcreate(enemyx - 1, enemyy - 1, 0);
		ebcreate(enemyx + 1, enemyy - 1, 2);
		ebcreate(enemyx - 1, enemyy + 1, 6);
		ebcreate(enemyx + 1, enemyy + 1, 8);
		erCounter += 0.5;
	} else if (rpatt == 0) {
		var temp = 2 * (Math.floor(Math.random() * (2)) - 1);
		enemyx = x + temp;
		enemyy = y + temp;
		erCounter = 17;
	}
}

function startRage() {
	rpatt = Math.floor(Math.random() * (6));
	erattackTimer = PS.timerStart(10, erattack);
}

var moveDir = function () {
	if (edir == 0) {
		enemyx--;
		enemyy--;

	} else if (edir == 1) {
		enemyy--;
	} else if (edir == 2) {
		enemyx++;
		enemyy--;
	} else if (edir == 3) {
		enemyx--;
	} else if (edir == 5) {
		enemyx++;
	} else if (edir == 6) {
		enemyx--;
		enemyy++;
	} else if (edir == 7) {
		enemyy++;
	} else if (edir == 8) {
		enemyx++;
		enemyy++;
	}
	PS.spriteMove(eSprite, enemyx, enemyy);
}

var RandomMove = function () {
	edir = Math.floor(Math.random() * (9));
	while (edir == 4) {
		edir = Math.floor(Math.random() * (9));
	}
}

var game = function () {
	//console.log(bNum);
	if (!rage) {
		PS.spriteSolidColor(eSprite, PS.COLOR_BLUE);
	} else {
		PS.spriteSolidColor(eSprite, PS.COLOR_BLACK);
	}
	var rand = 0;
	count++;
	echeck();
	bupd();
	PS.spriteMove(mySprite, x, y);
	PS.statusText("Time:" + surviveTime + " Mr.Tang's HP:" + (255 - hitNum));
	if (count % interAttack == 0) {
		if (sdir != -1) {
			bcreate(sdir);
			sdir = -1;
		}
	}

	if (count % 5 == 0 && !rage) {
		moveDir();
	}

	if (count % 60 == 0) {
		RandomMove();
		count = 0;
		surviveTime++;
	}
	if (count % moveSpeed == 0) {
		move();
	}
	if (count % 12 == 0) {
		rand = Math.floor(Math.random() * (9));
		if (rand == 8 && !rageLim) {
			rage = true;
		} else if (rand < 8 && !rage)
			rage = false;
		if (rage && !rageLim) {
			rageLim = true;
			PS.spriteSolidColor(eSprite, PS.COLOR_BLACK);
			startRage();
		} else if (!rage)
			eattack();
	}
	if (count % 2 == 0) {
		ebupd();
	}

	if (stat == maxHealth || (255 - hitNum) <= 0) {
		if (rage)
			PS.timerStop(erattackTimer);
		PS.timerStop(gTimer);
		gameEnd();
	}
}

var gameEnd = function () {
	PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	end = true;
	for (var i = 0; i < b.length; i++) {
		PS.spriteDelete(b[i][3]);
	}
	for (var i = 0; i < eb.length; i++) {
		PS.spriteDelete(eb[i][3]);
	}
	PS.spriteDelete(mySprite);
	PS.spriteDelete(eSprite);

	var timetemp = (30 - surviveTime);
	timetemp = Math.floor(timetemp);

	var damagetemp = hitNum * 2;
	if (damagetemp > 510)
		damagetemp = 510;

	var healthtemp = 300 * (maxHealth - stat) / maxHealth;
	healthtemp = Math.floor(healthtemp);

	var acctemp = (130 - (bNum - (hitNum / damage)) / 1.3);
	acctemp = Math.floor(acctemp);

	var score = timetemp + damagetemp + healthtemp + acctemp;
	dischar(5, 5, "SCORE:");
	dischar(5, 6, "TIME:" + timetemp.toString());
	dischar(5, 7, "DAMAGE:" + damagetemp.toString());
	dischar(5, 8, "HEALTH:" + healthtemp.toString());
	dischar(5, 9, "ACCURACY:" + acctemp.toString());
	dischar(5, 10, "TOTAL:" + score.toString());
	dischar(5, 12, "PRESS 'R' TO RESELECT");
	dischar(5, 13, "PRESS SPACE TO REPLAY");
	if (stat == maxHealth) {
		PS.audioPlay("fx_wilhelm");
		PS.statusText("You Lose! Your score = " + score);
	} else {
		PS.audioPlay("fx_tada");
		winTimer = PS.timerStart(12, winFlash);
		PS.statusText("You Win! Your score = " + score);
	}
}

var winTimer;
var winCount = true;
var winFlash = function () {
	winEnd = true;
	if (!winCount)
		PS.gridShadow(false);
	else
		PS.gridShadow(true, 0xfff971);

	winCount = !winCount;
}

var move = function () {
	if (dir == 1) {
		y--;
		PS.spriteCollide(mySprite, collide);
		if (y < 0)
			y = 31;
		PS.spriteMove(mySprite, x, y);

	}
	else if (dir == 2) {
		y++;
		PS.spriteCollide(mySprite, collide);
		if (y > 31)
			y = 0;
		PS.spriteMove(mySprite, x, y);
	}
	else if (dir == 3) {
		x--;
		PS.spriteCollide(mySprite, collide);
		if (x < 0)
			x = 31;
		PS.spriteMove(mySprite, x, y);
	}
	else if (dir == 4) {
		x++;
		PS.spriteCollide(mySprite, collide);
		if (x > 31)
			x = 0;
		PS.spriteMove(mySprite, x, y);
	}
}

var invi = function () {
	invincible = false;
	PS.timerStop(invincibleTimer);
}

var collide = function (s1, p1, s2, p2, type) {
	if (type === PS.SPRITE_OVERLAP && stat <= 3 && s2 == eSprite) {
		if (!invincible) {
			gotHit();
		}
	}

};

var chooseCharacter = function () {
	//display
	selecting = true;
	PS.statusText("Pick your character");
	PS.glyphColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	dischar(5, 5, "PICK YOUR CHARACTER:");
	dischar(1, 7, "PRESS THE KEY NUMBER TO SELECT");
	dischar(5, 10, "1.        2.      3.");
	dischar(3, 11, "BERSERKER  RIDER  ASSASSIN");
	dischar(5, 13, "ANDY     TONY    TAVEN");
	dischar(5, 19, "4.        5.      6.");
	dischar(5, 20, "MAGE     ARCHER  SABER");
	dischar(4, 22, "VICTOR     ALAN   BENJAMIN");
	PS.color(7, 10, redColors[0]);
	PS.color(17, 10, purpleColors[0]);
	PS.color(25, 10, greenColors[0]);
	PS.color(7, 19, darkblueColors[0]);
	PS.color(17, 19, orangeColors[0]);
	PS.color(25, 19, yellowColors[0]);
}

PS.init = function (system, options) {
	end = false;
	PS.gridSize(32, 32);
	PS.border(PS.ALL, PS.ALL, 0);
	PS.gridColor(PS.COLOR_GRAY);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY);
	PS.gridShadow(true, 0x85e3fe);
	sdir = -1;
	hard = false;
	stat = 0;
	enemyx = 16;
	enemyy = 16;
	//edir;
	rand = Math.floor(Math.random() * (9));
	invincible = false;
	eb = [];
	b = [];
	rpatt = -1;
	surviveTime = 0;
	count = 0;
	x = 16;
	y = 28;
	erattackTimer;
	rage = false;
	rageLim = false;
	erCounter = 0;
	hitNum = 0;
	bNum = 0;
	edir = Math.floor(Math.random() * (9));
	while (edir == 4) {
		edir = Math.floor(Math.random() * (9));
	}
	selectionTimer = PS.timerStart(1, selectInit);
};

var selectInit = function () {
	chooseCharacter();
	console.log(character);
	if (character != -1) {
		PS.audioPlay("fx_powerup3");
		PS.timerStop(selectionTimer);
		PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY);
		PS.glyph(PS.ALL, PS.ALL, "");
		console.log(character);
		selecting = false;
		aniCount = 2;
		for (var i = 7; i < 23; i++) {
			PS.color(PS.ALL, i, PS.COLOR_RED);
		}
		for (var i = 0; i < y2n3.length; i++) {
			PS.color(x3[i], y2n3[i], PS.COLOR_WHITE);
		}
		aniTimer = PS.timerStart(60, startAni);
	}
}

var aniTimer;
var aniCount = 2;
var startAni = function () {
	for (var i = 7; i < 23; i++) {
		PS.color(PS.ALL, i, PS.COLOR_RED);
	}

	if (aniCount == 2) {
		PS.audioPlay("fx_tick");
		for (var i = 0; i < y2n3.length; i++) {
			PS.color(x2[i], y2n3[i], PS.COLOR_WHITE);
		}
	} else if (aniCount == 1) {
		PS.audioPlay("fx_tick");
		for (var i = 9; i < 21; i++) {
			PS.color(16, i, PS.COLOR_WHITE);
			PS.color(15, i, PS.COLOR_WHITE);
		}
	} else {
		PS.audioPlay("fx_blip");
		PS.timerStop(aniTimer);
		PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY);
		statusColor = characters[character][0];
		maxHealth = statusColor.length;
		moveSpeed = characters[character][1];
		interAttack = characters[character][2];
		range = characters[character][3];
		damage = characters[character][4];
		invincibleTime = characters[character][5];
		eSprite = PS.spriteSolid(3, 3);
		PS.spriteSolidColor(eSprite, PS.COLOR_BLUE);
		PS.spritePlane(eSprite, 2);
		PS.spriteAxis(eSprite, 1, 1);

		mySprite = PS.spriteSolid(1, 1);
		PS.spriteSolidColor(mySprite, statusColor[0]);
		PS.spritePlane(mySprite, 1);
		PS.spriteAxis(mySprite, 0, 0);

		PS.spriteMove(eSprite, enemyx, enemyy);
		end = false;
		gTimer = PS.timerStart(1, game);
		aniCount = 2;
	}
	aniCount--;
}

var winEnd = true;
PS.keyDown = function (key, shift, ctrl, options) {
	//W:119    S: 115      A:97       D:100
	//up: 1006 down: 1008 left: 1005 right: 1007 
	//console.log(key);
	if (key == 119) {
		dir = 1;
	}
	else if (key == 115) {
		dir = 2;
	}
	else if (key == 97) {
		dir = 3;
	}
	else if (key == 100) {
		dir = 4;
	}
	if (key == 1006) {
		sdir = 1;
	}
	else if (key == 1008) {
		sdir = 2;
	}
	else if (key == 1005) {
		sdir = 3;
	}
	else if (key == 1007) {
		sdir = 4;
	}
	if (end && key == 32) {
		if (stat != maxHealth && winEnd) {
			PS.timerStop(winTimer);
			winEnd = false;
		}
		PS.init();
	}
	if (end && key == 114) {
		if (stat != maxHealth && winEnd) {
			PS.timerStop(winTimer);
			winEnd = false;
		}
		PS.init();
		character = -1;
	}
	if (selecting && key == 49) {
		character = 1;
		//console.log(1);
	}
	if (selecting && key == 50) {
		character = 2;
	}
	if (selecting && key == 51) {
		character = 3;
	}
	if (selecting && key == 52) {
		character = 4;
	}
	if (selecting && key == 53) {
		character = 5;
	}
	if (selecting && key == 54) {
		character = 6;
	}
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function (key, shift, ctrl, options) {
	if (!hard && (key == 119 || key == 115 || key == 97 || key == 100)) {
		dir = -1;
	}
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function (sensors, options) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};
