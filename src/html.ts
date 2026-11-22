export const html: string = `
<div class="thmr-container" id="thmr-container">
    <div class="thmr-main" id="thmr-main" style="display:flex">
        <div class="thmr-cover" id="thmr-cover">
            <img src="https://thmr.yunmoan.cn/assets/cover-fallback.svg" alt="" class="thmr-cover-img" id="thmr-cover-img">
        </div>
        <div class="thmr-content">
            <div class="thmr-header">
                <div class="thmr-title" id="thmr-title">加载中</div>
                <div class="thmr-settings-btn" id="thmr-settings-btn">
                    <svg style="fill: currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M991.8 333.2c6.4 17.4 1 36.8-12.8 49.2l-86.6 78.8c2.2 16.6 3.4 33.6 3.4 50.8s-1.2 34.2-3.4 50.8l86.6 78.8c13.8 12.4 19.2 31.8 12.8 49.2-8.8 23.8-19.4 46.6-31.6 68.6l-9.4 16.2c-13.2 22-28 42.8-44.2 62.4-11.8 14.4-31.4 19.2-49 13.6l-111.4-35.4c-26.8 20.6-56.4 37.8-88 50.8l-25 114.2c-4 18.2-18 32.6-36.4 35.6-27.6 4.6-56 7-85 7s-57.4-2.4-85-7c-18.4-3-32.4-17.4-36.4-35.6l-25-114.2c-31.6-13-61.2-30.2-88-50.8l-111.2 35.6c-17.6 5.6-37.2 0.6-49-13.6-16.2-19.6-31-40.4-44.2-62.4l-9.4-16.2c-12.2-22-22.8-44.8-31.6-68.6-6.4-17.4-1-36.8 12.8-49.2l86.6-78.8c-2.2-16.8-3.4-33.8-3.4-51s1.2-34.2 3.4-50.8l-86.6-78.8c-13.8-12.4-19.2-31.8-12.8-49.2 8.8-23.8 19.4-46.6 31.6-68.6l9.4-16.2c13.2-22 28-42.8 44.2-62.4 11.8-14.4 31.4-19.2 49-13.6l111.4 35.4c26.8-20.6 56.4-37.8 88-50.8l25-114.2c4-18.2 18-32.6 36.4-35.6C454.6 2.4 483 0 512 0s57.4 2.4 85 7c18.4 3 32.4 17.4 36.4 35.6l25 114.2c31.6 13 61.2 30.2 88 50.8l111.4-35.4c17.6-5.6 37.2-0.6 49 13.6 16.2 19.6 31 40.4 44.2 62.4l9.4 16.2c12.2 22 22.8 44.8 31.6 68.6zM512 672a160 160 0 1 0 0-320 160 160 0 1 0 0 320z"></path></svg>
                </div>
            </div>
            <div class="thmr-subtitle" id="thmr-subtitle">加载中</div>
            <div class="thmr-controls" id="thmr-controls">
                <div class="thmr-controls-play" id="thmr-controls-play">
                    <svg id="thmr-controls-play-icon" style="display: block;fill: currentColor" viewBox="0 0 1756 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1220.672 487.107657c-0.215771-0.374857-0.453486-0.731429-0.676571-1.098971-6.266514-11.536457-16.010971-21.813029-28.692114-29.134629l-462.6944-267.136c-11.918629-6.880914-24.797257-10.203429-37.198629-10.296686-0.239543-0.003657-0.475429-0.020114-0.7168-0.020114-0.142629 0-0.2816 0.010971-0.424229 0.0128-0.778971 0.007314-1.552457 0.034743-2.327771 0.065829-0.164571 0.007314-0.329143 0.009143-0.493714 0.018286-20.598857 1.000229-39.416686 11.029943-49.634743 28.728686-4.885943 8.462629-7.259429 17.751771-7.389257 27.1488-0.751543 4.337371-1.155657 8.815543-1.155657 13.4016l0 534.273829c0 4.586057 0.404114 9.064229 1.155657 13.4016 0.129829 9.3952 2.505143 18.686171 7.389257 27.1488 10.218057 17.696914 29.034057 27.726629 49.632914 28.728686 0.1664 0.009143 0.334629 0.010971 0.501029 0.018286 0.771657 0.032914 1.543314 0.060343 2.320457 0.065829 0.142629 0.001829 0.2816 0.0128 0.424229 0.0128 0.241371 0 0.479086-0.018286 0.718629-0.020114 12.401371-0.095086 25.278171-3.4176 37.1968-10.296686l462.6944-267.136c12.682971-7.3216 22.4256-17.598171 28.692114-29.134629 0.223086-0.367543 0.4608-0.724114 0.676571-1.098971 5.176686-8.965486 7.533714-18.859886 7.389257-28.8256C1228.205714 505.967543 1225.848686 496.073143 1220.672 487.107657z"></path></svg>
                    <svg id="thmr-controls-pause-icon" style="display: none;fill: currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M469.333333 725.333333V298.666667H341.333333v426.666666h128zM682.666667 725.333333V298.666667h-128v426.666666h128z"></path></svg>
                </div>
                <div class="thmr-controls-volume" id="thmr-controls-volume">
                    <div class="thmr-controls-volume-icon" id="thmr-controls-volume-icon">
                        <svg style="fill: currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M462.06 142.1L284.12 320H80c-26.52 0-48 21.48-48 48v288c0 26.5 21.48 48 48 48h204.12l177.94 177.9c30.06 30.06 81.94 8.94 81.94-33.94V176.04c0-42.92-51.92-63.96-81.94-33.94zM992 512c0-127.06-64.12-243.88-171.54-312.48-22.38-14.28-52.06-7.64-66.24 14.92s-7.56 52.42 14.82 66.72C848.54 331.94 896 418.22 896 512s-47.46 180.06-126.96 230.84c-22.38 14.28-29 44.14-14.82 66.72 13.02 20.72 42.24 30.28 66.24 14.92C927.88 755.88 992 639.06 992 512z m-283.54-153.74c-23.16-12.66-52.38-4.32-65.22 18.9-12.78 23.22-4.32 52.4 18.9 65.22C687.96 456.56 704 483.26 704 512c0 28.76-16.04 55.44-41.84 69.62-23.22 12.82-31.68 42-18.9 65.22 12.86 23.32 42.1 31.6 65.22 18.9 56.46-31.1 91.54-90 91.54-153.76s-35.08-122.64-91.56-153.72z"></path></svg>
                    </div>
                    <div class="thmr-controls-volume-prog" id="thmr-controls-volume-prog" style="--progress: 100%">
                        <div class="thmr-controls-volume-prog-bg" id="thmr-controls-volume-prog-bg"></div>
                        <div class="thmr-controls-volume-prog-bar" id="thmr-controls-volume-prog-bar"></div>
                        <div class="thmr-controls-volume-prog-dot" id="thmr-controls-volume-prog-dot"></div>
                    </div>
                    <div class="thmr-controls-volume-value" id="thmr-controls-volume-value">100</div>
                </div>
            </div>
        </div>
    </div>
    <div class="thmr-settings" id="thmr-settings">
        <div class="thmr-settings-header">
            <div class="thmr-settings-title">设置</div>
            <div class="thmr-settings-close" id="thmr-settings-close">×</div>
        </div>
        <div class="thmr-settings-sections" id="thmr-settings-sections">
            <div class="thmr-settings-section">
                <div class="thmr-settings-section-title">频道</div>
                <div class="thmr-settings-slide" id="thmr-settings-stations">
                    <div class="thmr-settings-slide-option-bg"></div>
                </div>
            </div>
            <div class="thmr-settings-section">
                <div class="thmr-settings-section-title">码率</div>
                <div class="thmr-settings-slide" id="thmr-settings-profiles">
                    <div class="thmr-settings-slide-option-bg"></div>
                </div>
            </div>
            <div class="thmr-settings-section">
                <div class="thmr-settings-section-title">主题</div>
                <div class="thmr-settings-slide">
                    <div class="thmr-settings-slide-option" id="thmr-settings-theme-light" key="theme" value="light">亮</div>
                    <div class="thmr-settings-slide-option" id="thmr-settings-theme-dark" key="theme" value="dark">暗</div>
                    <div class="thmr-settings-slide-option-bg"></div>
                </div>
            </div>
            <div class="thmr-settings-section">
                <div class="thmr-settings-section-title">样式</div>
                <div class="thmr-settings-slide">
                    <div class="thmr-settings-slide-option" id="thmr-settings-style-glass" key="style" value="glass">玻璃</div>
                    <div class="thmr-settings-slide-option" id="thmr-settings-style-solid" key="style" value="solid">固体</div>
                    <div class="thmr-settings-slide-option-bg"></div>
                </div>
            </div>
            <div class="thmr-settings-section">
                <div class="thmr-settings-section-title">减少动画效果</div>
                <div class="thmr-settings-slide">
                    <div class="thmr-settings-slide-option" id="thmr-settings-reduceMotion-true" key="reduceMotion" value="true">开</div>
                    <div class="thmr-settings-slide-option" id="thmr-settings-reduceMotion-false" key="reduceMotion" value="false">关</div>
                    <div class="thmr-settings-slide-option-bg"></div>
                </div>
            </div>
            <div class="thmr-about">
                <a class="thmr-link" href="https://github.com/aoralsfout/thmr-web-plugin" target="_blank">
                    <span>♡ Github</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true">
                        <path d="M5 19 19 5M5 5h14v14"></path>
                    </svg>
                </a>
                <div class="thmr-version" id="thmr-version"></div>
            </div>
        </div>
    </div>
    <div class="thmr-background">
        <img src="https://thmr.yunmoan.cn/background.png" alt="" class="thmr-background-img">
    </div>
    <div class="thmr-specturm">
        <canvas id="thmr-spectrum-canvas"></canvas>
    </div>
    <audio nocontrols id="thmr-radio"></audio>
</div>
`;
