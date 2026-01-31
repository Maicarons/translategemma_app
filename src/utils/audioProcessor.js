/**
 * 音频处理工具
 * 负责将音频数据转换为模型需要的格式
 */

class AudioProcessor {
  /**
   * 将音频Blob转换为PCM数据
   * @param {Blob} audioBlob - 音频Blob对象
   * @returns {Promise<Float32Array>} PCM数据
   */
  static async blobToPCM(audioBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // 获取PCM数据
          const channelData = audioBuffer.getChannelData(0);
          resolve(channelData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(audioBlob);
    });
  }

  /**
   * 重采样音频数据
   * @param {Float32Array} pcmData - 原始PCM数据
   * @param {number} originalSampleRate - 原始采样率
   * @param {number} targetSampleRate - 目标采样率
   * @returns {Float32Array} 重采样后的PCM数据
   */
  static resamplePCM(pcmData, originalSampleRate, targetSampleRate) {
    if (originalSampleRate === targetSampleRate) {
      return pcmData;
    }

    const ratio = originalSampleRate / targetSampleRate;
    const length = Math.floor(pcmData.length / ratio);
    const result = new Float32Array(length);
    
    for (let i = 0; i < length; i++) {
      const index = Math.floor(i * ratio);
      result[i] = pcmData[index];
    }
    
    return result;
  }

  /**
   * 计算梅尔频谱图
   * @param {Float32Array} pcmData - PCM数据
   * @param {number} sampleRate - 采样率
   * @returns {Float32Array} 梅尔频谱图数据
   */
  static computeMelSpectrogram(pcmData, sampleRate = 16000) {
    // 这里需要实现梅尔频谱图的计算
    // Whisper模型需要的输入格式是(1, 80, 3000)的梅尔频谱图
    
    // 模拟梅尔频谱图数据
    const melSpectrogram = new Float32Array(80 * 3000);
    for (let i = 0; i < melSpectrogram.length; i++) {
      melSpectrogram[i] = Math.random() * 0.1;
    }
    
    return melSpectrogram;
  }

  /**
   * 准备Whisper模型的输入
   * @param {Blob} audioBlob - 音频Blob对象
   * @returns {Promise<Float32Array>} 模型输入数据
   */
  static async prepareWhisperInput(audioBlob) {
    try {
      // 1. 将Blob转换为PCM数据
      const pcmData = await this.blobToPCM(audioBlob);
      
      // 2. 重采样到16kHz
      const resampledPCM = this.resamplePCM(pcmData, 44100, 16000);
      
      // 3. 计算梅尔频谱图
      const melSpectrogram = this.computeMelSpectrogram(resampledPCM, 16000);
      
      return melSpectrogram;
    } catch (error) {
      console.error('准备Whisper输入失败:', error);
      throw error;
    }
  }
}

export default AudioProcessor;