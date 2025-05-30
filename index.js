class Environment {
    constructor () {
        this.box_surface_id = 'home-boxes-container';
        this.env = null;
        this.box_instances = [];
        this.is_dirty = true;
        this.animationId = null;
        this.run = this.run.bind(this);
    }

    async load(pathToFile) {
        try {
            this.env = await this.#loadJsonFile(pathToFile);
            this.env.boxes.forEach((boxProps, index) => 
                this.box_instances.push(
                    new Box({
                        ...boxProps, 
                        box_id: index,
                        surface_id: this.box_surface_id
                    })
                )
            );
        } catch (error) {
            console.log('Envrionment failed to load. ' + error);
        }
    }

    async #loadJsonFile(pathToFile) {
        try {
            const res = await fetch(pathToFile);
            if (!res.ok) {
                throw new Error('Network error (' + res.statusText + ')');
            }
            return await res.json();
        } catch (err) {
            throw err;
        }
    }

    clear_boxes() {
        const prev_surface = document.getElementById(this.box_surface_id);
        const parent = prev_surface.parentElement;
        prev_surface.remove();
        const new_surface = document.createElement('div');
        new_surface.id = this.box_surface_id;
        parent.appendChild(new_surface);
    }

    mark_dirty() {
        this.is_dirty = true;
    }

    render() {
        this.clear_boxes();
        this.box_instances.forEach(box => (
            box.render()
        ));
        this.is_dirty = false;
    }

    run() {
        if (this.is_dirty) {
            console.log('rendered!');
            this.render();
        }
        this.animationId = requestAnimationFrame(this.run);
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }
}

class Box {
    constructor(props) {
        this.props = {
            ...{
                box_id: 0,
                surface_id: '',
                x: 0,
                y: 0,
                title: '',
                items: []
            }, 
            ...props
        };
    }

    render() {
        if (this.props.surface_id == '') {
            throw new Error("Box instance missing a surface to draw on");
        }
        const surface = document.getElementById(this.props.surface_id);
        const element = document.createElement('div');
        const task_items = this.props.items.map(item => `
            <div class="box-task-container">
                <div class="box-check-container">
                    <div class="box-check"></div>
                </div>
                <div class="box-task">${item.task}</div>
                <div class="box-cost">${item.cost}</div>
                <div class="box-time">${item.time}</div>
            </div>
        `).join('');
        element.id = this.props.box_id;
        element.className = "box-container";
        element.style.left = `${this.props.x}px`;
        element.style.top = `${this.props.y}px`;
        element.innerHTML = `
            <div class="box-header-container">
                <div class="box-title">${this.props.title}</div>
                <svg class="box-menu-icon" fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"/>
                </svg>
            </div>
            <hr>
            <div class="box-content-container">
                ${task_items}
                <div class="box-add-task-container">
                    <svg class="box-plus-icon" fill="none" 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <rect fill="none"/>
                        <path d="M12 6V18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 12H18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                </div>
            </div>
        `;
        surface.append(element);
    }
}

async function main() {
    const env = new Environment();
    await env.load('public/data/LOCAL.json');
    env.render();
}

main()