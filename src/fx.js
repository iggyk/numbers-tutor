const g = 2000;
export const spawnFx = (content,originX,originY) => {
    document.body.appendChild(content);
    let vX = Math.round(Math.random() * 500) * (Math.random() > 0.5 ? -1 : 1);
    let vY = -Math.round(Math.random() * 500);
    const vR = Math.round(Math.random() * 180) * (Math.random() > 0.5 ? -1 : 1);
    let time = (new Date()).valueOf();
    let x = originX;
    let y = originY;
    let r = Math.round(Math.random() * 20) * (Math.random() > 0.5 ? -1 : 1);
    const frameHandler = () => {
        const now = (new Date()).valueOf();
        const diff = (now - time) / 1000;
        time = now;
        x += vX * diff;
        y += vY * diff;
        r += vR * diff;
        vY += g * diff;
        if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
            document.body.removeChild(content);
            return;
        }
        content.style.left = `${x}px`;
        content.style.top = `${y}px`;
        content.style.transform = `rotate(${r}deg)`;
        requestAnimationFrame(frameHandler);
    }
    requestAnimationFrame(frameHandler);
}