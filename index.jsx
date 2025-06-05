const root = ReactDOM.createRoot(document.getElementById('root'));

const { createContext, useContext, useState, useEffect } = React;

const DictionaryContext = createContext(); 

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJson = async (pathToFile) => {
            try {
                const res = await fetch(pathToFile);
                if (!res.ok) {
                    throw new Error('Network error (' + res.statusText + ')');
                }
                const data = await res.json();
                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchJson('public/data/LOCAL.json');
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>Error: {error}</h1>
    }

    return (
        <DictionaryProvider initialDict={data}>
            <div>
                {Array.from({length: data.boxes.length}, (_, i) => (
                    <Box key={i} index={i} />
                ))}
            </div>
        </DictionaryProvider>
    );
}

function DictionaryProvider({ initialDict, children }) {
    if (!isJsonSerializable(initialDict)) {
        throw new Error(`invalid intialDict: not JSON serializble`);
    }
    const [dict, setDict] = useState(initialDict);

    const updateDict = (key, value) => {
        setDict(prev => ({
            ...prev,
            [key]: typeof value == 'function'
                ? value(prev[key])
                : value
        }));
    }

    return (
        <DictionaryContext.Provider value={{ dict, updateDict }}>
            {children}
        </DictionaryContext.Provider>
    );
}

function isJsonSerializable(obj) {
    try {
        JSON.stringify(obj);
        return true;
    } catch {
        return false;
    }
}

function Box({ index }) { 
    const { dict, updateDict } = useContext(DictionaryContext);
    const box = dict.boxes[index];


    const updateBox = (key, value) => {
        updateDict('boxes', prevBoxes => (
            prevBoxes.map((prevBox, k) => (
                k == index ? {
                    ...prevBox,
                    [key]: typeof value == 'function'
                        ? value(prevBox[key])
                        : value
                } : prevBox
            ))
        ));
    }

   return (
    <div id={`box-${index}`} className="box-container" style={{left: box.x, top: box.y}}>
        <div className="box-header-container">
            <div className="box-title">{box.title}</div>
            <svg className="box-menu-icon" fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"/>
            </svg>
        </div>
        <hr />
        <div className="box-content-container">
            {Array.from({ length: box.items.length }, (_, k) => (
                <TaskRow key={k} boxIndex={index} taskIndex={k} updateBox={updateBox} />
            ))}
        </div>
        <div className="box-add-task-container">
            <svg className="box-plus-icon" fill="none" 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect fill="none"/>
                <path d="M12 6V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12H18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        </div>
    </div>
   );
}

function TaskRow({ boxIndex, taskIndex, updateBox }) {
    const { dict } = useContext(DictionaryContext);
    const row = dict.boxes[boxIndex].items[taskIndex];

    const updateRow = (key, value) => (
        updateBox('items', (prevItems) => (
            prevItems.map((prevItem, k) => (
                k == taskIndex ? {
                    ...prevItem,
                    [key]: value
                } : prevItem
            ))
        ))
    );

    const handleToggle = () => {
        updateRow('toggle', !row.toggle);
    }

    return (
        <div className="box-task-container">
            <div className="box-check-container">
                <CheckBox isChecked={row.toggle} onToggle={handleToggle} />
            </div>
            <div className="box-task">{row.task}</div>
            <div className="box-cost">{row.cost}</div>
            <div className="box-time">{row.time}</div>
        </div>
    );
}

function CheckBox({ isChecked, onToggle }) {
    return (
        <div
            onClick={onToggle} 
            className={isChecked ? "box-check-on" : "box-check-off"}
        />
    );
}

root.render(<App />);