import { message } from 'ant-design-vue';
import Clipboard from 'clipboard';

function clipboardSuccess(text) {
  message.success('复制成功');
}

function clipboardError() {
  message.error('复制失败');
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  });
  clipboard.on('success', () => {
    clipboardSuccess(text);
    clipboard.destroy();
  });
  clipboard.on('error', () => {
    clipboardError();
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
