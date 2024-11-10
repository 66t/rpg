class KeyBoardVisualizer {
    constructor(containerId, restoreButtonPosition = { top: '10px', left: '10px' }) {
        this.containerId = containerId;
        this.app = null;
        this.restoreButtonPosition = restoreButtonPosition;
    }

    load() {
        const container = document.getElementById(this.containerId);
        if (!container) {return;}
        const EventComponent = Vue.extend({
            template: `
                <div v-if="!minimized" class="event-visualizer-container">
                    <div class="event-visualizer-header">
                        <h1>键鼠监听</h1>
                        <button @click="minimize" class="minimize-button">-</button>
                    </div>
                    <div class="event-grid">
                        <div v-for="(state, key) in combinedState" :key="key" :class="['event-grid-item', stateClass(state)]">
                            <span class="event-key">{{ key }}</span>
                            <span v-if="state.cursor" class="event-time">{{ state.cursor }}</span>
                            <span v-if="state.scroll" class="event-time">{{ state.scroll }}</span>
                        </div>
                    </div>
                </div>
            `,
            data() {
                return {
                    keyboardState: {},
                    mouseState: {},
                    minimized: true,
                    intervalId: null
                };
            },
            props: ['restoreButtonPosition'],
            computed: {
                combinedState() {
                    return { ...this.keyboardState, ...this.mouseState };
                },
                restoreButtonStyle() {
                    return {
                        position: 'absolute',
                        top: this.restoreButtonPosition.top,
                        left: this.restoreButtonPosition.left,
                        borderRadius: '5px',
                        padding: '5px',
                        cursor: 'pointer',
                        textAlign: 'center'
                    };
                }
            },
            mounted() {
                this.intervalId = setInterval(this.updateStates, 1);
            },
            beforeDestroy() {
                clearInterval(this.intervalId);
            },
            methods: {
                minimize() {
                    this.minimized = true;
                    LIM.menu.app.minimized=false;
                    window.resizeTo(500, 500);
                },
                updateStates() {
                    // Only update states if not minimized
                    if (this.minimized) return;

                    const { Keyboard, Mouse } = window.opener;
                    if (!Keyboard || !Mouse) { return; }

                    const kstate = {};
                    for (let key of Object.keys(Keyboard.controlMapper)) {
                        kstate[key] = {
                            trigger: Keyboard.get(key, "trigger") ? Date.now() : this.keyboardState[key]?.trigger,
                            pressed: Keyboard.get(key, "default") ? Date.now() : this.keyboardState[key]?.pressed,
                            longPress: Keyboard.get(key, "long") ? Date.now() : this.keyboardState[key]?.longPress,
                            released: Keyboard.get(key, "release") ? Date.now() : this.keyboardState[key]?.released
                        };
                    }
                    this.keyboardState = kstate;

                    const mstate = {};
                    for (let key of Object.keys(Mouse.controlMapper)) {
                        mstate[key] = {
                            trigger: Mouse.get(key, "trigger") ? Date.now() : this.mouseState[key]?.trigger,
                            pressed: Mouse.get(key, "default") ? Date.now() : this.mouseState[key]?.pressed,
                            longPress: Mouse.get(key, "long") ? Date.now() : this.mouseState[key]?.longPress,
                            released: Mouse.get(key, "release") ? Date.now() : this.mouseState[key]?.released
                        };
                    }
                    mstate["positionX"] = {
                        cursor: ` ${parseInt(Mouse.cursor.x)}`
                    };
                    mstate["positionY"] = {
                        cursor: `${parseInt(Mouse.cursor.y)}`
                    };
                    this.mouseState = mstate;

                    // Reset wheel activity after each read
                    Mouse.resetWheel();
                },
                stateClass(state) {
                    const t = Date.now();
                    if (t - state.trigger < 100) {
                        return 'triggered';
                    } else if (t - state.released < 100) {
                        return 'released';
                    } else if (t - state.longPress < 100) {
                        return 'long-pressed';
                    } else if (t - state.pressed < 100) {
                        return 'pressed';
                    } else {
                        return 'default';
                    }
                }
            }
        });
        this.app = new EventComponent({ propsData: { restoreButtonPosition: this.restoreButtonPosition } });
        this.app.$mount(container);
        this.appStyle();
    }

    appStyle() {
        const styles = `
.event-visualizer-container {
    background-color: #c0c0c0;
    color: #000000;
    padding: 10px;
    border: 2px solid #000080;
    font-family: "Tahoma", sans-serif;
    max-width: 600px;
    margin: auto;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
}

.event-visualizer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    background-color: #000080;
    color: #ffffff;
    padding: 5px;
    border-bottom: 2px solid #000000;
}

.minimize-button {
    background-color: #c0c0c0;
    color: #000000;
    border: 1px solid #000000;
    border-radius: 2px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 24px;
    line-height: 18px;
    text-align: center;
}

.event-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    background-color: #ffffff;
    border: 1px solid #000000;
    padding: 10px;
}

.event-grid-item {
    padding: 10px;
    border-radius: 2px;
    text-align: center;
    transition: background-color 0.3s;
    border: 1px solid #000000;
}

.event-grid-item.default {
    background-color: #e0e0e0;
}

.event-grid-item.pressed {
    background-color: #ffcccb;
}

.event-grid-item.triggered {
    background-color: #add8e6;
}

.event-grid-item.long-pressed {
    background-color: #90ee90;
}

.event-grid-item.released {
    background-color: #ffd700;
}

.event-key {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
}

.event-time {
    font-size: 0.8em;
    color: #333333;
}

.restore-button {
    background-color: #c0c0c0;
    color: #000000;
    border: 1px solid #000000;
    padding: 5px;
    cursor: pointer;
    text-align: center;
    position: absolute;
    font-family: "Tahoma", sans-serif;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}`;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    unload() {
        if (this.app) {
            this.app.$destroy();
            const container = document.getElementById(this.containerId);
            if (container) { container.innerHTML = ''; }
            this.app = null;
        }
    }
}

LIM.keyboard = new KeyBoardVisualizer('keyboard', { top: '50px', left: '50px' });
LIM.keyboard.load();