// ==UserScript==
// @name         AI助手响应时间和Token监控
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监控 Gemini/ChatGPT 从发送问题到首字输出的时间，以及输出内容的总token数
// @author       You
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 检测当前网站
    const isGemini = window.location.hostname.includes('gemini.google.com');
    const isChatGPT = window.location.hostname.includes('chatgpt.com') || window.location.hostname.includes('chat.openai.com');
    
    // 12种颜色主题
    const colorThemes = {
        blue: { name: '蓝色', primary: '#a0c0ff', secondary: '#6496ff', bg1: 'rgba(30, 30, 40, 0.95)', bg2: 'rgba(40, 40, 50, 0.95)' },
        purple: { name: '紫色', primary: '#c084fc', secondary: '#a855f7', bg1: 'rgba(40, 20, 50, 0.95)', bg2: 'rgba(50, 30, 60, 0.95)' },
        pink: { name: '粉色', primary: '#f9a8d4', secondary: '#ec4899', bg1: 'rgba(50, 20, 40, 0.95)', bg2: 'rgba(60, 30, 50, 0.95)' },
        green: { name: '绿色', primary: '#86efac', secondary: '#22c55e', bg1: 'rgba(20, 40, 30, 0.95)', bg2: 'rgba(30, 50, 40, 0.95)' },
        cyan: { name: '青色', primary: '#67e8f9', secondary: '#06b6d4', bg1: 'rgba(20, 40, 45, 0.95)', bg2: 'rgba(30, 50, 55, 0.95)' },
        orange: { name: '橙色', primary: '#fdba74', secondary: '#f97316', bg1: 'rgba(45, 30, 20, 0.95)', bg2: 'rgba(55, 40, 30, 0.95)' },
        red: { name: '红色', primary: '#fca5a5', secondary: '#ef4444', bg1: 'rgba(45, 20, 20, 0.95)', bg2: 'rgba(55, 30, 30, 0.95)' },
        yellow: { name: '黄色', primary: '#fde047', secondary: '#eab308', bg1: 'rgba(45, 40, 20, 0.95)', bg2: 'rgba(55, 50, 30, 0.95)' },
        indigo: { name: '靛蓝', primary: '#a5b4fc', secondary: '#6366f1', bg1: 'rgba(25, 25, 45, 0.95)', bg2: 'rgba(35, 35, 55, 0.95)' },
        teal: { name: '青绿', primary: '#5eead4', secondary: '#14b8a6', bg1: 'rgba(20, 40, 40, 0.95)', bg2: 'rgba(30, 50, 50, 0.95)' },
        lime: { name: '柠檬绿', primary: '#bef264', secondary: '#84cc16', bg1: 'rgba(30, 40, 20, 0.95)', bg2: 'rgba(40, 50, 30, 0.95)' },
        slate: { name: '灰色', primary: '#cbd5e1', secondary: '#64748b', bg1: 'rgba(30, 35, 40, 0.95)', bg2: 'rgba(40, 45, 50, 0.95)' }
    };
    
    // 从localStorage加载主题,默认蓝色
    const THEME_KEY = 'ai_monitor_theme';
    let currentTheme = localStorage.getItem(THEME_KEY) || 'blue';
    let theme = colorThemes[currentTheme];
    
    // 根据网站设置配置
    const config = isGemini ? {
        name: 'Gemini',
        icon: '✨',
        primaryColor: theme.primary,
        secondaryColor: theme.secondary,
        warningColor: '#ffd700',
        dangerColor: '#ff9090',
        accentColor: theme.secondary,
        wasteText: '哈基米',
        sendButtonSelector: 'button[aria-label*="Send"], button[aria-label*="发送"]',
        messageSelector: '[data-message-author-role="model"]',
        stopButtonSelector: 'button[aria-label*="Stop"], button[aria-label*="停止"]'
    } : {
        name: 'ChatGPT',
        icon: '💬',
        primaryColor: theme.primary,
        secondaryColor: theme.secondary,
        warningColor: '#ffd700',
        dangerColor: '#ff9090',
        accentColor: theme.secondary,
        wasteText: 'GPT',
        sendButtonSelector: 'button[data-testid="send-button"]',
        messageSelector: '[data-message-author-role="assistant"]',
        stopButtonSelector: 'button[data-testid="stop-button"]'
    };

    // 创建悬浮显示面板 - 二次元风格(深色主题)
    const panel = document.createElement('div');
    panel.id = 'ai-monitor-panel';
    panel.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, ${theme.bg1} 0%, ${theme.bg2} 100%);
        color: #e0e0e0;
        padding: 12px 16px;
        border-radius: 16px;
        font-family: 'Microsoft YaHei', 'Arial', sans-serif;
        font-size: 12px;
        z-index: 999999;
        min-width: 220px;
        max-width: 280px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px ${theme.primary}4D;
        border: 1px solid ${theme.primary}33;
        backdrop-filter: blur(10px);
    `;
    
    // 添加二次元人物背景和样式
    const style = document.createElement('style');
    style.id = 'ai-monitor-custom-style';
    style.textContent = `
        @keyframes subtle-glow {
            0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(100, 150, 255, 0.3); }
            50% { box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(100, 150, 255, 0.5); }
        }
        #ai-monitor-panel {
            animation: subtle-glow 3s ease-in-out infinite;
        }
        #ai-monitor-panel::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 80px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="35" r="20" fill="%23a0c0ff" opacity="0.3"/><circle cx="45" cy="33" r="3" fill="%23ffffff"/><circle cx="55" cy="33" r="3" fill="%23ffffff"/><path d="M 40 40 Q 50 45 60 40" stroke="%23ffffff" stroke-width="2" fill="none" opacity="0.5"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.15;
            pointer-events: none;
            z-index: 0;
        }
        #ai-monitor-panel > * {
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    
    // 创建标题容器 - 深色主题
    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = `display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(100, 150, 255, 0.2); padding-bottom: 8px;`;
    
    const title = document.createElement('div');
    title.style.cssText = `
        font-weight: bold;
        font-size: 13px;
        color: #a0c0ff;
        text-shadow: 0 0 8px rgba(160, 192, 255, 0.5);
        letter-spacing: 0.5px;
    `;
    title.textContent = `${config.icon} ${config.name} 监控`;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 5px; position: relative;';
    
    // 主题选择按钮
    const themeButton = document.createElement('button');
    themeButton.textContent = '🎨';
    themeButton.title = '更换主题颜色';
    themeButton.style.cssText = `
        background: ${theme.primary}33;
        border: 1px solid ${theme.primary}66;
        color: ${theme.primary};
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        transition: all 0.2s ease;
    `;
    themeButton.onmouseover = () => {
        themeButton.style.background = `${theme.primary}4D`;
        themeButton.style.borderColor = `${theme.primary}99`;
    };
    themeButton.onmouseout = () => {
        themeButton.style.background = `${theme.primary}33`;
        themeButton.style.borderColor = `${theme.primary}66`;
    };
    
    // 创建主题选择器面板
    const themePicker = document.createElement('div');
    themePicker.style.cssText = `
        display: none;
        position: fixed;
        top: auto;
        right: auto;
        margin-top: 5px;
        background: ${theme.bg1};
        border: 1px solid ${theme.primary}33;
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.7);
        z-index: 99999999;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
    `;
    
    // 添加12种颜色选项
    Object.keys(colorThemes).forEach(themeKey => {
        const colorBtn = document.createElement('div');
        colorBtn.style.cssText = `
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid ${themeKey === currentTheme ? '#fff' : 'transparent'};
            background: ${colorThemes[themeKey].primary};
            transition: all 0.2s;
            box-shadow: ${themeKey === currentTheme ? `0 0 8px ${colorThemes[themeKey].primary}` : 'none'};
            pointer-events: auto;
            position: relative;
            z-index: 10000001;
        `;
        colorBtn.title = colorThemes[themeKey].name;
        colorBtn.onmouseover = () => {
            colorBtn.style.transform = 'scale(1.2)';
            if (themeKey !== currentTheme) colorBtn.style.borderColor = '#fff';
        };
        colorBtn.onmouseout = () => {
            colorBtn.style.transform = 'scale(1)';
            if (themeKey !== currentTheme) colorBtn.style.borderColor = 'transparent';
        };
        colorBtn.onclick = (e) => {
            e.stopPropagation();
            // 更新主题
            currentTheme = themeKey;
            theme = colorThemes[themeKey];
            localStorage.setItem(THEME_KEY, themeKey);
            
            // 实时应用新主题,不刷新页面
            applyTheme(theme);
            
            // 更新所有颜色按钮的选中状态
            themePicker.querySelectorAll('div').forEach((btn, idx) => {
                const btnThemeKey = Object.keys(colorThemes)[idx];
                if (btnThemeKey === themeKey) {
                    btn.style.border = '2px solid #fff';
                    btn.style.boxShadow = `0 0 8px ${colorThemes[btnThemeKey].primary}`;
                } else {
                    btn.style.border = '2px solid transparent';
                    btn.style.boxShadow = 'none';
                }
            });
            
            // 关闭选择器
            themePicker.style.display = 'none';
        };
        themePicker.appendChild(colorBtn);
    });
    
    themeButton.onclick = (e) => {
        e.stopPropagation();
        const isVisible = themePicker.style.display === 'grid';
        
        if (!isVisible) {
            // 计算按钮位置
            const rect = themeButton.getBoundingClientRect();
            themePicker.style.top = (rect.bottom + 5) + 'px';
            themePicker.style.left = (rect.right - 120) + 'px'; // 120px是选择器宽度的大约值
            themePicker.style.display = 'grid';
        } else {
            themePicker.style.display = 'none';
        }
    };
    
    // 点击外部关闭
    document.addEventListener('click', (e) => {
        if (!themePicker.contains(e.target) && !themeButton.contains(e.target)) {
            themePicker.style.display = 'none';
        }
    });
    
    // 应用主题的函数
    function applyTheme(newTheme) {
        // 更新面板背景
        panel.style.background = `linear-gradient(135deg, ${newTheme.bg1} 0%, ${newTheme.bg2} 100%)`;
        panel.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px ${newTheme.primary}4D`;
        panel.style.border = `1px solid ${newTheme.primary}33`;
        
        // 更新标题颜色
        title.style.color = newTheme.primary;
        title.style.textShadow = `0 0 8px ${newTheme.primary}80`;
        
        // 更新标题容器边框
        titleContainer.style.borderBottom = `1px solid ${newTheme.primary}33`;
        
        // 更新主题按钮
        themeButton.style.background = `${newTheme.primary}33`;
        themeButton.style.borderColor = `${newTheme.primary}66`;
        themeButton.style.color = newTheme.primary;
        
        // 更新主题选择器背景
        themePicker.style.background = newTheme.bg1;
        themePicker.style.borderColor = `${newTheme.primary}33`;
        
        // 更新其他按钮
        toggleButton.style.background = `${newTheme.primary}33`;
        toggleButton.style.borderColor = `${newTheme.primary}66`;
        toggleButton.style.color = newTheme.primary;
        
        summaryButton.style.background = `${newTheme.primary}33`;
        summaryButton.style.borderColor = `${newTheme.primary}66`;
        summaryButton.style.color = newTheme.primary;
        
        // 更新所有数据卡片
        const dataCards = [statusDiv, timeDiv, tokensDiv, totalTokensDiv, charsDiv, totalCharsDiv];
        dataCards.forEach(card => {
            card.style.background = `${newTheme.primary}1A`;
            card.style.borderLeft = `2px solid ${newTheme.primary}80`;
        });
        
        // 更新状态文本颜色
        statusSpan.style.color = newTheme.primary;
        
        // 更新浪费时间区域
        wasteTimeDiv.style.borderTop = `1px solid ${newTheme.primary}33`;
        wasteTimeDiv.style.background = `${newTheme.primary}0D`;
        
        // 更新动画样式 - 只更新脚本自己的style标签
        const styleEl = document.getElementById('ai-monitor-custom-style');
        if (styleEl) {
            styleEl.textContent = `
                @keyframes subtle-glow {
                    0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px ${newTheme.primary}4D; }
                    50% { box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6), 0 0 0 1px ${newTheme.primary}80; }
                }
                #ai-monitor-panel {
                    animation: subtle-glow 3s ease-in-out infinite;
                }
                #ai-monitor-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 80px;
                    height: 80px;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="35" r="20" fill="${encodeURIComponent(newTheme.primary)}" opacity="0.3"/><circle cx="45" cy="33" r="3" fill="%23ffffff"/><circle cx="55" cy="33" r="3" fill="%23ffffff"/><path d="M 40 40 Q 50 45 60 40" stroke="%23ffffff" stroke-width="2" fill="none" opacity="0.5"/></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 0;
                }
                #ai-monitor-panel > * {
                    position: relative;
                    z-index: 1;
                }
            `;
        }
    }
    
    buttonContainer.appendChild(themeButton);
    // 将主题选择器添加到 body 而不是 buttonContainer,因为使用了 fixed 定位
    document.body.appendChild(themePicker);
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '−';
    toggleButton.title = '折叠/展开';
    toggleButton.style.cssText = `
        background: rgba(100, 150, 255, 0.2);
        border: 1px solid rgba(100, 150, 255, 0.4);
        color: #a0c0ff;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        line-height: 1;
        transition: all 0.2s ease;
    `;
    toggleButton.onmouseover = () => {
        toggleButton.style.background = 'rgba(100, 150, 255, 0.3)';
        toggleButton.style.borderColor = 'rgba(100, 150, 255, 0.6)';
    };
    toggleButton.onmouseout = () => {
        toggleButton.style.background = 'rgba(100, 150, 255, 0.2)';
        toggleButton.style.borderColor = 'rgba(100, 150, 255, 0.4)';
    };
    
    const summaryButton = document.createElement('button');
    summaryButton.textContent = '📊';
    summaryButton.title = '查看统计总结';
    summaryButton.style.cssText = `
        background: rgba(100, 150, 255, 0.2);
        border: 1px solid rgba(100, 150, 255, 0.4);
        color: #a0c0ff;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        transition: all 0.2s ease;
    `;
    summaryButton.onmouseover = () => {
        summaryButton.style.background = 'rgba(100, 150, 255, 0.3)';
        summaryButton.style.borderColor = 'rgba(100, 150, 255, 0.6)';
    };
    summaryButton.onmouseout = () => {
        summaryButton.style.background = 'rgba(100, 150, 255, 0.2)';
        summaryButton.style.borderColor = 'rgba(100, 150, 255, 0.4)';
    };
    
    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄';
    resetButton.title = '重置统计';
    resetButton.style.cssText = `
        background: rgba(255, 100, 100, 0.2);
        border: 1px solid rgba(255, 100, 100, 0.4);
        color: #ffb0b0;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        transition: all 0.2s ease;
    `;
    resetButton.onmouseover = () => {
        resetButton.style.background = 'rgba(255, 100, 100, 0.3)';
        resetButton.style.borderColor = 'rgba(255, 100, 100, 0.6)';
    };
    resetButton.onmouseout = () => {
        resetButton.style.background = 'rgba(255, 100, 100, 0.2)';
        resetButton.style.borderColor = 'rgba(255, 100, 100, 0.4)';
    };
    resetButton.onclick = () => {
        if (confirm('确定要清除所有历史统计数据吗?')) {
            totalTokens = 0;
            totalChars = 0;
            totalTime = 0;
            responseCount = 0;
            saveStats(); // 保存到 localStorage
            const totalTokensEl = document.querySelector('#monitor-total-tokens span:last-child');
            const totalCharsEl = document.querySelector('#monitor-total-chars span:last-child');
            const wasteTimeEl = document.querySelector('#monitor-waste-time span:last-child');
            if (totalTokensEl) totalTokensEl.textContent = '0';
            if (totalCharsEl) totalCharsEl.textContent = '0';
            if (wasteTimeEl) wasteTimeEl.textContent = '0 ms';
        }
    };
    
    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(summaryButton);
    buttonContainer.appendChild(resetButton);
    titleContainer.appendChild(title);
    titleContainer.appendChild(buttonContainer);
    
    const contentContainer = document.createElement('div');
    contentContainer.id = 'monitor-content';
    contentContainer.style.cssText = 'display: block;';
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'monitor-status';
    statusDiv.style.cssText = 'margin-bottom: 6px; padding: 6px 8px; background: rgba(100, 150, 255, 0.1); border-radius: 6px; border-left: 2px solid rgba(100, 150, 255, 0.5);';
    const statusLabel = document.createElement('span');
    statusLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    statusLabel.textContent = '⚡ ';
    statusDiv.appendChild(statusLabel);
    const statusSpan = document.createElement('span');
    statusSpan.style.cssText = 'color: #a0c0ff; font-size: 11px;';
    statusSpan.textContent = '等待中...';
    statusDiv.appendChild(statusSpan);
    
    const timeDiv = document.createElement('div');
    timeDiv.id = 'monitor-time';
    timeDiv.style.cssText = 'margin-bottom: 6px; padding: 6px 8px; background: rgba(100, 150, 255, 0.1); border-radius: 6px; border-left: 2px solid rgba(100, 150, 255, 0.5);';
    const timeLabel = document.createElement('span');
    timeLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    timeLabel.textContent = '⏱ ';
    timeDiv.appendChild(timeLabel);
    const timeSpan = document.createElement('span');
    timeSpan.style.cssText = 'color: #e0e0e0; font-size: 11px;';
    timeSpan.textContent = '-- ms';
    timeDiv.appendChild(timeSpan);
    
    const tokensDiv = document.createElement('div');
    tokensDiv.id = 'monitor-tokens';
    tokensDiv.style.cssText = 'margin-bottom: 6px; padding: 6px 8px; background: rgba(100, 150, 255, 0.1); border-radius: 6px; border-left: 2px solid rgba(100, 150, 255, 0.5);';
    const tokensLabel = document.createElement('span');
    tokensLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    tokensLabel.textContent = '🎯 ';
    tokensDiv.appendChild(tokensLabel);
    const tokensSpan = document.createElement('span');
    tokensSpan.style.cssText = 'color: #e0e0e0; font-size: 11px;';
    tokensSpan.textContent = '--';
    tokensDiv.appendChild(tokensSpan);
    
    const totalTokensDiv = document.createElement('div');
    totalTokensDiv.id = 'monitor-total-tokens';
    totalTokensDiv.style.cssText = 'margin-bottom: 6px; padding: 6px 8px; background: rgba(100, 150, 255, 0.1); border-radius: 6px; border-left: 2px solid rgba(100, 150, 255, 0.5);';
    const totalTokensLabel = document.createElement('span');
    totalTokensLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    totalTokensLabel.textContent = '💎 ';
    totalTokensDiv.appendChild(totalTokensLabel);
    const totalTokensSpan = document.createElement('span');
    totalTokensSpan.style.cssText = 'color: #ffd700; font-size: 11px; font-weight: bold;';
    totalTokensSpan.textContent = '0';
    totalTokensDiv.appendChild(totalTokensSpan);
    
    const charsDiv = document.createElement('div');
    charsDiv.id = 'monitor-chars';
    charsDiv.style.cssText = 'margin-bottom: 6px; padding: 6px 8px; background: rgba(100, 150, 255, 0.1); border-radius: 6px; border-left: 2px solid rgba(100, 150, 255, 0.5);';
    const charsLabel = document.createElement('span');
    charsLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    charsLabel.textContent = '📝 ';
    charsDiv.appendChild(charsLabel);
    const charsSpan = document.createElement('span');
    charsSpan.style.cssText = 'color: #e0e0e0; font-size: 11px;';
    charsSpan.textContent = '--';
    charsDiv.appendChild(charsSpan);
    
    const totalCharsDiv = document.createElement('div');
    totalCharsDiv.id = 'monitor-total-chars';
    totalCharsDiv.style.cssText = 'margin-bottom: 6px; padding: 6px 8px; background: rgba(100, 150, 255, 0.1); border-radius: 6px; border-left: 2px solid rgba(100, 150, 255, 0.5);';
    const totalCharsLabel = document.createElement('span');
    totalCharsLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    totalCharsLabel.textContent = '✍ ';
    totalCharsDiv.appendChild(totalCharsLabel);
    const totalCharsSpan = document.createElement('span');
    totalCharsSpan.style.cssText = 'color: #ffd700; font-size: 11px; font-weight: bold;';
    totalCharsSpan.textContent = '0';
    totalCharsDiv.appendChild(totalCharsSpan);
    
    const wasteTimeDiv = document.createElement('div');
    wasteTimeDiv.id = 'monitor-waste-time';
    wasteTimeDiv.style.cssText = 'margin-top: 8px; padding: 8px; border-top: 1px solid rgba(100, 150, 255, 0.2); font-size: 11px; background: rgba(100, 150, 255, 0.05); border-radius: 6px; text-align: center;';
    const wasteTimeLabel = document.createElement('span');
    wasteTimeLabel.style.cssText = 'color: #b0b0b0; font-size: 11px;';
    wasteTimeLabel.textContent = `⏰ ${config.wasteText}浪费: `;
    wasteTimeDiv.appendChild(wasteTimeLabel);
    const wasteTimeSpan = document.createElement('span');
    wasteTimeSpan.style.cssText = 'color: #ff9090; font-weight: bold; font-size: 11px;';
    wasteTimeSpan.textContent = '0 ms';
    wasteTimeDiv.appendChild(wasteTimeSpan);
    
    contentContainer.appendChild(statusDiv);
    contentContainer.appendChild(timeDiv);
    contentContainer.appendChild(tokensDiv);
    contentContainer.appendChild(totalTokensDiv);
    contentContainer.appendChild(charsDiv);
    contentContainer.appendChild(totalCharsDiv);
    contentContainer.appendChild(wasteTimeDiv);
    
    panel.appendChild(titleContainer);
    panel.appendChild(contentContainer);
    
    // 折叠/展开功能
    let isCollapsed = false;
    toggleButton.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            contentContainer.style.display = 'none';
            toggleButton.textContent = '+';
            panel.style.minWidth = '200px';
        } else {
            contentContainer.style.display = 'block';
            toggleButton.textContent = '−';
            panel.style.minWidth = '220px';
        }
    };
    
    document.body.appendChild(panel);

    let startTime = null;
    let isMonitoring = false;
    let currentResponse = '';
    let firstTokenReceived = false;
    let completionTimeout = null;
    let isCompleting = false;
    
    // localStorage 键名
    const STORAGE_KEY = 'ai_monitor_stats_' + config.name;
    
    // 从 localStorage 加载数据
    function loadStats() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                return {
                    totalTokens: data.totalTokens || 0,
                    totalChars: data.totalChars || 0,
                    totalTime: data.totalTime || 0,
                    responseCount: data.responseCount || 0
                };
            }
        } catch (e) {
            console.error('加载统计数据失败:', e);
        }
        return {
            totalTokens: 0,
            totalChars: 0,
            totalTime: 0,
            responseCount: 0
        };
    }
    
    // 保存数据到 localStorage
    function saveStats() {
        try {
            const data = {
                totalTokens,
                totalChars,
                totalTime,
                responseCount,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('保存统计数据失败:', e);
        }
    }
    
    // 初始化统计数据
    let stats = loadStats();
    let totalTokens = stats.totalTokens;
    let totalChars = stats.totalChars;
    let totalTime = stats.totalTime;
    let responseCount = stats.responseCount;
    
    // 初始化时更新显示
    function initializeDisplay() {
        const totalTokensEl = document.querySelector('#monitor-total-tokens span:last-child');
        const totalCharsEl = document.querySelector('#monitor-total-chars span:last-child');
        const wasteTimeEl = document.querySelector('#monitor-waste-time span:last-child');
        
        if (totalTokensEl) totalTokensEl.textContent = totalTokens;
        if (totalCharsEl) totalCharsEl.textContent = totalChars;
        if (wasteTimeEl) {
            if (totalTime < 1000) {
                wasteTimeEl.textContent = `${totalTime} ms`;
            } else if (totalTime < 60000) {
                wasteTimeEl.textContent = `${(totalTime / 1000).toFixed(2)} 秒`;
            } else {
                const minutes = Math.floor(totalTime / 60000);
                const seconds = ((totalTime % 60000) / 1000).toFixed(0);
                wasteTimeEl.textContent = `${minutes} 分 ${seconds} 秒`;
            }
        }
    }

    // 更新状态显示
    function updateStatus(status, color = config.warningColor) {
        const statusEl = document.querySelector('#monitor-status span:last-child');
        if (statusEl) {
            statusEl.textContent = status;
            statusEl.style.color = color;
        }
    }

    // 更新响应时间
    function updateTime(time) {
        const timeEl = document.querySelector('#monitor-time span:last-child');
        if (timeEl) {
            timeEl.textContent = `${time} ms`;
            timeEl.style.color = time < 1000 ? '#90ff90' : time < 3000 ? config.warningColor : config.dangerColor;
        }
    }

    // 估算token数量
    function estimateTokens(text) {
        const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const otherChars = text.length - chineseChars;
        return Math.ceil(chineseChars / 1.5 + otherChars / 4);
    }

    // 更新token和字符数
    function updateTokens(text) {
        const tokens = estimateTokens(text);
        const chars = text.length;
        
        const tokensEl = document.querySelector('#monitor-tokens span:last-child');
        const charsEl = document.querySelector('#monitor-chars span:last-child');
        
        if (tokensEl) tokensEl.textContent = tokens;
        if (charsEl) charsEl.textContent = chars;
    }
    
    // 更新总token、总字符数和总耗时
    function updateTotals(tokens, chars, time) {
        totalTokens += tokens;
        totalChars += chars;
        totalTime += time;
        responseCount++;
        
        // 保存到 localStorage
        saveStats();
        
        const totalTokensEl = document.querySelector('#monitor-total-tokens span:last-child');
        const totalCharsEl = document.querySelector('#monitor-total-chars span:last-child');
        const wasteTimeEl = document.querySelector('#monitor-waste-time span:last-child');
        
        if (totalTokensEl) totalTokensEl.textContent = totalTokens;
        if (totalCharsEl) totalCharsEl.textContent = totalChars;
        if (wasteTimeEl) {
            if (totalTime < 1000) {
                wasteTimeEl.textContent = `${totalTime} ms`;
            } else if (totalTime < 60000) {
                wasteTimeEl.textContent = `${(totalTime / 1000).toFixed(2)} 秒`;
            } else {
                const minutes = Math.floor(totalTime / 60000);
                const seconds = ((totalTime % 60000) / 1000).toFixed(0);
                wasteTimeEl.textContent = `${minutes} 分 ${seconds} 秒`;
            }
        }
    }
    
    // 显示统计总结
    function showSummary() {
        if (responseCount === 0) {
            alert('暂无统计数据');
            return;
        }
        
        const avgTime = Math.round(totalTime / responseCount);
        const avgTokens = Math.round(totalTokens / responseCount);
        const avgChars = Math.round(totalChars / responseCount);
        const tokenPerSecond = (totalTokens / (totalTime / 1000)).toFixed(2);
        const charPerSecond = (totalChars / (totalTime / 1000)).toFixed(2);
        const totalTimeFormatted = totalTime < 60000 ? (totalTime / 1000).toFixed(2) + ' 秒' : Math.floor(totalTime / 60000) + ' 分 ' + ((totalTime % 60000) / 1000).toFixed(0) + ' 秒';
        
        // 创建HTML内容
        const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.icon} ${config.name} 统计总结</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px ${config.primaryColor}, 0 0 10px ${config.primaryColor}; }
            50% { box-shadow: 0 0 20px ${config.primaryColor}, 0 0 30px ${config.primaryColor}; }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        body {
            font-family: 'Microsoft YaHei', 'Arial', sans-serif;
            background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #1a1a2e);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:
                radial-gradient(circle at 20% 50%, rgba(100, 150, 255, 0.15), transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(80, 120, 200, 0.15), transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(120, 160, 255, 0.15), transparent 50%);
            pointer-events: none;
            animation: pulse 8s ease-in-out infinite;
        }
        
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #6496ff, #4080ff);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            box-shadow: 0 0 8px rgba(100, 150, 255, 0.6);
        }
        
        .container {
            background: rgba(30, 30, 40, 0.95);
            backdrop-filter: blur(20px) saturate(180%);
            border: 2px solid rgba(100, 150, 255, 0.3);
            border-radius: 20px;
            box-shadow:
                0 8px 32px 0 rgba(0, 0, 0, 0.6),
                inset 0 0 60px rgba(100, 150, 255, 0.05),
                0 0 0 1px rgba(100, 150, 255, 0.2);
            max-width: 1000px;
            width: 100%;
            overflow: hidden;
            position: relative;
            z-index: 10;
            animation: slideInUp 0.8s ease-out;
        }
        
        .header {
            background: linear-gradient(135deg,
                rgba(40, 50, 70, 0.9) 0%,
                rgba(50, 60, 80, 0.9) 100%);
            backdrop-filter: blur(10px);
            color: #a0c0ff;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid rgba(100, 150, 255, 0.3);
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
            );
            animation: shimmer 3s infinite;
        }
        
        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            font-weight: 700;
            text-shadow: 3px 3px 6px rgba(255, 105, 180, 0.5), 0 0 20px rgba(255, 182, 193, 0.8);
            position: relative;
            z-index: 1;
            color: #fff;
            letter-spacing: 2px;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 1;
            position: relative;
            z-index: 1;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(255, 105, 180, 0.3);
            font-weight: 600;
        }
        
        .content {
            padding: 50px;
        }
        
        .section {
            margin-bottom: 50px;
            animation: slideInUp 0.8s ease-out backwards;
        }
        
        .section:nth-child(1) { animation-delay: 0.1s; }
        .section:nth-child(2) { animation-delay: 0.2s; }
        .section:nth-child(3) { animation-delay: 0.3s; }
        
        .section-title {
            font-size: 1.8em;
            color: #ff69b4;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px dotted rgba(255, 105, 180, 0.5);
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            text-shadow: 2px 2px 4px rgba(255, 105, 180, 0.3);
            font-weight: bold;
        }
        
        .section-title::after {
            content: '✨';
            position: absolute;
            right: 0;
            font-size: 24px;
            animation: sparkle 2s infinite;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin-top: 25px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(255, 192, 203, 0.3));
            backdrop-filter: blur(10px);
            padding: 25px;
            border-radius: 20px;
            border: 3px solid #fff;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
        }
        
        .stat-card::before {
            content: '✨';
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            opacity: 0;
            transition: opacity 0.4s;
        }
        
        .stat-card:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow:
                0 20px 40px rgba(255, 105, 180, 0.4),
                0 0 30px rgba(255, 105, 180, 0.6);
            border-color: #ff69b4;
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.5), rgba(255, 192, 203, 0.5));
        }
        
        .stat-card:hover::before {
            opacity: 1;
            animation: sparkle 1s ease-in-out infinite;
        }
        
        .stat-card:active {
            transform: translateY(-8px) scale(1.01);
        }
        
        .stat-label {
            font-size: 0.95em;
            color: #ff69b4;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(255, 105, 180, 0.3);
        }
        
        .stat-value {
            font-size: 2.2em;
            font-weight: 700;
            background: linear-gradient(135deg, #ff69b4, #ff1493, #ff69b4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline-block;
            position: relative;
            text-shadow: 2px 2px 4px rgba(255, 105, 180, 0.2);
        }
        
        .stat-unit {
            font-size: 0.5em;
            color: #ff69b4;
            margin-left: 5px;
            font-weight: 600;
        }
        
        .buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 40px;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 15px 35px;
            border: none;
            border-radius: 50px;
            font-size: 1.05em;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .btn span {
            position: relative;
            z-index: 1;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #ff69b4, #ff1493);
            color: white;
            box-shadow: 0 10px 25px rgba(255, 105, 180, 0.4);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 35px rgba(255, 105, 180, 0.6);
        }
        
        .btn-primary:active {
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.5), rgba(255, 192, 203, 0.5));
            color: #ff69b4;
            border: 2px solid #ff69b4;
            backdrop-filter: blur(10px);
            font-weight: 700;
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 192, 203, 0.8));
            border-color: #ff1493;
            transform: translateY(-3px) scale(1.05);
            color: #fff;
        }
        
        .footer {
            text-align: center;
            padding: 25px;
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.5), rgba(255, 192, 203, 0.5));
            color: #ff69b4;
            font-size: 0.95em;
            backdrop-filter: blur(10px);
            border-top: 3px dotted #fff;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(255, 105, 180, 0.3);
        }
        
        .chart-container {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .progress-bar {
            width: 100%;
            height: 10px;
            background: rgba(255, 182, 193, 0.3);
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
            border: 2px solid #fff;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff69b4, #ff1493, #ff69b4);
            border-radius: 10px;
            transition: width 1s ease-out;
            box-shadow: 0 0 15px rgba(255, 105, 180, 0.8);
            animation: shimmer 2s infinite;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .buttons, .particles {
                display: none;
            }
            .container {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }
            .content {
                padding: 30px 20px;
            }
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="particles" id="particles"></div>
    
    <div class="container">
        <div class="header">
            <h1>${config.icon} ${config.name} 统计总结</h1>
            <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">
                    <span>📈</span>
                    <span>总体统计</span>
                </div>
                <div class="stats-grid">
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">响应次数</div>
                        <div class="stat-value" data-target="${responseCount}">${responseCount}<span class="stat-unit">次</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">总耗时</div>
                        <div class="stat-value">${totalTimeFormatted}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(totalTime / 600, 100)}%"></div>
                        </div>
                    </div>
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">总Token数</div>
                        <div class="stat-value" data-target="${totalTokens}">${totalTokens}<span class="stat-unit">tokens</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(totalTokens / 100, 100)}%"></div>
                        </div>
                    </div>
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">总字符数</div>
                        <div class="stat-value" data-target="${totalChars}">${totalChars}<span class="stat-unit">字符</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(totalChars / 100, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    <span>📊</span>
                    <span>平均数据</span>
                </div>
                <div class="stats-grid">
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">平均响应时间</div>
                        <div class="stat-value" data-target="${avgTime}">${avgTime}<span class="stat-unit">ms</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(avgTime / 30, 100)}%"></div>
                        </div>
                    </div>
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">平均Token数</div>
                        <div class="stat-value" data-target="${avgTokens}">${avgTokens}<span class="stat-unit">tokens</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(avgTokens / 10, 100)}%"></div>
                        </div>
                    </div>
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">平均字符数</div>
                        <div class="stat-value" data-target="${avgChars}">${avgChars}<span class="stat-unit">字符</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(avgChars / 10, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    <span>💡</span>
                    <span>效率分析</span>
                </div>
                <div class="stats-grid">
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">Token/秒</div>
                        <div class="stat-value">${tokenPerSecond}<span class="stat-unit">tokens/s</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(tokenPerSecond * 10, 100)}%"></div>
                        </div>
                    </div>
                    <div class="stat-card" data-animate="true">
                        <div class="stat-label">字符/秒</div>
                        <div class="stat-value">${charPerSecond}<span class="stat-unit">字符/s</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(charPerSecond * 5, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="buttons">
                <button class="btn btn-primary" id="btn-download-json">
                    <span>📥</span>
                    <span>下载JSON</span>
                </button>
                <button class="btn btn-primary" id="btn-download-html">
                    <span>💾</span>
                    <span>下载报告</span>
                </button>
                <button class="btn btn-secondary" id="btn-print">
                    <span>🖨️</span>
                    <span>打印</span>
                </button>
                <button class="btn btn-secondary" id="btn-share">
                    <span>🔗</span>
                    <span>分享</span>
                </button>
                <button class="btn btn-secondary" id="btn-clear-history" style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5);">
                    <span>🗑️</span>
                    <span>清除历史</span>
                </button>
            </div>
        </div>
        
        <div class="footer">
            <p>💖 AI助手响应时间和Token监控 v2.0 - 二次元萌萌版 💖</p>
        </div>
    </div>
</body>
</html>
        `;
        
        // 使用Blob URL方式打开统计页面（绕过Trusted Types限制）
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, '_blank');
        
        if (newWindow) {
            // 等待页面加载完成后执行脚本并清理URL
            setTimeout(function() {
                URL.revokeObjectURL(blobUrl);
                const win = newWindow;
                const doc = win.document;
                
                // 创建粒子效果
                function createParticles() {
                    const particlesContainer = doc.getElementById('particles');
                    if (!particlesContainer) return;
                    const particleCount = 50;
                    
                    for (let i = 0; i < particleCount; i++) {
                        const particle = doc.createElement('div');
                        particle.className = 'particle';
                        particle.style.left = Math.random() * 100 + '%';
                        particle.style.top = Math.random() * 100 + '%';
                        particle.style.animationDelay = Math.random() * 6 + 's';
                        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                        particlesContainer.appendChild(particle);
                    }
                }
                
                // 存储活动的定时器
                const activeTimers = new Map();
                
                // 数字动画效果
                function animateValue(element, start, end, duration) {
                    // 如果该元素已有动画在运行，先清除
                    if (activeTimers.has(element)) {
                        clearInterval(activeTimers.get(element));
                        activeTimers.delete(element);
                    }
                    
                    // 保存原始HTML内容
                    const originalHTML = element.innerHTML;
                    const unit = element.querySelector('.stat-unit');
                    const unitHTML = unit ? unit.outerHTML : '';
                    
                    const range = end - start;
                    const increment = range / (duration / 16);
                    let current = start;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                            current = end;
                            clearInterval(timer);
                            activeTimers.delete(element);
                            // 动画结束后恢复原始内容
                            element.innerHTML = originalHTML;
                        } else {
                            // 动画进行中只更新数字
                            element.innerHTML = Math.round(current) + unitHTML;
                        }
                    }, 16);
                    
                    // 保存定时器引用
                    activeTimers.set(element, timer);
                }
                
                // 卡片点击动画 - 完全禁用
                function animateCard(card) {
                    // 不执行任何动画，只添加视觉反馈
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 10);
                }
                
                // 显示通知
                function showNotification(message) {
                    const notification = doc.createElement('div');
                    notification.textContent = message;
                    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: rgba(16, 163, 127, 0.9); color: white; padding: 15px 25px; border-radius: 10px; font-size: 14px; font-weight: 600; z-index: 10000; animation: slideInRight 0.3s ease-out; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);';
                    
                    doc.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.animation = 'slideOutRight 0.3s ease-out';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                doc.body.removeChild(notification);
                            }
                        }, 300);
                    }, 2000);
                }
                
                // 添加通知动画样式
                const style = doc.createElement('style');
                style.textContent = '@keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }';
                doc.head.appendChild(style);
                
                // 下载JSON
                function downloadJSON() {
                    const statsData = {
                        platform: '` + config.name + `',
                        generatedAt: '` + new Date().toISOString() + `',
                        totalStats: {
                            responseCount: ` + responseCount + `,
                            totalTime: ` + totalTime + `,
                            totalTokens: ` + totalTokens + `,
                            totalChars: ` + totalChars + `
                        },
                        averageStats: {
                            avgTime: ` + avgTime + `,
                            avgTokens: ` + avgTokens + `,
                            avgChars: ` + avgChars + `
                        },
                        efficiency: {
                            tokenPerSecond: ` + tokenPerSecond + `,
                            charPerSecond: ` + charPerSecond + `
                        }
                    };
                    
                    const dataStr = JSON.stringify(statsData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = doc.createElement('a');
                    link.href = url;
                    link.download = 'AI统计数据_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.json';
                    link.click();
                    URL.revokeObjectURL(url);
                    showNotification('📥 JSON数据已下载');
                }
                
                // 下载HTML
                function downloadHTML() {
                    const htmlContent = doc.documentElement.outerHTML;
                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const link = doc.createElement('a');
                    link.href = url;
                    link.download = 'AI统计报告_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.html';
                    link.click();
                    URL.revokeObjectURL(url);
                    showNotification('💾 HTML报告已下载');
                }
                
                // 分享功能
                function shareStats() {
                    const shareText = '📊 ` + config.name + ` 统计报告' + '\\n\\n' +
                        '响应次数: ` + responseCount + `次' + '\\n' +
                        '总Token数: ` + totalTokens + `' + '\\n' +
                        '总字符数: ` + totalChars + `' + '\\n' +
                        '平均响应时间: ` + avgTime + `ms' + '\\n\\n' +
                        '生成时间: ' + new Date().toLocaleString('zh-CN');
                    
                    if (win.navigator.share) {
                        win.navigator.share({
                            title: '` + config.name + ` 统计报告',
                            text: shareText
                        }).then(() => {
                            showNotification('🔗 分享成功');
                        }).catch(() => {
                            copyToClipboard(shareText);
                        });
                    } else {
                        copyToClipboard(shareText);
                    }
                }
                
                // 复制到剪贴板
                function copyToClipboard(text) {
                    const textarea = doc.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    doc.body.appendChild(textarea);
                    textarea.select();
                    
                    try {
                        doc.execCommand('copy');
                        showNotification('📋 已复制到剪贴板');
                    } catch (err) {
                        showNotification('❌ 复制失败');
                    }
                    
                    doc.body.removeChild(textarea);
                }
                
                // 初始化
                createParticles();
                
                // 清除历史数据
                function clearHistory() {
                    if (win.confirm('确定要清除所有历史统计数据吗?此操作不可恢复!')) {
                        try {
                            win.opener.localStorage.removeItem('` + STORAGE_KEY + `');
                            showNotification('🗑️ 历史数据已清除');
                            setTimeout(() => {
                                win.close();
                            }, 1500);
                        } catch (e) {
                            showNotification('❌ 清除失败');
                        }
                    }
                }
                
                // 绑定按钮事件
                const btnDownloadJSON = doc.getElementById('btn-download-json');
                const btnDownloadHTML = doc.getElementById('btn-download-html');
                const btnPrint = doc.getElementById('btn-print');
                const btnShare = doc.getElementById('btn-share');
                const btnClearHistory = doc.getElementById('btn-clear-history');
                
                if (btnDownloadJSON) btnDownloadJSON.addEventListener('click', downloadJSON);
                if (btnDownloadHTML) btnDownloadHTML.addEventListener('click', downloadHTML);
                if (btnPrint) btnPrint.addEventListener('click', () => win.print());
                if (btnShare) btnShare.addEventListener('click', shareStats);
                if (btnClearHistory) btnClearHistory.addEventListener('click', clearHistory);
                
                // 绑定卡片点击事件
                doc.querySelectorAll('.stat-card[data-animate="true"]').forEach(card => {
                    card.addEventListener('click', function() {
                        animateCard(this);
                    });
                });
            }, 100);
        } else {
            alert('无法打开新窗口，请检查浏览器弹窗拦截设置');
        }
    }
    
    // 绑定统计按钮事件
    summaryButton.onclick = showSummary;

    let lastResponseText = '';
    let observedInputArea = false;
    
    // 开始监控
    function startMonitoring() {
        startTime = Date.now();
        isMonitoring = true;
        firstTokenReceived = false;
        currentResponse = '';
        lastResponseText = '';
        isCompleting = false;
        completionTimeout = null;
        updateStatus('等待响应...', config.warningColor);
        updateTime('--');
        updateTokens('');
    }

    // 监控发送按钮
    function observeInputArea() {
        if (observedInputArea) return;
        
        // 方法1: 监听整个文档的点击事件（捕获阶段）
        document.addEventListener('click', (e) => {
            const target = e.target;
            const button = target.closest('button[data-testid="send-button"]') ||
                          target.closest('button[aria-label*="Send"]') ||
                          target.closest('button[aria-label*="发送"]');
            
            if (button && !isMonitoring) {
                setTimeout(() => startMonitoring(), 100);
            }
        }, true);
        
        // 方法2: 监听键盘 Enter 键 - 使用compositionend检测输入法完成
        let isComposing = false;
        
        document.addEventListener('compositionstart', () => {
            isComposing = true;
        }, true);
        
        document.addEventListener('compositionend', () => {
            isComposing = false;
        }, true);
        
        // 监听输入变化来判断是否有内容
        let lastInputValue = '';
        let inputElement = null;
        
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true') {
                inputElement = e.target;
                lastInputValue = e.target.value || e.target.textContent || '';
            }
        }, true);
        
        document.addEventListener('keydown', (e) => {
            // 只在按下Enter且不是Shift+Enter时处理
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                // 实时获取当前输入框的值
                const currentInput = e.target.value || e.target.textContent || '';
                const hasContent = currentInput.trim().length > 0 || lastInputValue.trim().length > 0;
                
                // 检查是否有内容
                if (hasContent && !isMonitoring) {
                    setTimeout(() => startMonitoring(), 100);
                    // 清空记录的值
                    setTimeout(() => { lastInputValue = ''; }, 100);
                }
            }
        }, true);
        
        // 方法3: 使用 MutationObserver 监听按钮并添加监听器
        const observer = new MutationObserver(() => {
            if (observedInputArea) return;
            
            let sendButton = document.querySelector(config.sendButtonSelector);
            
            if (!sendButton) {
                const buttons = document.querySelectorAll('button');
                for (const btn of buttons) {
                    const ariaLabel = btn.getAttribute('aria-label') || '';
                    const testId = btn.getAttribute('data-testid') || '';
                    if (ariaLabel.includes('Send') || ariaLabel.includes('发送') || testId.includes('send')) {
                        sendButton = btn;
                        break;
                    }
                }
            }
            
            if (sendButton) {
                observedInputArea = true;
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 监控AI响应
    function monitorMessages() {
        setInterval(() => {
            if (isMonitoring) {
                let latestMessage = null;
                let text = '';
                
                // ChatGPT 方法
                if (isChatGPT) {
                    const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
                    if (messages.length > 0) {
                        latestMessage = messages[messages.length - 1];
                        text = latestMessage.textContent || '';
                    }
                }
                
                // Gemini 方法
                if (!text && isGemini) {
                    const messages = document.querySelectorAll(config.messageSelector);
                    if (messages.length > 0) {
                        latestMessage = messages[messages.length - 1];
                        text = latestMessage.textContent || '';
                    }
                    
                    // Gemini备用方法
                    if (!text) {
                        const contentDivs = document.querySelectorAll('.model-response-text, .response-container-content, [class*="message-content"]');
                        if (contentDivs.length > 0) {
                            latestMessage = contentDivs[contentDivs.length - 1];
                            text = latestMessage.textContent || '';
                        }
                    }
                }
                
                // 处理找到的响应 - 只有当内容长度>10时才认为是真正的响应
                if (text && text.trim().length > 10) {
                    // 首次收到有意义的内容
                    if (!firstTokenReceived && startTime) {
                        const responseTime = Date.now() - startTime;
                        updateTime(responseTime);
                        updateStatus('接收中...', config.primaryColor);
                        firstTokenReceived = true;
                    }
                    
                    // 内容有变化，更新显示
                    if (text !== lastResponseText) {
                        currentResponse = text;
                        lastResponseText = text;
                        updateTokens(currentResponse);
                    }
                    
                    // 检查是否完成
                    const stopButton = document.querySelector(config.stopButtonSelector);
                    if (!stopButton && firstTokenReceived && text.length > 10 && isMonitoring && !isCompleting) {
                        isCompleting = true;
                        
                        completionTimeout = setTimeout(() => {
                            const finalStopButton = document.querySelector(config.stopButtonSelector);
                            if (!finalStopButton) {
                                const finalTime = Date.now() - startTime;
                                const tokens = estimateTokens(currentResponse);
                                const chars = currentResponse.length;
                                
                                updateStatus('完成', config.primaryColor);
                                updateTotals(tokens, chars, finalTime);
                                isMonitoring = false;
                                isCompleting = false;
                                completionTimeout = null;
                            } else {
                                isCompleting = false;
                            }
                        }, 500);
                    }
                }
            }
        }, 100);
    }

    // 初始化
    updateStatus('就绪', config.primaryColor);
    initializeDisplay(); // 显示已保存的统计数据
    
    setTimeout(() => {
        observeInputArea();
    }, 1000);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            monitorMessages();
        });
    } else {
        monitorMessages();
    }

    // 使面板可拖动
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    panel.addEventListener('mousedown', (e) => {
        if (e.target === panel || e.target.parentElement === panel) {
            isDragging = true;
            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
            panel.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

})();