import { createI18n } from 'vue-i18n';

const messages = {
  zh: {
    app: {
      title: '即时翻译',
      textTranslation: '文本翻译',
      voiceTranslation: '语音翻译',
      imageTranslation: '图片翻译'
    },
    textTranslator: {
      sourceLanguage: '源语言',
      targetLanguage: '目标语言',
      inputText: '请输入要翻译的文本',
      translate: '翻译',
      translating: '翻译中...',
      translationResult: '翻译结果',
      readResult: '朗读结果',
      reading: '朗读中...',
      stop: '停止',
      translating: '正在翻译...',
      history: '翻译历史',
      noHistory: '暂无翻译历史',
      sourceText: '原文',
      targetText: '译文',
      language: '语言',
      time: '时间'
    },
    voiceRecorder: {
      startRecording: '开始录音',
      stopRecording: '停止录音',
      recording: '录音中...',
      recordingComplete: '录音完成',
      recordingFailed: '录音失败',
      translating: '正在翻译...',
      translationResult: '翻译结果'
    },
    imageTranslator: {
      selectFromGallery: '从相册选择',
      takePhoto: '拍摄照片',
      clearImage: '清除图片',
      targetLanguage: '目标语言',
      translateImage: '翻译图片',
      translating: '翻译中...',
      result: '图片翻译结果将显示在这里',
      noImage: '请选择或拍摄一张图片'
    },
    model: {
      loading: '模型加载中',
      loadingFailed: '加载翻译模型时出错',
      loaded: '翻译模型已就绪，可以开始翻译'
    },
    error: {
      noText: '请输入要翻译的文本',
      translationFailed: '翻译失败，请稍后重试',
      speechRecognitionFailed: '语音识别失败，请稍后重试',
      textToSpeechFailed: '语音合成失败，请稍后重试',
      imageTranslationFailed: '图片翻译失败，请稍后重试',
      modelNotSupported: '当前模型不支持图片翻译功能'
    },
    settings: {
      title: '设置',
      displayLanguage: '显示语言',
      defaultSourceLanguage: '默认源语言',
      defaultTargetLanguage: '默认翻译语言'
    }
  },
  en: {
    app: {
      title: 'Instant Translation',
      textTranslation: 'Text Translation',
      voiceTranslation: 'Voice Translation',
      imageTranslation: 'Image Translation'
    },
    textTranslator: {
      sourceLanguage: 'Source Language',
      targetLanguage: 'Target Language',
      inputText: 'Please enter text to translate',
      translate: 'Translate',
      translating: 'Translating...',
      translationResult: 'Translation Result',
      readResult: 'Read Result',
      reading: 'Reading...',
      stop: 'Stop',
      translating: 'Translating...',
      history: 'Translation History',
      noHistory: 'No translation history',
      sourceText: 'Source Text',
      targetText: 'Translated Text',
      language: 'Language',
      time: 'Time'
    },
    voiceRecorder: {
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      recording: 'Recording...',
      recordingComplete: 'Recording Complete',
      recordingFailed: 'Recording Failed',
      translating: 'Translating...',
      translationResult: 'Translation Result'
    },
    imageTranslator: {
      selectFromGallery: 'Select from Gallery',
      takePhoto: 'Take Photo',
      clearImage: 'Clear Image',
      targetLanguage: 'Target Language',
      translateImage: 'Translate Image',
      translating: 'Translating...',
      result: 'Image translation result will be displayed here',
      noImage: 'Please select or take a photo'
    },
    model: {
      loading: 'Model Loading',
      loadingFailed: 'Error loading translation model',
      loaded: 'Translation model is ready, you can start translating'
    },
    error: {
      noText: 'Please enter text to translate',
      translationFailed: 'Translation failed, please try again later',
      speechRecognitionFailed: 'Speech recognition failed, please try again later',
      textToSpeechFailed: 'Text-to-speech failed, please try again later',
      imageTranslationFailed: 'Image translation failed, please try again later',
      modelNotSupported: 'Current model does not support image translation'
    },
    settings: {
      title: 'Settings',
      displayLanguage: 'Display Language',
      defaultSourceLanguage: 'Default Source Language',
      defaultTargetLanguage: 'Default Target Language'
    }
  },
  ja: {
    app: {
      title: '即座翻訳',
      textTranslation: 'テキスト翻訳',
      voiceTranslation: '音声翻訳',
      imageTranslation: '画像翻訳'
    },
    textTranslator: {
      sourceLanguage: 'ソース言語',
      targetLanguage: 'ターゲット言語',
      inputText: '翻訳するテキストを入力してください',
      translate: '翻訳',
      translating: '翻訳中...',
      translationResult: '翻訳結果',
      readResult: '結果を読む',
      reading: '読み中...',
      stop: '停止',
      translating: '翻訳中...',
      history: '翻訳履歴',
      noHistory: '翻訳履歴がありません',
      sourceText: '元のテキスト',
      targetText: '翻訳後のテキスト',
      language: '言語',
      time: '時間'
    },
    voiceRecorder: {
      startRecording: '録音開始',
      stopRecording: '録音停止',
      recording: '録音中...',
      recordingComplete: '録音完了',
      recordingFailed: '録音失敗',
      translating: '翻訳中...',
      translationResult: '翻訳結果'
    },
    imageTranslator: {
      selectFromGallery: 'ギャラリーから選択',
      takePhoto: '写真を撮る',
      clearImage: '画像をクリア',
      targetLanguage: 'ターゲット言語',
      translateImage: '画像を翻訳',
      translating: '翻訳中...',
      result: '画像翻訳結果はここに表示されます',
      noImage: '画像を選択または撮影してください'
    },
    model: {
      loading: 'モデルの読み込み中',
      loadingFailed: '翻訳モデルの読み込みエラー',
      loaded: '翻訳モデルが準備完了、翻訳を開始できます'
    },
    error: {
      noText: '翻訳するテキストを入力してください',
      translationFailed: '翻訳に失敗しました、後で再試行してください',
      speechRecognitionFailed: '音声認識に失敗しました、後で再試行してください',
      textToSpeechFailed: '音声合成に失敗しました、後で再試行してください',
      imageTranslationFailed: '画像翻訳に失敗しました、後で再試行してください',
      modelNotSupported: '現在のモデルは画像翻訳をサポートしていません'
    },
    settings: {
      title: '設定',
      displayLanguage: '表示言語',
      defaultSourceLanguage: 'デフォルトのソース言語',
      defaultTargetLanguage: 'デフォルトの翻訳言語'
    }
  },
  fr: {
    app: {
      title: 'Traduction Instantanée',
      textTranslation: 'Traduction de Texte',
      voiceTranslation: 'Traduction Vocale',
      imageTranslation: 'Traduction dImage'
    },
    textTranslator: {
      sourceLanguage: 'Langue Source',
      targetLanguage: 'Langue Cible',
      inputText: 'Veuillez entrer le texte à traduire',
      translate: 'Traduire',
      translating: 'Traduction en cours...',
      translationResult: 'Résultat de la Traduction',
      readResult: 'Lire le Résultat',
      reading: 'Lecture en cours...',
      stop: 'Arrêter',
      translating: 'Traduction en cours...',
      history: 'Historique de Traduction',
      noHistory: 'Aucun historique de traduction',
      sourceText: 'Texte Source',
      targetText: 'Texte Traduit',
      language: 'Langue',
      time: 'Heure'
    },
    voiceRecorder: {
      startRecording: 'Démarrer lEnregistrement',
      stopRecording: 'Arrêter lEnregistrement',
      recording: 'Enregistrement en cours...',
      recordingComplete: 'Enregistrement Terminé',
      recordingFailed: 'Échec de lEnregistrement',
      translating: 'Traduction en cours...',
      translationResult: 'Résultat de la Traduction'
    },
    imageTranslator: {
      selectFromGallery: 'Sélectionner depuis la Galerie',
      takePhoto: 'Prendre une Photo',
      clearImage: 'Effacer lImage',
      targetLanguage: 'Langue Cible',
      translateImage: 'Traduire lImage',
      translating: 'Traduction en cours...',
      result: 'Le résultat de la traduction dimage saffichera ici',
      noImage: 'Veuillez sélectionner ou prendre une photo'
    },
    model: {
      loading: 'Chargement du Modèle',
      loadingFailed: 'Erreur lors du chargement du modèle de traduction',
      loaded: 'Le modèle de traduction est prêt, vous pouvez commencer à traduire'
    },
    error: {
      noText: 'Veuillez entrer le texte à traduire',
      translationFailed: 'Échec de la traduction, veuillez réessayer ultérieurement',
      speechRecognitionFailed: 'Échec de la reconnaissance vocale, veuillez réessayer ultérieurement',
      textToSpeechFailed: 'Échec de la synthèse vocale, veuillez réessayer ultérieurement',
      imageTranslationFailed: 'Échec de la traduction dimage, veuillez réessayer ultérieurement',
      modelNotSupported: 'Le modèle actuel ne prend pas en charge la traduction dimage'
    },
    settings: {
      title: 'Paramètres',
      displayLanguage: 'Langue dAffichage',
      defaultSourceLanguage: 'Langue Source Par Défaut',
      defaultTargetLanguage: 'Langue de Traduction Par Défaut'
    }
  },
  ko: {
    app: {
      title: '인스턴트 번역',
      textTranslation: '텍스트 번역',
      voiceTranslation: '음성 번역',
      imageTranslation: '이미지 번역'
    },
    textTranslator: {
      sourceLanguage: '원본 언어',
      targetLanguage: '대상 언어',
      inputText: '번역할 텍스트를 입력하세요',
      translate: '번역',
      translating: '번역 중...',
      translationResult: '번역 결과',
      readResult: '결과 읽기',
      reading: '읽는 중...',
      stop: '정지',
      translating: '번역 중...',
      history: '번역 기록',
      noHistory: '번역 기록이 없습니다',
      sourceText: '원본 텍스트',
      targetText: '번역된 텍스트',
      language: '언어',
      time: '시간'
    },
    voiceRecorder: {
      startRecording: '녹음 시작',
      stopRecording: '녹음 중지',
      recording: '녹음 중...',
      recordingComplete: '녹음 완료',
      recordingFailed: '녹음 실패',
      translating: '번역 중...',
      translationResult: '번역 결과'
    },
    imageTranslator: {
      selectFromGallery: '갤러리에서 선택',
      takePhoto: '사진 찍기',
      clearImage: '이미지 지우기',
      targetLanguage: '대상 언어',
      translateImage: '이미지 번역',
      translating: '번역 중...',
      result: '이미지 번역 결과가 여기에 표시됩니다',
      noImage: '이미지를 선택하거나 촬영하세요'
    },
    model: {
      loading: '모델 로딩 중',
      loadingFailed: '번역 모델 로딩 오류',
      loaded: '번역 모델 준비 완료, 번역을 시작할 수 있습니다'
    },
    error: {
      noText: '번역할 텍스트를 입력하세요',
      translationFailed: '번역 실패, 나중에 다시 시도하세요',
      speechRecognitionFailed: '음성 인식 실패, 나중에 다시 시도하세요',
      textToSpeechFailed: '음성 합성 실패, 나중에 다시 시도하세요',
      imageTranslationFailed: '이미지 번역 실패, 나중에 다시 시도하세요',
      modelNotSupported: '현재 모델은 이미지 번역을 지원하지 않습니다'
    },
    settings: {
      title: '설정',
      displayLanguage: '표시 언어',
      defaultSourceLanguage: '기본 소스 언어',
      defaultTargetLanguage: '기본 번역 언어'
    }
  }
};

const i18n = createI18n({
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages
});

export default i18n;