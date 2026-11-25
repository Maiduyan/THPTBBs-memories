import Phaser from 'phaser';
import type { Zone } from '../types';

/**
 * Cầu nối sự kiện giữa Phaser (game) và React (UI).
 * Dùng một emitter toàn cục để tránh phải truyền callback xuyên qua nhiều lớp.
 */
export const gameEvents = new Phaser.Events.EventEmitter();

export const GAME_EVENT = {
  zoneEnter: 'zone:enter',
  zoneLeave: 'zone:leave',
  zoneInteract: 'zone:interact',
  ready: 'game:ready',
  error: 'game:error',
} as const;

export interface GameEventPayloads {
  'zone:enter': Zone;
  'zone:leave': undefined;
  'zone:interact': Zone;
  'game:ready': undefined;
  'game:error': string;
}
