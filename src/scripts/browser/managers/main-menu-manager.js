import {findItemById} from '../menus/expressions/utils';
import platform from '../utils/platform';
import template from '../menus/main';

import Menu from 'menu';
import AutoUpdater from '../components/auto-updater';
import EventEmitter from 'events';

class MainMenuManager extends EventEmitter {

  create() {
    if (!this.menu) {
      this.menu = Menu.buildFromTemplate(template);
      log('app menu created');
    } else {
      log('app menu already created');
    }
  }

  setDefault() {
    if (this.menu) {
      Menu.setApplicationMenu(this.menu);
      log('app menu set');
    } else {
      logError(new Error('menu not created'));
    }
  }

  setAutoUpdaterListeners() {
    const checkUpdateItem = findItemById(this.menu.items, 'check-for-update');
    if (!checkUpdateItem) {
      logError(new Error('menu item check-for-update not found'));
      return;
    }

    AutoUpdater.on('error', () => {
      log('auto updater on error');
      checkUpdateItem.label = 'Check for &Update';
      checkUpdateItem.enabled = true;
    });

    AutoUpdater.on('checking-for-update', () => {
      log('auto updater on checking-for-update');
      checkUpdateItem.label = 'Checking for &Update...';
      checkUpdateItem.enabled = false;
    });

    AutoUpdater.on('update-available', () => {
      log('auto updater on update-available');
      if (platform.isLinux) {
        checkUpdateItem.label = 'Download &Update';
        checkUpdateItem.enabled = true;
      } else {
        checkUpdateItem.label = 'Downloading &Update...';
        checkUpdateItem.enabled = false;
      }
    });

    AutoUpdater.on('update-not-available', () => {
      log('auto updater on update-not-available');
      checkUpdateItem.label = 'Check for &Update';
      checkUpdateItem.enabled = true;
    });

    AutoUpdater.on('update-downloaded', () => {
      log('auto updater on update-downloaded');
      checkUpdateItem.label = 'Restart and Install &Update';
      checkUpdateItem.enabled = true;
    });
  }

}

export default MainMenuManager;