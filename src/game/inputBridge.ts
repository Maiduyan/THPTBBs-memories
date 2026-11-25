/**
 * Trạng thái D-Pad ảo dùng chung giữa React (MobileControls) và Phaser (MainScene).
 * Ghi trực tiếp vào object này mỗi khi người chơi chạm/ nhả nút, không cần re-render React.
 */
export interface VirtualInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export const virtualInput: VirtualInputState = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export type VirtualDirection = keyof VirtualInputState;

export function setVirtualDirection(direction: VirtualDirection, pressed: boolean): void {
  virtualInput[direction] = pressed;
}

export function resetVirtualInput(): void {
  virtualInput.up = false;
  virtualInput.down = false;
  virtualInput.left = false;
  virtualInput.right = false;
}
