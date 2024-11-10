class JSONTreeEditor {
    constructor(containerId, restoreButtonPosition = { top: '10px', left: '10px' }) {
        this.containerId = containerId;
        this.app = null;
        this.restoreButtonPosition = restoreButtonPosition;
    }

    load() {
        const data = {};
        for (let item of window.opener.DataManager.dataFile) {
            data[item.name.slice(1)] = window.opener[item.name];
        }

        const container = document.getElementById(this.containerId);
        if (!container) return;

        this.app = new Vue({
            el: container,
            template: `
            <div v-if="!minimized" id="app" class="game-json-editor">
                <div style="background-color: seashell" class="event-visualizer-header">
                        <h1>JSON编辑器</h1>
                        <button @click="minimize" class="minimize-button">-</button>
                </div>
                <div class="json-editor">
                    <json-node :node="jsonData" :parent="null" :key-name="'root'" @update="updateJson" @delete="deleteNode" @add="addNode"></json-node>
                </div>
            </div>
            `,
            data() {
                return {
                    jsonData: data,
                    minimized: true,
                };
            },
            methods: {
                minimize() {
                    this.minimized = true;
                    LIM.menu.app.minimized=false;
                    window.resizeTo(500, 500);
                },
                updateJson(parent, oldKey, newKey, value) {
                    this.$set(parent, newKey, value);
                    if (oldKey !== newKey) {
                        this.$delete(parent, oldKey);
                    }
                },
                deleteNode(parent, key) {
                    this.$delete(parent, key);
                },
                addNode(parent, key) {
                    this.$set(parent, key, {});
                }
            }
        });

        this.appStyle();
    }

    appStyle() {
        const styles = `
        .game-json-editor {
            background-color: #282828;
            color: #e5e5e5;
            padding: 15px;
            border: 2px solid #444;
            font-family: "Courier New", monospace;
            max-width: 700px;
            margin: auto;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            border-radius: 6px;
        }

        .game-json-editor h1 {
            font-size: 1.5em;
            margin-bottom: 10px;
            text-align: center;
            color: #d4af37;
        }

        .json-editor {
            background-color: #333;
            padding: 10px;
            border-radius: 5px;
            overflow-y: auto;
        }

        .json-node {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            border: 2px solid #444;
            background-color: #3b3b3b;
            display: flex;
            flex-direction: column;
            gap: 10px;
            position: relative;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .json-node:hover {
            background-color: #4b4b4b;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
        }

        .json-node-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .toggle-button {
            background: none;
            font-size: 18px;
            font-weight: 800;
            cursor: pointer;
            color: #d4af37;
            border: none;
            outline: none;
            transition: transform 0.3s ease;
        }

        .toggle-button:hover {
            transform: scale(1.2);
        }

        .json-node-children {
            border-bottom: 3px dashed #d4af37;
            margin-left: 15px;
            padding-left: 15px;
            border-left: 3px dashed #d4af37;
            padding-bottom: 10px;
        }

        input.key-input, input.value-input {
            padding: 4px 8px;
            border: 2px solid #666;
            border-radius: 4px;
            font-size: 13px;
            background-color: #222;
            color: #e5e5e5;
            flex-grow: 1;
            transition: border-color 0.3s ease;
        }

        input.key-input:focus, input.value-input:focus {
            border-color: #d4af37;
        }

        .json-actions {
            display: flex;
            gap: 5px;
        }

        .json-actions button {
            padding: 4px 8px;
            border: 2px solid #444;
            border-radius: 5px;
            background-color: #444;
            color: #e5e5e5;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .json-actions button:hover {
            background-color: #555;
            border-color: #d4af37;
        }

        .type-switch {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }

        .type-switch button {
            padding: 4px 6px;
            border: none;
            border-radius: 4px;
            background-color: #666;
            color: #e5e5e5;
            cursor: pointer;
            font-size: 11px;
            transition: background-color 0.3s ease;
        }

        .type-switch button.active {
            background-color: #888;
        }

        .type-switch button:hover {
            background-color: #777;
        }

        .type-btn {
            padding: 4px 6px;
            margin-left: 5px;
            border: none;
            border-radius: 4px;
            background-color: #666;
            color: #e5e5e5;
            cursor: pointer;
            font-size: 11px;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .type-btn:hover {
            background-color: #777;
            transform: scale(1.05);
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
            if (container) container.innerHTML = '';
            this.app = null;
        }
    }
}

const collapseStates = {};

Vue.component('json-node', {
    props: ['node', 'parent', 'keyName'],
    template: `
    <table>
      <tr>
        <td class="json-node" @click="toggleCollapse(currentPath)"  style="background-color: #fff"> 
          <div class="toggle-button" v-if="hasChildren">{{isCollapsed ? '+' : '-' }}</div>
        </td>
        <td>
           <button class="type-btn" @click="addChild" v-if="isObject(node) || Array.isArray(node)" title="Add Child Node">+ Add</button>
           <button class="type-btn"  v-if="currentPath!=='root'"  @click="deleteSelf" title="Delete">- Delete</button>
           <button class="type-btn"  v-if="currentPath!=='root'"  @click="copyJsonToClipboard" title="Copy JSON">- JSON</button>
        </td>
        <td>
             <div v-if="currentPath!=='root'" class="type-switch">
                <button @click="convertToObject" :class="{ active: isObject(node) }" title="Convert to Object">Object</button>
                <button @click="convertToArray" :class="{ active: Array.isArray(node) }" title="Convert to Array">Array</button>
                <button @click="convertToNumber" :class="{ active: typeof node === 'number' }" title="Convert to Number">Number</button>
                <button @click="convertToString" :class="{ active: typeof node === 'string' }" title="Convert to String" v-if="!Array.isArray(node) && !isObject(node)">String</button>
            </div>
       </td>
      </tr>
      <tr>
        <td>  </td>
        <td v-if="currentPath!=='root'">
         <input  v-model="keyCopy" placeholder="Key" class="key-input" @input="updateKey">
        </td>
        <td v-if="currentPath!=='root'">
           <input v-model="valueCopy" placeholder="Value" class="value-input" @input="updateValue" v-if="!isObject(node) && !Array.isArray(node)">
           <input disabled v-if="!(!isObject(node) && !Array.isArray(node))">
        </td>
      </tr>
      <tr>
        <td></td>
        <td colspan="2">
          <div class="json-node-children" v-if="hasChildren && !isCollapsed">
            <json-node v-for="(childValue, childKey) in node" :key="childKey" :node="childValue" :parent="node" :key-name="childKey" @update="updateChild" @delete="deleteChild" @add="addChildNode"></json-node>
          </div>
        </td>
      </tr>
      
    </table>
    `,
    data() {
        setTimeout(()=>{
            this.isCollapsed=collapseStates[this.currentPath] !== undefined ? collapseStates[this.currentPath] : true
        },10)
        return {
            keyCopy: this.keyName,
            valueCopy: this.isObject(this.node) || Array.isArray(this.node) ? '' : this.node,
            isCollapsed: true
        };
    },
    computed: {
        uniqueId() {
            return this.parent ? `${this.currentPath}-${this.keyName}` : 'root';
        },
        hasChildren() {
            return (this.isObject(this.node) && Object.keys(this.node).length > 0) || (Array.isArray(this.node) && this.node.length > 0);
        },
        currentPath() {
            if (!this.parent) {
                return 'root';
            }
            let path = [];
            let currentNode = this;
            while (currentNode.parent) {
                path.unshift(currentNode.keyCopy);
                currentNode = currentNode.$parent;
            }
            return `root.${path.join('.')}`;
        }
    },
    methods: {
        isObject(value) {
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            collapseStates[this.currentPath] = this.isCollapsed;
        },
        updateKey() {
            if (this.parent && this.keyCopy !== this.keyName) {
                this.$emit('update', this.parent, this.keyName, this.keyCopy, this.node);
            }
        },
        updateValue() {
            if (!this.isObject(this.node) && !Array.isArray(this.node)) {
                let parsedValue = this.valueCopy;
                if (!isNaN(parsedValue) && parsedValue.trim() !== '') {
                    parsedValue = parseFloat(parsedValue);
                }
                this.$emit('update', this.parent, this.keyName, this.keyName, parsedValue);
            }
        },
        updateChild(parent, oldKey, newKey, value) {
            this.$set(parent, newKey, value);
            if (oldKey !== newKey) {
                this.$delete(parent, oldKey);
            }
            this.$emit('update', this.parent, this.keyName, this.keyName, this.node);
        },
        deleteSelf() {
            this.$emit('delete', this.parent, this.keyName);
        },
        deleteChild(parent, key) {
            this.$delete(parent, key);
            this.$emit('update', this.parent, this.keyName, this.keyName, this.node);
        },
        addChild() {
            const newKey = this.generateUniqueKey();
            if (Array.isArray(this.node)) {
                this.node.push('');
            } else if (!this.node[newKey]) {
                this.$set(this.node, newKey, '');
            }
            this.$emit('update', this.parent, this.keyName, this.keyName, this.node);
        },
        addChildNode(parent, key) {
            this.$set(parent, key, {});
            this.$emit('update', this.parent, this.keyName, this.keyName, this.node);
        },
        convertToObject() {
            this.$emit('update', this.parent, this.keyName, this.keyName, {});
        },
        convertToArray() {
            this.$emit('update', this.parent, this.keyName, this.keyName, []);
        },
        convertToString() {
            this.$emit('update', this.parent, this.keyName, this.keyName, '');
        },
        convertToNumber() {
            this.$emit('update', this.parent, this.keyName, this.keyName, 0);
        },
        generateUniqueKey() {
            let index = 1;
            let newKey = `new_key_${index}`;
            while (this.node.hasOwnProperty(newKey)) {
                index++;
                newKey = `new_key_${index}`;
            }
            return newKey;
        },
        copyJsonToClipboard() {
            const jsonString = JSON.stringify(this.node, null, 1);
            navigator.clipboard.writeText(jsonString).then(() => { }).catch(err => {
                console.error('Failed to copy JSON: ', err);
            });
        }
    }
});

LIM.jsonEditor = new JSONTreeEditor('json-editor', { top: '50px', left: '50px' });
LIM.jsonEditor.load();