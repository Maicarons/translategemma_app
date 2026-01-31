/**
 * 文本到语音服务
 * 负责将文本转换为语音输出
 */

import { TextToSpeech } from '@capacitor-community/text-to-speech';

class TextToSpeechService {
  constructor() {
    this.isSpeaking = false;
    this.availableLanguages = [];
  }

  /**
   * 初始化语音合成服务
   * @returns {Promise<void>}
   */
  async init() {
    try {
      // 获取可用的语言列表
      const { languages } = await TextToSpeech.getSupportedLanguages();
      this.availableLanguages = languages;
      console.log('可用的语音合成语言:', languages);
    } catch (error) {
      console.error('语音合成服务初始化失败:', error);
      // 即使失败也继续，因为在Web端可能不支持
    }
  }

  /**
   * 将文本转换为语音
   * @param {string} text - 要转换的文本
   * @param {string} language - 语言代码
   * @param {number} rate - 语速 (0.5-2.0)
   * @param {number} pitch - 音调 (0.5-2.0)
   * @param {number} volume - 音量 (0.0-1.0)
   * @returns {Promise<void>}
   */
  async speak(text, language = 'zh-CN', rate = 1.0, pitch = 1.0, volume = 1.0) {
    try {
      if (this.isSpeaking) {
        await this.stop();
      }

      this.isSpeaking = true;
      console.log('开始语音合成');

      await TextToSpeech.speak({
        text,
        language,
        rate,
        pitch,
        volume,
        category: 'ambient'
      });

      // 监听语音合成完成
      TextToSpeech.addListener('speechStart', () => {
        console.log('语音合成开始');
      });

      TextToSpeech.addListener('speechEnd', () => {
        console.log('语音合成结束');
        this.isSpeaking = false;
      });

      TextToSpeech.addListener('speechError', (error) => {
        console.error('语音合成错误:', error);
        this.isSpeaking = false;
      });
    } catch (error) {
      console.error('语音合成失败:', error);
      this.isSpeaking = false;
      // 在Web端可能不支持，提供降级方案
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        await this.webSpeak(text, language, rate, pitch, volume);
      }
    }
  }

  /**
   * Web端的语音合成降级方案
   * @param {string} text - 要转换的文本
   * @param {string} language - 语言代码
   * @param {number} rate - 语速
   * @param {number} pitch - 音调
   * @param {number} volume - 音量
   * @returns {Promise<void>}
   */
  async webSpeak(text, language = 'zh-CN', rate = 1.0, pitch = 1.0, volume = 1.0) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          this.isSpeaking = false;
          resolve();
        };

        utterance.onerror = (error) => {
          this.isSpeaking = false;
          reject(error);
        };

        window.speechSynthesis.speak(utterance);
        this.isSpeaking = true;
      });
    } catch (error) {
      console.error('Web端语音合成失败:', error);
      this.isSpeaking = false;
      throw error;
    }
  }

  /**
   * 停止语音合成
   * @returns {Promise<void>}
   */
  async stop() {
    try {
      await TextToSpeech.stop();
      this.isSpeaking = false;
      console.log('停止语音合成');
    } catch (error) {
      console.error('停止语音合成失败:', error);
      // 在Web端使用降级方案
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
      }
    }
  }

  /**
   * 暂停语音合成
   * @returns {Promise<void>}
   */
  async pause() {
    try {
      await TextToSpeech.pause();
      console.log('暂停语音合成');
    } catch (error) {
      console.error('暂停语音合成失败:', error);
    }
  }

  /**
   * 恢复语音合成
   * @returns {Promise<void>}
   */
  async resume() {
    try {
      await TextToSpeech.resume();
      console.log('恢复语音合成');
    } catch (error) {
      console.error('恢复语音合成失败:', error);
    }
  }

  /**
   * 检查是否正在语音合成
   * @returns {boolean} 是否正在语音合成
   */
  getIsSpeaking() {
    return this.isSpeaking;
  }

  /**
   * 获取可用的语言列表
   * @returns {Array} 可用的语言列表
   */
  getAvailableLanguages() {
    return this.availableLanguages;
  }
}

// 导出单例实例
export default new TextToSpeechService();