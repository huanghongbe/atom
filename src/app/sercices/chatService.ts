// services/chatService.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
    retries: 3, // 重试次数
    retryDelay: (retryCount) => {
        return retryCount * 1000; // 每次重试间隔 1 秒
    },
    retryCondition: (error) => {
        // 仅在超时或网络错误时重试
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    },
    onRetry: (retryCount, error, requestConfig) => {
        // 在每次重试时打印日志
        console.log(`Retry attempt #${retryCount}:`, error.message);
        console.log('Retrying request to:', requestConfig.url);
    },
});

export const sendMessage = async (message: string) => {
    try {
        const response = await axios.post('/api/chat', { message });
        return response.data.reply;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};