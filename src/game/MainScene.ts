import Phaser from 'phaser';
import type { Zone } from '../types';
import { findZoneAtPoint, ZONES } from '../config/zones';
import {
  DEBUG_MODE,
  MAP_ASSET_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  PLAYER_BODY_HEIGHT,
  PLAYER_BODY_WIDTH,
  PLAYER_SPEED,
  PLAYER_SPRITE_HEIGHT,
  SPAWN_POINT,
  ZONE_TEXTURE_KEY,
} from '../config/game';
import { GAME_EVENT, gameEvents } from './events';
import { resetVirtualInput, virtualInput } from './inputBridge';
import { buildColliders, type ColliderDef } from '../config/colliders';

export const MAIN_SCENE_KEY = 'MainScene';

const DEPTH = {
  map: 0,
  zoneHighlight: 10,
  player: 2000,
  debug: 9000,
} as const;

const SKIN = 0xf3c9a6;
const SKIN_SHADOW = 0xe5b48e;

/**
 * Thế giới game: render bản đồ THPT Bắc Bình, nhân vật học sinh pixel,
 * camera bám theo, phát hiện vùng tương tác và phát sự kiện cho React UI.
 */
export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private playerVisual!: Phaser.GameObjects.Container;
  private shadow!: Phaser.GameObjects.Graphics;
  private bubble!: Phaser.GameObjects.Container;
  /** Nhóm va chạm công trình/vật thể tự nhiên (solid, roofs, extras). */
  private colliders!: Phaser.Physics.Arcade.StaticGroup;

  /** Vật lý được gắn vào một hình chữ nhật vô hình đặt ở chân nhân vật. */
  private playerPhysics!: Phaser.GameObjects.Rectangle;
  private playerBody!: Phaser.Physics.Arcade.Body;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<'W' | 'A' | 'S' | 'D' | 'E' | 'ENTER', Phaser.Input.Keyboard.Key>;
  private zoneHighlight!: Phaser.GameObjects.Graphics;
  private highlightTween?: Phaser.Tweens.Tween;

  private currentZone: Zone | null = null;
  private controlsEnabled = true;
  private facing: 1 | -1 = 1;
  private walkTimer = 0;
  private debugHud?: Phaser.GameObjects.Text;

  constructor() {
    super(MAIN_SCENE_KEY);
  }

  preload(): void {
    const base = import.meta.env.BASE_URL || '/';
    this.load.image(ZONE_TEXTURE_KEY, `${base}${MAP_ASSET_PATH}`);
  }

  create(): void {
    if (!this.textures.exists(ZONE_TEXTURE_KEY)) {
      this.createFallbackBackground();
      gameEvents.emit(GAME_EVENT.error, 'Không tải được ảnh bản đồ public/assets/map_thptbb.png');
      return;
    }

    this.add.image(0, 0, ZONE_TEXTURE_KEY).setOrigin(0, 0).setDepth(DEPTH.map);

    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    this.zoneHighlight = this.add.graphics().setDepth(DEPTH.zoneHighlight).setVisible(false);
    this.highlightTween = this.tweens.add({
      targets: this.zoneHighlight,
      alpha: { from: 0.55, to: 1 },
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true,
    });

    this.createPlayer(SPAWN_POINT.x, SPAWN_POINT.y);
    this.setupCamera();
    this.setupInput();
    this.createWalls();
    this.createColliders();

    if (DEBUG_MODE) {
      this.drawDebugZones();
      this.debugHud = this.add
        .text(12, 12, '', {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: '#0f2059',
          padding: { x: 8, y: 6 },
        })
        .setScrollFactor(0)
        .setDepth(DEPTH.debug + 10);
    }

    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);

    this.cameras.main.fadeIn(450, 9, 21, 54);
    gameEvents.emit(GAME_EVENT.ready);
  }

  /** Bật/tắt điều khiển khi mở modal kỷ niệm hoặc hướng dẫn. */
  public setControlsEnabled(enabled: boolean): void {
    this.controlsEnabled = enabled;
    if (!enabled) {
      resetVirtualInput();
      this.playerBody?.setVelocity(0, 0);
    }
  }

  /** Cho phép UI bên ngoài chủ động mở khu vực hiện tại (nút "Khám phá"). */
  public getCurrentZone(): Zone | null {
    return this.currentZone;
  }

  public teleportTo(x: number, y: number): void {
    if (!this.playerPhysics) return;
    this.playerPhysics.setPosition(x, y);
    this.playerBody?.reset(x, y);
  }

  // ---------------------------------------------------------------------------
  // Khởi tạo
  // ---------------------------------------------------------------------------

  private createFallbackBackground(): void {
    this.cameras.main.setBackgroundColor('#0f2059');
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        'Không tìm thấy ảnh bản đồ!\nHãy đặt file tại public/assets/map_thptbb.png',
        {
          fontFamily: 'sans-serif',
          fontSize: '18px',
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: Math.min(560, this.scale.width - 40) },
        },
      )
      .setOrigin(0.5);
  }

  private createWalls(): void {
    const thickness = 48;
    const walls = this.physics.add.staticGroup();

    const wallDefs: Array<{ x: number; y: number; width: number; height: number }> = [];
    const pushWall = (x: number, y: number, width: number, height: number) => {
      if (width > 0 && height > 0) wallDefs.push({ x, y, width, height });
    };

    // Mở phần lối đi ở giữa khu vực cong_truong (Cổng Trường) ở cạnh dưới cùng.
    const gate = ZONES.find((z) => z.id === 'cong_truong');
    const gapStart = gate ? Math.round(gate.x + gate.width * 0.2) : 0;
    const gapEnd = gate ? Math.round(gate.x + gate.width * 0.8) : 0;

    // Cạnh trên
    pushWall(-thickness, -thickness, MAP_WIDTH + thickness * 2, thickness);
    // Cạnh dưới — cắt đoạn lối đi ở giữa cong_truong
    if (gapEnd > gapStart) {
      pushWall(-thickness, MAP_HEIGHT, gapStart + thickness, thickness);
      pushWall(gapEnd, MAP_HEIGHT, MAP_WIDTH + thickness * 2 - gapEnd, thickness);
    } else {
      pushWall(-thickness, MAP_HEIGHT, MAP_WIDTH + thickness * 2, thickness);
    }
    // Cạnh trái / phải
    pushWall(-thickness, 0, thickness, MAP_HEIGHT);
    pushWall(MAP_WIDTH, 0, thickness, MAP_HEIGHT);

    for (const wall of wallDefs) {
      const rect = this.add
        .rectangle(
          wall.x + wall.width / 2,
          wall.y + wall.height / 2,
          wall.width,
          wall.height,
          0xff0000,
          DEBUG_MODE ? 0.15 : 0,
        )
        .setVisible(DEBUG_MODE);
      walls.add(rect);
    }

    this.physics.add.collider(this.playerPhysics, walls);
  }

  /**
   * Tạo các vật cản solid: nhà công trình (bbox khu vực), mái nhà xe (chỉ
   * phần trên, cho phép đi bộ bên dưới gầm), cây xanh, tảng đá, bệ cột cờ.
   * Tất cả đều gắn collider vào nhóm `colliders`; va chạm được kiểm tra qua
   * body chân nhân vật (playerPhysics).
   */
  private createColliders(): void {
    this.colliders = this.physics.add.staticGroup();
    const { solid, roofs, extras } = buildColliders();
    const defs: ColliderDef[] = [...solid, ...roofs, ...extras];

    for (const def of defs) {
      const rect = this.add
        .rectangle(def.x + def.width / 2, def.y + def.height / 2, def.width, def.height)
        .setDepth(DEPTH.map);
      this.colliders.add(rect);
      if (DEBUG_MODE) {
        this.drawColliderDebug(def);
      }
    }

    this.physics.add.collider(this.playerPhysics, this.colliders);
  }

  private drawColliderDebug(def: ColliderDef): void {
    const g = this.add.graphics().setDepth(DEPTH.debug + 5);
    g.lineStyle(1, 0xff3344, 0.9);
    g.strokeRect(def.x, def.y, def.width, def.height);
    g.fillStyle(0xff3344, 0.2);
    g.fillRect(def.x + 1, def.y + 1, def.width - 2, def.height - 2);
    this.add
      .text(def.x + 2, def.y + 2, def.label, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ff3344',
        backgroundColor: '#091536',
        padding: { x: 2, y: 1 },
      })
      .setDepth(DEPTH.debug + 6);
  }

  private createPlayer(x: number, y: number): void {
    // Container hiển thị đặt tại vị trí "chân" nhân vật.
    this.player = this.add.container(x, y).setDepth(DEPTH.player);

    this.shadow = this.add.graphics();
    this.shadow.fillStyle(0x1e293b, 0.22);
    this.shadow.fillEllipse(0, 0, 30, 9);

    this.playerVisual = this.add.container(0, -PLAYER_SPRITE_HEIGHT);
    const graphics = this.add.graphics();
    this.drawStudent(graphics);
    this.playerVisual.add(graphics);

    this.bubble = this.createBubble();

    this.player.add([this.shadow, this.playerVisual, this.bubble]);

    // Hình chữ nhật vô hình làm body vật lý, tâm trùng với chân nhân vật.
    this.playerPhysics = this.add.rectangle(x, y, PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT, 0xffffff, 0);
    this.physics.add.existing(this.playerPhysics);
    this.playerBody = this.playerPhysics.body as Phaser.Physics.Arcade.Body;
    this.playerBody.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT);
    this.playerBody.setCollideWorldBounds(true);
    this.playerBody.setAllowGravity(false);

    // Giữ nhân vật nằm trong vùng chơi chắc chắn (tránh spawn lỗi dữ liệu).
    this.playerPhysics.setPosition(
      Phaser.Math.Clamp(x, 80, MAP_WIDTH - 80),
      Phaser.Math.Clamp(y, 80, MAP_HEIGHT - 80),
    );
  }

  /** Vẽ nhân vật học sinh pixel: áo trắng, váy xanh, cặp tóc gọn gàng. */
  private drawStudent(g: Phaser.GameObjects.Graphics): void {
    const px = (x: number, y: number, w: number, h: number, color: number) => {
      g.fillStyle(color, 1);
      g.fillRect(x, y, w, h);
    };

    // Chân, tất, giày
    px(-5, 41, 3, 11, SKIN);
    px(2, 41, 3, 11, SKIN);
    px(-5, 51, 3, 3, 0xffffff);
    px(2, 51, 3, 3, 0xffffff);
    px(-7, 54, 6, 2, 0x14213d);
    px(1, 54, 6, 2, 0x14213d);

    // Váy xanh thanh lịch
    g.fillStyle(0x1e3a8a, 1);
    g.fillPoints(
      [
        { x: -8, y: 31 },
        { x: 8, y: 31 },
        { x: 11, y: 42 },
        { x: -11, y: 42 },
      ],
      true,
    );
    px(-11, 41, 22, 2, 0x172e6e);
    px(-5, 33, 1, 8, 0x172e6e);
    px(0, 33, 1, 8, 0x172e6e);
    px(5, 33, 1, 8, 0x172e6e);

    // Áo sơ mi trắng đồng phục
    px(-8, 18, 16, 14, 0xf8fafc);
    px(5, 18, 3, 14, 0xdbe6f5);
    px(-4, 18, 8, 2, 0xe2e8f0);
    px(-1, 20, 2, 7, 0xb91c1c);
    px(-6, 22, 2, 2, 0xf0b429);

    // Tay áo
    px(-11, 19, 3, 11, 0xffffff);
    px(8, 19, 3, 11, 0xf8fafc);
    px(-11, 30, 3, 3, SKIN);
    px(8, 30, 3, 3, SKIN_SHADOW);

    // Cổ và đầu
    px(-2, 16, 4, 3, SKIN_SHADOW);
    px(-10, 0, 20, 15, 0x2b1d16);
    px(-7, 4, 14, 12, SKIN);
    px(-8, 0, 16, 6, 0x2b1d16);
    px(-8, 4, 2, 8, 0x2b1d16);
    px(6, 4, 2, 8, 0x2b1d16);

    // Khuôn mặt
    px(-4, 10, 2, 3, 0x1f2937);
    px(2, 10, 2, 3, 0x1f2937);
    px(-6, 13, 2, 1, 0xf2a58c);
    px(4, 13, 2, 1, 0xf2a58c);
    px(-1, 14, 2, 1, 0xb85c4b);
  }

  private createBubble(): Phaser.GameObjects.Container {
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.98);
    bg.fillRoundedRect(-12, -26, 24, 20, 6);
    bg.fillTriangle(-5, -7, 5, -7, 0, -2);
    bg.lineStyle(2, 0x1d4ed8, 1);
    bg.strokeRoundedRect(-12, -26, 24, 20, 6);

    const label = this.add
      .text(0, -16, '!', {
        fontFamily: '"Be Vietnam Pro", Arial, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#1d4ed8',
      })
      .setOrigin(0.5);

    return this.add
      .container(0, -PLAYER_SPRITE_HEIGHT - 10, [bg, label])
      .setAlpha(0)
      .setVisible(false);
  }

  private setupCamera(): void {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    camera.startFollow(this.player, true, 0.12, 0.12);
    camera.setDeadzone(60, 40);
    camera.setFollowOffset(0, 18);
    this.handleResize();
  }

  private setupInput(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;

    this.cursors = keyboard.createCursorKeys();
    this.keys = keyboard.addKeys('W,A,S,D,E,ENTER') as Record<
      'W' | 'A' | 'S' | 'D' | 'E' | 'ENTER',
      Phaser.Input.Keyboard.Key
    >;
    this.setupInteractKeys();
    keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    ]);
  }

  private setupInteractKeys(): void {
    const openCurrentZone = (): void => {
      const zone = this.findCurrentZone();
      if (zone && this.controlsEnabled) {
        gameEvents.emit(GAME_EVENT.zoneInteract, zone);
      }
    };
    // Dùng sự kiện `down` của Key: kích hoạt trên mọi keydown vật lý,
    // an toàn hơn JustDown vì không bị nhiễu bởi keyup xử lý đồng loạt.
    this.keys?.E?.on(Phaser.Input.Keyboard.Events.DOWN, openCurrentZone);
    this.keys?.ENTER?.on(Phaser.Input.Keyboard.Events.DOWN, openCurrentZone);
  }

  private drawDebugZones(): void {
    const g = this.add.graphics().setDepth(DEPTH.debug);
    for (const zone of ZONES) {
      const color = Phaser.Display.Color.HexStringToColor(zone.story.accent).color;
      g.fillStyle(color, 0.12);
      g.fillRect(zone.x, zone.y, zone.width, zone.height);
      g.lineStyle(2, 0xff2d55, 0.9);
      g.strokeRect(zone.x, zone.y, zone.width, zone.height);
      this.add
        .text(zone.x + 4, zone.y + 4, `${zone.id} · ${zone.name}`, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: '#b91c1c',
          padding: { x: 4, y: 2 },
        })
        .setDepth(DEPTH.debug + 1);
    }
  }

  // ---------------------------------------------------------------------------
  // Vòng lặp game
  // ---------------------------------------------------------------------------

  update(time: number, delta: number): void {
    if (!this.playerPhysics || !this.playerBody) return;

    const speed = PLAYER_SPEED;
    let vx = 0;
    let vy = 0;

    if (this.controlsEnabled) {
      const left =
        Boolean(this.cursors?.left.isDown) || Boolean(this.keys?.A.isDown) || virtualInput.left;
      const right =
        Boolean(this.cursors?.right.isDown) || Boolean(this.keys?.D.isDown) || virtualInput.right;
      const up = Boolean(this.cursors?.up.isDown) || Boolean(this.keys?.W.isDown) || virtualInput.up;
      const down =
        Boolean(this.cursors?.down.isDown) || Boolean(this.keys?.S.isDown) || virtualInput.down;

      if (left) vx -= 1;
      if (right) vx += 1;
      if (up) vy -= 1;
      if (down) vy += 1;
    }

    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.SQRT2;
      vx *= inv;
      vy *= inv;
    }

    const moving = vx !== 0 || vy !== 0;
    this.playerBody.setVelocity(vx * speed, vy * speed);

    if (moving) {
      if (vx > 0.01) this.facing = 1;
      else if (vx < -0.01) this.facing = -1;
      this.walkTimer += delta;
    } else {
      this.walkTimer = 0;
    }

    // Đồng bộ hình ảnh với body vật lý.
    this.player.setPosition(this.playerPhysics.x, this.playerPhysics.y);
    const bob = moving ? Math.abs(Math.sin(this.walkTimer / 95)) * 2.6 : 0;
    this.playerVisual.y = -PLAYER_SPRITE_HEIGHT - bob;
    this.playerVisual.scaleX = this.facing;
    this.shadow.scaleX = moving ? 1.04 : 1;

    if (this.controlsEnabled) {
      this.bubble.y = -PLAYER_SPRITE_HEIGHT - 10 + Math.sin(time / 320) * 2.5;
    }

    this.updateZone();

    if (DEBUG_MODE && this.debugHud) {
      const zoneLabel = this.currentZone ? `${this.currentZone.id} (${this.currentZone.name})` : '—';
      this.debugHud.setText(
        `x: ${Math.round(this.playerPhysics.x)}  y: ${Math.round(this.playerPhysics.y)}\nzone: ${zoneLabel}\nzoom: ${this.cameras.main.zoom.toFixed(2)}`,
      );
    }
  }

  private updateZone(): void {
    const zone = this.findCurrentZone();

    if (zone?.id !== this.currentZone?.id) {
      this.currentZone = zone;
      if (zone) {
        this.paintZoneHighlight(zone);
        gameEvents.emit(GAME_EVENT.zoneEnter, zone);
        this.showBubble();
      } else {
        this.zoneHighlight.setVisible(false);
        this.highlightTween?.pause();
        gameEvents.emit(GAME_EVENT.zoneLeave);
        this.hideBubble();
      }
    }

    if (!zone) return;
  }

  private findCurrentZone(): Zone | null {
    return findZoneAtPoint(this.playerPhysics.x, this.playerPhysics.y);
  }

  private paintZoneHighlight(zone: Zone): void {
    const color = Phaser.Display.Color.HexStringToColor(zone.story.accent).color;
    const graphics = this.zoneHighlight;
    graphics.clear();
    graphics.setAlpha(1);
    graphics.setVisible(true);

    graphics.fillStyle(color, 0.1);
    graphics.fillRoundedRect(zone.x + 2, zone.y + 2, zone.width - 4, zone.height - 4, 18);
    graphics.lineStyle(4, color, 0.85);
    graphics.strokeRoundedRect(zone.x + 2, zone.y + 2, zone.width - 4, zone.height - 4, 18);

    // Bốn góc nhấn để vùng tương tác nổi bật hơn trên bản đồ.
    const tick = Math.min(34, zone.width / 4, zone.height / 4);
    const corners = [
      { x: zone.x + 10, y: zone.y + 10, dx: 1, dy: 1 },
      { x: zone.x + zone.width - 10, y: zone.y + 10, dx: -1, dy: 1 },
      { x: zone.x + 10, y: zone.y + zone.height - 10, dx: 1, dy: -1 },
      { x: zone.x + zone.width - 10, y: zone.y + zone.height - 10, dx: -1, dy: -1 },
    ];
    graphics.lineStyle(6, 0xffffff, 0.9);
    for (const corner of corners) {
      graphics.lineBetween(corner.x, corner.y, corner.x + tick * corner.dx, corner.y);
      graphics.lineBetween(corner.x, corner.y, corner.x, corner.y + tick * corner.dy);
    }

    this.highlightTween?.restart();
  }

  private showBubble(): void {
    this.tweens.killTweensOf(this.bubble);
    this.bubble.setVisible(true);
    this.tweens.add({
      targets: this.bubble,
      alpha: 1,
      duration: 220,
      ease: 'Back.easeOut',
    });
  }

  private hideBubble(): void {
    this.tweens.killTweensOf(this.bubble);
    this.tweens.add({
      targets: this.bubble,
      alpha: 0,
      duration: 160,
      onComplete: () => this.bubble.setVisible(false),
    });
  }

  // ---------------------------------------------------------------------------
  // Resize & cleanup
  // ---------------------------------------------------------------------------

  private handleResize(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    if (!width || !height) return;

    const zoom = Phaser.Math.Clamp(Math.min(width / 980, height / 660), 0.8, 1.55);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.setRoundPixels(true);
  }

  private handleShutdown(): void {
    this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    resetVirtualInput();
  }
}
