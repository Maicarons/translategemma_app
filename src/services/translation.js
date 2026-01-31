/**
 * 翻译服务
 * 负责TranslateGemma模型的集成和文本翻译
 */

import modelManager from './modelManager';

class TranslationService {
  constructor() {
    this.llmInference = null;
    this.isLoading = false;
    this.isLoaded = false;
    this.loadError = null;
    this.supportedLanguages = [
      { code: 'aa', name: 'Afar' },
      { code: 'ab', name: 'Abkhazian' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'ak', name: 'Akan' },
      { code: 'am', name: 'Amharic' },
      { code: 'an', name: 'Aragonese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'as', name: 'Assamese' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'ba', name: 'Bashkir' },
      { code: 'be', name: 'Belarusian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'bm', name: 'Bambara' },
      { code: 'bn', name: 'Bengali' },
      { code: 'bo', name: 'Tibetan' },
      { code: 'br', name: 'Breton' },
      { code: 'bs', name: 'Bosnian' },
      { code: 'ca', name: 'Catalan' },
      { code: 'ce', name: 'Chechen' },
      { code: 'co', name: 'Corsican' },
      { code: 'cs', name: 'Czech' },
      { code: 'cv', name: 'Chuvash' },
      { code: 'cy', name: 'Welsh' },
      { code: 'da', name: 'Danish' },
      { code: 'de', name: 'German' },
      { code: 'dv', name: 'Divehi' },
      { code: 'dz', name: 'Dzongkha' },
      { code: 'ee', name: 'Ewe' },
      { code: 'el', name: 'Greek' },
      { code: 'en', name: 'English' },
      { code: 'eo', name: 'Esperanto' },
      { code: 'es', name: 'Spanish' },
      { code: 'et', name: 'Estonian' },
      { code: 'eu', name: 'Basque' },
      { code: 'fa', name: 'Persian' },
      { code: 'ff', name: 'Fulah' },
      { code: 'fi', name: 'Finnish' },
      { code: 'fil', name: 'Filipino' },
      { code: 'fo', name: 'Faroese' },
      { code: 'fr', name: 'French' },
      { code: 'fy', name: 'Western Frisian' },
      { code: 'ga', name: 'Irish' },
      { code: 'gd', name: 'Scottish Gaelic' },
      { code: 'gl', name: 'Galician' },
      { code: 'gn', name: 'Guarani' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'gv', name: 'Manx' },
      { code: 'ha', name: 'Hausa' },
      { code: 'he', name: 'Hebrew' },
      { code: 'hi', name: 'Hindi' },
      { code: 'hr', name: 'Croatian' },
      { code: 'ht', name: 'Haitian' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'hy', name: 'Armenian' },
      { code: 'ia', name: 'Interlingua' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ie', name: 'Interlingue' },
      { code: 'ig', name: 'Igbo' },
      { code: 'ii', name: 'Sichuan Yi' },
      { code: 'ik', name: 'Inupiaq' },
      { code: 'io', name: 'Ido' },
      { code: 'is', name: 'Icelandic' },
      { code: 'it', name: 'Italian' },
      { code: 'iu', name: 'Inuktitut' },
      { code: 'ja', name: 'Japanese' },
      { code: 'jv', name: 'Javanese' },
      { code: 'ka', name: 'Georgian' },
      { code: 'ki', name: 'Kikuyu' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'kl', name: 'Kalaallisut' },
      { code: 'km', name: 'Central Khmer' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ko', name: 'Korean' },
      { code: 'ks', name: 'Kashmiri' },
      { code: 'ku', name: 'Kurdish' },
      { code: 'kw', name: 'Cornish' },
      { code: 'ky', name: 'Kyrgyz' },
      { code: 'la', name: 'Latin' },
      { code: 'lb', name: 'Luxembourgish' },
      { code: 'lg', name: 'Ganda' },
      { code: 'ln', name: 'Lingala' },
      { code: 'lo', name: 'Lao' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lu', name: 'Luba-Katanga' },
      { code: 'lv', name: 'Latvian' },
      { code: 'mg', name: 'Malagasy' },
      { code: 'mi', name: 'Maori' },
      { code: 'mk', name: 'Macedonian' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'mr', name: 'Marathi' },
      { code: 'ms', name: 'Malay' },
      { code: 'mt', name: 'Maltese' },
      { code: 'my', name: 'Burmese' },
      { code: 'nb', name: 'Norwegian Bokmål' },
      { code: 'nd', name: 'North Ndebele' },
      { code: 'ne', name: 'Nepali' },
      { code: 'nl', name: 'Dutch' },
      { code: 'nn', name: 'Norwegian Nynorsk' },
      { code: 'no', name: 'Norwegian' },
      { code: 'nr', name: 'South Ndebele' },
      { code: 'nv', name: 'Navajo' },
      { code: 'ny', name: 'Chichewa' },
      { code: 'oc', name: 'Occitan' },
      { code: 'om', name: 'Oromo' },
      { code: 'or', name: 'Oriya' },
      { code: 'os', name: 'Ossetian' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'pl', name: 'Polish' },
      { code: 'ps', name: 'Pashto' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'qu', name: 'Quechua' },
      { code: 'rm', name: 'Romansh' },
      { code: 'rn', name: 'Rundi' },
      { code: 'ro', name: 'Romanian' },
      { code: 'ru', name: 'Russian' },
      { code: 'rw', name: 'Kinyarwanda' },
      { code: 'sa', name: 'Sanskrit' },
      { code: 'sc', name: 'Sardinian' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'se', name: 'Northern Sami' },
      { code: 'sg', name: 'Sango' },
      { code: 'si', name: 'Sinhala' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'sn', name: 'Shona' },
      { code: 'so', name: 'Somali' },
      { code: 'sq', name: 'Albanian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'ss', name: 'Swati' },
      { code: 'st', name: 'Southern Sotho' },
      { code: 'su', name: 'Sundanese' },
      { code: 'sv', name: 'Swedish' },
      { code: 'sw', name: 'Swahili' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'tg', name: 'Tajik' },
      { code: 'th', name: 'Thai' },
      { code: 'ti', name: 'Tigrinya' },
      { code: 'tk', name: 'Turkmen' },
      { code: 'tl', name: 'Tagalog' },
      { code: 'tn', name: 'Tswana' },
      { code: 'to', name: 'Tonga' },
      { code: 'tr', name: 'Turkish' },
      { code: 'ts', name: 'Tsonga' },
      { code: 'tt', name: 'Tatar' },
      { code: 'ug', name: 'Uyghur' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'ur', name: 'Urdu' },
      { code: 'uz', name: 'Uzbek' },
      { code: 've', name: 'Venda' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'vo', name: 'Volapük' },
      { code: 'wa', name: 'Walloon' },
      { code: 'wo', name: 'Wolof' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'yi', name: 'Yiddish' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'za', name: 'Zhuang' },
      { code: 'zh', name: 'Chinese' },
      { code: 'zu', name: 'Zulu' }
    ];
  }

  /**
   * 初始化翻译服务
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isLoading || this.isLoaded) {
      return;
    }

    this.isLoading = true;
    this.loadError = null;

    try {
      // 加载MediaPipe LLM推理API
      const { FilesetResolver, LlmInference } = await import('@mediapipe/tasks-genai');
      
      // 初始化FilesetResolver
      const genai = await FilesetResolver.forGenAiTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'
      );
      
      // 创建LLM推理器
      this.llmInference = await LlmInference.createFromOptions(genai, {
        baseOptions: {
          modelAssetPath: '/models/translategemma-4b-it-int8-web.task'
        },
        maxTokens: 1000,
        topK: 40,
        temperature: 0.8,
        randomSeed: 101,
        maxNumImages: 5, // 启用图片支持
        supportAudio: false // 暂时不启用音频支持
      });
      
      console.log('TranslateGemma模型加载成功');
      this.isLoaded = true;
      this.loadError = null;
    } catch (error) {
      console.error('翻译服务初始化失败:', error);
      this.loadError = error.message;
      this.isLoaded = false;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 获取加载状态
   * @returns {Object} 加载状态对象
   */
  getLoadStatus() {
    return {
      isLoading: this.isLoading,
      isLoaded: this.isLoaded,
      loadError: this.loadError
    };
  }

  /**
   * 检查模型是否已加载
   * @returns {boolean} 是否已加载
   */
  isModelLoaded() {
    return this.isLoaded && this.llmInference !== null;
  }

  /**
   * 翻译文本
   * @param {string} text - 待翻译的文本
   * @param {string} sourceLang - 源语言代码
   * @param {string} targetLang - 目标语言代码
   * @returns {Promise<string>} 翻译后的文本
   */
  async translateText(text, sourceLang, targetLang) {
    try {
      if (!this.llmInference) {
        await this.init();
      }

      // 构建符合chat_template.jinja的翻译提示
      const sourceLangName = this.getLanguageName(sourceLang);
      const targetLangName = this.getLanguageName(targetLang);
      
      const prompt = `<start_of_turn>user
You are a professional ${sourceLangName} (${sourceLang}) to ${targetLangName} (${targetLang}) translator. Your goal is to accurately convey the meaning and nuances of the original ${sourceLangName} text while adhering to ${targetLangName} grammar, vocabulary, and cultural sensitivities.
Produce only the ${targetLangName} translation, without any additional explanations or commentary. Please translate the following ${sourceLangName} text into ${targetLangName}:


${text.trim()}
<end_of_turn>
<start_of_turn>model
`;

      // 调用模型进行翻译
      const response = await this.llmInference.generateResponse(prompt);
      
      console.log('翻译结果:', response);
      return response;
    } catch (error) {
      console.error('翻译失败:', error);
      throw error;
    }
  }

  /**
   * 翻译图片内容
   * @param {Blob} imageBlob - 图片Blob对象
   * @param {string} targetLang - 目标语言代码
   * @returns {Promise<string>} 翻译后的文本
   */
  async translateImage(imageBlob, targetLang) {
    try {
      if (!this.llmInference) {
        await this.init();
      }

      // 验证Blob是否为图片
      if (!imageBlob.type.startsWith('image/')) {
        throw new Error('无效的图片文件');
      }

      // 将Blob转换为Data URL
      const imageUrl = await this.blobToDataURL(imageBlob);

      // 验证Data URL格式
      if (!imageUrl.startsWith('data:image/')) {
        throw new Error('无效的图片URL格式');
      }

      // 构建符合chat_template.jinja的图片翻译提示
      const sourceLang = 'auto'; // 自动检测源语言
      const sourceLangName = '自动检测';
      const targetLangName = this.getLanguageName(targetLang);

      // 构建图片翻译提示
      const prompt = '<start_of_turn>user\nYou are a professional translator. Your goal is to accurately translate text from images while preserving the original meaning and context.\nPlease translate the text in the provided image into ' + targetLangName + ' (' + targetLang + ').\nProduce only the translation, without any additional explanations, alternatives or commentary.\nFocus only on the text, do not output where the text is located, surrounding objects or any other explanation about the picture.\nIgnore symbols, pictogram, and arrows!\n<end_of_turn>\n<start_of_turn>model\n';

      // 调用模型进行图片翻译
      // 参考graph_runner_llm_inference_lib.ts的实现，使用多模态输入
      const response = await this.llmInference.generateResponse([prompt, { imageSource: imageUrl }]);
      
      console.log('图片翻译结果:', response);
      return response;
    } catch (error) {
      console.error('图片翻译失败:', error);
      // 检查是否是模型不支持视觉输入的错误
      if (error.message.includes('Image models could not be created')) {
        throw new Error('当前模型不支持图片翻译功能');
      }
      throw error;
    }
  }

  /**
   * 将Blob转换为Data URL
   * @param {Blob} blob - Blob对象
   * @returns {Promise<string>} Data URL
   */
  blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * 根据语言代码获取语言名称
   * @param {string} langCode - 语言代码
   * @returns {string} 语言名称
   */
  getLanguageName(langCode) {
    const language = this.supportedLanguages.find(lang => lang.code === langCode);
    return language ? language.name : langCode;
  }

  /**
   * 获取支持的语言列表
   * @returns {Array} 支持的语言列表
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }
}

// 导出单例实例
export default new TranslationService();