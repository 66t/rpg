var LIM={}

class MenuVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.app = null;
    }

    load() {
        const container = document.getElementById(this.containerId);
        if (!container) { return; }

        const EventComponent = Vue.extend({
            template: `
                <div v-if="!minimized" class="event-visualizer-container">
                    <div class="menu-list">
                        <div v-for="(event, index) in events" :key="index" class="menu-list-item" @click="logEvent(index + 1)">
                            <span>{{ event }}</span>
                        </div>
                    </div>
                </div>
            `,
            data() {
                return {
                    events: ['键鼠监听', 'Json编辑器', 'Event 3', 'Event 4', 'Event 4', 'Event 4'],
                    minimized:false
                };
            },
            methods: {
                logEvent(index) {
                   switch (index){
                       case 1:
                           this.minimized=true
                           LIM.keyboard.app.minimized=false
                           window.resizeTo(600, 500);
                           break
                       case 2:
                           this.minimized=true
                           LIM.jsonEditor.app.minimized=false
                           window.resizeTo(800, 800);
                           
                   }
                }
            },
            mounted() {
                this.$nextTick(() => {
                    window.resizeTo(500, 500);
                });
            }
        });

        this.app = new EventComponent();
        this.app.$mount(container);
        this.appStyle();
    }

    appStyle() {
        const styles = `
.event-visualizer-container {
    background-color: #f0f0f0;
    color: #000;
    padding: 10px;
    border: 1px solid #ccc;
    max-width: 100vw;
    max-height: 100vh;
    box-sizing: border-box;
}
.menu-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    padding: 10px;
    background-color: #fafafa;
}

.menu-list-item {
    padding: 20px;
    border: 1px solid #ddd;
    text-align: center;
    background-color: #eee;
    cursor: pointer;
    flex: 1 1 30%; /* 自动排列并保持一定比例 */
    max-width: 150px; /* 设置最大宽度，避免项过大 */
    box-sizing: border-box;
}

.menu-list-item:hover {
    background-color: #ccc;
}
`;
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
LIM.menu = new MenuVisualizer('visualizer');
LIM.menu.load();