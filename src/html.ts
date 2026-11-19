export const html: string = `
<div class="thmr-container" id="thmr-container">
    <div class="thmr-background">
        <img src="https://thmr.yunmoan.cn/background.png" alt="" class="thmr-background-img">
    </div>
    <div class="thmr-specturm">
        <canvas id="thmr-spectrum-canvas"></canvas>
    </div>
    <div class="thmr-cover" id="thmr-cover">
        <img src="" alt="" class="thmr-cover-img" id="thmr-cover-img">
    </div>
    <div class="thmr-content">
        <div class="thmr-title" id="thmr-title">qwq</div>
        <div class="thmr-subtitle" id="thmr-subtitle">awa</div>
        <div class="thmr-controls" id="thmr-controls">
            <div class="thmr-controls-play" id="thmr-controls-play">
                <svg id="thmr-controls-play-icon" style="display: block;fill: currentColor" viewBox="0 0 1756 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1220.672 487.107657c-0.215771-0.374857-0.453486-0.731429-0.676571-1.098971-6.266514-11.536457-16.010971-21.813029-28.692114-29.134629l-462.6944-267.136c-11.918629-6.880914-24.797257-10.203429-37.198629-10.296686-0.239543-0.003657-0.475429-0.020114-0.7168-0.020114-0.142629 0-0.2816 0.010971-0.424229 0.0128-0.778971 0.007314-1.552457 0.034743-2.327771 0.065829-0.164571 0.007314-0.329143 0.009143-0.493714 0.018286-20.598857 1.000229-39.416686 11.029943-49.634743 28.728686-4.885943 8.462629-7.259429 17.751771-7.389257 27.1488-0.751543 4.337371-1.155657 8.815543-1.155657 13.4016l0 534.273829c0 4.586057 0.404114 9.064229 1.155657 13.4016 0.129829 9.3952 2.505143 18.686171 7.389257 27.1488 10.218057 17.696914 29.034057 27.726629 49.632914 28.728686 0.1664 0.009143 0.334629 0.010971 0.501029 0.018286 0.771657 0.032914 1.543314 0.060343 2.320457 0.065829 0.142629 0.001829 0.2816 0.0128 0.424229 0.0128 0.241371 0 0.479086-0.018286 0.718629-0.020114 12.401371-0.095086 25.278171-3.4176 37.1968-10.296686l462.6944-267.136c12.682971-7.3216 22.4256-17.598171 28.692114-29.134629 0.223086-0.367543 0.4608-0.724114 0.676571-1.098971 5.176686-8.965486 7.533714-18.859886 7.389257-28.8256C1228.205714 505.967543 1225.848686 496.073143 1220.672 487.107657z" p-id="1822"></path></svg>
                <svg id="thmr-controls-pause-icon" style="display: none;fill: currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M469.333333 725.333333V298.666667H341.333333v426.666666h128zM682.666667 725.333333V298.666667h-128v426.666666h128z"></path></svg>
            </div>
            <div class="thmr-controls-volume" id="thmr-controls-volume">
                <div class="thmr-controls-volume-icon" id="thmr-controls-volume-icon">
                    <svg style="fill: currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3419"><path d="M462.06 142.1L284.12 320H80c-26.52 0-48 21.48-48 48v288c0 26.5 21.48 48 48 48h204.12l177.94 177.9c30.06 30.06 81.94 8.94 81.94-33.94V176.04c0-42.92-51.92-63.96-81.94-33.94zM992 512c0-127.06-64.12-243.88-171.54-312.48-22.38-14.28-52.06-7.64-66.24 14.92s-7.56 52.42 14.82 66.72C848.54 331.94 896 418.22 896 512s-47.46 180.06-126.96 230.84c-22.38 14.28-29 44.14-14.82 66.72 13.02 20.72 42.24 30.28 66.24 14.92C927.88 755.88 992 639.06 992 512z m-283.54-153.74c-23.16-12.66-52.38-4.32-65.22 18.9-12.78 23.22-4.32 52.4 18.9 65.22C687.96 456.56 704 483.26 704 512c0 28.76-16.04 55.44-41.84 69.62-23.22 12.82-31.68 42-18.9 65.22 12.86 23.32 42.1 31.6 65.22 18.9 56.46-31.1 91.54-90 91.54-153.76s-35.08-122.64-91.56-153.72z"></path></svg>
                </div>
                <div class="thmr-controls-volume-prog" id="thmr-controls-volume-prog" style="--progress: 100%">
                    <div class="thmr-controls-volume-prog-bg" id="thmr-controls-volume-prog-bg"></div>
                    <div class="thmr-controls-volume-prog-bar" id="thmr-controls-volume-prog-bar"></div>
                    <div class="thmr-controls-volume-prog-dot" id="thmr-controls-volume-prog-dot"></div>
                </div>
                <div class="thmr-controls-volume-value" id="thmr-controls-volume-value">100%</div>
            </div>
        </div>
    </div>
    <audio nocontrols id="thmr-radio"></audio>
</div>
<div id="thmr-dev">
    <div id="thmr-dev-current"></div>
    <div id="thmr-dev-target"></div>
</div>
`;
