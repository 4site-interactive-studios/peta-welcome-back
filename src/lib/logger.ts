
export class Logger {
  private readonly debugMode = window.location.search.includes('debug');

  public log(message: string, emoji: string = '🟢', data: unknown = null): void {
    if (!this.debugMode) {
      return;
    }

    let color = 'black';
    let bgColor = '#f0f0f0';

    switch (emoji) {
      case '🟢':
        color = 'green';
        bgColor = '#d4edda';
        break;
      case '🔴':
        color = 'red';
        bgColor = '#f8d7da';
        break;
      case '⚠️':
        color = 'orange';
        bgColor = '#fff3cd';
        break;
      case '🎉':
        color = 'purple';
        bgColor = '#e2d1f3';
        break;
      case '🖼️':
        color = '#0c5460';
        bgColor = '#d1ecf1';
        break;
      case '📐':
        color = '#383d41';
        bgColor = '#e2e3e5';
        break;
      default:
        color = 'black';
        bgColor = '#f0f0f0';
    }

    const style = `color: ${color}; background-color: ${bgColor}; font-weight: bold; font-family: monospace; font-size: 14px; padding: 4px 8px; border-radius: 4px;`;
    const formattedMessage = `%c${emoji} [Welcome Back] ${message}`;

    if (data !== null) {
      console.log(formattedMessage, style, data);
      return;
    }

    console.log(formattedMessage, style);
  }
}