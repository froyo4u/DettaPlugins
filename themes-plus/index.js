(function(exports,plugin,common,metro,alerts,assets,components,ui,_vendetta,toasts,patcher$1,utils,constants$2,storage){'use strict';var constants$1 = {
  github: {
    url: "https://github.com/nexpid/DettaPlugins/",
    raw: "https://raw.githubusercontent.com/nexpid/DettaPlugins/main/"
  }
};const WebView = metro.find(function(x) {
  return x?.WebView && !x.default;
}).WebView;
metro.findByProps("SvgXml");
metro.findByProps("isJoi");
metro.findByProps("useSharedValue");
const RNFileManager = common.ReactNative.NativeModules.DCDFileManager ?? common.ReactNative.NativeModules.RTNFileManager;
common.ReactNative.NativeModules.BundleUpdaterManager;
common.ReactNative.NativeModules.MMKVManager;
common.ReactNative.NativeModules.DCDSoundManager;
const RNFSManager = common.ReactNative.NativeModules.RNFSManager;const normalizeFilePath = function(path) {
  return path.startsWith("file://") ? path.slice(7) : path;
};
const getOptions = function(encoding) {
  if (typeof encoding === "string") {
    if ([
      "utf8",
      "ascii",
      "base64"
    ].includes(encoding))
      return {
        encoding
      };
    else
      throw new Error(`Invalid encoding type "${String(encoding)}"`);
  } else if (!encoding)
    return {
      encoding: "utf8"
    };
  else
    return encoding;
};
const readFileGeneric = function(filepath, encoding, command) {
  const options = getOptions(encoding);
  return command(normalizeFilePath(filepath)).then(function(b64) {
    let contents;
    if (options.encoding === "utf8") {
      contents = Buffer.from(b64, "base64").toString("utf8");
    } else if (options.encoding === "ascii") {
      contents = Buffer.from(b64, "base64").toString("ascii");
    } else if (options.encoding === "base64") {
      contents = b64;
    }
    return contents;
  });
};
const resolveWrite = function(filepath) {
  let write = {
    style: null,
    path: null
  };
  const constants = RNFileManager.getConstants();
  if (filepath.startsWith(constants.DocumentsDirPath))
    write = {
      style: "documents",
      path: filepath.slice(constants.DocumentsDirPath.length + 1)
    };
  else if (filepath.startsWith(constants.CacheDirPath))
    write = {
      style: "cache",
      path: filepath.slice(constants.CacheDirPath.length + 1)
    };
  else
    throw new Error(`File path "${String(filepath)}" is unsupported on versions <211.6 (not a caches/documents path, missing RNFS)`);
  return write;
};
const RNFS = {
  unlink(filepath) {
    if (RNFSManager)
      return RNFSManager.unlink(normalizeFilePath(filepath)).then(function() {
        return void 0;
      });
    const write = resolveWrite(filepath);
    return RNFileManager.removeFile(write.style, write.path).then(function() {
      return void 0;
    });
  },
  exists(filepath) {
    if (RNFSManager)
      return RNFSManager.exists(normalizeFilePath(filepath));
    else
      return RNFileManager.fileExists(normalizeFilePath(filepath));
  },
  readFile(filepath, encoding) {
    if (RNFSManager)
      return readFileGeneric(filepath, encoding, RNFSManager.readFile);
    else {
      const options = getOptions(encoding);
      if (options.encoding === "ascii")
        throw new Error(`Encoding type "ascii" is unsupported on versions <211.6 (missing RNFS)`);
      else
        return RNFileManager.readFile(filepath, options.encoding);
    }
  },
  writeFile(filepath, contents, encoding) {
    const options = getOptions(encoding);
    if (!RNFSManager) {
      if (options.encoding === "ascii")
        throw new Error(`Encoding type "ascii" is unsupported on versions <211.6 (missing RNFS)`);
      const write = resolveWrite(filepath);
      return RNFileManager.writeFile(write.style, write.path, contents, options.encoding).then(function() {
        return void 0;
      });
    }
    let b64;
    if (options.encoding === "utf8") {
      b64 = Buffer.from(contents, "utf8").toString("base64");
    } else if (options.encoding === "ascii") {
      b64 = Buffer.from(contents, "ascii").toString("base64");
    } else if (options.encoding === "base64") {
      b64 = contents;
    }
    return RNFSManager.writeFile(normalizeFilePath(filepath), b64, options);
  },
  mkdir(filepath) {
    if (!RNFSManager)
      throw new Error(`Function 'mkdir' is unsupported on versions <211.6 (missing RNFS)`);
    return RNFSManager.mkdir(normalizeFilePath(filepath), {}).then(function() {
      return void 0;
    });
  },
  MainBundlePath: RNFSManager?.RNFSMainBundlePath,
  get CachesDirectoryPath() {
    return RNFSManager?.RNFSCachesDirectoryPath ?? RNFileManager.getConstants().CacheDirPath;
  },
  ExternalCachesDirectoryPath: RNFSManager?.RNFSExternalCachesDirectoryPath,
  get DocumentDirectoryPath() {
    return RNFSManager?.RNFSDocumentDirectoryPath ?? RNFileManager.getConstants().DocumentsDirPath;
  },
  DownloadDirectoryPath: RNFSManager?.RNFSDownloadDirectoryPath,
  ExternalDirectoryPath: RNFSManager?.RNFSExternalDirectoryPath,
  ExternalStorageDirectoryPath: RNFSManager?.RNFSExternalStorageDirectoryPath,
  TemporaryDirectoryPath: RNFSManager?.RNFSTemporaryDirectoryPath,
  LibraryDirectoryPath: RNFSManager?.RNFSLibraryDirectoryPath,
  PicturesDirectoryPath: RNFSManager?.RNFSPicturesDirectoryPath,
  FileProtectionKeys: RNFSManager?.RNFSFileProtectionKeys,
  RoamingDirectoryPath: RNFSManager?.RNFSRoamingDirectoryPath,
  hasRNFS: !!RNFSManager
};var define_DEV_LANG_default = { bg: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, cs: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, da: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, de: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, el: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, en: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, es: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, es_419: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, fi: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, fr: { "plugin.name": "Th\xE8mes+", "alert.faq.title": "FAQ GitHub", "alert.faq.confirm": "Ouvrir dans le navigateur", "settings.inactive.no_theme": "Aucun th\xE8me s\xE9lectionn\xE9", "settings.inactive.themes_plus_unsupported": "Themes+ n'est pas pris en charge dans le th\xE8me s\xE9lectionn\xE9", "settings.inactive.no_iconpacks_list": "Impossible de r\xE9cup\xE9rer la liste des packs d'ic\xF4nes", "settings.inactive.no_iconpack_config": "Impossible de r\xE9cup\xE9rer la configuration du pack d'ic\xF4nes s\xE9lectionn\xE9e", "settings.inactive.no_iconpack_files": "Impossible de r\xE9cup\xE9rer le pack d'ic\xF4nes s\xE9lectionn\xE9e", "settings.patch.icons": "Ic\xF4ne personnalis\xE9e", "settings.patch.unread_badge_color": "Couleur du badge de notification", "settings.patch.custom_icon_overlays": "Overlay d'ic\xF4nes personnalis\xE9es", "settings.patch.mention_line_color": "Couleur de la ligne de mention", "settings.patch.iconpack": "Pack d'ic\xF4nes personnalis\xE9es", "settings.is_active": "Themes+ est actif", "settings.is_inactive": "Themes+ est inactif", "settings.open_faq": "Pourquoi Themes+ est-il inactif ?", "sheet.select_iconpack.title": "S\xE9lectionnez un pack d'ic\xF4nes", "sheet.select_iconpack.none": "Aucun", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Auteurs", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "Extension du fichier", "sheet.iconpack_info.base_url": "URL du serveur", "sheet.iconpack_info.failed_to_load": "\xC9chec du chargement !", "modal.dev.title": "Console d\xE9veloppeur", "modal.dev.reload": "Recharger", "modal.dev.nav.iconpack": "Forcer le pack d'ic\xF4nes", "modal.dev.nav.custom_iconpack": "Pack d'ic\xF4nes personnalis\xE9es", "modal.dev.custom_iconpack.title": "Utilise un pack d'ic\xF4nes personnalis\xE9 qui n'est pas dans la liste des packs d'ic\xF4nes.", "modal.dev.custom_iconpack.base_url": "URL du serveur (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "Extension du fichier", "modal.dev.iconpack.title": "Utilise un pack d'ic\xF4nes quel que soit le param\xE8tre du th\xE8me actuel", "modal.dev.iconpack.selected_iconpack": "Pack d'ic\xF4nes s\xE9lectionn\xE9", "toast.init_error": "Themes+ n'a pas pu d\xE9marrer !", "toast.copied_iconpack_info_value": "Valeur copi\xE9e !", "log.init_error": "N'a pas r\xE9ussi \xE0 d\xE9marrer !" }, hi: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, hr: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, hu: { "plugin.name": "T\xE9m\xE1k+", "alert.faq.title": "GitHub GYIK", "alert.faq.confirm": "Megnyit\xE1s b\xF6ng\xE9sz\u0151ben", "settings.inactive.no_theme": "Nincs t\xE9ma kiv\xE1lasztva", "settings.inactive.themes_plus_unsupported": "A T\xE9m\xE1k+ nem t\xE1mogatott a kiv\xE1lasztott t\xE9m\xE1ban", "settings.inactive.no_iconpacks_list": "Nem siker\xFClt lek\xE9rni az ikoncsomagok list\xE1j\xE1t", "settings.inactive.no_iconpack_config": "Nem siker\xFClt lek\xE9rni a kiv\xE1lasztott iconpack konfigur\xE1ci\xF3t", "settings.inactive.no_iconpack_files": "Nem siker\xFClt lek\xE9rni a kiv\xE1lasztott iconpack f\xE1ljait", "settings.patch.icons": "Egy\xE9ni ikonok", "settings.patch.unread_badge_color": "\xC9rtes\xEDt\xE9si jelv\xE9ny sz\xEDne", "settings.patch.custom_icon_overlays": "Egy\xE9ni ikonfel\xFCletek", "settings.patch.mention_line_color": "Eml\xEDt\xE9si \xFCzenet vonal sz\xEDne", "settings.patch.iconpack": "Egy\xE9ni ikoncsomag", "settings.is_active": "T\xE9m\xE1k+ akt\xEDv", "settings.is_inactive": "T\xE9m\xE1k+ inakt\xEDv", "settings.open_faq": "Mi\xE9rt inakt\xEDv a T\xE9m\xE1k+?", "sheet.select_iconpack.title": "Ikoncsomag kiv\xE1laszt\xE1sa", "sheet.select_iconpack.none": "Nincs", "sheet.iconpack_info.description": "Le\xEDr\xE1s", "sheet.iconpack_info.authors": "K\xE9sz\xEDt\u0151k", "sheet.iconpack_info.source": "Forr\xE1s", "sheet.iconpack_info.file_suffix": "F\xE1jl ut\xF3tag", "sheet.iconpack_info.base_url": "Alap URL", "sheet.iconpack_info.failed_to_load": "Sikertelen bet\xF6lt\xE9s!", "modal.dev.title": "Fejleszt\u0151i men\xFC", "modal.dev.reload": "\xDAjrat\xF6lt\xE9s", "modal.dev.nav.iconpack": "Ikoncsomag k\xE9nyszer\xEDt\xE9se", "modal.dev.nav.custom_iconpack": "Egy\xE9ni ikoncsomag", "modal.dev.custom_iconpack.title": "Egy egy\xE9ni ikoncsomagot haszn\xE1l, amely nem szerepel az ikoncsomagok list\xE1j\xE1n.", "modal.dev.custom_iconpack.base_url": "Alap URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "F\xE1jl ut\xF3tag", "modal.dev.iconpack.title": "Ikoncsomagot haszn\xE1l, f\xFCggetlen\xFCl az aktu\xE1lis t\xE9ma be\xE1ll\xEDt\xE1s\xE1t\xF3l", "modal.dev.iconpack.selected_iconpack": "Kiv\xE1lasztott ikoncsomag", "toast.init_error": "A T\xE9m\xE1k+ nem tudott elindulni!", "toast.copied_iconpack_info_value": "Kim\xE1solt \xE9rt\xE9k!", "log.init_error": "Nem siker\xFClt elindulni!" }, it: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Apri nel browser", "settings.inactive.no_theme": "Nessun tema \xE8 selezionato", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Icone Personalizzate", "settings.patch.unread_badge_color": "Colore del badge di notifica", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "Nessuno", "sheet.iconpack_info.description": "Descrizione", "sheet.iconpack_info.authors": "Autori", "sheet.iconpack_info.source": "Sorgente", "sheet.iconpack_info.file_suffix": "Suffisso File", "sheet.iconpack_info.base_url": "URL Base", "sheet.iconpack_info.failed_to_load": "Caricamento fallito!", "modal.dev.title": "Modale Sviluppatore", "modal.dev.reload": "Ricarica", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Valore copiato!", "log.init_error": "Failed to initiate!" }, ja: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, ko: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, lt: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, nl: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, no: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, pl: { "plugin.name": "Themes+", "alert.faq.title": "FAQ GitHub'a", "alert.faq.confirm": "Otw\xF3rz w przegl\u0105darce", "settings.inactive.no_theme": "Nie wybrano motywu", "settings.inactive.themes_plus_unsupported": "Themes+ nie jest obs\u0142ugiwany w wybranym motywie", "settings.inactive.no_iconpacks_list": "Nie mo\u017Cna pobra\u0107 listy pakiet\xF3w ikon", "settings.inactive.no_iconpack_config": "Nie mo\u017Cna pobra\u0107 wybranej konfiguracji pakietu ikon", "settings.inactive.no_iconpack_files": "Nie mo\u017Cna pobra\u0107 wybranej konfiguracji pakietu ikon", "settings.patch.icons": "Niestandardowe ikony", "settings.patch.unread_badge_color": "Kolor odznaki powiadomie\u0144", "settings.patch.custom_icon_overlays": "W\u0142asne nak\u0142adki na ikony", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Niestandardowy pakiet ikon", "settings.is_active": "Themes+ jest aktywny", "settings.is_inactive": "Themes+ jest nieaktywny", "settings.open_faq": "Dlaczego Themes+ jest nieaktywny?", "sheet.select_iconpack.title": "Wybierz paczk\u0119 ikon", "sheet.select_iconpack.none": "Brak", "sheet.iconpack_info.description": "Opis", "sheet.iconpack_info.authors": "Autorzy", "sheet.iconpack_info.source": "\u0179r\xF3d\u0142o", "sheet.iconpack_info.file_suffix": "Rozszerzenie Pliku", "sheet.iconpack_info.base_url": "Podstawowy adres URL", "sheet.iconpack_info.failed_to_load": "Nie uda\u0142o si\u0119 za\u0142adowa\u0107!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Prze\u0142aduj", "modal.dev.nav.iconpack": "Wymu\u015B pakiet ikon", "modal.dev.nav.custom_iconpack": "Niestandardowy pakiet ikon", "modal.dev.custom_iconpack.title": "U\u017Cywa niestandardowego pakietu ikon, kt\xF3ry nie znajduje si\u0119 na li\u015Bcie pakiet\xF3w ikon.", "modal.dev.custom_iconpack.base_url": "Bazowy adres URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "Rozszerzenie Pliku", "modal.dev.iconpack.title": "U\u017Cywa paczki ikon bez wzgl\u0119du na bie\u017C\u0105ce ustawienia motywu", "modal.dev.iconpack.selected_iconpack": "Wybrana paczka ikon", "toast.init_error": "Nie uda\u0142o si\u0119 zainicjowa\u0107 Themes+!", "toast.copied_iconpack_info_value": "Skopiowano warto\u015B\u0107!", "log.init_error": "Nie uda\u0142o si\u0119 zainicjowa\u0107!" }, pt_BR: { "plugin.name": "Temas+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Abrir no navegador", "settings.inactive.no_theme": "Nenhum tema selecionado", "settings.inactive.themes_plus_unsupported": "Temas+ n\xE3o \xE9 suportado no tema selecionado", "settings.inactive.no_iconpacks_list": "N\xE3o foi poss\xEDvel obter lista de pacotes de \xEDcone", "settings.inactive.no_iconpack_config": "N\xE3o foi poss\xEDvel obter a configura\xE7\xE3o do iconpack selecionado", "settings.inactive.no_iconpack_files": "N\xE3o foi poss\xEDvel obter os arquivos do iconpack selecionado", "settings.patch.icons": "\xCDcones Personalizados", "settings.patch.unread_badge_color": "Cor da notifica\xE7\xE3o", "settings.patch.custom_icon_overlays": "Sobreposi\xE7\xF5es de \xEDcone personalizadas", "settings.patch.mention_line_color": "Cor da linha de men\xE7\xE3o da mensagem", "settings.patch.iconpack": "Iconpack personalizado", "settings.is_active": "Temas+ est\xE1 ativo", "settings.is_inactive": "Temas+ est\xE1 inativo", "settings.open_faq": "Por que o Temas+ est\xE1 inativo?", "sheet.select_iconpack.title": "Selecionar Iconpack", "sheet.select_iconpack.none": "Nenhum", "sheet.iconpack_info.description": "Descri\xE7\xE3o", "sheet.iconpack_info.authors": "Autores", "sheet.iconpack_info.source": "C\xF3digo-fonte", "sheet.iconpack_info.file_suffix": "Sufixo de arquivo", "sheet.iconpack_info.base_url": "URL Base", "sheet.iconpack_info.failed_to_load": "Falha ao carregar!", "modal.dev.title": "Modal de Desenvolvedor", "modal.dev.reload": "Recarregar", "modal.dev.nav.iconpack": "For\xE7ar Iconpack", "modal.dev.nav.custom_iconpack": "Iconpack personalizado", "modal.dev.custom_iconpack.title": "Usa um iconpack personalizado que n\xE3o est\xE1 na lista de iconpacks.", "modal.dev.custom_iconpack.base_url": "URL Base (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "Sufixo de arquivo", "modal.dev.iconpack.title": "Usa um iconpack independentemente da configura\xE7\xE3o atual do tema", "modal.dev.iconpack.selected_iconpack": "Pacote selecionado", "toast.init_error": "Temas+ falhou em iniciar!", "toast.copied_iconpack_info_value": "Valor copiado!", "log.init_error": "Falha ao iniciar!" }, ro: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, ru: { "plugin.name": "Themes+", "alert.faq.title": "GitHub \u0427\u0430\u0412\u043E", "alert.faq.confirm": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435", "settings.inactive.no_theme": "\u0422\u0435\u043C\u0430 \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u0430", "settings.inactive.themes_plus_unsupported": "Themes+ \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u0442\u0435\u043C\u043E\u0439", "settings.inactive.no_iconpacks_list": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u043D\u0430\u0431\u043E\u0440\u043E\u0432 \u0438\u043A\u043E\u043D\u043E\u043A", "settings.inactive.no_iconpack_config": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E \u043D\u0430\u0431\u043E\u0440\u0430 \u0438\u043A\u043E\u043D\u043E\u043A", "settings.inactive.no_iconpack_files": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0444\u0430\u0439\u043B\u044B \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u0430\u043A\u0430 \u0438\u043A\u043E\u043D\u043E\u043A", "settings.patch.icons": "\u041A\u0430\u0441\u0442\u043E\u043C\u043D\u044B\u0435 \u0438\u043A\u043E\u043D\u043A\u0438", "settings.patch.unread_badge_color": "\u0426\u0432\u0435\u0442 \u0437\u043D\u0430\u0447\u043A\u0430 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", "settings.patch.custom_icon_overlays": "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0438\u043A\u043E\u043D\u043A\u0438 \u043E\u0432\u0435\u0440\u043B\u0435\u044F", "settings.patch.mention_line_color": "\u0426\u0432\u0435\u0442 \u0441\u0442\u0440\u043E\u043A\u0438 \u0441 \u0443\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435\u043C", "settings.patch.iconpack": "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A", "settings.is_active": "Themes+ \u0430\u043A\u0442\u0438\u0432\u043D\u043E", "settings.is_inactive": "Themes+ \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E", "settings.open_faq": "\u041F\u043E\u0447\u0435\u043C\u0443 Themes+ \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E?", "sheet.select_iconpack.title": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A", "sheet.select_iconpack.none": "\u041D\u0435\u0442", "sheet.iconpack_info.description": "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", "sheet.iconpack_info.authors": "\u0410\u0432\u0442\u043E\u0440\u044B", "sheet.iconpack_info.source": "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A", "sheet.iconpack_info.file_suffix": "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u0430", "sheet.iconpack_info.base_url": "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 URL", "sheet.iconpack_info.failed_to_load": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "\u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C", "modal.dev.nav.iconpack": "\u041F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A", "modal.dev.nav.custom_iconpack": "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A", "modal.dev.custom_iconpack.title": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A, \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043D\u0435\u0442 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0437\u043D\u0430\u0447\u043A\u043E\u0432.", "modal.dev.custom_iconpack.base_url": "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u0430", "modal.dev.iconpack.title": "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u0442\u0435\u043C\u044B", "modal.dev.iconpack.selected_iconpack": "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u043D\u0430\u0431\u043E\u0440 \u0438\u043A\u043E\u043D\u043E\u043A", "toast.init_error": "Themes+ \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C!", "toast.copied_iconpack_info_value": "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E!", "log.init_error": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u043D\u0438\u0446\u0438\u0438\u0440\u043E\u0432\u0430\u0442\u044C!" }, sv: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, th: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, tr: { "plugin.name": "Temalar+", "alert.faq.title": "GitHub SSS", "alert.faq.confirm": "Taray\u0131c\u0131da a\xE7", "settings.inactive.no_theme": "Hi\xE7bir tema se\xE7ilmedi", "settings.inactive.themes_plus_unsupported": "Temalar+ se\xE7ili temada desteklenmiyor", "settings.inactive.no_iconpacks_list": "Simge paketlerinin listesi al\u0131namad\u0131", "settings.inactive.no_iconpack_config": "Se\xE7ili simge paketinin yap\u0131land\u0131rmas\u0131 al\u0131namad\u0131", "settings.inactive.no_iconpack_files": "Se\xE7ili simge paketinin dosyalar\u0131 al\u0131namad\u0131", "settings.patch.icons": "\xD6zel simgeler", "settings.patch.unread_badge_color": "Bildirim rozeti rengi", "settings.patch.custom_icon_overlays": "\xD6zel simge kaplamalar\u0131", "settings.patch.mention_line_color": "Etiketlenen mesajlarda sat\u0131r rengi", "settings.patch.iconpack": "\xD6zel simge paketi", "settings.is_active": "Temalar+ etkin", "settings.is_inactive": "Temalar+ etkin de\u011Fil", "settings.open_faq": "Temalar+ neden etkin de\u011Fil?", "sheet.select_iconpack.title": "Simge Paketi Se\xE7in", "sheet.select_iconpack.none": "Hi\xE7biri", "sheet.iconpack_info.description": "A\xE7\u0131klama", "sheet.iconpack_info.authors": "Yapanlar", "sheet.iconpack_info.source": "Kaynak", "sheet.iconpack_info.file_suffix": "Dosya Son Eki", "sheet.iconpack_info.base_url": "Temel URL", "sheet.iconpack_info.failed_to_load": "Y\xFCklenemedi!", "modal.dev.title": "Geli\u015Ftirici Modal\u0131", "modal.dev.reload": "Yeniden Y\xFCkle", "modal.dev.nav.iconpack": "Simge Paketini Zorla", "modal.dev.nav.custom_iconpack": "\xD6zel Simge Paketi", "modal.dev.custom_iconpack.title": "Simge paketleri listesinde olmayan \xF6zel bir simge paketini kullan\u0131r.", "modal.dev.custom_iconpack.base_url": "Temel URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "Dosya Son Eki", "modal.dev.iconpack.title": "\u015Eimdiki teman\u0131n simge paketi yerine ba\u015Fka bir simge paketi kullan\u0131r", "modal.dev.iconpack.selected_iconpack": "Se\xE7ilen Simge Paketi", "toast.init_error": "Temalar+ ba\u015Flat\u0131lamad\u0131!", "toast.copied_iconpack_info_value": "De\u011Fer kopyaland\u0131!", "log.init_error": "Ba\u015Flat\u0131lamad\u0131!" }, uk: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, vi: { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" }, "zh-Hant": { "plugin.name": "Themes+", "alert.faq.title": "GitHub FAQ", "alert.faq.confirm": "Open in browser", "settings.inactive.no_theme": "No theme is selected", "settings.inactive.themes_plus_unsupported": "Themes+ isn't supported in the selected theme", "settings.inactive.no_iconpacks_list": "Couldn't fetch list of iconpacks", "settings.inactive.no_iconpack_config": "Couldn't fetch selected iconpack config", "settings.inactive.no_iconpack_files": "Couldn't fetch selected iconpack files", "settings.patch.icons": "Custom icons", "settings.patch.unread_badge_color": "Notification badge color", "settings.patch.custom_icon_overlays": "Custom icon overlays", "settings.patch.mention_line_color": "Message mention line color", "settings.patch.iconpack": "Custom iconpack", "settings.is_active": "Themes+ is active", "settings.is_inactive": "Themes+ is inactive", "settings.open_faq": "Why is Themes+ inactive?", "sheet.select_iconpack.title": "Select Iconpack", "sheet.select_iconpack.none": "None", "sheet.iconpack_info.description": "Description", "sheet.iconpack_info.authors": "Authors", "sheet.iconpack_info.source": "Source", "sheet.iconpack_info.file_suffix": "File Suffix", "sheet.iconpack_info.base_url": "Base URL", "sheet.iconpack_info.failed_to_load": "Failed to load!", "modal.dev.title": "Developer Modal", "modal.dev.reload": "Reload", "modal.dev.nav.iconpack": "Force Iconpack", "modal.dev.nav.custom_iconpack": "Custom Iconpack", "modal.dev.custom_iconpack.title": "Uses a custom iconpack which isn't in the iconpacks list.", "modal.dev.custom_iconpack.base_url": "Base URL (raw.githubusercontent.com)", "modal.dev.custom_iconpack.file_suffix": "File Suffix", "modal.dev.iconpack.title": "Uses an iconpack regardless of the current theme's setting", "modal.dev.iconpack.selected_iconpack": "Selected Iconpack", "toast.init_error": "Themes+ failed to initiate!", "toast.copied_iconpack_info_value": "Copied value!", "log.init_error": "Failed to initiate!" } };
function _class_call_check(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _create_class(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _define_property(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
const url = `${constants$1.github.raw}lang/values/`;
const make = function() {
  return RNFS.hasRNFS && RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/vendetta/NexpidLang`);
};
const filePath = function(plugin) {
  return `${RNFS.DocumentDirectoryPath}/vendetta/NexpidLang/${plugin}.json`;
};
const etagPath = function(plugin) {
  return `${RNFS.DocumentDirectoryPath}/vendetta/NexpidLang/${plugin}_etag.txt`;
};
let Lang = /* @__PURE__ */ function() {
  function Lang2(plugin) {
    _class_call_check(this, Lang2);
    _define_property(this, "plugin", void 0);
    _define_property(this, "values", void 0);
    _define_property(this, "controller", void 0);
    _define_property(this, "Values", void 0);
    this.plugin = plugin;
    this.values = null;
    this.controller = new AbortController();
    this.load();
  }
  _create_class(Lang2, [
    {
      key: "load",
      value: async function load() {
        var _this = this;
        const read = async function() {
          if (await RNFS.exists(filePath(_this.plugin)))
            try {
              _this.values = JSON.parse(await RNFS.readFile(filePath(_this.plugin)));
            } catch {
              return;
            }
        };
        if (define_DEV_LANG_default)
          this.values = define_DEV_LANG_default;
        else {
          const res = await fetch(`${url}${this.plugin}.json`, {
            headers: {
              "cache-control": "public, max-age=20"
            }
          });
          if (!res.ok)
            return read();
          make();
          const lastEtag = await RNFS.exists(etagPath(this.plugin)) && await RNFS.readFile(etagPath(this.plugin));
          const newEtag = res.headers.get("etag");
          if (!newEtag)
            return read();
          if (newEtag !== lastEtag) {
            RNFS.writeFile(etagPath(this.plugin), newEtag);
            const txt = await res.text();
            RNFS.writeFile(filePath(this.plugin), txt);
            try {
              this.values = JSON.parse(txt);
            } catch {
              return;
            }
          } else
            read();
        }
      }
    },
    {
      key: "unload",
      value: function unload() {
        this.controller.abort();
      }
    },
    {
      key: "format",
      value: function format(_key, fillers, _def) {
        const def = _def;
        const key = _key;
        if (!this.values)
          return String(key);
        let val = this.values[Lang2.getLang()]?.[key] ?? this.values.en?.[key] ?? def;
        if (!val)
          return String(key);
        const reqs = val.match(/\$\w+/g)?.map(function(x) {
          return x.slice(1);
        }) ?? [];
        for (const r of reqs)
          val = val.replace(new RegExp(`\\$${r}`, "g"), String(r in fillers ? fillers[r] : ""));
        return val;
      }
    }
  ], [
    {
      key: "getLang",
      value: function getLang() {
        const lang = common.i18n.getLocale()?.replace(/-/g, "_") ?? "en";
        if (lang.startsWith("en_"))
          return "en";
        else
          return lang;
      }
    }
  ]);
  return Lang2;
}();const ThemeStore$1 = metro.findByStoreName("ThemeStore");
const { triggerHaptic } = metro.findByProps("triggerHaptic");
const colorModule = metro.findByProps("colors", "unsafe_rawColors");
const colorResolver = colorModule?.internal ?? colorModule?.meta;
const TextStyleSheet = metro.findByProps("TextStyleSheet").TextStyleSheet;
const ActionSheet = metro.findByProps("ActionSheet")?.ActionSheet ?? metro.find(function(x) {
  return x.render?.name === "ActionSheet";
});
const LazyActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const { openLazy, hideActionSheet } = LazyActionSheet;
const { ActionSheetTitleHeader, ActionSheetCloseButton, ActionSheetContentContainer } = metro.findByProps("ActionSheetTitleHeader", "ActionSheetCloseButton", "ActionSheetContentContainer");
metro.findByProps("ActionSheetRow")?.ActionSheetRow;
const Navigator = metro.findByName("Navigator") ?? metro.findByProps("Navigator")?.Navigator;
const modalCloseButton = metro.findByProps("getRenderCloseButton")?.getRenderCloseButton ?? metro.findByProps("getHeaderCloseButton")?.getHeaderCloseButton;
const { popModal, pushModal } = metro.findByProps("popModal", "pushModal");
const Redesign = metro.findByProps("Button", "ContextMenu", "TextInput") ?? {};
function resolveSemanticColor(color) {
  let theme = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ThemeStore$1.theme;
  return colorResolver.resolveSemanticColor(theme, color);
}
function openSheet(sheet, props) {
  try {
    openLazy(new Promise(function(x) {
      return x({
        default: sheet
      });
    }), "ActionSheet", props);
  } catch (e) {
    _vendetta.logger.error(e.stack);
    toasts.showToast("Got error when opening ActionSheet! Please check debug logs", assets.getAssetIDByName("Smal"));
  }
}
function openModal(key, modal) {
  const empty = Symbol("empty");
  if (!Navigator || !modalCloseButton)
    return toasts.showToast(`${[
      Navigator ? empty : "Navigator",
      modalCloseButton ? empty : "modalCloseButton"
    ].filter(function(x) {
      return x !== empty;
    }).join(", ")} is missing! Please try reinstalling your client.`, assets.getAssetIDByName("Small"));
  pushModal({
    key,
    modal: {
      key,
      modal,
      animation: "slide-up",
      shouldPersistUnderModals: false,
      closable: true
    }
  });
}
function doHaptic(dur) {
  triggerHaptic();
  const interval = setInterval(triggerHaptic, 1);
  return new Promise(function(res) {
    return setTimeout(function() {
      return res(clearInterval(interval));
    }, dur);
  });
}
function androidifyColor(color) {
  let alpha = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 255;
  const [_, r, g, b] = color.match(/#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})/i);
  return (alpha & 255) << 24 | (parseInt(r, 16) & 255) << 16 | (parseInt(g, 16) & 255) << 8 | parseInt(b, 16) & 255;
}const { Text: _Text } = components.General;
function TrailingText(param) {
  let { children } = param;
  return /* @__PURE__ */ common.React.createElement(Text, {
    variant: "text-md/medium",
    color: "TEXT_MUTED"
  }, children);
}
function Text(param) {
  let { variant, lineClamp, color, align, style, onPress, getChildren, children, liveUpdate } = param;
  const [_, forceUpdate] = common.React.useReducer(function(x) {
    return ~x;
  }, 0);
  common.React.useEffect(function() {
    if (!liveUpdate)
      return;
    const nextSecond = (/* @__PURE__ */ new Date()).setMilliseconds(1e3);
    let interval;
    const timeout = setTimeout(function() {
      forceUpdate();
      interval = setInterval(forceUpdate, 1e3);
    }, nextSecond - Date.now());
    return function() {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  return /* @__PURE__ */ common.React.createElement(_Text, {
    style: [
      variant ? TextStyleSheet[variant] : {},
      color ? {
        color: resolveSemanticColor(ui.semanticColors[color])
      } : {},
      align ? {
        textAlign: align
      } : {},
      style ?? {}
    ],
    numberOfLines: lineClamp,
    onPress
  }, getChildren?.() ?? children);
}function Modal(props) {
  if (!Navigator || !modalCloseButton)
    return null;
  return /* @__PURE__ */ React.createElement(Navigator, {
    initialRouteName: props.mkey,
    screens: {
      [props.mkey]: Object.assign(utils.without(props, "mkey", "children"), {
        headerLeft: modalCloseButton?.(function() {
          return popModal(props.mkey);
        }),
        render: function() {
          return props.children;
        }
      })
    }
  });
}function flattenStyle(x) {
  return common.ReactNative.StyleSheet.flatten(x) ?? {};
}
function addToStyle(x, y) {
  x.style = Object.assign(flattenStyle(x.style), y);
}
function reloadUI() {
  try {
    const { setAMOLEDThemeEnabled } = metro.findByProps("setAMOLEDThemeEnabled");
    const { useAMOLEDTheme } = metro.findByProps("useAMOLEDTheme");
    const state = useAMOLEDTheme === 2;
    setAMOLEDThemeEnabled(!state);
    setAMOLEDThemeEnabled(state);
  } catch (e) {
    const log = lang.format("log.init_error", {}, "Failed to initiate!");
    console.error(`[${lang.format("plugin.name", {}, "Themes+")}] ${log}`);
    _vendetta.logger.error(`${log}
${e.stack}`);
    toasts.showToast(lang.format("toast.init_error", {}, "Themes+ failed to initiate!"), assets.getAssetIDByName("Small"));
  }
}
function queueReloadUI() {
  if (window.TPfirstLoad)
    reloadUI();
  window.TPfirstLoad = true;
}const { FormRow: FormRow$2, FormRadioRow } = components.Forms;
function IconpackListSheet(param) {
  let { value: _value, callback } = param;
  const [value, setValue] = common.React.useState(_value);
  callback(value);
  const options = [
    {
      label: lang.format("sheet.select_iconpack.none", {}, "None"),
      value: null
    },
    ...active.iconpackList.map(function(x) {
      return {
        label: x.id,
        value: x.id
      };
    })
  ];
  return /* @__PURE__ */ common.React.createElement(ActionSheet, null, /* @__PURE__ */ common.React.createElement(ActionSheetContentContainer, null, /* @__PURE__ */ common.React.createElement(ActionSheetTitleHeader, {
    title: lang.format("sheet.select_iconpack.title", {}, "Select Iconpack"),
    trailing: /* @__PURE__ */ common.React.createElement(ActionSheetCloseButton, {
      onPress: function() {
        return hideActionSheet();
      }
    })
  }), options.map(function(x) {
    return /* @__PURE__ */ common.React.createElement(FormRadioRow, {
      label: x.label,
      onPress: function() {
        return setValue(x.value);
      },
      trailing: /* @__PURE__ */ common.React.createElement(FormRow$2.Arrow, null),
      selected: x.value === value
    });
  })));
}const { BadgableTabBar } = metro.findByProps("BadgableTabBar");
const { ScrollView, View: View$3 } = components.General;
const { FormRow: FormRow$1, FormInput } = components.Forms;
function DevModal() {
  const [tab, setTab] = common.React.useState("iconpack");
  const [debounce, setDebounce] = common.React.useState(false);
  storage.useProxy(vstorage);
  return /* @__PURE__ */ common.React.createElement(Modal, {
    mkey: "dev-modal",
    title: lang.format("modal.dev.title", {}, "Developer Modal")
  }, /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(View$3, {
    style: {
      marginHorizontal: 16,
      marginVertical: 16
    }
  }, /* @__PURE__ */ common.React.createElement(BadgableTabBar, {
    activeTab: tab,
    onTabSelected: setTab,
    tabs: [
      {
        id: "iconpack",
        title: lang.format("modal.dev.nav.iconpack", {}, "Force Iconpack")
      },
      {
        id: "custom-iconpack",
        title: lang.format("modal.dev.nav.custom_iconpack", {}, "Custom Iconpack")
      }
    ]
  })), tab === "custom-iconpack" ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(Text, {
    variant: "text-md/semibold",
    color: "TEXT_NORMAL",
    style: {
      marginHorizontal: 16
    }
  }, lang.format("modal.dev.custom_iconpack.title", {}, "Uses a custom iconpack which isn't in the iconpacks list.")), /* @__PURE__ */ common.React.createElement(FormInput, {
    title: lang.format("modal.dev.custom_iconpack.base_url", {}, "Base URL (raw.githubusercontent.com)"),
    value: vstorage.iconpack.url ?? "",
    onChange: function(x) {
      return vstorage.iconpack.url = x.match(constants$2.HTTP_REGEX_MULTI)?.[0] ?? null;
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput, {
    title: lang.format("modal.dev.custom_iconpack.file_suffix", {}, "File Suffix"),
    value: vstorage.iconpack.suffix,
    onChange: function(x) {
      return vstorage.iconpack.suffix = x;
    }
  }), /* @__PURE__ */ common.React.createElement(Redesign.Button, {
    size: "md",
    variant: "primary",
    text: lang.format("modal.dev.reload", {}, "Reload"),
    onPress: function() {
      if (debounce)
        return;
      setDebounce(true);
      vstorage.iconpack.force = null;
      popModal("dev-modal");
      runUnpatch(false);
      resetCacheID();
      runPatch();
      reloadUI();
    },
    loading: debounce,
    style: {
      marginHorizontal: 16
    }
  })) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(Text, {
    variant: "text-md/semibold",
    color: "TEXT_NORMAL",
    style: {
      marginHorizontal: 16
    }
  }, lang.format("modal.dev.iconpack.title", {}, "Uses an iconpack regardless of the current theme's setting")), /* @__PURE__ */ common.React.createElement(FormRow$1, {
    label: lang.format("modal.dev.iconpack.selected_iconpack", {}, "Selected Iconpack"),
    trailing: /* @__PURE__ */ common.React.createElement(TrailingText, null, vstorage.iconpack.force ?? lang.format("sheet.select_iconpack.none", {}, "None")),
    onPress: function() {
      return openSheet(IconpackListSheet, {
        value: vstorage.iconpack.force,
        callback: function(v) {
          return vstorage.iconpack.force = v;
        }
      });
    }
  }), /* @__PURE__ */ common.React.createElement(Redesign.Button, {
    size: "md",
    variant: "primary",
    text: lang.format("modal.dev.reload", {}, "Reload"),
    onPress: function() {
      if (debounce)
        return;
      setDebounce(true);
      vstorage.iconpack.url = null;
      vstorage.iconpack.suffix = "";
      popModal("dev-modal");
      runUnpatch(false);
      resetCacheID();
      runPatch();
      reloadUI();
    },
    loading: debounce,
    style: {
      marginHorizontal: 16
    }
  }))));
}const { showUserProfile } = metro.findByProps("showUserProfile");
const { fetchProfile } = metro.findByProps("fetchProfile");
const UserStore$1 = metro.findByStoreName("UserStore");
function SmartMention(param) {
  let { userId, color, loadUsername, children } = param;
  const [loadedUsername, setLoadedUsername] = common.React.useState(null);
  common.React.useEffect(function() {
    return !loadedUsername && loadUsername && (UserStore$1.getUser(userId) ? setLoadedUsername(UserStore$1.getUser(userId).username) : fetchProfile(userId).then(function(x) {
      return setLoadedUsername(x.user.username);
    }));
  }, [
    loadUsername
  ]);
  return /* @__PURE__ */ common.React.createElement(Text, {
    variant: "text-md/bold",
    color: color ?? "TEXT_NORMAL",
    onPress: function() {
      return UserStore$1.getUser(userId) ? showUserProfile({
        userId
      }) : fetchProfile(userId).then(function() {
        return showUserProfile({
          userId
        });
      });
    }
  }, loadUsername ? `@${loadedUsername ?? "..."}` : children);
}const { FormRow } = components.Forms;
const parseAuthor = function(x) {
  const splat = x.split(" <");
  if (splat[1])
    return [
      splat[0],
      splat[1].slice(0, -1)
    ];
  else
    return [
      splat[0]
    ];
};
function IconpackInfoSheet() {
  const { iconpack } = active;
  const iconpackAuthors = [];
  if (iconpack) {
    for (let i = 0; i < iconpack.credits.authors.length; i++) {
      const aut = parseAuthor(iconpack.credits.authors[i]);
      if (aut[1])
        iconpackAuthors.push(/* @__PURE__ */ React.createElement(SmartMention, {
          userId: aut[1],
          loadUsername: false,
          color: "TEXT_LINK"
        }, aut[0]));
      else
        iconpackAuthors.push(aut[0]);
      if (i !== iconpack.credits.authors.length - 1)
        iconpackAuthors.push(", ");
    }
  }
  return /* @__PURE__ */ React.createElement(ActionSheet, null, /* @__PURE__ */ React.createElement(ActionSheetContentContainer, null, iconpack ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionSheetTitleHeader, {
    title: iconpack.id,
    trailing: /* @__PURE__ */ React.createElement(ActionSheetCloseButton, {
      onPress: function() {
        return hideActionSheet();
      }
    })
  }), [
    [
      lang.format("sheet.iconpack_info.description", {}, "Description"),
      [
        iconpack.description
      ]
    ],
    [
      lang.format("sheet.iconpack_info.authors", {}, "Authors"),
      iconpackAuthors,
      iconpack.credits.authors.map(function(x) {
        return parseAuthor(x)[0];
      }).join(", ")
    ],
    [
      lang.format("sheet.iconpack_info.source", {}, "Source"),
      [
        iconpack.credits.source
      ]
    ],
    [
      lang.format("sheet.iconpack_info.file_suffix", {}, "File Suffix"),
      [
        iconpack.suffix ?? "-"
      ]
    ],
    [
      lang.format("sheet.iconpack_info.base_url", {}, "Base URL"),
      [
        iconpack.load ?? "-"
      ]
    ]
  ].map(function(param) {
    let [label, val, copyable] = param;
    return /* @__PURE__ */ React.createElement(FormRow, {
      label: val,
      subLabel: label,
      onLongPress: function() {
        common.clipboard.setString(copyable ?? val.join(""));
        toasts.showToast(lang.format("toast.copied_iconpack_info_value", {}, "Copied value!"), assets.getAssetIDByName("toast_copy_link"));
      }
    });
  })) : /* @__PURE__ */ React.createElement(Text, {
    variant: "text-md/semibold",
    color: "TEXT_NORMAL"
  }, lang.format("sheet.iconpack_info.failed_to_load", {}, "Failed to load!"))));
}const { View: View$2 } = components.General;
function settings() {
  let lastTap = 0;
  return /* @__PURE__ */ React.createElement(View$2, {
    style: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%"
    }
  }, active.active ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$2, {
    style: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 16
    }
  }, /* @__PURE__ */ React.createElement(common.ReactNative.Image, {
    source: {
      uri: "asset:/emoji-2705.png"
    },
    style: {
      height: TextStyleSheet["heading-xxl/semibold"].fontSize,
      aspectRatio: 1 / 1,
      marginRight: 8,
      marginTop: 6
    }
  }), /* @__PURE__ */ React.createElement(Text, {
    variant: "heading-xxl/semibold",
    color: "TEXT_NORMAL",
    onPress: function() {
      return lastTap >= Date.now() ? openModal("dev-modal", DevModal) : lastTap = Date.now() + 500;
    }
  }, lang.format("settings.is_active", {}, "Themes+ is active"))), /* @__PURE__ */ React.createElement(View$2, {
    style: {
      flexDirection: "column",
      marginHorizontal: 16
    }
  }, [
    [
      exports.PatchType.Icons
    ],
    [
      exports.PatchType.UnreadBadgeColor
    ],
    [
      exports.PatchType.CustomIconOverlays
    ],
    [
      exports.PatchType.MentionLineColor
    ],
    [
      exports.PatchType.IconPack,
      active.iconpack && /* @__PURE__ */ React.createElement(Text, {
        variant: "text-lg/bold",
        color: "TEXT_LINK",
        onPress: function() {
          return openSheet(IconpackInfoSheet, void 0);
        }
      }, lang.format("settings.patch.iconpack", {}, "Custom iconpack"))
    ]
  ].map(function(param) {
    let [type, children] = param;
    return /* @__PURE__ */ React.createElement(View$2, {
      style: {
        flexDirection: "row",
        maxWidth: "85%"
      }
    }, /* @__PURE__ */ React.createElement(common.ReactNative.Image, {
      source: assets.getAssetIDByName(active.patches.includes(type) ? "ic_radio_square_checked_24px" : "ic_radio_square_24px"),
      style: {
        marginRight: 8,
        height: TextStyleSheet["text-lg/semibold"].fontSize,
        aspectRatio: 1 / 1,
        marginTop: 4
      },
      resizeMode: "cover"
    }), children ? children : /* @__PURE__ */ React.createElement(Text, {
      variant: "text-lg/semibold",
      color: "TEXT_NORMAL"
    }, lang.format(`settings.patch.${type}`, {})));
  }))) : /* @__PURE__ */ React.createElement(View$2, {
    style: {
      flexDirection: "row",
      justifyContent: "center"
    }
  }, /* @__PURE__ */ React.createElement(common.ReactNative.Image, {
    source: {
      uri: "asset:/emoji-274c.png"
    },
    style: {
      height: TextStyleSheet["heading-xxl/semibold"].fontSize,
      aspectRatio: 1 / 1,
      marginRight: 8,
      marginTop: 6
    }
  }), /* @__PURE__ */ React.createElement(Text, {
    variant: "heading-xxl/semibold",
    color: "TEXT_NORMAL",
    onPress: function() {
      if (lastTap >= Date.now()) {
        doHaptic(20);
        openModal("dev-modal", DevModal);
      } else
        lastTap = Date.now() + 500;
    }
  }, lang.format("settings.is_inactive", {}, "Themes+ is inactive"))), active.blehhh.map(function(reason) {
    return /* @__PURE__ */ React.createElement(View$2, {
      style: {
        flexDirection: "row",
        maxWidth: "85%",
        marginTop: 10
      }
    }, /* @__PURE__ */ React.createElement(common.ReactNative.Image, {
      source: {
        uri: "asset:/emoji-2139.png"
      },
      style: {
        height: TextStyleSheet["text-lg/semibold"].fontSize,
        aspectRatio: 1 / 1,
        marginRight: 8,
        marginTop: 6
      }
    }), /* @__PURE__ */ React.createElement(Text, {
      variant: "text-lg/semibold",
      color: "TEXT_NORMAL",
      style: {
        flexWrap: "wrap"
      }
    }, lang.format(`settings.inactive.${reason}`, {})));
  }), /* @__PURE__ */ React.createElement(Text, {
    variant: "text-lg/bold",
    color: "TEXT_LINK",
    style: {
      textDecorationLine: "underline",
      marginTop: 32
    },
    onPress: function() {
      return alerts.showConfirmationAlert({
        title: lang.format("alert.faq.title", {}, "GitHub FAQ"),
        //@ts-expect-error unadded in typings
        children: /* @__PURE__ */ React.createElement(View$2, {
          style: {
            height: 400
          }
        }, /* @__PURE__ */ React.createElement(WebView, {
          source: {
            uri: "https://github.com/nexpid/VendettaThemesPlus#faq"
          },
          style: {
            height: 400,
            width: "100%"
          }
        })),
        confirmText: lang.format("alert.faq.confirm", {}, "Open in browser"),
        confirmColor: "brand",
        onConfirm: function() {
          return common.url.openURL("https://github.com/nexpid/VendettaThemesPlus#faq");
        },
        isDismissable: true
      });
    }
  }, lang.format("settings.open_faq", {}, "Why is Themes+ inactive?")));
}var innerCheck = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEQSURBVHgB7ddNEcIwEEDhDAqQUAlIQAIOQAISKgEJdYAEJCAhEpCwJEN36PQ3gVySvG8m09Me9k0PiTEAAAAAAAAAAAApiEjjj8FUH8f2pzH4GsRRRFIuxN6dp0wRaSUOkTy3/F22JYu0MxlxS3fuczKYcnFuEibZ35MNt3BLnAXEWUGcFdXE6RdtI2cutcTpBstcA2fKjyOf2+7che68MXeQMDb3OGtPgePCnI/z2m6Td5zxC3uOj3CYmSs7jhcYSCM1kTM26zgqcuGj1BRHRUQKYYuKoxJFskXGUX9GskXHUT9GslXEUZGR6oqjAiPVGUdtRKo7jlqIRJyhUSTizOkjPYgDAAAAAAAAAACQwhvdJGS64deM3gAAAABJRU5ErkJggg==";const ThemeStore = metro.findByStoreName("ThemeStore");
function matchTheme(colors) {
  const theme = ThemeStore.theme;
  if ([
    "dark",
    "darker"
  ].includes(theme))
    return colors.dark ?? colors.midnight;
  else if (theme === "light")
    return colors.light;
  else if ([
    "midnight",
    "amoled"
  ].includes(theme))
    return colors.midnight ?? colors.dark;
  else
    return colors.dark;
}
function resolveColor(color) {
  if (Array.isArray(color))
    return matchTheme({
      dark: color[0],
      light: color[1],
      midnight: color[2]
    });
  else if (color.startsWith("SC_"))
    return ui.semanticColors[color.slice(3)] ? resolveSemanticColor(ui.semanticColors[color.slice(3)]) : "#ffffff";
  else if (color.startsWith("RC_"))
    return ui.rawColors[color.slice(3)] ?? "#ffffff";
  else if (color.startsWith("#") && color.length === 4)
    return `#${color[1].repeat(2)}${color[2].repeat(2)}${color[3].repeat(2)}`;
  else if (color.startsWith("#") && color.length === 7)
    return color;
}function getIconTint(plus, icon, customName) {
  const name = customName ?? assets.getAssetByID(icon)?.name;
  if (!name)
    return;
  if (!plus.icons[name])
    return;
  return resolveColor(plus.icons[name]);
}
function asIcon(plus, customName, img) {
  if (typeof img.props.source === "number") {
    const clr = getIconTint(plus, img.props.source, customName);
    if (clr)
      addToStyle(img.props, {
        tintColor: clr
      });
  }
  img.props.ignore = true;
  return img;
}const { View: View$1 } = components.General;
const { MaskedBadge: MaskedBadge$1 } = metro.findByProps("MaskedBadge");
const styles = common.stylesheet.createThemedStyleSheet({
  maskPins: {
    position: "absolute",
    right: -10,
    bottom: -10,
    backgroundColor: ui.semanticColors.BACKGROUND_SECONDARY
  }
});
function getIconOverlay(plus, icon, style) {
  const ic = assets.getAssetByID(icon)?.name;
  if (!ic)
    return;
  if ([
    "ic_new_pins_light",
    "ic_new_pins"
  ].includes(ic))
    return {
      replace: ic.includes("light") ? "icon-pins" : "ic_pins",
      children: /* @__PURE__ */ React.createElement(View$1, {
        style: {
          position: "absolute",
          right: 0,
          bottom: 0
        }
      }, /* @__PURE__ */ React.createElement(MaskedBadge$1, {
        maskStyle: styles.maskPins,
        value: 1,
        hideCount: true
      }))
    };
  else if ([
    "ic_selection_checked_24px",
    "ic_radio_square_checked_24px",
    "ic_check",
    "ic_radio_circle_checked"
  ].includes(ic))
    return {
      style: {
        tintColor: "#5865F2"
      },
      children: /* @__PURE__ */ React.createElement(View$1, {
        style: {
          position: "absolute",
          left: 0,
          top: 0
        }
      }, asIcon(plus, `${ic}__overlay`, /* @__PURE__ */ React.createElement(common.ReactNative.Image, {
        source: {
          uri: innerCheck
        },
        style: [
          ...style,
          {
            tintColor: "#FFF"
          }
        ]
      })))
    };
  else if ([
    "app_installed_check",
    "ic_radio_circle_checked_green"
  ].includes(ic))
    return {
      style: {
        tintColor: "#3BA55C"
      },
      children: /* @__PURE__ */ React.createElement(View$1, {
        style: {
          position: "absolute",
          left: 0,
          top: 0
        }
      }, asIcon(plus, `${ic}__overlay`, /* @__PURE__ */ React.createElement(common.ReactNative.Image, {
        source: {
          uri: innerCheck
        },
        style: [
          ...style,
          {
            tintColor: "#FFF"
          }
        ]
      })))
    };
}const Status = metro.findByName("Status", false);
function fixer(config) {
  const patches = new Array();
  if (config.biggerStatus)
    patches.push(patcher$1.before("default", Status, function(args) {
      var _a;
      const c = [
        ...args
      ];
      const sizes = Object.values(Status.StatusSizes);
      c[0].size = sizes[sizes.findIndex(function(x) {
        return c[0].size === x;
      }) + 1];
      (_a = c[0]).size ?? (_a.size = Status.StatusSizes.XLARGE);
      return c;
    }));
  return function() {
    return patches.forEach(function(x) {
      return x();
    });
  };
}var FillColor;
(function(FillColor2) {
  FillColor2["ButtonIcon"] = "BUTTON_SECONDARY_BACKGROUND_ACTIVE";
})(FillColor || (FillColor = {}));
var fixIcons = [
  [
    "ic_mic_neutral",
    FillColor.ButtonIcon
  ],
  [
    "ic_mic_muted_neutral",
    FillColor.ButtonIcon
  ],
  [
    "ic_soundboard",
    FillColor.ButtonIcon
  ],
  [
    "ic_soundboard_muted",
    FillColor.ButtonIcon
  ],
  [
    "ic_video",
    FillColor.ButtonIcon
  ],
  [
    "ic_video_disabled",
    FillColor.ButtonIcon
  ]
];function getUnreadBadgeColor(plus) {
  if (!plus.unreadBadgeColor)
    return;
  return resolveColor(plus.unreadBadgeColor);
}var constants = {
  iconpacks: {
    list: "https://raw.githubusercontent.com/nexpid/VendettaThemesPlus/main/iconpacks/list.json",
    assets: "https://raw.githubusercontent.com/nexpid/VendettaThemesPlus/main/iconpacks/assets/",
    tree: function(iconpack) {
      return `https://raw.githubusercontent.com/nexpid/VendettaThemesPlus/iconpack-trees/${iconpack}.txt`;
    }
  }
};function getPlusData() {
  const theme = window[window.__vendetta_loader?.features?.themes?.prop]?.data;
  if (!theme)
    return false;
  return theme?.plus;
}const { View } = components.General;
const MaskedBadge = metro.findByProps("MaskedBadge");
const RowGeneratorUtils = metro.findByProps("createBackgroundHighlight");
const UserStore = metro.findByStoreName("UserStore");
async function patcher() {
  const patches = new Array();
  const shouldForce = vstorage.iconpack.force ?? vstorage.iconpack.url;
  const cplus = getPlusData();
  if (!shouldForce) {
    if (cplus === false) {
      active.blehhh.push(exports.InactiveReason.NoTheme);
      return;
    } else if (!cplus) {
      active.blehhh.push(exports.InactiveReason.ThemesPlusUnsupported);
      return;
    }
  }
  const plus = cplus !== false ? cplus : {
    version: 0
  };
  active.patches.length = 0;
  let iconpacks = {
    $schema: "",
    list: []
  };
  try {
    iconpacks = await (await utils.safeFetch(`${constants.iconpacks.list}?_=${exports.cacheID}`)).json();
  } catch {
    active.blehhh.push(exports.InactiveReason.NoIconpacksList);
  }
  active.iconpackList = iconpacks.list;
  const user = UserStore.getCurrentUser();
  const iconpack = vstorage.iconpack?.url ? {
    id: "custom-iconpack",
    description: "A custom iconpack!",
    credits: {
      authors: [
        `${user.username} <${user.id}>`
      ],
      source: "N/A"
    },
    config: null,
    suffix: vstorage.iconpack.suffix,
    load: vstorage.iconpack.url
  } : iconpacks.list.find(function(x) {
    return x.id === plus.iconpack || x.id === vstorage.iconpack.force;
  });
  let iconpackConfig = null;
  if (vstorage.iconpack.url)
    iconpackConfig = {
      biggerStatus: true
    };
  else if (iconpack?.config)
    try {
      iconpackConfig = await (await utils.safeFetch(`${iconpack.config}?_=${exports.cacheID}`)).json();
    } catch {
      active.blehhh.push(exports.InactiveReason.NoIconpackConfig);
    }
  let iconpackPaths = new Array();
  if (iconpack)
    try {
      iconpackPaths = (await (await utils.safeFetch(`${constants.iconpacks.tree(iconpack.id)}?_=${exports.cacheID}`)).text()).replace(/\r/g, "").split("\n");
    } catch {
      active.blehhh.push(exports.InactiveReason.NoIconpackFiles);
    }
  if (!exports.enabled)
    return function() {
      return void 0;
    };
  if (plus?.version !== void 0) {
    active.active = true;
    if (iconpackConfig)
      fixer(iconpackConfig);
    if (plus.icons || plus.customOverlays || iconpack) {
      if (plus.icons)
        active.patches.push(exports.PatchType.Icons);
      if (plus.customOverlays)
        active.patches.push(exports.PatchType.CustomIconOverlays);
      if (iconpack)
        active.patches.push(exports.PatchType.IconPack);
      active.iconpack = iconpack ?? null;
      const iconpackURL = iconpack && (iconpack.load ? !iconpack.load.endsWith("/") ? iconpack.load + "/" : iconpack.load : `${constants.iconpacks.assets}${iconpack.id}/`);
      patches.push(patcher$1.instead("render", common.ReactNative.Image, function(_args, orig) {
        var _a, _b, _c;
        const args = _args.slice();
        const [x] = args;
        if (!x.source || typeof x.source !== "number" || x.ignore)
          return orig(...args);
        const source = x.source;
        const asset = assets.getAssetByID(source);
        const assetIconpackLocation = iconpack && [
          ...asset.httpServerLocation.split("/").slice(2),
          `${asset.name}${iconpack.suffix}.${asset.type}`
        ].join("/");
        const useIconpack = iconpack && (iconpackPaths.length ? iconpackPaths.includes(assetIconpackLocation) : true);
        let overlay;
        if (plus.customOverlays && !useIconpack) {
          overlay = getIconOverlay(plus, source, x.style ? Array.isArray(x.style) ? x.style : [
            x.style
          ] : []);
          if (overlay) {
            if (overlay.replace)
              x.source = assets.getAssetIDByName(overlay.replace);
            if (overlay.style)
              addToStyle(x, overlay.style);
          }
        }
        if (plus.icons) {
          const tint = getIconTint(plus, source);
          if (tint)
            addToStyle(x, {
              tintColor: tint
            });
        }
        if (useIconpack) {
          x.source = {
            uri: `${iconpackURL}${assetIconpackLocation}?_=${exports.cacheID}`
          };
          x.style = flattenStyle(x.style);
          (_a = x.style).width ?? (_a.width = asset.width);
          (_b = x.style).height ?? (_b.height = asset.height);
          const icClr = fixIcons.find(function(x2) {
            return x2[0] === asset.name;
          })?.[1];
          if (icClr)
            (_c = x.style).tintColor ?? (_c.tintColor = ui.semanticColors[icClr] ? resolveSemanticColor(ui.semanticColors[icClr]) : "#fff");
        }
        const ret = orig(...args);
        if (overlay?.children && !useIconpack)
          return /* @__PURE__ */ common.React.createElement(View, null, ret, overlay.children);
        else
          return ret;
      }));
    }
    if (plus.unreadBadgeColor) {
      active.patches.push(exports.PatchType.UnreadBadgeColor);
      patches.push(patcher$1.after("MaskedBadge", MaskedBadge, function(_, ret) {
        const badge = ret && utils.findInReactTree(ret, function(x) {
          return x?.type?.name === "Badge";
        });
        if (badge)
          patches.push(patcher$1.after("type", badge, function(_2, bdg) {
            return bdg?.props && addToStyle(bdg.props, {
              backgroundColor: getUnreadBadgeColor(plus)
            });
          }, true));
      }));
      patches.push(patcher$1.after("default", MaskedBadge, function(_, ret) {
        return ret?.props && addToStyle(ret.props, {
          backgroundColor: getUnreadBadgeColor(plus)
        });
      }));
    }
    if (plus.mentionLineColor) {
      active.patches.push(exports.PatchType.MentionLineColor);
      patches.push(patcher$1.after("createBackgroundHighlight", RowGeneratorUtils, function(param, ret) {
        let [x] = param;
        const clr = resolveColor(plus.mentionLineColor);
        if (x?.message?.mentioned && clr)
          ret.gutterColor = androidifyColor(clr, 200);
      }));
    }
  } else
    active.active = false;
  const patched = active.patches.length;
  if (patched)
    queueReloadUI();
  return function(exit) {
    if (patched && exit)
      queueReloadUI();
    patches.forEach(function(x) {
      return x();
    });
  };
}exports.PatchType=void 0;
(function(PatchType2) {
  PatchType2["Icons"] = "icons";
  PatchType2["UnreadBadgeColor"] = "unread_badge_color";
  PatchType2["CustomIconOverlays"] = "custom_icon_overlays";
  PatchType2["MentionLineColor"] = "mention_line_color";
  PatchType2["IconPack"] = "iconpack";
})(exports.PatchType || (exports.PatchType = {}));
exports.InactiveReason=void 0;
(function(InactiveReason2) {
  InactiveReason2["NoTheme"] = "no_theme";
  InactiveReason2["ThemesPlusUnsupported"] = "themes_plus_unsupported";
  InactiveReason2["NoIconpacksList"] = "no_iconpacks_list";
  InactiveReason2["NoIconpackConfig"] = "no_iconpack_config";
  InactiveReason2["NoIconpackFiles"] = "no_iconpack_files";
})(exports.InactiveReason || (exports.InactiveReason = {}));
const active = {
  active: false,
  iconpack: null,
  iconpackList: [],
  patches: [],
  blehhh: []
};
const vstorage = plugin.storage;
exports.cacheID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
function resetCacheID() {
  exports.cacheID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
exports.enabled = false;
let unpatch;
async function runPatch() {
  exports.enabled = true;
  unpatch = await patcher();
}
function runUnpatch(exit) {
  exports.enabled = false;
  unpatch?.(exit);
}
const lang = new Lang("themes_plus");
var index = {
  onLoad: function() {
    vstorage.iconpack ?? (vstorage.iconpack = {
      url: null,
      suffix: "",
      force: null
    });
    runPatch();
  },
  onUnload: function() {
    return runUnpatch(true);
  },
  settings
};exports.active=active;exports.default=index;exports.lang=lang;exports.resetCacheID=resetCacheID;exports.runPatch=runPatch;exports.runUnpatch=runUnpatch;exports.vstorage=vstorage;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.plugin,vendetta.metro.common,vendetta.metro,vendetta.ui.alerts,vendetta.ui.assets,vendetta.ui.components,vendetta.ui,vendetta,vendetta.ui.toasts,vendetta.patcher,vendetta.utils,vendetta.constants,vendetta.storage);